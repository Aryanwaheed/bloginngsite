-- ============================================================
-- FIX: Analytics Permissions & RLS
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- Ensure the tables exist (though they should)
CREATE TABLE IF NOT EXISTS public.analytics_sessions (
  session_id TEXT PRIMARY KEY,
  ip_address TEXT,
  country TEXT,
  country_code TEXT,
  user_agent TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INT DEFAULT 0
);

-- Ensure column exists if table was already created
ALTER TABLE public.analytics_sessions ADD COLUMN IF NOT EXISTS ip_address TEXT;
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_ip ON public.analytics_sessions(ip_address);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  session_id TEXT,
  page TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "allow_insert_sessions" ON public.analytics_sessions;
DROP POLICY IF EXISTS "allow_upsert_sessions" ON public.analytics_sessions;
DROP POLICY IF EXISTS "allow_read_sessions" ON public.analytics_sessions;
DROP POLICY IF EXISTS "allow_read_sessions_anon" ON public.analytics_sessions;
DROP POLICY IF EXISTS "allow_read_sessions_auth" ON public.analytics_sessions;
DROP POLICY IF EXISTS "allow_insert_events" ON public.analytics_events;
DROP POLICY IF EXISTS "allow_read_events" ON public.analytics_events;
DROP POLICY IF EXISTS "allow_insert_page_views" ON public.analytics_page_views;
DROP POLICY IF EXISTS "allow_read_page_views" ON public.analytics_page_views;

-- 1. ANALYTICS_SESSIONS: Anyone (anon/auth) can insert and update
CREATE POLICY "allow_insert_sessions" ON public.analytics_sessions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_upsert_sessions" ON public.analytics_sessions
  FOR UPDATE TO anon, authenticated USING (true);

-- CRITICAL: Allow anon to SELECT their own/any sessions to support upsert check (hidden detail of PostgREST)
CREATE POLICY "allow_read_sessions_anon" ON public.analytics_sessions
  FOR SELECT TO anon USING (true);

CREATE POLICY "allow_read_sessions_auth" ON public.analytics_sessions
  FOR SELECT TO authenticated USING (true);

-- 2. ANALYTICS_EVENTS: Anyone can insert, only authenticated can read
CREATE POLICY "allow_insert_events" ON public.analytics_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_read_events" ON public.analytics_events
  FOR SELECT TO authenticated USING (true);

-- 3. ANALYTICS_PAGE_VIEWS: Anyone can insert, only authenticated can read
CREATE POLICY "allow_insert_page_views" ON public.analytics_page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_read_page_views" ON public.analytics_page_views
  FOR SELECT TO authenticated USING (true);

-- Grant schema usage just in case
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.analytics_sessions TO anon, authenticated;
GRANT ALL ON TABLE public.analytics_events TO anon, authenticated;
GRANT ALL ON TABLE public.analytics_page_views TO anon, authenticated;

-- Ensure Realtime is enabled for active users
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_sessions;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- ignore if already added
END $$;
