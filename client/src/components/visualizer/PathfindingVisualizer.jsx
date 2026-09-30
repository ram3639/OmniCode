import React, { useState, useEffect, useRef, useCallback } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const ROWS = 20;
const COLS = 40;

const createGrid = () => {
  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === 10 && col === 5,
        isEnd: row === 10 && col === 34,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        isPath: false,
        previousNode: null,
        f: Infinity,
        g: Infinity,
        h: Infinity
      });
    }
    grid.push(currentRow);
  }
  return grid;
};


const PATHFINDING_CODES = {
  bfs: `function BFS(grid, start, end):
  queue = [start]
  visited = {start}
  parent = {}
  while queue not empty:
    cell = queue.dequeue()
    if cell == end:
      return reconstructPath(parent)
    for each neighbor of cell:
      if valid and not visited:
        visited.add(neighbor)
        parent[neighbor] = cell
        queue.enqueue(neighbor)
  return no path found`,
  dfs: `function DFS(grid, start, end):
  stack = [start]
  visited = {start}
  parent = {}
  while stack not empty:
    cell = stack.pop()
    if cell == end:
      return reconstructPath(parent)
    for each neighbor of cell:
      if valid and not visited:
        visited.add(neighbor)
        parent[neighbor] = cell
        stack.push(neighbor)
  return no path found`,
  dijkstra: `function Dijkstra(grid, start, end):
  dist[start] = 0
  pq = [(0, start)]
  while pq not empty:
    (d, cell) = pq.extractMin()
    if cell == end:
      return reconstructPath()
    for each neighbor of cell:
      newDist = d + weight(neighbor)
      if newDist < dist[neighbor]:
        dist[neighbor] = newDist
        pq.insert((newDist, neighbor))
  return no path found`,
  astar: `function AStar(grid, start, end):
  g[start] = 0
  f[start] = heuristic(start, end)
  open = [(f[start], start)]
  while open not empty:
    (_, cell) = open.extractMin()
    if cell == end:
      return reconstructPath()
    for each neighbor of cell:
      tentG = g[cell] + 1
      if tentG < g[neighbor]:
        g[neighbor] = tentG
        f[neighbor] = tentG + h(neighbor)
        open.insert((f[neighbor], neighbor))
  return no path found`,
};

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [algo, setAlgo] = useState('bfs');
  const [speed, setSpeed] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [highlightLines, setHighlightLines] = useState([]);
  
  useEffect(() => {
    setGrid(createGrid());
  }, []);

  const handleMouseDown = (row, col) => {
    if (isRunning) return;
    const newGrid = [...grid];
    const node = newGrid[row][col];
    if (!node.isStart && !node.isEnd) {
      node.isWall = !node.isWall;
      setGrid(newGrid);
    }
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isRunning) return;
    const newGrid = [...grid];
    const node = newGrid[row][col];
    if (!node.isStart && !node.isEnd) {
      node.isWall = true;
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const clearWalls = () => {
    if (isRunning) return;
    const newGrid = grid.map(row => row.map(node => ({ ...node, isWall: false, isVisited: false, isPath: false, distance: Infinity, previousNode: null })));
    setGrid(newGrid);
  };

  const clearPath = () => {
    if (isRunning) return;
    const newGrid = grid.map(row => row.map(node => ({ ...node, isVisited: false, isPath: false, distance: Infinity, previousNode: null })));
    setGrid(newGrid);
  };

  const visualize = async () => {
    if (isRunning) return;
    setIsRunning(true);
    clearPath();
    
    // Find start and end nodes
    let startNode, endNode;
    for (const row of grid) {
      for (const node of row) {
        if (node.isStart) startNode = node;
        if (node.isEnd) endNode = node;
      }
    }

    const visitedNodesInOrder = [];
    
    // Algorithms
    if (algo === 'bfs') {
      const queue = [startNode];
      startNode.isVisited = true;
      
      while (queue.length) {
        setHighlightLines([3, 4]); // dequeuing
        const curr = queue.shift();
        visitedNodesInOrder.push(curr);
        
        setHighlightLines([5, 6]); // checking goal
        if (curr === endNode) break;

        const neighbors = [];
        const {row, col} = curr;
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < COLS - 1) neighbors.push(grid[row][col + 1]);

        setHighlightLines([7, 8, 9]); // visiting neighbors
        for (const neighbor of neighbors) {
          if (!neighbor.isVisited && !neighbor.isWall) {
            setHighlightLines([10, 11]); // adding to queue
            neighbor.isVisited = true;
            neighbor.previousNode = curr;
            queue.push(neighbor);
          }
        }
      }
    } else if (algo === 'dfs') {
      setHighlightLines([1]);
      const stack = [startNode];
      
      while (stack.length) {
        setHighlightLines([3]);
        const curr = stack.pop();
        if (curr.isVisited) continue;
        
        curr.isVisited = true;
        visitedNodesInOrder.push(curr);
        if (curr === endNode) break;

        const neighbors = [];
        const {row, col} = curr;
        if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
        if (row > 0) neighbors.push(grid[row - 1][col]);

        for (const neighbor of neighbors) {
          if (!neighbor.isVisited && !neighbor.isWall) {
            neighbor.previousNode = curr;
            stack.push(neighbor);
          }
        }
      }
    } else if (algo === 'dijkstra') {
      setHighlightLines([1]);
      startNode.distance = 0;
      const unvisitedNodes = [];
      for (const row of grid) {
        for (const node of row) {
          unvisitedNodes.push(node);
        }
      }

      while (!!unvisitedNodes.length) {
        unvisitedNodes.sort((a, b) => a.distance - b.distance);
        setHighlightLines([4]);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) break;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === endNode) break;

        const neighbors = [];
        const {row, col} = closestNode;
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < COLS - 1) neighbors.push(grid[row][col + 1]);

        for (const neighbor of neighbors) {
          if (!neighbor.isVisited) {
            setHighlightLines([8]);
            neighbor.distance = closestNode.distance + 1;
            neighbor.previousNode = closestNode;
          }
        }
      }
    } else if (algo === 'astar') {
      const openSet = [startNode];
      startNode.g = 0;
      startNode.f = Math.abs(startNode.row - endNode.row) + Math.abs(startNode.col - endNode.col);

      while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const curr = openSet.shift();
        
        curr.isVisited = true;
        visitedNodesInOrder.push(curr);
        
        if (curr === endNode) break;

        const neighbors = [];
        const {row, col} = curr;
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < COLS - 1) neighbors.push(grid[row][col + 1]);

        for (const neighbor of neighbors) {
          if (!neighbor.isVisited && !neighbor.isWall) {
            const tempG = curr.g + 1;
            if (tempG < neighbor.g) {
              neighbor.previousNode = curr;
              neighbor.g = tempG;
              neighbor.h = Math.abs(neighbor.row - endNode.row) + Math.abs(neighbor.col - endNode.col);
              neighbor.f = neighbor.g + neighbor.h;
              if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
              }
            }
          }
        }
      }
    }

    // Animation
    const delay = Math.max(5, 50 / speed);
    
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animatePath(endNode);
        }, delay * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isEnd) {
          setGrid(prev => {
            const newGrid = [...prev];
            newGrid[node.row][node.col].isVisited = true;
            return newGrid;
          });
        }
      }, delay * i);
    }
  };

  const animatePath = (endNode) => {
    const path = [];
    let curr = endNode.previousNode;
    while (curr !== null && !curr.isStart) {
      path.unshift(curr);
      curr = curr.previousNode;
    }
    
    if (path.length === 0) {
      setIsRunning(false);
      return;
    }

    const delay = Math.max(10, 50 / speed);
    for (let i = 0; i <= path.length; i++) {
      if (i === path.length) {
        setTimeout(() => setIsRunning(false), delay * i);
        return;
      }
      setTimeout(() => {
        const node = path[i];
        setGrid(prev => {
          const newGrid = [...prev];
          newGrid[node.row][node.col].isPath = true;
          return newGrid;
        });
      }, delay * i);
    }
  };

  const getCellColor = (node) => {
    if (node.isStart) return '#10B981'; // green
    if (node.isEnd) return '#EF4444'; // red
    if (node.isWall) return 'var(--text-primary)';
    if (node.isPath) return 'var(--accent)';
    if (node.isVisited) return '#3B82F6'; // light blue
    return 'var(--bg-primary)';
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-primary)', alignItems: 'center' }}>
          <select 
            value={algo} 
            onChange={e => setAlgo(e.target.value)}
            disabled={isRunning}
            style={{ padding: '8px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px' }}
          >
            <option value="bfs">Breadth First Search</option>
            <option value="dfs">Depth First Search</option>
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="astar">A* Search</option>
          </select>
          
          <button onClick={visualize} disabled={isRunning} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Visualize
          </button>
          
          <button onClick={clearPath} disabled={isRunning} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>
            Clear Path
          </button>

          <button onClick={clearWalls} disabled={isRunning} style={{ padding: '8px 16px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' }}>
            Clear Walls
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Speed</label>
            <input 
              type="range" 
              min="0.5" 
              max="4" 
              step="0.5" 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))} 
              disabled={isRunning}
              style={{ width: '100px' }} 
            />
          </div>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
          Click and drag to add walls.
        </div>

        <div 
          style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)', padding: '24px', overflow: 'auto' }}
          onMouseLeave={handleMouseUp}
        >
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-primary)', borderLeft: '1px solid var(--border-primary)' }}>
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: 'flex' }}>
                {row.map((node, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                    onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                    onMouseUp={handleMouseUp}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRight: '1px solid var(--border-primary)',
                      borderBottom: '1px solid var(--border-primary)',
                      background: getCellColor(node),
                      transition: node.isVisited || node.isPath ? 'background-color 0.2s ease-out' : 'none',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CodeHighlightPanel code={PATHFINDING_CODES[algo]} highlightLines={highlightLines} title="Pathfinding" width="280px" />
    </div>
  );
}
