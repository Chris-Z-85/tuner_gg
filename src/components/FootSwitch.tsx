import clsx from "clsx";
import { useState } from "react";

type Props = {
  fit?: boolean;
  size?: number;
  pressed?: boolean;
  defaultPressed?: boolean;
  momentary?: boolean;
  onChange?: (v: boolean) => void;
  className?: string;

  hexColor?: string;
  ringColor?: string;
  upFill?: string;
  downFill?: string;
};

export default function FootSwitch({
  fit = true,
  size = 88,
  pressed,
  defaultPressed = false,
  momentary = false,
  onChange,
  className,
  hexColor = "#ffffff",
  ringColor = "#ffffff",
  upFill = "#f2f2f4",
  downFill = "#bdbdbf",
}: Props) {
  const [local, setLocal] = useState(defaultPressed);
  const isPressed = pressed ?? local;
  const setPressed = (v: boolean) => {
    if (pressed === undefined) setLocal(v);
    onChange?.(v);
  };

  type CSSVars = React.CSSProperties & { ['--sz']?: string };
  const style: CSSVars | undefined = fit ? undefined : { ['--sz']: `${size}px` };
  const box = fit ? "w-full h-full" : "w-[var(--sz)] h-[var(--sz)]";

  return (
    <button
      type="button"
      aria-pressed={isPressed}
      style={style}
      className={clsx(
        "relative select-none rounded-full focus:outline-none",
        fit ? "block w-full h-full" : "inline-block",
        "focus-visible:ring-2 focus-visible:ring-cyan-400/70",
        className
      )}
      onClick={() => !momentary && setPressed(!isPressed)}
      onPointerDown={() => momentary && setPressed(true)}
      onPointerUp={() => momentary && setPressed(false)}
      onPointerLeave={() => momentary && setPressed(false)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (momentary) {
            setPressed(true);
          } else {
            setPressed(!isPressed);
          }
        }
      }}
      onKeyUp={() => momentary && setPressed(false)}
    >
      <div className={clsx("relative", box)}>
        <svg viewBox="0 0 100 100" className="block w-full h-full">
          <polygon
            points="25,6 75,6 95,50 75,94 25,94 5,50"
            fill="none"
            stroke={hexColor}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <circle cx="50" cy="50" r="26" fill="none" stroke={ringColor} strokeWidth={9} />
          <g>
            <circle cx="50" cy="50" r="20" fill={isPressed ? downFill : upFill} />
            {!isPressed && (
              <ellipse cx="44" cy="42" rx="9" ry="5" fill="#ffffff" opacity="0.35" />
            )}
          </g>
        </svg>
      </div>
    </button>
  );
}
