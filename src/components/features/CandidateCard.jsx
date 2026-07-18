import { useNavigate } from 'react-router-dom'
import { MapPin, Briefcase, Mail } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import styles from './CandidateCard.module.css'

export default function CandidateCard({ candidate }) {
  const navigate = useNavigate()

  return (
    <div className={`card ${styles.card}`} onClick={() => navigate(`/candidates/${candidate.id}`)}>
      <div className={styles.header}>
        <Avatar name={candidate.full_name} size={40} />
        <div className={styles.info}>
          <h3 className={styles.name}>{candidate.full_name}</h3>
          <p className={styles.email}><Mail size={12} /> {candidate.email}</p>
        </div>
        <Badge status={candidate.status} />
      </div>
      <div className={styles.meta}>
        {candidate.location && (
          <span><MapPin size={12} /> {candidate.location}</span>
        )}
        {candidate.experience && (
          <span><Briefcase size={12} /> {candidate.experience}</span>
        )}
      </div>
      {candidate.skills?.length > 0 && (
        <div className={styles.skills}>
          {candidate.skills.slice(0, 4).map(s => (
            <span key={s} className={`badge badge-neutral`}>{s}</span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="badge badge-neutral">+{candidate.skills.length - 4}</span>
          )}
        </div>
      )}
    </div>
  )
}
