-- ============================================================
-- COMPLETE FIX: RLS + Seed for jobs & ai_characters
-- Run this in Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1. Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Office',
  location TEXT,
  salary TEXT,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  job_type TEXT,
  company TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure existing jobs table has the new columns
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS job_type TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company TEXT;

CREATE TABLE IF NOT EXISTS public.ai_characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  country_flag TEXT DEFAULT '🌍',
  tagline TEXT,
  personality_prompt TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_characters ENABLE ROW LEVEL SECURITY;

-- 3. Drop and recreate policies (safe re-run)
DROP POLICY IF EXISTS "public_read_jobs" ON public.jobs;
DROP POLICY IF EXISTS "auth_all_jobs" ON public.jobs;
DROP POLICY IF EXISTS "public_read_characters" ON public.ai_characters;
DROP POLICY IF EXISTS "auth_all_characters" ON public.ai_characters;
-- Legacy policy names
DROP POLICY IF EXISTS "Enable public read access for jobs" ON public.jobs;
DROP POLICY IF EXISTS "Enable all access for authenticated users on jobs" ON public.jobs;
DROP POLICY IF EXISTS "Enable public read access for ai_characters" ON public.ai_characters;
DROP POLICY IF EXISTS "Enable all access for authenticated users on ai_characters" ON public.ai_characters;

