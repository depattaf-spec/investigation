import React, { useState, useEffect } from 'react';
import { Suspect, Evidence } from '../types';
import { BACKGROUND_RESULTS } from '../constants';
import { Search, FileText, Check, Loader2, User, Database } from 'lucide-react';
import { SuspectAvatar } from './SuspectAvatar';

interface BackgroundResearchProps {
  suspects: Suspect[];
  evidence: Evidence[];
  onResearchComplete: (suspectId: string, unlockedEvidenceIds: string[]) => void;
}

export const BackgroundResearch: React.FC<BackgroundResearchProps> = ({ suspects, evidence, onResearchComplete }) => {
  const [researchingId, setResearchingId] = useState<string | null>(null);
  const [completedSearches, setCompletedSearches] = useState<string[]>([]);
  
  useEffect(() => {
    // Sync logic if needed
  }, []);

  const handleResearch = (suspectId: string) => {
    if (researchingId) return;
    setResearchingId(suspectId);
    
    // Simulate API/Database delay
    setTimeout(() => {
      const unlockedIds = BACKGROUND_RESULTS[suspectId] || [];
      onResearchComplete(suspectId, unlockedIds);
      setCompletedSearches(prev => [...prev, suspectId]);
      setResearchingId(null);
    }, 2000);
  };

  return (
    <div className="h-full p-6 md:p-12 overflow-y-auto bg-blueprint-950 text-blueprint-100 font-mono">
      <div className="max-w-5xl mx-auto pb-20">
        <div className="bg-blueprint-900/30 border border-blueprint-500/30 p-6 md:p-8 relative shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="border-b border-blueprint-500/30 pb-6 mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-blueprint-400 tracking-widest text-glow">POLICE DATABASE</h2>
              <p className="text-xs text-blueprint-600 mt-2 uppercase tracking-wider">Criminal Records Bureau // Authorized Access Only</p>
            </div>
            <Search size={32} className="text-blueprint-500/40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suspects.map(suspect => {
              const isResearched = completedSearches.includes(suspect.id);
              const isProcessing = researchingId === suspect.id;
              
              return (
                <div 
                  key={suspect.id}
                  className={`relative group bg-blueprint-950 border transition-all duration-300 overflow-hidden
                    ${isProcessing 
                      ? 'border-blueprint-400 shadow-[0_0_15px_rgba(100,149,237,0.3)]' 
                      : 'border-blueprint-800 hover:border-blueprint-500 hover:bg-blueprint-900/50'
                    }`}
                >
                  {/* Digital overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-blueprint-600 font-bold">
                     <Database size={10} /> REC_ID: {suspect.id.substring(0,3).toUpperCase()}
                  </div>

                  <div className="p-4 flex flex-col h-full relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-blueprint-900 border border-blueprint-600/50 p-1 flex-shrink-0 relative">
                         <SuspectAvatar id={suspect.id} color="#475569" />
                         {isResearched && (
                           <div className="absolute inset-0 bg-success-900/20 flex items-center justify-center border border-success-500/50">
                             <Check size={24} className="text-success-500" />
                           </div>
                         )}
                      </div>
                      
                      <div className="flex-grow overflow-hidden">
                        <h3 className="text-lg font-bold text-blueprint-200 truncate uppercase">{suspect.name}</h3>
                        <p className="text-[10px] text-blueprint-500 uppercase tracking-wider mb-2">{suspect.role}</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      {isProcessing ? (
                        <div className="w-full bg-blueprint-900/50 border border-blueprint-500/30 py-2 px-4 text-xs flex items-center justify-center gap-2 text-blueprint-300">
                          <Loader2 size={12} className="animate-spin" /> QUERYING DB...
                        </div>
                      ) : isResearched ? (
                        <div className="w-full bg-success-900/10 border border-success-900/30 py-2 text-center">
                          <p className="text-[10px] text-success-500 font-bold uppercase tracking-widest">
                             Record Sync Complete
                          </p>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleResearch(suspect.id)}
                          disabled={!!researchingId}
                          className={`w-full py-2 px-4 text-xs font-bold uppercase tracking-[0.1em] transition-all border
                            ${!!researchingId 
                              ? 'opacity-50 cursor-not-allowed border-transparent' 
                              : 'bg-blueprint-500/10 text-blueprint-400 border-blueprint-500 hover:bg-blueprint-500 hover:text-blueprint-950'
                            }`}
                        >
                          Run Background Check
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-blueprint-950 border border-blueprint-500/20 text-blueprint-500/60 text-xs">
            <p className="mb-1">&gt; NOTICE: Use of this terminal is logged.</p>
            <p>&gt; Unauthorized background checks on civilians are a Class C felony.</p>
          </div>
        </div>
      </div>
    </div>
  );
};