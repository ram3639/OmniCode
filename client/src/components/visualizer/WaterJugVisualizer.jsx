import React, { useState, useRef, useCallback } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const CODE = `function waterJugBFS(jug1Cap, jug2Cap, target):
  queue = [(0, 0)]
  visited = {(0, 0)}
  parent = {}
  
  while queue is not empty:
    (a, b) = queue.dequeue()
    
    if a == target or b == target:
      return reconstructPath(parent, (a,b))
    
    // Generate all possible next states
    nextStates = [
      (jug1Cap, b),     // Fill Jug 1
      (a, jug2Cap),     // Fill Jug 2
      (0, b),           // Empty Jug 1
      (a, 0),           // Empty Jug 2
      // Pour Jug1 -> Jug2
      (a - min(a, jug2Cap-b), b + min(a, jug2Cap-b)),
      // Pour Jug2 -> Jug1
      (a + min(b, jug1Cap-a), b - min(b, jug1Cap-a))
    ]
    
    for each state in nextStates:
      if state not in visited:
        visited.add(state)
        parent[state] = (a, b)
        queue.enqueue(state)
  
  return null  // No solution`;

function solveBFS(cap1, cap2, target) {
  const queue = [{ a: 0, b: 0, path: [{ a: 0, b: 0, action: 'Start' }] }];
  const visited = new Set(['0,0']);

  while (queue.length > 0) {
    const { a, b, path } = queue.shift();
    if (a === target || b === target) return path;

    const nextStates = [
      { a: cap1, b, action: `Fill Jug 1 (${cap1}L)` },
      { a, b: cap2, action: `Fill Jug 2 (${cap2}L)` },
      { a: 0, b, action: 'Empty Jug 1' },
      { a, b: 0, action: 'Empty Jug 2' },
      { a: a - Math.min(a, cap2 - b), b: b + Math.min(a, cap2 - b), action: 'Pour Jug1 → Jug2' },
      { a: a + Math.min(b, cap1 - a), b: b - Math.min(b, cap1 - a), action: 'Pour Jug2 → Jug1' },
    ];

    for (const ns of nextStates) {
      const key = `${ns.a},${ns.b}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ a: ns.a, b: ns.b, path: [...path, ns] });
      }
    }
  }
  return null;
}

export default function WaterJugVisualizer() {
  const [cap1, setCap1] = useState(4);
  const [cap2, setCap2] = useState(3);
  const [target, setTarget] = useState(2);
  const [solution, setSolution] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightLines, setHighlightLines] = useState([]);
  const [msg, setMsg] = useState('');
  const playRef = useRef(false);
  const speedRef = useRef(700);

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const currentState = solution ? solution[stepIdx] : { a: 0, b: 0, action: 'Start' };

  const handleSolve = useCallback(() => {
    setHighlightLines([0, 1, 2, 3]);
    const sol = solveBFS(cap1, cap2, target);
    if (!sol) {
      setMsg('No solution exists for this configuration.');
      setHighlightLines([30]);
      setSolution(null);
      return;
    }
    setSolution(sol);
    setStepIdx(0);
    setMsg(`Solution found! ${sol.length - 1} steps. Press Play.`);
    setHighlightLines([10, 11]);
  }, [cap1, cap2, target]);

  const handlePlay = useCallback(async () => {
    if (!solution) return;
    playRef.current = true;
    setIsPlaying(true);

    for (let i = stepIdx; i < solution.length; i++) {
      if (!playRef.current) break;
      setStepIdx(i);
      const act = solution[i].action;
      if (act.includes('Fill')) setHighlightLines([15, 16]);
      else if (act.includes('Empty')) setHighlightLines([17, 18]);
      else if (act.includes('Pour')) setHighlightLines([20, 22]);
      else setHighlightLines([8, 9]);
      setMsg(`Step ${i}/${solution.length - 1}: ${act}`);
      await delay(speedRef.current);
    }
    if (playRef.current) {
      setMsg('Target reached!');
      setHighlightLines([10, 11]);
    }
    playRef.current = false;
    setIsPlaying(false);
  }, [solution, stepIdx]);

  const handlePause = () => { playRef.current = false; setIsPlaying(false); };
  const handleStep = () => { if (solution && stepIdx < solution.length - 1) { setStepIdx(s => s + 1); } };
  const handleReset = () => { playRef.current = false; setIsPlaying(false); setStepIdx(0); setHighlightLines([]); setMsg(''); };

  const jugFillPercent = (amount, capacity) => capacity > 0 ? (amount / capacity) * 100 : 0;

  return (
    <div style={{ display: 'flex', height: '100%', color: 'var(--text-primary)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px', overflow: 'auto' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Water Jug Problem (BFS)</h3>

        {/* Input */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            Jug 1 Capacity:
            <input type="number" value={cap1} min={1} max={20} onChange={e => setCap1(Number(e.target.value))}
              style={{ width: '50px', padding: '4px 6px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', fontSize: '12px' }} />
          </label>
          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            Jug 2 Capacity:
            <input type="number" value={cap2} min={1} max={20} onChange={e => setCap2(Number(e.target.value))}
              style={{ width: '50px', padding: '4px 6px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', fontSize: '12px' }} />
          </label>
          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            Target:
            <input type="number" value={target} min={0} max={Math.max(cap1, cap2)} onChange={e => setTarget(Number(e.target.value))}
              style={{ width: '50px', padding: '4px 6px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', fontSize: '12px' }} />
          </label>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={handleSolve} disabled={isPlaying} style={{ padding: '8px 16px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '12px', opacity: isPlaying ? 0.5 : 1 }}>Solve</button>
          {!isPlaying ? (
            <button onClick={handlePlay} disabled={!solution} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', opacity: solution ? 1 : 0.5 }}>Play</button>
          ) : (
            <button onClick={handlePause} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--warning)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Pause</button>
          )}
          <button onClick={handleStep} disabled={isPlaying || !solution} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', opacity: !isPlaying && solution ? 1 : 0.5 }}>Step</button>
          <button onClick={handleReset} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Reset</button>
          <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Speed:</span>
            <input type="range" min="200" max="1500" defaultValue="700" onChange={e => { speedRef.current = 1700 - Number(e.target.value); }} style={{ width: '80px' }} />
          </div>
        </div>

        {msg && <div style={{ padding: '8px 12px', backgroundColor: 'rgba(196,149,106,0.1)', border: '1px solid rgba(196,149,106,0.3)', borderRadius: '6px', fontSize: '12px', color: 'var(--accent)' }}>{msg}</div>}

        {/* Jugs */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px' }}>
          {[{ label: `Jug 1 (${cap1}L)`, amount: currentState.a, capacity: cap1 }, { label: `Jug 2 (${cap2}L)`, amount: currentState.b, capacity: cap2 }].map((jug, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>{jug.label}</div>
              <div style={{ width: '100px', height: '160px', border: '3px solid var(--text-muted)', borderTop: 'none', borderRadius: '0 0 12px 12px', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${jugFillPercent(jug.amount, jug.capacity)}%`,
                  backgroundColor: (jug.amount === target && target > 0) ? 'rgba(74,222,128,0.4)' : 'rgba(96,165,250,0.3)',
                  borderTop: jug.amount > 0 ? '2px solid rgba(96,165,250,0.6)' : 'none',
                  transition: 'height 0.4s ease',
                }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {jug.amount}
                </div>
              </div>
              {jug.amount === target && target > 0 && <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>TARGET!</div>}
            </div>
          ))}
        </div>

        {/* Step History */}
        {solution && (
          <div style={{ maxHeight: '120px', overflowY: 'auto', padding: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-primary)', fontSize: '11px', fontFamily: 'monospace' }}>
            {solution.slice(0, stepIdx + 1).map((s, i) => (
              <div key={i} style={{ color: i === stepIdx ? 'var(--accent)' : 'var(--text-muted)', padding: '2px 0' }}>
                Step {i}: ({s.a}, {s.b}) — {s.action}
              </div>
            ))}
          </div>
        )}
      </div>

      <CodeHighlightPanel code={CODE} highlightLines={highlightLines} title="Water Jug BFS" language="Pseudocode" />
    </div>
  );
}
