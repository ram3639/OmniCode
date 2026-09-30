import React, { useState, useRef, useEffect } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const CODE = `function linearSearch(arr, target):
  for each index i in arr:
    if arr[i] == target:
      return i
  return -1

function binarySearch(arr, target):
  left = 0, right = arr.length - 1
  while left <= right:
    mid = floor((left + right) / 2)
    if arr[mid] == target:
      return mid
    if arr[mid] < target:
      left = mid + 1
    else:
      right = mid - 1
  return -1`;

export default function SearchingVisualizer() {
  const [array, setArray] = useState(Array.from({ length: 20 }, (_, i) => i * 3 + Math.floor(Math.random() * 3)));
  const [target, setTarget] = useState('');
  const [algo, setAlgo] = useState('linear');
  const [customInput, setCustomInput] = useState('');
  const [speed, setSpeed] = useState(800);
  
  const [state, setState] = useState({
    active: -1,
    left: -1,
    right: -1,
    mid: -1,
    found: -1,
    comparisons: 0
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightLines, setHighlightLines] = useState([]);
  const generatorRef = useRef(null);
  const timerRef = useRef(null);

  function* linearSearchGenerator() {
    const t = Number(target);
    let comps = 0;
    for (let i = 0; i < array.length; i++) {
      comps++;
      yield { active: i, left: -1, right: -1, mid: -1, found: -1, comparisons: comps };
      if (array[i] === t) {
        yield { active: -1, left: -1, right: -1, mid: -1, found: i, comparisons: comps };
        return;
      }
    }
    yield { active: -1, left: -1, right: -1, mid: -1, found: -2, comparisons: comps };
  }

  function* binarySearchGenerator() {
    const t = Number(target);
    let left = 0;
    let right = array.length - 1;
    let comps = 0;

    while (left <= right) {
      comps++;
      const mid = Math.floor((left + right) / 2);
      yield { active: -1, left, right, mid, found: -1, comparisons: comps };
      
      if (array[mid] === t) {
        yield { active: -1, left, right, mid, found: mid, comparisons: comps };
        return;
      } else if (array[mid] < t) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    yield { active: -1, left: -1, right: -1, mid: -1, found: -2, comparisons: comps };
  }

  const reset = () => {
    setState({ active: -1, left: -1, right: -1, mid: -1, found: -1, comparisons: 0 });
    setIsPlaying(false);
    generatorRef.current = null;
  };

  const generateNewArray = () => {
    setArray(Array.from({ length: 20 }, (_, i) => i * 3 + Math.floor(Math.random() * 3)));
    reset();
  };

  const handleParseCustom = () => {
    if (!customInput.trim()) return;
    const parsed = customInput.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      if (algo === 'binary') {
        parsed.sort((a, b) => a - b);
      }
      setArray(parsed);
      reset();
    }
  };

  const step = () => {
    if (!target) return false;
    if (!generatorRef.current) {
      generatorRef.current = algo === 'linear' ? linearSearchGenerator() : binarySearchGenerator();
    }
    const { value, done } = generatorRef.current.next();
    if (done) {
      setIsPlaying(false);
      return false;
    }
    setState(value);
    
    if (value.found >= 0) {
      setHighlightLines(algo === 'linear' ? [4] : [12]);
    } else if (value.found === -2) {
      setHighlightLines(algo === 'linear' ? [5] : [17]);
    } else if (algo === 'linear') {
      setHighlightLines([2, 3]);
    } else if (algo === 'binary') {
      setHighlightLines([9, 10, 11]);
    }

    return true;
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        const hasMore = step();
        if (!hasMore) setIsPlaying(false);
      }, 1000 - speed); // Invert speed so higher = faster
    }
    return () => clearTimeout(timerRef.current);
  });

  const getBlockStyle = (idx) => {
    const baseStyle = {
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid var(--border-primary)',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '16px',
      transition: 'all 0.3s'
    };

    if (state.found === idx) {
      return { ...baseStyle, background: 'var(--accent)', color: '#000', borderColor: 'var(--accent)' };
    }
    if (state.active === idx) {
      return { ...baseStyle, background: 'var(--warning)', color: '#000' };
    }
    if (state.mid === idx) {
      return { ...baseStyle, background: 'var(--warning)', color: '#000' };
    }
    if (algo === 'binary' && state.left !== -1) {
      if (idx >= state.left && idx <= state.right) {
        return { ...baseStyle, background: 'var(--bg-primary)', color: 'var(--text-primary)' };
      }
      return { ...baseStyle, background: 'var(--bg-secondary)', color: 'var(--text-muted)', opacity: 0.3 };
    }

    return { ...baseStyle, background: 'var(--bg-primary)', color: 'var(--text-primary)' };
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        
        {/* Controls Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
          
          {/* Top Row: Algorithm and Array Gen */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              value={algo} 
              onChange={e => { 
                const val = e.target.value;
                setAlgo(val); 
                if (val === 'binary') {
                  const sorted = [...array].sort((a,b)=>a-b);
                  setArray(sorted);
                }
                reset(); 
              }}
              style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px' }}
            >
              <option value="linear">Linear Search</option>
              <option value="binary">Binary Search (Sorted Array)</option>
            </select>
            
            <input 
              type="text" 
              value={customInput} 
              onChange={e => setCustomInput(e.target.value)}
              placeholder="e.g. 3,7,1,9"
              style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '200px' }}
            />
            <button onClick={handleParseCustom} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>
              Parse Custom Array
            </button>
            
            <button onClick={generateNewArray} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>
              Random Array
            </button>
          </div>
  
          {/* Bottom Row: Playback & Speed */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="number" 
              value={target} 
              onChange={e => { setTarget(e.target.value); reset(); }} 
              placeholder={algo === 'binary' ? 'Target (Binary)' : 'Target (Linear)'} 
              style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '150px' }} 
            />
            
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={!target} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button onClick={step} disabled={isPlaying || !target} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>
              Step
            </button>
  
            <button onClick={reset} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>
              Reset
            </button>
  
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Speed: 
              <input 
                type="range" 
                min="100" max="950" 
                value={speed} 
                onChange={e => setSpeed(Number(e.target.value))} 
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
  
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Comparisons</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>{state.comparisons}</div>
          </div>
        </div>
  
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)', padding: '24px', gap: '48px', overflow: 'auto' }}>
          
          {state.found === -2 && (
            <div style={{ fontSize: '24px', color: 'var(--danger)', fontWeight: 'bold', padding: '16px', border: '2px solid var(--danger)', borderRadius: '8px', background: 'rgba(255,0,0,0.1)' }}>Element Not Found!</div>
          )}
          {state.found >= 0 && (
            <div style={{ fontSize: '24px', color: 'var(--accent)', fontWeight: 'bold' }}>Target found at index {state.found}!</div>
          )}
  
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '800px' }}>
            {array.map((val, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={getBlockStyle(idx)}>
                  {val}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{idx}</div>
                {algo === 'binary' && (
                  <div style={{ color: 'var(--warning)', fontSize: '12px', height: '14px', fontWeight: 'bold' }}>
                    {state.left === idx ? 'L' : state.right === idx ? 'R' : state.mid === idx ? 'M' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CodeHighlightPanel playgroundTopic="linear-search" code={CODE} highlightLines={highlightLines} title="Search Algorithm" language="Pseudocode" />
    </div>
  );
}
