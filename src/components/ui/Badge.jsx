export default function Badge({ status, children, className = '' }) {
  const statusMap = {
    Applied:      'badge-applied',
    Shortlisted:  'badge-shortlisted',
    Interviewing: 'badge-interviewing',
    Offered:      'badge-offered',
    Rejected:     'badge-rejected',
    success:      'badge-success',
    warning:      'badge-warning',
    error:        'badge-error',
    info:         'badge-info',
    neutral:      'badge-neutral',
    admin:        'badge-info',
    recruiter:    'badge-shortlisted',
    interviewer:  'badge-warning',
    user:         'badge-neutral',
  }

  const badgeClass = statusMap[status] || 'badge-neutral'

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {children || status}
    </span>
  )
}
