import type { Video } from '../hooks/useVideos'
import type { Notification } from '../hooks/useNotifications'
import type { ActivityLogEntry } from '../hooks/useActivityLog'

export const DEMO_MODE = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co'

// ─── Demo Users ────────────────────────────────────────────────────────────────
export const DEMO_PROFILES: Record<string, { id: string; full_name: string; role: 'counselor' | 'editor' | 'social_manager' | 'ceo'; avatar_url: null; email: string; created_at: string }> = {
  'ceo@themigration.com': { id: 'ceo-001', full_name: 'Michael Park', role: 'ceo', avatar_url: null, email: 'ceo@themigration.com', created_at: '2024-01-01T00:00:00Z' },
  'editor@themigration.com': { id: 'editor-001', full_name: 'James Wilson', role: 'editor', avatar_url: null, email: 'editor@themigration.com', created_at: '2024-01-01T00:00:00Z' },
  'smm@themigration.com': { id: 'smm-001', full_name: 'Mia Torres', role: 'social_manager', avatar_url: null, email: 'smm@themigration.com', created_at: '2024-01-01T00:00:00Z' },
  'counselor1@themigration.com': { id: 'c1-001', full_name: 'Sarah Chen', role: 'counselor', avatar_url: null, email: 'counselor1@themigration.com', created_at: '2024-01-01T00:00:00Z' },
  'counselor2@themigration.com': { id: 'c2-001', full_name: 'David Kim', role: 'counselor', avatar_url: null, email: 'counselor2@themigration.com', created_at: '2024-01-01T00:00:00Z' },
  'counselor3@themigration.com': { id: 'c3-001', full_name: 'Emma Roberts', role: 'counselor', avatar_url: null, email: 'counselor3@themigration.com', created_at: '2024-01-01T00:00:00Z' },
  'counselor4@themigration.com': { id: 'c4-001', full_name: 'Alex Johnson', role: 'counselor', avatar_url: null, email: 'counselor4@themigration.com', created_at: '2024-01-01T00:00:00Z' },
  'counselor5@themigration.com': { id: 'c5-001', full_name: 'Rachel Lee', role: 'counselor', avatar_url: null, email: 'counselor5@themigration.com', created_at: '2024-01-01T00:00:00Z' },
}

export const DEMO_PASSWORDS: Record<string, string> = {
  'ceo@themigration.com': 'CutDesk@CEO2024',
  'editor@themigration.com': 'CutDesk@Editor2024',
  'smm@themigration.com': 'CutDesk@SMM2024',
  'counselor1@themigration.com': 'CutDesk@C12024',
  'counselor2@themigration.com': 'CutDesk@C22024',
  'counselor3@themigration.com': 'CutDesk@C32024',
  'counselor4@themigration.com': 'CutDesk@C42024',
  'counselor5@themigration.com': 'CutDesk@C52024',
}

