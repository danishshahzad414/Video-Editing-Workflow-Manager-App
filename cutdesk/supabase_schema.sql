-- ============================================================
-- CutDesk — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('counselor', 'editor', 'social_manager', 'ceo')),
  avatar_url TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VIDEOS
-- ============================================================
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  date_recorded DATE,
  notes_for_editor TEXT,
  counselor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Raw Uploaded',
  priority TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Urgent', 'Normal', 'Low')),
  drive_url TEXT,
  edited_drive_url TEXT,
  script_file_url TEXT,
  script_id UUID,
  thumbnail_url TEXT,
  actual_edit_time_minutes INTEGER,
  estimated_completion_date DATE,
  revision_rounds INTEGER DEFAULT 0,
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  script_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PUBLISHING DETAILS
-- ============================================================
CREATE TABLE IF NOT EXISTS publishing_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  platforms TEXT[],
  captions JSONB,
  hashtags TEXT[],
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  post_urls JSONB,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- POST PERFORMANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS post_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  published_date DATE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- ============================================================
-- EDITOR NOTE TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS editor_note_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SCRIPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT,
  target_platforms TEXT[],
  target_duration TEXT,
  body TEXT NOT NULL,
  recording_notes TEXT,
  priority TEXT DEFAULT 'Normal' CHECK (priority IN ('Urgent', 'Normal', 'Low')),
  deadline DATE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Assigned', 'In Progress', 'Recorded', 'Archived'))
);

-- ============================================================
-- SCRIPT ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS script_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'Assigned' CHECK (status IN ('Assigned', 'Acknowledged', 'Recording', 'Submitted', 'Done')),
  counselor_notes TEXT,
  submitted_video_id UUID REFERENCES videos(id) ON DELETE SET NULL
);

-- ============================================================
-- VIDEO REPURPOSE PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS video_repurpose_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  format_type TEXT NOT NULL CHECK (format_type IN ('Full Video', 'Short Clip', 'Teaser')),
  status TEXT DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Done')),
  notes TEXT,
  completed_at TIMESTAMPTZ,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USER NOTIFICATION PREFERENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  email_notifications JSONB DEFAULT '{"status_change": true, "editor_comment": true, "published": true}'::jsonb,
  whatsapp_notifications JSONB DEFAULT '{"revision_requested": false}'::jsonb,
  email_address TEXT,
  whatsapp_number TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE editor_note_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_repurpose_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- PROFILES policies
CREATE POLICY "profiles_read_all" ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "profiles_write_own" ON profiles FOR ALL USING (id = auth.uid());

-- VIDEOS policies
CREATE POLICY "videos_select" ON videos FOR SELECT USING (
  get_user_role() IN ('editor', 'ceo') OR
  (get_user_role() = 'counselor' AND counselor_id = auth.uid()) OR
  (get_user_role() = 'social_manager' AND status IN ('Editing Complete', 'Pending Social Review', 'Scheduled', 'Published'))
);
CREATE POLICY "videos_insert_counselor" ON videos FOR INSERT WITH CHECK (
  get_user_role() = 'counselor' AND counselor_id = auth.uid()
);
CREATE POLICY "videos_update_editor" ON videos FOR UPDATE USING (get_user_role() IN ('editor', 'social_manager'));
CREATE POLICY "videos_update_counselor" ON videos FOR UPDATE USING (
  get_user_role() = 'counselor' AND counselor_id = auth.uid()
);

-- ACTIVITY LOG policies
CREATE POLICY "activity_log_select" ON activity_log FOR SELECT USING (get_user_role() IN ('editor', 'ceo'));
CREATE POLICY "activity_log_insert" ON activity_log FOR INSERT WITH CHECK (user_id = auth.uid());

-- COMMENTS policies
CREATE POLICY "comments_select" ON comments FOR SELECT USING (
  get_user_role() IN ('editor', 'ceo') OR
  (get_user_role() = 'counselor' AND is_internal = FALSE)
);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (user_id = auth.uid());

-- NOTIFICATIONS policies
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (user_id = auth.uid());

-- PUBLISHING DETAILS policies
CREATE POLICY "publishing_details_select" ON publishing_details FOR SELECT USING (get_user_role() IN ('editor', 'social_manager', 'ceo'));
CREATE POLICY "publishing_details_write_smm" ON publishing_details FOR ALL USING (get_user_role() = 'social_manager');

-- POST PERFORMANCE policies
CREATE POLICY "post_performance_select" ON post_performance FOR SELECT USING (get_user_role() IN ('social_manager', 'ceo'));
CREATE POLICY "post_performance_write" ON post_performance FOR ALL USING (get_user_role() = 'social_manager');

-- EDITOR NOTE TEMPLATES policies
CREATE POLICY "templates_select" ON editor_note_templates FOR SELECT USING (get_user_role() = 'editor');
CREATE POLICY "templates_write" ON editor_note_templates FOR ALL USING (get_user_role() = 'editor' AND created_by = auth.uid());

-- SCRIPTS policies
CREATE POLICY "scripts_select" ON scripts FOR SELECT USING (
  get_user_role() IN ('editor', 'ceo', 'social_manager') OR
  (get_user_role() = 'counselor' AND id IN (SELECT script_id FROM script_assignments WHERE assigned_to = auth.uid()))
);
CREATE POLICY "scripts_write_smm" ON scripts FOR ALL USING (get_user_role() = 'social_manager');