-- Public can read all jobs
CREATE POLICY "public_read_jobs" ON public.jobs FOR SELECT USING (true);
-- Authenticated users can do anything to jobs
CREATE POLICY "auth_all_jobs" ON public.jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public can read all characters
CREATE POLICY "public_read_characters" ON public.ai_characters FOR SELECT USING (true);
-- Authenticated users can do anything to characters
CREATE POLICY "auth_all_characters" ON public.ai_characters FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 4. Seed AI Characters (with fixed UUIDs for stable links)
-- ============================================================
INSERT INTO public.ai_characters (id, name, country, country_flag, tagline, personality_prompt, image_url, is_active)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'Sofia', 'Spain', '🇪🇸', 'Your warm Mediterranean companion',
   'You are Sofia, a warm and expressive young woman from Barcelona, Spain. You love art, food, and life. Speak with a friendly, slightly poetic tone and share stories about Spanish culture. Be empathetic and curious about the person you talk to. Keep responses concise (2-3 sentences) and conversational.',
   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', true),

  ('11111111-0000-0000-0000-000000000002', 'Aiko', 'Japan', '🇯🇵', 'Thoughtful and serene Tokyo dreamer',
   'You are Aiko, a thoughtful and calm young woman from Tokyo. You love anime, matcha, and minimalist aesthetics. Speak gently and reflectively, discuss philosophy and Japanese culture. Be mindful and encourage positive thinking. Keep responses concise (2-3 sentences).',
   'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80', true),

  ('11111111-0000-0000-0000-000000000003', 'Marco', 'Italy', '🇮🇹', 'Charming Roman with a passion for life',
   'You are Marco, a charming and confident young man from Rome. You are passionate about food, fashion, football and family. Speak with enthusiasm and warmth, share Italian wisdom. Make everyone feel welcome. Keep responses concise (2-3 sentences).',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', true),

  ('11111111-0000-0000-0000-000000000004', 'Priya', 'India', '🇮🇳', 'Vibrant spirit from Mumbai',
   'You are Priya, a vibrant and intelligent young woman from Mumbai. You love Bollywood, spicy food, and tech startups. Be ambitious, funny, and connected to your culture. Give practical yet heartfelt advice. Keep responses concise (2-3 sentences).',
   'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&q=80', true),

  ('11111111-0000-0000-0000-000000000005', 'Liam', 'UK', '🇬🇧', 'Witty Londoner with dry humor',
   'You are Liam, a witty and sarcastic young man from London. You love football (Arsenal), pub culture and British humor. Be direct but kind, full of dry wit, always ready to debate. Give straightforward advice without sugarcoating. Keep responses concise (2-3 sentences).',
   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', true),

  ('11111111-0000-0000-0000-000000000006', 'Amara', 'Nigeria', '🇳🇬', 'Bright light from Lagos',
   'You are Amara, a bright and energetic young woman from Lagos. You are entrepreneurial, creative, and proud of African culture. You love Afrobeats and inspiring others. Be direct, motivational, and full of life. Keep responses concise (2-3 sentences).',
   'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', true),

  ('11111111-0000-0000-0000-000000000007', 'Carlos', 'Mexico', '🇲🇽', 'Adventurous soul from Guadalajara',
   'You are Carlos, an adventurous and funny young man from Guadalajara. You love tacos, mariachi, and adventure. Be laid-back but passionate, tell great stories and jokes. Celebrate life and encourage others. Keep responses concise (2-3 sentences).',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', true),

  ('11111111-0000-0000-0000-000000000008', 'Yuki', 'South Korea', '🇰🇷', 'K-culture enthusiast from Seoul',
   'You are Yuki, a trendy and optimistic young woman from Seoul. You love K-pop, skincare, K-dramas and cafe culture. Be bubbly, fashion-forward, and support self-care. Keep responses concise (2-3 sentences).',
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', true)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  country_flag = EXCLUDED.country_flag,
  tagline = EXCLUDED.tagline,
  personality_prompt = EXCLUDED.personality_prompt,
  image_url = EXCLUDED.image_url,
  is_active = EXCLUDED.is_active;

-- ============================================================
-- 5. Seed Jobs (12 sample jobs)
-- ============================================================
INSERT INTO public.jobs (title, category, location, salary, description, image_url, is_active, job_type, company)
VALUES
  ('Senior Office Manager', 'Office', 'New York, USA', '$55,000/yr',
   'We are looking for an experienced office manager to oversee daily operations.

Responsibilities:
- Manage administrative staff and coordinate meetings
- Maintain office systems and ensure smooth workflow
- Handle budgeting and vendor relationships
- Oversee facility management and supplies

Requirements:
- 3+ years office management experience
- Strong communication and organizational skills
- Proficiency in MS Office Suite
- Bachelor degree preferred',
   'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', true, 'Full-time', 'ProOffice Solutions'),

  ('Delivery Driver', 'Delivery', 'Los Angeles, CA', '$18/hr',
   'Join our growing delivery team for last-mile deliveries!

Responsibilities:
- Handle deliveries in designated zone
- Maintain vehicle in good condition
- Interact professionally with customers
- Use delivery app for routing

Requirements:
- Valid driver license and clean driving record
- Ability to lift up to 50 lbs
- Smartphone required
- Punctual and reliable',
   'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80', true, 'Part-time', 'FastDeliver Co'),

  ('Professional Caretaker', 'Caretaker', 'Chicago, IL', '$22/hr',
   'Seeking a compassionate caretaker for elderly client in-home support.

Responsibilities:
- Personal care and hygiene assistance
- Medication reminders
- Meal preparation
- Light housekeeping and companionship

Requirements:
- Previous caregiving experience preferred
- CPR certification a plus
- Patient and empathetic personality
- Reliable transportation',
   'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80', true, 'Full-time', 'CareFirst Agency'),

  ('Experienced Nanny', 'Nanny', 'Houston, TX', '$25/hr',
   'Lovely family seeks a caring nanny for 2 children ages 4 and 7.

Responsibilities:
- School pickup and drop-off
- Homework help and enriching activities
- Meal preparation for children
- Light housekeeping related to children

Requirements:
- 2+ years nanny experience
- First aid certified preferred
- Drivers license required
- Patient and nurturing personality',
   'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80', true, 'Full-time', 'Family Direct'),

  ('Professional House Cleaner', 'Cleaning', 'Phoenix, AZ', '$16/hr',
   'Residential cleaning company seeking reliable cleaners for regular client homes.

Responsibilities:
- Follow detailed cleaning checklists
- Use provided eco-friendly cleaning products
- Deliver consistently excellent results
- Communicate with team lead

Requirements:
- Previous cleaning experience preferred
- Reliable transportation
- Attention to detail
- Physical ability to work on feet all day',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', true, 'Part-time', 'CleanPro Services'),

  ('Truck Driver CDL-A', 'Truck Driver', 'Dallas, TX', '$75,000/yr',
   'Regional trucking company hiring CDL-A drivers for OTR routes.

Responsibilities:
- Drive OTR routes across designated regions
- Maintain accurate driver logs (ELD)
- Inspect truck before and after trips
- Deliver freight safely and on time

Requirements:
- Valid CDL-A license
- 2+ years OTR experience
- Clean MVR record
- Ability to work away from home weekly',
   'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80', true, 'Full-time', 'HaulMaster Freight'),

  ('IT Support Specialist', 'Office', 'Seattle, WA', '$48,000/yr',
   'Growing tech company needs IT support specialist to assist employees.

Responsibilities:
- Assist employees with hardware and software issues
- Manage onboarding equipment setup
- Maintain office network and servers
- Provide tier-1 help desk support

Requirements:
- CompTIA A+ or equivalent experience
- Knowledge of Windows and Mac OS
- Strong communication skills
- Problem-solving mindset',
   'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', true, 'Full-time', 'TechFlow Inc'),

  ('Food Delivery Courier', 'Delivery', 'Miami, FL', '$15/hr + tips',
   'Restaurant group hiring bike and car couriers for food delivery.

Responsibilities:
- Deliver food orders across city zones
- Ensure food quality during delivery
- Maintain professional appearance
- Use app for order management

Requirements:
- Smartphone required
- Own reliable transportation (bike or car)
- Ability to work evenings and weekends
- Customer service mindset',
   'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80', true, 'Part-time', 'QuickEats'),

  ('Live-In Caretaker', 'Caretaker', 'Boston, MA', '$28/hr',
   'Family seeking live-in caretaker for elderly parent with mobility limitations.

Responsibilities:
- Personal hygiene assistance
- Medication management and reminders
- Exercise and mobility support
- Companionship and emotional support

Requirements:
- Previous caregiving experience required
- Live-in availability (private room provided)
- Background check required
- CPR certification preferred',
   'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80', true, 'Full-time', 'HomeHeart Care'),

  ('Medical Receptionist', 'Office', 'Denver, CO', '$38,000/yr',
   'Busy medical office seeking friendly and organized receptionist.

Responsibilities:
- Answer phones and schedule patient appointments
- Verify insurance and collect copays
- Greet and check in patients
- Maintain medical records

Requirements:
- EMR software experience preferred
- Strong multitasking in fast-paced environment
- Professional and friendly demeanor
- Medical terminology knowledge a plus',
   'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80', true, 'Full-time', 'Denver Medical Group'),

  ('Long Haul Trucker', 'Truck Driver', 'Nashville, TN', '$85,000/yr',
   'Established freight company seeking experienced long-haul CDL-A drivers.

Responsibilities:
- Long-haul freight routes (home every 2 weeks)
- ELD log compliance
- Pre/post trip vehicle inspections
- Customer freight handling

Requirements:
- CDL-A license required
- 2+ years long haul experience
- Clean MVR and safety record
- TeamWork attitude',
   'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80', true, 'Full-time', 'NashFreight LLC'),

  ('Childcare Nanny', 'Nanny', 'San Francisco, CA', '$30/hr',
   'Young professional couple seeking experienced nanny for baby and toddler.

Responsibilities:
- Full-time care for 8-month and 3-year-old
- Diaper changes, feeding, and nap schedules
- Age-appropriate developmental activities
- Light meal preparation

Requirements:
- Infant and toddler experience required
- CPR and first aid certified
- References from previous families
- Non-smoker household',
   'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80', true, 'Full-time', 'SF Family')

ON CONFLICT DO NOTHING;
