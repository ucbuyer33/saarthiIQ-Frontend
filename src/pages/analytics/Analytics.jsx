import { useEffect, useState } from 'react'
import { dashboardAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'

export default function Analytics() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.getAnalytics().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Hiring pipeline trends and performance metrics" />
      {loading ? <Spinner size={24} /> : (
        <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {data ? (
            Object.entries(data).map(([key, value]) => (
              <div key={key} className="card" style={{ padding: 'var(--space-5)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</p>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums', marginTop: 'var(--space-1)' }}>{typeof value === 'number' ? value : JSON.stringify(value)}</p>
              </div>
            ))
          ) : (
            <p className="text-muted">No analytics data available yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
