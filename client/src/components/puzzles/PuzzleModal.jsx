import React from 'react';
import ParsonsPuzzle from './ParsonsPuzzle';
import { X } from 'lucide-react';

const PuzzleModal = ({ isOpen, onClose, challenge }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--bg-elevated)] border border-[var(--glass-border)] rounded-[var(--radius-lg)] w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between bg-[var(--bg-surface)]">
          <h2 className="text-lg font-bold text-white">{challenge?.title || 'Parsons Puzzle'}</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <ParsonsPuzzle />
        </div>
      </div>
    </div>
  );
};

export default PuzzleModal;
