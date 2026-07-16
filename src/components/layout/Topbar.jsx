import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Sun, Moon, LogOut, User, ChevronDown, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { candidatesAPI } from '@/lib/api'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './Topbar.module.css'

export default function Topbar({ onToggleSidebarMobile }) {
  const { user, logout, role } = useAuth()
  const { theme, toggle }       = useTheme()
  const navigate                = useNavigate()
  const [query, setQuery]       = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className={styles.topbar}>
      {/* Mobile menu button */}
      <button
        className={styles.menuBtn}
        onClick={onToggleSidebarMobile}
        aria-label="Toggle navigation"
      >
        <Menu size={18} />
      </button>

      {/* Search */}
      <div className={styles.search}>
        <Search size={16} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Search candidates, resumes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && navigate(`/candidates?q=${query}`)}
        />
      </div>

      {/* Right actions */}
      <div className={styles.actions}>
        {/* Theme toggle */}
        <button className="btn btn-ghost btn-icon" onClick={toggle} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="btn btn-ghost btn-icon" aria-label="Notifications">
          <Bell size={18} />
        </button>

        {/* User menu */}
        <div className={styles.userMenu}>
          <button className={styles.userBtn} onClick={() => setMenuOpen(o => !o)}>
            <div className={styles.avatar}>
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.full_name || 'User'}</span>
              <span className={styles.userRole}>{role}</span>
            </div>
            <ChevronDown size={14} />
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={() => { navigate('/profile'); setMenuOpen(false) }}>
                <User size={14} /> Profile
              </button>
              <div className="divider" style={{margin: '4px 0'}} />
              <button className={styles.dropdownItem} onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
