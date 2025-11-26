import React, { useState } from 'react';
import { Evidence } from '../types';
import { Search, MapPin, AlertCircle } from 'lucide-react';
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
    <div className="h-full flex flex-col p-4 md:p-6 bg-noir-950 bg-noise">
      {/* Header */}
      <div className="flex justify-between items-end mb-4 border-b-2 border-white/20 pb-4">
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
      <div className="relative flex-grow border-4 border-white/10 shadow-2xl overflow-hidden rounded bg-[#1a2332] relative group cursor-crosshair">
        
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
        </div>

        {/* Blueprint SVG */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
          <svg viewBox="0 0 800 600" className="w-full h-full p-8" preserveAspectRatio="xMidYMid meet">
             {/* Definitions for patterns */}
             <defs>
               <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                 <line x1="0" y1="0" x2="0" y2="10" style={{stroke: 'white', strokeWidth: 1, opacity: 0.1}} />
               </pattern>
             </defs>

             {/* Floor - Rug */}
             <rect x="250" y="150" width="300" height="300" fill="none" stroke="white" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />

             {/* Walls */}
             <path d="M50 50 L750 50 L750 550 L50 550 Z" fill="none" stroke="white" strokeWidth="4" />
             
             {/* Window Top */}
             <rect x="350" y="45" width="100" height="10" fill="#1a2332" stroke="white" strokeWidth="2" />
             <path d="M350 45 L360 30 M450 45 L440 30" stroke="white" strokeWidth="1" opacity="0.5" />

             {/* Door Bottom */}
             <path d="M150 550 L150 500 A 50 50 0 0 1 200 550" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 2"/>
             <rect x="150" y="545" width="50" height="10" fill="#1a2332" />

             {/* Bookshelves Left */}
             <rect x="55" y="100" width="40" height="400" fill="url(#diagonalHatch)" stroke="white" strokeWidth="2" />
             <text x="65" y="300" fill="white" fontSize="12" fontFamily="monospace" opacity="0.5" transform="rotate(-90 65,300)">RARE BOOKS</text>

             {/* Bookshelves Top Right */}
             <rect x="600" y="55" width="145" height="40" fill="url(#diagonalHatch)" stroke="white" strokeWidth="2" />

             {/* Main Desk */}
             <rect x="450" y="200" width="140" height="80" fill="#1a2332" stroke="white" strokeWidth="2" />
             <rect x="460" y="190" width="40" height="20" fill="#1a2332" stroke="white" strokeWidth="1" opacity="0.5" /> {/* Chair */}
             <text x="470" y="245" fill="white" fontSize="10" fontFamily="monospace" opacity="0.7">PROF. DESK</text>

             {/* Side Table */}
             <circle cx="600" cy="300" r="25" fill="#1a2332" stroke="white" strokeWidth="2" />
             
             {/* Fireplace Right */}
             <rect x="740" y="250" width="10" height="100" fill="white" stroke="none" opacity="0.5" />
             <path d="M720 250 L720 350" stroke="white" strokeWidth="1" strokeDasharray="2,2" />

             {/* Body Outline - Abstract */}
             <g transform="translate(420, 350) rotate(-15)">
                <path d="M0,0 Q10,-30 30,-30 T60,0 T60,60 T30,90 T0,60 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
                <circle cx="30" cy="-40" r="15" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
                <text x="0" y="20" fill="white" fontSize="10" fontFamily="monospace" opacity="0.4">VICTIM</text>
             </g>
          </svg>
        </div>

        {/* Interactive Evidence Markers */}
        {sceneItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group z-10
              ${item.isCollected 
                ? 'opacity-60 grayscale' 
                : 'opacity-100 hover:scale-110'
              }`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {/* Marker Graphic */}
            <div className={`relative flex items-center justify-center
              ${item.isCollected 
                ? 'w-6 h-6 bg-green-900/80 border border-green-500 rounded-sm' 
                : 'w-8 h-8 rounded-full border-2 border-gold-400 bg-gold-900/50 shadow-[0_0_15px_rgba(197,160,40,0.8)] animate-pulse'
              }`}>
              
              {item.isCollected ? (
                <span className="text-green-400 text-[10px] font-mono">✓</span>
              ) : (
                <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
              )}

              {/* Connecting line to label (only visible on hover for uncollected) */}
              {!item.isCollected && (
                <div className="absolute w-12 h-[1px] bg-gold-400/50 -right-12 top-1/2 hidden group-hover:block"></div>
              )}
            </div>

            {/* Label Tooltip */}
            <div className={`absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black/80 border-l-2 border-gold-400 px-3 py-1 text-xs text-white font-mono whitespace-nowrap z-20 pointer-events-none transition-all duration-300
              ${item.isCollected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
              EVIDENCE #{item.id.substring(0,3).toUpperCase()}
            </div>
          </button>
        ))}
        
        {/* Flashlight/Vignette Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_15%,rgba(0,0,0,0.4)_40%,rgba(10,10,10,0.95)_100%)]"></div>

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
             <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
             
             <div className="relative z-10 p-6 border-2 border-dashed border-gray-600 rounded-full group-hover:border-gold-500/50 transition-colors">
                 <Search size={64} className="text-gray-500 group-hover:text-gold-500 transition-colors" />
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