import React, { useState, useEffect } from 'react';
import { Suspect, Evidence } from '../types';
import { BACKGROUND_RESULTS } from '../constants';
import { Search, FileText, Check, Loader2, User } from 'lucide-react';

interface BackgroundResearchProps {
  suspects: Suspect[];
  evidence: Evidence[];
  onResearchComplete: (suspectId: string, unlockedEvidenceIds: string[]) => void;
}

export const BackgroundResearch: React.FC<BackgroundResearchProps> = ({ suspects, evidence, onResearchComplete }) => {
  const [researchingId, setResearchingId] = useState<string | null>(null);
  const [completedSearches, setCompletedSearches] = useState<string[]>([]);
  
  // Initialize completed searches based on collected evidence to persist state roughly
  // This is a simplification; ideally we store 'researched IDs' in gameState
  useEffect(() => {
    // Logic to visually mark as researched if related evidence is already found
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
    <div className="h-full p-6 md:p-12 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="bg-noir-900 border-2 border-gold-600/50 p-6 md:p-8 relative shadow-2xl rounded-sm">
          {/* Header */}
          <div className="border-b-2 border-gold-600/30 pb-6 mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif text-gold-400 tracking-wider">ARCHIVES & RECORDS</h2>
              <p className="font-mono text-gray-500 mt-2">Confidential Database // Access Level: DETECTIVE</p>
            </div>
            <Search size={40} className="text-gold-600/40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suspects.map(suspect => {
              const isResearched = completedSearches.includes(suspect.id);
              const isProcessing = researchingId === suspect.id;
              
              return (
                <div 
                  key={suspect.id}
                  className={`relative group bg-paper-100 p-3 shadow-lg transform transition-all duration-300 ${isProcessing ? 'scale-105 z-10' : 'hover:-translate-y-1 hover:rotate-1'}`}
                >
                  {/* Tape Effect */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-100/80 rotate-1 shadow-sm opacity-80 backdrop-blur-sm z-20"></div>

                  <div className="border border-gray-300 h-full flex flex-col bg-white">
                    <div className="relative h-48 overflow-hidden grayscale contrast-125 sepia-[.3]">
                      <img src={suspect.avatar} alt={suspect.name} className="w-full h-full object-cover" />
                      {isResearched && (
                         <div className="absolute inset-0 bg-green-900/30 flex items-center justify-center backdrop-blur-[1px]">
                           <div className="border-4 border-green-700 text-green-800 font-bold text-xl px-4 py-2 uppercase tracking-widest -rotate-12 bg-green-100/90 shadow-xl">
                             Verified
                           </div>
                         </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-serif text-xl font-bold text-black mb-1 leading-none">{suspect.name}</h3>
                      <p className="font-mono text-xs text-gray-600 uppercase mb-4">{suspect.role}</p>
                      
                      <div className="mt-auto">
                        {isProcessing ? (
                          <button disabled className="w-full bg-gray-800 text-white py-2 px-4 font-mono text-sm flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin" /> ACCESSING...
                          </button>
                        ) : isResearched ? (
                          <div className="w-full border-t-2 border-gray-200 pt-2">
                            <p className="font-mono text-xs text-green-700 flex items-center gap-1">
                              <Check size={12} /> Background check complete
                            </p>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleResearch(suspect.id)}
                            disabled={!!researchingId}
                            className={`w-full py-2 px-4 font-mono text-sm uppercase tracking-wider transition-colors border-2
                              ${!!researchingId 
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                : 'bg-transparent text-black border-black hover:bg-black hover:text-gold-400'
                              }`}
                          >
                            Investigate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-4 bg-noir-800 border-l-4 border-gold-500 text-gray-400 font-mono text-sm">
            <p>> SYSTEM NOTE: Processing background checks utilizes precinct resources. Expect delays.</p>
            <p>> Searching records may reveal financial debts, criminal history, or verify alibis.</p>
          </div>
        </div>
      </div>
    </div>
  );
};