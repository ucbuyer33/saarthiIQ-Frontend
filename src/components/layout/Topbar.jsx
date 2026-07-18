// src/components/layout/Topbar.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Sun, Moon, LogOut, User, ChevronDown, Menu, Settings } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import styles from './Topbar.module.css'

export default function Topbar({ onToggleSidebarMobile }) {
  const { user, logout, role } = useAuth()
  const { theme, toggle }       = useTheme()
  const navigate                = useNavigate()
  const [query, setQuery]       = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef                 = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ⌘K shortcut focuses search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('topbar-search')?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <header className={styles.topbar}>
      {/* Mobile hamburger */}
      <button className={styles.menuBtn} onClick={onToggleSidebarMobile} aria-label="Menu">
        <Menu size={18} />
      </button>

      {/* Search */}
      <div className={styles.search}>
        <Search size={14} className={styles.searchIcon} />
        <input
          id="topbar-search"
          className={styles.searchInput}
          placeholder="Search candidates, resumes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && navigate(`/candidates?q=${encodeURIComponent(query)}`)}
          aria-label="Search"
        />
        <div className={styles.searchKbd}>
          <span className={styles.kbdKey}>⌘</span>
          <span className={styles.kbdKey}>K</span>
        </div>
      </div>

      {/* Right actions */}
      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className={styles.notifWrap}>
          <button className={styles.iconBtn} aria-label="Notifications">
            <Bell size={16} />
          </button>
          <span className={styles.notifBadge} aria-hidden="true" />
        </div>

        <div className={styles.actionsDivider} aria-hidden="true" />

        {/* User menu */}
        <div className={styles.userMenu} ref={menuRef}>
          <button
            className={styles.userBtn}
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <div className={styles.avatar}>
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.full_name || 'User'}</span>
              <span className={styles.userRole}>{role}</span>
            </div>
            <ChevronDown size={12} className={styles.chevron} />
          </button>

          {menuOpen && (
            <div className={styles.dropdown} role="menu">
              <div className={styles.dropdownHeader}>
                <p className={styles.dropdownName}>{user?.full_name || 'User'}</p>
                <p className={styles.dropdownEmail}>{user?.email || ''}</p>
              </div>

              <button
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => { navigate('/profile'); setMenuOpen(false) }}
              >
                <User size={13} /> Profile
              </button>
              <button
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => { navigate('/settings'); setMenuOpen(false) }}
              >
                <Settings size={13} /> Settings
              </button>

              <div className={styles.dropdownDivider} />

              <button
                className={`${styles.dropdownItem} ${styles.danger}`}
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut size={13} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
