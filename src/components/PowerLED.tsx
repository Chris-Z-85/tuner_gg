export default function PowerLED({ on = true }) {
  return (
    <div
      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-200 ${
        on ? "bg-green-500 shadow-[0_0_8px_2px_rgba(0,255,0,0.6)]" : "bg-gray-700"
      }`}
    />
  );
}