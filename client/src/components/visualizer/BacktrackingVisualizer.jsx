import React, { useState } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const CODE = `function solveNQ(board, col) {
  if (col >= n) return true;
  for (let i = 0; i < n; i++) {
    if (isSafe(board, i, col)) {
      board[i][col] = 1; // place
      if (solveNQ(board, col + 1)) return true;
      board[i][col] = 0; // backtrack
    }
  }
  return false;
}`;

export default function BacktrackingVisualizer() {
  const [n, setN] = useState(8);
  const [board, setBoard] = useState(Array(n).fill(null).map(() => Array(n).fill(0))); // 0=empty, 1=queen
  const [isPlaying, setIsPlaying] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeCell, setActiveCell] = useState([-1, -1]);
  const [highlightLines, setHighlightLines] = useState([]);

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const isSafe = (board, row, col) => {
    // Check this row on left side
    for (let i = 0; i < col; i++) {
      if (board[row][i]) return false;
    }
    // Check upper diagonal on left side
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j]) return false;
    }
    // Check lower diagonal on left side
    for (let i = row, j = col; j >= 0 && i < n; i++, j--) {
      if (board[i][j]) return false;
    }
    return true;
  };

  const solveNQ = async (b, col) => {
    if (col >= n) return true;

    for (let i = 0; i < n; i++) {
      setActiveCell([i, col]);
      setMsg(`Checking cell [${i}, ${col}]`);
      await delay(200);

      if (isSafe(b, i, col)) {
        setHighlightLines([3, 4]);
        b[i][col] = 1;
        setBoard(JSON.parse(JSON.stringify(b)));
        setMsg(`Placed Queen at [${i}, ${col}]`);
        await delay(400);

        if (await solveNQ(b, col + 1)) return true;

        // Backtrack
        setHighlightLines([6]);
        b[i][col] = 0;
        setBoard(JSON.parse(JSON.stringify(b)));
        setMsg(`Backtracking from [${i}, ${col}]`);
        await delay(400);
      }
    }
    return false;
  };

  const start = async () => {
    setIsPlaying(true);
    let b = Array(n).fill(null).map(() => Array(n).fill(0));
    setBoard(b);
    if (await solveNQ(b, 0)) {
      setMsg('Solution Found!');
    } else {
      setMsg('No Solution Exists.');
    }
    setActiveCell([-1, -1]);
    setHighlightLines([]);
    setIsPlaying(false);
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-primary)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>N-Queens</h3>
          <div style={{ width: '1px', background: 'var(--border-primary)', height: '20px', margin: '0 8px' }} />
          <input type="number" value={n} onChange={e => {
              let val = Number(e.target.value);
              if(val >= 4 && val <= 12) {
                setN(val);
                setBoard(Array(val).fill(null).map(() => Array(val).fill(0)));
              }
            }} min="4" max="12" disabled={isPlaying} style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '60px' }} />
          <button onClick={start} disabled={isPlaying} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: isPlaying ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Solve</button>
          <button onClick={() => setBoard(Array(n).fill(null).map(() => Array(n).fill(0)))} disabled={isPlaying} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>Reset</button>
          <span style={{ marginLeft: 'auto', color: 'var(--warning)', fontWeight: 'bold' }}>{msg}</span>
        </div>
  
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)', padding: '24px', overflow: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', border: '2px solid var(--border-primary)' }}>
            {board.map((row, r) => (
              <div key={r} style={{ display: 'flex' }}>
                {row.map((cell, c) => {
                  const isDark = (r + c) % 2 === 1;
                  const isActive = activeCell[0] === r && activeCell[1] === c;
                  return (
                    <div key={c} style={{
                      width: '50px', height: '50px',
                      background: isActive ? 'var(--warning)' : isDark ? '#333' : '#eee',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '32px'
                    }}>
                      {cell === 1 && <span style={{ color: 'var(--accent)' }}>♛</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CodeHighlightPanel code={CODE} highlightLines={highlightLines} title="N-Queens Backtracking" language="Pseudocode" />
    </div>
  );
}
