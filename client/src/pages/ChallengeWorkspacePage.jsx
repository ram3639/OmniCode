import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChallengeStore } from '../store/challengeStore';
import { useEditorStore } from '../store/editorStore';
import CodeEditor from '../components/editor/CodeEditor';
import ConsolePanel from '../components/editor/ConsolePanel';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Play, CheckCircle } from 'lucide-react';

export default function ChallengeWorkspacePage() {
  const { slug } = useParams();
  const { currentChallenge, fetchChallenge, loading: challengeLoading, error } = useChallengeStore();
  const { 
    code, 
    language, 
    setLanguage, 
    loadWorkspace, 
    runCode, 
    isRunning, 
    reset 
  } = useEditorStore();

  useEffect(() => {
    fetchChallenge(slug);
    reset();
    return () => reset();
  }, [slug]);

  useEffect(() => {
    if (currentChallenge) {
      loadWorkspace(currentChallenge._id, currentChallenge.starterCode, language);
    }
  }, [currentChallenge]);

  const handleRun = () => {
    if (currentChallenge) {
      runCode(currentChallenge._id);
    }
  };

  if (challengeLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading workspace...</div>;
  }

  if (error || !currentChallenge) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>{error || 'Challenge not found'}</div>;
  }

  const languages = ['python', 'cpp', 'c', 'java'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', backgroundColor: 'transparent' }}>
      {/* Header bar */}
      <div style={{ 
        height: '48px', 
        borderBottom: '1px solid var(--border-primary)', 
        backgroundColor: 'var(--bg-secondary)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 1rem', 
        flexShrink: 0 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/challenges" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0, fontSize: '1.25rem' }}>{currentChallenge.title}</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ 
              padding: '0.375rem 0.75rem', 
              backgroundColor: 'var(--bg-primary)', 
              border: '1px solid var(--border-primary)', 
              borderRadius: '0.25rem', 
              fontSize: '0.875rem', 
              color: 'var(--text-primary)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {languages.map(l => (
              <option key={l} value={l}>{l.toUpperCase()}</option>
            ))}
          </select>

          <button
            onClick={handleRun}
            disabled={isRunning}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.375rem 1rem', 
              backgroundColor: 'var(--text-primary)', 
              color: 'var(--bg-primary)', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              borderRadius: '0.25rem',
              border: 'none',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              opacity: isRunning ? 0.5 : 1
            }}
          >
            <Play size={16} />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel: Description */}
        <div style={{ 
          width: '33.333%', 
          borderRight: '1px solid var(--border-primary)', 
          backgroundColor: 'var(--bg-primary)', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <div style={{ 
            padding: '1.5rem', 
            overflowY: 'auto', 
            flex: 1, 
            color: 'var(--text-secondary)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: 0 }}>
              {currentChallenge.title}
            </h2>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                fontSize: '0.75rem', 
                fontWeight: 500, 
                borderRadius: '0.25rem', 
                color: currentChallenge.difficulty === 'Easy' ? 'var(--success)' : currentChallenge.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)',
                backgroundColor: 'transparent',
                border: `1px solid ${currentChallenge.difficulty === 'Easy' ? 'var(--success)' : currentChallenge.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)'}`
              }}>
                {currentChallenge.difficulty}
              </span>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                fontSize: '0.75rem', 
                fontWeight: 500, 
                borderRadius: '0.25rem', 
                backgroundColor: 'var(--bg-secondary)', 
                color: 'var(--text-secondary)', 
                border: '1px solid var(--border-primary)'
              }}>
                {currentChallenge.category}
              </span>
            </div>
            
            <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              <ReactMarkdown>{currentChallenge.description}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Right Panel: Editor & Console */}
        <div style={{ width: '66.666%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <CodeEditor />
            </div>
          </div>
          <div style={{ height: '33.333%', borderTop: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <ConsolePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
