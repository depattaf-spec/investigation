import React from 'react';

interface SuspectAvatarProps {
  id: string;
  className?: string;
  color?: string;
}

export const SuspectAvatar: React.FC<SuspectAvatarProps> = ({ id, className = "w-full h-full", color = "#6495ED" }) => {
  const getPath = () => {
    switch (id) {
      case 'victoria':
        return (
          <g transform="translate(10,10) scale(0.8)">
            {/* Elegant Woman / Hat */}
            <path 
              d="M50 20 C30 20 15 30 10 40 C10 40 25 35 30 40 C30 40 25 50 28 60 C28 60 25 70 35 80 C40 85 50 90 60 80 C70 70 65 60 65 60 C68 50 65 40 65 40 C70 35 85 40 85 40 C80 30 65 20 50 20 Z" 
              fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
            />
            {/* Hair bun/detail */}
            <path d="M60 40 C 62 45 60 50 60 50" fill="none" stroke={color} strokeWidth="1" />
            {/* Neck */}
            <path d="M40 80 Q 50 90 60 80 L 60 100 L 40 100 Z" fill="none" stroke={color} strokeWidth="2" />
            {/* Necklace */}
            <path d="M42 90 Q 50 98 58 90" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2,2" />
          </g>
        );
      case 'james':
        return (
          <g transform="translate(10,10) scale(0.8)">
             {/* Professor / Glasses / Beard */}
             <path d="M30 30 Q 50 10 70 30" fill="none" stroke={color} strokeWidth="2" /> {/* Hairline */}
             <path d="M30 30 L 30 60 Q 50 80 70 60 L 70 30" fill="none" stroke={color} strokeWidth="2" /> {/* Face */}
             <circle cx="40" cy="45" r="8" fill="none" stroke={color} strokeWidth="2" /> {/* Glasses L */}
             <circle cx="60" cy="45" r="8" fill="none" stroke={color} strokeWidth="2" /> {/* Glasses R */}
             <line x1="48" y1="45" x2="52" y2="45" stroke={color} strokeWidth="2" /> {/* Bridge */}
             <path d="M35 60 Q 50 75 65 60" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2,2" /> {/* Beard stubble */}
             {/* Suit Collar */}
             <path d="M30 70 L 10 100 M 70 70 L 90 100" stroke={color} strokeWidth="2" />
             <path d="M30 70 L 50 90 L 70 70" fill="none" stroke={color} strokeWidth="1" />
          </g>
        );
      case 'margaret':
        return (
          <g transform="translate(10,10) scale(0.8)">
            {/* Bob cut hair */}
            <path d="M30 80 L 30 30 Q 50 10 70 30 L 70 80" fill="none" stroke={color} strokeWidth="2" fillOpacity="0.1" />
            <path d="M30 30 L 30 80 Q 50 70 70 80 L 70 30" fill="none" stroke={color} strokeWidth="1" />
            {/* Face */}
            <path d="M35 30 L 35 70 Q 50 80 65 70 L 65 30" fill="none" stroke={color} strokeWidth="2" />
            {/* Earrings */}
            <circle cx="28" cy="60" r="3" fill={color} />
            <circle cx="72" cy="60" r="3" fill={color} />
            {/* Sharp collar */}
            <path d="M35 80 L 20 100 M 65 80 L 80 100" stroke={color} strokeWidth="2" />
            <path d="M50 80 L 50 100" stroke={color} strokeWidth="1" />
          </g>
        );
      case 'thomas':
        return (
          <g transform="translate(10,10) scale(0.8)">
            {/* Butler / Rigid */}
            <rect x="30" y="20" width="40" height="50" rx="15" fill="none" stroke={color} strokeWidth="2" />
            {/* Hair slicked */}
            <path d="M30 40 Q 30 20 50 20 Q 70 20 70 40" fill="none" stroke={color} strokeWidth="2" />
            <line x1="30" y1="35" x2="70" y2="35" stroke={color} strokeWidth="1" />
            {/* Bowtie */}
            <path d="M40 80 L 60 80 L 60 90 L 40 90 Z" fill={color} />
            <path d="M35 80 L 65 80" stroke={color} strokeWidth="1" />
            <path d="M35 80 L 20 75 M 65 80 L 80 75" stroke={color} strokeWidth="2" />
            {/* Suit */}
            <path d="M25 90 L 25 100 M 75 90 L 75 100" stroke={color} strokeWidth="2" />
          </g>
        );
      case 'olivia':
        return (
          <g transform="translate(10,10) scale(0.8)">
            {/* Messy Bun */}
            <circle cx="50" cy="20" r="10" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3,3"/>
            {/* Head */}
            <ellipse cx="50" cy="50" rx="20" ry="25" fill="none" stroke={color} strokeWidth="2" />
            {/* Glasses Big */}
            <circle cx="42" cy="50" r="7" fill="none" stroke={color} strokeWidth="2" />
            <circle cx="58" cy="50" r="7" fill="none" stroke={color} strokeWidth="2" />
            <line x1="49" y1="50" x2="51" y2="50" stroke={color} strokeWidth="2" />
            {/* Ponytail hint */}
            <path d="M68 40 Q 80 30 80 50" fill="none" stroke={color} strokeWidth="1" />
            {/* Scarf/Sweater */}
            <path d="M30 75 Q 50 90 70 75" fill="none" stroke={color} strokeWidth="2" />
            <path d="M30 75 L 20 100 M 70 75 L 80 100" stroke={color} strokeWidth="2" />
          </g>
        );
      default:
        return <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="2" />;
    }
  };

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {getPath()}
    </svg>
  );
};