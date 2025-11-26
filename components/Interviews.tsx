import React, { useState } from 'react';
import { Suspect, DialogueOption, Evidence } from '../types';
import { Lock, Unlock, User, ChevronRight, FileText, ArrowLeft, Terminal } from 'lucide-react';
import { SuspectAvatar } from './SuspectAvatar';

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
    <div className="flex flex-col md:flex-row h-full bg-blueprint-950 text-blueprint-100 font-mono">
      {/* Sidebar - Subject List */}
      <div className={`${activeSuspectId ? 'hidden md:flex' : 'flex'} w-full md:w-72 flex-shrink-0 bg-blueprint-900/50 border-r border-blueprint-500/30 flex-col z-20 shadow-xl`}>
        <div className="p-5 border-b border-blueprint-500/30 bg-blueprint-900/80">
          <h2 className="text-xs font-bold text-blueprint-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Terminal size={14} /> Subject Database
          </h2>
        </div>
        
        <div className="overflow-y-auto flex-grow p-2 space-y-1">
          {suspects.map(suspect => {
             const locked = getLockedCount(suspect.id);
             const isActive = activeSuspectId === suspect.id;
             return (
              <button
                key={suspect.id}
                onClick={() => setActiveSuspectId(suspect.id)}
                className={`w-full text-left p-3 border transition-all duration-200 group relative flex items-center gap-3
                  ${isActive 
                    ? 'bg-blueprint-500/20 text-blueprint-300 border-blueprint-500' 
                    : 'text-blueprint-600 border-transparent hover:bg-blueprint-500/5 hover:border-blueprint-500/30'}`}
              >
                {/* Avatar SVG */}
                <div className={`w-10 h-10 overflow-hidden border bg-blueprint-950 p-1 ${isActive ? 'border-blueprint-400' : 'border-blueprint-700 opacity-60'}`}>
                  <SuspectAvatar id={suspect.id} color={isActive ? "#6495ED" : "#334155"} />
                </div>
                
                <div className="flex-grow overflow-hidden">
                  <div className="text-sm font-bold truncate tracking-wide">{suspect.name.toUpperCase()}</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-60">{suspect.role}</div>
                </div>

                {locked > 0 && <Lock size={12} className="text-blueprint-500/50" />}
                <ChevronRight size={16} className={`text-blueprint-500 transition-transform ${isActive ? 'translate-x-1' : ''}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content - Terminal Transcript */}
      <div className={`${!activeSuspectId ? 'hidden md:flex' : 'flex'} flex-grow flex-col h-full bg-blueprint-950 relative text-blueprint-200 overflow-hidden`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

        {activeSuspect ? (
          <div className="flex flex-col h-full z-10">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-blueprint-500/30 bg-blueprint-900/80 backdrop-blur-sm flex flex-col md:flex-row md:items-start gap-4 md:gap-6 sticky top-0 z-20">
              
              {/* Mobile Back Button */}
              <button 
                onClick={() => setActiveSuspectId(null)}
                className="md:hidden flex items-center gap-2 text-blueprint-500 font-bold uppercase text-xs tracking-widest mb-2 border border-blueprint-500/30 p-2 w-fit bg-blueprint-950/80"
              >
                <ArrowLeft size={16} /> Return to DB
              </button>

              <div className="flex items-start gap-4 w-full">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-blueprint-950 border border-blueprint-500 p-1 shadow-[0_0_15px_rgba(100,149,237,0.2)] flex-shrink-0 relative">
                   <div className="absolute inset-0 border-[0.5px] border-blueprint-500/30 m-1"></div>
                   <SuspectAvatar id={activeSuspect.id} color="#6495ED" />
                </div>
                
                <div className="flex-grow">
                   <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                     <div>
                       <h1 className="text-xl md:text-2xl font-bold tracking-tight uppercase text-blueprint-300 text-glow">
                         {activeSuspect.name}
                       </h1>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-blueprint-500/80 mt-2">
                         <p>ROLE: <span className="text-blueprint-300">{activeSuspect.role}</span></p>
                         <p>AGE: <span className="text-blueprint-300">{activeSuspect.age}</span></p>
                         <p className="col-span-1 md:col-span-2 mt-1 italic text-blueprint-400/60 border-l-2 border-blueprint-500/30 pl-2">
                           "{activeSuspect.description}"
                         </p>
                       </div>
                     </div>
                     <div className="bg-blueprint-900/50 border border-blueprint-500/30 p-2 text-xs text-blueprint-300 w-full md:max-w-[240px] shadow-sm relative overflow-hidden mt-2 md:mt-0">
                        <strong className="block border-b border-blueprint-500/30 mb-1 z-10 relative text-blueprint-500">STATED ALIBI:</strong>
                        {activeSuspect.alibi}
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Transcript Area */}
            <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-black/20">
               <div className="max-w-4xl mx-auto space-y-6 pb-20">
                  <div className="text-center mb-8 relative">
                     <span className="bg-blueprint-950 border border-blueprint-500/50 px-3 py-1 text-[10px] uppercase tracking-widest relative z-10 text-blueprint-500">
                       &lt; AUDIO_LOG_TRANSCRIPT_START &gt;
                     </span>
                     <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blueprint-500/20 -z-0"></div>
                  </div>

                  {getAvailableQuestions(activeSuspect.id).map(q => {
                    const isAsked = dialogueHistory[activeSuspect.id]?.includes(q.id);
                    return (
                      <div key={q.id} className="group">
                        {/* Detective */}
                        <div className="mb-2">
                           {isAsked ? (
                             <div className="flex gap-2 text-blueprint-600/70 text-xs uppercase font-bold mb-1">
                               <span>[DET]</span>
                               <span>{new Date().toLocaleDateString()}</span>
                             </div>
                           ) : (
                             <button 
                               onClick={() => onAskQuestion(activeSuspect.id, q.id, q.unlocksEvidenceId)}
                               className="text-blueprint-300 hover:text-blueprint-100 font-bold border-l-2 border-blueprint-500/50 pl-3 hover:border-blueprint-400 transition-all text-sm md:text-base text-left hover:bg-blueprint-500/10 w-full py-2 flex items-center justify-between group-btn"
                             >
                               <span>&gt; {q.text}</span>
                               <span className="text-[10px] uppercase opacity-0 group-btn-hover:opacity-100 text-blueprint-500">[INIT_QUERY]</span>
                             </button>
                           )}
                           {isAsked && <p className="text-blueprint-400 pl-3 border-l-2 border-transparent opacity-60">"{q.text}"</p>}
                        </div>

                        {/* Suspect Response */}
                        {isAsked && (
                          <div className="ml-4 md:ml-8 mt-1 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="flex gap-2 text-blueprint-500/50 text-xs uppercase font-bold mb-1">
                               <span>[SUBJ]</span>
                            </div>
                            <div className="bg-blueprint-900/40 p-3 border-l-2 border-blueprint-500 text-blueprint-200 shadow-sm rounded-r-sm">
                               <p className="text-sm md:text-base leading-relaxed">
                                 {q.response}
                               </p>
                            </div>
                            
                            {q.unlocksEvidenceId && (
                               <div className="mt-2 inline-flex items-center gap-2 text-[10px] font-bold text-success-500 uppercase tracking-wider border border-success-900/50 px-2 py-1 bg-success-900/10">
                                  <Unlock size={10} /> DATA LOGGED: NEW EVIDENCE
                               </div>
                             )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {getAvailableQuestions(activeSuspect.id).length === 0 && (
                     <div className="text-center py-10 opacity-50">
                        <p className="inline-block px-4 py-2 uppercase tracking-widest text-xs text-blueprint-700 animate-pulse">
                          -- CONNECTION TERMINATED --
                        </p>
                     </div>
                  )}
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-blueprint-600/50 p-6 text-center">
             <div className="w-24 h-24 md:w-32 md:h-32 border border-dashed border-blueprint-500/30 rounded-full flex items-center justify-center mb-4 bg-blueprint-900/20">
               <User size={48} className="opacity-50" />
             </div>
             <p className="text-lg md:text-xl text-blueprint-500">SELECT_SUBJECT_FOR_ANALYSIS</p>
             <p className="text-xs mt-2 text-blueprint-700 font-mono">Awaiting input...</p>
          </div>
        )}
      </div>
    </div>
  );
};