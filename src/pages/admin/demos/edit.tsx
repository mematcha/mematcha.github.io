import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import styles from '../../../components/admin/Admin.module.css'
import { useToast } from '../../../components/admin/Toast'
import { useAdminApi } from '../../../lib/api'
import type { Demo, DemoType } from '../../../lib/types'

const EMPTY: Demo = {
  id: '', slug: '', title: '', description: '', demo_type: 'link', demo_url: '',
  repo_url: '', project_id: null, status: 'draft',
}

export default function DemoEditor() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const api = useAdminApi()
  const navigate = useNavigate()
  const { show, node } = useToast()

  const [demo, setDemo] = useState<Demo>(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) return
    void api.get<Demo[]>('/api/admin/demos')
      .then((all) => { const found = all.find((d) => d.id === id); if (found) setDemo(found) })
      .catch((e) => show(e.message, true))
  }, [id, isNew]) // eslint-disable-line react-hooks/exhaustive-deps

  const payload = () => ({
    slug: demo.slug, title: demo.title, description: demo.description,
    demo_type: demo.demo_type, demo_url: demo.demo_url, repo_url: demo.repo_url,
    project_id: demo.project_id || null, status: demo.status,
  })

  const save = async (): Promise<string | null> => {
    setSaving(true)
    try {
      if (isNew) {
        const created = await api.post<Demo>('/api/admin/demos', payload())
        show('Draft created')
        navigate(`/admin/demos/${created.id}`, { replace: true })
        return created.id
      }
      await api.put<Demo>(`/api/admin/demos/${demo.id}`, payload())
      show('Saved')
      return demo.id
    } catch (e) {
      show(e instanceof Error ? e.message : 'Save failed', true)
      return null
    } finally {
      setSaving(false)
    }
  }

  const publish = async (publish: boolean) => {
    const savedId = await save()
    if (!savedId) return
    const updated = await api.post<Demo>(`/api/admin/demos/${savedId}/publish?publish=${publish}`)
    setDemo(updated)
    show(publish ? 'Published' : 'Unpublished')
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{isNew ? 'New Demo' : 'Edit Demo'}</h1>
        <div className={styles.btnGroup}>
          <span className={`${styles.badge} ${demo.status === 'published' ? styles.badgePublished : styles.badgeDraft}`}>
            {demo.status}
          </span>
          <button className={`${styles.btn} ${styles.btnSecondary}`} disabled={saving} onClick={() => void save()}>Save draft</button>
          {demo.status === 'published' ? (
            <button className={styles.btn} disabled={saving || isNew} onClick={() => void publish(false)}>Unpublish</button>
          ) : (
            <button className={styles.btn} disabled={saving} onClick={() => void publish(true)}>Publish</button>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Title</label>
            <input value={demo.title} onChange={(e) => setDemo({ ...demo, title: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Slug</label>
            <input value={demo.slug} onChange={(e) => setDemo({ ...demo, slug: e.target.value })} />
          </div>
        </div>
        <div className={styles.field}>
          <label>Description</label>
          <textarea value={demo.description} onChange={(e) => setDemo({ ...demo, description: e.target.value })} />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Type</label>
            <select value={demo.demo_type}
              onChange={(e) => setDemo({ ...demo, demo_type: e.target.value as DemoType })}>
              <option value="link">External link</option>
              <option value="iframe">Embedded iframe</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Demo URL</label>
            <input value={demo.demo_url} onChange={(e) => setDemo({ ...demo, demo_url: e.target.value })}
              placeholder="https://your-demo.streamlit.app" />
          </div>
          <div className={styles.field}>
            <label>Repository URL</label>
            <input value={demo.repo_url} onChange={(e) => setDemo({ ...demo, repo_url: e.target.value })}
              placeholder="https://github.com/…" />
          </div>
        </div>
      </div>
      {node}
    </>
  )
}
