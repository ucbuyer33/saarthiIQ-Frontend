// src/pages/candidates/CandidateList.jsx
import { useState, useEffect } from 'react'
import { Plus, Search, SlidersHorizontal, Users, UserCheck, Clock, XCircle, LayoutGrid, List, FileStack } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { candidatesAPI, resumeAPI } from '@/lib/api'
import CandidateCard from '@/components/features/CandidateCard'
import CandidateRow from '@/components/features/CandidateRow'
import { CANDIDATE_STATUSES } from '@/lib/constants'
import PageHeader from '@/components/ui/PageHeader'
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
  const [view, setView]               = useState('grid')
  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkFiles, setBulkFiles]         = useState([])
  const [resumeFilter, setResumeFilter]   = useState('all') // all | with | without

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

  const total        = candidates.length
  const shortlisted  = candidates.filter(c => c.status === 'shortlisted').length
  const interviewing = candidates.filter(c => c.status === 'interviewing').length

  const handleBulkFilesChange = (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type === 'application/pdf')
    setBulkFiles(files)
  }

  const handleBulkUpload = async () => {
    if (!bulkFiles.length) return
    setBulkUploading(true)

    try {
      // Simple auto-filtering: only upload resumes for candidates that don't yet have one.
      const candidatesWithoutResume = candidates.filter(c => !c.resume_url)
      const toProcess = candidatesWithoutResume.slice(0, bulkFiles.length)

      await Promise.all(
        toProcess.map((candidate, idx) => {
          const file = bulkFiles[idx]
          if (!file) return Promise.resolve()
          return resumeAPI.upload(candidate.id, file)
        })
      )

      setBulkFiles([])
      // Re-fetch candidates so UI auto-updates based on new resume URLs
      const res = await candidatesAPI.getAll({ search, status: statusFilter })
      setCandidates(res.data.results || [])
    } catch (err) {
      console.error('Bulk upload failed', err)
    } finally {
      setBulkUploading(false)
    }
  }

  const filteredCandidates = candidates.filter(c => {
    if (resumeFilter === 'with') return !!c.resume_url
    if (resumeFilter === 'without') return !c.resume_url
    return true
  })

  return (
    <div className={styles.page}>

      <PageHeader
        title="Candidates"
        subtitle={loading ? 'Loading…' : `${total} total · ${shortlisted} shortlisted · ${interviewing} interviewing`}
        icon={Users}
        iconColor="linear-gradient(135deg,#6366f1,#4f46e5)"
        actions={
          <div className={styles.headerActions}>
            <button className={styles.addBtn} onClick={() => navigate('/candidates/add')}>
              <Plus size={15} strokeWidth={2.5} />
              Add Candidate
            </button>
            <label className={styles.bulkUploadLabel}>
              <FileStack size={15} />
              <span>Bulk Resume Upload</span>
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleBulkFilesChange}
                style={{ display: 'none' }}
              />
            </label>
            {bulkFiles.length > 0 && (
              <button
                className={styles.bulkUploadBtn}
                onClick={handleBulkUpload}
                disabled={bulkUploading}
              >
                {bulkUploading ? 'Uploading…' : `Upload ${bulkFiles.length} resumes`}
              </button>
            )}
          </div>
        }
      />

      {/* ── Status tabs + search bar ── */}
      <div className={styles.toolbar}>
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
          <select
            className={styles.statusSelect}
            value={resumeFilter}
            onChange={e => setResumeFilter(e.target.value)}
          >
            <option value="all">All Candidates</option>
            <option value="with">With Resume</option>
            <option value="without">Without Resume</option>
          </select>
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
      ) : filteredCandidates.length === 0 ? (
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
          {filteredCandidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
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
          {filteredCandidates.map(c => <CandidateRow key={c.id} candidate={c} />)}
        </div>
      )}
    </div>
  )
}
