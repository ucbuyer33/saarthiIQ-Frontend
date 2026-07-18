export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const ROLES = {
  ADMIN:       'admin',
  RECRUITER:   'recruiter',
  INTERVIEWER: 'interviewer',
  USER:        'user',
}

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

export const NAV_ITEMS = [
  { path: '/dashboard',        label: 'Dashboard',    icon: 'LayoutDashboard', roles: ['admin','recruiter','interviewer','user'] },
  { path: '/candidates',       label: 'Candidates',   icon: 'Users',           roles: ['admin','recruiter'] },
  { path: '/resume',           label: 'Resumes',      icon: 'FileText',        roles: ['admin','recruiter'] },
  { path: '/ai/skill-gap',     label: 'Skill Gap',    icon: 'TrendingUp',      roles: ['admin','recruiter'] },
  { path: '/ai/report',        label: 'AI Reports',   icon: 'Brain',           roles: ['admin','recruiter'] },
  { path: '/interviews',       label: 'Interviews',   icon: 'Calendar',        roles: ['admin','recruiter','interviewer'] },
  { path: '/campaigns',        label: 'Campaigns',    icon: 'Megaphone',       roles: ['admin','recruiter'] },
  { path: '/tasks',            label: 'Tasks',        icon: 'CheckSquare',     roles: ['admin','recruiter'] },
  { path: '/analytics',        label: 'Analytics',    icon: 'BarChart2',       roles: ['admin','recruiter'] },
  { path: '/admin/users',      label: 'Users',        icon: 'UserCog',         roles: ['admin'] },
  { path: '/admin/audit',      label: 'Audit Log',    icon: 'Shield',          roles: ['admin'] },
  { path: '/profile',          label: 'Profile',      icon: 'Settings',        roles: ['admin','recruiter','interviewer','user'] },
]
