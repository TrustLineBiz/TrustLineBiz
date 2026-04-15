import { useState } from 'react';
import client from '../api/client';

export default function Settings() {
  const [pushStatus, setPushStatus] = useState('idle');
  const [vapidKey] = useState(import.meta.env.VITE_VAPID_PUBLIC_KEY || '');

  async function subscribePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push not supported in this browser');
      return;
    }
    if (!vapidKey) {
      alert('VITE_VAPID_PUBLIC_KEY not set in client .env');
      return;
    }

    setPushStatus('subscribing');
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      const { endpoint, keys } = sub.toJSON();
      await client.post('/push/subscribe', { endpoint, keys });
      setPushStatus('subscribed');
    } catch (err) {
      console.error(err);
      setPushStatus('error');
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold text-white mb-6">Settings</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Push Notifications</h2>
        <p className="text-gray-400 text-sm mb-4">
          Enable push notifications to get alerted when new leads come in.
        </p>
        <button
          onClick={subscribePush}
          disabled={pushStatus === 'subscribed' || pushStatus === 'subscribing'}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {pushStatus === 'subscribed' ? 'Subscribed' :
           pushStatus === 'subscribing' ? 'Subscribing...' :
           pushStatus === 'error' ? 'Error — try again' :
           'Enable Push Notifications'}
        </button>
      </div>
    </div>
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
