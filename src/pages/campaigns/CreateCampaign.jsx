import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { campaignsAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

function getErrorMessage(err) {
  const detail = err?.response?.data?.detail

  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map(d => d.msg).join(', ')
  return 'Failed to create campaign'
}

export default function CreateCampaign() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    campaign_name: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await campaignsAPI.create(form)
      toast.success('Campaign created')
      navigate('/campaigns')
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <PageHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => navigate('/campaigns')}
              type="button"
            >
              <ArrowLeft size={18} />
            </button>
            Create Campaign
          </div>
        }
      />

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="label">Campaign Name *</label>
            <input
              className="input"
              required
              minLength={3}
              value={form.campaign_name}
              onChange={set('campaign_name')}
              placeholder="Summer 2026 Outreach"
            />
          </div>

          <div className="form-group">
            <label className="label">Subject *</label>
            <input
              className="input"
              required
              minLength={5}
              value={form.subject}
              onChange={set('subject')}
              placeholder="Exciting opportunity for your profile"
            />
          </div>

          <div className="form-group">
            <label className="label">Message Template *</label>
            <textarea
              className="input textarea"
              rows={6}
              required
              value={form.message}
              onChange={set('message')}
              placeholder="Hello {{name}}, we found your profile interesting..."
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/campaigns')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Spinner size={14} /> : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}