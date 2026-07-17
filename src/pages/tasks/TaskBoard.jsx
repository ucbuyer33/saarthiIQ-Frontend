import { useEffect, useState } from 'react'
import { Plus, CheckSquare, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { tasksAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function TaskBoard() {
  const { user, role } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  
  const [form, setForm] = useState({
    title: '',
    priority: 'Medium',
    status: 'Todo',
    assigned_to: '',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    if (user?.id) {
      setForm((f) => ({ ...f, assigned_to: user.id }))
    }
  }, [user])

  useEffect(() => {
    tasksAPI
      .getAll()
      .then((r) => setTasks(r.data?.results || []))
      .catch((err) => {
        console.error('Failed to load tasks', err)
        toast.error('Failed to load tasks')
        setTasks([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!form.title.trim() || form.title.trim().length < 2) {
      toast.error('Title must be at least 2 characters')
      return
    }

    if (!form.assigned_to) {
      toast.error('Missing assigned user')
      return
    }

    setCreating(true)
    try {
      const payload = {
        title: form.title.trim(),
        priority: form.priority,
        status: form.status,
        assigned_to: Number(form.assigned_to),
      }

      const res = await tasksAPI.create(payload)
      setTasks((t) => [res.data, ...t])
      toast.success('Task created')
      setModalOpen(false)
      setForm({
        title: '',
        priority: 'Medium',
        status: 'Todo',
        assigned_to: user?.id || '',
      })
    } catch (err) {
      console.error(err)
      const detail = err?.response?.data?.detail
      const message = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(', ')
        : 'Failed to create task'
      toast.error(message)
    } finally {
      setCreating(false)
    }
  }

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Todo' : 'Completed'
    try {
      await tasksAPI.update(task.id, { status: newStatus })
      setTasks((ts) =>
        ts.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      )
    } catch (err) {
      console.error(err)
      toast.error('Failed to update task')
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this task?')
    if (!confirmed) return

    try {
      setDeletingId(id)
      await tasksAPI.delete(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success('Task deleted')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Failed to delete task')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        actions={
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={14} /> New Task
          </button>
        }
      />

      {loading ? (
        <Spinner size={24} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Create tasks to track your hiring work."
          action={
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <Plus size={14} /> Create Task
            </button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {tasks.map((t) => (
            <div
              key={t.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                padding: 'var(--space-3) var(--space-4)',
              }}
            >
              <input
                type="checkbox"
                checked={t.status === 'Completed'}
                onChange={() => toggleStatus(t)}
                style={{
                  width: 16,
                  height: 16,
                  cursor: 'pointer',
                  accentColor: 'var(--color-primary)',
                }}
              />

              <span
                style={{
                  flex: 1,
                  fontSize: 'var(--text-sm)',
                  textDecoration: t.status === 'Completed' ? 'line-through' : 'none',
                  color:
                    t.status === 'Completed'
                      ? 'var(--color-text-muted)'
                      : 'var(--color-text)',
                }}
              >
                {t.title}
              </span>

              <Badge status={t.priority} />

              {role === 'admin' && (
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  title="Delete task"
                  aria-label="Delete task"
                  style={{ color: 'var(--color-error)' }}
                >
                  {deletingId === t.id ? <Spinner size={14} /> : <Trash2 size={16} />}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Task"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={creating}>
              {creating ? <Spinner size={14} /> : 'Create'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="label">Title *</label>
            <input
              type="text"
              className="input"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Call candidate"
            />
          </div>

          <div className="form-group">
            <label className="label">Priority</label>
            <select className="input" value={form.priority} onChange={set('priority')}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
