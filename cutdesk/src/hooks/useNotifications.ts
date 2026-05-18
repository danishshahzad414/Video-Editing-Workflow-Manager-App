import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { DEMO_MODE, MOCK_NOTIFICATIONS } from '../lib/mockData'

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  video_id: string | null
  script_id: string | null
  is_read: boolean
  created_at: string
}

export function useNotifications() {
  const { profile } = useAuth()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['notifications', profile?.id],
    queryFn: async () => {
      if (DEMO_MODE) {
        return MOCK_NOTIFICATIONS.filter(n => n.user_id === profile?.id)
      }
      const { data, error } = await supabase
        .from('notifications').select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false }).limit(50)
      if (error) throw error
      return data as Notification[]
    },
    enabled: !!profile,
  })

  useEffect(() => {
    if (!profile || DEMO_MODE) return
    const channel = supabase
      .channel(`notifications:${profile.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
        () => qc.invalidateQueries({ queryKey: ['notifications', profile.id] }))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [profile?.id])

  return query
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  const { profile } = useAuth()

  return useMutation({
    mutationFn: async (id: string) => {
      if (DEMO_MODE) {
        const n = MOCK_NOTIFICATIONS.find(n => n.id === id)
        if (n) n.is_read = true
        return
      }
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications', profile?.id] }),
  })
}

export function useMarkAllRead() {
  const qc = useQueryClient()
  const { profile } = useAuth()

  return useMutation({
    mutationFn: async () => {
      if (DEMO_MODE) {
        MOCK_NOTIFICATIONS.filter(n => n.user_id === profile?.id).forEach(n => { n.is_read = true })
        return
      }
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile!.id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications', profile?.id] }),
  })
}

export async function sendNotification(userId: string, title: string, body: string, videoId?: string, scriptId?: string) {
  if (DEMO_MODE) return
  await supabase.from('notifications').insert({
    user_id: userId, title, body, video_id: videoId || null, script_id: scriptId || null,
    is_read: false, created_at: new Date().toISOString(),
  })
}
