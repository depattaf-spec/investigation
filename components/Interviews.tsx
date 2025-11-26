import React, { useState } from 'react';
import { Suspect, DialogueOption, Evidence } from '../types';
import { MessageSquare, Lock, Unlock, User, ChevronRight, FileText } from 'lucide-react';
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
    <div className="flex h-full bg-noir-950 text-gray-200">
      {/* Sidebar - Dossier List */}
      <div className="w-64 flex-shrink-0 bg-[#0c0c0c] border-r border-gray-800 flex flex-col z-20 shadow-2xl">
        <div className="p-5 border-b border-gray-800 bg-[#080808]">
          <h2 className="text-xs font-bold text-gold-500 uppercase tracking-[0.2em] font-sans flex items-center gap-2">
            <FileText size={14} /> Suspect Files
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
                className={`w-full text-left p-3 rounded transition-all duration-200 group relative flex items-center gap-3
                  ${isActive 
                    ? 'bg-gray-800 text-white border border-gray-600' 
                    : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200 border border-transparent'}`}
              >
                {/* Avatar SVG */}
                <div className={`w-10 h-10 overflow-hidden rounded-sm border bg-black p-1 ${isActive ? 'border-gray-400' : 'border-gray-700 opacity-60'}`}>
                  <SuspectAvatar id={suspect.id} color="#e5e5e5" />
                </div>
                
                <div className="flex-grow overflow-hidden">
                  <div className="font-sans text-sm font-bold truncate">{suspect.name}</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-60">{suspect.role}</div>
                </div>

                {locked > 0 && <Lock size={10} className="text-gold-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content - Transcript */}
      <div className="flex-grow flex flex-col h-full bg-[#fdfbf7] relative text-black">
        {/* Paper Texture */}
        <div className="absolute inset-0 opacity-50 pointer-events-none mix-blend-multiply" 
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")` }}></div>

        {activeSuspect ? (
          <div className="flex flex-col h-full z-10">
            {/* Dossier Header */}
            <div className="p-6 border-b border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm flex items-start gap-6">
              <div className="w-24 h-24 bg-white border-2 border-black p-2 shadow-lg transform -rotate-1">
                 <SuspectAvatar id={activeSuspect.id} color="#000" />
              </div>
              
              <div className="flex-grow">
                 <div className="flex justify-between items-start">
                   <div>
                     <h1 className="font-mono text-2xl font-bold tracking-tight uppercase border-b-2 border-black inline-block mb-2">
                       {activeSuspect.name}
                     </h1>
                     <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm font-serif text-gray-800">
                       <p><span className="font-bold text-gray-500">Role:</span> {activeSuspect.role}</p>
                       <p><span className="font-bold text-gray-500">Age:</span> {activeSuspect.age}</p>
                       <p className="col-span-2 mt-1 italic text-gray-600">"{activeSuspect.description}"</p>
                     </div>
                   </div>
                   <div className="bg-red-50 border border-red-200 p-2 text-xs font-mono text-red-900 max-w-[200px] shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 opacity-20 transform translate-x-2 -translate-y-2">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                          <circle cx="20" cy="20" r="18" fill="none" stroke="red" strokeWidth="2" />
                          <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="red" fontSize="8" fontWeight="bold" transform="rotate(-15 20 20)">ALIBI</text>
                        </svg>
                      </div>
                      <strong className="block border-b border-red-200 mb-1 z-10 relative">STATED ALIBI:</strong>
                      {activeSuspect.alibi}
                   </div>
                 </div>
              </div>
            </div>

            {/* Transcript Area */}
            <div className="flex-grow overflow-y-auto p-8 md:p-12">
               <div className="max-w-3xl mx-auto space-y-8 font-mono">
                  <div className="text-center mb-8 relative">
                     <span className="bg-black text-white px-3 py-1 text-xs uppercase tracking-widest relative z-10">Official Transcript</span>
                     <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20 -z-0"></div>
                  </div>

                  {getAvailableQuestions(activeSuspect.id).map(q => {
                    const isAsked = dialogueHistory[activeSuspect.id]?.includes(q.id);
                    return (
                      <div key={q.id} className="border-l-2 border-gray-200 pl-4 py-2 hover:border-gray-400 transition-colors">
                        {/* Detective */}
                        <div className="mb-3">
                           {isAsked ? (
                             <p className="text-sm font-bold text-gray-600 uppercase mb-1">Detective:</p>
                           ) : (
                             <button 
                               onClick={() => onAskQuestion(activeSuspect.id, q.id, q.unlocksEvidenceId)}
                               className="text-red-800 hover:text-red-600 font-bold border-b border-dotted border-red-800 hover:border-red-600 transition-all text-lg font-serif"
                             >
                               {q.text} ?
                             </button>
                           )}
                           {isAsked && <p className="text-gray-900 font-serif italic text-lg">"{q.text}"</p>}
                        </div>

                        {/* Suspect Response */}
                        {isAsked && (
                          <div className="ml-8 mt-2 animate-in fade-in slide-in-from-left-2 duration-300 relative">
                            <p className="text-sm font-bold text-gray-600 uppercase mb-1">Subject:</p>
                            <div className="bg-gray-100/50 p-4 border border-gray-200 shadow-sm rounded-sm">
                               <p className="text-black text-base leading-relaxed">
                                 {q.response}
                               </p>
                            </div>
                            
                            {q.unlocksEvidenceId && (
                               <div className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider border border-red-200 px-2 py-1 bg-red-50">
                                  <Unlock size={10} /> Testimony Logged as Evidence
                               </div>
                             )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {getAvailableQuestions(activeSuspect.id).length === 0 && (
                     <div className="text-center py-10 opacity-50">
                        <p className="border-t border-b border-black inline-block px-4 py-2 uppercase tracking-widest text-xs">End of Line</p>
                     </div>
                  )}
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
             <div className="w-32 h-32 border-4 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
               <User size={64} className="opacity-20 text-black" />
             </div>
             <p className="font-serif text-xl text-gray-500">Select a suspect file to review.</p>
          </div>
        )}
      </div>
    </div>
  );
};