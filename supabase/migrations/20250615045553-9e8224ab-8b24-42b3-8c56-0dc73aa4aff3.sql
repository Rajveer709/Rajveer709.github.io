
-- 1. Create a storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Add avatar_url column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. Enable Row Level Security on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Set up RLS policies for the profiles table
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Set up RLS policies for the avatars bucket
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Authenticated users can upload an avatar." ON storage.objects;
CREATE POLICY "Authenticated users can upload an avatar."
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'avatars' AND auth.uid() = owner );
  
DROP POLICY IF EXISTS "Authenticated users can update their own avatar." ON storage.objects;
CREATE POLICY "Authenticated users can update their own avatar."
  ON storage.objects FOR UPDATE
  TO authenticated
  USING ( auth.uid() = owner );
  
DROP POLICY IF EXISTS "Authenticated users can delete their own avatar." ON storage.objects;
CREATE POLICY "Authenticated users can delete their own avatar."
  ON storage.objects FOR DELETE
  TO authenticated
  USING ( auth.uid() = owner );
