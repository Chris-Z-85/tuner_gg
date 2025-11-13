import './index.css';
import { ThemeToggle } from './components/ThemeToggle';
import Tuner from './components/Tuner';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme } = useTheme();
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-black';
  const textColor = theme === 'light' ? 'text-black' : 'text-white';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} ${textColor}`}>
      <ThemeToggle />
      <Tuner />
      <footer className="text-center text-sm text-muted-foreground py-4">
        © 2025 <a href="https://chris-z.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Chris Zbrojkiewicz</a>
      </footer>
    </div>
  );
}
