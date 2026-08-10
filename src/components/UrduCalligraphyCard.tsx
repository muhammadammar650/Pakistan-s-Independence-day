import React from 'react';

export const UrduCalligraphyCard: React.FC = () => {
  return (
    <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[28px] p-5 text-center shadow-2xl relative overflow-hidden my-4">
      {/* Decorative Corner Accents */}
      <div className="absolute top-2 left-2 text-white/40 text-xs">✦</div>
      <div className="absolute top-2 right-2 text-white/40 text-xs">✦</div>
      <div className="absolute bottom-2 left-2 text-white/40 text-xs">✦</div>
      <div className="absolute bottom-2 right-2 text-white/40 text-xs">✦</div>

      {/* Urdu Script Header */}
      <div dir="rtl" className="space-y-2">
        <p className="text-white font-bold text-2xl tracking-wide font-serif drop-shadow-md">
          پاکستان ہمیشہ زندہ باد 🇵🇰
        </p>
        <p className="text-green-300 text-lg font-medium font-serif leading-relaxed">
          ۱۴ اگست یومِ آزادی مبارک!
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-white/15 flex justify-center items-center gap-2 text-xs text-white/70 font-mono">
        <span>★ 14 August 1947 ★</span>
      </div>
    </div>
  );
};
