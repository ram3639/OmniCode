import React from 'react';

const ExplainerTooltip = ({ content, x, y }) => {
  if (!content) return null;
  return (
    <div 
      className="absolute z-50 bg-[var(--bg-elevated)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] p-2 shadow-lg text-sm text-[var(--text-primary)] max-w-xs pointer-events-none"
      style={{ left: x, top: y }}
    >
      {content}
    </div>
  );
};

export default ExplainerTooltip;
