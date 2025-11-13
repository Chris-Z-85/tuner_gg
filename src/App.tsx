import './index.css';
import Tuner from './components/Tuner';


export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <Tuner />
      <footer className="text-center text-sm text-muted-foreground py-4">
        © 2025 <a href="https://chris-z.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Chris Z.</a> — Made in 🇩🇰 Denmark
      </footer>
    </div>
  );
}
