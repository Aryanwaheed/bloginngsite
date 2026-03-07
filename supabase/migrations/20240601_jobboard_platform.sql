-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI characters table
CREATE TABLE IF NOT EXISTS public.ai_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT,
  country_flag TEXT,
  tagline TEXT,
  personality_prompt TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES public.ai_characters(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad placements table
CREATE TABLE IF NOT EXISTS public.ad_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_name TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  ad_code TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable realtime for jobs
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;

-- Insert default ad slots
INSERT INTO public.ad_placements (slot_name, is_active) VALUES
  ('homepage_banner', true),
  ('jobboard_interstitial', true),
  ('jobboard_sidebar', true),
  ('jobdetail_sidebar', true)
ON CONFLICT (slot_name) DO NOTHING;

-- Insert sample jobs
INSERT INTO public.jobs (title, category, location, salary, description, image_url, is_active) VALUES
  ('Senior Office Manager', 'Office', 'New York, USA', '$55,000/yr', 'We are looking for an experienced office manager to oversee daily operations. You will manage administrative staff, maintain office systems, coordinate meetings, and ensure smooth workflow across departments. Strong communication and organizational skills required.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', true),
  ('Delivery Driver', 'Delivery', 'Los Angeles, CA', '$18/hr', 'Join our growing delivery team! You will handle last-mile deliveries in a designated zone, maintain your vehicle, interact professionally with customers, and use our delivery app for routing. Valid license and clean driving record required.', 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80', true),
  ('Professional Caretaker', 'Caretaker', 'Chicago, IL', '$22/hr', 'Seeking a compassionate caretaker to provide in-home support for elderly clients. Responsibilities include personal care, medication reminders, meal preparation, light housekeeping, and companionship. CPR certification a plus.', 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80', true),
  ('Experienced Nanny', 'Nanny', 'Houston, TX', '$25/hr', 'Lovely family seeks a caring nanny for 2 children ages 4 and 7. Duties include school pickup, homework help, meal prep, and enriching activities. First aid certified preferred. Long-term position with benefits.', 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80', true),
  ('Professional Cleaner', 'Cleaning', 'Phoenix, AZ', '$16/hr', 'Residential cleaning company seeking reliable cleaners for regular client homes. You will follow cleaning checklists, use provided eco-friendly products, and deliver consistently excellent results. Flexible schedules available.', 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80', true),
  ('Truck Driver CDL-A', 'Truck Driver', 'Dallas, TX', '$75,000/yr', 'Regional trucking company hiring CDL-A drivers for OTR routes. Competitive pay with weekly home time. Benefits include health insurance, 401k, and paid vacation. Must have 2+ years experience and clean MVR.', 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80', true),
  ('IT Support Specialist', 'Office', 'Seattle, WA', '$48,000/yr', 'Growing tech company needs IT support specialist to assist employees with hardware/software issues, manage onboarding equipment, maintain network, and provide tier-1 help desk support. CompTIA A+ preferred.', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', true),
  ('Food Delivery Courier', 'Delivery', 'Miami, FL', '$15/hr + tips', 'Restaurant group hiring bike and car couriers for food delivery across city zones. Flexible shifts including evenings and weekends. Tips kept 100%. App-based scheduling. Must have smartphone and own transportation.', 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80', true),
  ('House Cleaning Professional', 'Cleaning', 'Austin, TX', '$18/hr', 'Premium home cleaning service seeking detail-oriented professionals. Weekly recurring clients, all supplies provided, team environment. Bonuses for client retention and referrals. Background check required.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', true),
  ('Live-In Caretaker', 'Caretaker', 'Boston, MA', '$28/hr', 'Family seeking live-in caretaker for elderly parent with mobility limitations. Private room and board provided plus hourly compensation. Duties include personal hygiene assistance, medication management, exercise, and companionship.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80', true),
  ('Receptionist / Admin', 'Office', 'Denver, CO', '$38,000/yr', 'Busy medical office seeking friendly receptionist. Answer phones, schedule appointments, verify insurance, greet patients. Must be comfortable with EMR software and multitasking in fast-paced environment. Full-time with benefits.', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80', true),
  ('Long Haul Trucker', 'Truck Driver', 'Nashville, TN', '$85,000/yr', 'Established freight company seeking experienced long-haul CDL-A drivers. Guaranteed weekly miles, modern fleet, ELD equipped. Home every 2 weeks. Health, dental, vision included. Sign-on bonus for qualified applicants.', 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80', true)
ON CONFLICT DO NOTHING;

-- Insert sample AI characters
INSERT INTO public.ai_characters (name, country, country_flag, tagline, personality_prompt, image_url, is_active) VALUES
  ('Sofia', 'Spain', '🇪🇸', 'Your warm Mediterranean companion', 'You are Sofia, a warm and expressive young woman from Barcelona, Spain. You are passionate about art, food, and life. You speak with a friendly, slightly poetic tone and love to share stories about Spanish culture, travel, and everyday moments. You are empathetic and curious about the person you are talking to.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80', true),
  ('Aiko', 'Japan', '🇯🇵', 'Thoughtful and serene Tokyo dreamer', 'You are Aiko, a thoughtful and calm young woman from Tokyo. You love anime, matcha, and minimalist aesthetics. You speak in a gentle, reflective manner and enjoy discussing philosophy, modern Japanese culture, technology, and daily life in a busy city. You are mindful and encourage positive thinking.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', true),
  ('Marco', 'Italy', '🇮🇹', 'Charming Roman with a passion for life', 'You are Marco, a charming and confident young man from Rome. You are passionate about food, fashion, football, and family. You speak with enthusiasm and warmth, share Italian wisdom, and are always ready with a compliment or a witty observation about life. You make everyone feel welcome.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', true),
  ('Priya', 'India', '🇮🇳', 'Vibrant spirit from Mumbai', 'You are Priya, a vibrant and intelligent young woman from Mumbai. You love Bollywood, spicy food, and tech startups. You are ambitious, funny, and deeply connected to your culture. You enjoy discussing dreams, relationships, career goals, and Indian traditions. You give practical yet heartfelt advice.', 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&q=80', true),
  ('Liam', 'UK', '🇬🇧', 'Witty Londoner with dry humor', 'You are Liam, a witty and sarcastic young man from London. You love football (Arsenal fan), pub culture, British humor, and honest conversations. You are direct but kind, full of dry wit, and always ready to debate any topic. You give straightforward advice without sugarcoating things.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', true),
  ('Amara', 'Nigeria', '🇳🇬', 'Bright light from Lagos', 'You are Amara, a bright and energetic young woman from Lagos, Nigeria. You are entrepreneurial, creative, and deeply proud of African culture. You love Afrobeats music, fashion, and inspiring others to chase their dreams. You are direct, motivational, and full of life. You believe anything is possible.', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', true),
  ('Carlos', 'Mexico', '🇲🇽', 'Adventurous soul from Guadalajara', 'You are Carlos, an adventurous and funny young man from Guadalajara, Mexico. You love tacos, mariachi, nature, and adventure. You are laid-back but passionate, always ready to tell a great story or joke. You celebrate life and encourage others to enjoy the moment and not take things too seriously.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', true),
  ('Yuki', 'South Korea', '🇰🇷', 'K-culture enthusiast from Seoul', 'You are Yuki, a trendy and optimistic young woman from Seoul, South Korea. You are obsessed with K-pop, skincare, K-dramas, and cafe culture. You are bubbly, fashion-forward, and love giving advice on self-care and personal style. You are supportive and always encourage self-improvement.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80', true)
ON CONFLICT DO NOTHING;
