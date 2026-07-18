// src/pages/candidates/CandidateList.jsx
import { useState, useEffect } from 'react'
import { Plus, Search, SlidersHorizontal, Users, UserCheck, Clock, XCircle, LayoutGrid, List } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { candidatesAPI } from '@/lib/api'
import CandidateCard from '@/components/features/CandidateCard'
import CandidateRow from '@/components/features/CandidateRow'
import { CANDIDATE_STATUSES } from '@/lib/constants'
import styles from './Candidates.module.css'

const STATUS_TABS = [
  { value: '',             label: 'All',          icon: Users },
  { value: 'shortlisted',  label: 'Shortlisted',  icon: UserCheck },
  { value: 'interviewing', label: 'Interviewing', icon: Clock },
  { value: 'rejected',     label: 'Rejected',     icon: XCircle },
]

export default function CandidateList() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [candidates, setCandidates]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState(params.get('q') || '')
  const [statusFilter, setStatus]     = useState('')
  const [view, setView]               = useState('grid') // 'grid' | 'list'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await candidatesAPI.getAll({ search, status: statusFilter })
        setCandidates(res.data.results || [])
      } catch {}
      finally { setLoading(false) }
    }
    const t = setTimeout(fetchData, 300)
    return () => clearTimeout(t)
  }, [search, statusFilter])

  const total       = candidates.length
  const shortlisted = candidates.filter(c => c.status === 'shortlisted').length
  const interviewing = candidates.filter(c => c.status === 'interviewing').length

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Candidates</h1>
          <p className={styles.subtitle}>
            {loading ? 'Loading…' : `${total} total · ${shortlisted} shortlisted · ${interviewing} interviewing`}
          </p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => navigate('/candidates/add')}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Candidate
        </button>
      </div>

      {/* ── Status tabs + search bar ── */}
      <div className={styles.toolbar}>
        {/* Status tabs */}
        <div className={styles.tabs}>
          {STATUS_TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.value}
                className={`${styles.tab} ${statusFilter === tab.value ? styles.tabActive : ''}`}
                onClick={() => setStatus(tab.value)}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Right controls */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <Search size={13} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search name, email, skills…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch('')}>×</button>
            )}
          </div>

          <select
            className={styles.statusSelect}
            value={statusFilter}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {CANDIDATE_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${view === 'grid' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('grid')}
              title="Grid view"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('list')}
              title="List view"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className={view === 'grid' ? styles.grid : styles.listView}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIconRing}>
            <Users size={28} strokeWidth={1.5} />
          </div>
          <h3 className={styles.emptyTitle}>
            {search ? `No results for "${search}"` : 'No candidates yet'}
          </h3>
          <p className={styles.emptyDesc}>
            {search
              ? 'Try a different name, email, or skill.'
              : 'Add your first candidate to start building your talent pipeline.'}
          </p>
          {!search && (
            <button
              className={styles.addBtn}
              onClick={() => navigate('/candidates/add')}
            >
              <Plus size={14} /> Add Candidate
            </button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className={styles.grid}>
          {candidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Candidate</span>
            <span>Status</span>
            <span>Location</span>
            <span>Experience</span>
            <span>Skills</span>
            <span></span>
          </div>
          {candidates.map(c => <CandidateRow key={c.id} candidate={c} />)}
        </div>
      )}
    </div>
  )
}
