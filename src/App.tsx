import './index.css';
import { usePitch } from './hooks/usePitch';
import { getNearestString } from './utils/noteUtils';
import TuningStrobePanel from './components/TuningStrobePanel';
import { useEffect, useState, useRef } from 'react';

export default function App() {
  const { frequency, clarity } = usePitch();
  const tuning = frequency ? getNearestString(frequency) : null;

  const [lastFrequency, setLastFrequency] = useState<number | null>(null);
  const [lastString, setLastString] = useState<string | null>(null);
  const [stableCents, setStableCents] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);
  const SILENCE_HOLD_MS = 3000;
  const silenceTimerRef = useRef<number | null>(null);

  const hasValidPitch = clarity !== null && clarity > 0.9 && frequency !== null;
  const silentMode = !hasValidPitch;

  useEffect(() => {
    if (!hasValidPitch) return;

    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setExpired(false);

    if (frequency !== null) setLastFrequency(frequency);
    if (tuning?.string) setLastString(tuning.string);

    const timeout = window.setTimeout(() => {
      setStableCents(tuning?.centsOff ?? null);
    }, 100);
    return () => window.clearTimeout(timeout);
  }, [hasValidPitch, frequency, tuning?.string, tuning?.centsOff]);

  useEffect(() => {
    if (hasValidPitch) return;

    if (silenceTimerRef.current == null) {
      silenceTimerRef.current = window.setTimeout(() => {
        setExpired(true);
        setLastFrequency(null);
        setLastString(null);
        setStableCents(null);
        silenceTimerRef.current = null;
      }, SILENCE_HOLD_MS);
    }

    return () => {
      if (silenceTimerRef.current && hasValidPitch) {
        window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };
  }, [hasValidPitch]);

  const displayFreq = hasValidPitch ? frequency : expired ? null : lastFrequency;
  const displayString = hasValidPitch ? (tuning?.string ?? lastString) : (expired ? null : lastString);
  const centsRounded = Math.round(stableCents ?? 0);
  const showStrobe = !silentMode && Math.abs(stableCents ?? 0) > 5;
  const needleLeft = (expired || stableCents === null)
    ? '50%'
    : `${50 + ((stableCents as number) / 50) * 50}%`;

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white font-mono">
      <div className="bg-neutral-900 rounded-2xl border-4 border-neutral-700 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] p-6 sm:p-10 max-w-md w-full">

        <div className={`text-center text-xl mb-2 ${silentMode ? 'opacity-60' : ''}`}>
          {displayFreq ? `${displayFreq.toFixed(2)} Hz` : '0.0 Hz'}
        </div>

        <div className={`text-center text-5xl font-bold mb-2 ${silentMode ? 'text-white' : 'text-green-400'}`}>
          {displayString ?? '–'}
        </div>

        <div className="text-sm text-center text-gray-400 mb-4 h-5">
          {hasValidPitch ? (
            Math.abs(centsRounded) <= 5 ? '✓ In Tune' : centsRounded > 0 ? `↑ Sharp (${centsRounded}¢)` : `↓ Flat (${centsRounded}¢)`
          ) : !expired && (lastString || stableCents !== null) ? (
            <span className="text-white">Holding last note</span>
          ) : (
            <span className="text-white">Play a string...</span>
          )}
        </div>

        <div className="flex justify-center">
          <TuningStrobePanel cents={showStrobe ? stableCents : null} />
        </div>

        <div className="w-full h-2 bg-gray-700 mt-4 relative rounded">
          <div
            className={`h-2 absolute rounded ${silentMode ? 'bg-gray-500' : 'bg-green-400'}`}
            style={{
              width: '2px',
              left: needleLeft,
              transition: 'left 0.1s, opacity 0.2s',
              opacity: hasValidPitch ? 1 : expired ? 0.25 : 0.7,
            }}
          />
        </div>

        <div className="w-12 h-12 mx-auto mt-4 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-800 shadow-[inset_0_0_8px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.6)]" />
      </div>
    </div>
  );
}

