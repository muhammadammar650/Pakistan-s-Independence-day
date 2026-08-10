import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-4 text-center text-white/90 text-xs border-t border-white/15 mt-8 relative z-10 bg-white/5 backdrop-blur-2xl">
      <div className="max-w-md mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-sm text-white">
          <span>🇵🇰</span>
          <span>14 August Jashn-e-Azadi</span>
          <span>🇵🇰</span>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-white/90 font-medium">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
          <span>for Pakistan</span>
        </p>

        <p className="text-sm text-green-300 font-serif tracking-wider pt-1">
          پاکستان ہمیشہ زندہ باد
        </p>
      </div>
    </footer>
  );
};
