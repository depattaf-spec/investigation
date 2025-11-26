import React, { useState, useEffect } from 'react';
import { 
  GameState, Tab, Evidence, AccusationData 
} from './types';
import { 
  INITIAL_EVIDENCE, INITIAL_SUSPECTS, INITIAL_LAB_TESTS, 
  SUSPECT_DIALOGUES, SOLUTION 
} from './constants';
import { CrimeScene } from './components/CrimeScene';
import { Interviews } from './components/Interviews';
import { EvidenceBoard } from './components/EvidenceBoard';
import { Lab } from './components/Lab';
import { Accusation } from './components/Accusation';
import { BackgroundResearch } from './components/BackgroundResearch';
import { 
  Briefcase, Map, Users, LayoutGrid, FlaskConical, FileEdit, HelpCircle, FileSearch, RefreshCw, Radio 
} from 'lucide-react';
import { Modal } from './components/Modal';

// Icons mapping for Nav
const NavIcon = ({ tab }: { tab: Tab }) => {
  switch (tab) {
    case 'home': return <Briefcase size={18} />;
    case 'crime_scene': return <Map size={18} />;
    case 'interviews': return <Users size={18} />;
    case 'evidence_board': return <LayoutGrid size={18} />;
    case 'lab': return <FlaskConical size={18} />;
    case 'background': return <FileSearch size={18} />;
    case 'theory': return <FileEdit size={18} />;
    default: return <Briefcase size={18} />;
  }
};

