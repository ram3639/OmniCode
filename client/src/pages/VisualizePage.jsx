import React, { useState } from 'react';
import { ArrowUpDown, Search, Layers, ListOrdered, Link2, GitBranch, Share2, Map, RefreshCw, BarChart3, Type, Undo2, Timer, Network, Grid3x3, Droplets, Gamepad2, Disc } from 'lucide-react';
import SortingVisualizer from '../components/visualizer/SortingVisualizer';
import DataStructureVisualizer from '../components/visualizer/DataStructureVisualizer';
import SearchingVisualizer from '../components/visualizer/SearchingVisualizer';
import PathfindingVisualizer from '../components/visualizer/PathfindingVisualizer';
import TimeComplexityCalculator from '../components/visualizer/TimeComplexityCalculator';
import ASTVisualizer from '../components/visualizer/ASTVisualizer';
import StackVisualizer from '../components/visualizer/StackVisualizer';
import QueueVisualizer from '../components/visualizer/QueueVisualizer';
import LinkedListVisualizer from '../components/visualizer/LinkedListVisualizer';
import TreeVisualizer from '../components/visualizer/TreeVisualizer';
import GraphVisualizer from '../components/visualizer/GraphVisualizer';
import RecursionVisualizer from '../components/visualizer/RecursionVisualizer';
import DPVisualizer from '../components/visualizer/DPVisualizer';
import StringMatchingVisualizer from '../components/visualizer/StringMatchingVisualizer';
import BacktrackingVisualizer from '../components/visualizer/BacktrackingVisualizer';
import PuzzleVisualizer from '../components/visualizer/PuzzleVisualizer';
import WaterJugVisualizer from '../components/visualizer/WaterJugVisualizer';
import TicTacToeVisualizer from '../components/visualizer/TicTacToeVisualizer';
import HanoiVisualizer from '../components/visualizer/HanoiVisualizer';

const CATEGORIES = [
  { id: 'sorting', label: 'Sorting', icon: ArrowUpDown, component: SortingVisualizer },
  { id: 'searching', label: 'Searching', icon: Search, component: SearchingVisualizer },
  { id: 'stack', label: 'Stack', icon: Layers, component: StackVisualizer },
  { id: 'queue', label: 'Queue', icon: ListOrdered, component: QueueVisualizer },
  { id: 'linked-list', label: 'Linked List', icon: Link2, component: LinkedListVisualizer },
  { id: 'tree', label: 'Trees', icon: GitBranch, component: TreeVisualizer },
  { id: 'graph', label: 'Graphs', icon: Share2, component: GraphVisualizer },
  { id: 'pathfinding', label: 'Pathfinding', icon: Map, component: PathfindingVisualizer },
  { id: 'recursion', label: 'Recursion', icon: RefreshCw, component: RecursionVisualizer },
  { id: 'dp', label: 'Dynamic Prog.', icon: BarChart3, component: DPVisualizer },
  { id: 'string-matching', label: 'String Match', icon: Type, component: StringMatchingVisualizer },
  { id: 'backtracking', label: 'Backtracking', icon: Undo2, component: BacktrackingVisualizer },
  null, // separator
  { id: '8-puzzle', label: '8-Puzzle', icon: Grid3x3, component: PuzzleVisualizer },
  { id: 'water-jug', label: 'Water Jug', icon: Droplets, component: WaterJugVisualizer },
  { id: 'tic-tac-toe', label: 'Tic-Tac-Toe', icon: Gamepad2, component: TicTacToeVisualizer },
  { id: 'hanoi', label: 'Tower of Hanoi', icon: Disc, component: HanoiVisualizer },
  null, // separator
  { id: 'data-structures', label: 'Array / DS', icon: Layers, component: DataStructureVisualizer },
  { id: 'time-complexity', label: 'Time Complex.', icon: Timer, component: TimeComplexityCalculator },
  { id: 'ast-flow', label: 'AST Flow', icon: Network, component: ASTVisualizer },
];

export default function VisualizePage() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);

  const ActiveComponent = CATEGORIES.find((c) => c && c.id === activeTab)?.component || SortingVisualizer;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 48px)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <div style={{ width: '190px', flexShrink: 0, borderRight: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', overflowY: 'auto', padding: '8px 0' }}>
        <div style={{ padding: '8px 16px 10px', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
          Visualizers
        </div>
        {CATEGORIES.map((cat, index) => {
          if (cat === null) {
            return <div key={`sep-${index}`} style={{ height: '1px', backgroundColor: 'var(--border-primary)', margin: '6px 16px' }} />;
          }
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '8px 16px',
                border: 'none', background: isActive ? 'rgba(196, 149, 106, 0.1)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer',
                fontSize: '12.5px', fontWeight: isActive ? 600 : 400, textAlign: 'left',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              <Icon size={15} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ActiveComponent />
      </div>
    </div>
  );
}
