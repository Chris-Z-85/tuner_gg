import './index.css';
import { ThemeToggle } from './components/ThemeToggle';
import Tuner from './components/Tuner';
import { useTheme } from './hooks/useTheme';
import Footer from './components/Footer';

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
      <Footer />
    </div>
  );
}
