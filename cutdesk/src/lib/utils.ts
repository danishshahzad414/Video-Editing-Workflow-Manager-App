import { format, formatDistanceToNow, differenceInDays } from 'date-fns'

export const PIPELINE_STAGES = [
  'Raw Uploaded',
  'In Editor Queue',
  'Editing In Progress',
  'Revision Requested',
  'Re-record Submitted',
  'Editing Complete',
  'Pending Social Review',
  'Scheduled',
  'Published',
  'Archived',
] as const

export type PipelineStage = typeof PIPELINE_STAGES[number]

export const STAGE_COLORS: Record<string, string> = {
  'Raw Uploaded': '#006386',
  'In Editor Queue': '#00A2CF',
  'Editing In Progress': '#F59E0B',
  'Revision Requested': '#EF4444',
  'Re-record Submitted': '#8B5CF6',
  'Editing Complete': '#10B981',
  'Pending Social Review': '#06B6D4',
  'Scheduled': '#6366F1',
  'Published': '#22C55E',
  'Archived': '#6B7280',
}

export const CATEGORIES = [
  'Career Counseling',
  'Study Abroad',
  'Visa Guidance',
  'Scholarship Advice',
  'University Selection',
  'Personal Development',
  'Other',
]

export const PLATFORMS = ['YouTube', 'Instagram', 'TikTok', 'Facebook', 'LinkedIn']

export const PLATFORM_COLORS: Record<string, string> = {
  YouTube: '#FF0000',
  Instagram: '#E1306C',
  TikTok: '#000000',
  Facebook: '#1877F2',
  LinkedIn: '#0A66C2',
}

export const PLATFORM_CHAR_LIMITS: Record<string, number> = {
  YouTube: 5000,
  Instagram: 2200,
  TikTok: 2200,
  Facebook: 63206,
  LinkedIn: 3000,
}

export function getStageIndex(status: string): number {
  return PIPELINE_STAGES.indexOf(status as PipelineStage)
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return format(new Date(dateStr), 'dd MMM yyyy')
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '—'
  return format(new Date(dateStr), 'dd MMM yyyy, h:mm a')
}

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function daysSince(dateStr: string): number {
  return differenceInDays(new Date(), new Date(dateStr))
}

export function formatMinutes(mins: number | null): string {
  if (!mins) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

export function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function extractDriveFileId(url: string | null): string | null {
  if (!url) return null
  if (url.includes('/d/')) {
    const parts = url.split('/d/')
    return parts[1]?.split('/')[0] || null
  }
  if (url.includes('id=')) {
    return url.split('id=')[1]?.split('&')[0] || null
  }
  return null
}

export function getDriveDownloadUrl(driveUrl: string | null): string | null {
  const fileId = extractDriveFileId(driveUrl)
  if (!fileId) return null
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}

export function downloadFromDrive(driveUrl: string | null): void {
  const downloadUrl = getDriveDownloadUrl(driveUrl)
  if (downloadUrl) {
    window.open(downloadUrl, '_blank')
  }
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function stageColor(status: string): string {
  return STAGE_COLORS[status] || '#6B7280'
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.slice(0, len) + '…'
}

export function calcEngagement(views: number, likes: number, comments: number): string {
  if (!views) return '—'
  return (((likes + comments) / views) * 100).toFixed(1) + '%'
}
