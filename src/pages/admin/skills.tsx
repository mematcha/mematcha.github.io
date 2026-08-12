import { useEffect, useState } from 'react'

import styles from '../../components/admin/Admin.module.css'
import { useToast } from '../../components/admin/Toast'
import { useAdminApi } from '../../lib/api'
import type { SkillCategory } from '../../lib/types'

type Draft = Omit<SkillCategory, 'id'> & { id?: string }

const blank = (order: number): Draft => ({ name: '', items: [], sort_order: order })

export default function SkillsAdmin() {
  const api = useAdminApi()
  const { show, node } = useToast()
  const [items, setItems] = useState<Draft[]>([])

  const load = () => api.get<SkillCategory[]>('/api/admin/skills').then(setItems).catch((e) => show(e.message, true))
  useEffect(() => { void load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const update = (idx: number, key: keyof Draft, value: string | number | string[]) => {
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, [key]: value } : it)))
  }

  const save = async (item: Draft) => {
    const body = { name: item.name, items: item.items, sort_order: Number(item.sort_order) || 0 }
    try {
      if (item.id) await api.put(`/api/admin/skills/${item.id}`, body)
      else await api.post('/api/admin/skills', body)
      show('Saved')
      void load()
    } catch (e) {
      show(e instanceof Error ? e.message : 'Save failed', true)
    }
  }

  const remove = async (item: Draft) => {
    if (!item.id) { setItems((l) => l.filter((i) => i !== item)); return }
    if (!confirm('Delete this category?')) return
    await api.del(`/api/admin/skills/${item.id}`)
    show('Deleted')
    void load()
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Skills</h1>
        <button className={styles.btn} onClick={() => setItems((l) => [...l, blank(l.length)])}>Add category</button>
      </div>
      {items.map((item, idx) => (
        <div key={item.id ?? `new-${idx}`} className={styles.card}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Category name</label>
              <input value={item.name} onChange={(e) => update(idx, 'name', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Sort order</label>
              <input type="number" value={item.sort_order} onChange={(e) => update(idx, 'sort_order', Number(e.target.value))} />
            </div>
          </div>
          <div className={styles.field}>
            <label>Items (one per line)</label>
            <textarea value={item.items.join('\n')}
              onChange={(e) => update(idx, 'items', e.target.value.split('\n').map((b) => b.trim()).filter(Boolean))} />
          </div>
          <div className={styles.btnGroup}>
            <button className={styles.btn} onClick={() => void save(item)}>Save</button>
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => void remove(item)}>Delete</button>
          </div>
        </div>
      ))}
      {items.length === 0 && <p className={styles.muted}>No skill categories yet.</p>}
      {node}
    </>
  )
}
