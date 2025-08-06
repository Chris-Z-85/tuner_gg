import { useEffect, useState, useRef } from 'react';
import { PitchDetector } from 'pitchy';

export function usePitch(threshold = 0.5) {
  const [frequency, setFrequency] = useState<number | null>(null);
  const lastFreqRef = useRef<number | null>(null);

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Float32Array;
    let source: MediaStreamAudioSourceNode;
    let detector: ReturnType<typeof PitchDetector.forFloat32Array>;

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
        analyser.getFloatTimeDomainData(dataArray);
        const [pitch, clarity] = detector.findPitch(dataArray, sampleRate);

        if (clarity > 0.9 && pitch > 20) {
          const lastFreq = lastFreqRef.current;
          if (lastFreq === null || Math.abs(lastFreq - pitch) > threshold) {
            lastFreqRef.current = pitch;
            setFrequency(pitch);
          }
        }

        requestAnimationFrame(update);
      }

      update();
    }

    start();

    return () => {
      audioContext?.close();
    };
  }, [threshold]);

  return frequency;
}
