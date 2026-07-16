import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { campaignsAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function CreateCampaign() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name: '', description: '', message: '' })
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await campaignsAPI.create(form)
      toast.success('Campaign created')
      navigate('/campaigns')
    } catch { toast.error('Failed to create') } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <PageHeader title={<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}><button className="btn btn-ghost btn-icon" onClick={() => navigate('/campaigns')}><ArrowLeft size={18} /></button>Create Campaign</div>} />
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group"><label className="label">Campaign Name *</label><input className="input" required value={form.name} onChange={set('name')} placeholder="Summer 2026 Outreach" /></div>
          <div className="form-group"><label className="label">Description</label><input className="input" value={form.description} onChange={set('description')} placeholder="Brief description" /></div>
          <div className="form-group"><label className="label">Message Template</label><textarea className="input textarea" rows={5} value={form.message} onChange={set('message')} placeholder="Hello {{name}}, we found your profile..." /></div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/campaigns')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <Spinner size={14} /> : 'Create Campaign'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
