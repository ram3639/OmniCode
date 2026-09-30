import React, { useState, useRef, useEffect, useMemo } from 'react';
import CodeHighlightPanel from './CodeHighlightPanel';

const COLORS = {
  unvisited: '#555',
  queued: 'var(--warning)',
  current: 'var(--accent)',
  visited: '#4CAF50',
  mst: '#ff5722',
  path: '#00bcd4'
};

const btnStyle = { padding: '6px 12px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', cursor: 'pointer' };
const inputStyle = { padding: '6px 12px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px' };


const BFS_CODE = `function BFS(start):
  queue = [start]
  visited = {start: true}
  while queue is not empty:
    curr = queue.dequeue()
    for neighbor in neighbors(curr):
      if not visited[neighbor]:
        visited[neighbor] = true
        queue.enqueue(neighbor)`;
const DFS_CODE = `function DFS(start):
  stack = [start]
  visited = {start: true}
  while stack is not empty:
    curr = stack.pop()
    for neighbor in neighbors(curr):
      if not visited[neighbor]:
        visited[neighbor] = true
        stack.push(neighbor)`;

const DIJKSTRA_CODE = `function dijkstra(graph, source):
  dist[source] = 0
  pq = [(0, source)]
  while pq is not empty:
    (d, u) = pq.extractMin()
    for each neighbor v of u:
      if dist[u] + w(u,v) < dist[v]:
        dist[v] = dist[u] + w(u,v)
        pq.insert((dist[v], v))
  return dist`;

const PRIM_CODE = `function prim(graph):
  key[0] = 0, mstSet = {}
  while mstSet != all vertices:
    u = vertex with min key not in mstSet
    add u to mstSet
    for each neighbor v of u:
      if v not in mstSet and w(u,v) < key[v]:
        key[v] = w(u,v)
        parent[v] = u`;

const KRUSKAL_CODE = `function kruskal(graph):
  sort edges by weight
  mst = []
  for each edge (u, v, w):
    if find(u) != find(v):
      union(u, v)
      mst.add((u, v, w))
  return mst`;

const TOPO_CODE = `function topologicalSort(graph):
  compute in-degree for each vertex
  queue = vertices with in-degree 0
  while queue is not empty:
    u = queue.dequeue()
    result.add(u)
    for each neighbor v of u:
      in-degree[v]--
      if in-degree[v] == 0:
        queue.enqueue(v)
  return result`;

export default function GraphVisualizer() {
  const [highlightLines, setHighlightLines] = useState([]);
  const [code, setCode] = useState(BFS_CODE);
  const [activeTab, setActiveTab] = useState('builder');
  
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isDirected, setIsDirected] = useState(false);
  const [isWeighted, setIsWeighted] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', boxSizing: 'border-box', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '8px', marginBottom: '20px' }}>
        {['builder', 'traversals', 'algorithms'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {activeTab === 'builder' && (
          <BuilderTab 
            nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} 
            isDirected={isDirected} setIsDirected={setIsDirected} isWeighted={isWeighted} setIsWeighted={setIsWeighted} 
          />
        )}
        {activeTab === 'traversals' && (
          <TraversalsTab nodes={nodes} edges={edges} isDirected={isDirected} setHighlightLines={setHighlightLines} setCode={setCode} />
        )}
        {activeTab === 'algorithms' && (
          <AlgorithmsTab nodes={nodes} edges={edges} isDirected={isDirected} isWeighted={isWeighted} setHighlightLines={setHighlightLines} setCode={setCode} />
        )}
      </div>
      </div>
      <CodeHighlightPanel playgroundTopic="graph-bfs" code={code} highlightLines={highlightLines} />
    </div>
  );
}

