CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status VARCHAR(32) NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'closed')),
  priority VARCHAR(32) NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets (status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets (priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets (created_at DESC);
