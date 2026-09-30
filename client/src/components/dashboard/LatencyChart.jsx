import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LatencyChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-[var(--text-muted)] text-sm h-full flex items-center justify-center">No telemetry data</div>;
  
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <XAxis dataKey="time" hide />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--glass-border)' }} />
        <Area type="monotone" dataKey="latency" stroke="var(--accent-info)" fill="var(--accent-info)" fillOpacity={0.2} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LatencyChart;
