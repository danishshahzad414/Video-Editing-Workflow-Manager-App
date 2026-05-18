import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { DEMO_MODE, MOCK_ACTIVITY } from '../lib/mockData'

export interface ActivityLogEntry {
  id: string
  video_id: string
  user_id: string
  action: string
  from_status: string | null
  to_status: string | null
  notes: string | null
  created_at: string
  user?: { full_name: string; role: string }
  video?: { title: string }
}

export function useActivityLog(videoId?: string) {
  return useQuery({
    queryKey: ['activity_log', videoId],
    queryFn: async () => {
      if (DEMO_MODE) {
        return videoId ? MOCK_ACTIVITY.filter(e => e.video_id === videoId) : MOCK_ACTIVITY
      }
      let query = supabase
        .from('activity_log')
        .select('*, user:profiles!activity_log_user_id_fkey(full_name, role), video:videos!activity_log_video_id_fkey(title)')
        .order('created_at', { ascending: false }).limit(200)

      if (videoId) query = query.eq('video_id', videoId)
      const { data, error } = await query
      if (error) throw error
      return data as ActivityLogEntry[]
    },
  })
}
