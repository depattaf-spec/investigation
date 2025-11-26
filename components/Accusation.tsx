import React, { useState } from 'react';
import { Suspect, Evidence, AccusationData } from '../types';
import { ACCUSATION_OPTIONS, SOLUTION } from '../constants';
import { Gavel, AlertOctagon, CheckCircle2 } from 'lucide-react';
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
      setError('REPORT INCOMPLETE. ALL FIELDS MANDATORY.');
      return;
    }
    if (data.evidenceIds.length < 3) {
      setError('INSUFFICIENT EVIDENCE. ATTACH AT LEAST 3 ITEMS.');
      return;
    }
    setError('');
    onSubmit(data);
  };

  if (gameSolved) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-noir-950 bg-noise">
        <div className="text-center max-w-2xl bg-paper-100 p-12 border-4 border-double border-green-700 shadow-2xl relative">
          <div className="absolute top-4 right-4 border-2 border-green-800 text-green-800 px-2 py-1 font-mono text-xs font-bold uppercase rotate-12">
             Case Closed
          </div>
          <CheckCircle2 size={60} className="mx-auto text-green-700 mb-6" />
          <h1 className="text-4xl font-serif text-black mb-4">JUSTICE SERVED</h1>
          <div className="w-16 h-1 bg-black mx-auto mb-6"></div>
          <p className="text-xl text-gray-800 font-serif leading-relaxed mb-8">
            Excellent work, Detective. Thomas Garrett has been apprehended. The evidence you gathered was irrefutable.
          </p>
          <div className="p-4 bg-green-50 border border-green-200 text-green-900 font-mono text-sm">
            STATUS: SOLVED // FILE ARCHIVED
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-y-auto pb-20 bg-paper-200 bg-noise text-noir-900">
      <div className="max-w-4xl mx-auto bg-paper-100 shadow-[0_0_30px_rgba(0,0,0,0.3)] min-h-full p-8 md:p-12 relative">
        
        {/* Report Header */}
        <div className="border-b-4 border-black pb-6 mb-10 flex justify-between items-start">
           <div>
             <h1 className="text-3xl font-bold font-serif tracking-widest uppercase">Official Indictment</h1>
             <p className="font-mono text-sm mt-1 text-gray-600">Criminal Investigation Division // Homicide</p>
           </div>
           <div className="border-2 border-red-800 p-2 text-center transform rotate-6 opacity-80">
              <span className="block text-xs text-red-800 font-bold uppercase">Confidential</span>
              <span className="block text-red-800 font-serif text-lg leading-none">DO NOT COPY</span>
           </div>
        </div>

        <div className="space-y-10">
          {/* 1. Who */}
          <section>
            <h3 className="font-mono font-bold uppercase text-sm mb-4 border-b border-gray-400 pb-1 flex items-center gap-2">
              <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
              Primary Suspect
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {suspects.map(s => (
                <button
                  key={s.id}
                  onClick={() => setData({ ...data, suspectId: s.id })}
                  className={`p-2 transition-all flex flex-col items-center gap-2 border-2 ${
                    data.suspectId === s.id 
                      ? 'border-red-600 bg-red-50 opacity-100 scale-105 shadow-lg' 
                      : 'border-transparent hover:border-gray-300 opacity-60 grayscale hover:grayscale-0'
                  }`}
                >
                  <div className="w-20 h-20 bg-gray-200 p-1">
                     <SuspectAvatar id={s.id} color="#000" />
                  </div>
                  <span className="text-xs font-bold font-serif text-center">{s.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 2. Method, Motive, Time */}
          <section className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-mono font-bold uppercase text-sm mb-3 border-b border-gray-400 pb-1">
                 Method of Killing
              </h3>
              <select 
                className="w-full bg-white border-2 border-gray-300 p-3 font-serif focus:border-black outline-none"
                value={data.methodId}
                onChange={(e) => setData({ ...data, methodId: e.target.value })}
              >
                <option value="">Select Method...</option>
                {ACCUSATION_OPTIONS.methods.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <h3 className="font-mono font-bold uppercase text-sm mb-3 border-b border-gray-400 pb-1">
                 Motive
              </h3>
              <select 
                className="w-full bg-white border-2 border-gray-300 p-3 font-serif focus:border-black outline-none"
                value={data.motiveId}
                onChange={(e) => setData({ ...data, motiveId: e.target.value })}
              >
                <option value="">Select Motive...</option>
                {ACCUSATION_OPTIONS.motives.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <h3 className="font-mono font-bold uppercase text-sm mb-3 border-b border-gray-400 pb-1">
                 Time of Incident
              </h3>
              <select 
                className="w-full bg-white border-2 border-gray-300 p-3 font-serif focus:border-black outline-none"
                value={data.timeId}
                onChange={(e) => setData({ ...data, timeId: e.target.value })}
              >
                <option value="">Select Time...</option>
                {ACCUSATION_OPTIONS.times.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
          </section>

          {/* 3. Evidence */}
          <section>
            <h3 className="font-mono font-bold uppercase text-sm mb-4 border-b border-gray-400 pb-1 flex items-center gap-2">
              <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
              Supporting Evidence Exhibits
            </h3>
            {collectedEvidence.length === 0 ? (
              <p className="text-gray-500 italic font-serif">Evidence locker empty.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {collectedEvidence.map(e => (
                  <button
                    key={e.id}
                    onClick={() => toggleEvidence(e.id)}
                    className={`text-left p-3 border-2 text-sm transition-all flex items-center gap-3 ${
                      data.evidenceIds.includes(e.id) 
                        ? 'bg-noir-900 text-gold-400 border-noir-900 font-bold shadow-md transform -translate-y-1' 
                        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-3 h-3 border ${data.evidenceIds.includes(e.id) ? 'bg-gold-500 border-gold-500' : 'border-gray-400'}`}></div>
                    {e.name}
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2 font-mono italic text-right">* Minimum 3 exhibits required</p>
          </section>

          {/* Submit */}
          <div className="pt-8 border-t-4 border-black flex flex-col items-center gap-6">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 font-mono text-sm w-full">
                ERROR: {error}
              </div>
            )}
            <button
              onClick={handleSubmit}
              className="bg-red-800 hover:bg-red-700 text-white font-bold py-4 px-12 text-xl tracking-widest shadow-xl transition-all flex items-center gap-3 uppercase font-serif border-2 border-red-900"
            >
              <Gavel size={28} />
              Issue Warrant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};