import { useEffect, useState } from 'react'
import { dashboardAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'

function formatLabel(key) {
  return key.replace(/_/g, ' ')
}

function renderValue(value) {
  if (typeof value === 'number' || typeof value === 'string') {
    return (
      <p
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--color-text)',
          fontVariantNumeric: 'tabular-nums',
          marginTop: 'var(--space-1)',
        }}
      >
        {value}
      </p>
    )
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return (
      <div
        style={{
          marginTop: 'var(--space-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}
      >
        {Object.entries(value).map(([k, v]) => (
          <div
            key={k}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-3)',
              padding: 'var(--space-2) 0',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
              }}
            >
              {formatLabel(k)}
            </span>
            <span
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                color: 'var(--color-text)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {String(v)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <pre
      style={{
        marginTop: 'var(--space-2)',
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface-offset)',
        overflowX: 'auto',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text)',
      }}
    >
      {JSON.stringify(value, null, 2)}
    </pre>
  )
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI
      .getAnalytics()
      .then((r) => setData(r.data))
      .catch((err) => {
        console.error('Failed to load analytics', err)
        setData(null)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Hiring pipeline trends and performance metrics"
      />

      {loading ? (
        <Spinner size={24} />
      ) : data ? (
        <div
          style={{
            display: 'grid',
            gap: 'var(--space-4)',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
        >
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="card" style={{ padding: 'var(--space-5)' }}>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {formatLabel(key)}
              </p>
              {renderValue(value)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">No analytics data available yet.</p>
      )}
    </div>
  )
}