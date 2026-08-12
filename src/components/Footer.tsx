import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-4 text-center text-white text-sm font-medium relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10 flex flex-col items-center gap-2">
      <div className="text-base sm:text-lg font-extrabold tracking-wide text-green-300 drop-shadow-md flex items-center justify-center gap-2">
        <span>🇵🇰</span>
        <span>14 August Jashn-e-Azadi Mubarak</span>
        <span>🇵🇰</span>
      </div>
      
      <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-white/90">
        <span>Pyare Pakistan Ke Liye Muhabbat Se Banaya Gaya</span>
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse inline" />
      </div>

      <div className="text-sm sm:text-base font-serif font-bold text-green-300 tracking-wider pt-0.5">
        پاکستان ہمیشہ زندہ باد
      </div>
    </footer>
  );
};
