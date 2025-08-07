import React from 'react';

interface TuningStrobeBarProps {
  cents: number | null; // ±50 or null when idle
}

const TuningStrobeBar: React.FC<TuningStrobeBarProps> = ({ cents }) => {
  const isSharp = cents !== null && cents > 5;
  const isFlat = cents !== null && cents < -5;
  const isInTune = cents !== null && Math.abs(cents) <= 5;

  const animationClass = isSharp
    ? 'strobe-right'
    : isFlat
    ? 'strobe-left'
    : '';

  const showAnimation = isSharp || isFlat;

  // Colors
  const activeColor = isInTune ? 'bg-green-400' : 'bg-red-500';
  const inactiveColor = 'bg-gray-700 opacity-20';

  return (
    <div className="relative w-[300px] h-8 mt-4 overflow-hidden bg-black rounded-lg shadow-inner border border-gray-800">
      {/* Center marker */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-1 bg-green-400 z-10 shadow-md rounded-sm" />

      {/* Animated strobe bars */}
      {showAnimation ? (
        <div
          className={`absolute top-0 h-full w-[600px] flex ${animationClass} pointer-events-none`}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-full mx-[2px] rounded-sm ${activeColor} opacity-70 shadow-[0_0_4px_rgba(255,255,255,0.4)]`}
            />
          ))}
        </div>
      ) : (
        // Static background bars
        <div className="absolute top-0 left-0 h-full w-full flex justify-center gap-[4px] px-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-full rounded-sm ${inactiveColor}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TuningStrobeBar;
