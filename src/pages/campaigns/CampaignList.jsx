// src/pages/campaigns/CampaignList.jsx
import { useEffect, useState } from 'react'
import { Plus, Megaphone, Trash2, Send, CalendarDays, AlignLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { campaignsAPI } from '@/lib/api'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import styles from './CampaignList.module.css'

const STATUS_CONFIG = {
  Scheduled: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  Sent:      { color: '#16a34a', bg: 'rgba(22,163,74,0.1)'   },
  Draft:     { color: '#d97706', bg: 'rgba(217,119,6,0.1)'   },
  Cancelled: { color: '#dc2626', bg: 'rgba(220,38,38,0.1)'   },
}

export default function CampaignList() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [campaigns, setCampaigns]           = useState([])
  const [loading, setLoading]               = useState(true)
  const [deletingId, setDeletingId]         = useState(null)
  const [confirmOpen, setConfirmOpen]       = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  useEffect(() => {
    campaignsAPI.getAll()
      .then(r => setCampaigns(r.data?.results || []))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false))
  }, [])

  const askDelete = (c) => { setSelectedCampaign(c); setConfirmOpen(true) }

  const handleDelete = async () => {
    if (!selectedCampaign) return
    setDeletingId(selectedCampaign.id)
    try {
      await campaignsAPI.delete(selectedCampaign.id)
      setCampaigns(p => p.filter(c => c.id !== selectedCampaign.id))
      toast.success('Campaign deleted')
      setConfirmOpen(false)
      setSelectedCampaign(null)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete')
    } finally { setDeletingId(null) }
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Campaigns</h1>
          <p className={styles.pageSubtitle}>
            {campaigns.length > 0 ? `${campaigns.length} campaign${campaigns.length > 1 ? 's' : ''}` : 'Outreach campaigns for candidates'}
          </p>
        </div>
        <button className={styles.addBtn} onClick={() => navigate('/campaigns/create')}>
          <Plus size={14} /> New Campaign
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingWrap}><Spinner size={24} /></div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Create outreach campaigns to engage candidates."
          action={
            <button className={styles.addBtn} onClick={() => navigate('/campaigns/create')}>
              <Plus size={14} /> Create Campaign
            </button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {campaigns.map(c => (
            <CampaignCard
              key={c.id}
              campaign={c}
              role={role}
              deletingId={deletingId}
              onDelete={askDelete}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete campaign?"
        message={selectedCampaign ? `This will permanently delete "${selectedCampaign.campaign_name}".` : 'This action cannot be undone.'}
        confirmText="Delete"
        cancelText="Cancel"
        confirmTone="danger"
        loading={deletingId === selectedCampaign?.id}
        onConfirm={handleDelete}
        onClose={() => { if (!deletingId) { setConfirmOpen(false); setSelectedCampaign(null) } }}
      />
    </div>
  )
}

function CampaignCard({ campaign: c, role, deletingId, onDelete }) {
  const status = c.status || 'Scheduled'
  const cfg    = STATUS_CONFIG[status] || STATUS_CONFIG.Scheduled
  const preview = c.message?.slice(0, 100) + (c.message?.length > 100 ? '\u2026' : '')

  return (
    <div className={styles.card}>
      {/* Top row */}
      <div className={styles.cardTop}>
        <div className={styles.cardIconWrap}>
          <Megaphone size={16} />
        </div>
        <span className={styles.statusBadge} style={{ color: cfg.color, background: cfg.bg }}>
          {status}
        </span>
      </div>

      {/* Name & subject */}
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{c.campaign_name}</h3>
        <div className={styles.cardMeta}>
          <Send size={11} />
          <span>{c.subject}</span>
        </div>
      </div>

      {/* Message preview */}
      {preview && (
        <div className={styles.cardPreview}>
          <AlignLeft size={11} className={styles.cardPreviewIcon} />
          <p>{preview}</p>
        </div>
      )}

      {/* Footer */}
      <div className={styles.cardFooter}>
        <span className={styles.cardDate}>
          <CalendarDays size={11} />
          {c.created_at ? new Date(c.created_at).toLocaleDateString(undefined, { day:'numeric', month:'short', year:'numeric' }) : '—'}
        </span>
        {role === 'admin' && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => onDelete(c)}
            disabled={deletingId === c.id}
            aria-label="Delete campaign"
          >
            {deletingId === c.id ? <Spinner size={12} /> : <Trash2 size={13} />}
          </button>
        )}
      </div>
    </div>
  )
}
