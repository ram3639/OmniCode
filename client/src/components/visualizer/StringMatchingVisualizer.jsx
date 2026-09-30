import React, { useState } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';


const NAIVE_CODE = `function naiveSearch(text, pat):
  n = text.length
  m = pat.length
  for i from 0 to n - m:
    for j from 0 to m - 1:
      if text[i + j] != pat[j]:
        break
    if j == m:
      print "Pattern found"`;

export default function StringMatchingVisualizer() {
  const [text, setText] = useState('ABABDABACDABABCABAB');
  const [pattern, setPattern] = useState('ABABCABAB');
  const [algo, setAlgo] = useState('naive'); // naive, kmp
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [textIndex, setTextIndex] = useState(-1);
  const [patIndex, setPatIndex] = useState(-1);
  const [shift, setShift] = useState(0);
  const [matches, setMatches] = useState([]);
  const [msg, setMsg] = useState('');
  const [comparisons, setComparisons] = useState(0);
  const [highlightLines, setHighlightLines] = useState([]);
  
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const runNaive = async () => {
    setIsPlaying(true);
    setMatches([]);
    setComparisons(0);
    let comps = 0;
    let n = text.length;
    let m = pattern.length;

    for (let i = 0; i <= n - m; i++) {
      setHighlightLines([3]);
      setShift(i);
      let j;
      setHighlightLines([4]);
      for (j = 0; j < m; j++) {
        comps++;
        setComparisons(comps);
        setTextIndex(i + j);
        setPatIndex(j);
        setMsg(`Comparing text[${i+j}] (${text[i+j]}) with pattern[${j}] (${pattern[j]})`);
        await delay(800);
        
        setHighlightLines([5]);
        if (text[i + j] !== pattern[j]) {
          setHighlightLines([6]);
          setMsg('Mismatch!');
          await delay(500);
          break;
        }
      }
      setHighlightLines([7]);
      if (j === m) {
        setHighlightLines([8]);
        setMsg(`Pattern found at index ${i}!`);
        setMatches(prev => [...prev, i]);
        await delay(1000);
      }
    }
    setMsg('Search Complete');
    setTextIndex(-1);
    setPatIndex(-1);
    setIsPlaying(false);
  };

  const start = () => {
    if (algo === 'naive') runNaive();
    // KMP implementation can be added here
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%', gap: '24px', padding: '24px', color: 'var(--text-primary)' }}>
        <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)', flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={algo} onChange={e => setAlgo(e.target.value)} disabled={isPlaying} style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px' }}>
            <option value="naive">Naive Search</option>
            <option value="kmp">KMP (Placeholder)</option>
          </select>
          <input type="text" value={text} onChange={e => setText(e.target.value.toUpperCase())} disabled={isPlaying} placeholder="Text" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', flex: 1 }} />
          <input type="text" value={pattern} onChange={e => setPattern(e.target.value.toUpperCase())} disabled={isPlaying} placeholder="Pattern" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '200px' }} />
          <button onClick={start} disabled={isPlaying} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: isPlaying ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Search</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '16px' }}>{msg || 'Ready'}</span>
          <span style={{ color: 'var(--text-secondary)' }}>Comparisons: <strong style={{ color: 'var(--warning)' }}>{comparisons}</strong></span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg-secondary)', padding: '40px', borderRadius: '8px', border: '1px solid var(--border-primary)', overflow: 'auto', gap: '20px' }}>
          
          {/* Text Array */}
          <div style={{ display: 'flex', gap: '4px', minWidth: 'max-content' }}>
            {text.split('').map((char, i) => {
              const isMatch = matches.some(m => i >= m && i < m + pattern.length);
              const isComparing = i === textIndex;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{i}</div>
                  <div style={{
                    width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isComparing ? 'var(--warning)' : isMatch ? 'var(--success)' : 'var(--bg-primary)',
                    color: isComparing || isMatch ? '#000' : 'var(--text-primary)',
                    border: '1px solid var(--border-primary)', borderRadius: '4px', fontWeight: 'bold', fontSize: '18px'
                  }}>
                    {char}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pattern Array */}
          <div style={{ display: 'flex', gap: '4px', marginLeft: `${shift * 44}px`, transition: 'margin-left 0.5s ease', minWidth: 'max-content' }}>
            {pattern.split('').map((char, j) => {
              const isComparing = j === patIndex;
              let bg = 'var(--bg-primary)';
              if (isComparing) {
                 bg = text[textIndex] === char ? 'var(--success)' : 'var(--danger)';
              }
              return (
                <div key={j} style={{
                  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: bg,
                  color: isComparing ? '#000' : 'var(--accent)',
                  border: '2px solid var(--accent)', borderRadius: '4px', fontWeight: 'bold', fontSize: '18px',
                  marginTop: '10px'
                }}>
                  {char}
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
      <CodeHighlightPanel code={NAIVE_CODE} highlightLines={highlightLines} title="String Matching" width="280px" />
    </div>
  );
}
