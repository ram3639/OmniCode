import React, { useState } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';


const FIB_CODE = `function fibonacci(n):
  dp = array of size n+1
  dp[0] = 0
  dp[1] = 1
  for i from 2 to n:
    dp[i] = dp[i-1] + dp[i-2]
  return dp[n]`;

const LCS_CODE = `function lcs(str1, str2):
  dp = 2D array (m+1) x (n+1)
  for i from 0 to m: dp[i][0] = 0
  for j from 0 to n: dp[0][j] = 0
  for i from 1 to m:
    for j from 1 to n:
      if str1[i-1] == str2[j-1]:
        dp[i][j] = 1 + dp[i-1][j-1]
      else:
        dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  return dp[m][n]`;

export default function DPVisualizer() {
  const [algo, setAlgo] = useState('fibonacci'); // fibonacci, knapsack, lcs, coin
  const [speed, setSpeed] = useState(1);
  const [table, setTable] = useState([]);
  const [activeCell, setActiveCell] = useState([-1, -1]);
  const [depCells, setDepCells] = useState([]);
  const [formula, setFormula] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightLines, setHighlightLines] = useState([]);

  // Inputs
  const [n, setN] = useState(8);
  const [weights, setWeights] = useState('1,2,3');
  const [values, setValues] = useState('10,15,40');
  const [capacity, setCapacity] = useState(6);
  const [str1, setStr1] = useState('AGGTAB');
  const [str2, setStr2] = useState('GXTXAYB');

  const delay = (ms) => new Promise(r => setTimeout(r, ms / speed));

  const runFibonacci = async () => {
    setIsPlaying(true);
    setHighlightLines([1]);
    let dp = Array(n + 1).fill(null);
    setTable([dp]);
    
    dp[0] = 0;
    setTable([[...dp]]);
    setHighlightLines([2]);
    setActiveCell([0, 0]);
    setFormula('dp[0] = 0');
    await delay(1000);

    dp[1] = 1;
    setTable([[...dp]]);
    setHighlightLines([3]);
    setActiveCell([0, 1]);
    setFormula('dp[1] = 1');
    await delay(1000);

    for (let i = 2; i <= n; i++) {
      setHighlightLines([4]);
      setActiveCell([0, i]);
      setDepCells([[0, i-1], [0, i-2]]);
      setFormula(`dp[${i}] = dp[${i-1}] + dp[${i-2}]`);
      setHighlightLines([5]);
      await delay(1500);
      dp[i] = dp[i-1] + dp[i-2];
      setTable([[...dp]]);
      await delay(500);
    }
    
    setActiveCell([-1, -1]);
    setHighlightLines([6]);
    setDepCells([]);
    setFormula(`Result: ${dp[n]}`);
    setIsPlaying(false);
  };

  const runLCS = async () => {
    setIsPlaying(true);
    const m = str1.length;
    const n = str2.length;
    let dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(null));
    setHighlightLines([1]);
    
    setHighlightLines([2]);
    for (let i = 0; i <= m; i++) dp[i][0] = 0;
    setHighlightLines([3]);
    for (let j = 0; j <= n; j++) dp[0][j] = 0;
    setTable(JSON.parse(JSON.stringify(dp)));
    await delay(1000);

    setHighlightLines([4]);
    for (let i = 1; i <= m; i++) {
      setHighlightLines([5]);
      for (let j = 1; j <= n; j++) {
        setActiveCell([i, j]);
        setHighlightLines([6]);
        if (str1[i-1] === str2[j-1]) {
          setDepCells([[i-1, j-1]]);
          setFormula(`Match! dp[${i}][${j}] = 1 + dp[${i-1}][${j-1}]`);
          await delay(1500);
          setHighlightLines([7]);
          dp[i][j] = dp[i-1][j-1] + 1;
        } else {
          setHighlightLines([8]);
          setDepCells([[i-1, j], [i, j-1]]);
          setFormula(`Mismatch! max(dp[${i-1}][${j}], dp[${i}][${j-1}])`);
          await delay(1500);
          setHighlightLines([9]);
          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
        setTable(JSON.parse(JSON.stringify(dp)));
        await delay(500);
      }
    }
    setActiveCell([-1, -1]);
    setDepCells([]);
    setHighlightLines([10]);
    setFormula(`Result: ${dp[m][n]}`);
    setIsPlaying(false);
  };

  const start = () => {
    if (algo === 'fibonacci') runFibonacci();
    if (algo === 'lcs') runLCS();
  };

  const getCellColor = (r, c) => {
    if (activeCell[0] === r && activeCell[1] === c) return 'var(--warning)';
    if (depCells.some(d => d[0] === r && d[1] === c)) return 'var(--accent)';
    if (table[r][c] !== null) return 'var(--bg-primary)';
    return 'transparent';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: '24px', padding: '24px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={algo} onChange={e => setAlgo(e.target.value)} disabled={isPlaying} style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px' }}>
          <option value="fibonacci">Fibonacci (1D)</option>
          <option value="lcs">Longest Common Subsequence (2D)</option>
        </select>
        
        {algo === 'fibonacci' && <input type="number" value={n} onChange={e => setN(Number(e.target.value))} min="2" max="20" disabled={isPlaying} placeholder="n" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '80px' }} />}
        
        {algo === 'lcs' && (
          <>
            <input type="text" value={str1} onChange={e => setStr1(e.target.value)} disabled={isPlaying} placeholder="String 1" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '120px' }} />
            <input type="text" value={str2} onChange={e => setStr2(e.target.value)} disabled={isPlaying} placeholder="String 2" style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', width: '120px' }} />
          </>
        )}

        <button onClick={start} disabled={isPlaying} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: isPlaying ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Play</button>
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Speed</label>
          <input type="range" min="0.5" max="4" step="0.5" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', minHeight: '30px', color: 'var(--accent)' }}>
        {formula || 'Press Play to start'}
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-primary)', overflow: 'auto' }}>
        {table.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {table.map((row, r) => (
              <div key={r} style={{ display: 'flex', gap: '4px' }}>
                {row.map((cell, c) => (
                  <div key={c} style={{
                    width: '50px', height: '50px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: getCellColor(r, c),
                    color: (activeCell[0] === r && activeCell[1] === c) || depCells.some(d => d[0] === r && d[1] === c) ? '#000' : 'var(--text-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '4px', fontWeight: 'bold', fontSize: '16px',
                    transition: 'all 0.3s'
                  }}>
                    {cell !== null ? cell : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
      <CodeHighlightPanel code={algo === 'fibonacci' ? FIB_CODE : LCS_CODE} highlightLines={highlightLines} />
    </div>
  );
}
