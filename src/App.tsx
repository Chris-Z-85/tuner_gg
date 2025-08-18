import { useState } from "react";
import './index.css';
import TunerOutline from './components/TunerOutline';
import Tuner from './components/Tuner';
import FootSwitch from './components/FootSwitch';


export default function App() {
  const [pressed, setPressed] = useState(false);   
  const tunerEnabled = !pressed;  


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <TunerOutline
        screenSlot={{ left: 18, top: 7, width: 64, height: 48 }}
        switchSlot={{ left: 36, top: 65, width: 28, height: 28 }} // tweak here
      >
        <Tuner enabled={tunerEnabled}/>
        <FootSwitch fit pressed={pressed} onChange={setPressed}  />
      </TunerOutline>
      <footer className="text-center text-sm text-muted-foreground py-4">
        © 2025 <a href="https://chris-z.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Chris Z.</a> — Made in 🇩🇰 Denmark
      </footer>
    </div>
  );
}

