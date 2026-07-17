import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { resumeAPI } from '@/lib/api' 
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'

export default function ResumeScore() {
  const { id } = useParams() // candidateId from URL parameters
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLatestResumeScore = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 1. Get all resumes associated with this candidate ID
        const resumesRes = await resumeAPI.getByCandidate(id)
        const resumes = resumesRes.data || []

        if (!resumes.length) {
          setError('No resume uploaded for this candidate.')
          return
        }

        // 2. Extract the latest resume ID and fetch its AI score
        const latestResume = resumes[0]
        const scoreRes = await resumeAPI.score(latestResume.id)
        setScore(scoreRes.data)
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.detail || err.message || 'Failed to load score data.')
      } finally {
        setLoading(false)
      }
    }

    fetchLatestResumeScore()
  }, [id])

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="Resume Score" subtitle="AI-powered resume quality score" />
      
      {loading ? (
        <Spinner size={28} />
      ) : error ? (
        <p style={{ color: 'var(--color-error, red)', fontSize: 'var(--text-sm)' }}>{error}</p>
      ) : !score ? (
        <p>No score data available.</p>
      ) : (
        <div className="card">
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div style={{ fontSize: 64, fontWeight: 800, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {score.score ?? score.resume_score ?? '—'}
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
              out of 100
            </p>
          </div>
          
          {score.feedback && (
            <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              <h3 className="section-title">Feedback</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{score.feedback}</p>
            </div>
          )}

          {/* Conditional rendering for structural lists from the original data schema */}
          {((score.strengths && score.strengths.length > 0) || 
            (score.weaknesses && score.weaknesses.length > 0) || 
            (score.suggestions && score.suggestions.length > 0)) && (
            <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              
              {score.strengths && score.strengths.length > 0 && (
                <>
                  <h3 className="section-title" style={{ color: 'green' }}>Strengths</h3>
                  <ul style={{ paddingLeft: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    {score.strengths.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </>
              )}

              {score.weaknesses && score.weaknesses.length > 0 && (
                <>
                  <h3 className="section-title" style={{ color: 'red', marginTop: 'var(--space-3)' }}>Weaknesses</h3>
                  <ul style={{ paddingLeft: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    {score.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </>
              )}

              {score.suggestions && score.suggestions.length > 0 && (
                <>
                  <h3 className="section-title" style={{ marginTop: 'var(--space-3)' }}>Suggestions</h3>
                  <ul style={{ paddingLeft: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    {score.suggestions.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  )
}
