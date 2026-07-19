// src/components/features/CandidateCard.jsx
import { useNavigate } from 'react-router-dom'
import { MapPin, Briefcase, ChevronRight } from 'lucide-react'
import styles from './CandidateCard.module.css'

const STATUS_CONFIG = {
  applied: { label: 'Applied', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  shortlisted: { label: 'Shortlisted', color: '#0891b2', bg: 'rgba(8,145,178,0.1)' },
  interviewing: { label: 'Interviewing', color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  offered: { label: 'Offered', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  rejected: { label: 'Rejected', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
}

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
  ['#6366f1', '#4f46e5'], ['#0891b2', '#0e7490'], ['#16a34a', '#15803d'],
  ['#d97706', '#b45309'], ['#dc2626', '#b91c1c'], ['#7c3aed', '#6d28d9'],
]

function avatarGradient(name = '') {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length
  return `linear-gradient(135deg, ${AVATAR_COLORS[i][0]}, ${AVATAR_COLORS[i][1]})`
}

export default function CandidateCard({ candidate }) {
  const navigate = useNavigate()
  const s = STATUS_CONFIG[candidate.status] || STATUS_CONFIG.applied

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/candidates/${candidate.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/candidates/${candidate.id}`)}
    >
      {/* Top row */}
      <div className={styles.top}>
        <div
          className={styles.avatar}
          style={{ background: avatarGradient(candidate.full_name) }}
        >
          {getInitials(candidate.full_name)}
        </div>
        {candidate.user_id && (
          <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: 4 }}>
            {candidate.user_id}
          </span>
        )}
        <div className={styles.info}>
          <h3 className={styles.name}>{candidate.full_name}</h3>
          <p className={styles.email}>{candidate.email}</p>
        </div>
        <span
          className={styles.badge}
          style={{ color: s.color, background: s.bg }}
        >
          {s.label}
        </span>
      </div>

      {/* Meta */}
      <div className={styles.meta}>
        {candidate.location && (
          <span className={styles.metaItem}>
            <MapPin size={11} />{candidate.location}
          </span>
        )}
        {candidate.experience && (
          <span className={styles.metaItem}>
            <Briefcase size={11} />{candidate.experience}
          </span>
        )}
      </div>

      {/* Skills */}
      {candidate.skills?.length > 0 && (
        <div className={styles.skills}>
          {candidate.skills.slice(0, 4).map(s => (
            <span key={s} className={styles.skill}>{s}</span>
          ))}
          {candidate.skills.length > 4 && (
            <span className={styles.skillMore}>+{candidate.skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.viewLink}>View profile <ChevronRight size={12} /></span>
      </div>
    </div>
  )
}
