import React from 'react';
import { Evidence } from '../types';
import { FileText, Database, FlaskConical, MapPin, Tag } from 'lucide-react';

interface EvidenceBoardProps {
  evidence: Evidence[];
}

export const EvidenceBoard: React.FC<EvidenceBoardProps> = ({ evidence }) => {
  const collectedEvidence = evidence.filter(e => e.isCollected);

  const getIcon = (category: string) => {
    switch (category) {
      case 'physical': return <MapPin size={16} />;
      case 'document': return <FileText size={16} />;
      case 'forensic': return <FlaskConical size={16} />;
      case 'testimony': return <Database size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getColor = (category: string) => {
    switch (category) {
      case 'physical': return 'border-red-800 text-red-900';
      case 'document': return 'border-blue-800 text-blue-900';
      case 'forensic': return 'border-purple-800 text-purple-900';
      case 'testimony': return 'border-green-800 text-green-900';
      default: return 'border-gray-800 text-gray-900';
    }
  }

  return (
    <div className="h-full overflow-y-auto p-8 bg-stone-800 relative shadow-inner">
      {/* Cork Texture Overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none z-0" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cork-board.png")`, backgroundSize: '300px' }}></div>
      
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-max pb-20">
        
        {/* Title Card */}
        <div className="col-span-full mb-4 flex justify-center">
            <div className="bg-paper-100 px-8 py-4 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transform -rotate-1 border border-gray-400 relative">
                {/* SVG Tape */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 opacity-80">
                   <svg width="100" height="30" viewBox="0 0 100 30">
                      <rect x="0" y="0" width="100" height="30" fill="rgba(255,255,255,0.4)" transform="rotate(-2)" />
                   </svg>
                </div>
                <h1 className="font-serif text-3xl text-black font-bold tracking-widest uppercase border-b-4 border-black pb-1">Case #10-13</h1>
            </div>
        </div>

        {collectedEvidence.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-stone-500 mt-20 opacity-50">
            <div className="border-4 border-dashed border-stone-600 p-10 rounded-xl text-center">
               <p className="text-3xl font-serif mb-2">EVIDENCE BOARD EMPTY</p>
               <p className="font-mono">Collect clues to build the case.</p>
            </div>
          </div>
        ) : (
          collectedEvidence.map((item, index) => {
            // Random rotation for natural look
            const rotation = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
            
            return (
            <div 
              key={item.id} 
              className={`bg-paper-100 p-4 shadow-[2px_5px_10px_rgba(0,0,0,0.3)] transition-transform hover:scale-105 hover:z-20 relative flex flex-col min-h-[220px] max-w-[300px] mx-auto w-full ${rotation}`}
            >
              {/* SVG Pushpin */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                 <svg width="20" height="40" viewBox="0 0 20 40">
                    <circle cx="10" cy="10" r="6" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
                    <path d="M10 16 L10 35" stroke="black" strokeWidth="1" strokeOpacity="0.5" />
                    {/* Shadow */}
                    <ellipse cx="12" cy="38" rx="2" ry="1" fill="black" opacity="0.3" />
                 </svg>
              </div>
              
              {/* Card Content */}
              <div className="mt-2 border-b-2 border-gray-300 pb-2 mb-2 flex justify-between items-start">
                 <h3 className="font-serif font-bold text-lg text-black leading-tight pr-4">{item.name}</h3>
                 <div className={`p-1 rounded-full border ${getColor(item.category)} bg-white/50`}>
                    {getIcon(item.category)}
                 </div>
              </div>
              
              <div className="flex-grow relative">
                 <p className="font-mono text-sm text-gray-800 leading-snug">{item.description}</p>
                 
                 {/* Decorative coffee stain SVG for some cards */}
                 {index % 3 === 0 && (
                   <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
                     <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="25" fill="none" stroke="#5c4033" strokeWidth="4" strokeDasharray="40,20" />
                     </svg>
                   </div>
                 )}
              </div>
              
              {/* Footer Tag */}
              <div className="mt-4 pt-2 border-t border-dashed border-gray-400 flex items-center gap-2">
                <Tag size={12} className="text-gray-500" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  {item.category}
                </span>
              </div>
            </div>
          )})
        )}
      </div>
    </div>
  );
};