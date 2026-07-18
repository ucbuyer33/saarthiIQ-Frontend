export default function Spinner({ size = 20, className = '' }) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        border: '2px solid var(--color-border)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}
