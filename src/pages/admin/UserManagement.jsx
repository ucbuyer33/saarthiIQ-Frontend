// saarthiIQ-Frontend\src\pages\admin\UserManagement.jsx
import { useEffect, useState } from 'react'
import { usersAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { UserCog } from 'lucide-react'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    usersAPI.getAll().then(r => setUsers(r.data || [])).catch(() => { }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Manage team members and permissions"
        icon={UserCog}
        iconColor="linear-gradient(135deg,#7c3aed,#6d28d9)"
      />
      {loading ? <Spinner size={24} /> : users.length === 0 ? (
        <EmptyState icon={UserCog} title="No users found" />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                {['User ID', 'User', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                    {u.user_id || '—'}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Avatar name={u.full_name} size={32} />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{u.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{u.email}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}><Badge status={u.role} /></td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
