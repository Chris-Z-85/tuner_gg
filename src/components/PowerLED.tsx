export default function PowerLED({ on = true }) {
  return (
    <div
      className={`w-4 h-4 rounded-full transition-all duration-200 mt-4 mb-24 ${
        on ? "bg-green-500 shadow-[0_0_8px_2px_rgba(0,255,0,0.6)]" : "bg-gray-700"
      }`}
    />
  );
}