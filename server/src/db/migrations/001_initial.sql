-- TrustLine Sales App — Initial Schema

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'rep',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- LEADS
CREATE TABLE IF NOT EXISTS leads (
  id                    SERIAL PRIMARY KEY,
  name                  TEXT NOT NULL,
  business_name         TEXT,
  phone                 TEXT,
  email                 TEXT,
  credit_score_range    TEXT,
  credit_score_exact    INTEGER,
  monthly_revenue       NUMERIC(12,2),
  funding_amount_needed NUMERIC(12,2),
  preferred_call_time   TEXT,
  contact_preference    TEXT,
  utm_source            TEXT,
  utm_medium            TEXT,
  utm_campaign          TEXT,
  utm_content           TEXT,
  stage                 TEXT NOT NULL DEFAULT 'new',
  qualification_status  TEXT NOT NULL DEFAULT 'pending',
  disqualify_reason     TEXT,
  assigned_to           INTEGER REFERENCES users(id),
  last_contact_date     TIMESTAMPTZ,
  follow_up_day         INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- NOTES
CREATE TABLE IF NOT EXISTS notes (
  id         SERIAL PRIMARY KEY,
  lead_id    INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id    INTEGER REFERENCES users(id),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id           SERIAL PRIMARY KEY,
  lead_id      INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  user_id      INTEGER REFERENCES users(id),
  title        TEXT NOT NULL,
  due_at       TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- FOLLOW_UP_SEQUENCES (scaffold for V2)
CREATE TABLE IF NOT EXISTS follow_up_sequences (
  id           SERIAL PRIMARY KEY,
  lead_id      INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  day_number   INTEGER NOT NULL,
  channel      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at      TIMESTAMPTZ,
  content      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES (scaffold for V2)
CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  lead_id    INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id    INTEGER REFERENCES users(id),
  direction  TEXT NOT NULL,
  channel    TEXT NOT NULL,
  content    TEXT NOT NULL,
  sent_at    TIMESTAMPTZ DEFAULT NOW()
);

-- LENDERS
CREATE TABLE IF NOT EXISTS lenders (
  id                  SERIAL PRIMARY KEY,
  name                TEXT NOT NULL,
  min_credit_score    INTEGER,
  min_monthly_revenue NUMERIC(12,2),
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- LEAD_LENDERS
CREATE TABLE IF NOT EXISTS lead_lenders (
  id         SERIAL PRIMARY KEY,
  lead_id    INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  lender_id  INTEGER NOT NULL REFERENCES lenders(id),
  status     TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LEAD_DOCUMENTS
CREATE TABLE IF NOT EXISTS lead_documents (
  id          SERIAL PRIMARY KEY,
  lead_id     INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  doc_type    TEXT NOT NULL,
  uploaded    BOOLEAN DEFAULT FALSE,
  file_path   TEXT,
  uploaded_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- LEAD_EVENTS
CREATE TABLE IF NOT EXISTS lead_events (
  id         SERIAL PRIMARY KEY,
  lead_id    INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id    INTEGER REFERENCES users(id),
  event_type TEXT NOT NULL,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PUSH_SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint   TEXT NOT NULL UNIQUE,
  keys       JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AD_METRICS (scaffold for V2)
CREATE TABLE IF NOT EXISTS ad_metrics (
  id            SERIAL PRIMARY KEY,
  campaign_id   TEXT NOT NULL,
  campaign_name TEXT,
  date          DATE NOT NULL,
  spend         NUMERIC(10,2),
  impressions   INTEGER,
  clicks        INTEGER,
  leads         INTEGER,
  fetched_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, date)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON leads(utm_source);
CREATE INDEX IF NOT EXISTS idx_tasks_due_at ON tasks(due_at);
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON lead_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_notes_lead_id ON notes(lead_id);
