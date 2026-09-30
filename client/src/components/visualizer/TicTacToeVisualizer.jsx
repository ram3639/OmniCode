import React, { useState, useRef, useCallback } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const CODE = `function minimax(board, depth, isMax):
  score = evaluate(board)
  
  if score == +10:  return score - depth
  if score == -10:  return score + depth
  if no moves left: return 0
  
  if isMax:   // AI's turn (X)
    bestVal = -Infinity
    for each empty cell:
      board[cell] = 'X'
      val = minimax(board, depth+1, false)
      board[cell] = ''
      bestVal = max(bestVal, val)
    return bestVal
  
  else:       // Human's turn (O)
    bestVal = +Infinity
    for each empty cell:
      board[cell] = 'O'
      val = minimax(board, depth+1, true)
      board[cell] = ''
      bestVal = min(bestVal, val)
    return bestVal

function findBestMove(board):
  bestVal = -Infinity
  bestMove = -1
  for each empty cell:
    board[cell] = 'X'
    moveVal = minimax(board, 0, false)
    board[cell] = ''
    if moveVal > bestVal:
      bestVal = moveVal
      bestMove = cell
  return bestMove`;

const WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkWinner(board) {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { winner: board[a], line: [a, b, c] };
  }
  return null;
}

function evaluate(board) {
  const result = checkWinner(board);
  if (!result) return 0;
  return result.winner === 'X' ? 10 : -10;
}

function minimax(board, depth, isMax) {
  const score = evaluate(board);
  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (board.every(c => c !== '')) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = '';
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = '';
      }
    }
    return best;
  }
}

function findBestMove(board) {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = 'X';
      const moveVal = minimax(board, 0, false);
      board[i] = '';
      if (moveVal > bestVal) { bestVal = moveVal; bestMove = i; }
    }
  }
  return bestMove;
}

export default function TicTacToeVisualizer() {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winLine, setWinLine] = useState(null);
  const [msg, setMsg] = useState('Your turn (O). Click a cell.');
  const [highlightLines, setHighlightLines] = useState([]);
  const [mode, setMode] = useState('ai'); // 'ai' or 'pvp'
  const [scores, setScores] = useState({ player: 0, ai: 0, draw: 0 });

  const handleCellClick = useCallback((idx) => {
    if (board[idx] !== '' || gameOver) return;

    const newBoard = [...board];

    if (mode === 'pvp') {
      newBoard[idx] = isPlayerTurn ? 'O' : 'X';
      setBoard(newBoard);
      const result = checkWinner(newBoard);
      if (result) {
        setWinLine(result.line);
        setGameOver(true);
        setMsg(`${result.winner} wins!`);
        setScores(s => ({ ...s, [result.winner === 'O' ? 'player' : 'ai']: s[result.winner === 'O' ? 'player' : 'ai'] + 1 }));
        return;
      }
      if (newBoard.every(c => c !== '')) { setGameOver(true); setMsg("It's a draw!"); setScores(s => ({ ...s, draw: s.draw + 1 })); return; }
      setIsPlayerTurn(!isPlayerTurn);
      setMsg(isPlayerTurn ? "X's turn" : "O's turn");
      return;
    }

    // AI mode
    if (!isPlayerTurn) return;

    // Player move
    newBoard[idx] = 'O';
    setBoard(newBoard);
    setHighlightLines([19, 20, 21, 22, 23]);

    const result = checkWinner(newBoard);
    if (result) {
      setWinLine(result.line);
      setGameOver(true);
      setMsg('You win! (Impossible against perfect AI, but ok!)');
      setScores(s => ({ ...s, player: s.player + 1 }));
      setHighlightLines([3, 4]);
      return;
    }
    if (newBoard.every(c => c !== '')) {
      setGameOver(true);
      setMsg("It's a draw!");
      setScores(s => ({ ...s, draw: s.draw + 1 }));
      setHighlightLines([5]);
      return;
    }

    // AI move
    setIsPlayerTurn(false);
    setMsg('AI is thinking...');
    setHighlightLines([27, 28, 29, 30, 31, 32, 33, 34]);

    setTimeout(() => {
      const aiMove = findBestMove(newBoard);
      if (aiMove >= 0) {
        newBoard[aiMove] = 'X';
        setBoard([...newBoard]);
        setHighlightLines([10, 11, 12, 13, 14, 15]);

        const aiResult = checkWinner(newBoard);
        if (aiResult) {
          setWinLine(aiResult.line);
          setGameOver(true);
          setMsg('AI wins! Minimax is unbeatable.');
          setScores(s => ({ ...s, ai: s.ai + 1 }));
          setHighlightLines([3]);
          return;
        }
        if (newBoard.every(c => c !== '')) {
          setGameOver(true);
          setMsg("It's a draw! Best possible outcome against Minimax.");
          setScores(s => ({ ...s, draw: s.draw + 1 }));
          setHighlightLines([5]);
          return;
        }
      }
      setIsPlayerTurn(true);
      setMsg('Your turn (O). Click a cell.');
      setHighlightLines([]);
    }, 400);
  }, [board, isPlayerTurn, gameOver, mode]);

  const handleReset = () => {
    setBoard(Array(9).fill(''));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinLine(null);
    setMsg(mode === 'ai' ? 'Your turn (O). Click a cell.' : "O's turn");
    setHighlightLines([]);
  };

  return (
    <div style={{ display: 'flex', height: '100%', color: 'var(--text-primary)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px', overflow: 'auto' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Tic-Tac-Toe (Minimax AI)</h3>

        {/* Mode + Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mode:</span>
          {['ai', 'pvp'].map(m => (
            <button key={m} onClick={() => { setMode(m); handleReset(); }}
              style={{ padding: '5px 12px', backgroundColor: mode === m ? 'var(--accent)' : 'var(--bg-primary)', color: mode === m ? '#000' : 'var(--text-secondary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: mode === m ? 600 : 400 }}>
              {m === 'ai' ? 'vs AI' : 'PvP'}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={handleReset} style={{ padding: '6px 14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>New Game</button>
        </div>

        {/* Scores */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {[{ label: mode === 'ai' ? 'You (O)' : 'Player O', val: scores.player, color: '#60A5FA' }, { label: 'Draw', val: scores.draw, color: 'var(--text-muted)' }, { label: mode === 'ai' ? 'AI (X)' : 'Player X', val: scores.ai, color: 'var(--accent)' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: gameOver ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 500 }}>{msg}</div>

        {/* Board */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gridTemplateRows: 'repeat(3, 100px)', gap: '4px' }}>
            {board.map((cell, idx) => {
              const isWinCell = winLine && winLine.includes(idx);
              return (
                <div key={idx} onClick={() => handleCellClick(idx)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isWinCell ? 'rgba(196,149,106,0.2)' : 'var(--bg-secondary)',
                    border: `2px solid ${isWinCell ? 'var(--accent)' : 'var(--border-primary)'}`,
                    borderRadius: '8px', fontSize: '36px', fontWeight: 700,
                    color: cell === 'X' ? 'var(--accent)' : cell === 'O' ? '#60A5FA' : 'transparent',
                    cursor: (!cell && !gameOver) ? 'pointer' : 'default',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { if (!cell && !gameOver) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; }}
                  onMouseLeave={e => { if (!cell && !gameOver) e.currentTarget.style.backgroundColor = isWinCell ? 'rgba(196,149,106,0.2)' : 'var(--bg-secondary)'; }}
                >
                  {cell}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CodeHighlightPanel code={CODE} highlightLines={highlightLines} title="Minimax Algorithm" language="Pseudocode" />
    </div>
  );
}
