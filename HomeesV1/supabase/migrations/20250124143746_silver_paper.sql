/*
 # Create properties and interventions tables
 
 1. New Tables
 - `properties`
 - `id` (uuid, primary key)
 - `created_at` (timestamp)
 - `title` (text)
 - `address` (text)
 - `type` (text)
 - `status` (text)
 - `user_id` (uuid, foreign key)
 
 - `interventions`
 - `id` (uuid, primary key)
 - `created_at` (timestamp)
 - `title` (text)
 - `description` (text)
 - `status` (text)
 - `date` (timestamp)
 - `property_id` (uuid, foreign key)
 - `user_id` (uuid, foreign key)
 
 2. Security
 - Enable RLS on both tables
 - Add policies for authenticated users
 */
-- Create properties table
CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  address text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  user_id uuid REFERENCES auth.users(id) NOT NULL
);
-- Create interventions table
CREATE TABLE interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  date timestamptz NOT NULL,
  property_id uuid REFERENCES properties(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL
);
-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
-- Create policies for properties
CREATE POLICY "Users can view own properties" ON properties FOR
SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own properties" ON properties FOR
INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own properties" ON properties FOR
UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own properties" ON properties FOR DELETE TO authenticated USING (auth.uid() = user_id);
-- Create policies for interventions
CREATE POLICY "Users can view own interventions" ON interventions FOR
SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interventions" ON interventions FOR
INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interventions" ON interventions FOR
UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own interventions" ON interventions FOR DELETE TO authenticated USING (auth.uid() = user_id);