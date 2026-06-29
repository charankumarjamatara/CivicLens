-- CivicLens AI Supabase Database Schema
-- Paste this script directly into the Supabase SQL Editor (SQL Web Console) to set up your tables, triggers, and functions.

-- 1. ENABLE EXTENSIONS (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE PROFILES TABLE (Mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar TEXT,
    address TEXT,
    civic_score INTEGER DEFAULT 0,
    rank TEXT DEFAULT 'Newcomer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY, -- We use text-based IDs (e.g., report-178264...) for consistency with app.js
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT,
    severity TEXT,
    department TEXT,
    confidence DOUBLE PRECISION,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status TEXT DEFAULT 'Open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.verifications (
    id TEXT PRIMARY KEY,
    report_id TEXT REFERENCES public.reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    verification_type TEXT NOT NULL, -- e.g., 'support' or 'verify'
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (report_id, user_id)
);

-- 5. CREATE COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id TEXT PRIMARY KEY,
    report_id TEXT REFERENCES public.reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CREATE NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CREATE INCREMENT_SCORE FUNCTION (RPC)
-- This allows client code to securely increase user reputation points.
CREATE OR REPLACE FUNCTION increment_score(user_id UUID, points INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET civic_score = civic_score + points,
        rank = CASE 
            WHEN (civic_score + points) >= 500 THEN 'Community Hero'
            WHEN (civic_score + points) >= 200 THEN 'Civic Champion'
            ELSE 'Active Citizen'
        END
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. CREATE AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- Automatically creates a profile record when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, civic_score, rank)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    0,
    'Newcomer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. ENABLE ROW LEVEL SECURITY (RLS)
-- During development / hackathon submission, you can temporarily DISABLE RLS to make testing easier:
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