// ─── Mock Videos ───────────────────────────────────────────────────────────────
export const MOCK_VIDEOS: Video[] = [
  {
    id: 'v-001', title: 'Understanding Australian Visa Types', description: 'Comprehensive guide to Australian visa categories for students', category: 'Visa Guidance',
    date_recorded: '2024-11-01', notes_for_editor: null, counselor_id: 'c1-001', status: 'Published',
    priority: 'Normal', drive_url: null, edited_drive_url: null, script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: 95, estimated_completion_date: '2024-11-10',
    revision_rounds: 1, is_urgent: false, created_at: '2024-11-01T08:00:00Z', updated_at: '2024-11-10T12:00:00Z',
    counselor: { full_name: 'Sarah Chen', email: 'counselor1@themigration.com' },
  },
  {
    id: 'v-002', title: 'Top 5 Universities for International Students', description: 'Breaking down the best uni options for migration clients', category: 'University Selection',
    date_recorded: '2024-11-05', notes_for_editor: null, counselor_id: 'c2-001', status: 'Editing In Progress',
    priority: 'Urgent', drive_url: 'https://drive.google.com/file/d/demo', edited_drive_url: null, script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: 30, estimated_completion_date: '2024-11-20',
    revision_rounds: 0, is_urgent: true, created_at: '2024-11-05T09:00:00Z', updated_at: '2024-11-15T10:00:00Z',
    counselor: { full_name: 'David Kim', email: 'counselor2@themigration.com' },
  },
  {
    id: 'v-003', title: 'Scholarship Application Tips & Tricks', description: 'Step by step guide to winning scholarship applications', category: 'Scholarship Advice',
    date_recorded: '2024-11-08', notes_for_editor: null, counselor_id: 'c3-001', status: 'In Editor Queue',
    priority: 'Normal', drive_url: 'https://drive.google.com/file/d/demo2', edited_drive_url: null, script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: null, estimated_completion_date: '2024-11-22',
    revision_rounds: 0, is_urgent: false, created_at: '2024-11-08T11:00:00Z', updated_at: '2024-11-14T09:00:00Z',
    counselor: { full_name: 'Emma Roberts', email: 'counselor3@themigration.com' },
  },
  {
    id: 'v-004', title: 'Personal Statement Writing Guide', description: 'How to craft a compelling personal statement', category: 'Study Abroad',
    date_recorded: '2024-11-03', notes_for_editor: 'Please re-record the intro — audio cuts out at 0:23. Also re-do the closing statement with more energy.', counselor_id: 'c1-001', status: 'Revision Requested',
    priority: 'Urgent', drive_url: 'https://drive.google.com/file/d/demo3', edited_drive_url: null, script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: null, estimated_completion_date: null,
    revision_rounds: 1, is_urgent: true, created_at: '2024-11-03T10:00:00Z', updated_at: '2024-11-13T15:00:00Z',
    counselor: { full_name: 'Sarah Chen', email: 'counselor1@themigration.com' },
  },
  {
    id: 'v-005', title: 'Career Counseling in the Tech Industry', description: 'Navigating tech career opportunities as an international student', category: 'Career Counseling',
    date_recorded: '2024-10-28', notes_for_editor: null, counselor_id: 'c4-001', status: 'Editing Complete',
    priority: 'Normal', drive_url: 'https://drive.google.com/file/d/demo4', edited_drive_url: 'https://drive.google.com/file/d/edited4', script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: 110, estimated_completion_date: '2024-11-08',
    revision_rounds: 0, is_urgent: false, created_at: '2024-10-28T09:00:00Z', updated_at: '2024-11-08T16:00:00Z',
    counselor: { full_name: 'Alex Johnson', email: 'counselor4@themigration.com' },
  },
  {
    id: 'v-006', title: 'Student Life in Melbourne: A Full Guide', description: 'Everything you need to know about living in Melbourne as a student', category: 'Personal Development',
    date_recorded: '2024-11-02', notes_for_editor: null, counselor_id: 'c5-001', status: 'Pending Social Review',
    priority: 'Normal', drive_url: 'https://drive.google.com/file/d/demo5', edited_drive_url: 'https://drive.google.com/file/d/edited5', script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: 75, estimated_completion_date: '2024-11-18',
    revision_rounds: 0, is_urgent: false, created_at: '2024-11-02T08:30:00Z', updated_at: '2024-11-16T11:00:00Z',
    counselor: { full_name: 'Rachel Lee', email: 'counselor5@themigration.com' },
  },
  {
    id: 'v-007', title: 'IELTS Preparation: Strategies That Work', description: 'Proven strategies to score 7+ on IELTS', category: 'Study Abroad',
    date_recorded: '2024-10-25', notes_for_editor: null, counselor_id: 'c2-001', status: 'Scheduled',
    priority: 'Normal', drive_url: 'https://drive.google.com/file/d/demo6', edited_drive_url: 'https://drive.google.com/file/d/edited6', script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: 85, estimated_completion_date: '2024-11-25',
    revision_rounds: 0, is_urgent: false, created_at: '2024-10-25T10:00:00Z', updated_at: '2024-11-17T09:00:00Z',
    counselor: { full_name: 'David Kim', email: 'counselor2@themigration.com' },
  },
  {
    id: 'v-008', title: 'University Selection Process Explained', description: 'How to choose the right university for your goals', category: 'University Selection',
    date_recorded: '2024-11-12', notes_for_editor: null, counselor_id: 'c1-001', status: 'Raw Uploaded',
    priority: 'Normal', drive_url: 'https://drive.google.com/file/d/demo7', edited_drive_url: null, script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: null, estimated_completion_date: null,
    revision_rounds: 0, is_urgent: false, created_at: '2024-11-12T14:00:00Z', updated_at: '2024-11-12T14:00:00Z',
    counselor: { full_name: 'Sarah Chen', email: 'counselor1@themigration.com' },
  },
  {
    id: 'v-009', title: 'Visa Interview: What to Expect', description: 'Preparing clients for the Australian visa interview process', category: 'Visa Guidance',
    date_recorded: '2024-11-10', notes_for_editor: null, counselor_id: 'c3-001', status: 'Re-record Submitted',
    priority: 'Urgent', drive_url: 'https://drive.google.com/file/d/demo8', edited_drive_url: null, script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: null, estimated_completion_date: null,
    revision_rounds: 2, is_urgent: true, created_at: '2024-11-07T08:00:00Z', updated_at: '2024-11-10T16:00:00Z',
    counselor: { full_name: 'Emma Roberts', email: 'counselor3@themigration.com' },
  },
  {
    id: 'v-010', title: 'Financial Planning for Study Abroad', description: 'Budgeting and financial tips for international students', category: 'Scholarship Advice',
    date_recorded: '2024-10-15', notes_for_editor: null, counselor_id: 'c4-001', status: 'Archived',
    priority: 'Low', drive_url: null, edited_drive_url: null, script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: 60, estimated_completion_date: null,
    revision_rounds: 0, is_urgent: false, created_at: '2024-10-15T09:00:00Z', updated_at: '2024-10-30T10:00:00Z',
    counselor: { full_name: 'Alex Johnson', email: 'counselor4@themigration.com' },
  },
  {
    id: 'v-011', title: 'How to Write a Winning SOP', description: 'Statement of Purpose writing masterclass', category: 'Study Abroad',
    date_recorded: '2024-11-09', notes_for_editor: null, counselor_id: 'c5-001', status: 'In Editor Queue',
    priority: 'Normal', drive_url: 'https://drive.google.com/file/d/demo9', edited_drive_url: null, script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: null, estimated_completion_date: '2024-11-21',
    revision_rounds: 0, is_urgent: false, created_at: '2024-11-09T10:00:00Z', updated_at: '2024-11-13T08:00:00Z',
    counselor: { full_name: 'Rachel Lee', email: 'counselor5@themigration.com' },
  },
  {
    id: 'v-012', title: 'Navigating the PR Pathway After Graduation', description: 'Permanent residency options for international graduates', category: 'Visa Guidance',
    date_recorded: '2024-11-11', notes_for_editor: null, counselor_id: 'c2-001', status: 'Raw Uploaded',
    priority: 'Low', drive_url: 'https://drive.google.com/file/d/demo10', edited_drive_url: null, script_file_url: null, script_id: null,
    thumbnail_url: null, actual_edit_time_minutes: null, estimated_completion_date: null,
    revision_rounds: 0, is_urgent: false, created_at: '2024-11-11T13:00:00Z', updated_at: '2024-11-11T13:00:00Z',
    counselor: { full_name: 'David Kim', email: 'counselor2@themigration.com' },
  },
]

