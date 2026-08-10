import React from 'react';

interface Pakistan3DFlagProps {
  className?: string;
  onClick?: () => void;
}

export const Pakistan3DFlag: React.FC<Pakistan3DFlagProps> = ({ className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer group inline-block ${className}`}
      title="Click to celebrate Pakistan Independence Day!"
    >
      {/* Backlight Ambient Radial Glow */}
      <div className="absolute -inset-6 rounded-3xl bg-emerald-500/30 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none animate-pulse" />

      {/* Flag Container */}
      <div className="relative w-48 h-32 sm:w-56 sm:h-36 preserve-3d rotate-3d-flag shadow-[0_20px_40px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden border-2 border-white/60 bg-[#00401a]">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg" 
          alt="Pakistan Flag"
          className="w-full h-full object-cover"
        />
        {/* Glossy Glass Highlight Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Flagpole Accent */}
      <div className="absolute top-0 -left-2 bottom-0 w-2 bg-gradient-to-b from-amber-200 via-white to-amber-300 rounded-l-md shadow-lg border-r border-black/20" />
    </div>
  );
};
