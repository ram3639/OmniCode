import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = ({ data }) => {
  const getNodeColor = (type) => {
    const t = type.toLowerCase();
    if (t.includes('function') || t.includes('class') || t.includes('def')) {
      return { bg: 'bg-indigo-500', text: 'text-indigo-50', border: 'border-indigo-600' };
    }
    if (t.includes('for') || t.includes('while')) {
      return { bg: 'bg-blue-500', text: 'text-blue-50', border: 'border-blue-600' };
    }
    if (t.includes('if') || t.includes('else') || t.includes('switch') || t.includes('case')) {
      return { bg: 'bg-amber-500', text: 'text-amber-50', border: 'border-amber-600' };
    }
    return { bg: 'bg-gray-600', text: 'text-gray-50', border: 'border-gray-700' };
  };

  const colors = getNodeColor(data.nodeType || '');

  return (
    <div className={`px-4 py-2 shadow-sm rounded-md border ${colors.border} ${colors.bg} ${colors.text} min-w-[150px] max-w-[250px]`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-white" />
      
      <div className="flex flex-col">
        <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">
          {data.label}
        </div>
        {data.value && (
          <div className="text-sm font-mono truncate bg-black bg-opacity-20 px-2 py-1 rounded">
            {data.value}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-white" />
    </div>
  );
};

export default memo(CustomNode);
