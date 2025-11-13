import { usePitch } from '../hooks/usePitch';
import { getNearestString } from '../utils/noteUtils';
import Display from '../components/Display';
import { useEffect, useState, useRef } from 'react';
import FootSwitch from './FootSwitch';

export default function Tuner({ enabled = true }: { enabled?: boolean }) {
  const [pressed, setPressed] = useState(false);
  const tunerEnabled = !pressed;

  const micEnabled = tunerEnabled && enabled;
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

  if (tunerEnabled && enabled) {
    return (
      <div className="w-[300px] h-[800px] flex flex-col items-center justify-between">
        <Display
          showStrobe={showStrobe}
          stableCents={stableCents}
          displayString={displayString}
          accidental={accidental}
          displayFreq={displayFreq}
          silentMode={silentMode}
        />
        <FootSwitch fit pressed={pressed} onChange={setPressed} />
      </div>
    );
  }

  return <FootSwitch fit pressed={pressed} onChange={setPressed} />;
}
