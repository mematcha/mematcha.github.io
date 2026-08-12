import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../../lib/auth'
import styles from './Admin.module.css'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/posts', label: 'Blog Posts' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/demos', label: 'Demos' },
  { to: '/admin/profile', label: 'Profile' },
  { to: '/admin/education', label: 'Education' },
  { to: '/admin/experience', label: 'Experience' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/media', label: 'Media' },
]

export default function AdminLayout() {
  const { email, logout } = useAuth()

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Portfolio CMS</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            {link.label}
          </NavLink>
        ))}
        <div className={styles.sidebarFooter}>
          <div>{email}</div>
          <button className={styles.logoutBtn} onClick={() => void logout()}>
            Sign out
          </button>
        </div>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
