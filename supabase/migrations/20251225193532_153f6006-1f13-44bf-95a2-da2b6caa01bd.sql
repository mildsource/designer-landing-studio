-- Fix security issue 1: Require authentication for INSERT on scheduled_calls
-- Fix security issue 3: Allow public SELECT for availability checking

-- Drop the insecure INSERT policy
DROP POLICY IF EXISTS "Anyone can create scheduled calls" ON public.scheduled_calls;

-- Create secure INSERT policy requiring authentication
CREATE POLICY "Authenticated users can create scheduled calls"
ON public.scheduled_calls FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Add public read policy for availability calendar (only scheduled_date and scheduled_time are queried)
CREATE POLICY "Anyone can view booking availability"
ON public.scheduled_calls FOR SELECT
USING (true);

-- Drop the old select policy since the new one is more permissive
DROP POLICY IF EXISTS "Users can view their own scheduled calls" ON public.scheduled_calls;

-- Create contact_messages table for storing contact form submissions
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert contact messages
CREATE POLICY "Authenticated users can submit contact messages"
ON public.contact_messages FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);