import { useEffect, useState } from 'react'
import { Plus, Megaphone, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { campaignsAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'

export default function CampaignList() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    campaignsAPI
      .getAll()
      .then((r) => setCampaigns(r.data?.results || []))
      .catch((err) => {
        console.error('Failed to load campaigns', err)
        setCampaigns([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this campaign?')
    if (!confirmed) return

    try {
      await campaignsAPI.delete(id)
      setCampaigns(prev => prev.filter(c => c.id !== id))
      toast.success('Campaign deleted')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Failed to delete campaign')
    }
  }

  return (
    <div>
      <PageHeader
        title="Campaigns"
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/campaigns/create')}>
            <Plus size={14} /> New Campaign
          </button>
        }
      />

      {loading ? (
        <Spinner size={24} />
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Create outreach campaigns to engage candidates."
          action={
            <button className="btn btn-primary" onClick={() => navigate('/campaigns/create')}>
              <Plus size={14} /> Create Campaign
            </button>
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gap: 'var(--space-4)',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
        >
          {campaigns.map((c) => (
            <div key={c.id} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 'var(--space-3)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>
                  {c.campaign_name}
                </h3>
                <Badge status={c.status || 'Scheduled'} />
              </div>

              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--text-sm)',
                  marginTop: 'var(--space-2)',
                }}
              >
                {c.subject}
              </p>

              <p
                style={{
                  color: 'var(--color-text-faint)',
                  fontSize: 'var(--text-xs)',
                  marginTop: 'var(--space-2)',
                }}
              >
                {c.message}
              </p>

              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-faint)',
                  marginTop: 'var(--space-3)',
                }}
              >
                {c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}
              </p>

              {role === 'admin' && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleDelete(c.id)}
                  style={{ color: 'var(--color-error)', marginTop: 'var(--space-3)' }}
                  aria-label="Delete campaign"
                  title="Delete campaign"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
