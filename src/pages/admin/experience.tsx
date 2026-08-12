import { useEffect, useState } from 'react'

import styles from '../../components/admin/Admin.module.css'
import { useToast } from '../../components/admin/Toast'
import { useAdminApi } from '../../lib/api'
import type { Experience } from '../../lib/types'

type Draft = Omit<Experience, 'id'> & { id?: string }

const blank = (order: number): Draft => ({
  title: '', company: '', location: '', date_range: '', bullets: [], sort_order: order,
})

export default function ExperienceAdmin() {
  const api = useAdminApi()
  const { show, node } = useToast()
  const [items, setItems] = useState<Draft[]>([])

  const load = () => api.get<Experience[]>('/api/admin/experience').then(setItems).catch((e) => show(e.message, true))
  useEffect(() => { void load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const update = (idx: number, key: keyof Draft, value: string | number | string[]) => {
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, [key]: value } : it)))
  }

  const save = async (item: Draft) => {
    const body = { title: item.title, company: item.company, location: item.location,
      date_range: item.date_range, bullets: item.bullets, sort_order: Number(item.sort_order) || 0 }
    try {
      if (item.id) await api.put(`/api/admin/experience/${item.id}`, body)
      else await api.post('/api/admin/experience', body)
      show('Saved')
      void load()
    } catch (e) {
      show(e instanceof Error ? e.message : 'Save failed', true)
    }
  }

  const remove = async (item: Draft) => {
    if (!item.id) { setItems((l) => l.filter((i) => i !== item)); return }
    if (!confirm('Delete this entry?')) return
    await api.del(`/api/admin/experience/${item.id}`)
    show('Deleted')
    void load()
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Experience</h1>
        <button className={styles.btn} onClick={() => setItems((l) => [...l, blank(l.length)])}>Add entry</button>
      </div>
      {items.map((item, idx) => (
        <div key={item.id ?? `new-${idx}`} className={styles.card}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Title</label>
              <input value={item.title} onChange={(e) => update(idx, 'title', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Company</label>
              <input value={item.company} onChange={(e) => update(idx, 'company', e.target.value)} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Location</label>
              <input value={item.location} onChange={(e) => update(idx, 'location', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Date range</label>
              <input value={item.date_range} onChange={(e) => update(idx, 'date_range', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Sort order</label>
              <input type="number" value={item.sort_order} onChange={(e) => update(idx, 'sort_order', Number(e.target.value))} />
            </div>
          </div>
          <div className={styles.field}>
            <label>Bullets (one per line)</label>
            <textarea value={item.bullets.join('\n')}
              onChange={(e) => update(idx, 'bullets', e.target.value.split('\n').map((b) => b.trim()).filter(Boolean))} />
          </div>
          <div className={styles.btnGroup}>
            <button className={styles.btn} onClick={() => void save(item)}>Save</button>
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => void remove(item)}>Delete</button>
          </div>
        </div>
      ))}
      {items.length === 0 && <p className={styles.muted}>No experience entries yet.</p>}
      {node}
    </>
  )
}
