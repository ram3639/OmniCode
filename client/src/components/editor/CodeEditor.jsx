import React, { useRef, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, highlightActiveLine, rectangularSelection, crosshairCursor } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle, indentOnInput, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { useEditorStore } from '../../store/editorStore';
import { useThemeStore } from '../../store/themeStore';

const getLanguageExtension = (lang) => {
  switch (lang) {
    case 'python': return python();
    case 'cpp': case 'c': return cpp();
    case 'java': return java();
    case 'javascript': return javascript();
    default: return python();
  }
};

// Clean dark theme — no blue highlights
const darkTheme = EditorView.theme({
  '&': { backgroundColor: '#111', color: '#d4d4d4' },
  '.cm-content': { fontFamily: "'Consolas', 'Courier New', monospace", fontSize: '14px', lineHeight: '1.6', padding: '16px 0', caretColor: '#C4956A' },
  '.cm-gutters': { backgroundColor: '#111', color: '#555', border: 'none', borderRight: '1px solid #222' },
  '.cm-activeLineGutter': { backgroundColor: '#1a1a1a', color: '#777' },
  '.cm-activeLine': { backgroundColor: 'rgba(255, 255, 255, 0.03)' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#C4956A', borderLeftWidth: '2px' },
  '.cm-selectionBackground': { backgroundColor: 'rgba(196, 149, 106, 0.15) !important' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: 'rgba(196, 149, 106, 0.2) !important' },
  '&.cm-focused': { outline: 'none' },
  '.cm-matchingBracket': { backgroundColor: 'rgba(196, 149, 106, 0.25)', color: '#fff', outline: 'none' },
  '.cm-searchMatch': { backgroundColor: 'rgba(196, 149, 106, 0.2)', outline: '1px solid rgba(196,149,106,0.4)' },
  '.cm-foldGutter': { color: '#444' },
  '.cm-tooltip': { backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#d4d4d4' },
  '.cm-tooltip-autocomplete': { backgroundColor: '#1a1a1a' },
  '.cm-completionLabel': { color: '#d4d4d4' },
  '.cm-completionMatchedText': { color: '#C4956A', textDecoration: 'none' },
  // Syntax colors
  '.cm-keyword': { color: '#C586C0' },
  '.cm-string': { color: '#CE9178' },
  '.cm-number': { color: '#B5CEA8' },
  '.cm-comment': { color: '#6A9955', fontStyle: 'italic' },
  '.cm-variableName': { color: '#9CDCFE' },
  '.cm-function': { color: '#DCDCAA' },
  '.cm-typeName': { color: '#4EC9B0' },
  '.cm-operator': { color: '#d4d4d4' },
  '.cm-propertyName': { color: '#9CDCFE' },
  '.cm-definition': { color: '#DCDCAA' },
}, { dark: true });

const lightTheme = EditorView.theme({
  '&': { backgroundColor: '#fafafa', color: '#1a1a1a' },
  '.cm-content': { fontFamily: "'Consolas', 'Courier New', monospace", fontSize: '14px', lineHeight: '1.6', padding: '16px 0', caretColor: '#C4956A' },
  '.cm-gutters': { backgroundColor: '#f5f5f5', color: '#999', border: 'none', borderRight: '1px solid #e0e0e0' },
  '.cm-activeLineGutter': { backgroundColor: '#eee' },
  '.cm-activeLine': { backgroundColor: 'rgba(0, 0, 0, 0.03)' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#C4956A', borderLeftWidth: '2px' },
  '.cm-selectionBackground': { backgroundColor: 'rgba(196, 149, 106, 0.15) !important' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: 'rgba(196, 149, 106, 0.25) !important' },
  '&.cm-focused': { outline: 'none' },
  '.cm-matchingBracket': { backgroundColor: 'rgba(196, 149, 106, 0.3)', outline: 'none' },
  '.cm-searchMatch': { backgroundColor: 'rgba(196, 149, 106, 0.2)' },
  '.cm-foldGutter': { color: '#bbb' },
});

export default function CodeEditor({ code: propCode, onChange: propOnChange, language: propLang, readOnly = false }) {
  const store = useEditorStore();
  const { theme } = useThemeStore();
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const isExternalUpdate = useRef(false);

  const code = propCode !== undefined ? propCode : store.code;
  const language = propLang || store.language;
  const handleChange = propOnChange || store.setCode;

  useEffect(() => {
    if (!editorRef.current) return;

    const isDark = theme === 'dark';

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && !isExternalUpdate.current) {
        handleChange(update.state.doc.toString());
      }
    });

    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      highlightActiveLine(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightSelectionMatches(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        indentWithTab,
      ]),
      getLanguageExtension(language),
      isDark ? darkTheme : lightTheme,
      updateListener,
      EditorView.lineWrapping,
      EditorState.readOnly.of(readOnly),
    ];

    const state = EditorState.create({ doc: code || '', extensions });
    const view = new EditorView({ state, parent: editorRef.current });
    viewRef.current = view;

    return () => { view.destroy(); viewRef.current = null; };
  }, [language, theme, readOnly]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (code !== currentDoc) {
      isExternalUpdate.current = true;
      view.dispatch({ changes: { from: 0, to: currentDoc.length, insert: code || '' } });
      isExternalUpdate.current = false;
    }
  }, [code]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={editorRef} style={{ position: 'absolute', inset: 0, overflow: 'auto' }} />
      </div>
    </div>
  );
}
