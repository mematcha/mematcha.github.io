import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

import Icon from '../../components/Icon/Icon'
import PublicNav from '../../components/PublicNav/PublicNav'
import { ApiError, apiGet } from '../../lib/api'
import type { Post } from '../../lib/types'
import styles from '../SectionPage.module.css'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    apiGet<Post>(`/api/posts/${slug}`)
      .then(setPost)
      .catch((e) => {
        if (e instanceof ApiError && e.status === 404) setNotFound(true)
      })
  }, [slug])

  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.main}>
        {notFound && (
          <section className={styles.hero}>
            <h1>Post not found</h1>
            <Link to="/blog" className={styles.perspectiveLink}>Back to blog</Link>
          </section>
        )}
        {post && (
          <article className={styles.project} style={{ borderBottom: 'none' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{post.title}</h1>
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
            {post.cover_image_url && (
              <img src={post.cover_image_url} alt="" style={{ width: '100%', borderRadius: 12, marginBottom: '2rem' }} />
            )}
            <div className="markdown-body">
              <ReactMarkdown>{post.body_markdown}</ReactMarkdown>
            </div>
            <div className={styles.perspectives}>
              <Link to="/blog" className={styles.perspectiveLink}>
                <Icon name="ArrowLeft" size={16} /> Back to blog
              </Link>
            </div>
          </article>
        )}
      </main>
      <footer className={styles.footer}>
        <p>❤️ made with Cursor</p>
      </footer>
    </div>
  )
}
