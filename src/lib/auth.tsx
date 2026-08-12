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
  GithubAuthProvider,
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
  loginWithGithub: () => Promise<void>
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
      if (token?.startsWith('dev:')) setEmail(token.slice('dev:'.length))
      setReady(true)
      return
    }
    const auth = getFirebaseAuth()
    if (!auth) {
      setReady(true)
      return
    }
    return onAuthStateChanged(auth, (user) => {
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
    const token = `dev:${devEmail.trim().toLowerCase()}`
    localStorage.setItem(DEV_TOKEN_KEY, token)
    setEmail(devEmail.trim().toLowerCase())
  }, [])

  const loginWithProvider = useCallback(
    async (provider: GoogleAuthProvider | GithubAuthProvider) => {
      const auth = getFirebaseAuth()
      if (!auth) throw new Error('Firebase is not configured')
      await signInWithPopup(auth, provider)
    },
    [],
  )

  const loginWithGoogle = useCallback(
    () => loginWithProvider(new GoogleAuthProvider()),
    [loginWithProvider],
  )
  const loginWithGithub = useCallback(
    () => loginWithProvider(new GithubAuthProvider()),
    [loginWithProvider],
  )

  const logout = useCallback(async () => {
    if (mock) {
      localStorage.removeItem(DEV_TOKEN_KEY)
      setEmail(null)
      return
    }
    const auth = getFirebaseAuth()
    if (auth) await signOut(auth)
    setEmail(null)
  }, [mock])

  const value = useMemo<AuthState>(
    () => ({
      email,
      ready,
      isAdmin: isAdminEmail(email),
      getToken,
      loginWithGoogle,
      loginWithGithub,
      loginDev,
      logout,
    }),
    [email, ready, getToken, loginWithGoogle, loginWithGithub, loginDev, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
