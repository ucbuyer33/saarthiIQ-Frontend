import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { candidatesAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import { CANDIDATE_STATUSES } from '@/lib/constants'
import styles from './AddCandidate.module.css'

const BLANK = { full_name: '', email: '', phone: '', location: '', experience: '', status: 'Applied', skills: '' }

export default function AddCandidate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm]       = useState(BLANK)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    candidatesAPI.getById(id)
      .then(res => {
        const c = res.data
        setForm({ ...c, skills: (c.skills || []).join(', ') })
      })
      .catch(() => toast.error('Failed to load candidate'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      ...form,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
    }
    try {
      if (isEdit) {
        await candidatesAPI.update(id, payload)
        toast.success('Candidate updated')
        navigate(`/candidates/${id}`)
      } else {
        const res = await candidatesAPI.create(payload)
        toast.success('Candidate added')
        navigate(`/candidates/${res.data.id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save')
    } finally { setLoading(false) }
  }

  if (fetching) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}><Spinner size={28} /></div>

  return (
    <div style={{ maxWidth: 620 }}>
      <PageHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button className="btn btn-ghost btn-icon" onClick={() => navigate('/candidates')}><ArrowLeft size={18} /></button>
            {isEdit ? 'Edit Candidate' : 'Add Candidate'}
          </div>
        }
      />
      <div className="card">
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className="form-group">
              <label className="label">Full Name *</label>
              <input className="input" required value={form.full_name} onChange={set('full_name')} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="label">Email *</label>
              <input className="input" type="email" required value={form.email} onChange={set('email')} placeholder="john@email.com" />
            </div>
          </div>
          <div className={styles.row}>
            <div className="form-group">
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={set('phone')} placeholder="+91 9876543210" />
            </div>
            <div className="form-group">
              <label className="label">Location</label>
              <input className="input" value={form.location} onChange={set('location')} placeholder="Mumbai, MH" />
            </div>
          </div>
          <div className={styles.row}>
            <div className="form-group">
              <label className="label">Experience</label>
              <input className="input" value={form.experience} onChange={set('experience')} placeholder="3 years" />
            </div>
            <div className="form-group">
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={set('status')}>
                {CANDIDATE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Skills <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
            <input className="input" value={form.skills} onChange={set('skills')} placeholder="React, Node.js, Python" />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/candidates')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <Spinner size={14} /> : isEdit ? 'Save Changes' : 'Add Candidate'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
