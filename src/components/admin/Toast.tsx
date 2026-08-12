import { useCallback, useState } from 'react'

import styles from './Admin.module.css'

interface ToastMessage {
  text: string
  error?: boolean
}

export function useToast() {
  const [message, setMessage] = useState<ToastMessage | null>(null)

  const show = useCallback((text: string, error = false) => {
    setMessage({ text, error })
    window.setTimeout(() => setMessage(null), 3000)
  }, [])

  const node = message ? (
    <div className={`${styles.toast} ${message.error ? styles.toastError : ''}`}>
      {message.text}
    </div>
  ) : null

  return { show, node }
}
