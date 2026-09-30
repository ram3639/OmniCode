import React from 'react';
import { Handle, Position } from '@xyflow/react';

const BaseNode = ({ data, borderColor, bgClass = 'bg-[var(--bg-elevated)]' }) => (
  <div className={`px-4 py-2 shadow-md rounded-[var(--radius-sm)] border-2 ${borderColor} ${bgClass} text-white min-w-[120px] text-center`}>
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-white" />
    <div className="text-sm font-medium font-mono">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-white" />
  </div>
);

export const FunctionNode = ({ data }) => <BaseNode data={data} borderColor="border-[var(--accent-primary)]" />;
export const ConditionNode = ({ data }) => (
  <div className="px-4 py-4 shadow-md bg-[var(--bg-elevated)] border-2 border-[var(--accent-warning)] text-white text-center transform rotate-45 min-w-[80px] flex items-center justify-center">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-white -rotate-45" />
    <div className="text-xs font-medium font-mono -rotate-45">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-white -rotate-45" />
  </div>
);
export const LoopNode = ({ data }) => <BaseNode data={data} borderColor="border-[var(--accent-info)]" />;
export const StatementNode = ({ data }) => <BaseNode data={data} borderColor="border-[var(--glass-border)]" bgClass="bg-[var(--bg-surface)]" />;
export const ErrorNode = ({ data }) => <BaseNode data={data} borderColor="border-[var(--accent-danger)] shadow-[0_0_10px_rgba(239,68,68,0.5)]" />;
export const ReturnNode = ({ data }) => <BaseNode data={data} borderColor="border-[var(--accent-success)]" />;
