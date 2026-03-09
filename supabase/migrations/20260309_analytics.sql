-- ============================================================
-- Analytics & Visitor Tracking System
-- ============================================================

-- Analytics Sessions: one row per unique visitor session
CREATE TABLE IF NOT EXISTS public.analytics_sessions (
  session_id TEXT PRIMARY KEY,
  country TEXT,
  country_code TEXT,
  user_agent TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INT DEFAULT 0
);

-- Analytics Events: granular event tracking
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  session_id TEXT,
  page TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Page Views: lightweight page tracking
CREATE TABLE IF NOT EXISTS public.analytics_page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast time-range queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_created_at ON public.analytics_page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_last_seen ON public.analytics_sessions(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_country ON public.analytics_sessions(country);

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;

-- Anyone (anonymous or authenticated) can insert tracking data
CREATE POLICY "allow_insert_sessions" ON public.analytics_sessions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_upsert_sessions" ON public.analytics_sessions
  FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "allow_insert_events" ON public.analytics_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_insert_page_views" ON public.analytics_page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only authenticated users (admins) can read analytics
CREATE POLICY "allow_read_sessions" ON public.analytics_sessions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "allow_read_events" ON public.analytics_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "allow_read_page_views" ON public.analytics_page_views
  FOR SELECT TO authenticated USING (true);

-- ============================================================
-- Enable Realtime for active-user tracking
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_sessions;
