'use client'

import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'

interface CodeMirrorEditorProps {
  value: string
  onChange: (value: string) => void
  dark?: boolean
}

const lightTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '13px' },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', monospace",
    padding: '12px 0',
  },
  '.cm-content': { padding: '0 24px', caretColor: '#3b82f6' },
  '.cm-line': { padding: '1px 0', lineHeight: '1.65' },
  '.cm-gutters': { background: '#fafafa', borderRight: '1px solid #e5e7eb', color: '#9ca3af', paddingLeft: '8px' },
  '.cm-activeLineGutter': { background: '#f3f4f6', color: '#6b7280' },
  '.cm-activeLine': { background: '#f8fafc' },
})

const darkTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '13px', backgroundColor: '#0f1117', color: '#c9d1d9' },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', monospace",
    padding: '12px 0',
  },
  '.cm-content': { padding: '0 24px', caretColor: '#58a6ff' },
  '.cm-line': { padding: '1px 0', lineHeight: '1.65' },
  '.cm-gutters': { background: '#161b22', borderRight: '1px solid #21262d', color: '#484f58', paddingLeft: '8px' },
  '.cm-activeLineGutter': { background: '#1c2129', color: '#8b949e' },
  '.cm-activeLine': { background: '#161b22' },
  '.cm-selectionBackground': { backgroundColor: '#264f78 !important' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: '#264f78 !important' },
  '.cm-cursor': { borderLeftColor: '#58a6ff' },
})

export function CodeMirrorEditor({ value, onChange, dark }: CodeMirrorEditorProps) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[
        markdown({ base: markdownLanguage }),
        dark ? darkTheme : lightTheme,
        EditorView.lineWrapping,
      ]}
      theme={dark ? oneDark : 'light'}
      height="100%"
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        highlightActiveLineGutter: true,
        bracketMatching: true,
        indentOnInput: true,
        tabSize: 2,
      }}
    />
  )
}
