'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

// CodeMirror — lightweight, Turbopack-friendly
const CodeMirrorEditor = dynamic(
  () => import('./codemirror-editor').then(m => m.CodeMirrorEditor),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
        Loading editor...
      </div>
    ),
  }
)

interface FileItem {
  name: string
  path: string
  icon: string
}

const FILES: FileItem[] = [
  { name: 'Ringkasan Panduan', path: '00-index', icon: '📋' },
  { name: 'Kenapa AI?', path: '01-kenapa-ai', icon: '🤖' },
  { name: 'AI Landscape 2026', path: '02-landscape-ai', icon: '🗺️' },
  { name: 'Setup Tools Web', path: '03-tools-web', icon: '🔧' },
  { name: 'Character Creation', path: '04-nano-banana', icon: '🧑' },
  { name: 'Prompt Engineering', path: '05-prompt-engineering', icon: '✍️' },
  { name: 'Video Generation', path: '06-sora-seedance', icon: '🎬' },
  { name: 'UGC Ads FMCG', path: '07-ugc-ads-fmcg', icon: '📱' },
  { name: 'Branded Content', path: '08-branded-content', icon: '🎨' },
  { name: 'Product Integration', path: '09-product-integration', icon: '🛍️' },
  { name: 'Editing & Polish', path: '10-editing-polish', icon: '✂️' },
  { name: 'Workshop Exercises', path: '11-workshop-exercises', icon: '🏋️' },
  { name: 'Referensi', path: '12-referensi', icon: '📚' },
]

export function EditorView() {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [content, setContent] = useState('')
  const [rawContent, setRawContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const loadFile = useCallback(async (file: FileItem) => {
    setLoading(true)
    setDirty(false)
    try {
      const res = await fetch(`/api/content?file=${file.path}`)
      if (!res.ok) throw new Error('Failed to load')
      const text = await res.text()
      setContent(text)
      setRawContent(text)
      setSelectedFile(file)
    } catch (err) {
      console.error(err)
      alert('Gagal memuat file')
    } finally {
      setLoading(false)
    }
  }, [])

  const saveFile = useCallback(async () => {
    if (!selectedFile) return
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: selectedFile.path, content }),
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || 'Failed to save')
      }
      setRawContent(content)
      setDirty(false)
      setSaveMsg('✅ Tersimpan!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan: ' + String(err))
    } finally {
      setSaving(false)
    }
  }, [selectedFile, content])

  const handleEditorChange = useCallback((value: string) => {
    setContent(value)
    setDirty(value !== rawContent)
  }, [rawContent])

  // Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (dirty) saveFile()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [dirty, saveFile])

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: 260,
        minWidth: 260,
        borderRight: '1px solid #e5e7eb',
        background: '#fafafa',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>
            🤖 Content Editor
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9ca3af' }}>
            Edit halaman MDX langsung
          </p>
        </div>
        <nav style={{ flex: 1 }}>
          {FILES.map((file) => (
            <button
              key={file.path}
              onClick={() => loadFile(file)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '9px 16px',
                border: 'none',
                borderLeft: selectedFile?.path === file.path ? '3px solid #3b82f6' : '3px solid transparent',
                background: selectedFile?.path === file.path ? '#eff6ff' : 'transparent',
                color: selectedFile?.path === file.path ? '#1d4ed8' : '#374151',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: selectedFile?.path === file.path ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              <span>{file.icon}</span>
              <span>{file.name}</span>
            </button>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8 }}>
          <a href="/docs" style={{ fontSize: 11, color: '#6b7280', textDecoration: 'none' }}>
            ← Docs
          </a>
          <span style={{ color: '#d1d5db' }}>|</span>
          <a href="/" style={{ fontSize: 11, color: '#6b7280', textDecoration: 'none' }}>
            Home
          </a>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div style={{
          padding: '0 16px',
          height: 44,
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#fff',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
            {selectedFile ? `${selectedFile.icon} ${selectedFile.name}` : 'Pilih file di sidebar'}
          </span>
          <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>
            {selectedFile ? `${selectedFile.path}.mdx` : ''}
          </span>
          {dirty && (
            <span style={{
              fontSize: 10, color: '#f59e0b', fontWeight: 700,
              background: '#fffbeb', padding: '2px 8px', borderRadius: 10,
            }}>
              Modified
            </span>
          )}
          <div style={{ flex: 1 }} />
          {saveMsg && <span style={{ fontSize: 12, color: '#10b981', fontWeight: 500 }}>{saveMsg}</span>}
          {selectedFile && (
            <button
              onClick={saveFile}
              disabled={saving || !dirty}
              style={{
                padding: '5px 16px',
                borderRadius: 6,
                border: 'none',
                background: dirty ? '#3b82f6' : '#d1d5db',
                color: dirty ? '#fff' : '#9ca3af',
                cursor: dirty ? 'pointer' : 'not-allowed',
                fontSize: 12,
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              {saving ? '⏳' : '💾 Save (⌘S)'}
            </button>
          )}
        </div>

        {/* Editor */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {loading && (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>⏳ Memuat...</div>
          )}
          {!selectedFile && !loading && (
            <div style={{ padding: 60, textAlign: 'center', color: '#d1d5db' }}>
              <p style={{ fontSize: 64, margin: '0 0 16px' }}>📝</p>
              <p style={{ fontSize: 16, color: '#9ca3af' }}>Pilih halaman dari sidebar untuk mulai mengedit</p>
              <p style={{ fontSize: 12, color: '#d1d5db', marginTop: 8 }}>Support: MDX, frontmatter, JSX components</p>
            </div>
          )}
          {selectedFile && !loading && (
            <CodeMirrorEditor value={content} onChange={handleEditorChange} />
          )}
        </div>

        {/* Status Bar */}
        <div style={{
          height: 24,
          background: '#f3f4f6',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          fontSize: 10,
          color: '#9ca3af',
          gap: 16,
          flexShrink: 0,
        }}>
          <span>MDX</span>
          <span>UTF-8</span>
          {content && <span>{content.split('\n').length} lines</span>}
          {content && <span>{content.length} chars</span>}
          {dirty && <span style={{ color: '#f59e0b' }}>● Modified</span>}
          {!dirty && selectedFile && <span style={{ color: '#10b981' }}>● Saved</span>}
        </div>
      </div>
    </div>
  )
}
