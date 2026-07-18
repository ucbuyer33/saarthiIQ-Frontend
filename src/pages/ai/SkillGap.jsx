import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { aiAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function SkillGap() {
  const [params] = useSearchParams()
  const [candidateId, setCandidateId] = useState(params.get('candidate') || '')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await aiAPI.skillGap(latestResume.id)
      setResult(res.data)
    } catch (error) {
      toast.error('Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <PageHeader title="Skill Gap Analysis" subtitle="AI-powered skills comparison against role requirements" />
      <div className="card">
        <form onSubmit={analyze} style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <input className="input" style={{ flex: 1 }} placeholder="Candidate ID" value={candidateId} onChange={e => setCandidateId(e.target.value)} required />
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? <Spinner size={14} /> : 'Analyze'}</button>
        </form>
        {result && (
          <>
            {result.missing_skills?.length > 0 && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h3 className="section-title">Missing Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  {result.missing_skills.map(s => <span key={s} className="badge badge-error">{s}</span>)}
                </div>
              </div>
            )}
            {result.matched_skills?.length > 0 && (
              <div>
                <h3 className="section-title">Matched Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  {result.matched_skills.map(s => <span key={s} className="badge badge-success">{s}</span>)}
                </div>
              </div>
            )}
            {result.recommendation && <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{result.recommendation}</p>}
          </>
        )}
      </div>
    </div>
  )
}
