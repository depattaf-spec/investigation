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
  Briefcase, Map, Users, LayoutGrid, FlaskConical, FileEdit, HelpCircle, FileSearch, RefreshCw 
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
      showFeedback("NEW EVIDENCE LOGGED");
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
    if (unlockedEvidenceId) showFeedback("NEW TESTIMONY ADDED TO FILE");
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
    showFeedback("FORENSIC REPORT GENERATED");
  };

  const completeResearch = (suspectId: string, unlockedEvidenceIds: string[]) => {
    if (unlockedEvidenceIds.length > 0) {
      setGameState(prev => ({
        ...prev,
        evidence: prev.evidence.map(e => unlockedEvidenceIds.includes(e.id) ? { ...e, isCollected: true } : e)
      }));
      showFeedback(`RECORDS FOUND FOR ${gameState.suspects.find(s => s.id === suspectId)?.name.toUpperCase()}`);
    } else {
      showFeedback("NO CRIMINAL OR FINANCIAL RECORDS FOUND");
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
      showFeedback("ACCUSATION VERIFIED. SUSPECT APPREHENDED.");
    } else {
      let hint = "THEORY REJECTED BY D.A.";
      if (!isCorrectSuspect) hint += " Suspect alibi may hold water.";
      else if (!isCorrectMethod) hint += " Medical examiner disagrees with method.";
      else if (!isCorrectMotive) hint += " Motive is weak.";
      else if (!hasEnoughEvidence) hint += " Insufficient physical evidence.";
      
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
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-noir-950 bg-noise relative">
             <div className="absolute inset-0 bg-vignette pointer-events-none"></div>
             <div className="z-10 max-w-4xl w-full border-y-2 border-gold-600/30 py-12">
               <h1 className="text-4xl md:text-6xl font-serif text-paper-200 mb-6 tracking-widest drop-shadow-lg">THE MIDNIGHT MANUSCRIPT</h1>
               <div className="w-24 h-1 bg-gold-600 mx-auto mb-8"></div>
               <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-serif leading-relaxed italic">
                 "Every book has an ending. Some are just written in blood."
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
                 <div className="bg-noir-900 border border-gray-800 p-6 shadow-2xl">
                   <h3 className="text-gold-500 font-bold mb-4 font-mono uppercase tracking-widest text-sm border-b border-gray-800 pb-2">Case Details</h3>
                   <div className="space-y-2 font-serif text-gray-300">
                      <p><span className="text-gray-500">Victim:</span> Prof. Richard Ashford</p>
                      <p><span className="text-gray-500">Location:</span> Ashford Manor</p>
                      <p><span className="text-gray-500">Time:</span> 11:47 PM</p>
                   </div>
                 </div>
                 <div className="bg-noir-900 border border-gray-800 p-6 shadow-2xl">
                   <h3 className="text-gold-500 font-bold mb-4 font-mono uppercase tracking-widest text-sm border-b border-gray-800 pb-2">Directives</h3>
                   <ul className="text-gray-300 space-y-2 font-serif">
                     <li>• Secure the crime scene</li>
                     <li>• Interrogate all witnesses</li>
                     <li>• Cross-reference background records</li>
                     <li>• Analyze forensic trace evidence</li>
                   </ul>
                 </div>
               </div>
               
               <button 
                 onClick={() => changeTab('crime_scene')}
                 className="mt-16 bg-gold-600 text-noir-950 font-bold py-4 px-12 text-lg tracking-[0.2em] shadow-[0_0_20px_rgba(197,160,40,0.3)] hover:bg-gold-500 hover:scale-105 transition-all uppercase font-sans border border-gold-400"
               >
                 Open Case File
               </button>
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
    <div className="flex flex-col md:flex-row h-screen w-screen bg-noir-950 text-gray-200 font-sans overflow-hidden selection:bg-gold-500 selection:text-black">
      
      {/* Desktop Sidebar Nav (Hidden on Mobile) */}
      <nav className="hidden md:flex w-64 flex-shrink-0 bg-noir-900 border-r border-gold-600/20 flex-col z-20 shadow-2xl relative">
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-gold-600/50 to-transparent"></div>
        
        <div className="p-6 border-b border-gray-800 bg-noir-950">
          <span className="font-serif text-2xl text-gold-500 tracking-wider font-bold">DETECTIVE</span>
          <div className="text-[10px] text-gray-600 uppercase tracking-[0.3em] mt-1">Investigations Unit</div>
        </div>
        
        <div className="flex-grow py-6 space-y-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => changeTab(tab)}
              className={`w-full flex items-center px-6 py-4 transition-all duration-300 relative group
                ${gameState.currentTab === tab 
                  ? 'bg-gradient-to-r from-gold-900/20 to-transparent text-gold-400' 
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'}`}
            >
              {gameState.currentTab === tab && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500 shadow-[0_0_10px_rgba(197,160,40,0.8)]"></div>
              )}
              <div className="relative z-10"><NavIcon tab={tab} /></div>
              <span className="ml-4 text-sm font-bold uppercase tracking-widest font-sans">{tab.replace('_', ' ')}</span>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-gray-800 bg-noir-950">
           <button 
             onClick={resetGame}
             className="w-full text-[10px] font-mono text-gray-700 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2 justify-center"
           >
             <RefreshCw size={12} /> [ Reset Sim ]
           </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col h-full overflow-hidden relative shadow-inner">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav (Visible only on Mobile) */}
      <nav className="md:hidden flex-shrink-0 bg-noir-900 border-t border-gold-600/30 flex justify-around items-center px-2 py-3 z-30">
        {tabs.slice(0, 5).map(tab => (
          <button
            key={tab}
            onClick={() => changeTab(tab)}
            className={`flex flex-col items-center justify-center p-2 rounded transition-colors
              ${gameState.currentTab === tab 
                ? 'text-gold-500' 
                : 'text-gray-600 hover:text-gray-400'}`}
          >
            <NavIcon tab={tab} />
            <span className="text-[8px] uppercase font-bold mt-1 tracking-wider">{tab.replace('_', ' ').split(' ')[0]}</span>
          </button>
        ))}
         <button
            onClick={() => changeTab('theory')}
            className={`flex flex-col items-center justify-center p-2 rounded transition-colors
              ${gameState.currentTab === 'theory' 
                ? 'text-red-500' 
                : 'text-gray-600 hover:text-gray-400'}`}
          >
            <FileEdit size={18} />
            <span className="text-[8px] uppercase font-bold mt-1 tracking-wider">Solve</span>
          </button>
      </nav>

      {/* Feedback Modal */}
      <Modal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
        title="Case Update"
      >
        <div className="flex flex-col items-center gap-6 text-center py-4">
          <HelpCircle size={48} className="text-gold-500 animate-pulse" />
          <p className="text-xl font-serif text-paper-200">{feedbackMessage}</p>
          <button 
            onClick={() => setIsFeedbackModalOpen(false)}
            className="mt-4 bg-transparent border border-gold-500 text-gold-500 px-8 py-2 font-mono text-sm hover:bg-gold-500 hover:text-black transition-all uppercase tracking-widest"
          >
            Acknowledge
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;