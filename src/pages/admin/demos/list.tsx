import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from '../../../components/admin/Admin.module.css'
import { useToast } from '../../../components/admin/Toast'
import { useAdminApi } from '../../../lib/api'
import type { Demo } from '../../../lib/types'

export default function DemosList() {
  const api = useAdminApi()
  const { show, node } = useToast()
  const [demos, setDemos] = useState<Demo[]>([])

  const load = () => api.get<Demo[]>('/api/admin/demos').then(setDemos).catch((e) => show(e.message, true))
  useEffect(() => { void load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async (id: string) => {
    if (!confirm('Delete this demo?')) return
    await api.del(`/api/admin/demos/${id}`)
    show('Demo deleted')
    void load()
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Demos</h1>
        <Link className={styles.btn} to="/admin/demos/new">New demo</Link>
      </div>
      <ul className={styles.list}>
        {demos.map((d) => (
          <li key={d.id} className={styles.listItem}>
            <div className={styles.listItemMain}>
              <span className={styles.listItemTitle}>{d.title || '(untitled)'}</span>
              <span className={styles.muted}>/{d.slug} · {d.demo_type}</span>
            </div>
            <div className={styles.btnGroup}>
              <span className={`${styles.badge} ${d.status === 'published' ? styles.badgePublished : styles.badgeDraft}`}>
                {d.status}
              </span>
              <Link className={`${styles.btn} ${styles.btnSecondary}`} to={`/admin/demos/${d.id}`}>Edit</Link>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => void remove(d.id)}>Delete</button>
            </div>
          </li>
        ))}
        {demos.length === 0 && <p className={styles.muted}>No demos yet.</p>}
      </ul>
      {node}
    </>
  )
}
