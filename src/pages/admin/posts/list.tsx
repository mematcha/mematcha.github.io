import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from '../../../components/admin/Admin.module.css'
import { useToast } from '../../../components/admin/Toast'
import { useAdminApi } from '../../../lib/api'
import type { Post } from '../../../lib/types'

export default function PostsList() {
  const api = useAdminApi()
  const { show, node } = useToast()
  const [posts, setPosts] = useState<Post[]>([])

  const load = () => api.get<Post[]>('/api/admin/posts').then(setPosts).catch((e) => show(e.message, true))
  useEffect(() => { void load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await api.del(`/api/admin/posts/${id}`)
    show('Post deleted')
    void load()
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Blog Posts</h1>
        <Link className={styles.btn} to="/admin/posts/new">New post</Link>
      </div>
      <ul className={styles.list}>
        {posts.map((p) => (
          <li key={p.id} className={styles.listItem}>
            <div className={styles.listItemMain}>
              <span className={styles.listItemTitle}>{p.title || '(untitled)'}</span>
              <span className={styles.muted}>/{p.slug}</span>
            </div>
            <div className={styles.btnGroup}>
              <span className={`${styles.badge} ${p.status === 'published' ? styles.badgePublished : styles.badgeDraft}`}>
                {p.status}
              </span>
              <Link className={`${styles.btn} ${styles.btnSecondary}`} to={`/admin/posts/${p.id}`}>Edit</Link>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => void remove(p.id)}>Delete</button>
            </div>
          </li>
        ))}
        {posts.length === 0 && <p className={styles.muted}>No posts yet.</p>}
      </ul>
      {node}
    </>
  )
}
