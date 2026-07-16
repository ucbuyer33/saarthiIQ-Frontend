import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { resumeAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'

export default function ResumeScore() {
  const { id } = useParams()
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    resumeAPI.score(id)
      .then(res => setScore(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="Resume Score" subtitle="AI-powered resume quality score" />
      {loading ? <Spinner size={28} /> : !score ? <p>No score data.</p> : (
        <div className="card">
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div style={{ fontSize: 64, fontWeight: 800, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>{score.score ?? '—'}</div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>out of 100</p>
          </div>
          {score.feedback && (
            <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              <h3 className="section-title">Feedback</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{score.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
