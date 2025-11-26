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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm p-4">
      <div className="bg-noir-900 border-2 border-gold-600 w-full max-w-2xl shadow-[0_0_50px_rgba(197,160,40,0.15)] flex flex-col max-h-[90vh] relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold-400"></div>

        <div className="flex justify-between items-center p-5 border-b border-gold-600/30 bg-noir-800">
          <h2 className="text-2xl font-serif text-paper-200 tracking-wider uppercase">{title}</h2>
          <button onClick={onClose} className="text-gold-600/60 hover:text-gold-400 transition-colors">
            <X size={28} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto bg-noir-900 bg-noise text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};