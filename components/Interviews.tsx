import React, { useState } from 'react';
import { Suspect, DialogueOption, Evidence } from '../types';
import { MessageSquare, Lock, Unlock, User, ChevronRight } from 'lucide-react';

interface InterviewsProps {
  suspects: Suspect[];
  dialogueHistory: Record<string, string[]>;
  dialogues: Record<string, DialogueOption[]>;
  evidence: Evidence[];
  onAskQuestion: (suspectId: string, questionId: string, unlocksEvidenceId?: string) => void;
}

export const Interviews: React.FC<InterviewsProps> = ({ 
  suspects, 
  dialogueHistory, 
  dialogues, 
  evidence,
  onAskQuestion 
}) => {
  const [activeSuspectId, setActiveSuspectId] = useState<string | null>(null);
  
  const activeSuspect = suspects.find(s => s.id === activeSuspectId);
  const collectedEvidenceIds = evidence.filter(e => e.isCollected).map(e => e.id);

  const getAvailableQuestions = (suspectId: string) => {
    return dialogues[suspectId]?.filter(q => {
      if (q.requiresEvidenceId && !collectedEvidenceIds.includes(q.requiresEvidenceId)) {
        return false;
      }
      return true;
    }) || [];
  };

  const getLockedCount = (suspectId: string) => {
    return dialogues[suspectId]?.filter(q => 
      q.requiresEvidenceId && !collectedEvidenceIds.includes(q.requiresEvidenceId)
    ).length || 0;
  };

  return (
    <div className="flex h-full bg-noir-950 text-gray-200">
      {/* Sidebar - Compact List */}
      <div className="w-20 md:w-64 flex-shrink-0 bg-[#0e0e0e] border-r border-gray-800 flex flex-col z-10">
        <div className="p-4 border-b border-gray-800 bg-[#0a0a0a]">
          <h2 className="hidden md:block text-sm font-bold text-gold-500 uppercase tracking-[0.2em] font-sans">Suspects</h2>
          <div className="md:hidden text-center text-gold-500 font-bold">LIST</div>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          {suspects.map(suspect => {
             const locked = getLockedCount(suspect.id);
             const isActive = activeSuspectId === suspect.id;
             return (
              <button
                key={suspect.id}
                onClick={() => setActiveSuspectId(suspect.id)}
                className={`w-full text-left p-3 md:p-4 border-b border-gray-800 transition-all hover:bg-gray-900 group relative
                  ${isActive ? 'bg-gray-900 border-l-4 border-l-gold-500' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex items-center gap-3">
                   {/* Avatar */}
                   <div className={`relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-sm border ${isActive ? 'border-gold-500' : 'border-gray-700'} grayscale contrast-125`}>
                     <img src={suspect.avatar} alt={suspect.name} className="w-full h-full object-cover" />
                     {locked > 0 && (
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                         <Lock size={12} className="text-white" />
                       </div>
                     )}
                   </div>
                   
                   {/* Info (Desktop) */}
                   <div className="hidden md:block overflow-hidden">
                     <div className={`font-serif text-sm font-bold truncate ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>{suspect.name}</div>
                     <div className="text-[10px] text-gray-600 uppercase tracking-wider truncate">{suspect.role}</div>
                   </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content - Transcript Style */}
      <div className="flex-grow flex flex-col h-full bg-paper-100 relative">
        {/* Background Texture for Paper */}
        <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" 
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")` }}></div>

        {activeSuspect ? (
          <>
            {/* Case File Header */}
            <div className="p-6 md:p-8 border-b-2 border-gray-300 bg-white/50 backdrop-blur-sm z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 border border-gray-400 p-1 shadow-sm rotate-[-2deg]">
                  <img src={activeSuspect.avatar} alt="" className="w-full h-full object-cover grayscale" />
                </div>
                <div>
                   <h2 className="text-2xl md:text-3xl font-serif text-black font-bold tracking-tight">INTERVIEW RECORD: {activeSuspect.name.toUpperCase()}</h2>
                   <div className="flex gap-4 text-xs font-mono text-gray-600 uppercase mt-1">
                      <span>Subject ID: {activeSuspect.id.substring(0,3).toUpperCase()}</span>
                      <span className="border-l border-gray-400 pl-4">Age: {activeSuspect.age}</span>
                   </div>
                </div>
              </div>
              <div className="bg-gray-100 border border-gray-300 p-3 max-w-xs transform rotate-1 shadow-sm">
                 <p className="font-mono text-[10px] text-gray-500 uppercase mb-1">Stated Alibi:</p>
                 <p className="font-serif text-sm text-black italic leading-tight">"{activeSuspect.alibi}"</p>
              </div>
            </div>

            {/* Transcript Area */}
            <div className="flex-grow overflow-y-auto p-6 md:p-12 space-y-8 relative">
              <div className="max-w-3xl mx-auto font-mono text-sm md:text-base text-gray-800 space-y-8">
                
                {/* Intro Line */}
                <div className="text-center text-gray-400 text-xs tracking-widest uppercase border-b border-gray-300 pb-4 mb-8">
                   *** RECORDING STARTED 11:58 PM ***
                </div>

                {/* Questions & Answers */}
                {getAvailableQuestions(activeSuspect.id).map(q => {
                  const isAsked = dialogueHistory[activeSuspect.id]?.includes(q.id);
                  return (
                    <div key={q.id} className="group">
                      {/* Detective Question */}
                      <div className={`mb-3 flex gap-4 ${isAsked ? 'opacity-75' : ''}`}>
                         <span className="font-bold text-black min-w-[3rem]">DET:</span>
                         <div className="flex-grow">
                            {isAsked ? (
                              <p className="text-black">"{q.text}"</p>
                            ) : (
                              <button 
                                onClick={() => onAskQuestion(activeSuspect.id, q.id, q.unlocksEvidenceId)}
                                className="text-left text-red-800 hover:text-red-600 font-bold border-b border-dotted border-red-800/30 hover:border-red-600 pb-1 transition-all"
                              >
                                &gt; ASK: {q.text}
                              </button>
                            )}
                         </div>
                      </div>

                      {/* Suspect Response */}
                      {isAsked && (
                        <div className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                          <span className="font-bold text-gray-600 min-w-[3rem] uppercase">{activeSuspect.id.substring(0,3)}:</span>
                          <div className="flex-grow">
                            <p className="text-black font-serif text-lg leading-relaxed italic bg-yellow-50/50 p-2 -ml-2 border-l-2 border-gray-300">
                              "{q.response}"
                            </p>
                            
                            {q.unlocksEvidenceId && (
                               <div className="mt-2 text-xs font-bold text-red-700 flex items-center gap-1 uppercase tracking-wider">
                                  <Unlock size={12} /> New Evidence Marked in Log
                               </div>
                             )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Empty State */}
                {getAvailableQuestions(activeSuspect.id).length === 0 && (
                   <div className="text-center py-12 border-t border-gray-300 border-dashed mt-12">
                     <p className="text-gray-500 italic font-serif">Subject has no further utility to the investigation.</p>
                   </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Idle State */
          <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50/50">
            <div className="border-4 border-double border-gray-300 p-12 rounded-lg text-center bg-white shadow-lg transform rotate-2">
              <User size={48} className="mx-auto mb-4 opacity-20 text-black" />
              <p className="font-serif text-2xl text-black mb-2 font-bold tracking-tight">INTERROGATION ROOM</p>
              <div className="w-12 h-1 bg-black mx-auto mb-4"></div>
              <p className="font-mono text-xs uppercase tracking-widest text-gray-500">Select a suspect to bring in for questioning</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};