-- SCRIPT ASSIGNMENTS policies
CREATE POLICY "script_assignments_select" ON script_assignments FOR SELECT USING (
  get_user_role() IN ('editor', 'ceo', 'social_manager') OR
  (get_user_role() = 'counselor' AND assigned_to = auth.uid())
);
CREATE POLICY "script_assignments_write" ON script_assignments FOR ALL USING (
  get_user_role() = 'social_manager' OR
  (get_user_role() = 'counselor' AND assigned_to = auth.uid())
);

-- VIDEO REPURPOSE PLANS policies
CREATE POLICY "repurpose_select" ON video_repurpose_plans FOR SELECT USING (get_user_role() IN ('editor', 'social_manager', 'ceo'));
CREATE POLICY "repurpose_write" ON video_repurpose_plans FOR ALL USING (get_user_role() IN ('editor', 'social_manager'));

-- USER NOTIFICATION PREFERENCES policies
CREATE POLICY "notif_prefs_own" ON user_notification_preferences FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================================
-- SEED DATA — Default Editor Note Templates
-- ============================================================
-- NOTE: Replace 'EDITOR_USER_ID' with the actual editor profile UUID after creating accounts

/*
INSERT INTO editor_note_templates (id, created_by, title, body, is_default, created_at) VALUES
  (uuid_generate_v4(), 'EDITOR_USER_ID', 'Audio Issue', 'There is background noise or echo in your recording. Please re-record in a quieter space with the door closed.', TRUE, NOW()),
  (uuid_generate_v4(), 'EDITOR_USER_ID', 'Lighting Issue', 'Your face is not clearly visible due to poor lighting. Please record near a window or with a lamp facing you.', TRUE, NOW()),
  (uuid_generate_v4(), 'EDITOR_USER_ID', 'Camera Stability', 'The camera was shaking throughout the video. Please use a tripod or place your phone on a stable surface.', TRUE, NOW()),
  (uuid_generate_v4(), 'EDITOR_USER_ID', 'Eye Contact', 'Please look directly at the camera lens throughout the recording, not at your screen or notes.', TRUE, NOW()),
  (uuid_generate_v4(), 'EDITOR_USER_ID', 'Content Incomplete', 'The video was cut off before you finished speaking. Please re-record the complete segment.', TRUE, NOW());
*/

-- ============================================================
-- FUNCTION: Auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'counselor'),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- USER ACCOUNTS SETUP INSTRUCTIONS
-- ============================================================
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Create users with these emails and passwords:
--    ceo@themigration.com          / CutDesk@CEO2024
--    editor@themigration.com       / CutDesk@Editor2024
--    smm@themigration.com          / CutDesk@SMM2024
--    counselor1@themigration.com   / CutDesk@C12024
--    counselor2@themigration.com   / CutDesk@C22024
--    counselor3@themigration.com   / CutDesk@C32024
--    counselor4@themigration.com   / CutDesk@C42024
--    counselor5@themigration.com   / CutDesk@C52024
--    counselor6@themigration.com   / CutDesk@C62024
--    counselor7@themigration.com   / CutDesk@C72024
--    counselor8@themigration.com   / CutDesk@C82024
--    counselor9@themigration.com   / CutDesk@C92024
--    counselor10@themigration.com  / CutDesk@C102024
--    counselor11@themigration.com  / CutDesk@C112024
--
-- 3. After creating users, UPDATE profiles table to set correct roles:
--    UPDATE profiles SET role = 'ceo', full_name = 'CEO' WHERE email = 'ceo@themigration.com';
--    UPDATE profiles SET role = 'editor', full_name = 'Video Editor' WHERE email = 'editor@themigration.com';
--    UPDATE profiles SET role = 'social_manager', full_name = 'Social Media Manager' WHERE email = 'smm@themigration.com';
--    UPDATE profiles SET role = 'counselor', full_name = 'Alex Johnson' WHERE email = 'counselor1@themigration.com';
--    UPDATE profiles SET role = 'counselor', full_name = 'Sarah Chen' WHERE email = 'counselor2@themigration.com';
--    UPDATE profiles SET role = 'counselor', full_name = 'Michael Brown' WHERE email = 'counselor3@themigration.com';
--    UPDATE profiles SET role = 'counselor', full_name = 'Emma Wilson' WHERE email = 'counselor4@themigration.com';
--    UPDATE profiles SET role = 'counselor', full_name = 'James Taylor' WHERE email = 'counselor5@themigration.com';
--    UPDATE profiles SET role = 'counselor', full_name = 'Priya Patel' WHERE email = 'counselor6@themigration.com';
--    UPDATE profiles SET role = 'counselor', full_name = 'David Kim' WHERE email = 'counselor7@themigration.com';
--    UPDATE profiles SET role = 'counselor', full_name = 'Sophie Martin' WHERE email = 'counselor8@themigration.com';
--    UPDATE profiles SET role = 'counselor', full_name = 'Omar Hassan' WHERE email = 'counselor9@themigration.com';
--    UPDATE profiles SET role = 'counselor', full_name = 'Yuki Tanaka' WHERE email = 'counselor10@themigration.com';
--    UPDATE profiles SET role = 'counselor', full_name = 'Aisha Mohammed' WHERE email = 'counselor11@themigration.com';
