import { useEffect, useRef, useState } from 'react'

import styles from '../../components/admin/Admin.module.css'
import { useToast } from '../../components/admin/Toast'
import { apiGet, useAdminApi } from '../../lib/api'
import type { Profile } from '../../lib/types'

const EMPTY: Profile = {
  id: 'profile', name: '', tagline: '', bio: '', profile_image_url: '', social_links: [],
}

export default function ProfileAdmin() {
  const api = useAdminApi()
  const { show, node } = useToast()
  const fileInput = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<Profile>(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void apiGet<Profile>('/api/profile').then(setProfile).catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await api.put('/api/admin/profile', {
        name: profile.name, tagline: profile.tagline, bio: profile.bio,
        profile_image_url: profile.profile_image_url, social_links: profile.social_links,
      })
      show('Profile saved')
    } catch (e) {
      show(e instanceof Error ? e.message : 'Save failed', true)
    } finally {
      setSaving(false)
    }
  }

  const upload = async (file: File) => {
    try {
      const url = await api.uploadFile(file)
      setProfile((p) => ({ ...p, profile_image_url: url }))
      show('Image uploaded')
    } catch (e) {
      show(e instanceof Error ? e.message : 'Upload failed', true)
    }
  }

  const updateLink = (idx: number, key: 'label' | 'url' | 'icon', value: string) => {
    setProfile((p) => {
      const social_links = [...p.social_links]
      social_links[idx] = { ...social_links[idx], [key]: value }
      return { ...p, social_links }
    })
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Profile</h1>
        <button className={styles.btn} disabled={saving} onClick={() => void save()}>Save</button>
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Name</label>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Tagline</label>
            <input value={profile.tagline} onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} />
          </div>
        </div>
        <div className={styles.field}>
          <label>Bio</label>
          <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
        </div>
        <div className={styles.field}>
          <label>Profile image</label>
          <div className={styles.btnGroup}>
            <input value={profile.profile_image_url}
              onChange={(e) => setProfile({ ...profile, profile_image_url: e.target.value })}
              placeholder="/images/profile/profile.jpg or uploaded URL" />
            <input ref={fileInput} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0])} />
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => fileInput.current?.click()}>
              Upload
            </button>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.listItemTitle} style={{ marginBottom: '0.75rem' }}>Social links</div>
        {profile.social_links.map((link, idx) => (
          <div key={idx} className={styles.row}>
            <div className={styles.field}>
              <label>Label</label>
              <input value={link.label} onChange={(e) => updateLink(idx, 'label', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>URL</label>
              <input value={link.url} onChange={(e) => updateLink(idx, 'url', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Icon (lucide name)</label>
              <input value={link.icon ?? ''} onChange={(e) => updateLink(idx, 'icon', e.target.value)} />
            </div>
            <button className={`${styles.btn} ${styles.btnDanger}`} style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}
              onClick={() => setProfile((p) => ({ ...p, social_links: p.social_links.filter((_, i) => i !== idx) }))}>
              Remove
            </button>
          </div>
        ))}
        <button className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => setProfile((p) => ({ ...p, social_links: [...p.social_links, { label: '', url: '', icon: '' }] }))}>
          Add link
        </button>
      </div>
      {node}
    </>
  )
}
