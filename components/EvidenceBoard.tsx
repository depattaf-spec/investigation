import React from 'react';
import { Evidence } from '../types';
import { FileText, Database, FlaskConical, MapPin, Tag, Share2 } from 'lucide-react';

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

  const getColorClasses = (category: string) => {
    switch (category) {
      case 'physical': return 'border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'document': return 'border-blueprint-400/50 text-blueprint-300 shadow-[0_0_10px_rgba(100,149,237,0.2)]';
      case 'forensic': return 'border-purple-500/50 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'testimony': return 'border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
      default: return 'border-gray-500 text-gray-400';
    }
  }

  return (
    <div className="h-full overflow-y-auto p-8 bg-blueprint-950 relative shadow-inner font-mono">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern opacity-30"></div>
      
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max pb-20">
        
        {/* Title Header */}
        <div className="col-span-full mb-6 flex justify-between items-end border-b border-blueprint-500/30 pb-2">
            <div>
               <h1 className="text-2xl text-blueprint-400 font-bold tracking-widest uppercase text-glow">
                 <span className="text-blueprint-600 mr-2">/</span>
                 DIGITAL EVIDENCE WALL
               </h1>
               <p className="text-[10px] text-blueprint-600 mt-1 uppercase">Visualized Data Relations</p>
            </div>
            <div className="text-right hidden md:block">
               <div className="text-xs text-blueprint-500 font-bold">NODES: {collectedEvidence.length}</div>
            </div>
        </div>

        {collectedEvidence.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-blueprint-700 mt-20 opacity-50">
            <div className="border border-dashed border-blueprint-700 p-10 text-center bg-blueprint-900/30 rounded">
               <Database size={48} className="mx-auto mb-4 opacity-50" />
               <p className="text-xl font-bold mb-2">NO DATA NODES FOUND</p>
               <p className="text-xs uppercase tracking-widest">Collect clues to populate matrix.</p>
            </div>
          </div>
        ) : (
          collectedEvidence.map((item, index) => {
            const colorClass = getColorClasses(item.category);
            
            return (
            <div 
              key={item.id} 
              className={`bg-blueprint-900/80 backdrop-blur-sm border p-4 transition-all hover:scale-105 hover:z-20 relative flex flex-col min-h-[180px] group ${colorClass}`}
            >
              {/* Connector Dot */}
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 z-20 w-3 h-3 bg-blueprint-950 border border-current rounded-full"></div>
              
              {/* Header */}
              <div className="flex justify-between items-start mb-3 border-b border-current/20 pb-2">
                 <h3 className="font-bold text-sm leading-tight pr-2 uppercase tracking-wide">{item.name}</h3>
                 <div className="opacity-80">
                    {getIcon(item.category)}
                 </div>
              </div>
              
              {/* Body */}
              <div className="flex-grow relative">
                 <p className="text-xs leading-relaxed opacity-90">
                   {item.description}
                 </p>
              </div>
              
              {/* Footer */}
              <div className="mt-4 pt-2 border-t border-dashed border-current/20 flex items-center justify-between text-[10px] opacity-70">
                <div className="flex items-center gap-1 uppercase font-bold">
                  <Tag size={10} /> {item.category}
                </div>
                <div>ID: {item.id.substring(0,4).toUpperCase()}</div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
            </div>
          )})
        )}
      </div>
    </div>
  );
};