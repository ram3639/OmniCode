import React, { useState, useRef, useCallback } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const CODE = `function hanoi(n, source, auxiliary, target):
  if n == 0:
    return
  
  // Move n-1 disks from source to auxiliary
  hanoi(n-1, source, target, auxiliary)
  
  // Move the nth (largest) disk from source to target
  print("Move disk " + n + " from " + source + " to " + target)
  moveDisk(source, target)
  
  // Move n-1 disks from auxiliary to target
  hanoi(n-1, auxiliary, source, target)

// Total moves = 2^n - 1
// Time Complexity:  O(2^n)
// Space Complexity: O(n) — recursion depth`;

export default function HanoiVisualizer() {
  const [numDisks, setNumDisks] = useState(4);
  const [pegs, setPegs] = useState({ A: [], B: [], C: [] });
  const [moves, setMoves] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightLines, setHighlightLines] = useState([]);
  const [msg, setMsg] = useState('');
  const [moveLog, setMoveLog] = useState([]);
  const playRef = useRef(false);
  const speedRef = useRef(500);

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const generateMoves = useCallback((n) => {
    const result = [];
    function hanoi(n, from, aux, to) {
      if (n === 0) return;
      hanoi(n - 1, from, to, aux);
      result.push({ disk: n, from, to });
      hanoi(n - 1, aux, from, to);
    }
    hanoi(n, 'A', 'B', 'C');
    return result;
  }, []);

  const initPegs = useCallback((n) => {
    const disks = Array.from({ length: n }, (_, i) => n - i);
    return { A: disks, B: [], C: [] };
  }, []);

  const handleInit = useCallback(() => {
    playRef.current = false;
    setIsPlaying(false);
    const initial = initPegs(numDisks);
    setPegs(initial);
    const allMoves = generateMoves(numDisks);
    setMoves(allMoves);
    setStepIdx(-1);
    setMoveLog([]);
    setMsg(`${allMoves.length} moves needed (2^${numDisks} - 1 = ${Math.pow(2, numDisks) - 1}). Press Play.`);
    setHighlightLines([0, 1]);
  }, [numDisks, initPegs, generateMoves]);

  const applyMove = useCallback((currentPegs, move) => {
    const newPegs = { A: [...currentPegs.A], B: [...currentPegs.B], C: [...currentPegs.C] };
    const disk = newPegs[move.from].pop();
    newPegs[move.to].push(disk);
    return newPegs;
  }, []);

  const getStateAtStep = useCallback((step) => {
    let state = initPegs(numDisks);
    for (let i = 0; i <= step; i++) {
      state = applyMove(state, moves[i]);
    }
    return state;
  }, [numDisks, moves, initPegs, applyMove]);

  const handlePlay = useCallback(async () => {
    if (moves.length === 0) { handleInit(); return; }
    playRef.current = true;
    setIsPlaying(true);

    const startStep = stepIdx + 1;
    for (let i = startStep; i < moves.length; i++) {
      if (!playRef.current) break;
      const move = moves[i];
      setStepIdx(i);
      setPegs(getStateAtStep(i));
      setMoveLog(prev => [...prev.slice(0, i), `Move disk ${move.disk}: ${move.from} → ${move.to}`]);

      // Highlight appropriate code lines based on recursion phase
      if (move.disk < numDisks) {
        setHighlightLines([4, 5]);  // recursive call
      }
      setHighlightLines([7, 8, 9]);  // move disk
      setMsg(`Step ${i + 1}/${moves.length}: Move disk ${move.disk} from ${move.from} → ${move.to}`);
      await delay(speedRef.current);
      setHighlightLines([12, 13]);  // second recursive call
      await delay(speedRef.current / 4);
    }

    if (playRef.current) {
      setMsg('All disks moved to peg C!');
      setHighlightLines([15, 16]);
    }
    playRef.current = false;
    setIsPlaying(false);
  }, [moves, stepIdx, getStateAtStep, numDisks, handleInit]);

  const handlePause = () => { playRef.current = false; setIsPlaying(false); };

  const handleStep = () => {
    if (moves.length === 0) { handleInit(); return; }
    const next = stepIdx + 1;
    if (next < moves.length) {
      setStepIdx(next);
      setPegs(getStateAtStep(next));
      const move = moves[next];
      setMoveLog(prev => [...prev.slice(0, next), `Move disk ${move.disk}: ${move.from} → ${move.to}`]);
      setHighlightLines([7, 8, 9]);
      setMsg(`Step ${next + 1}/${moves.length}: Move disk ${move.disk} from ${move.from} → ${move.to}`);
    }
  };

  const handleReset = () => {
    playRef.current = false;
    setIsPlaying(false);
    setPegs(initPegs(numDisks));
    setStepIdx(-1);
    setMoveLog([]);
    setHighlightLines([]);
    setMsg('');
    setMoves(generateMoves(numDisks));
  };

  const DISK_COLORS = ['#C4956A', '#60A5FA', '#F87171', '#4ADE80', '#FBBF24', '#A78BFA', '#FB923C', '#2DD4BF'];
  const maxWidth = 200;

  const renderPeg = (pegName, disks) => {
    const pegHeight = (numDisks + 1) * 28 + 20;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Peg {pegName}</div>
        <div style={{ width: `${maxWidth + 40}px`, height: `${pegHeight}px`, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
          {/* Peg rod */}
          <div style={{ position: 'absolute', bottom: 0, width: '4px', height: `${pegHeight - 10}px`, backgroundColor: 'var(--text-muted)', borderRadius: '2px', zIndex: 0 }} />
          {/* Base */}
          <div style={{ width: `${maxWidth + 20}px`, height: '6px', backgroundColor: 'var(--text-muted)', borderRadius: '3px', zIndex: 1 }} />
          {/* Disks */}
          {disks.map((disk, idx) => {
            const diskWidth = 40 + (disk / numDisks) * (maxWidth - 40);
            return (
              <div key={disk} style={{
                position: 'absolute',
                bottom: 6 + idx * 28,
                width: `${diskWidth}px`,
                height: '24px',
                backgroundColor: DISK_COLORS[(disk - 1) % DISK_COLORS.length],
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: '#000',
                zIndex: 2,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}>
                {disk}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100%', color: 'var(--text-primary)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px', overflow: 'auto' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Tower of Hanoi</h3>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            Disks:
            <input type="number" value={numDisks} min={1} max={8} onChange={e => setNumDisks(Math.max(1, Math.min(8, Number(e.target.value))))}
              disabled={isPlaying}
              style={{ width: '45px', padding: '4px 6px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', fontSize: '12px' }} />
          </label>
          <button onClick={handleInit} disabled={isPlaying} style={{ padding: '6px 14px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '12px', opacity: isPlaying ? 0.5 : 1 }}>Setup</button>
          {!isPlaying ? (
            <button onClick={handlePlay} style={{ padding: '6px 12px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Play</button>
          ) : (
            <button onClick={handlePause} style={{ padding: '6px 12px', backgroundColor: 'var(--bg-primary)', color: 'var(--warning)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Pause</button>
          )}
          <button onClick={handleStep} disabled={isPlaying} style={{ padding: '6px 12px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', opacity: isPlaying ? 0.5 : 1 }}>Step</button>
          <button onClick={handleReset} style={{ padding: '6px 12px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Reset</button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Speed:</span>
            <input type="range" min="100" max="1200" defaultValue="500" onChange={e => { speedRef.current = 1300 - Number(e.target.value); }} style={{ width: '80px' }} />
          </div>
        </div>

        {msg && <div style={{ padding: '8px 12px', backgroundColor: 'rgba(196,149,106,0.1)', border: '1px solid rgba(196,149,106,0.3)', borderRadius: '6px', fontSize: '12px', color: 'var(--accent)' }}>{msg}</div>}

        {/* Pegs */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '24px', paddingBottom: '24px' }}>
          {renderPeg('A', pegs.A)}
          {renderPeg('B', pegs.B)}
          {renderPeg('C', pegs.C)}
        </div>

        {/* Move log */}
        {moveLog.length > 0 && (
          <div style={{ maxHeight: '100px', overflowY: 'auto', padding: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-primary)', fontSize: '11px', fontFamily: 'monospace' }}>
            {moveLog.map((m, i) => (
              <div key={i} style={{ color: i === moveLog.length - 1 ? 'var(--accent)' : 'var(--text-muted)', padding: '1px 0' }}>{i + 1}. {m}</div>
            ))}
          </div>
        )}
      </div>

      <CodeHighlightPanel code={CODE} highlightLines={highlightLines} title="Tower of Hanoi" language="Pseudocode" />
    </div>
  );
}
