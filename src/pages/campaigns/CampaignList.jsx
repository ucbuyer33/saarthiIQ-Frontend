import { useEffect, useState } from 'react'
import { Plus, Megaphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { campaignsAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'

export default function CampaignList() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    campaignsAPI.getAll().then(r => setCampaigns(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Campaigns" actions={<button className="btn btn-primary" onClick={() => navigate('/campaigns/create')}><Plus size={14} /> New Campaign</button>} />
      {loading ? <Spinner size={24} /> : campaigns.length === 0 ? (
        <EmptyState icon={Megaphone} title="No campaigns yet" description="Create outreach campaigns to engage candidates." action={<button className="btn btn-primary" onClick={() => navigate('/campaigns/create')}><Plus size={14} /> Create Campaign</button>} />
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {campaigns.map(c => (
            <div key={c.id} className="card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>{c.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>{c.description}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: 'var(--space-3)' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
