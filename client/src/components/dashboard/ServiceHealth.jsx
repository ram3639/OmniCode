import React from 'react';

const ServiceHealth = ({ services }) => {
  return (
    <div className="space-y-3">
      {Object.entries(services).map(([name, status]) => (
        <div key={name} className="flex items-center justify-between p-3 bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-[var(--radius-sm)]">
          <span className="text-white capitalize">{name}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)] capitalize">{status}</span>
            <div className={`w-2.5 h-2.5 rounded-full ${status === 'up' ? 'bg-[var(--accent-success)]' : status === 'down' ? 'bg-[var(--accent-danger)]' : 'bg-gray-500'}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceHealth;
