import { useEffect, useState, useRef } from 'react';
import { PitchDetector } from 'pitchy';

interface PitchData {
  frequency: number | null;
  clarity: number | null;
}

export function usePitch(threshold = 0.5): PitchData {
  const [pitchData, setPitchData] = useState<PitchData>({
    frequency: null,
    clarity: null,
  });

  const lastFreqRef = useRef<number | null>(null);

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Float32Array;
    let source: MediaStreamAudioSourceNode;
    let detector: ReturnType<typeof PitchDetector.forFloat32Array>;
    let isMounted = true;

    async function start() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      dataArray = new Float32Array(analyser.fftSize);
      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const sampleRate = audioContext.sampleRate;
      detector = PitchDetector.forFloat32Array(analyser.fftSize);

      function update() {
        if (!isMounted) return;

        analyser.getFloatTimeDomainData(dataArray);
        const [pitch, clarity] = detector.findPitch(dataArray, sampleRate);

        if (clarity > 0.98 && pitch > 20) {
          const lastFreq = lastFreqRef.current;
          if (lastFreq === null || Math.abs(lastFreq - pitch) > threshold) {
            lastFreqRef.current = pitch;
            setPitchData({ frequency: pitch, clarity });
          }
        } else {
          setPitchData({ frequency: null, clarity });
        }

        requestAnimationFrame(update);
      }

      update();
    }

    start();

    return () => {
      isMounted = false;
      audioContext?.close();
    };
  }, [threshold]);

  return pitchData;
}