const BuilderTab = ({ nodes, setNodes, edges, setEdges, isDirected, setIsDirected, isWeighted, setIsWeighted }) => {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [pendingEdge, setPendingEdge] = useState(null);
  const [weightInput, setWeightInput] = useState("1");

  const getNextId = () => {
    let i = 0;
    while(nodes.find(n => n.id === i.toString())) i++;
    return i.toString();
  };

  const handleCanvasClick = (e) => {
    if (e.target.tagName === 'svg') {
      const rect = svgRef.current.getBoundingClientRect();
      setNodes([...nodes, { id: getNextId(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    }
  };

  const handleNodeMouseDown = (e, id) => {
    e.stopPropagation();
    if (e.button === 2) {
      setNodes(nodes.filter(n => n.id !== id));
      setEdges(edges.filter(ed => ed.source !== id && ed.target !== id));
      return;
    }
    setDraggingNode(id);
  };

  const handleEdgeContextMenu = (e, index) => {
    e.preventDefault();
    setEdges(edges.filter((_, i) => i !== index));
  };

  const handleMouseMove = (e) => {
    if (draggingNode) {
      const rect = svgRef.current.getBoundingClientRect();
      setNodes(nodes.map(n => n.id === draggingNode ? { ...n, x: e.clientX - rect.left, y: e.clientY - rect.top } : n));
    }
  };

  const handleNodeClick = (e, id) => {
    e.stopPropagation();
    if (!selectedNode) {
      setSelectedNode(id);
    } else {
      if (selectedNode !== id) {
        if (isWeighted) {
          setPendingEdge({ source: selectedNode, target: id });
        } else {
          const exists = edges.find(ed => (ed.source === selectedNode && ed.target === id) || (!isDirected && ed.source === id && ed.target === selectedNode));
          if (!exists) setEdges([...edges, { source: selectedNode, target: id, weight: 1 }]);
        }
      }
      setSelectedNode(null);
    }
  };

  const submitWeight = () => {
    if (pendingEdge) {
      let weight = parseInt(weightInput, 10);
      if (isNaN(weight)) weight = 1;
      const exists = edges.find(ed => (ed.source === pendingEdge.source && ed.target === pendingEdge.target) || (!isDirected && ed.source === pendingEdge.target && ed.target === pendingEdge.source));
      if (!exists) setEdges([...edges, { source: pendingEdge.source, target: pendingEdge.target, weight }]);
      setPendingEdge(null);
      setWeightInput("1");
    }
  };

  const loadPreset = (type) => {
    let n = [], e = [];
    const center = { x: 250, y: 250 }, r = 120;
    if (['triangle', 'square', 'pentagon', 'k5'].includes(type)) {
      const count = type === 'triangle' ? 3 : type === 'square' ? 4 : 5;
      for(let i=0; i<count; i++) n.push({ id: i.toString(), x: center.x + r*Math.cos(-Math.PI/2 + (2*Math.PI*i)/count), y: center.y + r*Math.sin(-Math.PI/2 + (2*Math.PI*i)/count) });
      if (type === 'k5') {
        for(let i=0; i<count; i++) for(let j=i+1; j<count; j++) e.push({ source: i.toString(), target: j.toString(), weight: Math.floor(Math.random()*10)+1 });
      } else {
        for(let i=0; i<count; i++) e.push({ source: i.toString(), target: ((i+1)%count).toString(), weight: Math.floor(Math.random()*10)+1 });
      }
    } else if (type === 'dag') {
      setIsDirected(true);
      n = [{id:'0', x:100, y:250}, {id:'1', x:250, y:150}, {id:'2', x:250, y:350}, {id:'3', x:400, y:150}, {id:'4', x:400, y:350}, {id:'5', x:550, y:250}];
      e = [{source:'0', target:'1', weight:1}, {source:'0', target:'2', weight:2}, {source:'1', target:'3', weight:3}, {source:'2', target:'4', weight:1}, {source:'3', target:'5', weight:4}, {source:'4', target:'5', weight:2}, {source:'1', target:'4', weight:5}];
    }
    setNodes(n); setEdges(e); setSelectedNode(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, width: '100%' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" checked={isDirected} onChange={e => setIsDirected(e.target.checked)} /> Directed
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" checked={isWeighted} onChange={e => setIsWeighted(e.target.checked)} /> Weighted
        </label>
        <button style={btnStyle} onClick={() => { setNodes([]); setEdges([]); setSelectedNode(null); }}>Clear</button>
        <div style={{ display: 'flex', gap: '8px', borderLeft: '1px solid var(--border-primary)', paddingLeft: '16px' }}>
          <button style={btnStyle} onClick={() => loadPreset('triangle')}>Triangle</button>
          <button style={btnStyle} onClick={() => loadPreset('square')}>Square</button>
          <button style={btnStyle} onClick={() => loadPreset('pentagon')}>Pentagon</button>
          <button style={btnStyle} onClick={() => loadPreset('k5')}>Complete K5</button>
          <button style={btnStyle} onClick={() => loadPreset('dag')}>DAG</button>
        </div>
        <div style={{fontSize:'0.85em', color:'var(--text-muted)'}}>(Right click to delete node/edge)</div>
        {pendingEdge && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.9em' }}>Edge {pendingEdge.source} → {pendingEdge.target} Weight:</span>
            <input style={{ ...inputStyle, width: '60px' }} value={weightInput} onChange={e => setWeightInput(e.target.value)} />
            <button style={btnStyle} onClick={submitWeight}>Set Weight</button>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
        <div style={{ flex: 2, border: '1px solid var(--border-primary)', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
          <svg 
            ref={svgRef} width="100%" height="100%" 
            onClick={handleCanvasClick} onMouseMove={handleMouseMove} onMouseUp={() => setDraggingNode(null)} onMouseLeave={() => setDraggingNode(null)} onContextMenu={e => e.preventDefault()}
          >
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--border-primary)" />
              </marker>
            </defs>
            {edges.map((edge, i) => {
              const src = nodes.find(n => n.id === edge.source), tgt = nodes.find(n => n.id === edge.target);
              if (!src || !tgt) return null;
              return (
                <g key={`edge-${i}`} onContextMenu={(e) => handleEdgeContextMenu(e, i)} style={{ cursor: 'pointer' }}>
                  <line x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y} stroke="var(--border-primary)" strokeWidth="3" markerEnd={isDirected ? "url(#arrow)" : ""} />
                  <line x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y} stroke="transparent" strokeWidth="15" />
                  {isWeighted && <text x={(src.x+tgt.x)/2} y={(src.y+tgt.y)/2 - 10} fill="var(--accent)" fontWeight="bold" textAnchor="middle">{edge.weight}</text>}
                </g>
              );
            })}
            {nodes.map(node => (
              <g key={node.id} onClick={(e) => handleNodeClick(e, node.id)} onMouseDown={(e) => handleNodeMouseDown(e, node.id)} style={{ cursor: 'pointer' }} onContextMenu={e => e.preventDefault()}>
                <circle cx={node.x} cy={node.y} r="20" fill={selectedNode === node.id ? 'var(--accent)' : 'var(--bg-primary)'} stroke={selectedNode === node.id ? 'var(--accent)' : 'var(--border-primary)'} strokeWidth="2" />
                <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill={selectedNode === node.id ? '#000' : 'var(--text-primary)'} fontWeight="bold" style={{ pointerEvents: 'none' }}>{node.id}</text>
              </g>
            ))}
          </svg>
        </div>
        
        <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '16px', overflowY: 'auto' }}>
          <h3 style={{ marginTop: 0 }}>Adjacency List</h3>
          {nodes.map(node => {
            const nbrs = edges.filter(e => e.source === node.id || (!isDirected && e.target === node.id)).map(e => `${e.source === node.id ? e.target : e.source}${isWeighted ? `(${e.weight})` : ''}`);
            return <div key={`adj-${node.id}`} style={{ marginBottom: '8px' }}><strong>{node.id}:</strong> {nbrs.join(', ')}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

const TraversalsTab = ({ nodes, edges, isDirected, setHighlightLines, setCode }) => {
  const [algo, setAlgo] = useState('BFS');
  useEffect(() => { setCode(algo === 'BFS' ? BFS_CODE : DFS_CODE); }, [algo, setCode]);
  const [state, setState] = useState(null); // { q, visited, curr, order }
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const timer = useRef(null);

  const getAdj = () => {
    const adj = {};
    nodes.forEach(n => { adj[n.id] = []; });
    edges.forEach(e => { adj[e.source].push(e.target); if (!isDirected) adj[e.target].push(e.source); });
    return adj;
  };

  const start = (id) => { setState({ q: [id], visited: new Set(), curr: null, order: [], phase: 'dequeue' }); setPlaying(false); setHighlightLines([1, 2]); };

  const step = () => {
    if (!state || (state.q.length === 0 && state.phase === 'dequeue')) { setPlaying(false); return; }
    setState(prev => {
      const q = [...prev.q], visited = new Set(prev.visited), order = [...prev.order];
      let { curr, phase } = prev;

      if (phase === 'dequeue') {
        setHighlightLines([3, 4]);
        curr = algo === 'BFS' ? q.shift() : q.pop();
        if (!visited.has(curr)) {
          visited.add(curr); order.push(curr);
          phase = 'check';
        } else {
          phase = 'dequeue';
        }
      } else if (phase === 'check') {
        setHighlightLines([5, 6]);
        phase = 'enqueue';
      } else if (phase === 'enqueue') {
        setHighlightLines([7, 8]);
        const nbrs = getAdj()[curr] || [];
        for (const n of (algo === 'BFS' ? nbrs : nbrs.reverse())) {
          if (!visited.has(n) && !q.includes(n)) q.push(n);
        }
        phase = 'dequeue';
      }
      return { q, visited, curr, order, phase };
    });
  };

  useEffect(() => {
    if (playing) timer.current = setTimeout(step, speed);
    return () => clearTimeout(timer.current);
  }, [playing, state, speed]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, width: '100%' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <select style={inputStyle} value={algo} onChange={e => { setAlgo(e.target.value); setState(null); setPlaying(false); }}>
          <option value="BFS">BFS</option><option value="DFS">DFS</option>
        </select>
        <button style={btnStyle} onClick={() => setPlaying(!playing)} disabled={!state || state.q.length === 0}>{playing ? 'Pause' : 'Play'}</button>
        <button style={btnStyle} onClick={step} disabled={playing || !state || state.q.length === 0}>Step</button>
        <button style={btnStyle} onClick={() => { setState(null); setPlaying(false); }}>Reset</button>
        <label>Speed: <input type="range" min="100" max="2000" value={2100 - speed} onChange={e => setSpeed(2100 - e.target.value)} /></label>
        <div style={{ color: 'var(--text-muted)' }}>Click a node to start</div>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
        <div style={{ flex: 2, border: '1px solid var(--border-primary)', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
          <svg width="100%" height="100%">
            <defs><marker id="arrow" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="var(--border-primary)" /></marker></defs>
            {edges.map((edge, i) => {
              const src = nodes.find(n => n.id === edge.source), tgt = nodes.find(n => n.id === edge.target);
              if (!src || !tgt) return null;
              return <line key={i} x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y} stroke="var(--border-primary)" strokeWidth="2" markerEnd={isDirected ? "url(#arrow)" : ""} />;
            })}
            {nodes.map(n => {
              let fill = COLORS.unvisited;
              if (state) {
                if (state.curr === n.id) fill = COLORS.current;
                else if (state.visited.has(n.id)) fill = COLORS.visited;
                else if (state.q.includes(n.id)) fill = COLORS.queued;
              }
              return (
                <g key={n.id} onClick={() => !playing && start(n.id)} style={{ cursor: 'pointer' }}>
                  <circle cx={n.x} cy={n.y} r="20" fill={fill} stroke={fill} strokeWidth="2" />
                  <text x={n.x} y={n.y} textAnchor="middle" dy=".3em" fill="#000" fontWeight="bold">{n.id}</text>
                </g>
              );
            })}
          </svg>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>{algo === 'BFS' ? 'Queue' : 'Stack'}</h3>
            <div style={{ display: 'flex', flexDirection: algo === 'BFS' ? 'row' : 'column', gap: '8px', flexWrap: 'wrap' }}>
              {state?.q.map((id, i) => <div key={i} style={{ padding: '8px', backgroundColor: COLORS.queued, color: '#000', borderRadius: '4px', fontWeight: 'bold' }}>{id}</div>)}
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>Visit Order</h3>
            <ol style={{ paddingLeft: '20px', margin: 0 }}>
              {state?.order.map((id, i) => <li key={i}>{id}</li>)}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlgorithmsTab = ({ nodes, edges, isDirected, isWeighted, setHighlightLines, setCode }) => {
  const [algo, setAlgo] = useState('dijkstra');
  const [state, setState] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const timer = useRef(null);

  useEffect(() => {
    if (algo === 'dijkstra') setCode(DIJKSTRA_CODE);
    else if (algo === 'prim') setCode(PRIM_CODE);
    else if (algo === 'kruskal') setCode(KRUSKAL_CODE);
    else if (algo === 'topo') setCode(TOPO_CODE);
    setHighlightLines([]);
  }, [algo, setCode, setHighlightLines]);

  const startAlgo = (startNode = null) => {
    if (algo === 'dijkstra') {
      if(!startNode) return;
      const dist = {}; nodes.forEach(n => dist[n.id] = Infinity); dist[startNode] = 0;
      setState({ step: 'init', dist, prev: {}, unvisited: new Set(nodes.map(n=>n.id)), curr: null, mstEdges: [], pc: 0 });
      setHighlightLines([1, 2]);
    } else if (algo === 'prim') {
      if(!startNode) return;
      setState({ step: 'init', inMST: new Set([startNode]), mstEdges: [], pc: 0 });
      setHighlightLines([1]);
    } else if (algo === 'kruskal') {
      const sortedEdges = [...edges].sort((a,b)=>a.weight - b.weight);
      setState({ step: 'init', sortedEdges, edgeIdx: 0, mstEdges: [], uf: Object.fromEntries(nodes.map(n=>[n.id, n.id])), pc: 0 });
      setHighlightLines([1, 2]);
    } else if (algo === 'topo') {
      const inDegree = {}; nodes.forEach(n => inDegree[n.id] = 0);
      edges.forEach(e => inDegree[e.target]++);
      const q = Object.keys(inDegree).filter(k => inDegree[k] === 0);
      setState({ step: 'init', inDegree, q, order: [], pc: 0 });
      setHighlightLines([1, 2]);
    }
    setPlaying(false);
  };

  const stepAlgo = () => {
    if(!state) return;
    setState(prev => {
      const s = { ...prev };
      if (algo === 'dijkstra') {
        if (s.unvisited.size === 0) { setPlaying(false); s.pc = -1; setHighlightLines([9]); return s; }
        let u = null, minD = Infinity;
        s.unvisited.forEach(n => { if(s.dist[n] < minD) { minD = s.dist[n]; u = n; }});
        if (u === null) { setPlaying(false); s.pc = -1; setHighlightLines([9]); return s; }
        s.curr = u; s.unvisited.delete(u);
        setHighlightLines([4, 5]);
        const adj = edges.filter(e => e.source === u || (!isDirected && e.target === u));
        adj.forEach(e => {
          const v = e.source === u ? e.target : e.source;
          if (s.unvisited.has(v)) {
            const alt = s.dist[u] + e.weight;
            if (alt < s.dist[v]) { s.dist[v] = alt; s.prev[v] = u; }
          }
        });
        s.pc = 1;
      } else if (algo === 'prim') {
        if (s.inMST.size === nodes.length) { setPlaying(false); s.pc = -1; return s; }
        let minE = null, minW = Infinity;
        edges.forEach(e => {
          const hasSrc = s.inMST.has(e.source), hasTgt = s.inMST.has(e.target);
          if ((hasSrc && !hasTgt) || (!isDirected && hasTgt && !hasSrc)) {
            if (e.weight < minW) { minW = e.weight; minE = e; }
          }
        });
        if (!minE) { setPlaying(false); s.pc = -1; return s; }
        s.inMST.add(s.inMST.has(minE.source) ? minE.target : minE.source);
        s.mstEdges.push(minE);
        setHighlightLines([3, 4]);
        s.pc = 1;
      } else if (algo === 'kruskal') {
        if (s.edgeIdx >= s.sortedEdges.length || s.mstEdges.length === nodes.length - 1) { setPlaying(false); s.pc = -1; setHighlightLines([8]); return s; }
        const e = s.sortedEdges[s.edgeIdx++];
        const find = (i) => { while(s.uf[i] !== i) i = s.uf[i]; return i; };
        const root1 = find(e.source), root2 = find(e.target);
        if (root1 !== root2) { s.uf[root1] = root2; s.mstEdges.push(e); setHighlightLines([5, 6]); } else { setHighlightLines([4]); }
        s.pc = 1;
      } else if (algo === 'topo') {
        if (s.q.length === 0) { setPlaying(false); s.pc = -1; setHighlightLines([9]); return s; }
        const u = s.q.shift();
        s.order.push(u);
        setHighlightLines([4, 5]);
        edges.filter(e => e.source === u).forEach(e => {
          s.inDegree[e.target]--;
          if (s.inDegree[e.target] === 0) s.q.push(e.target);
        });
        s.pc = 1;
      }
      return s;
    });
  };

  useEffect(() => {
    if (playing) timer.current = setTimeout(stepAlgo, speed);
    return () => clearTimeout(timer.current);
  }, [playing, state, speed]);

  const isEdgeInMST = (e) => state && state.mstEdges && state.mstEdges.some(me => (me.source === e.source && me.target === e.target) || (!isDirected && me.source === e.target && me.target === e.source));
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, width: '100%' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <select style={inputStyle} value={algo} onChange={e => { setAlgo(e.target.value); setState(null); setPlaying(false); }}>
          <option value="dijkstra" disabled={!isWeighted}>Dijkstra (Shortest Path)</option>
          <option value="prim" disabled={!isWeighted}>Prim's MST</option>
          <option value="kruskal" disabled={!isWeighted}>Kruskal's MST</option>
          <option value="topo" disabled={!isDirected}>Topological Sort</option>
        </select>
        <button style={btnStyle} onClick={() => setPlaying(!playing)} disabled={!state || state.pc === -1}>{playing ? 'Pause' : 'Play'}</button>
        <button style={btnStyle} onClick={stepAlgo} disabled={playing || !state || state.pc === -1}>Step</button>
        <button style={btnStyle} onClick={() => { setState(null); setPlaying(false); }}>Reset</button>
        {algo !== 'kruskal' && algo !== 'topo' && <div style={{ color: 'var(--text-muted)' }}>Click a node to start</div>}
        {(algo === 'kruskal' || algo === 'topo') && <button style={btnStyle} onClick={() => startAlgo(nodes[0]?.id)}>Start</button>}
      </div>
      
      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
        <div style={{ flex: 2, border: '1px solid var(--border-primary)', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
          <svg width="100%" height="100%">
            <defs><marker id="arrow" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="var(--border-primary)" /></marker></defs>
            {edges.map((edge, i) => {
              const src = nodes.find(n => n.id === edge.source), tgt = nodes.find(n => n.id === edge.target);
              if (!src || !tgt) return null;
              const mst = isEdgeInMST(edge);
              return (
                <g key={i}>
                  <line x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y} stroke={mst ? COLORS.mst : "var(--border-primary)"} strokeWidth={mst ? 4 : 2} markerEnd={isDirected ? "url(#arrow)" : ""} />
                  {isWeighted && <text x={(src.x+tgt.x)/2} y={(src.y+tgt.y)/2 - 10} fill={mst ? COLORS.mst : "var(--accent)"} fontWeight="bold" textAnchor="middle">{edge.weight}</text>}
                </g>
              );
            })}
            {nodes.map(n => {
              let fill = COLORS.unvisited;
              if (state) {
                if (algo === 'dijkstra') {
                  if (state.curr === n.id) fill = COLORS.current;
                  else if (!state.unvisited.has(n.id)) fill = COLORS.visited;
                } else if (algo === 'prim' && state.inMST.has(n.id)) fill = COLORS.mst;
                else if (algo === 'topo' && state.order.includes(n.id)) fill = COLORS.visited;
              }
              return (
                <g key={n.id} onClick={() => !playing && startAlgo(n.id)} style={{ cursor: 'pointer' }}>
                  <circle cx={n.x} cy={n.y} r="20" fill={fill} stroke={fill} strokeWidth="2" />
                  <text x={n.x} y={n.y} textAnchor="middle" dy=".3em" fill="#000" fontWeight="bold">{n.id}</text>
                </g>
              );
            })}
          </svg>
        </div>
        
        <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', overflowY: 'auto' }}>
          <h3 style={{ marginTop: 0 }}>Algorithm State</h3>
          {state && algo === 'dijkstra' && (
            <table style={{ width: '100%', textAlign: 'left' }}>
              <thead><tr><th>Node</th><th>Dist</th><th>Prev</th></tr></thead>
              <tbody>
                {nodes.map(n => <tr key={n.id} style={{ color: state.curr===n.id ? COLORS.current : 'inherit' }}>
                  <td>{n.id}</td><td>{state.dist[n.id] === Infinity ? '∞' : state.dist[n.id]}</td><td>{state.prev[n.id] ?? '-'}</td>
                </tr>)}
              </tbody>
            </table>
          )}
          {state && algo === 'prim' && (
             <div>
               <strong>Total MST Weight: </strong> {state.mstEdges.reduce((sum, e) => sum + e.weight, 0)}
             </div>
          )}
          {state && algo === 'kruskal' && (
             <div>
               <strong>Edges sorted by weight:</strong>
               <div style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>
                 {state.sortedEdges.map((e,i) => <span key={i} style={{ color: i<state.edgeIdx ? (state.mstEdges.includes(e)?COLORS.mst:'#555') : 'inherit' }}> {e.source}-{e.target}({e.weight}) </span>)}
               </div>
             </div>
          )}
          {state && algo === 'topo' && (
             <div>
               <strong>Queue:</strong> {state.q.join(', ')} <br/>
               <strong>Order:</strong> {state.order.join(' -> ')}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
