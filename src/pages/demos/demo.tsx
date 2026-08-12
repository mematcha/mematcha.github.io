import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Icon from '../../components/Icon/Icon'
import PublicNav from '../../components/PublicNav/PublicNav'
import { ApiError, apiGet } from '../../lib/api'
import type { Demo } from '../../lib/types'
import styles from '../SectionPage.module.css'

export default function DemoDetail() {
  const { slug } = useParams()
  const [demo, setDemo] = useState<Demo | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    apiGet<Demo>(`/api/demos/${slug}`)
      .then(setDemo)
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
            <h1>Demo not found</h1>
            <Link to="/demos" className={styles.perspectiveLink}>Back to demos</Link>
          </section>
        )}
        {demo && (
          <article className={styles.project} style={{ borderBottom: 'none' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{demo.title}</h1>
            {demo.description && <p>{demo.description}</p>}

            {demo.demo_type === 'iframe' && demo.demo_url && (
              <iframe
                src={demo.demo_url}
                title={demo.title}
                style={{ width: '100%', height: 600, border: '1px solid #e0e0e0', borderRadius: 12, marginTop: '1.5rem' }}
              />
            )}

            <div className={styles.perspectives}>
              {demo.demo_type === 'link' && demo.demo_url && (
                <a href={demo.demo_url} target="_blank" rel="noopener noreferrer" className={styles.perspectiveLink}>
                  Launch demo <Icon name="ExternalLink" size={16} />
                </a>
              )}
              {demo.repo_url && (
                <a href={demo.repo_url} target="_blank" rel="noopener noreferrer" className={styles.perspectiveLink}>
                  <Icon name="Github" size={16} /> Source code
                </a>
              )}
              <Link to="/demos" className={styles.perspectiveLink}>
                <Icon name="ArrowLeft" size={16} /> Back to demos
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
