import { usePitch } from '../hooks/usePitch';
import { getNearestString } from '../utils/noteUtils';
import TuningStrobePanel from '../components/TuningStrobePanel';
import { useEffect, useState, useRef } from 'react';


export default function Tuner({ enabled = true }: { enabled?: boolean }) {
  const micEnabled = !enabled;    
  const { frequency, clarity } = usePitch(0.5, micEnabled);
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
    const t = window.setTimeout(() => setStableCents(tuning?.centsOff ?? null), 100);
    return () => window.clearTimeout(t);
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
  const accidental = hasValidPitch
    ? (centsRounded > 0 ? "♯" : centsRounded < 0 ? "♭" : "")
    : "";

    if (!enabled) {
  return (
    <div className="flex flex-col w-full h-full justify-between text-white font-mono">
      <div
        className="
          w-full h-full rounded-xl bg-neutral-900
          shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]
          flex flex-col items-center justify-between
        "
      >
        <TuningStrobePanel cents={showStrobe ? stableCents : null} className="h-36 md:h-44 lg:h-52" />
        <div className={`relative flex items-center justify-center w-full ${!displayString ? 'text-white' : 'text-green-400'}`}>
          <span
            className="lcd-font font-black leading-none tracking-tight"
            style={{ fontSize: "clamp(64px, 13vw, 220px)" }}
          >
            {displayString ?? "–"}
          </span>
          {accidental && (
            <span
              className="absolute font-bold leading-none pointer-events-none"
              style={{ right: "1em", top: "-0.35em", fontSize: "3em" }}
            >
              {accidental}
            </span>
          )}
        </div>
        <div
          className={`bg-white text-black rounded-lg w-1/3
                      px-3 py-1
                      mb-[clamp(6px,1.5vw,12px)]
                      ${silentMode ? 'opacity-90' : ''} lcd-font
                      text-[clamp(12px,3.2vw,24px)]`}
        >
          {displayFreq ? `${displayFreq.toFixed(2)} Hz` : '0.0 Hz'}
        </div>
      </div>
    </div>
  );}
}
