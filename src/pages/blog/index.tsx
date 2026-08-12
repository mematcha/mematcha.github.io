import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Icon from '../../components/Icon/Icon'
import PublicNav from '../../components/PublicNav/PublicNav'
import { apiGet } from '../../lib/api'
import type { Post } from '../../lib/types'
import styles from '../SectionPage.module.css'

export default function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiGet<Post[]>('/api/posts').then(setPosts).catch((e) => setError(e.message))
  }, [])

  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Blog</h1>
          <p className={styles.subtitle}>Writing on ML systems, RAG, and production engineering.</p>
        </section>
        <section className={styles.content}>
          {error && <p className={styles.subtitle}>Could not load posts. Is the API running?</p>}
          {!error && posts.length === 0 && <p className={styles.subtitle}>No posts published yet.</p>}
          {posts.map((post) => (
            <article key={post.id} className={styles.project}>
              <h2>
                <Link to={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {post.title}
                </Link>
              </h2>
              <div className={styles.projectMeta}>
                {post.published_at && (
                  <span className={styles.metaItem}>
                    <Icon name="Calendar" size={16} /> {new Date(post.published_at).toLocaleDateString()}
                  </span>
                )}
                {post.tags.length > 0 && (
                  <span className={styles.metaItem}>
                    <Icon name="Tag" size={16} /> {post.tags.join(', ')}
                  </span>
                )}
              </div>
              {post.excerpt && <p>{post.excerpt}</p>}
              <div className={styles.perspectives}>
                <Link to={`/blog/${post.slug}`} className={styles.perspectiveLink}>
                  Read more <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Sai Sathwik Matcha. All rights reserved.</p>
      </footer>
    </div>
  )
}
