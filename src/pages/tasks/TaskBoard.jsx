import { useEffect, useState } from 'react'
import { Plus, CheckSquare } from 'lucide-react'
import { tasksAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/constants'

export default function TaskBoard() {
  const [tasks, setTasks]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [creating, setCreating]   = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm]           = useState({ title: '', priority: 'medium', status: 'Pending' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    tasksAPI.getAll().then(r => setTasks(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!form.title.trim()) return
    setCreating(true)
    try {
      const res = await tasksAPI.create(form)
      setTasks(t => [res.data, ...t])
      toast.success('Task created')
      setModalOpen(false)
      setForm({ title: '', priority: 'medium', status: 'Pending' })
    } catch { toast.error('Failed to create task') } finally { setCreating(false) }
  }

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'Done' ? 'Pending' : 'Done'
    try {
      await tasksAPI.update(task.id, { ...task, status: newStatus })
      setTasks(ts => ts.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
    } catch {}
  }

  return (
    <div>
      <PageHeader title="Tasks" actions={<button className="btn btn-primary" onClick={() => setModalOpen(true)}><Plus size={14} /> New Task</button>} />
      {loading ? <Spinner size={24} /> : tasks.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No tasks yet" description="Create tasks to track your hiring work." action={<button className="btn btn-primary" onClick={() => setModalOpen(true)}><Plus size={14} /> Create Task</button>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {tasks.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}>
              <input type="checkbox" checked={t.status === 'Done'} onChange={() => toggleStatus(t)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }} />
              <span style={{ flex: 1, fontSize: 'var(--text-sm)', textDecoration: t.status === 'Done' ? 'line-through' : 'none', color: t.status === 'Done' ? 'var(--color-text-muted)' : 'var(--color-text)' }}>{t.title}</span>
              <Badge status={t.priority} />
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Task" size="sm"
        footer={
          <><button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={creating}>{creating ? <Spinner size={14} /> : 'Create'}</button></>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group"><label className="label">Title *</label><input className="input" autoFocus value={form.title} onChange={set('title')} placeholder="Task title" /></div>
          <div className="form-group">
            <label className="label">Priority</label>
            <select className="input" value={form.priority} onChange={set('priority')}>{TASK_PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
