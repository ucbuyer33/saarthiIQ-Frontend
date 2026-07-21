// src/pages/ai/AIReport.jsx
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Brain, Sparkles, Search, FileText } from 'lucide-react'
import { aiAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import styles from './AIPages.module.css'

export default function AIReport() {
  const [params]        = useSearchParams()
  const [candidateId, setCandidateId] = useState(params.get('candidate') || '')
  const [report, setReport]           = useState(null)
  const [loading, setLoading]         = useState(false)

  const generate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setReport(null)
    try {
      const res = await aiAPI.aiReport(candidateId)
      setReport(res.data)
    } catch {
      toast.error('Report generation failed')
    } finally { setLoading(false) }
  }

  return (
    <div className={styles.page}>

      <PageHeader
        title="AI Candidate Report"
        subtitle="Generate a comprehensive AI-powered hiring recommendation"
        icon={Brain}
        iconColor="linear-gradient(135deg,#7c3aed,#6d28d9)"
      />

      <div className={styles.card}>
        <form onSubmit={generate} className={styles.searchRow}>
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
          <button type="submit" className={styles.actionBtn} disabled={loading}
            style={loading ? {} : { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}
          >
            {loading
              ? <><Spinner size={14} /> Generating…</>
              : <><Sparkles size={14} /> Generate Report</>}
          </button>
        </form>
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <Spinner size={24} />
          <p>AI is generating the report… this may take a few seconds.</p>
        </div>
      )}

      {report && !loading && (
        <div className={styles.reportCard}>
          <div className={styles.reportHeader}>
            <FileText size={15} />
            <span>Candidate Report</span>
          </div>
          <div className={styles.reportBody}>
            {report.report || JSON.stringify(report, null, 2)}
          </div>
        </div>
      )}
    </div>
  )
}
