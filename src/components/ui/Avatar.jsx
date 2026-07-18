export default function Avatar({ name, size = 36, src, className = '' }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const colors = [
    '#01696f','#2563eb','#7c3aed','#db2777','#d97706','#059669'
  ]
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length]

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
        className={className}
      />
    )
  }

  return (
    <div
      className={className}
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: color,
        color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 600,
        flexShrink: 0,
        userSelect: 'none',
      }}
      aria-label={name}
    >
      {initials}
    </div>
  )
}
