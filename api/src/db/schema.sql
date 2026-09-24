CREATE TABLE IF NOT EXISTS usage_events (
  id BIGSERIAL PRIMARY KEY,
  occurred_at TIMESTAMPTZ NOT NULL,
  model TEXT NOT NULL,
  provider TEXT NOT NULL,
  feature TEXT NOT NULL,
  environment TEXT NOT NULL,
  tokens_in INTEGER NOT NULL,
  tokens_out INTEGER NOT NULL,
  cost_usd NUMERIC(12, 6) NOT NULL,
  latency_ms INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error'))
);

CREATE INDEX IF NOT EXISTS usage_events_occurred_at_idx
  ON usage_events (occurred_at);
