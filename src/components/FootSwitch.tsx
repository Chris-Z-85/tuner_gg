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
  pressed,
  defaultPressed = false,
  momentary = false,
  onChange,
  className,
}: Props) {
  const [local, setLocal] = useState(defaultPressed);
  const isPressed = pressed ?? local;
  const setPressed = (v: boolean) => {
    if (pressed === undefined) setLocal(v);
    onChange?.(v);
  };

  return (
    <button
      type="button"
      aria-pressed={isPressed}
      className={className}
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
      <span className="stomp-base">
        <span className="stomp-top"></span>
      </span>
    </button>
  );
}
