import './App.css'
import { usePitch } from './hooks/usePitch';
import { getNearestString } from './utils/noteUtils';


export default function App() {
  const frequency = usePitch();
  const tuning = frequency ? getNearestString(frequency) : null;
  const cents = tuning ? Math.round(tuning.centsOff) : 0;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-mono">
      <h1 className="text-3xl font-bold mb-8">🎸 Guitar Tuner</h1>

      {frequency ? (
        <>
          <div className="text-2xl mb-2">Freq: {frequency.toFixed(2)} Hz</div>
          <div className="text-6xl font-bold text-green-400 mb-2">
            {tuning?.string}
          </div>

          <div className="text-sm text-gray-400">
            {Math.abs(cents) <= 5
              ? '✓ In Tune'
              : tuning!.centsOff > 0
              ? `↑ Sharp (${tuning!.centsOff.toFixed(1)}¢)`
              : `↓ Flat (${tuning!.centsOff.toFixed(1)}¢)`}
          </div>

          {/* Cents deviation bar */}
          <div className="w-full max-w-sm h-2 bg-gray-700 mt-4 relative rounded">
            <div
              className="h-2 bg-green-400 absolute rounded"
              style={{
                width: '2px',
                left: `${50 + (cents / 50) * 50}%`, // ±50 cents = full width
                transition: 'left 0.1s',
              }}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-500">🎙 Listening for input...</p>
      )}
    </div>
  );
}

