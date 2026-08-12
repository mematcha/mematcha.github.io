import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'

import { config, isAdminEmail } from './config'
import { getFirebaseAuth } from './firebase'

const DEV_TOKEN_KEY = 'cms.devToken'

interface AuthState {
  email: string | null
  ready: boolean
  isAdmin: boolean
  getToken: () => Promise<string | null>
  loginWithGoogle: () => Promise<void>
  loginDev: (email: string) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const mock = config.authMode !== 'firebase'
  const [email, setEmail] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)

  useEffect(() => {
    if (mock) {
      const token = localStorage.getItem(DEV_TOKEN_KEY)
      if (token?.startsWith('dev:')) {
        const stored = token.slice('dev:'.length)
        // Drop any previously saved non-allowlisted mock session.
        if (isAdminEmail(stored)) setEmail(stored)
        else localStorage.removeItem(DEV_TOKEN_KEY)
      }
      setReady(true)
      return
    }
    const auth = getFirebaseAuth()
    if (!auth) {
      setReady(true)
      return
    }
    return onAuthStateChanged(auth, async (user) => {
      if (user && !isAdminEmail(user.email)) {
        await signOut(auth)
        setFirebaseUser(null)
        setEmail(null)
        setReady(true)
        return
      }
      setFirebaseUser(user)
      setEmail(user?.email ?? null)
      setReady(true)
    })
  }, [mock])

  const getToken = useCallback(async (): Promise<string | null> => {
    if (mock) return localStorage.getItem(DEV_TOKEN_KEY)
    if (!firebaseUser) return null
    return firebaseUser.getIdToken()
  }, [mock, firebaseUser])

  const loginDev = useCallback((devEmail: string) => {
    const normalized = devEmail.trim().toLowerCase()
    if (!isAdminEmail(normalized)) {
      throw new Error(`${normalized || '(empty)'} is not authorized for admin access`)
    }
    const token = `dev:${normalized}`
    localStorage.setItem(DEV_TOKEN_KEY, token)
    setEmail(normalized)
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error('Firebase is not configured')
    const result = await signInWithPopup(auth, new GoogleAuthProvider())
    const signedInEmail = result.user.email
    if (!isAdminEmail(signedInEmail)) {
      await signOut(auth)
      throw new Error(
        `${signedInEmail ?? 'This account'} is not authorized for admin access`,
      )
    }
  }, [])

  const logout = useCallback(async () => {
    if (mock) {
      localStorage.removeItem(DEV_TOKEN_KEY)
      setEmail(null)
      return
    }
    const auth = getFirebaseAuth()
    if (auth) await signOut(auth)
    setFirebaseUser(null)
    setEmail(null)
  }, [mock])

  const value = useMemo<AuthState>(
    () => ({
      email,
      ready,
      isAdmin: isAdminEmail(email),
      getToken,
      loginWithGoogle,
      loginDev,
      logout,
    }),
    [email, ready, getToken, loginWithGoogle, loginDev, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
