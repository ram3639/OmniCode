import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Lightbulb, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';
import { useChallengeStore } from '../../store/challengeStore';

export default function AIHintsPanel() {
  const { hints, code, language } = useEditorStore();
  const { currentChallenge } = useChallengeStore();
  const [proactiveHint, setProactiveHint] = useState('');
  const [loading, setLoading] = useState(false);

  const getProactiveHint = async () => {
    if (!code.trim() || !currentChallenge) return;
    setLoading(true);
    setProactiveHint('');
    try {
      const res = await api.post('/playground/validate', {
        code,
        topic: currentChallenge.title,
        functionName: currentChallenge.category,
        error: ''
      });
      setProactiveHint(res.data.feedback || 'No suggestions at this time.');
    } catch {
      setProactiveHint('Could not reach AI. Ensure backend and Ollama are running.');
    } finally {
      setLoading(false);
    }
  };

  const allHints = [...(hints || []), ...(proactiveHint ? [proactiveHint] : [])];

  return (
    <div>
      {/* Get Hint Button */}
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={getProactiveHint} disabled={loading || !code.trim()}
          style={{ padding: '6px 14px', backgroundColor: 'rgba(196,149,106,0.1)', color: 'var(--accent)', border: '1px solid rgba(196,149,106,0.3)', borderRadius: '5px', cursor: loading ? 'wait' : 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', opacity: loading ? 0.6 : 1 }}>
          {loading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Lightbulb size={14} />}
          {loading ? 'Analyzing...' : 'Get AI Hint'}
        </button>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Get AI feedback on your current code
        </span>
      </div>

      {allHints.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          No hints yet. Click "Get AI Hint" for feedback, or submit your code to get error analysis.
        </div>
      )}

      {allHints.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '12px' }}>
            <Lightbulb size={18} />
            <span style={{ fontWeight: 600, fontSize: '14px' }}>AI Insights</span>
          </div>
          
          {allHints.map((hint, idx) => (
            <div key={idx} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '12px 16px', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <ReactMarkdown>{hint}</ReactMarkdown>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
