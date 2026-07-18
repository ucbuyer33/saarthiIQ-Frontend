// src/components/features/CandidateRow.jsx
// Used by CandidateList in 'list' (table) view
import { useNavigate } from 'react-router-dom'
import { MapPin, Briefcase, ChevronRight } from 'lucide-react'
import styles from './CandidateRow.module.css'

const STATUS_CONFIG = {
  applied:      { label: 'Applied',      color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  shortlisted:  { label: 'Shortlisted',  color: '#0891b2', bg: 'rgba(8,145,178,0.1)'   },
  interviewing: { label: 'Interviewing', color: '#d97706', bg: 'rgba(217,119,6,0.1)'   },
  offered:      { label: 'Offered',      color: '#16a34a', bg: 'rgba(22,163,74,0.1)'   },
  rejected:     { label: 'Rejected',     color: '#dc2626', bg: 'rgba(220,38,38,0.1)'   },
}

const AVATAR_COLORS = [
  ['#6366f1','#4f46e5'], ['#0891b2','#0e7490'], ['#16a34a','#15803d'],
  ['#d97706','#b45309'], ['#dc2626','#b91c1c'], ['#7c3aed','#6d28d9'],
]
function avatarGradient(name = '') {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length
  return `linear-gradient(135deg, ${AVATAR_COLORS[i][0]}, ${AVATAR_COLORS[i][1]})`
}
function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function CandidateRow({ candidate }) {
  const navigate = useNavigate()
  const s = STATUS_CONFIG[candidate.status] || STATUS_CONFIG.applied

  return (
    <div
      className={styles.row}
      onClick={() => navigate(`/candidates/${candidate.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/candidates/${candidate.id}`)}
    >
      {/* Candidate */}
      <div className={styles.candidate}>
        <div
          className={styles.avatar}
          style={{ background: avatarGradient(candidate.full_name) }}
        >
          {getInitials(candidate.full_name)}
        </div>
        <div className={styles.nameWrap}>
          <span className={styles.name}>{candidate.full_name}</span>
          <span className={styles.email}>{candidate.email}</span>
        </div>
      </div>

      {/* Status */}
      <div>
        <span className={styles.badge} style={{ color: s.color, background: s.bg }}>
          {s.label}
        </span>
      </div>

      {/* Location */}
      <div className={styles.metaCell}>
        {candidate.location
          ? <><MapPin size={11} />{candidate.location}</>
          : <span className={styles.empty}>—</span>}
      </div>

      {/* Experience */}
      <div className={styles.metaCell}>
        {candidate.experience
          ? <><Briefcase size={11} />{candidate.experience}</>
          : <span className={styles.empty}>—</span>}
      </div>

      {/* Skills */}
      <div className={styles.skills}>
        {candidate.skills?.slice(0, 3).map(s => (
          <span key={s} className={styles.skill}>{s}</span>
        ))}
        {candidate.skills?.length > 3 && (
          <span className={styles.skillMore}>+{candidate.skills.length - 3}</span>
        )}
      </div>

      {/* Arrow */}
      <div className={styles.arrow}>
        <ChevronRight size={14} />
      </div>
    </div>
  )
}
