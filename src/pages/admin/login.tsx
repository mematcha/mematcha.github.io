import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import styles from '../../components/admin/Admin.module.css'
import { useAuth } from '../../lib/auth'
import { config } from '../../lib/config'

export default function AdminLogin() {
  const { email, isAdmin, loginWithGoogle, loginDev } = useAuth()
  const navigate = useNavigate()
  const [devEmail, setDevEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (email && isAdmin) return <Navigate to="/admin" replace />

  const handleGoogle = async () => {
    setError(null)
    try {
      await loginWithGoogle()
      navigate('/admin')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed')
    }
  }

  const handleDevSignIn = () => {
    setError(null)
    try {
      loginDev(devEmail)
      navigate('/admin')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed')
    }
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h1>Portfolio CMS</h1>
        <p className={styles.muted}>Sign in with your allowlisted Google account.</p>

        {config.authMode === 'firebase' ? (
          <div className={styles.btnGroup} style={{ flexDirection: 'column', marginTop: '1.5rem' }}>
            <button className={styles.btn} type="button" onClick={() => void handleGoogle()}>
              Continue with Google
            </button>
            <p className={styles.muted} style={{ marginTop: '0.5rem' }}>
              Only allowlisted emails can access the CMS. Other Google accounts are rejected.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem' }}>
            <p className={styles.muted} style={{ marginBottom: '1rem' }}>
              Local mock auth — enter an allowlisted email. Production uses Google sign-in.
            </p>
            <div className={styles.field}>
              <label htmlFor="devEmail">Admin email</label>
              <input
                id="devEmail"
                type="email"
                autoComplete="username"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <button className={styles.btn} type="button" onClick={handleDevSignIn}>
              Sign in
            </button>
          </div>
        )}

        {error && (
          <p className={styles.muted} style={{ color: '#e5484d', marginTop: '1rem' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
