/**
 * Frontend runtime configuration, read from Vite env vars at build time.
 *
 * `authMode`:
 *  - "mock"     -> a local email sign-in that mints a `dev:<email>` token,
 *                  matching the backend's mock auth (no Firebase needed).
 *  - "firebase" -> real Firebase Auth (Google / GitHub) in production.
 */
export const config = {
  apiUrl: (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:8000',
  authMode: (import.meta.env.VITE_AUTH_MODE as string | undefined) || 'mock',
  adminEmails: ((import.meta.env.VITE_ADMIN_EMAILS as string | undefined) || 'matcha.s@northeastern.edu')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  },
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return config.adminEmails.includes(email.toLowerCase())
}