const App: React.FC = () => {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('detective_save_v2');
    if (saved) return JSON.parse(saved);
    return {
      currentTab: 'home',
      evidence: INITIAL_EVIDENCE,
      suspects: INITIAL_SUSPECTS,
      labTests: INITIAL_LAB_TESTS,
      dialogueHistory: {},
      connections: [],
      notes: '',
      solved: false,
      gameTime: 0,
      lastSave: new Date().toISOString()
    };
  });

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('detective_save_v2', JSON.stringify(gameState));
  }, [gameState]);

  // --- ACTIONS ---
  const changeTab = (tab: Tab) => setGameState(prev => ({ ...prev, currentTab: tab }));

  const collectEvidence = (evidenceId: string, silent: boolean = false) => {
    setGameState(prev => {
      const exists = prev.evidence.find(e => e.id === evidenceId)?.isCollected;
      if (exists) return prev;
      
      return {
        ...prev,
        evidence: prev.evidence.map(e => e.id === evidenceId ? { ...e, isCollected: true } : e)
      };
    });
    if (!silent) {
      showFeedback("EVIDENCE ITEM LOGGED IN DATABASE");
    }
  };

  const askQuestion = (suspectId: string, questionId: string, unlockedEvidenceId?: string) => {
    setGameState(prev => {
      const suspectHistory = prev.dialogueHistory[suspectId] || [];
      if (suspectHistory.includes(questionId)) return prev;

      let newEvidence = prev.evidence;
      // If this question unlocks evidence
      if (unlockedEvidenceId) {
        newEvidence = prev.evidence.map(e => 
          e.id === unlockedEvidenceId ? { ...e, isCollected: true } : e
        );
      }

      return {
        ...prev,
        evidence: newEvidence,
        dialogueHistory: {
          ...prev.dialogueHistory,
          [suspectId]: [...suspectHistory, questionId]
        }
      };
    });
    if (unlockedEvidenceId) showFeedback("TRANSCRIPT ANALYSIS: NEW LEAD ADDED");
  };

  const runLabTest = (testId: string) => {
    setGameState(prev => ({
      ...prev,
      labTests: prev.labTests.map(t => t.id === testId ? { ...t, status: 'running' } : t)
    }));
  };

  const completeLabTest = (testId: string) => {
    setGameState(prev => {
      // Find associated evidence unlocking
      let evidenceToUnlockId = '';
      if (testId === 'test_prints') evidenceToUnlockId = 'fingerprint_report';
      if (testId === 'test_tox') evidenceToUnlockId = 'tox_report';
      if (testId === 'test_luminol') evidenceToUnlockId = 'luminol_gloves';

      return {
        ...prev,
        evidence: prev.evidence.map(e => e.id === evidenceToUnlockId ? { ...e, isCollected: true } : e),
        labTests: prev.labTests.map(t => t.id === testId ? { ...t, status: 'completed' } : t)
      };
    });
    showFeedback("FORENSIC ANALYSIS COMPLETE");
  };

  const completeResearch = (suspectId: string, unlockedEvidenceIds: string[]) => {
    if (unlockedEvidenceIds.length > 0) {
      setGameState(prev => ({
        ...prev,
        evidence: prev.evidence.map(e => unlockedEvidenceIds.includes(e.id) ? { ...e, isCollected: true } : e)
      }));
      showFeedback(`DATABASE MATCH: RECORDS FOUND FOR ${gameState.suspects.find(s => s.id === suspectId)?.name.toUpperCase()}`);
    } else {
      showFeedback("DATABASE QUERY: NO RECORDS FOUND");
    }
  };

  const submitAccusation = (data: AccusationData) => {
    const isCorrectSuspect = data.suspectId === SOLUTION.suspectId;
    const isCorrectMethod = data.methodId === SOLUTION.methodId;
    const isCorrectMotive = data.motiveId === SOLUTION.motiveId;
    const isCorrectTime = data.timeId === SOLUTION.timeId;
    
    // Check key evidence overlap
    const keyEvidenceFound = data.evidenceIds.filter(id => SOLUTION.requiredEvidence.includes(id)).length;
    const hasEnoughEvidence = keyEvidenceFound >= 3;

    if (isCorrectSuspect && isCorrectMethod && isCorrectMotive && isCorrectTime && hasEnoughEvidence) {
      setGameState(prev => ({ ...prev, solved: true }));
      showFeedback("VERDICT: GUILTY. SUSPECT APPREHENDED.");
    } else {
      let hint = "SUBMISSION REJECTED. INCONSISTENCIES FOUND.";
      if (!isCorrectSuspect) hint += " SUSPECT ALIBI APPEARS VALID.";
      else if (!isCorrectMethod) hint += " FORENSIC MISMATCH ON METHOD.";
      else if (!isCorrectMotive) hint += " MOTIVE DOES NOT HOLD UP.";
      else if (!hasEnoughEvidence) hint += " INSUFFICIENT PHYSICAL EVIDENCE.";
      
      showFeedback(hint);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setIsFeedbackModalOpen(true);
  };

  const resetGame = () => {
    localStorage.removeItem('detective_save_v2');
    window.location.reload();
  };

  // --- RENDER ---
  const renderContent = () => {
    switch (gameState.currentTab) {
      case 'home':
        return (
          // CHANGED: Outer container now handles scrolling (overflow-y-auto)
          <div className="h-full w-full overflow-y-auto bg-blueprint-950 bg-grid-pattern relative custom-scrollbar">
             {/* Background decorative elements */}
             <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-20 h-full w-full fixed"></div>
             
             {/* CHANGED: Inner container handles centering via min-h-full and has padding for mobile nav */}
             <div className="min-h-full flex flex-col items-center justify-center p-8 text-center pb-32 md:pb-8">
               
               <div className="z-10 max-w-4xl w-full border-y-2 border-blueprint-500/50 py-12 relative bg-blueprint-900/50 backdrop-blur-sm">
                 {/* Decorative corner markers */}
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blueprint-400"></div>
                 <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blueprint-400"></div>
                 <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blueprint-400"></div>
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blueprint-400"></div>
  
                 <h1 className="text-4xl md:text-6xl font-mono font-bold text-blueprint-400 mb-6 tracking-widest text-glow">THE MIDNIGHT MANUSCRIPT</h1>
                 <div className="w-32 h-1 bg-blueprint-500 mx-auto mb-8 shadow-[0_0_10px_#6495ED]"></div>
                 <p className="text-lg md:text-xl text-blueprint-300 max-w-2xl mx-auto mb-12 font-mono leading-relaxed">
                   &gt; INITIALIZING CASE FILE #10-13...<br/>
                   &gt; STATUS: UNSOLVED
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto mb-10">
                   <div className="bg-blueprint-900 border border-blueprint-500/30 p-6 shadow-lg relative group hover:border-blueprint-500 transition-colors">
                     <h3 className="text-blueprint-400 font-bold mb-4 font-mono uppercase tracking-widest text-sm border-b border-blueprint-500/30 pb-2">
                       // CASE_DETAILS
                     </h3>
                     <div className="space-y-2 font-mono text-blueprint-100 text-sm">
                        <p><span className="text-blueprint-500">VICTIM_ID:</span> Prof. Richard Ashford</p>
                        <p><span className="text-blueprint-500">LOC:</span> Ashford Manor, Sector 4</p>
                        <p><span className="text-blueprint-500">TIME_OF_DEATH:</span> 23:47</p>
                     </div>
                   </div>
                   <div className="bg-blueprint-900 border border-blueprint-500/30 p-6 shadow-lg relative group hover:border-blueprint-500 transition-colors">
                     <h3 className="text-blueprint-400 font-bold mb-4 font-mono uppercase tracking-widest text-sm border-b border-blueprint-500/30 pb-2">
                       // DIRECTIVES
                     </h3>
                     <ul className="text-blueprint-100 space-y-2 font-mono text-sm">
                       <li>&gt; SCAN CRIME SCENE</li>
                       <li>&gt; INTERROGATE SUBJECTS</li>
                       <li>&gt; QUERY BACKGROUND DB</li>
                       <li>&gt; ANALYZE FORENSICS</li>
                     </ul>
                   </div>
                 </div>
                 
                 <button 
                   onClick={() => changeTab('crime_scene')}
                   className="mx-auto block bg-blueprint-500/20 text-blueprint-400 font-bold py-4 px-12 text-lg tracking-[0.2em] hover:bg-blueprint-500 hover:text-blueprint-950 hover:shadow-[0_0_20px_#6495ED] transition-all uppercase font-mono border border-blueprint-500 relative overflow-hidden group"
                 >
                   <span className="relative z-10">&gt; ACCESS_CRIME_SCENE</span>
                   <div className="absolute inset-0 bg-blueprint-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out -z-0"></div>
                 </button>
               </div>
             </div>
          </div>
        );
      case 'crime_scene':
        return <CrimeScene evidence={gameState.evidence} onCollectEvidence={collectEvidence} />;
      case 'interviews':
        return (
          <Interviews 
            suspects={gameState.suspects} 
            evidence={gameState.evidence}
            dialogueHistory={gameState.dialogueHistory}
            dialogues={SUSPECT_DIALOGUES}
            onAskQuestion={askQuestion}
          />
        );
      case 'evidence_board':
        return <EvidenceBoard evidence={gameState.evidence} />;
      case 'lab':
        return (
          <Lab 
            tests={gameState.labTests} 
            evidence={gameState.evidence}
            onRunTest={runLabTest}
            onCompleteTest={completeLabTest}
          />
        );
      case 'background':
        return (
           <BackgroundResearch 
             suspects={gameState.suspects}
             evidence={gameState.evidence}
             onResearchComplete={completeResearch}
           />
        );
      case 'theory':
        return (
          <Accusation 
            suspects={gameState.suspects} 
            evidence={gameState.evidence} 
            onSubmit={submitAccusation}
            gameSolved={gameState.solved}
          />
        );
      default:
        return null;
    }
  };

  const tabs: Tab[] = ['home', 'crime_scene', 'interviews', 'evidence_board', 'lab', 'background', 'theory'];

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-blueprint-950 text-blueprint-100 font-mono overflow-hidden">
      
      {/* Desktop Sidebar Nav (Hidden on Mobile) */}
      <nav className="hidden md:flex w-64 flex-shrink-0 bg-blueprint-900 border-r border-blueprint-500/30 flex-col z-20 shadow-2xl relative">
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-blueprint-500/50 to-transparent"></div>
        
        <div className="p-6 border-b border-blueprint-500/20 bg-blueprint-950 flex items-center gap-3">
          <Radio className="text-blueprint-500 animate-pulse-slow" size={24} />
          <div>
            <span className="font-mono text-xl text-blueprint-400 tracking-wider font-bold block text-glow">DETECTIVE</span>
            <div className="text-[10px] text-blueprint-600 uppercase tracking-[0.1em]">System v2.4</div>
          </div>
        </div>
        
        <div className="flex-grow py-6 space-y-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => changeTab(tab)}
              className={`w-full flex items-center px-6 py-4 transition-all duration-300 relative group
                ${gameState.currentTab === tab 
                  ? 'bg-blueprint-500/10 text-blueprint-400 border-r-2 border-blueprint-500' 
                  : 'text-blueprint-600 hover:text-blueprint-300 hover:bg-blueprint-500/5'}`}
            >
              <div className="relative z-10"><NavIcon tab={tab} /></div>
              <span className="ml-4 text-xs font-bold uppercase tracking-widest font-mono group-hover:translate-x-1 transition-transform">{tab.replace('_', ' ')}</span>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-blueprint-500/20 bg-blueprint-950">
           <button 
             onClick={resetGame}
             className="w-full text-[10px] font-mono text-blueprint-700 hover:text-alert-500 transition-colors uppercase tracking-widest flex items-center gap-2 justify-center border border-dashed border-blueprint-700/50 p-2 hover:border-alert-500/50"
           >
             <RefreshCw size={12} /> [ REBOOT_SYSTEM ]
           </button>
        </div>
      </nav>

      {/* Main Content Area */}
      {/* Added pb-20 to ensure content isn't hidden behind fixed mobile nav */}
      <main className="flex-grow flex flex-col h-full overflow-hidden relative shadow-inner bg-grid-pattern pb-20 md:pb-0">
        <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-10 z-0"></div>
        <div className="relative z-10 h-full overflow-hidden">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Nav (Fixed Sticky) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-blueprint-950/95 backdrop-blur-md border-t border-blueprint-500/50 flex justify-between items-center px-4 py-2 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] h-16 safe-area-bottom">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => changeTab(tab)}
            className={`flex flex-col items-center justify-center p-1 rounded transition-colors w-full
              ${gameState.currentTab === tab 
                ? 'text-blueprint-400' 
                : 'text-blueprint-700 hover:text-blueprint-500'}`}
          >
            <div className={`${gameState.currentTab === tab ? 'drop-shadow-[0_0_5px_rgba(100,149,237,0.8)]' : ''}`}>
              <NavIcon tab={tab} />
            </div>
          </button>
        ))}
      </nav>

      {/* Feedback Modal */}
      <Modal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
        title="SYSTEM ALERT"
      >
        <div className="flex flex-col items-center gap-6 text-center py-4">
          <HelpCircle size={48} className="text-blueprint-500 animate-pulse" />
          <p className="text-lg font-mono text-blueprint-200">{feedbackMessage}</p>
          <button 
            onClick={() => setIsFeedbackModalOpen(false)}
            className="mt-4 bg-transparent border border-blueprint-500 text-blueprint-500 px-8 py-2 font-mono text-sm hover:bg-blueprint-500 hover:text-blueprint-950 transition-all uppercase tracking-widest shadow-[0_0_10px_rgba(100,149,237,0.3)]"
          >
            ACKNOWLEDGE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;