// ─── Mock Notifications ────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n-001', user_id: 'ceo-001', title: 'Editing Complete', body: '"Career Counseling in the Tech Industry" is ready for social review', video_id: 'v-005', script_id: null, is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: 'n-002', user_id: 'ceo-001', title: 'New Video Uploaded', body: '"University Selection Process Explained" was uploaded by Sarah Chen', video_id: 'v-008', script_id: null, is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'n-003', user_id: 'ceo-001', title: 'Revision Requested', body: '"Personal Statement Writing Guide" has been sent back for re-recording', video_id: 'v-004', script_id: null, is_read: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'n-004', user_id: 'editor-001', title: 'New Video in Queue', body: '"Scholarship Application Tips & Tricks" is ready to edit', video_id: 'v-003', script_id: null, is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'n-005', user_id: 'editor-001', title: 'Re-record Submitted', body: 'Emma Roberts re-submitted "Visa Interview: What to Expect"', video_id: 'v-009', script_id: null, is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: 'n-006', user_id: 'smm-001', title: 'Ready for Publishing', body: '"Student Life in Melbourne: A Full Guide" is pending social review', video_id: 'v-006', script_id: null, is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: 'n-007', user_id: 'smm-001', title: 'Editing Complete', body: '"Career Counseling in the Tech Industry" is ready to publish', video_id: 'v-005', script_id: null, is_read: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 'n-008', user_id: 'c1-001', title: 'Revision Requested', body: 'James Wilson requested changes to "Personal Statement Writing Guide"', video_id: 'v-004', script_id: null, is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
  { id: 'n-009', user_id: 'c1-001', title: 'Video Published', body: '"Understanding Australian Visa Types" is now live!', video_id: 'v-001', script_id: null, is_read: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 'n-010', user_id: 'c2-001', title: 'Editing Started', body: 'James Wilson has started editing "Top 5 Universities for International Students"', video_id: 'v-002', script_id: null, is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
]

