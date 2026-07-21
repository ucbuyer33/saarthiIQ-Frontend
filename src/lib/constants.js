export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const CANDIDATE_STATUSES = [
  { value: 'Applied',      label: 'Applied',      badge: 'badge-applied' },
  { value: 'Shortlisted',  label: 'Shortlisted',  badge: 'badge-shortlisted' },
  { value: 'Interviewing', label: 'Interviewing', badge: 'badge-interviewing' },
  { value: 'Offered',      label: 'Offered',      badge: 'badge-offered' },
  { value: 'Rejected',     label: 'Rejected',     badge: 'badge-rejected' },
]

export const INTERVIEW_TYPES = ['Phone Screen', 'Technical', 'HR Round', 'Final Round', 'Culture Fit']

export const INTERVIEW_STATUSES = ['Scheduled', 'Completed', 'Cancelled', 'No Show']

export const TASK_PRIORITIES = [
  { value: 'low',    label: 'Low',    color: 'badge-info' },
  { value: 'medium', label: 'Medium', color: 'badge-warning' },
  { value: 'high',   label: 'High',   color: 'badge-error' },
]

export const TASK_STATUSES = ['Pending', 'In Progress', 'Done']

// Single-role (recruiter) app — every nav item is visible to every logged-in user.
export const NAV_ITEMS = [
  { path: '/dashboard',        label: 'Dashboard',    icon: 'LayoutDashboard', section: 'Main' },
  { path: '/candidates',       label: 'Candidates',   icon: 'Users',           section: 'Recruitment' },
  { path: '/resume',           label: 'Resumes',      icon: 'FileText',        section: 'Recruitment' },
  { path: '/ai/skill-gap',     label: 'Skill Gap',    icon: 'TrendingUp',      section: 'Recruitment' },
  { path: '/ai/report',        label: 'AI Reports',   icon: 'Brain',           section: 'Recruitment' },
  { path: '/interviews',       label: 'Interviews',   icon: 'Calendar',        section: 'Recruitment' },
  { path: '/campaigns',        label: 'Campaigns',    icon: 'Megaphone',       section: 'Recruitment' },
  { path: '/tasks',            label: 'Tasks',        icon: 'CheckSquare',     section: 'Tools' },
  { path: '/analytics',        label: 'Analytics',    icon: 'BarChart2',       section: 'Tools' },
  { path: '/activity',         label: 'Activity Log', icon: 'Shield',          section: 'Tools' },
  { path: '/profile',          label: 'Profile',      icon: 'Settings',        section: 'Main' },
]
