import clsx from "clsx";

type Props = {
  cents: number | null;
  className?: string;
  height?: number | string;
};


const LEDS = 24;

// SVG geometry
const W = 420;
const H = 140;
const CX = W / 2;
const CY = 180;                 // put circle center below view to get an arc
const RADII = [120, 106, 92];   // 3 rows: outer → inner
const START_DEG = -52;
const END_DEG = 52;

const LED_W = 16;
const LED_H = 9;
const LED_RX = 4;

export default function TuningStrobePanel({ cents, className, height }: Props) {
  const isSharp  = cents != null && cents > 5;
  const isFlat   = cents != null && cents < -5;
  const isInTune = cents != null && Math.abs(cents) <= 5;
  const silent   = cents == null;
  const animate  = !silent && (isSharp || isFlat);

  const colorDim    = "rgba(255,0,0,.22)";
  const colorActive = "rgb(239,68,68)";   // red-500
  const colorCenter = "rgb(34,211,238)";  // cyan-400

  const STEP = 0.035; // stagger per LED for the travelling highlight

  const ledsForRow = (row: number) => {
    const R = RADII[row];
    const a0 = (START_DEG * Math.PI) / 180;
    const a1 = (END_DEG   * Math.PI) / 180;

    return Array.from({ length: LEDS }, (_, i) => {
      const t  = i / (LEDS - 1);
      const th = a0 + t * (a1 - a0);          // angle along arc
      const x  = CX + R * Math.sin(th);
      const y  = CY - R * Math.cos(th);
      const rotateDeg = (th * 180) / Math.PI;

      // default (dim)
      let fill = colorDim;
      let opacity = 1;

      if (animate) {
        fill = colorActive;
      } else if (isInTune) {
        // show a cyan center column when in tune
        const mid = Math.floor((LEDS - 1) / 2);
        const isCenter = Math.abs(i - mid) <= 0; // 0 = one column; 1 = two
        fill = isCenter ? colorCenter : colorDim;
        opacity = isCenter ? 1 : 0.25;
      } else {
        // silent or undecided: all dim
        opacity = 0.25;
      }

      // delay direction sets sweep (right for sharp, left for flat)
      const delayIndex = isSharp ? i : LEDS - 1 - i;

      return (
        <rect
          key={i}
          x={x - LED_W / 2}
          y={y - LED_H / 2}
          width={LED_W}
          height={LED_H}
          rx={LED_RX}
          transform={`rotate(${rotateDeg}, ${x}, ${y})`}
          fill={fill}
          opacity={opacity}
          className={animate ? "strobe-dot" : undefined}
          style={animate ? { animationDelay: `${delayIndex * STEP + row * 0.06}s` } : undefined}
        />
      );
    });
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={clsx("block w-full", className)}
      style={height ? { height } : undefined}
      aria-hidden
    >
      {[0, 1, 2].map((r) => (
        <g key={r}>{ledsForRow(r)}</g>
      ))}
    </svg>
  );
}
