import React, { useState, useCallback, useEffect, useRef } from 'react';
import api from '../services/api';
import { Languages, ArrowRight, Copy, Check } from 'lucide-react';

const HELLO_WORLD = {
  python: `# Hello World in Python\ndef greet(name):\n    return f"Hello, {name}!"\n\nif __name__ == "__main__":\n    message = greet("World")\n    print(message)\n`,
  cpp: `// Hello World in C++\n#include <iostream>\n#include <string>\nusing namespace std;\n\nstring greet(const string& name) {\n    return "Hello, " + name + "!";\n}\n\nint main() {\n    cout << greet("World") << endl;\n    return 0;\n}\n`,
  c: `/* Hello World in C */\n#include <stdio.h>\n\nvoid greet(const char* name) {\n    printf("Hello, %s!\\n", name);\n}\n\nint main() {\n    greet("World");\n    return 0;\n}\n`,
  java: `// Hello World in Java\npublic class Main {\n    public static String greet(String name) {\n        return "Hello, " + name + "!";\n    }\n\n    public static void main(String[] args) {\n        System.out.println(greet("World"));\n    }\n}\n`,
  javascript: `// Hello World in JavaScript\nfunction greet(name) {\n    return "Hello, " + name + "!";\n}\n\nconsole.log(greet("World"));\n`
};

const normalizeLines = (lines) => {
  const result = [...lines];
  while (result.length > 0 && result[result.length - 1].trim() === '') result.pop();
  return result.length > 0 ? result : [''];
};

