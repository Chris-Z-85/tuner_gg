import './index.css';
import { ThemeToggle } from './components/ThemeToggle';
import Tuner from './components/Tuner';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme } = useTheme();
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-black';
  const textColor = theme === 'light' ? 'text-black' : 'text-white';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-2 sm:px-4 ${bgColor} ${textColor}`}>
      <div className="w-full flex justify-end">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        <Tuner />
      </div>
      <footer className="text-center text-xs sm:text-sm text-muted-foreground py-2 sm:py-4 w-full">
        © 2025 <a href="https://chris-z.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Chris Zbrojkiewicz</a>
      </footer>
    </div>
  );
}
