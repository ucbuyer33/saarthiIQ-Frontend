import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { interviewsAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import { INTERVIEW_TYPES } from '@/lib/constants'

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail

  if (typeof detail === 'string') return detail

  if (Array.isArray(detail)) {
    return detail.map(d => d.msg).join(', ')
  }

  return 'Failed to schedule'
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
      toast.success('Interview scheduled')
      navigate('/interviews')
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <PageHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => navigate('/interviews')}
              type="button"
            >
              <ArrowLeft size={18} />
            </button>
            Schedule Interview
          </div>
        }
      />

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="label">Candidate ID *</label>
            <input
              className="input"
              required
              value={form.candidate_id}
              onChange={set('candidate_id')}
              placeholder="e.g. 1"
            />
          </div>

          <div className="form-group">
            <label className="label">Interviewer Name *</label>
            <input
              className="input"
              required
              minLength={2}
              value={form.interviewer_name}
              onChange={set('interviewer_name')}
              placeholder="e.g. Shajaf Khan"
            />
          </div>

          <div className="form-group">
            <label className="label">Interview Type</label>
            <select className="input" value={form.interview_type} onChange={set('interview_type')}>
              {INTERVIEW_TYPES.map((t) => (
                <option key={t.value || t} value={t.value || t}>
                  {t.label || t}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label">Date & Time *</label>
            <input
              className="input"
              type="datetime-local"
              required
              value={form.interview_date}
              onChange={set('interview_date')}
            />
          </div>

          <div className="form-group">
            <label className="label">Meeting Link</label>
            <input
              className="input"
              value={form.meeting_link}
              onChange={set('meeting_link')}
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/interviews')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Spinner size={14} /> : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}