// ─── Mock Activity Log ─────────────────────────────────────────────────────────
export const MOCK_ACTIVITY: ActivityLogEntry[] = [
  { id: 'a-001', video_id: 'v-008', user_id: 'c1-001', action: 'Video uploaded', from_status: null, to_status: 'Raw Uploaded', notes: null, created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), user: { full_name: 'Sarah Chen', role: 'counselor' }, video: { title: 'University Selection Process Explained' } },
  { id: 'a-002', video_id: 'v-003', user_id: 'editor-001', action: 'Added to editor queue', from_status: 'Raw Uploaded', to_status: 'In Editor Queue', notes: null, created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), user: { full_name: 'James Wilson', role: 'editor' }, video: { title: 'Scholarship Application Tips & Tricks' } },
  { id: 'a-003', video_id: 'v-002', user_id: 'editor-001', action: 'Started editing', from_status: 'In Editor Queue', to_status: 'Editing In Progress', notes: null, created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), user: { full_name: 'James Wilson', role: 'editor' }, video: { title: 'Top 5 Universities for International Students' } },
  { id: 'a-004', video_id: 'v-004', user_id: 'editor-001', action: 'Requested revision', from_status: 'In Editor Queue', to_status: 'Revision Requested', notes: 'Please re-record the intro — audio cuts out at 0:23.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), user: { full_name: 'James Wilson', role: 'editor' }, video: { title: 'Personal Statement Writing Guide' } },
  { id: 'a-005', video_id: 'v-009', user_id: 'c3-001', action: 'Re-record submitted', from_status: 'Revision Requested', to_status: 'Re-record Submitted', notes: null, created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), user: { full_name: 'Emma Roberts', role: 'counselor' }, video: { title: 'Visa Interview: What to Expect' } },
  { id: 'a-006', video_id: 'v-005', user_id: 'editor-001', action: 'Editing complete', from_status: 'Editing In Progress', to_status: 'Editing Complete', notes: 'Colour graded and captions added. Ready for social.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), user: { full_name: 'James Wilson', role: 'editor' }, video: { title: 'Career Counseling in the Tech Industry' } },
  { id: 'a-007', video_id: 'v-006', user_id: 'smm-001', action: 'Approved for social', from_status: 'Editing Complete', to_status: 'Pending Social Review', notes: null, created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), user: { full_name: 'Mia Torres', role: 'social_manager' }, video: { title: 'Student Life in Melbourne: A Full Guide' } },
  { id: 'a-008', video_id: 'v-007', user_id: 'smm-001', action: 'Scheduled for publish', from_status: 'Pending Social Review', to_status: 'Scheduled', notes: 'Scheduled for Monday 9am AEST', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), user: { full_name: 'Mia Torres', role: 'social_manager' }, video: { title: 'IELTS Preparation: Strategies That Work' } },
  { id: 'a-009', video_id: 'v-001', user_id: 'smm-001', action: 'Published', from_status: 'Scheduled', to_status: 'Published', notes: 'Posted on YouTube and Instagram', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), user: { full_name: 'Mia Torres', role: 'social_manager' }, video: { title: 'Understanding Australian Visa Types' } },
  { id: 'a-010', video_id: 'v-010', user_id: 'ceo-001', action: 'Archived', from_status: 'Published', to_status: 'Archived', notes: null, created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), user: { full_name: 'Michael Park', role: 'ceo' }, video: { title: 'Financial Planning for Study Abroad' } },
]

