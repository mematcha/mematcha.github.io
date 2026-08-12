import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import styles from '../../components/admin/Admin.module.css'
import { useAuth } from '../../lib/auth'
import { config } from '../../lib/config'

export default function AdminLogin() {
  const { email, isAdmin, loginWithGoogle, loginWithGithub, loginDev } = useAuth()
  const navigate = useNavigate()
  const [devEmail, setDevEmail] = useState(config.adminEmails[0] ?? '')
  const [error, setError] = useState<string | null>(null)

  if (email && isAdmin) return <Navigate to="/admin" replace />

  const handleProvider = async (fn: () => Promise<void>) => {
    setError(null)
    try {
      await fn()
      navigate('/admin')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed')
    }
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h1>Portfolio CMS</h1>
        <p className={styles.muted}>Sign in to manage your content.</p>

        {config.authMode === 'firebase' ? (
          <div className={styles.btnGroup} style={{ flexDirection: 'column', marginTop: '1.5rem' }}>
            <button className={styles.btn} onClick={() => void handleProvider(loginWithGoogle)}>
              Continue with Google
            </button>
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => void handleProvider(loginWithGithub)}
            >
              Continue with GitHub
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem' }}>
            <div className={styles.field}>
              <label htmlFor="devEmail">Dev sign-in (local mock auth)</label>
              <input
                id="devEmail"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <button
              className={styles.btn}
              onClick={() => {
                loginDev(devEmail)
                navigate('/admin')
              }}
            >
              Sign in
            </button>
            <p className={styles.muted} style={{ marginTop: '0.75rem' }}>
              Mock mode mints a <code>dev:&lt;email&gt;</code> token that the backend accepts only for
              allowlisted emails.
            </p>
          </div>
        )}

        {error && <p className={`${styles.muted}`} style={{ color: '#e5484d', marginTop: '1rem' }}>{error}</p>}
      </div>
    </div>
  )
}
