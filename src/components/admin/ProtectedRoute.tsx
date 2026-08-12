import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../../lib/auth'
import styles from './Admin.module.css'

/**
 * Client-side gate for admin routes. This is a UX convenience only; the backend
 * independently enforces the email allowlist on every admin request.
 */
export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { ready, email, isAdmin } = useAuth()
  const location = useLocation()

  if (!ready) {
    return <div className={styles.loginWrap}><div className={styles.loginCard}>Loading…</div></div>
  }

  if (!email) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <h1>Access denied</h1>
          <p className={styles.muted}>
            {email} is not authorized for admin access.
          </p>
        </div>
      </div>
    )
  }

  return children
}
