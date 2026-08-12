import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

import styles from './Admin.module.css'

interface Props {
  value: string
  onChange: (value: string) => void
}

/** Lightweight markdown editor: a textarea with a toggleable live preview. */
export default function MarkdownEditor({ value, onChange }: Props) {
  const [preview, setPreview] = useState(false)

  return (
    <div>
      <div className={styles.tabs}>
        <button
          type="button"
          className={preview ? styles.tab : `${styles.tab} ${styles.tabActive}`}
          onClick={() => setPreview(false)}
        >
          Write
        </button>
        <button
          type="button"
          className={preview ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => setPreview(true)}
        >
          Preview
        </button>
      </div>
      {preview ? (
        <div className={styles.preview}>
          <ReactMarkdown>{value || '_Nothing to preview yet._'}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '100%', minHeight: 320, fontFamily: 'monospace', padding: '0.7rem' }}
          placeholder="Write your post in Markdown…"
        />
      )}
    </div>
  )
}
