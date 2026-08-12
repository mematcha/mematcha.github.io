import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from '../../../components/admin/Admin.module.css'
import { useToast } from '../../../components/admin/Toast'
import { useAdminApi } from '../../../lib/api'
import type { Project } from '../../../lib/types'

export default function ProjectsList() {
  const api = useAdminApi()
  const { show, node } = useToast()
  const [projects, setProjects] = useState<Project[]>([])

  const load = () => api.get<Project[]>('/api/admin/projects').then(setProjects).catch((e) => show(e.message, true))
  useEffect(() => { void load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await api.del(`/api/admin/projects/${id}`)
    show('Project deleted')
    void load()
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Projects</h1>
        <Link className={styles.btn} to="/admin/projects/new">New project</Link>
      </div>
      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.id} className={styles.listItem}>
            <div className={styles.listItemMain}>
              <span className={styles.listItemTitle}>{p.title || '(untitled)'}</span>
              <span className={styles.muted}>/{p.slug}{p.featured ? ' · featured' : ''}</span>
            </div>
            <div className={styles.btnGroup}>
              <span className={`${styles.badge} ${p.status === 'published' ? styles.badgePublished : styles.badgeDraft}`}>
                {p.status}
              </span>
              <Link className={`${styles.btn} ${styles.btnSecondary}`} to={`/admin/projects/${p.id}`}>Edit</Link>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => void remove(p.id)}>Delete</button>
            </div>
          </li>
        ))}
        {projects.length === 0 && <p className={styles.muted}>No projects yet.</p>}
      </ul>
      {node}
    </>
  )
}
