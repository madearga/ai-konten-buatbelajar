'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

const CodeMirrorEditor = dynamic(
  () => import('./codemirror-editor').then(m => m.CodeMirrorEditor),
  { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading...</div> }
)

const TipTapVisual = dynamic(
  () => import('./tiptap-editor').then(m => m.TipTapVisual),
  { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading...</div> }
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

// Dark mode color tokens
const dark = {
  bg: '#0f1117',
  sidebar: '#161b22',
  surface: '#1c2129',
  border: '#21262d',
  text: '#c9d1d9',
  textMuted: '#8b949e',
  textDim: '#484f58',
  accent: '#58a6ff',
  accentBg: '#1a3a5c',
  danger: '#f59e0b',
  success: '#3fb950',
  saveBtn: '#238636',
  saveBtnHover: '#2ea043',
}

const light = {
  bg: '#ffffff',
  sidebar: '#fafafa',
  surface: '#f9fafb',
  border: '#e5e7eb',
  text: '#111827',
  textMuted: '#6b7280',
  textDim: '#9ca3af',
  accent: '#3b82f6',
  accentBg: '#eff6ff',
  danger: '#f59e0b',
  success: '#10b981',
  saveBtn: '#3b82f6',
  saveBtnHover: '#2563eb',
}

export function EditorView() {
  const [darkMode, setDarkMode] = useState(false)
  const [editorMode, setEditorMode] = useState<'code' | 'visual'>('visual')
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [content, setContent] = useState('')
  const [rawContent, setRawContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const c = darkMode ? dark : light

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

  // Persist dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('editor-dark')
    if (saved === 'true') setDarkMode(true)
    const savedMode = localStorage.getItem('editor-mode') as 'code' | 'visual' | null
    if (savedMode) setEditorMode(savedMode)
  }, [])
  useEffect(() => {
    localStorage.setItem('editor-dark', String(darkMode))
  }, [darkMode])
  useEffect(() => {
    localStorage.setItem('editor-mode', editorMode)
  }, [editorMode])

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', background: c.bg, color: c.text }}>
      {/* Sidebar */}
      <div style={{
        width: 260,
        minWidth: 260,
        borderRight: `1px solid ${c.border}`,
        background: c.sidebar,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${c.border}` }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: c.text }}>
            🤖 Content Editor
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: c.textDim }}>
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
                borderLeft: selectedFile?.path === file.path ? `3px solid ${c.accent}` : '3px solid transparent',
                background: selectedFile?.path === file.path ? c.accentBg : 'transparent',
                color: selectedFile?.path === file.path ? c.accent : c.textMuted,
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
        <div style={{ padding: 12, borderTop: `1px solid ${c.border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="/docs" style={{ fontSize: 11, color: c.textDim, textDecoration: 'none' }}>← Docs</a>
          <span style={{ color: c.border }}>|</span>
          <a href="/" style={{ fontSize: 11, color: c.textDim, textDecoration: 'none' }}>Home</a>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Light mode' : 'Dark mode'}
            style={{
              background: 'none',
              border: `1px solid ${c.border}`,
              borderRadius: 6,
              padding: '3px 8px',
              cursor: 'pointer',
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div style={{
          padding: '0 16px',
          height: 44,
          borderBottom: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: c.bg,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>
            {selectedFile ? `${selectedFile.icon} ${selectedFile.name}` : 'Pilih file di sidebar'}
          </span>
          <span style={{ fontSize: 11, color: c.textDim, fontFamily: 'monospace' }}>
            {selectedFile ? `${selectedFile.path}.mdx` : ''}
          </span>
          {dirty && (
            <span style={{
              fontSize: 10, color: c.danger, fontWeight: 700,
              background: darkMode ? '#3d2e00' : '#fffbeb', padding: '2px 8px', borderRadius: 10,
            }}>
              Modified
            </span>
          )}
          <div style={{ flex: 1 }} />
          {saveMsg && <span style={{ fontSize: 12, color: c.success, fontWeight: 500 }}>{saveMsg}</span>}
          {selectedFile && (
            <div style={{ display: 'flex', border: `1px solid ${c.border}`, borderRadius: 6, overflow: 'hidden' }}>
              <button
                onClick={() => setEditorMode('visual')}
                style={{
                  padding: '3px 10px', fontSize: 11, fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  background: editorMode === 'visual' ? c.accent : 'transparent',
                  color: editorMode === 'visual' ? '#fff' : c.muted,
                }}
              >✏️ Visual</button>
              <button
                onClick={() => setEditorMode('code')}
                style={{
                  padding: '3px 10px', fontSize: 11, fontWeight: 600,
                  border: 'none', cursor: 'pointer', borderLeft: `1px solid ${c.border}`,
                  background: editorMode === 'code' ? c.accent : 'transparent',
                  color: editorMode === 'code' ? '#fff' : c.muted,
                }}
              >&lt;/&gt; Code</button>
            </div>
          )}
          {selectedFile && (
            <button
              onClick={saveFile}
              disabled={saving || !dirty}
              style={{
                padding: '5px 16px',
                borderRadius: 6,
                border: 'none',
                background: dirty ? c.saveBtn : c.border,
                color: dirty ? '#fff' : c.textDim,
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
            <div style={{ padding: 40, textAlign: 'center', color: c.textDim }}>⏳ Memuat...</div>
          )}
          {!selectedFile && !loading && (
            <div style={{ padding: 60, textAlign: 'center', color: c.textDim }}>
              <p style={{ fontSize: 64, margin: '0 0 16px' }}>📝</p>
              <p style={{ fontSize: 16, color: c.textMuted }}>Pilih halaman dari sidebar untuk mulai mengedit</p>
              <p style={{ fontSize: 12, color: c.textDim, marginTop: 8 }}>Support: MDX, frontmatter, JSX components</p>
            </div>
          )}
          {selectedFile && !loading && editorMode === 'code' && (
            <div style={{ height: '100%', overflow: 'auto' }}>
              <CodeMirrorEditor value={content} onChange={handleEditorChange} dark={darkMode} />
            </div>
          )}
          {selectedFile && !loading && editorMode === 'visual' && (
            <TipTapVisual content={content} onChange={handleEditorChange} dark={darkMode} />
          )}
        </div>

        {/* Status Bar */}
        <div style={{
          height: 24,
          background: c.sidebar,
          borderTop: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          fontSize: 10,
          color: c.textDim,
          gap: 16,
          flexShrink: 0,
        }}>
          <span>MDX</span>
          <span>UTF-8</span>
          {content && <span>{content.split('\n').length} lines</span>}
          {content && <span>{content.length} chars</span>}
          {dirty && <span style={{ color: c.danger }}>● Modified</span>}
          {!dirty && selectedFile && <span style={{ color: c.success }}>● Saved</span>}
        </div>
      </div>
    </div>
  )
}
