// src/pages/resume/JobMatch.jsx
import { useState } from 'react'
import { resumeAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import { Crosshair } from 'lucide-react'

export default function JobMatch() {
  const [form, setForm]     = useState({ resume_id: '', job_description: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await resumeAPI.jobMatch(form)
      setResult(res.data)
    } catch { toast.error('Match failed') } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <PageHeader
        title="Job Match"
        subtitle="Check how well a resume matches a job description"
        icon={Crosshair}
        iconColor="linear-gradient(135deg,#16a34a,#15803d)"
      />
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="label">Resume ID</label>
            <input className="input" value={form.resume_id} onChange={e => setForm(f => ({ ...f, resume_id: e.target.value }))} required placeholder="Resume ID" />
          </div>
          <div className="form-group">
            <label className="label">Job Description</label>
            <textarea className="input textarea" rows={6} value={form.job_description} onChange={e => setForm(f => ({ ...f, job_description: e.target.value }))} required placeholder="Paste the job description here..." />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <Spinner size={14} /> : 'Match'}</button>
        </form>
        {result && (
          <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-5)' }}>
            <h3 className="section-title">Match Result</h3>
            <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--color-primary)', textAlign: 'center', padding: 'var(--space-4)' }}>{result.match_score ?? result.score}%</div>
            {result.analysis && <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{result.analysis}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
