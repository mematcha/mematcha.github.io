import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import styles from '../../../components/admin/Admin.module.css'
import { useToast } from '../../../components/admin/Toast'
import { useAdminApi } from '../../../lib/api'
import type { PerspectiveContent, Project } from '../../../lib/types'

type PerspectiveKey = 'ml_content' | 'swe_content' | 'research_content'

const PERSPECTIVES: { key: PerspectiveKey; label: string }[] = [
  { key: 'ml_content', label: 'ML' },
  { key: 'swe_content', label: 'SWE' },
  { key: 'research_content', label: 'Research' },
]

const EMPTY: Project = {
  id: '', slug: '', title: '', summary: '', ml_content: null, swe_content: null,
  research_content: null, tags: [], featured: false, status: 'draft',
}

const emptyPerspective = (): PerspectiveContent => ({ date: '', tags: [], headings: [] })

export default function ProjectEditor() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const api = useAdminApi()
  const navigate = useNavigate()
  const { show, node } = useToast()

  const [project, setProject] = useState<Project>(EMPTY)
  const [tagsText, setTagsText] = useState('')
  const [active, setActive] = useState<PerspectiveKey>('ml_content')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) return
    void api.get<Project[]>('/api/admin/projects')
      .then((all) => {
        const found = all.find((p) => p.id === id)
        if (found) {
          setProject(found)
          setTagsText((found.tags ?? []).join(', '))
        }
      })
      .catch((e) => show(e.message, true))
  }, [id, isNew]) // eslint-disable-line react-hooks/exhaustive-deps

  const persp = project[active] ?? null

  const setPersp = (updater: (p: PerspectiveContent) => PerspectiveContent) => {
    setProject((proj) => ({ ...proj, [active]: updater(proj[active] ?? emptyPerspective()) }))
  }

  const payload = () => ({
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    ml_content: project.ml_content,
    swe_content: project.swe_content,
    research_content: project.research_content,
    tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    featured: project.featured,
    status: project.status,
  })

  const save = async (): Promise<string | null> => {
    setSaving(true)
    try {
      if (isNew) {
        const created = await api.post<Project>('/api/admin/projects', payload())
        show('Draft created')
        navigate(`/admin/projects/${created.id}`, { replace: true })
        return created.id
      }
      await api.put<Project>(`/api/admin/projects/${project.id}`, payload())
      show('Saved')
      return project.id
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
    const updated = await api.post<Project>(`/api/admin/projects/${savedId}/publish?publish=${publish}`)
    setProject(updated)
    show(publish ? 'Published' : 'Unpublished')
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{isNew ? 'New Project' : 'Edit Project'}</h1>
        <div className={styles.btnGroup}>
          <span className={`${styles.badge} ${project.status === 'published' ? styles.badgePublished : styles.badgeDraft}`}>
            {project.status}
          </span>
          <button className={`${styles.btn} ${styles.btnSecondary}`} disabled={saving} onClick={() => void save()}>Save draft</button>
          {project.status === 'published' ? (
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
            <input value={project.title} onChange={(e) => setProject({ ...project, title: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Slug</label>
            <input value={project.slug} onChange={(e) => setProject({ ...project, slug: e.target.value })} />
          </div>
        </div>
        <div className={styles.field}>
          <label>Summary</label>
          <textarea value={project.summary} onChange={(e) => setProject({ ...project, summary: e.target.value })} />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Tags (comma separated)</label>
            <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>Featured on home page</label>
            <label className={styles.muted} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="checkbox" checked={project.featured}
                onChange={(e) => setProject({ ...project, featured: e.target.checked })} />
              Show in Representative Work
            </label>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tabs}>
          {PERSPECTIVES.map((p) => (
            <button key={p.key} className={active === p.key ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              onClick={() => setActive(p.key)}>
              {p.label}
            </button>
          ))}
        </div>

        {persp === null ? (
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setPersp(() => emptyPerspective())}>
            Add {PERSPECTIVES.find((p) => p.key === active)?.label} perspective
          </button>
        ) : (
          <>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Date</label>
                <input value={persp.date} onChange={(e) => setPersp((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div className={styles.field}>
                <label>Perspective tags (comma separated)</label>
                <input value={persp.tags.join(', ')}
                  onChange={(e) => setPersp((p) => ({ ...p, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }))} />
              </div>
            </div>

            {persp.headings.map((h, idx) => (
              <div key={idx} className={styles.card} style={{ background: '#fafbfc' }}>
                <div className={styles.field}>
                  <label>Heading title</label>
                  <input value={h.title}
                    onChange={(e) => setPersp((p) => {
                      const headings = [...p.headings]
                      headings[idx] = { ...headings[idx], title: e.target.value }
                      return { ...p, headings }
                    })} />
                </div>
                <div className={styles.field}>
                  <label>Heading body</label>
                  <textarea value={h.body}
                    onChange={(e) => setPersp((p) => {
                      const headings = [...p.headings]
                      headings[idx] = { ...headings[idx], body: e.target.value }
                      return { ...p, headings }
                    })} />
                </div>
                <button className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={() => setPersp((p) => ({ ...p, headings: p.headings.filter((_, i) => i !== idx) }))}>
                  Remove section
                </button>
              </div>
            ))}

            <div className={styles.btnGroup} style={{ marginTop: '0.75rem' }}>
              <button className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setPersp((p) => ({ ...p, headings: [...p.headings, { title: '', body: '' }] }))}>
                Add section
              </button>
              <button className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => setProject((proj) => ({ ...proj, [active]: null }))}>
                Remove perspective
              </button>
            </div>
          </>
        )}
      </div>
      {node}
    </>
  )
}
