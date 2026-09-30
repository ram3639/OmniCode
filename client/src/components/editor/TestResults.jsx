import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { CheckCircle, XCircle } from 'lucide-react';

export default function TestResults() {
  const { testResults, status, passedTests, totalTests, runtime, memory, semanticScore } = useEditorStore();

  if (!status) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Run your code to see test results.</div>;
  }

  const isSuccess = status === 'Accepted';

  return (
    <div>
      {/* Status banner */}
      <div style={{
        padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
        border: `1px solid ${isSuccess ? 'rgba(76,175,80,0.3)' : 'rgba(239,68,68,0.3)'}`,
        backgroundColor: isSuccess ? 'rgba(76,175,80,0.08)' : 'rgba(239,68,68,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: isSuccess ? 'var(--success)' : 'var(--danger)', margin: 0 }}>
            {status}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {passedTests} / {totalTests} test cases passed
          </p>
        </div>
        {runtime !== null && runtime !== undefined && (
          <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <div>Runtime: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{typeof runtime === 'number' ? runtime.toFixed(1) : runtime} ms</span></div>
            <div style={{ marginTop: '2px' }}>Memory: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{memory} KB</span></div>
            {semanticScore !== null && (
              <div style={{ marginTop: '2px' }}>Quality: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{semanticScore}/100</span></div>
            )}
          </div>
        )}
      </div>

      {/* Individual test cases */}
      {testResults?.map((test, idx) => (
        <div key={idx} style={{
          backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            {test.passed
              ? <CheckCircle size={16} style={{ color: 'var(--success)' }} />
              : <XCircle size={16} style={{ color: 'var(--danger)' }} />
            }
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>Test Case {idx + 1}</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', fontFamily: "'Consolas', monospace" }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Input</div>
              <div style={{ padding: '6px 10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', color: 'var(--text-secondary)', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                {test.input || '(empty)'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Expected</div>
              <div style={{ padding: '6px 10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', color: 'var(--text-secondary)', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                {test.expectedOutput || '(empty)'}
              </div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Your Output</div>
              <div style={{
                padding: '6px 10px', borderRadius: '4px', wordBreak: 'break-all', whiteSpace: 'pre-wrap',
                backgroundColor: test.passed ? 'var(--bg-primary)' : 'rgba(239,68,68,0.05)',
                border: `1px solid ${test.passed ? 'var(--border-primary)' : 'rgba(239,68,68,0.3)'}`,
                color: test.passed ? 'var(--text-secondary)' : 'var(--danger)'
              }}>
                {test.actualOutput || 'No output'}
              </div>
            </div>
          </div>

          {test.error && (
            <div style={{ marginTop: '8px', padding: '6px 10px', backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', fontSize: '11px', color: 'var(--danger)', whiteSpace: 'pre-wrap', fontFamily: "'Consolas', monospace" }}>
              {test.error}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
