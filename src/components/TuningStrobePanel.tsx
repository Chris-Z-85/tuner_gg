import React from 'react';

interface TuningStrobePanelProps {
  cents: number | null;
}

const LED_ROW_COUNT = 3;
const LEDS_PER_ROW = 24;

const TuningStrobePanel: React.FC<TuningStrobePanelProps> = ({ cents }) => {
  const isSharp = cents !== null && cents > 5;
  const isFlat = cents !== null && cents < -5;
  const isInTune = cents !== null && Math.abs(cents) <= 5;
  const showAnimation = isSharp || isFlat;

  const animationClass = isSharp
    ? 'strobe-right'
    : isFlat
    ? 'strobe-left'
    : '';

  const activeColor = isInTune ? 'bg-green-400' : 'bg-red-500';
  const inactiveColor = 'bg-gray-700 opacity-20';

  return (
    <div className="flex flex-col gap-[4px]">
      {Array.from({ length: LED_ROW_COUNT }).map((_, row) => (
        <div
          key={row}
          className="relative w-[300px] h-4 overflow-hidden bg-black rounded shadow-inner"
        >
          {/* Center marker */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-1 bg-green-400 z-10 rounded-sm shadow-md" />

          {showAnimation ? (
            <div
              className={`absolute top-0 h-full w-[600px] flex ${animationClass}`}
            >
              {Array.from({ length: LEDS_PER_ROW }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-full mx-[2px] rounded-sm ${activeColor} opacity-70 shadow-[0_0_4px_rgba(255,255,255,0.4)]`}
                />
              ))}
            </div>
          ) : (
            <div className="absolute top-0 left-0 h-full w-full flex justify-center gap-[4px] px-2">
              {Array.from({ length: LEDS_PER_ROW }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-full rounded-sm ${inactiveColor}`}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TuningStrobePanel;
