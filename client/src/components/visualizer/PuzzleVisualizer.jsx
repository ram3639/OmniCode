import React, { useState, useRef, useCallback } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const CODE = `function solve8Puzzle(initial, goal):
  queue = [(initial, [])]
  visited = {initial}
  
  while queue is not empty:
    state, moves = queue.dequeue()
    
    if state == goal:
      return moves  // Solution found!
    
    blankPos = findBlank(state)
    
    for each neighbor of blankPos:
      newState = swap(state, blankPos, neighbor)
      
      if newState not in visited:
        visited.add(newState)
        queue.enqueue((newState, moves + [move]))
  
  return null  // No solution`;

const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const PRESETS = [
  { name: 'Easy (4 moves)', tiles: [1, 2, 3, 4, 5, 0, 7, 8, 6] },
  { name: 'Medium (12 moves)', tiles: [1, 3, 6, 5, 0, 2, 4, 7, 8] },
  { name: 'Hard (20+ moves)', tiles: [8, 6, 7, 2, 5, 4, 3, 0, 1] },
];

function getNeighbors(pos) {
  const map = { 0: [1,3], 1: [0,2,4], 2: [1,5], 3: [0,4,6], 4: [1,3,5,7], 5: [2,4,8], 6: [3,7], 7: [4,6,8], 8: [5,7] };
  return map[pos];
}

function arrToStr(a) { return a.join(','); }

function solveBFS(initial) {
  const goalStr = arrToStr(GOAL);
  const queue = [{ state: [...initial], moves: [] }];
  const visited = new Set([arrToStr(initial)]);
  let iterations = 0;
  const maxIter = 200000;

  while (queue.length > 0 && iterations < maxIter) {
    iterations++;
    const { state, moves } = queue.shift();
    if (arrToStr(state) === goalStr) return moves;

    const blankIdx = state.indexOf(0);
    for (const neighbor of getNeighbors(blankIdx)) {
      const newState = [...state];
      [newState[blankIdx], newState[neighbor]] = [newState[neighbor], newState[blankIdx]];
      const key = arrToStr(newState);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ state: newState, moves: [...moves, { from: neighbor, to: blankIdx, state: newState }] });
      }
    }
  }
  return null;
}

