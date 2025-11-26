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
            <div className="bg-paper-100 px-8 py-4 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transform -rotate-1 border border-gray-400">
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
            const offset = (index % 3) * 10;
            
            return (
            <div 
              key={item.id} 
              className={`bg-paper-100 p-4 shadow-[2px_5px_10px_rgba(0,0,0,0.3)] transition-transform hover:scale-105 hover:z-20 relative flex flex-col min-h-[220px] max-w-[300px] mx-auto w-full ${rotation}`}
            >
              {/* Pushpin */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="w-4 h-4 rounded-full bg-red-700 shadow-[2px_2px_2px_rgba(0,0,0,0.3)] border border-red-900 ring-1 ring-black/20"></div>
                  <div className="w-1 h-3 bg-black/30 mx-auto mt-[-2px] blur-[1px]"></div>
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