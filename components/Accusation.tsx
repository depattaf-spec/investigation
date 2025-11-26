import React, { useState } from 'react';
import { Suspect, Evidence, AccusationData } from '../types';
import { ACCUSATION_OPTIONS, SOLUTION } from '../constants';
import { Gavel, AlertOctagon, CheckCircle2, FileWarning } from 'lucide-react';
import { SuspectAvatar } from './SuspectAvatar';

interface AccusationProps {
  suspects: Suspect[];
  evidence: Evidence[];
  onSubmit: (data: AccusationData) => void;
  gameSolved: boolean;
}

export const Accusation: React.FC<AccusationProps> = ({ suspects, evidence, onSubmit, gameSolved }) => {
  const [data, setData] = useState<AccusationData>({
    suspectId: '',
    methodId: '',
    motiveId: '',
    timeId: '',
    evidenceIds: []
  });
  const [error, setError] = useState<string>('');

  const collectedEvidence = evidence.filter(e => e.isCollected);

  const toggleEvidence = (id: string) => {
    setData(prev => {
      const exists = prev.evidenceIds.includes(id);
      if (exists) return { ...prev, evidenceIds: prev.evidenceIds.filter(e => e !== id) };
      if (prev.evidenceIds.length >= 5) return prev; // Max 5
      return { ...prev, evidenceIds: [...prev.evidenceIds, id] };
    });
  };

  const handleSubmit = () => {
    if (!data.suspectId || !data.methodId || !data.motiveId || !data.timeId) {
      setError('ERROR: ALL FIELDS REQUIRED FOR SUBMISSION.');
      return;
    }
    if (data.evidenceIds.length < 3) {
      setError('ERROR: MINIMUM 3 EVIDENCE ITEMS REQUIRED.');
      return;
    }
    setError('');
    onSubmit(data);
  };

  if (gameSolved) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-blueprint-950 bg-grid-pattern text-blueprint-100 font-mono">
        <div className="text-center max-w-2xl bg-blueprint-900/80 p-12 border-2 border-success-500 shadow-[0_0_50px_rgba(16,185,129,0.2)] relative backdrop-blur-md">
          <div className="absolute top-4 right-4 border border-success-500 text-success-500 px-3 py-1 text-xs font-bold uppercase tracking-widest">
             Case Status: CLOSED
          </div>
          <CheckCircle2 size={64} className="mx-auto text-success-500 mb-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <h1 className="text-4xl font-bold text-white mb-4 tracking-wider text-glow">JUSTICE SERVED</h1>
          <div className="w-24 h-1 bg-success-500 mx-auto mb-6"></div>
          <p className="text-lg text-blueprint-200 leading-relaxed mb-8">
            Excellent work, Detective. The perpetrator has been processed. Final report filed successfully.
          </p>
          <div className="p-4 bg-success-900/20 border border-success-500/30 text-success-400 text-sm">
            &gt; SYSTEM: LOGGING OUT...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 md:p-8 overflow-y-auto pb-24 bg-blueprint-950 bg-grid-pattern text-blueprint-100 font-mono">
      <div className="max-w-4xl mx-auto bg-blueprint-900/40 border border-blueprint-500/20 shadow-2xl min-h-full p-6 md:p-10 relative backdrop-blur-sm">
        
        {/* Header */}
        <div className="border-b border-blueprint-500/50 pb-6 mb-10 flex justify-between items-start">
           <div>
             <h1 className="text-2xl md:text-3xl font-bold text-blueprint-400 tracking-widest uppercase text-glow">Final Indictment</h1>
             <p className="text-xs text-blueprint-600 mt-1 uppercase">Submit Warrants to District Attorney</p>
           </div>
           <div className="hidden md:block border border-red-500/50 p-2 bg-red-900/10">
              <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest">
                 <FileWarning size={14} /> Official Document
              </div>
           </div>
        </div>

        <div className="space-y-12">
          {/* 1. Who */}
          <section>
            <h3 className="text-blueprint-300 font-bold uppercase text-xs mb-4 border-b border-blueprint-500/30 pb-1 flex items-center gap-2">
              <span className="bg-blueprint-500 text-blueprint-950 w-5 h-5 flex items-center justify-center text-[10px] font-bold">1</span>
              Identify Primary Suspect
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {suspects.map(s => (
                <button
                  key={s.id}
                  onClick={() => setData({ ...data, suspectId: s.id })}
                  className={`p-3 transition-all flex flex-col items-center gap-3 border ${
                    data.suspectId === s.id 
                      ? 'border-alert-500 bg-alert-900/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                      : 'border-blueprint-800 bg-blueprint-950 hover:border-blueprint-500'
                  }`}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blueprint-900 p-1 relative">
                     <SuspectAvatar id={s.id} color={data.suspectId === s.id ? "#ef4444" : "#475569"} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${data.suspectId === s.id ? 'text-alert-500' : 'text-blueprint-400'}`}>
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 2. Method, Motive, Time */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <h3 className="text-blueprint-300 font-bold uppercase text-xs mb-2">
                 Method of Killing
              </h3>
              <select 
                className="w-full bg-blueprint-950 border border-blueprint-600 text-blueprint-200 p-3 text-sm focus:border-blueprint-400 outline-none uppercase tracking-wide appearance-none hover:bg-blueprint-900 transition-colors"
                value={data.methodId}
                onChange={(e) => setData({ ...data, methodId: e.target.value })}
              >
                <option value="">-- SELECT METHOD --</option>
                {ACCUSATION_OPTIONS.methods.map(o => <option key={o.id} value={o.id}>{o.label.toUpperCase()}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <h3 className="text-blueprint-300 font-bold uppercase text-xs mb-2">
                 Motive
              </h3>
              <select 
                className="w-full bg-blueprint-950 border border-blueprint-600 text-blueprint-200 p-3 text-sm focus:border-blueprint-400 outline-none uppercase tracking-wide appearance-none hover:bg-blueprint-900 transition-colors"
                value={data.motiveId}
                onChange={(e) => setData({ ...data, motiveId: e.target.value })}
              >
                <option value="">-- SELECT MOTIVE --</option>
                {ACCUSATION_OPTIONS.motives.map(o => <option key={o.id} value={o.id}>{o.label.toUpperCase()}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <h3 className="text-blueprint-300 font-bold uppercase text-xs mb-2">
                 Time of Incident
              </h3>
              <select 
                className="w-full bg-blueprint-950 border border-blueprint-600 text-blueprint-200 p-3 text-sm focus:border-blueprint-400 outline-none uppercase tracking-wide appearance-none hover:bg-blueprint-900 transition-colors"
                value={data.timeId}
                onChange={(e) => setData({ ...data, timeId: e.target.value })}
              >
                <option value="">-- SELECT TIME --</option>
                {ACCUSATION_OPTIONS.times.map(o => <option key={o.id} value={o.id}>{o.label.toUpperCase()}</option>)}
              </select>
            </div>
          </section>

          {/* 3. Evidence */}
          <section>
            <h3 className="text-blueprint-300 font-bold uppercase text-xs mb-4 border-b border-blueprint-500/30 pb-1 flex items-center gap-2">
              <span className="bg-blueprint-500 text-blueprint-950 w-5 h-5 flex items-center justify-center text-[10px] font-bold">2</span>
              Attach Key Evidence (Min 3)
            </h3>
            {collectedEvidence.length === 0 ? (
              <div className="p-4 border border-dashed border-blueprint-700 text-blueprint-600 text-xs italic">
                &gt; NO EVIDENCE AVAILABLE IN DATABASE.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {collectedEvidence.map(e => (
                  <button
                    key={e.id}
                    onClick={() => toggleEvidence(e.id)}
                    className={`text-left p-3 border text-xs transition-all flex items-center gap-3 ${
                      data.evidenceIds.includes(e.id) 
                        ? 'bg-blueprint-500/20 text-blueprint-100 border-blueprint-400 font-bold shadow-md' 
                        : 'bg-blueprint-950 border-blueprint-800 text-blueprint-500 hover:border-blueprint-600'
                    }`}
                  >
                    <div className={`w-3 h-3 border ${data.evidenceIds.includes(e.id) ? 'bg-blueprint-400 border-blueprint-400' : 'border-blueprint-700 bg-blueprint-950'}`}></div>
                    <span className="truncate">{e.name.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Submit */}
          <div className="pt-8 border-t border-blueprint-500/30 flex flex-col items-center gap-6">
            {error && (
              <div className="bg-alert-900/20 border border-alert-500 text-alert-500 p-4 text-xs w-full text-center tracking-widest">
                &gt; {error}
              </div>
            )}
            <button
              onClick={handleSubmit}
              className="bg-alert-900/80 hover:bg-alert-800 text-white font-bold py-4 px-12 text-lg tracking-[0.2em] shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center gap-3 uppercase font-mono border border-alert-600 w-full md:w-auto justify-center group"
            >
              <Gavel size={24} className="group-hover:rotate-12 transition-transform" />
              File Indictment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};