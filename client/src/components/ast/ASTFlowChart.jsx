import React, { useCallback } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FunctionNode, ConditionNode, LoopNode, StatementNode, ErrorNode, ReturnNode } from './CustomNodes';

const nodeTypes = {
  function: FunctionNode,
  condition: ConditionNode,
  loop: LoopNode,
  statement: StatementNode,
  error: ErrorNode,
  return: ReturnNode
};

const ASTFlowChart = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(data?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data?.edges || []);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Update when data changes
  React.useEffect(() => {
    if (data) {
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    }
  }, [data, setNodes, setEdges]);

  return (
    <div className="w-full h-full min-h-[400px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[var(--bg-void)]"
      >
        <Controls className="bg-[var(--bg-surface)] border border-[var(--glass-border)] fill-white" />
        <Background color="var(--glass-border)" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default ASTFlowChart;
