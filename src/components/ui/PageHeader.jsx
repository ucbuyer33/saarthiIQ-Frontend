// src/components/ui/PageHeader.jsx
export default function PageHeader({ title, subtitle, actions, icon: Icon, iconColor }) {
  return (
    <div className="page-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {Icon && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md, 10px)',
              background: iconColor || 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #4f46e5))',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <Icon size={20} />
          </div>
        )}
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  )
}
