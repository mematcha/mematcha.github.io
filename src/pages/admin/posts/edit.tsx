import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import styles from '../../../components/admin/Admin.module.css'
import MarkdownEditor from '../../../components/admin/MarkdownEditor'
import { useToast } from '../../../components/admin/Toast'
import { useAutoSlug } from '../../../components/admin/useAutoSlug'
import { useAdminApi } from '../../../lib/api'
import type { Post } from '../../../lib/types'

const EMPTY: Post = {
  id: '', slug: '', title: '', excerpt: '', body_markdown: '', cover_image_url: '',
  tags: [], status: 'draft',
}

export default function PostEditor() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const api = useAdminApi()
  const navigate = useNavigate()
  const { show, node } = useToast()
  const fileInput = useRef<HTMLInputElement>(null)
  const { onTitleChange, onSlugChange, onSlugBlur, setSlugLocked } = useAutoSlug(isNew)

  const [post, setPost] = useState<Post>(EMPTY)
  const [tagsText, setTagsText] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) return
    void api.get<Post[]>('/api/admin/posts')
      .then((posts) => {
        const found = posts.find((p) => p.id === id)
        if (found) {
          setPost(found)
          setTagsText((found.tags ?? []).join(', '))
          setSlugLocked(true)
        }
      })
      .catch((e) => show(e.message, true))
  }, [id, isNew]) // eslint-disable-line react-hooks/exhaustive-deps

  const payload = () => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body_markdown: post.body_markdown,
    cover_image_url: post.cover_image_url,
    tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    status: post.status,
  })

  const save = async (): Promise<string | null> => {
    setSaving(true)
    try {
      if (isNew) {
        const created = await api.post<Post>('/api/admin/posts', payload())
        setPost(created)
        setSlugLocked(true)
        show('Draft created')
        navigate(`/admin/posts/${created.id}`, { replace: true })
        return created.id
      }
      const updated = await api.put<Post>(`/api/admin/posts/${post.id}`, payload())
      setPost(updated)
      show('Saved')
      return post.id
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
    const updated = await api.post<Post>(`/api/admin/posts/${savedId}/publish?publish=${publish}`)
    setPost(updated)
    show(publish ? 'Published' : 'Unpublished')
  }

  const upload = async (file: File) => {
    try {
      const url = await api.uploadFile(file)
      setPost((p) => ({ ...p, cover_image_url: url }))
      show('Image uploaded')
    } catch (e) {
      show(e instanceof Error ? e.message : 'Upload failed', true)
    }
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{isNew ? 'New Post' : 'Edit Post'}</h1>
        <div className={styles.btnGroup}>
          <span className={`${styles.badge} ${post.status === 'published' ? styles.badgePublished : styles.badgeDraft}`}>
            {post.status}
          </span>
          <button className={`${styles.btn} ${styles.btnSecondary}`} disabled={saving} onClick={() => void save()}>
            Save draft
          </button>
          {post.status === 'published' ? (
            <button className={styles.btn} disabled={saving || isNew} onClick={() => void publish(false)}>
              Unpublish
            </button>
          ) : (
            <button className={styles.btn} disabled={saving} onClick={() => void publish(true)}>
              Publish
            </button>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Title</label>
            <input
              value={post.title}
              onChange={(e) => {
                const title = e.target.value
                setPost((p) => {
                  const next = { ...p, title }
                  onTitleChange(title, (slug) => { next.slug = slug })
                  return next
                })
              }}
            />
          </div>
          <div className={styles.field}>
            <label>Slug</label>
            <input
              value={post.slug}
              onChange={(e) => onSlugChange(e.target.value, (slug) => setPost((p) => ({ ...p, slug })))}
              onBlur={(e) => onSlugBlur(e.target.value, (slug) => setPost((p) => ({ ...p, slug })))}
            />
            <span className={styles.muted}>Auto-filled from title; collisions become -2, -3, … on save.</span>
          </div>
        </div>
        <div className={styles.field}>
          <label>Excerpt</label>
          <input value={post.excerpt} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Tags (comma separated)</label>
            <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>Cover image</label>
            <div className={styles.btnGroup}>
              <input ref={fileInput} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0])} />
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => fileInput.current?.click()}>
                Upload image
              </button>
              {post.cover_image_url && <span className={styles.muted}>Set</span>}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <label className={styles.muted}>Body (Markdown)</label>
        <MarkdownEditor value={post.body_markdown} onChange={(v) => setPost({ ...post, body_markdown: v })} />
      </div>
      {node}
    </>
  )
}