export default function TranslationPage() {
  const [sourceLang, setSourceLang] = useState('python');
  const [targetLang, setTargetLang] = useState('cpp');
  const [sourceCode, setSourceCode] = useState(HELLO_WORLD.python);
  const [translatedCode, setTranslatedCode] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hoveredLine, setHoveredLine] = useState(-1);
  const [hoveredSide, setHoveredSide] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const sourceRef = useRef(null);
  const targetRef = useRef(null);

  const languages = ['python', 'cpp', 'c', 'java', 'javascript'];

  const handleSourceLangChange = (newLang) => {
    setSourceLang(newLang);
    setSourceCode(HELLO_WORLD[newLang] || '');
    setTranslatedCode('');
    setHoveredLine(-1);
  };

  const handleTranslate = async () => {
    if (!sourceCode.trim()) return;
    setIsTranslating(true);
    setError(null);
    setEditMode(false);
    try {
      const res = await api.post('/translate', { code: sourceCode, sourceLang, targetLang });
      const result = res.data;
      let text = typeof result === 'string' ? result : result.translation || JSON.stringify(result);
      
      // Clean markdown code fences if AI wraps output in them
      text = text.replace(/^```[^\n]*\n?/gm, '').replace(/^```\s*$/gm, '').trim();
      
      // Also strip common AI preambles/postscripts
      const lines = text.split('\n');
      while (lines.length > 0 && !lines[0].match(/^[\s]*[/#*{(<\["'`\-+@\w]/) && !lines[0].includes('import') && !lines[0].includes('include') && !lines[0].includes('def ') && !lines[0].includes('class ') && !lines[0].includes('function')) {
        if (lines[0].match(/^(Here|This|The|Note|I |Below)/i)) lines.shift();
        else break;
      }
      text = lines.join('\n').trim();
      
      setTranslatedCode(text);
    } catch (err) {
      setError(err.response?.data?.error || 'Translation failed. Check if backend/Ollama is running.');
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = () => {
    if (!translatedCode) return;
    navigator.clipboard.writeText(translatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sourceLines = sourceCode.split('\n');
  const targetLines = translatedCode ? translatedCode.split('\n') : [];
  const hasTranslation = translatedCode.length > 0;

  const getHighlightRange = useCallback((lineIdx, fromSide) => {
    if (!hasTranslation) return null;
    const normSrc = normalizeLines(sourceLines);
    const normTgt = normalizeLines(targetLines);
    const srcLen = normSrc.length;
    const tgtLen = normTgt.length;
    if (srcLen === 0 || tgtLen === 0) return null;

    const oppositeLen = fromSide === 'source' ? tgtLen : srcLen;
    const currentLen = fromSide === 'source' ? srcLen : tgtLen;
    
    if (currentLen === 1 && oppositeLen === 1) return [0, 0];
    
    let startIdx = -1;
    let endIdx = -1;
    
    for (let i = 0; i < oppositeLen; i++) {
      const mapsTo = Math.min(Math.round((i / Math.max(oppositeLen - 1, 1)) * (currentLen - 1)), currentLen - 1);
      if (mapsTo === lineIdx) {
        if (startIdx === -1) startIdx = i;
        endIdx = i;
      }
    }
    
    if (startIdx === -1) {
      const mapped = Math.min(Math.round((lineIdx / Math.max(currentLen - 1, 1)) * (oppositeLen - 1)), oppositeLen - 1);
      return [mapped, mapped];
    }
    return [startIdx, endIdx];
  }, [sourceLines, targetLines, hasTranslation]);

  const getMatchedLine = useCallback((lineIdx, fromSide) => {
    const range = getHighlightRange(lineIdx, fromSide);
    return range ? range[0] : -1;
  }, [getHighlightRange]);

  const getHighlight = useCallback((side, lineIdx) => {
    if (hoveredLine === -1 || !hasTranslation) return false;
    if (hoveredSide === side) return lineIdx === hoveredLine;
    
    const range = getHighlightRange(hoveredLine, hoveredSide);
    if (!range) return false;
    return lineIdx >= range[0] && lineIdx <= range[1];
  }, [hoveredLine, hoveredSide, hasTranslation, getHighlightRange]);

  useEffect(() => {
    if (hoveredLine === -1 || !hoveredSide) return;
    const targetIdx = getMatchedLine(hoveredLine, hoveredSide);
    const panelRef = hoveredSide === 'source' ? targetRef : sourceRef;
    if (panelRef.current && targetIdx >= 0) {
      const lineEl = panelRef.current.querySelector(`[data-line='${targetIdx}']`);
      if (lineEl) lineEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [hoveredLine, hoveredSide, getMatchedLine]);

  const renderLinePanel = useCallback((lines, side) => {
    const scrollRef = side === 'source' ? sourceRef : targetRef;
    return (
      <div ref={scrollRef} style={{ flex: 1, display: 'flex', backgroundColor: '#0d0d0d', overflow: 'auto', fontFamily: "'Consolas','Monaco',monospace", fontSize: '13px' }}>
        {/* Line numbers */}
        <div style={{ padding: '10px 6px', backgroundColor: '#141414', borderRight: '1px solid #2a2a2a', color: '#444', textAlign: 'right', userSelect: 'none', minWidth: '36px', flexShrink: 0, position: 'sticky', left: 0, zIndex: 1 }}>
          {(lines.length === 0 ? [''] : lines).map((_, i) => (
            <div key={i} style={{ lineHeight: '20px', height: '20px', color: getHighlight(side, i) ? 'var(--accent)' : '#444', fontWeight: getHighlight(side, i) ? 600 : 400 }}>{i + 1}</div>
          ))}
        </div>
        {/* Code lines */}
        <div style={{ flex: 1, padding: '10px 0', cursor: 'default' }}>
          {lines.length === 0 ? (
            <div style={{ padding: '40px 12px', color: 'var(--text-muted)', textAlign: 'center', fontSize: '12px' }}>
              {side === 'target' ? 'Translation will appear here' : 'No code'}
            </div>
          ) : lines.map((line, i) => {
            const hl = getHighlight(side, i);
            return (
              <div key={i} data-line={i}
                onMouseEnter={() => { if (hasTranslation) { setHoveredLine(i); setHoveredSide(side); } }}
                onMouseLeave={() => { setHoveredLine(-1); setHoveredSide(null); }}
                style={{
                  padding: '0 12px', lineHeight: '20px', height: '20px', whiteSpace: 'pre',
                  color: hl ? '#fff' : '#d4d4d4',
                  backgroundColor: hl ? 'rgba(196,149,106,0.18)' : 'transparent',
                  borderLeft: hl ? '3px solid var(--accent)' : '3px solid transparent',
                  transition: 'background-color 0.08s',
                }}>
                {line || '\u00A0'}
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [getHighlight, hasTranslation]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)', backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ height: '44px', borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px' }}>
          <Languages size={16} />
          Code Translator
          {hasTranslation && <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '8px' }}>Hover a line to see its translation</span>}
        </div>
        <button onClick={handleTranslate} disabled={isTranslating || !sourceCode.trim() || sourceLang === targetLang}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 14px', backgroundColor: 'var(--accent)', color: '#000', fontWeight: 600, fontSize: '12px', borderRadius: '4px', border: 'none', cursor: (isTranslating || !sourceCode.trim() || sourceLang === targetLang) ? 'not-allowed' : 'pointer', opacity: (isTranslating || !sourceCode.trim() || sourceLang === targetLang) ? 0.5 : 1 }}>
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '6px 14px', backgroundColor: 'rgba(248,113,113,0.1)', color: '#ef4444', fontSize: '12px', borderBottom: '1px solid rgba(248,113,113,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>&times;</button>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Source Panel */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-primary)' }}>
          <div style={{ padding: '5px 12px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Source</span>
              <button onClick={() => setEditMode(!editMode)}
                style={{ padding: '2px 8px', borderRadius: '3px', border: '1px solid var(--border-primary)', background: editMode ? 'rgba(196,149,106,0.15)' : 'transparent', color: editMode ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '10px' }}>
                {editMode ? 'Done' : 'Edit'}
              </button>
            </div>
            <select value={sourceLang} onChange={(e) => handleSourceLangChange(e.target.value)}
              style={{ padding: '3px 8px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', fontSize: '11px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
              {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
          </div>

          {editMode ? (
            /* Edit mode: textarea */
            <div style={{ flex: 1, display: 'flex', backgroundColor: '#0d0d0d', overflow: 'hidden' }}>
              <div style={{ padding: '10px 6px', backgroundColor: '#141414', borderRight: '1px solid #2a2a2a', color: '#444', fontFamily: "'Consolas','Monaco',monospace", fontSize: '13px', textAlign: 'right', userSelect: 'none', minWidth: '36px', flexShrink: 0 }}>
                {sourceLines.map((_, i) => <div key={i} style={{ lineHeight: '20px', height: '20px' }}>{i + 1}</div>)}
              </div>
              <textarea value={sourceCode} onChange={(e) => { setSourceCode(e.target.value); setTranslatedCode(''); }} spellCheck="false"
                style={{ flex: 1, padding: '10px 12px', background: 'transparent', border: 'none', color: '#d4d4d4', fontFamily: "'Consolas','Monaco',monospace", fontSize: '13px', lineHeight: '20px', resize: 'none', outline: 'none', whiteSpace: 'pre', tabSize: 2 }}
              />
            </div>
          ) : (
            /* View mode: hoverable lines */
            renderLinePanel(sourceLines, 'source')
          )}
        </div>

        {/* Target Panel */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '5px 12px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowRight style={{ color: 'var(--text-muted)' }} size={14} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {translatedCode && (
                <button onClick={copyToClipboard} style={{ padding: '3px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }} title="Copy">
                  {copied ? <Check size={14} style={{ color: '#4CAF50' }} /> : <Copy size={14} />}
                </button>
              )}
              <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}
                style={{ padding: '3px 8px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', fontSize: '11px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          {renderLinePanel(targetLines, 'target')}
        </div>
      </div>
    </div>
  );
}
