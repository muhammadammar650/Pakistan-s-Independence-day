import React from 'react';
import { Sparkles, Flag } from 'lucide-react';
import { triggerFireworks, triggerPatrioticConfetti } from '../utils/confetti';
import { Pakistan3DFlag } from './Pakistan3DFlag';

interface GreetingHeroProps {
  senderName?: string;
  dynamicHeading?: string;
}

export const GreetingHero: React.FC<GreetingHeroProps> = ({ senderName, dynamicHeading }) => {
  const handleCelebrate = () => {
    triggerPatrioticConfetti();
    triggerFireworks();
  };

  return (
    <section className="relative z-10 pt-1 pb-2 px-4 text-center max-w-md mx-auto flex flex-col items-center">
      
      {/* 14 August Badge */}
      <div
        onClick={handleCelebrate}
        className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-md text-green-300 font-bold text-xs uppercase tracking-widest mb-1.5 transition-transform active:scale-95"
      >
        <span className="text-base">🇵🇰</span>
        <span className="text-white font-semibold">14 AUGUST</span>
        <span className="text-green-300">• JASHN-E-AZADI</span>
        <Sparkles className="w-3.5 h-3.5 text-green-300 animate-pulse" />
      </div>

      {/* Waving Pakistan Flag */}
      <div className="my-0.5">
        <Pakistan3DFlag onClick={handleCelebrate} />
        
        <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 border border-white/20 text-[10px] text-green-300 font-mono tracking-wider backdrop-blur-md">
          <Flag className="w-3 h-3 text-green-300" />
          <span>Parcham Par Touch Karein</span>
        </div>
      </div>

      {/* Main Dynamic Heading in Roman Urdu */}
      <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight">
        {dynamicHeading ? (
          <span className="text-yellow-300 drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)]">
            {dynamicHeading}
          </span>
        ) : senderName ? (
          <span>
            <strong className="text-yellow-300">{senderName}</strong> Ki Taraf Se Aapko 14 August Mubarak!
          </span>
        ) : (
          <span>
            Aapko Jashn-e-Azadi <span className="text-green-300 font-black">14 August</span> Mubarak Ho! 🇵🇰
          </span>
        )}
      </h1>

      <p className="mt-1.5 text-white/90 font-medium text-xs sm:text-sm leading-relaxed max-w-xs">
        {senderName ? (
          <span className="inline-block bg-black/30 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-green-200 font-semibold shadow-sm">
            Khas Paigham Bheja Gaya Hai ❤️
          </span>
        ) : (
          'Sabz hilali parcham humari shaan hai, Pakistan Zindabad!'
        )}
      </p>
    </section>
  );
};
