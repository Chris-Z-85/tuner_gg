// Standard tuning: E2, A2, D3, G3, B3, E4
export const standardTuning = [
    { name: 'E', octave: 2, frequency: 82.41 },
    { name: 'A', octave: 2, frequency: 110.00 },
    { name: 'D', octave: 3, frequency: 146.83 },
    { name: 'G', octave: 3, frequency: 196.00 },
    { name: 'B', octave: 3, frequency: 246.94 },
    { name: 'e', octave: 4, frequency: 329.63 },
  ];

export function getNearestString(frequency: number) {
  let closest = standardTuning[0];
  let minDiff = Math.abs(frequency - closest.frequency);

  for (const string of standardTuning) {
    const diff = Math.abs(frequency - string.frequency);
    if (diff < minDiff) {
      closest = string;
      minDiff = diff;
    }
  }

  return {
    string: closest.name,
    stringFreq: closest.frequency,
    centsOff: 1200 * Math.log2(frequency / closest.frequency),
  };
}