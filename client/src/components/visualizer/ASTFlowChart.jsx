import React, { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import CustomNode from './CustomNodes';
import { useThemeStore } from '../../store/themeStore';

const nodeTypes = {
  custom: CustomNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 250;
const nodeHeight = 80;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

export default function ASTFlowChart({ astData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { theme } = useThemeStore();

  useEffect(() => {
    if (astData && astData.nodes && astData.edges) {
      const formattedNodes = astData.nodes.map(n => ({
        id: n.id,
        type: 'custom',
        data: {
          label: n.type,
          value: n.value,
          nodeType: n.type
        },
        position: { x: 0, y: 0 }
      }));

      const formattedEdges = astData.edges.map(e => ({
        id: `${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        label: e.label,
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'var(--accent)', strokeWidth: 1.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'var(--accent)'
        },
        labelStyle: { fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }
      }));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        formattedNodes,
        formattedEdges
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    }
  }, [astData, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color={theme === 'dark' ? '#374151' : '#E5E7EB'} gap={16} />
        <Controls className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] fill-[var(--text-primary)]" />
        <Panel position="top-right" className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-3 shadow-sm">
          <div className="text-sm font-medium text-[var(--text-primary)] mb-2">Node Types</div>
          <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-indigo-500"></div> Function/Class</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500"></div> Loop</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-500"></div> Condition</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-gray-500"></div> Statement</div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
