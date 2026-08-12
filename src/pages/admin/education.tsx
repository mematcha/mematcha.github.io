import { useEffect, useState } from 'react'

import styles from '../../components/admin/Admin.module.css'
import { useToast } from '../../components/admin/Toast'
import { useAdminApi } from '../../lib/api'
import type { Education } from '../../lib/types'

type Draft = Omit<Education, 'id'> & { id?: string }

const blank = (order: number): Draft => ({
  institution: '', degree: '', location: '', date_range: '', sort_order: order,
})

export default function EducationAdmin() {
  const api = useAdminApi()
  const { show, node } = useToast()
  const [items, setItems] = useState<Draft[]>([])

  const load = () => api.get<Education[]>('/api/admin/education').then(setItems).catch((e) => show(e.message, true))
  useEffect(() => { void load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const update = (idx: number, key: keyof Draft, value: string | number) => {
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, [key]: value } : it)))
  }

  const save = async (item: Draft) => {
    const body = { institution: item.institution, degree: item.degree, location: item.location,
      date_range: item.date_range, sort_order: Number(item.sort_order) || 0 }
    try {
      if (item.id) await api.put(`/api/admin/education/${item.id}`, body)
      else await api.post('/api/admin/education', body)
      show('Saved')
      void load()
    } catch (e) {
      show(e instanceof Error ? e.message : 'Save failed', true)
    }
  }

  const remove = async (item: Draft) => {
    if (!item.id) { setItems((l) => l.filter((i) => i !== item)); return }
    if (!confirm('Delete this entry?')) return
    await api.del(`/api/admin/education/${item.id}`)
    show('Deleted')
    void load()
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Education</h1>
        <button className={styles.btn} onClick={() => setItems((l) => [...l, blank(l.length)])}>Add entry</button>
      </div>
      {items.map((item, idx) => (
        <div key={item.id ?? `new-${idx}`} className={styles.card}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Institution</label>
              <input value={item.institution} onChange={(e) => update(idx, 'institution', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Degree</label>
              <input value={item.degree} onChange={(e) => update(idx, 'degree', e.target.value)} />
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
          <div className={styles.btnGroup}>
            <button className={styles.btn} onClick={() => void save(item)}>Save</button>
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => void remove(item)}>Delete</button>
          </div>
        </div>
      ))}
      {items.length === 0 && <p className={styles.muted}>No education entries yet.</p>}
      {node}
    </>
  )
}
