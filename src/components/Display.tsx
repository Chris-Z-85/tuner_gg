import TuningStrobePanel from './TuningStrobePanel';

type DisplayProps = {
  showStrobe: boolean;
  stableCents: number | null;
  displayString: string | null;
  accidental: string;
};

export default function Display({
  showStrobe,
  stableCents,
  displayString,
  accidental,
}: DisplayProps) {
  return (
    <div className="display">
      <div className="flex flex-col items-center justify-between">
        <TuningStrobePanel cents={showStrobe ? stableCents : null} className="h-36 md:h-44 lg:h-52" />
        <div className={`note relative flex items-center justify-center w-full ${!displayString ? 'text-zinc-400' : 'text-[#5df28c] text-shadow-[0_0_8px_rgba(93,242,140,0.8),0_0_18px_rgba(93,242,140,0.7)]'}`}>
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
      </div>
    </div>
  );
}