// ─── Mock Post Performance ─────────────────────────────────────────────────────
export const MOCK_PERFORMANCE = [
  { id: 'p-001', video_id: 'v-001', platform: 'YouTube', published_date: '2024-11-10', views: 4820, likes: 312, comments: 47, notes: 'Great engagement on visa content', updated_at: '2024-11-14T10:00:00Z', video: { title: 'Understanding Australian Visa Types' } },
  { id: 'p-002', video_id: 'v-001', platform: 'Instagram', published_date: '2024-11-10', views: 2140, likes: 198, comments: 23, notes: null, updated_at: '2024-11-14T10:00:00Z', video: { title: 'Understanding Australian Visa Types' } },
  { id: 'p-003', video_id: 'v-007', platform: 'YouTube', published_date: '2024-11-08', views: 3560, likes: 241, comments: 38, notes: 'IELTS content always performs well', updated_at: '2024-11-14T10:00:00Z', video: { title: 'IELTS Preparation: Strategies That Work' } },
  { id: 'p-004', video_id: 'v-007', platform: 'TikTok', published_date: '2024-11-08', views: 8930, likes: 743, comments: 112, notes: 'Viral on TikTok', updated_at: '2024-11-14T10:00:00Z', video: { title: 'IELTS Preparation: Strategies That Work' } },
  { id: 'p-005', video_id: 'v-010', platform: 'LinkedIn', published_date: '2024-10-30', views: 1240, likes: 89, comments: 14, notes: null, updated_at: '2024-11-05T10:00:00Z', video: { title: 'Financial Planning for Study Abroad' } },
]

// ─── Script & Video Assignment Types ──────────────────────────────────────────
export interface ScriptAssignment {
  id: string; script_id: string; assigned_to: string; assigned_by: string
  status: 'Assigned' | 'Acknowledged' | 'Recording' | 'Submitted' | 'Done'
  assigned_at: string; deadline: string | null
  counselor?: { full_name: string; email: string }
}

export interface VideoAssignment {
  id: string; video_id: string; assigned_to: string; assigned_by: string
  status: 'Assigned' | 'In Progress' | 'Complete'
  assigned_at: string; deadline: string | null
  notes: string | null
  editor?: { full_name: string; email: string }
}

export const MOCK_SCRIPT_ASSIGNMENTS: ScriptAssignment[] = [
  { id: 'sa-001', script_id: 's-001', assigned_to: 'c1-001', assigned_by: 'smm-001', status: 'Assigned', assigned_at: new Date(Date.now() - 1000*60*60*24).toISOString(), deadline: new Date(Date.now() + 1000*60*60*24*3).toISOString().split('T')[0], counselor: { full_name: 'Sarah Chen', email: 'counselor1@themigration.com' } },
  { id: 'sa-002', script_id: 's-001', assigned_to: 'c2-001', assigned_by: 'smm-001', status: 'Recording', assigned_at: new Date(Date.now() - 1000*60*60*36).toISOString(), deadline: new Date(Date.now() + 1000*60*60*24*3).toISOString().split('T')[0], counselor: { full_name: 'David Kim', email: 'counselor2@themigration.com' } },
  { id: 'sa-003', script_id: 's-003', assigned_to: 'c3-001', assigned_by: 'smm-001', status: 'Submitted', assigned_at: new Date(Date.now() - 1000*60*60*72).toISOString(), deadline: new Date(Date.now() + 1000*60*60*24*7).toISOString().split('T')[0], counselor: { full_name: 'Emma Roberts', email: 'counselor3@themigration.com' } },
]

