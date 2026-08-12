import { useEffect, useRef, useState } from 'react'

import styles from '../../components/admin/Admin.module.css'
import { useToast } from '../../components/admin/Toast'
import { useAdminApi } from '../../lib/api'
import type { MediaItem } from '../../lib/types'

export default function MediaAdmin() {
  const api = useAdminApi()
  const { show, node } = useToast()
  const fileInput = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<MediaItem[]>([])

  const load = () => api.get<MediaItem[]>('/api/admin/media').then(setItems).catch((e) => show(e.message, true))
  useEffect(() => { void load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const upload = async (file: File) => {
    try {
      await api.uploadFile(file)
      show('Uploaded')
      void load()
    } catch (e) {
      show(e instanceof Error ? e.message : 'Upload failed', true)
    }
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Media</h1>
        <div>
          <input ref={fileInput} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0])} />
          <button className={styles.btn} onClick={() => fileInput.current?.click()}>Upload image</button>
        </div>
      </div>
      <div className={styles.mediaGrid}>
        {items.map((m) => (
          <div key={m.id} className={styles.mediaCard}>
            <img src={m.public_url} alt={m.gcs_path} />
            <span>{m.public_url}</span>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className={styles.muted}>No media uploaded yet.</p>}
      {node}
    </>
  )
}
