import { useState, useEffect } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { candidatesAPI } from '@/lib/api'
import CandidateCard from '@/components/features/CandidateCard'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import { CANDIDATE_STATUSES } from '@/lib/constants'
import styles from './Candidates.module.css'

export default function CandidateList() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(params.get('q') || '')
  const [statusFilter, setStatus] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await candidatesAPI.getAll({ search, status: statusFilter })
        setCandidates(res.data.results || [])
      } catch { }
      finally { setLoading(false) }
    }
    const t = setTimeout(fetchData, 300)
    return () => clearTimeout(t)
  }, [search, statusFilter])

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle={`${candidates.length} total candidates`}
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/candidates/add')}>
            <Plus size={16} /> Add Candidate
          </button>
        }
      />

      {/* Filters */}
      <div className={styles.filters}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)', pointerEvents: 'none' }} />
          <input className="input" style={{ paddingLeft: 'var(--space-8)' }} placeholder="Search by name, email, skills..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {CANDIDATE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => <div key={i} className="card skeleton" style={{ height: 130 }} />)}
        </div>
      ) : candidates.length === 0 ? (
        <EmptyState
          title="No candidates found"
          description={search ? `No results for "${search}"` : 'Add your first candidate to get started.'}
          action={<button className="btn btn-primary" onClick={() => navigate('/candidates/add')}><Plus size={14} /> Add Candidate</button>}
        />
      ) : (
        <div className={styles.grid}>
          {candidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
        </div>
      )}
    </div>
  )
}
