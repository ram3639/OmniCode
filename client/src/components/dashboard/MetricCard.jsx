import React from 'react';

const MetricCard = ({ title, value, icon }) => (
  <div className="bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-[var(--radius-md)] p-5 flex items-center justify-between">
    <div>
      <div className="text-[var(--text-secondary)] text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
    <div className="text-[var(--accent-primary)] bg-[var(--accent-primary)] bg-opacity-10 p-3 rounded-full">
      {icon}
    </div>
  </div>
);

export default MetricCard;
