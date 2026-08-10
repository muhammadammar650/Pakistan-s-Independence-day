import React from 'react';

export const MonetagAdMockup: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto my-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden text-center flex flex-col items-center justify-center min-h-[90px]">
      <div className="text-[10px] font-mono font-semibold text-green-300/70 mb-1 tracking-widest">SPONSORED ADVERTISEMENT</div>
      <div className="text-sm font-semibold text-white/50">Monetag Ad Space</div>
    </div>
  );
};
