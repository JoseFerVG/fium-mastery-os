import React from 'react';

export type MascotMood = 
  | 'idle' 
  | 'cheering' 
  | 'thinking' 
  | 'crying' 
  | 'scholar' 
  | 'fire';

interface DuoMascotProps {
  mood?: MascotMood;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const DuoMascot: React.FC<DuoMascotProps> = ({
  mood = 'idle',
  speechText,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-52 h-52',
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Optional Speech Bubble */}
      {speechText && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-2xl shadow-xl border-2 border-slate-200 whitespace-nowrap z-20 animate-bounce">
          {speechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
        </div>
      )}

      {/* Mascot SVG */}
      <div className={`${sizeMap[size]} transition-transform duration-300 transform hover:scale-105`}>
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow */}
          <ellipse cx="80" cy="148" rx="48" ry="8" fill="#000000" fillOpacity="0.25" />

          {/* Body - Iconic Duolingo Green Owl with tech accents */}
          <path
            d="M32 90C32 50 50 28 80 28C110 28 128 50 128 90C128 126 110 144 80 144C50 144 32 126 32 90Z"
            fill={mood === 'crying' ? '#78c800' : '#58cc02'}
            stroke="#46a302"
            strokeWidth="5"
          />

          {/* Belly Feather Pattern */}
          <path
            d="M56 94C56 80 66 72 80 72C94 72 104 80 104 94C104 116 94 132 80 132C66 132 56 116 56 94Z"
            fill="#89e219"
          />

          {/* Left Wing */}
          <path
            d={mood === 'cheering' ? "M30 75C20 50 12 60 16 85C20 100 28 95 32 85Z" : "M32 82C22 88 18 102 24 114C28 120 34 116 36 104Z"}
            fill="#46a302"
            stroke="#3b8802"
            strokeWidth="3"
            className={mood === 'cheering' ? 'animate-wiggle' : ''}
          />

          {/* Right Wing */}
          <path
            d={mood === 'cheering' ? "M130 75C140 50 148 60 144 85C140 100 132 95 128 85Z" : "M128 82C138 88 142 102 136 114C132 120 126 116 124 104Z"}
            fill="#46a302"
            stroke="#3b8802"
            strokeWidth="3"
          />

          {/* Feet */}
          <ellipse cx="62" cy="144" rx="10" ry="5" fill="#ff9600" />
          <ellipse cx="98" cy="144" rx="10" ry="5" fill="#ff9600" />

          {/* Large Eyes Outer */}
          <circle cx="58" cy="62" r="20" fill="white" stroke="#e5e5e5" strokeWidth="2" />
          <circle cx="102" cy="62" r="20" fill="white" stroke="#e5e5e5" strokeWidth="2" />

          {/* Pupils based on mood */}
          {mood === 'crying' ? (
            <>
              {/* Sad eyes */}
              <path d="M50 68Q58 60 66 68" stroke="#4b4b4b" strokeWidth="4" strokeLinecap="round" />
              <path d="M94 68Q102 60 110 68" stroke="#4b4b4b" strokeWidth="4" strokeLinecap="round" />
              {/* Tears */}
              <ellipse cx="48" cy="78" rx="4" ry="7" fill="#1cb0f6" />
              <ellipse cx="112" cy="78" rx="4" ry="7" fill="#1cb0f6" />
            </>
          ) : mood === 'cheering' ? (
            <>
              {/* Happy squint eyes */}
              <path d="M48 64Q58 54 68 64" stroke="#4b4b4b" strokeWidth="5" strokeLinecap="round" />
              <path d="M92 64Q102 54 112 64" stroke="#4b4b4b" strokeWidth="5" strokeLinecap="round" />
              {/* Rosy cheeks */}
              <ellipse cx="44" cy="74" rx="6" ry="3" fill="#ff4b4b" fillOpacity="0.4" />
              <ellipse cx="116" cy="74" rx="6" ry="3" fill="#ff4b4b" fillOpacity="0.4" />
            </>
          ) : mood === 'thinking' ? (
            <>
              {/* Looking up right */}
              <circle cx="64" cy="56" r="10" fill="#4b4b4b" />
              <circle cx="67" cy="53" r="3.5" fill="white" />
              <circle cx="108" cy="56" r="10" fill="#4b4b4b" />
              <circle cx="111" cy="53" r="3.5" fill="white" />
            </>
          ) : (
            <>
              {/* Normal bright pupils */}
              <circle cx="60" cy="62" r="11" fill="#4b4b4b" />
              <circle cx="57" cy="59" r="4" fill="white" />
              <circle cx="100" cy="62" r="11" fill="#4b4b4b" />
              <circle cx="97" cy="59" r="4" fill="white" />
            </>
          )}

          {/* Orange Beak */}
          <polygon
            points={mood === 'cheering' ? "70,68 90,68 80,82" : "72,66 88,66 80,78"}
            fill="#ff9600"
            stroke="#e08400"
            strokeWidth="2"
          />

          {/* Special accessories */}
          {mood === 'scholar' && (
            /* Graduation Cap */
            <g transform="translate(0, -10)">
              <polygon points="80,14 125,28 80,40 35,28" fill="#1e293b" />
              <polygon points="56,33 56,48 104,48 104,33" fill="#0f172a" />
              <line x1="120" y1="29" x2="126" y2="46" stroke="#ffc800" strokeWidth="2.5" />
              <circle cx="127" cy="48" r="3" fill="#ffc800" />
            </g>
          )}

          {mood === 'fire' && (
            /* Flame on top */
            <g transform="translate(70, 6) scale(0.6)">
              <path
                d="M16 0C16 0 24 9 24 16C24 23 18 28 12 28C6 28 0 23 0 16C0 9 8 0 8 0C8 0 10 7 12 7C14 7 16 0 16 0Z"
                fill="#ff9600"
              />
              <path
                d="M12 6C12 6 16 11 16 16C16 20 13 23 10 23C7 23 4 20 4 16C4 11 8 6 8 6C8 6 10 10 10 10C10 10 12 6 12 6Z"
                fill="#ffc800"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
