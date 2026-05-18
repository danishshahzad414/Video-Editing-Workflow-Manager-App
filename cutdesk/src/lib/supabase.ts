import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  profiles: {
    id: string
    full_name: string
    role: 'counselor' | 'editor' | 'social_manager' | 'ceo'
    avatar_url: string | null
    email: string
    created_at: string
  }
  videos: {
    id: string
    title: string
    description: string | null
    category: string
    date_recorded: string | null
    notes_for_editor: string | null
    counselor_id: string
    status: string
    priority: 'Urgent' | 'Normal' | 'Low'
    drive_url: string | null
    edited_drive_url: string | null
    script_file_url: string | null
    script_id: string | null
    thumbnail_url: string | null
    actual_edit_time_minutes: number | null
    estimated_completion_date: string | null
    revision_rounds: number
    is_urgent: boolean
    created_at: string
    updated_at: string
  }
}
