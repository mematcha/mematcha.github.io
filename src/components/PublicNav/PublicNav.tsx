import { Link, useLocation } from 'react-router-dom'

import styles from '../../pages/SectionPage.module.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/ml', label: 'ML' },
  { to: '/swe', label: 'SWE' },
  { to: '/research', label: 'Research' },
  { to: '/blog', label: 'Blog' },
  { to: '/demos', label: 'Demos' },
]

export default function PublicNav() {
  const { pathname } = useLocation()
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {links.map((link) => {
          const active = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
          return (
            <Link
              key={link.to}
              to={link.to}
              className={active ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
