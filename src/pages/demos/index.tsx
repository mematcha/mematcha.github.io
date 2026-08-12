import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Icon from '../../components/Icon/Icon'
import PublicNav from '../../components/PublicNav/PublicNav'
import { apiGet } from '../../lib/api'
import type { Demo } from '../../lib/types'
import styles from '../SectionPage.module.css'

export default function DemosIndex() {
  const [demos, setDemos] = useState<Demo[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiGet<Demo[]>('/api/demos').then(setDemos).catch((e) => setError(e.message))
  }, [])

  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Demos</h1>
          <p className={styles.subtitle}>Interactive demos and live projects.</p>
        </section>
        <section className={styles.content}>
          {error && <p className={styles.subtitle}>Could not load demos. Is the API running?</p>}
          {!error && demos.length === 0 && <p className={styles.subtitle}>No demos published yet.</p>}
          {demos.map((demo) => (
            <article key={demo.id} className={styles.project}>
              <h2>
                <Link to={`/demos/${demo.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {demo.title}
                </Link>
              </h2>
              {demo.description && <p>{demo.description}</p>}
              <div className={styles.perspectives}>
                <Link to={`/demos/${demo.slug}`} className={styles.perspectiveLink}>
                  Open demo <Icon name="ArrowRight" size={16} />
                </Link>
                {demo.repo_url && (
                  <a href={demo.repo_url} target="_blank" rel="noopener noreferrer" className={styles.perspectiveLink}>
                    <Icon name="Github" size={16} /> Source
                  </a>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
      <footer className={styles.footer}>
        <p>❤️ made with Cursor</p>
      </footer>
    </div>
  )
}
