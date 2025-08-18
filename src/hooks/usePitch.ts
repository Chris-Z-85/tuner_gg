import { useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";

interface PitchData {
  frequency: number | null;
  clarity: number | null;
}

/**
 * threshold: how much the detected pitch must change (Hz) before we update
 * enabled  : start/stop mic + analysis
 */
export function usePitch(threshold = 0.5, enabled = true): PitchData {
  const [pitchData, setPitchData] = useState<PitchData>({
    frequency: null,
    clarity: null,
  });

  const lastFreqRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // stop everything (used on unmount and when enabled -> false)
  const stopAll = () => {
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    // if disabled: clear state and ensure resources are stopped
    if (!enabled) {
      stopAll();
      setPitchData({ frequency: null, clarity: null });
      lastFreqRef.current = null;
      return; // don’t start
    }

    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;

        const dataArray = new Float32Array(analyser.fftSize);
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const sampleRate = audioContext.sampleRate;
        const detector = PitchDetector.forFloat32Array(analyser.fftSize);

        streamRef.current = stream;
        audioCtxRef.current = audioContext;

        const loop = () => {
          if (cancelled) return;
          analyser.getFloatTimeDomainData(dataArray);
          const [pitch, clarity] = detector.findPitch(dataArray, sampleRate);

          if (clarity > 0.98 && pitch > 20) {
            const last = lastFreqRef.current;
            if (last === null || Math.abs(last - pitch) > threshold) {
              lastFreqRef.current = pitch;
              setPitchData({ frequency: pitch, clarity });
            }
          } else {
            setPitchData({ frequency: null, clarity });
          }
          rafIdRef.current = requestAnimationFrame(loop);
        };

        loop();
      } catch {
        // mic permission denied or other error — clear state
        setPitchData({ frequency: null, clarity: null });
      }
    }

    start();

    return () => {
      cancelled = true;
      stopAll();
    };
  }, [enabled, threshold]);

  return pitchData;
}
