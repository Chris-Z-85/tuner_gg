import './index.css';
import { usePitch } from './hooks/usePitch';
import { getNearestString } from './utils/noteUtils';
import TuningStrobePanel from './components/TuningStrobePanel';
import { useEffect, useState } from 'react';

export default function App() {
  const { frequency, clarity } = usePitch();
  const tuning = frequency ? getNearestString(frequency) : null;
  const cents = tuning ? Math.round(tuning.centsOff) : 0;

  const [stableCents, setStableCents] = useState<number | null>(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStableCents(tuning?.centsOff ?? null);
    }, 100);
    return () => clearTimeout(timeout);
  }, [tuning?.centsOff]);

  const hasValidPitch = clarity !== null && clarity > 0.9 && frequency !== null;
  const silentMode = !hasValidPitch;
  const showStrobe = hasValidPitch && Math.abs(stableCents ?? 0) > 5;

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white font-mono">
      <div className="bg-neutral-900 rounded-2xl border-4 border-neutral-700 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] p-6 sm:p-10 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Guitar Tuner</h1>

        <div className="text-center text-xl mb-2">
          {frequency ? `${frequency.toFixed(2)} Hz` : '–.– Hz'}
        </div>

        <div className="text-center text-5xl font-bold text-green-400 mb-2">
          {tuning?.string ?? '–'}
        </div>

        <div className="text-sm text-center text-gray-400 mb-4 h-5">
          {silentMode ? (
            <span className="text-gray-600">Play a string...</span>
          ) : Math.abs(cents) <= 5 ? (
            '✓ In Tune'
          ) : cents > 0 ? (
            `↑ Sharp (${cents}¢)`
          ) : (
            `↓ Flat (${cents}¢)`
          )}
        </div>

        {/* Multi-row strobe */}
        <div className="flex justify-center">
          <TuningStrobePanel cents={showStrobe ? stableCents : null} />
        </div>

        {/* Needle bar */}
        <div className="w-full h-2 bg-gray-700 mt-4 relative rounded">
          <div
            className="h-2 bg-green-400 absolute rounded"
            style={{
              width: '2px',
              left: silentMode ? '50%' : `${50 + (cents / 50) * 50}%`,
              transition: 'left 0.1s',
              opacity: silentMode ? 0.2 : 1,
            }}
          />
        </div>

        {/* Label */}
        <div className="mt-6 bg-neutral-800 text-center text-xs text-gray-400 py-1 px-3 rounded shadow-inner">
          Guitar Tuner · by Chris Z
        </div>

        {/* Footswitch */}
        <div className="w-12 h-12 mx-auto mt-4 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-800 shadow-[inset_0_0_8px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.6)]" />
      </div>
    </div>
  );
}