export const MOCK_VIDEO_ASSIGNMENTS: VideoAssignment[] = [
  { id: 'va-001', video_id: 'v-003', assigned_to: 'editor-001', assigned_by: 'smm-001', status: 'In Progress', assigned_at: new Date(Date.now() - 1000*60*60*5).toISOString(), deadline: new Date(Date.now() + 1000*60*60*24*2).toISOString().split('T')[0], notes: 'Focus on colour grade and captions', editor: { full_name: 'James Wilson', email: 'editor@themigration.com' } },
  { id: 'va-002', video_id: 'v-008', assigned_to: 'editor-001', assigned_by: 'smm-001', status: 'Assigned', assigned_at: new Date(Date.now() - 1000*60*60*1).toISOString(), deadline: new Date(Date.now() + 1000*60*60*24*4).toISOString().split('T')[0], notes: null, editor: { full_name: 'James Wilson', email: 'editor@themigration.com' } },
]

// ─── Mock Scripts ──────────────────────────────────────────────────────────────
export const MOCK_SCRIPTS = [
  { id: 's-001', title: 'Why Study in Australia in 2025?', category: 'Study Abroad', target_platforms: ['YouTube', 'Instagram'], target_duration: '5min', body: 'Australia continues to be one of the world\'s top study destinations. In this video, we explore why 2025 is the best time to make your move...\n\n[HOOK: Start with a statistic about international students]\n\n1. World-class universities\n2. Post-study work rights\n3. Multicultural environment\n4. Pathway to PR\n\n[OUTRO: Call to action - book a consultation]', recording_notes: 'Speak confidently and directly to camera. Use the whiteboard for the list items. Good lighting essential.', priority: 'Urgent', deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0], status: 'Assigned', created_by: 'smm-001', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 's-002', title: 'Understanding the Student Visa (500)', category: 'Visa Guidance', target_platforms: ['YouTube', 'TikTok', 'Instagram'], target_duration: '10min', body: 'The Student Visa subclass 500 is the primary visa for international students in Australia. Let\'s break it down step by step...\n\n[SECTION 1: Eligibility]\n[SECTION 2: Requirements]\n[SECTION 3: Application process]\n[SECTION 4: Conditions once granted]', recording_notes: 'This is a detailed video so take your time. You can use slides for the requirements section.', priority: 'Normal', deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0], status: 'Draft', created_by: 'smm-001', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 's-003', title: 'Career Pathways After Your Australian Degree', category: 'Career Counseling', target_platforms: ['LinkedIn', 'YouTube'], target_duration: '5min', body: 'So you\'ve finished your degree in Australia — what\'s next? In this video we cover the key career pathways available to international graduates...\n\n[Graduate Visa (485)]\n[Employer Sponsored]\n[State Nomination]\n[PR Pathways]', recording_notes: 'Professional tone. Suit recommended for LinkedIn. Keep it concise.', priority: 'Normal', deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split('T')[0], status: 'In Progress', created_by: 'smm-001', created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
  { id: 's-004', title: 'Top Scholarship Opportunities 2025', category: 'Scholarship Advice', target_platforms: ['YouTube', 'Instagram', 'Facebook'], target_duration: '2min', body: 'Quick-fire guide to the top scholarships for international students heading to Australia in 2025. Including Government Awards, University Merit Scholarships, and Private Foundation Grants.', recording_notes: 'High energy, fast-paced delivery. Use upbeat background music.', priority: 'Low', deadline: null, status: 'Recorded', created_by: 'smm-001', created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString() },
]
