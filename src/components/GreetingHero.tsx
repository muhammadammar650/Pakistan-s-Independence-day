import React from 'react';
import { Sparkles, Edit3, Heart, Flag } from 'lucide-react';
import { triggerFireworks, triggerPatrioticConfetti } from '../utils/confetti';
import { Pakistan3DFlag } from './Pakistan3DFlag';

interface GreetingHeroProps {
  onCustomizeClick: () => void;
  senderName?: string;
}

export const GreetingHero: React.FC<GreetingHeroProps> = ({ onCustomizeClick, senderName }) => {
  const handleCelebrate = () => {
    triggerPatrioticConfetti();
    triggerFireworks();
  };

  return (
    <section className="relative z-10 pt-10 pb-6 px-4 text-center max-w-md mx-auto flex flex-col items-center">
      {/* 14 August Patriotic Badge */}
      <div
        onClick={handleCelebrate}
        className="cursor-pointer inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg text-green-300 font-bold text-xs uppercase tracking-widest mb-4 transition-transform active:scale-95"
      >
        <span className="text-base">🇵🇰</span>
        <span className="text-white font-semibold">14 AUGUST</span>
        <span className="text-green-300">• JASHN-E-AZADI</span>
        <Sparkles className="w-3.5 h-3.5 text-green-300 animate-pulse" />
      </div>

      {/* Realistic Waving Pakistan Flag */}
      <div className="my-2">
        <Pakistan3DFlag onClick={handleCelebrate} />
        
        {/* Click Prompt Micro-Pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-[11px] text-green-300 font-mono tracking-wider backdrop-blur-md">
          <Flag className="w-3 h-3 text-green-300" />
          <span>Tap Flag For Fireworks</span>
        </div>
      </div>

      {/* Main Title - White and Green Words */}
      <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
        14 August <span className="text-green-300 font-black">Independence Day</span>
      </h1>

      <p className="mt-2.5 text-white/95 font-medium text-sm leading-relaxed max-w-xs">
        {senderName ? (
          <span className="inline-block bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-white font-semibold shadow-md">
            Special Greeting Sent By <strong className="text-green-300 font-bold">{senderName}</strong>
          </span>
        ) : (
          'Aap sab ko Jashn-e-Azadi bohat bohat Mubarak ho! Pakistan Zindabad!'
        )}
      </p>

      {/* Primary Action Buttons */}
      <div className="mt-5 w-full flex flex-col gap-2.5">
        <button
          id="hero-customize-btn"
          onClick={onCustomizeClick}
          className="w-full py-3.5 px-6 rounded-2xl bg-white text-[#00401a] font-black text-base shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 border border-white/40"
        >
          <Edit3 className="w-5 h-5 text-[#00401a]" />
          <span>Apna Naam Likho (Customize)</span>
        </button>

        <button
          id="hero-celebrate-btn"
          onClick={handleCelebrate}
          className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
        >
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Fireworks & Confetti Pop 🇵🇰</span>
        </button>
      </div>
    </section>
  );
};
