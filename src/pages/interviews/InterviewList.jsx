// src/pages/interviews/InterviewList.jsx
import { useEffect, useState } from 'react'
import { Plus, CalendarClock, Trash2, User, Users, Link2, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { interviewsAPI } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import toast from 'react-hot-toast'
import styles from './InterviewList.module.css'

const TYPE_CONFIG = {
  Technical:  { color:'#6366f1', bg:'rgba(99,102,241,0.1)'  },
  HR:         { color:'#0891b2', bg:'rgba(8,145,178,0.1)'   },
  Managerial: { color:'#d97706', bg:'rgba(217,119,6,0.1)'   },
  Cultural:   { color:'#16a34a', bg:'rgba(22,163,74,0.1)'   },
}
const STATUS_CONFIG = {
  Scheduled:  { color:'#6366f1', bg:'rgba(99,102,241,0.1)'  },
  Completed:  { color:'#16a34a', bg:'rgba(22,163,74,0.1)'   },
  Cancelled:  { color:'#dc2626', bg:'rgba(220,38,38,0.1)'   },
}

export default function InterviewList() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [interviews, setInterviews]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [deletingId, setDeletingId]     = useState(null)
  const [confirmOpen, setConfirmOpen]   = useState(false)
  const [selectedIv, setSelectedIv]     = useState(null)

  useEffect(() => {
    interviewsAPI.getAll()
      .then(res => setInterviews(res.data || []))
      .catch(() => toast.error('Failed to load interviews'))
      .finally(() => setLoading(false))
  }, [])

  const askDelete = (iv) => { setSelectedIv(iv); setConfirmOpen(true) }

  const handleDelete = async () => {
    if (!selectedIv) return
    setDeletingId(selectedIv.id)
    try {
      await interviewsAPI.delete(selectedIv.id)
      setInterviews(p => p.filter(iv => iv.id !== selectedIv.id))
      toast.success('Interview deleted')
      setConfirmOpen(false)
      setSelectedIv(null)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete')
    } finally { setDeletingId(null) }
  }

  const upcoming  = interviews.filter(iv => iv.status !== 'Completed' && iv.status !== 'Cancelled')
  const past      = interviews.filter(iv => iv.status === 'Completed' || iv.status === 'Cancelled')

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Interviews</h1>
          <p className={styles.pageSubtitle}>
            {upcoming.length} upcoming · {past.length} past
          </p>
        </div>
        <button className={styles.addBtn} onClick={() => navigate('/interviews/schedule')}>
          <Plus size={14} /> Schedule Interview
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingWrap}><Spinner size={24} /></div>
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No interviews scheduled"
          description="Schedule your first interview session."
          action={
            <button className={styles.addBtn} onClick={() => navigate('/interviews/schedule')}>
              <Plus size={14} /> Schedule Interview
            </button>
          }
        />
      ) : (
        <div className={styles.lists}>

          {upcoming.length > 0 && (
            <div className={styles.group}>
              <p className={styles.groupLabel}>Upcoming <span>{upcoming.length}</span></p>
              <div className={styles.cardList}>
                {upcoming.map(iv => (
                  <InterviewCard key={iv.id} iv={iv} role={role} deletingId={deletingId} onDelete={askDelete} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className={styles.group}>
              <p className={styles.groupLabel}>Past <span>{past.length}</span></p>
              <div className={styles.cardList}>
                {past.map(iv => (
                  <InterviewCard key={iv.id} iv={iv} role={role} deletingId={deletingId} onDelete={askDelete} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete interview?"
        message={selectedIv ? `Delete the interview for candidate #${selectedIv.candidate_id}?` : 'This action cannot be undone.'}
        confirmText="Delete"
        cancelText="Cancel"
        confirmTone="danger"
        loading={deletingId === selectedIv?.id}
        onConfirm={handleDelete}
        onClose={() => { if (!deletingId) { setConfirmOpen(false); setSelectedIv(null) } }}
      />
    </div>
  )
}

function InterviewCard({ iv, role, deletingId, onDelete }) {
  const typeCfg   = TYPE_CONFIG[iv.interview_type]   || { color:'#6366f1', bg:'rgba(99,102,241,0.1)' }
  const statusCfg = STATUS_CONFIG[iv.status || 'Scheduled'] || STATUS_CONFIG.Scheduled

  const dateStr = iv.interview_date
    ? new Date(iv.interview_date).toLocaleDateString(undefined, { weekday:'short', day:'numeric', month:'short' })
    : null
  const timeStr = iv.interview_date
    ? new Date(iv.interview_date).toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' })
    : null

  return (
    <div className={styles.card}>

      {/* Left: date block */}
      <div className={styles.dateBlock} style={{ background: typeCfg.bg }}>
        <CalendarClock size={16} style={{ color: typeCfg.color }} />
        {dateStr && <span className={styles.dateStr} style={{ color: typeCfg.color }}>{dateStr}</span>}
        {timeStr && <span className={styles.timeStr}>{timeStr}</span>}
      </div>

      {/* Center: details */}
      <div className={styles.cardContent}>
        <div className={styles.cardTopRow}>
          <span className={styles.typeBadge} style={{ color: typeCfg.color, background: typeCfg.bg }}>
            {iv.interview_type || 'Interview'}
          </span>
          <span className={styles.statusBadge} style={{ color: statusCfg.color, background: statusCfg.bg }}>
            {iv.status || 'Scheduled'}
          </span>
        </div>
        <div className={styles.cardMeta}>
          <span className={styles.metaItem}><User size={11}/> Candidate #{iv.candidate_id || iv.candidate_name}</span>
          {iv.interviewer_name && (
            <span className={styles.metaItem}><Users size={11}/> {iv.interviewer_name}</span>
          )}
          {iv.meeting_link && (
            <a href={iv.meeting_link} target="_blank" rel="noreferrer" className={styles.meetingLink}>
              <Link2 size={11}/> Join meeting
            </a>
          )}
        </div>
      </div>

      {/* Right: actions */}
      {role === 'admin' && (
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => onDelete(iv)}
          disabled={deletingId === iv.id}
          aria-label="Delete interview"
        >
          {deletingId === iv.id ? <Spinner size={13} /> : <Trash2 size={14} />}
        </button>
      )}
    </div>
  )
}
