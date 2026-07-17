import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Brain } from 'lucide-react'
import { aiAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function AIReport() {
  const [params] = useSearchParams()
  const [candidateId, setCandidateId] = useState(params.get('candidate') || '')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await aiAPI.aiReport(latestResume.id)
      setReport(res.data)
    } catch (error) {
      toast.error('Report generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <PageHeader title="AI Candidate Report" subtitle="Generate a comprehensive AI-powered hiring recommendation" />
      <div className="card">
        <form onSubmit={generate} style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <input className="input" style={{ flex: 1 }} placeholder="Candidate ID" value={candidateId} onChange={e => setCandidateId(e.target.value)} required />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <Spinner size={14} /> : <><Brain size={14} /> Generate</>}
          </button>
        </form>
        {loading && (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
            <Spinner size={24} />
            <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>AI is generating the report...</p>
          </div>
        )}
        {report && (
          <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-5)' }}>
            <h3 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Report</h3>
            <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>{report.report || JSON.stringify(report, null, 2)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
