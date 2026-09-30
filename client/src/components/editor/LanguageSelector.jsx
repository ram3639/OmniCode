import React from 'react';

const LanguageSelector = ({ value, onChange }) => {
  return (
    <select 
      value={value}
      onChange={onChange}
      className="bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm px-3 py-1 rounded border border-[var(--glass-border)] focus:outline-none"
    >
      <option value="python">Python 3</option>
      <option value="cpp">C++</option>
      <option value="c">C</option>
      <option value="java">Java</option>
    </select>
  );
};

export default LanguageSelector;
