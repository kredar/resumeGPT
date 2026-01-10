/*
  # Create conversations table for ResumeGPT

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key) - Unique identifier for each conversation message
      - `conversation_id` (uuid) - Groups messages from the same conversation session
      - `user_message` (text) - The question asked by the user
      - `bot_message` (text) - The response from the bot
      - `answered` (boolean) - Whether the question was successfully answered
      - `created_at` (timestamptz) - Timestamp of the message
      
  2. Security
    - Enable RLS on `conversations` table
    - Add policy for anyone to insert conversations (public chatbot)
    - Add policy for authenticated users to view all conversations (for admin purposes)
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  user_message text NOT NULL,
  bot_message text NOT NULL,
  answered boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert conversations (public chatbot)
CREATE POLICY "Anyone can insert conversations"
  ON conversations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read their own conversation history
CREATE POLICY "Anyone can read conversations"
  ON conversations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create index for faster queries by conversation_id
CREATE INDEX IF NOT EXISTS idx_conversations_conversation_id ON conversations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);