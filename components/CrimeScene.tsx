import React, { useState } from 'react';
import { Evidence } from '../types';
import { Search, MapPin, AlertCircle, Maximize2 } from 'lucide-react';
import { Modal } from './Modal';

interface CrimeSceneProps {
  evidence: Evidence[];
  onCollectEvidence: (evidenceId: string) => void;
}

export const CrimeScene: React.FC<CrimeSceneProps> = ({ evidence, onCollectEvidence }) => {
  const [selectedItem, setSelectedItem] = useState<Evidence | null>(null);

  const sceneItems = evidence.filter(e => e.location);

  const handleItemClick = (item: Evidence) => {
    setSelectedItem(item);
  };

  const handleCollect = () => {
    if (selectedItem) {
      onCollectEvidence(selectedItem.id);
      setSelectedItem(null);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-noir-950 bg-noise relative">
      {/* Blueprint Header */}
      <div className="flex justify-between items-end mb-4 border-b-2 border-white/20 pb-4 z-10">
        <div>
           <h2 className="text-2xl md:text-3xl font-serif font-bold text-paper-200 tracking-wider">CRIME SCENE: LIBRARY</h2>
           <div className="flex items-center gap-3 mt-1">
             <span className="bg-red-900/40 text-red-400 text-xs px-2 py-1 border border-red-900/60 uppercase font-mono tracking-widest">Zone Sealed</span>
             <span className="text-gray-500 font-mono text-xs uppercase">Ashford Manor, Floor 1</span>
           </div>
        </div>
        <div className="text-right hidden md:block">
           <p className="font-mono text-xs text-gold-600">CASE #10-13</p>
           <p className="font-mono text-xs text-gray-500">23:47 PM</p>
        </div>
      </div>

      {/* Blueprint Container */}
      <div className="relative flex-grow border-4 border-[#2a3b55] shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-sm bg-[#1a2332] group cursor-crosshair">
        
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(100,149,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,149,237,0.3) 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* Blueprint SVG */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 800 600" className="w-full h-full p-4 md:p-12" preserveAspectRatio="xMidYMid meet">
             <defs>
               <pattern id="hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                 <line x1="0" y1="0" x2="0" y2="10" style={{stroke: '#6495ED', strokeWidth: 1, opacity: 0.3}} />
               </pattern>
             </defs>

             {/* Floor Plan Outline */}
             <path d="M50 50 L750 50 L750 550 L50 550 Z" fill="none" stroke="#6495ED" strokeWidth="4" />
             
             {/* Window Top */}
             <path d="M350 50 L350 40 L450 40 L450 50" fill="none" stroke="#6495ED" strokeWidth="2" />
             <path d="M350 50 Q 400 20 450 50" fill="none" stroke="#6495ED" strokeWidth="1" strokeDasharray="4 2" />
             <text x="385" y="35" fill="#6495ED" fontSize="10" fontFamily="monospace" opacity="0.8">WINDOW</text>

             {/* Door Bottom */}
             <path d="M150 550 L150 500 A 50 50 0 0 1 250 550" fill="none" stroke="#6495ED" strokeWidth="2" strokeDasharray="5,5"/>
             <text x="160" y="530" fill="#6495ED" fontSize="10" fontFamily="monospace" opacity="0.8">ENTRANCE</text>

             {/* Bookshelves Left */}
             <rect x="60" y="100" width="30" height="400" fill="url(#hatch)" stroke="#6495ED" strokeWidth="2" />
             <text x="75" y="300" fill="#6495ED" fontSize="12" fontFamily="monospace" opacity="0.8" transform="rotate(-90 75,300)">LIBRARY ARCHIVE</text>

             {/* Bookshelves Top Right */}
             <rect x="600" y="60" width="140" height="30" fill="url(#hatch)" stroke="#6495ED" strokeWidth="2" />

             {/* Fireplace Right */}
             <path d="M750 250 L720 250 L720 350 L750 350" fill="none" stroke="#6495ED" strokeWidth="2" />
             <rect x="730" y="260" width="20" height="80" fill="url(#hatch)" stroke="none" />
             <text x="705" y="300" fill="#6495ED" fontSize="10" fontFamily="monospace" opacity="0.8" transform="rotate(-90 705,300)">FIREPLACE</text>

             {/* Main Rug */}
             <rect x="250" y="150" width="300" height="300" rx="10" fill="none" stroke="#6495ED" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />

             {/* Main Desk Area */}
             <g transform="translate(450, 200)">
               <rect x="0" y="0" width="120" height="60" fill="#1a2332" stroke="#6495ED" strokeWidth="2" />
               <path d="M10 10 L110 10 M10 50 L110 50" stroke="#6495ED" strokeWidth="1" opacity="0.5" />
               <text x="35" y="35" fill="#6495ED" fontSize="10" fontFamily="monospace">DESK</text>
               {/* Chair */}
               <path d="M40 -10 L80 -10 L80 0 L40 0 Z" fill="none" stroke="#6495ED" strokeWidth="1" />
             </g>

             {/* Side Table */}
             <circle cx="620" cy="300" r="25" fill="#1a2332" stroke="#6495ED" strokeWidth="2" />
             
             {/* Body Position Outline (Chalk outline style) */}
             <g transform="translate(380, 320) rotate(-10)">
                <path d="M0,0 Q20,-40 50,-40 T100,0 T100,80 T50,120 T0,80 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,3" opacity="0.7" />
                <circle cx="50" cy="-50" r="20" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,3" opacity="0.7" />
                <line x1="50" y1="-30" x2="50" y2="0" stroke="white" strokeWidth="2" strokeDasharray="5,3" opacity="0.7" />
                <text x="10" y="50" fill="white" fontSize="12" fontFamily="monospace" opacity="0.8">VICTIM</text>
             </g>

             {/* Measurement Lines for Aesthetic */}
             <line x1="50" y1="580" x2="750" y2="580" stroke="#6495ED" strokeWidth="1" opacity="0.5" />
             <line x1="50" y1="575" x2="50" y2="585" stroke="#6495ED" strokeWidth="1" opacity="0.5" />
             <line x1="750" y1="575" x2="750" y2="585" stroke="#6495ED" strokeWidth="1" opacity="0.5" />
             <text x="380" y="590" fill="#6495ED" fontSize="10" fontFamily="monospace" opacity="0.5">12.5 meters</text>

          </svg>
        </div>

        {/* Interactive Evidence Markers */}
        {sceneItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group z-20
              ${item.isCollected 
                ? 'opacity-50' 
                : 'opacity-100 hover:scale-110'
              }`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            <div className={`relative flex items-center justify-center rounded-full
              ${item.isCollected 
                ? 'w-6 h-6 bg-green-900/40 border border-green-500' 
                : 'w-8 h-8 border-2 border-gold-400 bg-gold-900/20 shadow-[0_0_15px_rgba(255,215,0,0.6)] animate-pulse'
              }`}>
              
              {item.isCollected ? (
                <span className="text-green-500 text-[10px] font-mono">✓</span>
              ) : (
                <div className="w-1 h-1 bg-gold-400 rounded-full"></div>
              )}
            </div>

            {/* Hover Tooltip */}
            <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[#0a0a0a] border border-gold-500 px-3 py-1 text-xs text-gold-100 font-mono whitespace-nowrap z-30 pointer-events-none transition-all duration-200 shadow-xl
              ${item.isCollected ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
              <div className="flex flex-col text-left">
                <span className="font-bold uppercase tracking-widest text-[10px] text-gold-500">Evidence Signal</span>
                <span>{item.name}</span>
              </div>
            </div>
          </button>
        ))}
        
        {/* Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(10,15,25,0.8)_100%)]"></div>

      </div>

      {/* Modal for item inspection */}
      <Modal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        title={selectedItem?.name || 'Evidence'}
      >
        <div className="flex flex-col gap-6">
          <div className="bg-noir-950 p-8 rounded border border-noir-700 shadow-inner flex justify-center items-center min-h-[200px] relative overflow-hidden group">
             {/* Decorative grid in modal image */}
             <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '15px 15px'}}></div>
             
             <div className="relative z-10 p-6 border-2 border-dashed border-gray-600 rounded-full group-hover:border-gold-500/50 transition-colors bg-black/50">
                 <Search size={64} className="text-gray-400 group-hover:text-gold-500 transition-colors" />
             </div>
          </div>
          
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-gold-500 font-mono text-xs uppercase tracking-widest border-b border-gray-800 pb-2">
                <MapPin size={12} /> Location: {selectedItem?.location}
             </div>
             <p className="font-serif text-xl leading-relaxed text-gray-300">
                "{selectedItem?.description}"
             </p>
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-800">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Class: {selectedItem?.category}</span>
            {!selectedItem?.isCollected ? (
              <button 
                onClick={handleCollect}
                className="bg-gold-600 hover:bg-gold-500 text-black font-bold font-serif py-2 px-6 rounded-sm shadow-lg transition-all tracking-wider flex items-center gap-2"
              >
                LOG INTO EVIDENCE
              </button>
            ) : (
              <span className="text-green-500 font-mono text-xs flex items-center gap-2 border border-green-900 bg-green-900/10 px-4 py-2 uppercase tracking-widest">
                <AlertCircle size={14} /> Cataloged
              </span>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};