/*
  # Fix RLS Security for Conversations Table

  1. Changes
    - Drop existing overly permissive RLS policies that use `WITH CHECK (true)` and `USING (true)`
    - Create secure INSERT policy with data validation constraints
    - Remove SELECT access for anonymous users (not needed for public chatbot)
    - Add SELECT policy only for authenticated users (for admin/analytics purposes)
    - Add constraints to ensure data quality

  2. Security Improvements
    - INSERT policy validates message length and content
    - Anonymous users cannot read conversation data
    - Only authenticated users can view conversations for analytics
    - Prevents abuse by enforcing reasonable data constraints
*/

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Anyone can insert conversations" ON conversations;
DROP POLICY IF EXISTS "Anyone can read conversations" ON conversations;

-- Add data validation constraints
DO $$ 
BEGIN
  -- Add constraint to ensure messages are not empty
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversations_user_message_not_empty' 
    AND table_name = 'conversations'
  ) THEN
    ALTER TABLE conversations ADD CONSTRAINT conversations_user_message_not_empty 
      CHECK (length(trim(user_message)) > 0 AND length(user_message) <= 5000);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversations_bot_message_not_empty' 
    AND table_name = 'conversations'
  ) THEN
    ALTER TABLE conversations ADD CONSTRAINT conversations_bot_message_not_empty 
      CHECK (length(trim(bot_message)) > 0 AND length(bot_message) <= 10000);
  END IF;
END $$;

-- Secure INSERT policy: Allow public to insert with validation
CREATE POLICY "Public can insert valid conversations"
  ON conversations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    conversation_id IS NOT NULL
    AND length(trim(user_message)) > 0 
    AND length(user_message) <= 5000
    AND length(trim(bot_message)) > 0 
    AND length(bot_message) <= 10000
  );

-- Secure SELECT policy: Only authenticated users can read (for analytics/admin)
CREATE POLICY "Authenticated users can read conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (true);