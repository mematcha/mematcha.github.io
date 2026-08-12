import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from '../../components/admin/Admin.module.css'
import { useAdminApi } from '../../lib/api'
import type { Demo, Post, Project } from '../../lib/types'

export default function AdminDashboard() {
  const api = useAdminApi()
  const [posts, setPosts] = useState<Post[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [demos, setDemos] = useState<Demo[]>([])

  useEffect(() => {
    void api.get<Post[]>('/api/admin/posts').then(setPosts).catch(() => {})
    void api.get<Project[]>('/api/admin/projects').then(setProjects).catch(() => {})
    void api.get<Demo[]>('/api/admin/demos').then(setDemos).catch(() => {})
  }, [api])

  const countBy = <T extends { status: string }>(items: T[], status: string) =>
    items.filter((i) => i.status === status).length

  const cards = [
    { label: 'Blog Posts', to: '/admin/posts', total: posts.length,
      published: countBy(posts, 'published'), draft: countBy(posts, 'draft') },
    { label: 'Projects', to: '/admin/projects', total: projects.length,
      published: countBy(projects, 'published'), draft: countBy(projects, 'draft') },
    { label: 'Demos', to: '/admin/demos', total: demos.length,
      published: countBy(demos, 'published'), draft: countBy(demos, 'draft') },
  ]

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Dashboard</h1>
      </div>
      <div className={styles.row}>
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className={styles.card} style={{ flex: '1 1 220px', textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.listItemTitle}>{c.label}</div>
            <div className={styles.muted} style={{ marginTop: '0.5rem' }}>
              {c.total} total · {c.published} published · {c.draft} drafts
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.card}>
        <div className={styles.listItemTitle} style={{ marginBottom: '0.75rem' }}>Quick actions</div>
        <div className={styles.btnGroup}>
          <Link className={styles.btn} to="/admin/posts/new">New blog post</Link>
          <Link className={`${styles.btn} ${styles.btnSecondary}`} to="/admin/projects/new">New project</Link>
          <Link className={`${styles.btn} ${styles.btnSecondary}`} to="/admin/demos/new">New demo</Link>
        </div>
      </div>
    </>
  )
}
