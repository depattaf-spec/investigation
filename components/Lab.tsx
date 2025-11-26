import React, { useEffect } from 'react';
import { LabTest, Evidence } from '../types';
import { FlaskConical, Play, CheckCircle, Clock, FileSearch } from 'lucide-react';

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
    <div className="h-full p-6 md:p-12 overflow-y-auto bg-noir-900 bg-noise">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-10 flex items-center justify-between border-b-4 border-noir-700 pb-6">
           <div>
              <h2 className="text-4xl font-serif text-paper-200">FORENSIC ANALYSIS</h2>
              <p className="font-mono text-gold-500 mt-2">Laboratory Dept. // Case #10-13</p>
           </div>
           <FlaskConical size={64} className="text-noir-700" />
        </div>

        <div className="space-y-6">
          {tests.map(test => {
            const canRun = collectedEvidenceIds.includes(test.requiredEvidenceId);
            const isCompleted = test.status === 'completed';
            const isRunning = test.status === 'running';
            
            return (
              <div 
                key={test.id} 
                className={`relative group transition-all duration-300 border-2
                  ${isCompleted 
                    ? 'bg-paper-100 border-green-800/50' 
                    : isRunning 
                      ? 'bg-noir-800 border-gold-500' 
                      : 'bg-noir-800 border-noir-700'
                  }`}
              >
                {/* Status Indicator Stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 
                  ${isCompleted ? 'bg-green-700' : isRunning ? 'bg-gold-500 animate-pulse' : 'bg-noir-600'}`}>
                </div>

                <div className="p-6 pl-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className={`text-xl font-bold font-serif ${isCompleted ? 'text-black' : 'text-paper-200'}`}>
                         {test.name}
                       </h3>
                       {isCompleted && <CheckCircle size={18} className="text-green-700" />}
                    </div>
                    
                    <p className={`font-mono text-sm mb-4 ${isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                      {test.description}
                    </p>
                    
                    {!canRun && test.status === 'available' && (
                       <div className="inline-flex items-center gap-2 text-xs font-bold text-red-400 bg-red-900/20 px-3 py-1 rounded border border-red-900/30 uppercase tracking-wide">
                         <FileSearch size={12} /> Evidence Required
                       </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center">
                    {test.status === 'available' && canRun && (
                      <button 
                        onClick={() => onRunTest(test.id)}
                        className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-black px-6 py-3 font-bold font-mono text-sm tracking-wider uppercase transition-colors shadow-lg hover:shadow-gold-500/20"
                      >
                        <Play size={16} /> Init Test
                      </button>
                    )}
                    
                    {isRunning && (
                       <div className="flex items-center gap-3 text-gold-400 font-mono text-sm bg-black/30 px-4 py-2 rounded">
                         <Clock size={16} className="animate-spin" /> 
                         <span>PROCESSING...</span>
                       </div>
                    )}
                  </div>
                </div>

                {/* Result Section */}
                {isCompleted && (
                  <div className="border-t border-gray-300 bg-paper-200/50 p-4 pl-8">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 font-mono text-xs font-bold text-gray-500 uppercase">Findings:</div>
                      <div className="font-serif text-lg text-noir-900 italic">
                        "{test.resultDescription}"
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