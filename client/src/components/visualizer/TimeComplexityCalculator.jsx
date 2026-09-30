import React, { useState } from 'react';
import CodeEditor from '../editor/CodeEditor';
import { useThemeStore } from '../../store/themeStore';

export default function TimeComplexityCalculator() {
  const [code, setCode] = useState('// Write your code here to analyze its time complexity\nfunction example(n) {\n  for (let i = 0; i < n; i++) {\n    console.log(i);\n  }\n}');
  const [language, setLanguage] = useState('javascript');
  const { theme } = useThemeStore();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First try to call the backend AI endpoint
      const response = await fetch('http://localhost:5000/api/complexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // simple check
        },
        body: JSON.stringify({ code, language })
      });

      if (response.ok) {
        const data = await response.json();
        const analysis = data.analysis;
        
        // Parse the exact format:
        // Time: O(...)
        // Space: O(...)
        // Explanation: ...
        
        const timeMatch = analysis.match(/Time:\s*(O\([^\)]+\)|[^\n]+)/i);
        const spaceMatch = analysis.match(/Space:\s*(O\([^\)]+\)|[^\n]+)/i);
        const expMatch = analysis.match(/Explanation:\s*([\s\S]+)/i);
        
        if (timeMatch || spaceMatch) {
          setResults({
            time: timeMatch ? timeMatch[1].trim() : 'Unknown',
            space: spaceMatch ? spaceMatch[1].trim() : 'Unknown',
            reason: expMatch ? expMatch[1].trim() : analysis,
            fromAI: true
          });
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend AI failed, falling back to heuristics:', err);
    }

    // Fallback to simple heuristic analysis
    let timeComplexity = 'O(1)';
    let spaceComplexity = 'O(1)';
    let reason = 'No loops or recursion detected. (Fallback Heuristic)';
    
    const lines = code.split('\n');
    let loopCount = 0;
    let maxNestedLoops = 0;
    let currentNesting = 0;
    let isRecursive = false;
    let hasBinarySearchPattern = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('for') || trimmed.startsWith('while')) {
        loopCount++;
        currentNesting++;
        if (currentNesting > maxNestedLoops) maxNestedLoops = currentNesting;
      }
      if (trimmed.includes('}') && currentNesting > 0) {
        currentNesting--;
      }
      if (trimmed.includes('mid') && (trimmed.includes('left') || trimmed.includes('right') || trimmed.includes('low') || trimmed.includes('high'))) {
        hasBinarySearchPattern = true;
      }
      if (trimmed.includes('function ')) {
        const match = trimmed.match(/function\s+([a-zA-Z0-9_]+)/);
        if (match && code.split(match[1]).length > 2) {
          isRecursive = true;
        }
      }
    }

    if (isRecursive) {
      timeComplexity = 'O(2^n) or O(n!)';
      spaceComplexity = 'O(n)';
      reason = 'Recursive function calls detected. (Fallback Heuristic)';
    } else if (hasBinarySearchPattern) {
      timeComplexity = 'O(log n)';
      reason = 'Detected binary search pattern. (Fallback Heuristic)';
    } else if (maxNestedLoops > 0) {
      timeComplexity = `O(n^${maxNestedLoops})`;
      if (maxNestedLoops === 1) timeComplexity = 'O(n)';
      reason = `Detected ${maxNestedLoops} level(s) of nested loops. (Fallback Heuristic)`;
    }

    if (code.includes('new Array') || code.includes('[]') || code.includes('{}')) {
      if (!isRecursive) spaceComplexity = 'O(n)';
    }

    setResults({
      time: timeComplexity,
      space: spaceComplexity,
      reason,
      fromAI: false
    });
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '24px', padding: '24px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--border-primary)', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '4px 8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px' }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          <button onClick={analyzeCode} disabled={loading} style={{ padding: '6px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <CodeEditor
            code={code}
            onChange={(val) => setCode(val)}
            language={language}
            theme={theme}
          />
        </div>
      </div>

      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
          <h2 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)', fontSize: '20px' }}>Analysis Results</h2>
          
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              AI is analyzing your code...
              <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
          ) : !results ? (
            <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              Click 'Analyze' to compute time and space complexity.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Estimated Time Complexity</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent)' }}>{results.time}</div>
              </div>
              
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Estimated Space Complexity</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--warning)' }}>{results.space}</div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '4px', border: '1px solid var(--border-primary)' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {results.fromAI ? 'AI Explanation:' : 'Heuristic Explanation:'}
                </div>
                <div style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {results.reason}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
