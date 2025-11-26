import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-blueprint-950 border border-blueprint-500 w-full max-w-2xl shadow-[0_0_30px_rgba(100,149,237,0.2)] flex flex-col max-h-[90vh] relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blueprint-300"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blueprint-300"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blueprint-300"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blueprint-300"></div>

        <div className="flex justify-between items-center p-4 border-b border-blueprint-500/30 bg-blueprint-900/50">
          <h2 className="text-xl font-mono text-blueprint-400 tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-blueprint-500 animate-pulse"></span>
            {title}
          </h2>
          <button onClick={onClose} className="text-blueprint-600 hover:text-blueprint-400 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto bg-blueprint-950 bg-grid-pattern text-blueprint-200 font-mono">
          {children}
        </div>
      </div>
    </div>
  );
};