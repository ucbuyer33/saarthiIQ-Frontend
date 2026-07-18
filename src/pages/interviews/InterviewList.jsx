import { useEffect, useState } from 'react'
import { Plus, Calendar, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { interviewsAPI } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/ui/PageHeader'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function InterviewList() {
  const navigate = useNavigate()
  const { role } = useAuth()

  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    interviewsAPI.getAll()
      .then(res => setInterviews(res.data || []))
      .catch((err) => {
        console.error(err)
        toast.error('Failed to load interviews')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this scheduled interview?')
    if (!confirmed) return

    try {
      setDeletingId(id)
      await interviewsAPI.delete(id)
      setInterviews(prev => prev.filter(iv => iv.id !== id))
      toast.success('Interview deleted')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Failed to delete interview')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Interviews"
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/interviews/schedule')}>
            <Plus size={14} /> Schedule Interview
          </button>
        }
      />

      {loading ? (
        <Spinner size={24} />
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled"
          description="Schedule your first interview."
          action={
            <button className="btn btn-primary" onClick={() => navigate('/interviews/schedule')}>
              <Plus size={14} /> Schedule
            </button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {interviews.map(iv => (
            <div
              key={iv.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                padding: 'var(--space-4)',
              }}
            >
              <Calendar size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />

              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  {iv.candidate_name || iv.candidate_id}
                </p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                  {iv.interview_type} • {iv.interview_date ? new Date(iv.interview_date).toLocaleString() : ''}
                </p>
                {iv.interviewer_name && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                    Interviewer: {iv.interviewer_name}
                  </p>
                )}
              </div>

              <Badge status={iv.status || 'Scheduled'} />

              {role === 'admin' && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleDelete(iv.id)}
                  disabled={deletingId === iv.id}
                  style={{ color: 'var(--color-error)' }}
                  aria-label="Delete interview"
                  title="Delete interview"
                >
                  {deletingId === iv.id ? <Spinner size={14} /> : <Trash2 size={16} />}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}