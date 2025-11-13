import TuningStrobePanel from './TuningStrobePanel';

type DisplayProps = {
  showStrobe: boolean;
  stableCents: number | null;
  displayString: string | null;
  accidental: string;
  displayFreq: number | null;
  silentMode: boolean;
};

export default function Display({
  showStrobe,
  stableCents,
  displayString,
  accidental,
  displayFreq,
  silentMode,
}: DisplayProps) {
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
  );
}

