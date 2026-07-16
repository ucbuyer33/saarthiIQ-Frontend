import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { interviewsAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import { INTERVIEW_TYPES } from '@/lib/constants'

export default function ScheduleInterview() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ candidate_id: '', interview_type: 'Technical', scheduled_at: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await interviewsAPI.create(form)
      toast.success('Interview scheduled')
      navigate('/interviews')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to schedule')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <PageHeader title={<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}><button className="btn btn-ghost btn-icon" onClick={() => navigate('/interviews')}><ArrowLeft size={18} /></button>Schedule Interview</div>} />
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="label">Candidate ID *</label>
            <input className="input" required value={form.candidate_id} onChange={set('candidate_id')} placeholder="Candidate ID" />
          </div>
          <div className="form-group">
            <label className="label">Interview Type</label>
            <select className="input" value={form.interview_type} onChange={set('interview_type')}>
              {INTERVIEW_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Date & Time *</label>
            <input className="input" type="datetime-local" required value={form.scheduled_at} onChange={set('scheduled_at')} />
          </div>
          <div className="form-group">
            <label className="label">Notes</label>
            <textarea className="input textarea" rows={3} value={form.notes} onChange={set('notes')} placeholder="Any preparation notes..." />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/interviews')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <Spinner size={14} /> : 'Schedule'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