export default function PuzzleVisualizer() {
  const [tiles, setTiles] = useState([1, 2, 3, 4, 5, 0, 7, 8, 6]);
  const [inputVal, setInputVal] = useState('1,2,3,4,5,0,7,8,6');
  const [solution, setSolution] = useState(null);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightLines, setHighlightLines] = useState([]);
  const [msg, setMsg] = useState('');
  const playRef = useRef(false);
  const speedRef = useRef(500);

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const handleSolve = useCallback(async () => {
    setMsg('Solving with BFS...');
    setHighlightLines([0, 1, 2]);
    await delay(300);

    setHighlightLines([4, 5, 6]);
    const sol = solveBFS(tiles);

    if (!sol) {
      setMsg('No solution found (unsolvable configuration).');
      setHighlightLines([21]);
      return;
    }
    setSolution(sol);
    setStepIdx(-1);
    setMsg(`Solution found! ${sol.length} moves. Press Play to animate.`);
    setHighlightLines([10, 11]);
  }, [tiles]);

  const handlePlay = useCallback(async () => {
    if (!solution || solution.length === 0) return;
    playRef.current = true;
    setIsPlaying(true);

    for (let i = 0; i <= solution.length - 1; i++) {
      if (!playRef.current) break;
      setStepIdx(i);
      setTiles([...solution[i].state]);
      setHighlightLines([14, 15, 16, 17]);
      setMsg(`Step ${i + 1} / ${solution.length}`);
      await delay(speedRef.current);
      setHighlightLines([18, 19]);
      await delay(speedRef.current / 3);
    }

    if (playRef.current) {
      setMsg('Puzzle solved!');
      setHighlightLines([10, 11]);
    }
    playRef.current = false;
    setIsPlaying(false);
  }, [solution]);

  const handlePause = () => { playRef.current = false; setIsPlaying(false); };

  const handleStep = () => {
    if (!solution) return;
    const next = stepIdx + 1;
    if (next < solution.length) {
      setStepIdx(next);
      setTiles([...solution[next].state]);
      setHighlightLines([14, 15, 16, 17]);
      setMsg(`Step ${next + 1} / ${solution.length}`);
    }
  };

  const handleReset = () => {
    playRef.current = false;
    setIsPlaying(false);
    setSolution(null);
    setStepIdx(-1);
    setHighlightLines([]);
    setMsg('');
  };

  const handleParseInput = () => {
    const nums = inputVal.split(',').map(s => parseInt(s.trim()));
    if (nums.length === 9 && nums.every(n => n >= 0 && n <= 8) && new Set(nums).size === 9) {
      setTiles(nums);
      handleReset();
    } else {
      setMsg('Invalid input! Use 0-8, comma-separated, 9 unique values.');
    }
  };

  const handleManualClick = (idx) => {
    if (isPlaying || solution) return;
    const blankIdx = tiles.indexOf(0);
    if (getNeighbors(blankIdx).includes(idx)) {
      const newTiles = [...tiles];
      [newTiles[blankIdx], newTiles[idx]] = [newTiles[idx], newTiles[blankIdx]];
      setTiles(newTiles);
    }
  };

  const isSolved = arrToStr(tiles) === arrToStr(GOAL);

  return (
    <div style={{ display: 'flex', height: '100%', color: 'var(--text-primary)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px', overflow: 'auto' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>8-Puzzle Solver (BFS)</h3>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
          <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="e.g. 1,2,3,4,5,0,7,8,6"
            style={{ flex: 1, minWidth: '180px', padding: '6px 10px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }} />
          <button onClick={handleParseInput} style={{ padding: '6px 12px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Set</button>
          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-primary)' }} />
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => { setTiles([...p.tiles]); setInputVal(p.tiles.join(',')); handleReset(); }}
              style={{ padding: '4px 8px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
              {p.name}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={handleSolve} disabled={isPlaying || isSolved}
            style={{ padding: '8px 16px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '12px', opacity: (isPlaying || isSolved) ? 0.5 : 1 }}>Solve</button>
          {!isPlaying ? (
            <button onClick={handlePlay} disabled={!solution}
              style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: solution ? 'pointer' : 'not-allowed', fontSize: '12px', opacity: solution ? 1 : 0.5 }}>Play</button>
          ) : (
            <button onClick={handlePause} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--warning)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Pause</button>
          )}
          <button onClick={handleStep} disabled={isPlaying || !solution}
            style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', opacity: (!isPlaying && solution) ? 1 : 0.5 }}>Step</button>
          <button onClick={handleReset} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Reset</button>
          <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Speed:</span>
            <input type="range" min="100" max="1000" defaultValue="500" onChange={e => { speedRef.current = 1100 - Number(e.target.value); }} style={{ width: '80px' }} />
          </div>
        </div>

        {/* Status */}
        {msg && <div style={{ padding: '8px 12px', backgroundColor: isSolved ? 'rgba(74,222,128,0.1)' : 'rgba(196,149,106,0.1)', border: `1px solid ${isSolved ? 'rgba(74,222,128,0.3)' : 'rgba(196,149,106,0.3)'}`, borderRadius: '6px', fontSize: '12px', color: isSolved ? 'var(--success)' : 'var(--accent)' }}>{msg}</div>}

        {/* Puzzle Grid + Goal */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px' }}>
          {/* Current State */}
          <div>
            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>CURRENT STATE</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gridTemplateRows: 'repeat(3, 80px)', gap: '4px', backgroundColor: 'var(--border-primary)', padding: '4px', borderRadius: '8px' }}>
              {tiles.map((tile, idx) => (
                <div key={idx} onClick={() => handleManualClick(idx)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: tile === 0 ? 'var(--bg-primary)' : isSolved ? 'rgba(74,222,128,0.15)' : 'var(--bg-secondary)',
                    border: tile === 0 ? '2px dashed var(--border-primary)' : `1px solid ${isSolved ? 'rgba(74,222,128,0.3)' : 'var(--border-primary)'}`,
                    borderRadius: '6px',
                    fontSize: tile === 0 ? '0' : '24px',
                    fontWeight: 700,
                    color: isSolved ? 'var(--success)' : 'var(--text-primary)',
                    cursor: !isPlaying && !solution && tile !== 0 ? 'pointer' : 'default',
                    transition: 'all 0.15s ease',
                  }}>
                  {tile !== 0 && tile}
                </div>
              ))}
            </div>
          </div>

          {/* Goal State */}
          <div>
            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>GOAL STATE</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gridTemplateRows: 'repeat(3, 60px)', gap: '3px', backgroundColor: 'var(--border-primary)', padding: '3px', borderRadius: '6px', opacity: 0.6 }}>
              {GOAL.map((tile, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: tile === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)', borderRadius: '4px',
                  fontSize: tile === 0 ? '0' : '16px', fontWeight: 600, color: 'var(--text-secondary)',
                }}>
                  {tile !== 0 && tile}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CodeHighlightPanel code={CODE} highlightLines={highlightLines} title="BFS 8-Puzzle Solver" language="Pseudocode" />
    </div>
  );
}
