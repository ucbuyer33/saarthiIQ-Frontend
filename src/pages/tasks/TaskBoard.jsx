// src/pages/tasks/TaskBoard.jsx
import { useEffect, useState } from 'react'
import { Plus, CheckSquare, Trash2, CheckCircle2, Circle, Flag } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { tasksAPI } from '@/lib/api'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import PageHeader from '@/components/ui/PageHeader'
import toast from 'react-hot-toast'
import styles from './TaskBoard.module.css'

const PRIORITY_CONFIG = {
  High:   { color: '#dc2626', bg: 'rgba(220,38,38,0.1)',   label: 'High'   },
  Medium: { color: '#d97706', bg: 'rgba(217,119,6,0.1)',   label: 'Medium' },
  Low:    { color: '#16a34a', bg: 'rgba(22,163,74,0.1)',   label: 'Low'    },
}

export default function TaskBoard() {
  const { user, role } = useAuth()
  const [tasks, setTasks]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [creating, setCreating]         = useState(false)
  const [modalOpen, setModalOpen]       = useState(false)
  const [deletingId, setDeletingId]     = useState(null)
  const [confirmOpen, setConfirmOpen]   = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [form, setForm] = useState({ title: '', priority: 'Medium', status: 'Todo', assigned_to: '' })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => { if (user?.id) setForm(f => ({ ...f, assigned_to: user.id })) }, [user])

  useEffect(() => {
    tasksAPI.getAll()
      .then(r => setTasks(r.data?.results || []))
      .catch(() => { toast.error('Failed to load tasks'); setTasks([]) })
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!form.title.trim() || form.title.trim().length < 2) { toast.error('Title must be at least 2 characters'); return }
    if (!form.assigned_to) { toast.error('Missing assigned user'); return }
    setCreating(true)
    try {
      const res = await tasksAPI.create({ title: form.title.trim(), priority: form.priority, status: form.status, assigned_to: Number(form.assigned_to) })
      setTasks(t => [res.data, ...t])
      toast.success('Task created')
      setModalOpen(false)
      setForm({ title: '', priority: 'Medium', status: 'Todo', assigned_to: user?.id || '' })
    } catch (err) {
      const detail = err?.response?.data?.detail
      toast.error(Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'Failed to create task')
    } finally { setCreating(false) }
  }

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Todo' : 'Completed'
    try {
      await tasksAPI.update(task.id, { status: newStatus })
      setTasks(ts => ts.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
    } catch { toast.error('Failed to update task') }
  }

  const askDelete = (task) => { setSelectedTask(task); setConfirmOpen(true) }

  const handleDelete = async () => {
    if (!selectedTask) return
    setDeletingId(selectedTask.id)
    try {
      await tasksAPI.delete(selectedTask.id)
      setTasks(p => p.filter(t => t.id !== selectedTask.id))
      toast.success('Task deleted')
      setConfirmOpen(false)
      setSelectedTask(null)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete task')
    } finally { setDeletingId(null) }
  }

  const todo      = tasks.filter(t => t.status !== 'Completed')
  const completed = tasks.filter(t => t.status === 'Completed')

  return (
    <div className={styles.page}>

      <PageHeader
        title="Tasks"
        subtitle={`${todo.length} pending · ${completed.length} completed`}
        icon={CheckSquare}
        iconColor="linear-gradient(135deg,#16a34a,#15803d)"
        actions={
          <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
            <Plus size={14} /> New Task
          </button>
        }
      />

      {loading ? (
        <div className={styles.loadingWrap}><Spinner size={24} /></div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Create tasks to track your hiring work."
          action={
            <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
              <Plus size={14} /> Create Task
            </button>
          }
        />
      ) : (
        <div className={styles.lists}>
          {todo.length > 0 && (
            <div className={styles.group}>
              <p className={styles.groupLabel}>To Do <span>{todo.length}</span></p>
              <div className={styles.taskList}>
                {todo.map(t => <TaskRow key={t.id} task={t} role={role} deletingId={deletingId} onToggle={toggleStatus} onDelete={askDelete} />)}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div className={styles.group}>
              <p className={styles.groupLabel}>Completed <span>{completed.length}</span></p>
              <div className={styles.taskList}>
                {completed.map(t => <TaskRow key={t.id} task={t} role={role} deletingId={deletingId} onToggle={toggleStatus} onDelete={askDelete} />)}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Task"
        size="sm"
        footer={
          <>
            <button className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Cancel</button>
            <button className={styles.createBtn} onClick={handleCreate} disabled={creating}>
              {creating ? <Spinner size={13} /> : <><Plus size={13}/> Create</>}
            </button>
          </>
        }
      >
        <div className={styles.modalForm}>
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Title <span className={styles.req}>*</span></label>
            <input className={styles.modalInput} value={form.title} onChange={set('title')} placeholder="e.g. Call candidate" autoFocus />
          </div>
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Priority</label>
            <div className={styles.priorityBtns}>
              {['High','Medium','Low'].map(p => {
                const cfg = PRIORITY_CONFIG[p]
                return (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.priorityBtn} ${form.priority === p ? styles.priorityBtnActive : ''}`}
                    style={form.priority === p ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color } : {}}
                    onClick={() => setForm(f => ({ ...f, priority: p }))}
                  >
                    <Flag size={11} /> {p}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete task?"
        message={selectedTask ? `This will permanently delete "${selectedTask.title}".` : 'This action cannot be undone.'}
        confirmText="Delete"
        cancelText="Cancel"
        confirmTone="danger"
        loading={deletingId === selectedTask?.id}
        onConfirm={handleDelete}
        onClose={() => { if (!deletingId) { setConfirmOpen(false); setSelectedTask(null) } }}
      />
    </div>
  )
}

function TaskRow({ task, role, deletingId, onToggle, onDelete }) {
  const done = task.status === 'Completed'
  const p    = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium
  return (
    <div className={`${styles.taskRow} ${done ? styles.taskRowDone : ''}`}>
      <button type="button" className={styles.checkBtn} onClick={() => onToggle(task)}>
        {done ? <CheckCircle2 size={17} style={{ color: 'var(--color-success)' }} /> : <Circle size={17} style={{ color: 'var(--color-text-faint)' }} />}
      </button>
      <span className={styles.taskTitle}>{task.title}</span>
      <span className={styles.priorityPill} style={{ color: p.color, background: p.bg }}>
        <Flag size={10} />{task.priority}
      </span>
      {role === 'admin' && (
        <button type="button" className={styles.deleteBtn} onClick={() => onDelete(task)} disabled={deletingId === task.id}>
          {deletingId === task.id ? <Spinner size={13} /> : <Trash2 size={14} />}
        </button>
      )}
    </div>
  )
}
