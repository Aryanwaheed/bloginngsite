CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: RLS policies not strictly needed if we don't expose it to anon clients, 
-- but let's add them to be safe if client-side reading is ever needed.
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to settings" 
  ON public.site_settings FOR SELECT 
  USING (true);

-- Only authenticated users (admins) can modify settings
CREATE POLICY "Allow authenticated full access to settings" 
  ON public.site_settings FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Insert defaults if not exists
INSERT INTO public.site_settings (key, value) VALUES ('ai_api_provider', 'google') ON CONFLICT DO NOTHING;
INSERT INTO public.site_settings (key, value) VALUES ('ai_model', 'gemini-pro') ON CONFLICT DO NOTHING;
