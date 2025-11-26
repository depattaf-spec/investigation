import React from 'react';
import { Evidence } from '../types';

interface CrimeSceneProps {
  evidence: Evidence[];
  onCollectEvidence: (evidenceId: string, silent?: boolean) => void;
}

export const CrimeScene: React.FC<CrimeSceneProps> = ({ evidence, onCollectEvidence }) => {
  const sceneItems = evidence.filter(e => e.location);
  const collectedEvidence = sceneItems.filter(e => e.isCollected);

  const handleItemClick = (item: Evidence) => {
    if (!item.isCollected) {
      onCollectEvidence(item.id, true); // Silent mode: no popup modal
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a101a] text-[#6495ED] font-mono overflow-y-auto custom-scrollbar md:overflow-hidden">
      {/* Blueprint Header */}
      <div className="p-4 border-b border-[#6495ED]/30 flex flex-col md:flex-row justify-between md:items-end bg-[#0a101a] z-10 shrink-0 gap-2 md:gap-0 shadow-lg relative sticky top-0 md:static">
         <div className="relative z-10">
            <h2 className="text-xl md:text-3xl font-bold tracking-widest text-[#6495ED] drop-shadow-[0_0_5px_rgba(100,149,237,0.5)]">
              CRIME SCENE: LIBRARY
            </h2>
            <div className="flex items-center gap-3 mt-1 opacity-80">
               <span className="bg-[#6495ED]/10 text-[#6495ED] text-[10px] px-2 py-1 border border-[#6495ED]/30 uppercase tracking-widest">
                 Sector 4
               </span>
               <span className="text-[10px] uppercase">Ashford Manor</span>
            </div>
         </div>
         <div className="text-left md:text-right text-xs opacity-70 font-bold space-y-1 relative z-10">
            <div className="flex items-center gap-2 md:justify-end">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
               STATUS: ACTIVE
            </div>
            <div>CASE FILE #10-13</div>
         </div>
         
         {/* Decorative Grid Overlay */}
         <div className="absolute inset-0 pointer-events-none opacity-10" 
              style={{ backgroundImage: 'linear-gradient(rgba(100,149,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,149,237,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
         </div>
      </div>

      <div className="flex flex-col md:flex-row flex-grow overflow-visible md:overflow-hidden">
        {/* Blueprint Container */}
        <div className="relative w-full md:w-3/4 flex-shrink-0 md:flex-shrink md:h-full h-[50vh] min-h-[400px] bg-[#1a2332] overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-[#2a3b55] cursor-crosshair group shadow-inner">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: 'linear-gradient(rgba(100,149,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,149,237,0.3) 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
              }}>
          </div>

          {/* Blueprint SVG */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 800 600" className="w-full h-full p-4 md:p-12 transition-transform duration-500" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" style={{stroke: '#6495ED', strokeWidth: 1, opacity: 0.3}} />
                </pattern>
              </defs>
              <path d="M50 50 L750 50 L750 550 L50 550 Z" fill="none" stroke="#6495ED" strokeWidth="4" />
              <path d="M350 50 L350 40 L450 40 L450 50" fill="none" stroke="#6495ED" strokeWidth="2" />
              <path d="M350 50 Q 400 20 450 50" fill="none" stroke="#6495ED" strokeWidth="1" strokeDasharray="4 2" />
              <text x="385" y="35" fill="#6495ED" fontSize="10" fontFamily="monospace" opacity="0.8">WINDOW</text>
              <path d="M150 550 L150 500 A 50 50 0 0 1 250 550" fill="none" stroke="#6495ED" strokeWidth="2" strokeDasharray="5,5"/>
              <text x="160" y="530" fill="#6495ED" fontSize="10" fontFamily="monospace" opacity="0.8">ENTRANCE</text>
              <rect x="60" y="100" width="30" height="400" fill="url(#hatch)" stroke="#6495ED" strokeWidth="2" />
              <text x="75" y="300" fill="#6495ED" fontSize="12" fontFamily="monospace" opacity="0.8" transform="rotate(-90 75,300)">LIBRARY ARCHIVE</text>
              <rect x="600" y="60" width="140" height="30" fill="url(#hatch)" stroke="#6495ED" strokeWidth="2" />
              <path d="M750 250 L720 250 L720 350 L750 350" fill="none" stroke="#6495ED" strokeWidth="2" />
              <rect x="730" y="260" width="20" height="80" fill="url(#hatch)" stroke="none" />
              <text x="705" y="300" fill="#6495ED" fontSize="10" fontFamily="monospace" opacity="0.8" transform="rotate(-90 705,300)">FIREPLACE</text>
              <rect x="250" y="150" width="300" height="300" rx="10" fill="none" stroke="#6495ED" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
              <g transform="translate(450, 200)">
                <rect x="0" y="0" width="120" height="60" fill="#1a2332" stroke="#6495ED" strokeWidth="2" />
                <path d="M10 10 L110 10 M10 50 L110 50" stroke="#6495ED" strokeWidth="1" opacity="0.5" />
                <text x="35" y="35" fill="#6495ED" fontSize="10" fontFamily="monospace">DESK</text>
                <path d="M40 -10 L80 -10 L80 0 L40 0 Z" fill="none" stroke="#6495ED" strokeWidth="1" />
              </g>
              <circle cx="620" cy="300" r="25" fill="#1a2332" stroke="#6495ED" strokeWidth="2" />
              <g transform="translate(380, 320) rotate(-10)">
                  <path d="M0,0 Q20,-40 50,-40 T100,0 T100,80 T50,120 T0,80 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,3" opacity="0.7" />
                  <circle cx="50" cy="-50" r="20" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,3" opacity="0.7" />
                  <line x1="50" y1="-30" x2="50" y2="0" stroke="white" strokeWidth="2" strokeDasharray="5,3" opacity="0.7" />
                  <text x="10" y="50" fill="white" fontSize="12" fontFamily="monospace" opacity="0.8">VICTIM</text>
              </g>
              <line x1="50" y1="580" x2="750" y2="580" stroke="#6495ED" strokeWidth="1" opacity="0.5" />
              <line x1="50" y1="575" x2="50" y2="585" stroke="#6495ED" strokeWidth="1" opacity="0.5" />
              <line x1="750" y1="575" x2="750" y2="585" stroke="#6495ED" strokeWidth="1" opacity="0.5" />
              <text x="380" y="590" fill="#6495ED" fontSize="10" fontFamily="monospace" opacity="0.5">12.5 meters</text>
            </svg>
          </div>

          {/* Interactive Evidence Markers */}
          {sceneItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group z-20 focus:outline-none
                ${item.isCollected 
                  ? 'opacity-60 grayscale' 
                  : 'opacity-100 hover:scale-125'
                }`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <div className={`relative flex items-center justify-center rounded-full transition-all
                ${item.isCollected 
                  ? 'w-6 h-6 border border-[#6495ED] bg-[#6495ED]/20' 
                  : 'w-8 h-8 border-2 border-white bg-[#6495ED]/40 shadow-[0_0_20px_#6495ED] animate-pulse'
                }`}>
                
                {item.isCollected ? (
                  <span className="text-[#6495ED] text-[10px] font-mono">✓</span>
                ) : (
                  <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                )}
              </div>

              {/* Simple Label on Hover */}
              <div className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#0a101a] border border-[#6495ED] px-2 py-1 text-[10px] text-[#6495ED] font-mono whitespace-nowrap z-30 pointer-events-none transition-all duration-200 shadow-xl hidden md:block
                ${item.isCollected ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
                  SCAN OBJECT
              </div>
            </button>
          ))}
        </div>

        {/* Evidence Log / Terminal */}
        <div className="w-full md:w-1/4 bg-[#0c121d] border-t md:border-t-0 md:border-l border-[#6495ED]/20 flex flex-col md:overflow-hidden min-h-[300px]">
          <div className="sticky top-0 bg-[#0c121d]/95 backdrop-blur-sm p-4 border-b border-[#6495ED]/20 flex items-center justify-between z-20 shrink-0">
              <span className="font-bold tracking-[0.2em] text-sm flex items-center gap-3 text-[#6495ED]">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6495ED] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#6495ED]"></span>
                  </span>
                EVIDENCE LOG
              </span>
              <span className="text-[10px] font-bold opacity-50 border border-[#6495ED]/30 px-2 py-1 rounded">
                {collectedEvidence.length} / {sceneItems.length}
              </span>
          </div>
          
          <div className="flex-grow p-4 space-y-4 md:overflow-y-auto custom-scrollbar">
              {collectedEvidence.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 mt-8 space-y-2 py-10 md:py-0">
                  <div className="w-12 h-12 border-2 border-dashed border-[#6495ED] rounded-full animate-spin-slow"></div>
                  <span className="text-xs tracking-widest blink text-center px-4">AWAITING INPUT...<br/>SCAN SCENE FOR TRACE DATA</span>
                </div>
              ) : (
                collectedEvidence.slice().reverse().map((e) => (
                  <div key={e.id} className="relative pl-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
                      {/* Timeline Connector */}
                      <div className="absolute left-0 top-2 bottom-0 w-px bg-[#6495ED]/20"></div>
                      <div className="absolute left-[-2.5px] top-2 w-[6px] h-[6px] rounded-full bg-[#6495ED] shadow-[0_0_8px_#6495ED]"></div>
                      
                      <div className="bg-[#151e2e] border-l-2 border-[#6495ED] p-3 shadow-lg hover:bg-[#1e2a40] transition-colors group">
                        <div className="flex flex-col mb-2 border-b border-[#6495ED]/10 pb-2">
                            <span className="text-[#87CEFA] font-bold text-sm tracking-wide">
                              &gt; {e.name.toUpperCase()}
                            </span>
                            <span className="text-[10px] opacity-50 font-mono mt-1 group-hover:opacity-80 transition-opacity">
                              COORD: {e.x},{e.y} // {e.location?.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs text-[#a0c4ff] leading-relaxed opacity-90 font-sans">
                          "{e.description}"
                        </p>
                      </div>
                  </div>
                ))
              )}
          </div>
        </div>
      </div>
    </div>
  );
};