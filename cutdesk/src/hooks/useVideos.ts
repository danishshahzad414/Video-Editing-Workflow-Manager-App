import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { DEMO_MODE, MOCK_VIDEOS } from '../lib/mockData'
import toast from 'react-hot-toast'

export interface Video {
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
  counselor?: { full_name: string; email: string }
}

export function useVideos(filters?: { status?: string; counselor_id?: string }) {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['videos', profile?.role, profile?.id, filters],
    queryFn: async () => {
      if (DEMO_MODE) {
        let videos = [...MOCK_VIDEOS]
        if (profile?.role === 'counselor') videos = videos.filter(v => v.counselor_id === profile.id)
        if (filters?.status) videos = videos.filter(v => v.status === filters.status)
        if (filters?.counselor_id) videos = videos.filter(v => v.counselor_id === filters.counselor_id)
        return videos
      }

      let query = supabase
        .from('videos')
        .select('*, counselor:profiles!videos_counselor_id_fkey(full_name, email)')
        .order('created_at', { ascending: false })

      if (profile?.role === 'counselor') query = query.eq('counselor_id', profile.id)
      if (filters?.status) query = query.eq('status', filters.status)
      if (filters?.counselor_id) query = query.eq('counselor_id', filters.counselor_id)

      const { data, error } = await query
      if (error) throw error
      return data as Video[]
    },
    enabled: !!profile,
  })
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      if (DEMO_MODE) return MOCK_VIDEOS.find(v => v.id === id) ?? null
      const { data, error } = await supabase
        .from('videos')
        .select('*, counselor:profiles!videos_counselor_id_fkey(full_name, email)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Video
    },
    enabled: !!id,
  })
}

export function useUpdateVideoStatus() {
  const qc = useQueryClient()
  const { profile } = useAuth()

  return useMutation({
    mutationFn: async ({
      videoId, status, fromStatus, notes, extraFields,
    }: {
      videoId: string; status: string; fromStatus: string; notes?: string; extraFields?: Record<string, any>
    }) => {
      if (DEMO_MODE) {
        // Update in-memory mock video
        const v = MOCK_VIDEOS.find(v => v.id === videoId)
        if (v) { v.status = status; v.updated_at = new Date().toISOString(); Object.assign(v, extraFields || {}) }
        return
      }

      const updates: Record<string, any> = { status, updated_at: new Date().toISOString(), ...extraFields }
      const { error } = await supabase.from('videos').update(updates).eq('id', videoId)
      if (error) throw error

      await supabase.from('activity_log').insert({
        video_id: videoId, user_id: profile!.id, action: `Status changed to ${status}`,
        from_status: fromStatus, to_status: status, notes: notes || null, created_at: new Date().toISOString(),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] })
      qc.invalidateQueries({ queryKey: ['video'] })
      toast.success('Video status updated!')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update status'),
  })
}

export function useCreateVideo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (video: Omit<Video, 'id' | 'created_at' | 'updated_at' | 'counselor'>) => {
      if (DEMO_MODE) {
        const newVideo: Video = {
          ...video, id: `v-demo-${Date.now()}`,
          created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        }
        MOCK_VIDEOS.unshift(newVideo)
        return newVideo
      }
      const { data, error } = await supabase
        .from('videos')
        .insert({ ...video, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] })
      toast.success('Video uploaded successfully!')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to upload video'),
  })
}

export function useUpdateVideo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Video> & { id: string }) => {
      if (DEMO_MODE) {
        const v = MOCK_VIDEOS.find(v => v.id === id)
        if (v) Object.assign(v, updates, { updated_at: new Date().toISOString() })
        return
      }
      const { error } = await supabase
        .from('videos').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] })
      qc.invalidateQueries({ queryKey: ['video'] })
    },
    onError: (err: any) => toast.error(err.message || 'Update failed'),
  })
}
