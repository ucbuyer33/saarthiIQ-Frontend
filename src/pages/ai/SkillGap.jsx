// src/pages/ai/SkillGap.jsx
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TrendingUp, CheckCircle2, XCircle, Lightbulb, Search } from 'lucide-react'
import { aiAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import styles from './AIPages.module.css'

export default function SkillGap() {
  const [params]        = useSearchParams()
  const [candidateId, setCandidateId] = useState(params.get('candidate') || '')
  const [result, setResult]           = useState(null)
  const [loading, setLoading]         = useState(false)

  const analyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await aiAPI.skillGap(candidateId)
      setResult(res.data)
    } catch {
      toast.error('Analysis failed')
    } finally { setLoading(false) }
  }

  return (
    <div className={styles.page}>

      <PageHeader
        title="Skill Gap Analysis"
        subtitle="AI-powered skills comparison against role requirements"
        icon={TrendingUp}
        iconColor="linear-gradient(135deg,#0891b2,#0e7490)"
      />

      <div className={styles.card}>
        <form onSubmit={analyze} className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Enter Candidate ID…"
              value={candidateId}
              onChange={e => setCandidateId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.actionBtn} disabled={loading}>
            {loading ? <Spinner size={14} /> : <><TrendingUp size={14} /> Analyze</>}
          </button>
        </form>
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <Spinner size={24} />
          <p>Running AI skill analysis…</p>
        </div>
      )}

      {result && !loading && (
        <div className={styles.results}>
          {result.matched_skills?.length > 0 && (
            <div className={styles.resultSection}>
              <div className={styles.resultSectionHeader}>
                <CheckCircle2 size={15} style={{ color: 'var(--color-success)' }} />
                <span>Matched Skills</span>
                <span className={styles.resultCount}>{result.matched_skills.length}</span>
              </div>
              <div className={styles.chipGrid}>
                {result.matched_skills.map(s => (
                  <span key={s} className={`${styles.chip} ${styles.chipSuccess}`}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {result.missing_skills?.length > 0 && (
            <div className={styles.resultSection}>
              <div className={styles.resultSectionHeader}>
                <XCircle size={15} style={{ color: 'var(--color-error)' }} />
                <span>Missing Skills</span>
                <span className={styles.resultCount}>{result.missing_skills.length}</span>
              </div>
              <div className={styles.chipGrid}>
                {result.missing_skills.map(s => (
                  <span key={s} className={`${styles.chip} ${styles.chipError}`}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {result.recommendation && (
            <div className={styles.recommendation}>
              <Lightbulb size={15} style={{ color: '#d97706', flexShrink: 0 }} />
              <p>{result.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
