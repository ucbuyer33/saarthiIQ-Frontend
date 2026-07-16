import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, FileText, Brain, TrendingUp } from 'lucide-react'
import { candidatesAPI, resumeAPI, notesAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import styles from './CandidateDetail.module.css'

export default function CandidateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [candidate, setCandidate]   = useState(null)
  const [loading, setLoading]       = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [note, setNote]             = useState('')
  const [notes, setNotes]           = useState([])

  useEffect(() => {
    Promise.all([
      candidatesAPI.getById(id),
      notesAPI.getAll(id)
    ]).then(([cRes, nRes]) => {
      setCandidate(cRes.data)
      setNotes(nRes.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await candidatesAPI.delete(id)
      toast.success('Candidate deleted')
      navigate('/candidates')
    } catch { toast.error('Failed to delete') } finally { setDeleting(false) }
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!note.trim()) return
    try {
      const res = await notesAPI.create({ candidate_id: id, content: note })
      setNotes(n => [res.data, ...n])
      setNote('')
    } catch { toast.error('Failed to add note') }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}><Spinner size={32} /></div>
  if (!candidate) return <p>Candidate not found.</p>

  return (
    <div>
      <PageHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button className="btn btn-ghost btn-icon" onClick={() => navigate('/candidates')} aria-label="Back"><ArrowLeft size={18} /></button>
            {candidate.full_name}
          </div>
        }
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => navigate(`/candidates/${id}/edit`)}><Edit size={14} /> Edit</button>
            <button className="btn btn-danger" onClick={() => setDeleteOpen(true)}><Trash2 size={14} /> Delete</button>
          </>
        }
      />

      <div className={styles.layout}>
        {/* Left */}
        <div className={styles.left}>
          <div className="card">
            <div className={styles.profile}>
              <Avatar name={candidate.full_name} size={64} />
              <div>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{candidate.full_name}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{candidate.email}</p>
                <Badge status={candidate.status} />
              </div>
            </div>
            <div className="divider" />
            <dl className={styles.details}>
              {candidate.phone    && <><dt>Phone</dt><dd>{candidate.phone}</dd></>}
              {candidate.location && <><dt>Location</dt><dd>{candidate.location}</dd></>}
              {candidate.experience && <><dt>Experience</dt><dd>{candidate.experience}</dd></>}
            </dl>
          </div>

          {/* AI actions */}
          <div className="card">
            <h3 className="section-title">AI Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <button className="btn btn-secondary" onClick={() => navigate(`/resume/score/${id}`)}><FileText size={14} /> View Resume Score</button>
              <button className="btn btn-secondary" onClick={() => navigate(`/ai/skill-gap?candidate=${id}`)}><TrendingUp size={14} /> Skill Gap Analysis</button>
              <button className="btn btn-secondary" onClick={() => navigate(`/ai/report?candidate=${id}`)}><Brain size={14} /> Generate AI Report</button>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className={styles.right}>
          {/* Skills */}
          {candidate.skills?.length > 0 && (
            <div className="card">
              <h3 className="section-title">Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                {candidate.skills.map(s => <span key={s} className="badge badge-neutral">{s}</span>)}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="card">
            <h3 className="section-title">Notes</h3>
            <form onSubmit={handleAddNote} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <input className="input" placeholder="Add a note..." value={note} onChange={e => setNote(e.target.value)} style={{ flex: 1 }} />
              <button type="submit" className="btn btn-primary">Add</button>
            </form>
            {notes.length === 0
              ? <p className="text-muted text-sm">No notes yet.</p>
              : notes.map(n => (
                  <div key={n.id} style={{ padding: 'var(--space-3)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    <p>{n.content}</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>{new Date(n.created_at).toLocaleDateString()}</p>
                  </div>
                ))
            }
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Candidate"
        message={`Are you sure you want to delete ${candidate.full_name}? This cannot be undone.`}
      />
    </div>
  )
}
