import { useEffect, useState } from 'react'
import { Plus, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { interviewsAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'

export default function InterviewList() {
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    interviewsAPI.getAll()
      .then(res => setInterviews(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
      {loading ? <Spinner size={24} /> : interviews.length === 0 ? (
        <EmptyState icon={Calendar} title="No interviews scheduled" description="Schedule your first interview." action={<button className="btn btn-primary" onClick={() => navigate('/interviews/schedule')}><Plus size={14} /> Schedule</button>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {interviews.map(iv => (
            <div key={iv.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
              <Calendar size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{iv.candidate_name || iv.candidate_id}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>{iv.interview_type} • {iv.scheduled_at ? new Date(iv.scheduled_at).toLocaleString() : ''}</p>
              </div>
              <Badge status={iv.status || 'Scheduled'} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
