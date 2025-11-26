import React, { useEffect } from 'react';
import { LabTest, Evidence } from '../types';
import { FlaskConical, Play, CheckCircle, Clock, FileSearch, Activity } from 'lucide-react';

interface LabProps {
  tests: LabTest[];
  evidence: Evidence[];
  onRunTest: (testId: string) => void;
  onCompleteTest: (testId: string) => void;
}

export const Lab: React.FC<LabProps> = ({ tests, evidence, onRunTest, onCompleteTest }) => {
  
  useEffect(() => {
    const runningTests = tests.filter(t => t.status === 'running');
    if (runningTests.length === 0) return;

    const timers = runningTests.map(test => {
      return setTimeout(() => {
        onCompleteTest(test.id);
      }, test.duration * 1000);
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, [tests, onCompleteTest]);

  const collectedEvidenceIds = evidence.filter(e => e.isCollected).map(e => e.id);

  return (
    <div className="h-full p-6 md:p-12 overflow-y-auto bg-blueprint-950 bg-grid-pattern text-blueprint-100 font-mono">
      <div className="max-w-5xl mx-auto pb-20">
        
        {/* Header Block */}
        <div className="mb-10 flex items-center justify-between border-b border-blueprint-500/30 pb-6 bg-blueprint-900/50 p-6 backdrop-blur-md shadow-lg border-l-4 border-l-blueprint-500">
           <div>
              <h2 className="text-3xl font-bold text-blueprint-400 tracking-widest text-glow">FORENSICS_LAB</h2>
              <div className="flex items-center gap-2 text-xs text-blueprint-600 mt-2 uppercase">
                 <Activity size={12} className="animate-pulse" />
                 <span>System Operational // Case #10-13</span>
              </div>
           </div>
           <FlaskConical size={48} className="text-blueprint-500/50" />
        </div>

        <div className="space-y-4">
          {tests.map(test => {
            const canRun = collectedEvidenceIds.includes(test.requiredEvidenceId);
            const isCompleted = test.status === 'completed';
            const isRunning = test.status === 'running';
            
            return (
              <div 
                key={test.id} 
                className={`relative group transition-all duration-300 border border-l-4
                  ${isCompleted 
                    ? 'bg-blueprint-900/30 border-success-900/50 border-l-success-500' 
                    : isRunning 
                      ? 'bg-blueprint-900/50 border-blueprint-500 border-l-blueprint-400' 
                      : 'bg-blueprint-900/20 border-blueprint-800 border-l-blueprint-700 opacity-80 hover:opacity-100'
                  }`}
              >
                {/* Scanline overlay for running tests */}
                {isRunning && <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none"></div>}

                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className={`text-lg font-bold uppercase tracking-wider ${isCompleted ? 'text-success-400' : 'text-blueprint-300'}`}>
                         {test.name}
                       </h3>
                       {isCompleted && <CheckCircle size={16} className="text-success-500" />}
                    </div>
                    
                    <p className="text-xs text-blueprint-400/70 mb-3 max-w-xl">
                      {test.description}
                    </p>
                    
                    {!canRun && test.status === 'available' && (
                       <div className="inline-flex items-center gap-2 text-[10px] font-bold text-alert-500 bg-alert-900/10 px-2 py-1 border border-alert-900/30 uppercase tracking-wide">
                         <FileSearch size={10} /> SAMPLE_MISSING
                       </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center">
                    {test.status === 'available' && canRun && (
                      <button 
                        onClick={() => onRunTest(test.id)}
                        className="flex items-center gap-2 bg-blueprint-500/10 hover:bg-blueprint-500 text-blueprint-400 hover:text-blueprint-950 border border-blueprint-500 px-6 py-2 font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_0_10px_rgba(100,149,237,0.1)] hover:shadow-[0_0_20px_rgba(100,149,237,0.4)]"
                      >
                        <Play size={14} /> [ EXECUTE ]
                      </button>
                    )}
                    
                    {isRunning && (
                       <div className="flex items-center gap-3 text-blueprint-300 text-xs bg-blueprint-950 px-4 py-2 border border-blueprint-500/30">
                         <Clock size={14} className="animate-spin" /> 
                         <span className="animate-pulse">ANALYZING...</span>
                       </div>
                    )}
                  </div>
                </div>

                {/* Result Section */}
                {isCompleted && (
                  <div className="border-t border-success-900/30 bg-success-900/5 p-4 pl-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 font-bold text-[10px] text-success-600 uppercase">RESULT:</div>
                      <div className="text-sm text-success-300 font-bold tracking-wide">
                        &gt; {test.resultDescription.toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};