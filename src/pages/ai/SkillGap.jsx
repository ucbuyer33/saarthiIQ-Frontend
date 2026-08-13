import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TrendingUp, CheckCircle2, XCircle, Lightbulb, Search, FileText } from 'lucide-react'
import { aiAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import styles from './AIPages.module.css'

export default function SkillGap() {
  const [params] = useSearchParams()
  const [candidateId, setCandidateId] = useState(params.get('candidate') || '')
  const [result, setResult] = useState(null)
  const [aiReport, setAiReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setAiReport(null)
    try {
      const [gapRes, reportRes] = await Promise.all([
        aiAPI.skillGap(candidateId),
        aiAPI.aiReport(candidateId),
      ])
      setResult(gapRes.data)
      setAiReport(reportRes.data)
    } catch {
      toast.error('Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Skill Gap & AI Report"
        subtitle="AI-powered skills analysis and detailed report for a candidate"
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
              onChange={(e) => setCandidateId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.actionBtn} disabled={loading}>
            {loading ? (
              <Spinner size={14} />
            ) : (
              <>
                <TrendingUp size={14} /> Analyze
              </>
            )}
          </button>
        </form>
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <Spinner size={24} />
          <p>Running AI analysis…</p>
        </div>
      )}

      {!loading && (result || aiReport) && (
        <div className={styles.resultsGrid}>
          {/* Skill Gap section */}
          {result && (
            <div className={styles.results}>
              {result.matched_skills?.length > 0 && (
                <div className={styles.resultSection}>
                  <div className={styles.resultSectionHeader}>
                    <CheckCircle2
                      size={15}
                      style={{ color: 'var(--color-success)' }}
                    />
                    <span>Matched Skills</span>
                    <span className={styles.resultCount}>
                      {result.matched_skills.length}
                    </span>
                  </div>
                  <div className={styles.chipGrid}>
                    {result.matched_skills.map((s) => (
                      <span
                        key={s}
                        className={`${styles.chip} ${styles.chipSuccess}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.missing_skills?.length > 0 && (
                <div className={styles.resultSection}>
                  <div className={styles.resultSectionHeader}>
                    <XCircle
                      size={15}
                      style={{ color: 'var(--color-error)' }}
                    />
                    <span>Missing Skills</span>
                    <span className={styles.resultCount}>
                      {result.missing_skills.length}
                    </span>
                  </div>
                  <div className={styles.chipGrid}>
                    {result.missing_skills.map((s) => (
                      <span
                        key={s}
                        className={`${styles.chip} ${styles.chipError}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.recommendation && (
                <div className={styles.recommendation}>
                  <Lightbulb
                    size={15}
                    style={{ color: '#d97706', flexShrink: 0 }}
                  />
                  <p>{result.recommendation}</p>
                </div>
              )}
            </div>
          )}

          {/* AI Report section */}
          {aiReport && (
            <div className={styles.results}>
              <div className={styles.resultSection}>
                <div className={styles.resultSectionHeader}>
                  <FileText
                    size={15}
                    style={{ color: 'var(--color-primary)' }}
                  />
                  <span>AI Report</span>
                </div>
              </div>
              <div className={styles.reportBody}>
                {typeof aiReport === 'string' ? (
                  <p>{aiReport}</p>
                ) : (
                  <pre>{JSON.stringify(aiReport, null, 2)}</pre>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
