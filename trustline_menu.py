#!/usr/bin/env python3
"""TrustLine menu bar app — macOS tray tool for site management."""

import json
import os
import re
import subprocess
import threading
import time
import webbrowser
from pathlib import Path

import rumps

PROJECT_DIR = Path("/Users/jackmcgrath/trustlinebiz")
SETTINGS_FILE = PROJECT_DIR / ".tl_settings.json"
INDEX_HTML = PROJECT_DIR / "index.html"
DEPLOY_SCRIPT = PROJECT_DIR / "deploy.sh"

DEFAULT_SETTINGS = {
    "auto_deploy": False,
    "scheduling_modal": False,
    "sms_prechecked": False,
    "maintenance_mode": False,
}


def load_settings():
    if SETTINGS_FILE.exists():
        try:
            with open(SETTINGS_FILE) as f:
                data = json.load(f)
                return {**DEFAULT_SETTINGS, **data}
        except Exception:
            pass
    return dict(DEFAULT_SETTINGS)


def save_settings(settings):
    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f, indent=2)


def notify(title, message):
    script = f'display notification "{message}" with title "{title}"'
    subprocess.run(["osascript", "-e", script], capture_output=True)


def run_deploy():
    try:
        result = subprocess.run(
            ["/bin/bash", str(DEPLOY_SCRIPT)],
            capture_output=True,
            text=True,
            cwd=str(PROJECT_DIR),
        )
        if result.returncode == 0:
            notify("TrustLine Deploy", "Deployed successfully")
        else:
            notify("TrustLine Deploy", f"Deploy FAILED: {result.stderr.strip()[:80]}")
    except Exception as e:
        notify("TrustLine Deploy", f"Deploy error: {e}")


class FileWatcher(threading.Thread):
    def __init__(self, deploy_fn, debounce=5):
        super().__init__(daemon=True)
        self.deploy_fn = deploy_fn
        self.debounce = debounce
        self._stop_event = threading.Event()
        self._last_mtimes = {}
        self._pending = False
        self._pending_timer = None

    def stop(self):
        self._stop_event.set()

    def _scan(self):
        changed = False
        for ext in ("*.html", "*.css", "*.js"):
            for f in PROJECT_DIR.rglob(ext):
                try:
                    mt = f.stat().st_mtime
                    if self._last_mtimes.get(str(f)) != mt:
                        if str(f) in self._last_mtimes:
                            changed = True
                        self._last_mtimes[str(f)] = mt
                except OSError:
                    pass
        return changed

    def run(self):
        # prime mtimes
        self._scan()
        while not self._stop_event.is_set():
            if self._scan():
                if self._pending_timer:
                    self._pending_timer.cancel()
                self._pending_timer = threading.Timer(self.debounce, self.deploy_fn)
                self._pending_timer.start()
            time.sleep(1)


class TrustLineApp(rumps.App):
    def __init__(self):
        self.settings = load_settings()
        self._watcher = None

        super().__init__("TL", quit_button=None)

        self.auto_deploy_item = rumps.MenuItem("Auto-Deploy", callback=self.toggle_auto_deploy)
        self.deploy_now_item = rumps.MenuItem("🚀 Deploy Now", callback=self.deploy_now)
        self.scheduling_item = rumps.MenuItem("Scheduling Modal", callback=self.toggle_scheduling)
        self.sms_item = rumps.MenuItem("SMS Pre-checked", callback=self.toggle_sms)
        self.maintenance_item = rumps.MenuItem("Maintenance Mode", callback=self.toggle_maintenance)
        self.live_site_item = rumps.MenuItem("🌐 Live Site", callback=self.open_live_site)
        self.folder_item = rumps.MenuItem("📁 Project Folder", callback=self.open_folder)
        self.cloudflare_item = rumps.MenuItem("☁️ Cloudflare", callback=self.open_cloudflare)
        self.quit_item = rumps.MenuItem("Quit", callback=self.quit_app)

        self.menu = [
            self.auto_deploy_item,
            self.deploy_now_item,
            None,
            self.scheduling_item,
            self.sms_item,
            self.maintenance_item,
            None,
            self.live_site_item,
            self.folder_item,
            self.cloudflare_item,
            None,
            self.quit_item,
        ]

        self._refresh_labels()

        if self.settings["auto_deploy"]:
            self._start_watcher()

    def _refresh_labels(self):
        s = self.settings
        self.auto_deploy_item.title = f"{'✅' if s['auto_deploy'] else '⬜'} Auto-Deploy"
        self.scheduling_item.title = f"{'✅' if s['scheduling_modal'] else '⬜'} Scheduling Modal"
        self.sms_item.title = f"{'✅' if s['sms_prechecked'] else '⬜'} SMS Pre-checked"
        self.maintenance_item.title = f"{'✅' if s['maintenance_mode'] else '⬜'} Maintenance Mode"

    def _start_watcher(self):
        if self._watcher and self._watcher.is_alive():
            return
        self._watcher = FileWatcher(deploy_fn=lambda: threading.Thread(target=run_deploy, daemon=True).start())
        self._watcher.start()

    def _stop_watcher(self):
        if self._watcher:
            self._watcher.stop()
            self._watcher = None

    def toggle_auto_deploy(self, _):
        self.settings["auto_deploy"] = not self.settings["auto_deploy"]
        save_settings(self.settings)
        self._refresh_labels()
        if self.settings["auto_deploy"]:
            self._start_watcher()
        else:
            self._stop_watcher()

    def deploy_now(self, _):
        threading.Thread(target=run_deploy, daemon=True).start()

    def toggle_scheduling(self, _):
        self.settings["scheduling_modal"] = not self.settings["scheduling_modal"]
        save_settings(self.settings)
        self._refresh_labels()

    def toggle_sms(self, _):
        self.settings["sms_prechecked"] = not self.settings["sms_prechecked"]
        save_settings(self.settings)
        self._refresh_labels()
        self._patch_sms_checkbox(self.settings["sms_prechecked"])

    def _patch_sms_checkbox(self, enable):
        if not INDEX_HTML.exists():
            return
        html = INDEX_HTML.read_text(encoding="utf-8")
        # Find <input ... id="smsConsent" ...>
        if enable:
            # Add checked if not present
            html = re.sub(
                r'(<input[^>]*id=["\']smsConsent["\'][^>]*?)(\s*/?>)',
                lambda m: m.group(1) + (" checked" if "checked" not in m.group(1) else "") + m.group(2),
                html,
            )
        else:
            # Remove checked attribute
            html = re.sub(
                r'(<input[^>]*id=["\']smsConsent["\'][^>]*?)\s+checked([^>]*?>)',
                r'\1\2',
                html,
            )
        INDEX_HTML.write_text(html, encoding="utf-8")

    def toggle_maintenance(self, _):
        self.settings["maintenance_mode"] = not self.settings["maintenance_mode"]
        save_settings(self.settings)
        self._refresh_labels()

    def open_live_site(self, _):
        webbrowser.open("https://trustlinebiz.com")

    def open_folder(self, _):
        subprocess.run(["open", str(PROJECT_DIR)])

    def open_cloudflare(self, _):
        webbrowser.open("https://dash.cloudflare.com")

    def quit_app(self, _):
        self._stop_watcher()
        rumps.quit_application()


if __name__ == "__main__":
    TrustLineApp().run()
