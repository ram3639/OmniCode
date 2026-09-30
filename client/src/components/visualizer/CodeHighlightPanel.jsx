import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';

/**
 * CodeHighlightPanel — Reusable component that displays algorithm pseudocode
 * with real-time line highlighting as operations execute.
 * 
 * Props:
 *   code: string — the code to display (multiline)
 *   highlightLines: number[] — array of 0-indexed line numbers to highlight
 *   title: string — optional title
 *   language: string — optional label (default 'Pseudocode')
 *   width: string — optional width (default '280px')
 *   playgroundTopic: string — optional, if set shows "Try Yourself" button linking to /playground?topic=...
 */
export default function CodeHighlightPanel({ code = '', highlightLines = [], title = 'Algorithm', language = 'Pseudocode', width = '280px', playgroundTopic = '' }) {
  const lines = code.split('\n');
  let navigate;
  try { navigate = useNavigate(); } catch { navigate = null; }

  return (
    <div style={{
      width,
      minWidth: width,
      maxWidth: width,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid var(--border-primary)',
      backgroundColor: '#0e0e0e',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '6px 10px',
        borderBottom: '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        <span style={{
          fontSize: '9px',
          padding: '1px 5px',
          borderRadius: '3px',
          backgroundColor: 'rgba(196,149,106,0.12)',
          color: 'var(--accent)',
          fontWeight: 600,
          flexShrink: 0,
        }}>{language}</span>
      </div>

      {/* Code Lines */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '6px 0',
        fontFamily: "'Consolas', 'Courier New', monospace",
        fontSize: '10.5px',
        lineHeight: '1.65',
      }}>
        {lines.map((line, idx) => {
          const isHighlighted = highlightLines.includes(idx);
          return (
            <div key={idx} style={{
              display: 'flex',
              backgroundColor: isHighlighted ? 'rgba(196, 149, 106, 0.15)' : 'transparent',
              borderLeft: isHighlighted ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'background-color 0.15s ease',
              minHeight: '17px',
            }}>
              {/* Line number */}
              <span style={{
                width: '24px',
                textAlign: 'right',
                paddingRight: '6px',
                color: isHighlighted ? 'var(--accent)' : '#444',
                userSelect: 'none',
                flexShrink: 0,
                fontWeight: isHighlighted ? 600 : 400,
                fontSize: '9.5px',
              }}>{idx + 1}</span>
              {/* Code content */}
              <span style={{
                color: isHighlighted ? '#e0e0e0' : '#777',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                paddingRight: '8px',
                fontWeight: isHighlighted ? 500 : 400,
              }}>{line}</span>
            </div>
          );
        })}
      </div>

      {/* Try Yourself Button */}
      {playgroundTopic && navigate && (
        <div style={{
          padding: '8px 10px',
          borderTop: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-secondary)',
          flexShrink: 0,
        }}>
          <button
            onClick={() => navigate(`/playground?topic=${playgroundTopic}`)}
            style={{
              width: '100%',
              padding: '7px 12px',
              backgroundColor: 'rgba(196,149,106,0.12)',
              color: 'var(--accent)',
              border: '1px solid rgba(196,149,106,0.3)',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(196,149,106,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(196,149,106,0.12)'; }}
          >
            <Pencil size={12} />
            Try Yourself
          </button>
        </div>
      )}
    </div>
  );
}
