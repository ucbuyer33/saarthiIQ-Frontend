// src/pages/interviews/ScheduleInterview.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarClock, User, Users, Tag, Link2, CalendarCheck2 } from 'lucide-react'
import { interviewsAPI } from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import { INTERVIEW_TYPES } from '@/lib/constants'
import styles from './ScheduleInterview.module.css'

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map(d => d.msg).join(', ')
  return 'Failed to schedule'
}

const TYPE_COLORS = {
  Technical:   { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
  HR:          { bg: 'rgba(8,145,178,0.1)',   color: '#0891b2' },
  Managerial:  { bg: 'rgba(217,119,6,0.1)',   color: '#d97706' },
  Cultural:    { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
}

export default function ScheduleInterview() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    candidate_id: '',
    interviewer_name: '',
    interview_type: 'Technical',
    interview_date: '',
    meeting_link: '',
  })
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        interviewer_name: form.interviewer_name,
        interview_type: form.interview_type,
        interview_date: form.interview_date,
        meeting_link: form.meeting_link || null,
      }
      await interviewsAPI.create(form.candidate_id, payload)
      toast.success('Interview scheduled!')
      navigate('/interviews')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally { setLoading(false) }
  }

  const typeCfg = TYPE_COLORS[form.interview_type] || TYPE_COLORS.Technical

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <button className={styles.backBtn} onClick={() => navigate('/interviews')} type="button">
          <ArrowLeft size={16} />
        </button>
        <div className={styles.headerIcon}><CalendarClock size={20} /></div>
        <div>
          <h1 className={styles.pageTitle}>Schedule Interview</h1>
          <p className={styles.pageSubtitle}>Set up an interview session for a candidate</p>
        </div>
      </div>

      <div className={styles.layout}>
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Who */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}><Users size={13}/><span>Participants</span></div>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>Candidate ID <span className={styles.req}>*</span></label>
                <div className={styles.inputWrap}>
                  <User size={13} className={styles.inputIcon}/>
                  <input className={styles.input} required value={form.candidate_id} onChange={set('candidate_id')} placeholder="e.g. 42" />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Interviewer Name <span className={styles.req}>*</span></label>
                <div className={styles.inputWrap}>
                  <User size={13} className={styles.inputIcon}/>
                  <input className={styles.input} required minLength={2} value={form.interviewer_name} onChange={set('interviewer_name')} placeholder="e.g. John Doe" />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}><Tag size={13}/><span>Interview Details</span></div>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>Interview Type</label>
                <select className={styles.select} value={form.interview_type} onChange={set('interview_type')}>
                  {INTERVIEW_TYPES.map(t => (
                    <option key={t.value || t} value={t.value || t}>{t.label || t}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Date &amp; Time <span className={styles.req}>*</span></label>
                <div className={styles.inputWrap}>
                  <CalendarCheck2 size={13} className={styles.inputIcon}/>
                  <input className={styles.input} type="datetime-local" required value={form.interview_date} onChange={set('interview_date')} />
                </div>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Meeting Link</label>
              <div className={styles.inputWrap}>
                <Link2 size={13} className={styles.inputIcon}/>
                <input className={styles.input} value={form.meeting_link} onChange={set('meeting_link')} placeholder="https://meet.google.com/..." />
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate('/interviews')}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <><Spinner size={13}/> Scheduling…</> : <><CalendarClock size={14}/> Schedule Interview</>}
            </button>
          </div>
        </form>

        {/* Preview */}
        <aside className={styles.preview}>
          <p className={styles.previewLabel}>Preview</p>
          <div className={styles.previewCard}>
            <div className={styles.previewTypeRow}>
              <span className={styles.previewTypeBadge} style={{ color: typeCfg.color, background: typeCfg.bg }}>
                {form.interview_type}
              </span>
            </div>
            <div className={styles.previewRow}><User size={12}/><span>{form.interviewer_name || <i>Interviewer</i>}</span></div>
            <div className={styles.previewRow}><User size={12}/><span>Candidate #{form.candidate_id || '—'}</span></div>
            {form.interview_date && (
              <div className={styles.previewRow}><CalendarCheck2 size={12}/><span>{new Date(form.interview_date).toLocaleString()}</span></div>
            )}
            {form.meeting_link && (
              <div className={styles.previewRow}><Link2 size={12}/><span className={styles.previewLink}>{form.meeting_link}</span></div>
            )}
          </div>
          <p className={styles.previewHint}>Updates as you type</p>
        </aside>
      </div>
    </div>
  )
}
