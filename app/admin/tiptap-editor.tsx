'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { TextStyle } from '@tiptap/extension-text-style'
import { Markdown } from 'tiptap-markdown'
import { useEffect } from 'react'

interface TipTapVisualProps {
  content: string
  onChange: (markdown: string) => void
  dark: boolean
}

export function TipTapVisual({ content, onChange, dark }: TipTapVisualProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Mulai menulis...' }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TextStyle,
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: { class: 'tiptap-body' },
    },
    onUpdate: ({ editor }) => {
      const md = editor.storage.markdown.getMarkdown()
      onChange(md)
    },
  })

  // Load content when file changes
  useEffect(() => {
    if (editor && content) {
      // Strip frontmatter for visual editing
      const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '')
      editor.commands.setContent(bodyContent)
    }
  }, [editor, content])

  if (!editor) return null

  const c = dark
    ? { bg: '#0f1117', border: '#21262d', text: '#c9d1d9', muted: '#8b949e', btn: '#30363d', activeBg: '#1a3a5c', activeText: '#58a6ff' }
    : { bg: '#ffffff', border: '#e5e7eb', text: '#374151', muted: '#6b7280', btn: '#f3f4f6', activeBg: '#eff6ff', activeText: '#1d4ed8' }

  const btn = (active: boolean, onClick: () => void, title: string, children: React.ReactNode) => (
    <button
      onClick={onClick}
      title={title}
      type="button"
      style={{
        background: active ? c.activeBg : 'transparent',
        color: active ? c.activeText : c.text,
        border: 'none',
        borderRadius: 4,
        padding: '4px 8px',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  )

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: c.bg }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', gap: 1, padding: '6px 16px', flexWrap: 'wrap', alignItems: 'center',
        borderBottom: `1px solid ${c.border}`, background: c.bg,
      }}>
        {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'Bold', <b>B</b>)}
        {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'Italic', <i>I</i>)}
        {btn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), 'Underline', <u>U</u>)}
        {btn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), 'Strike', <s>S</s>)}
        <span style={{ width: 1, height: 18, background: c.border, margin: '0 4px' }} />
        {btn(editor.isActive('heading', { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), 'H1', 'H1')}
        {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', 'H2')}
        {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3', 'H3')}
        <span style={{ width: 1, height: 18, background: c.border, margin: '0 4px' }} />
        {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), 'Bullet', '• List')}
        {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), 'Numbered', '1. List')}
        {btn(editor.isActive('taskList'), () => editor.chain().focus().toggleTaskList().run(), 'Tasks', '☑ Tasks')}
        <span style={{ width: 1, height: 18, background: c.border, margin: '0 4px' }} />
        {btn(false, () => { const u = prompt('URL:'); if (u) editor.chain().focus().setLink({ href: u }).run() }, 'Link', '🔗')}
        {btn(false, () => { const u = prompt('Image URL:'); if (u) editor.chain().focus().setImage({ src: u }).run() }, 'Image', '🖼️')}
        {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), 'Quote', '❝')}
        {btn(editor.isActive('codeBlock'), () => editor.chain().focus().toggleCodeBlock().run(), 'Code', '<>')}
        <span style={{ width: 1, height: 18, background: c.border, margin: '0 4px' }} />
        {btn(false, () => editor.chain().focus().undo().run(), 'Undo', '↩')}
        {btn(false, () => editor.chain().focus().redo().run(), 'Redo', '↪')}
      </div>

      {/* Editor Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .tiptap-body { outline: none; min-height: 400px; }
        .tiptap-body h1 { font-size: 1.8em; font-weight: 700; margin: 0.8em 0 0.4em; color: ${c.text}; }
        .tiptap-body h2 { font-size: 1.4em; font-weight: 600; margin: 0.6em 0 0.3em; color: ${c.text}; }
        .tiptap-body h3 { font-size: 1.15em; font-weight: 600; margin: 0.5em 0 0.25em; color: ${c.text}; }
        .tiptap-body p { margin: 0.4em 0; line-height: 1.7; font-size: 14.5px; color: ${c.text}; }
        .tiptap-body ul, .tiptap-body ol { padding-left: 1.5em; margin: 0.4em 0; }
        .tiptap-body li { margin: 0.2em 0; line-height: 1.6; font-size: 14.5px; color: ${c.text}; }
        .tiptap-body ul[data-type="taskList"] { list-style: none; padding-left: 0; }
        .tiptap-body ul[data-type="taskList"] li { display: flex; gap: 8px; }
        .tiptap-body ul[data-type="taskList"] li label { margin-top: 4px; }
        .tiptap-body blockquote {
          border-left: 3px solid ${dark ? '#58a6ff' : '#3b82f6'};
          padding: 8px 16px; margin: 1em 0;
          background: ${dark ? '#161b22' : '#f8fafc'};
          color: ${c.muted}; font-style: italic;
        }
        .tiptap-body pre {
          background: ${dark ? '#161b22' : '#1e293b'}; color: #e2e8f0;
          padding: 16px; border-radius: 8px; font-family: 'Fira Code', monospace;
          font-size: 13px; overflow-x: auto; margin: 1em 0;
        }
        .tiptap-body code {
          background: ${dark ? '#21262d' : '#f1f5f9'}; padding: 2px 6px;
          border-radius: 3px; font-family: 'Fira Code', monospace; font-size: 0.9em;
        }
        .tiptap-body pre code { background: none; padding: 0; }
        .tiptap-body a { color: ${dark ? '#58a6ff' : '#3b82f6'}; text-decoration: underline; }
        .tiptap-body img { max-width: 100%; border-radius: 8px; margin: 1em 0; }
        .tiptap-body hr { border: none; border-top: 2px solid ${c.border}; margin: 2em 0; }
        .tiptap-body mark { background: #fef08a; padding: 1px 4px; border-radius: 2px; }
        .tiptap-body p.is-editor-empty:first-child::before {
          content: attr(data-placeholder); float: left; color: ${c.muted}; pointer-events: none; height: 0;
        }
      `}</style>
    </div>
  )
}
