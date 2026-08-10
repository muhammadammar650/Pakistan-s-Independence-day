import React from 'react';
import bgImage from '../assets/images/pakistan_independence_bg_1786349848793.jpg';
import { FireworksCanvas } from './FireworksCanvas';

export const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#002e13] perspective-1200 preserve-3d" style={{ background: 'radial-gradient(circle at top right, #005c28 0%, #002e13 100%)' }}>
      {/* Background Image Layer */}
      <img
        src={bgImage}
        alt="Pakistan Independence Day Background"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-105 opacity-30 mix-blend-overlay"
      />

      {/* Realistic Fireworks Canvas */}
      <FireworksCanvas />

      {/* 3D Ambient Glowing Spheres */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none float-3d" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-400/20 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none float-3d" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none pulse-glow" />

      {/* Floating 3D Stars & Crescent Particle Accents */}
      <div className="absolute top-12 left-10 w-4 h-4 text-amber-300 opacity-80 float-3d font-bold text-xs" style={{ animationDelay: '0.5s' }}>✦</div>
      <div className="absolute top-1/4 right-12 w-6 h-6 text-green-300 opacity-80 float-3d text-sm font-bold" style={{ animationDelay: '1.5s' }}>★</div>
      <div className="absolute top-1/2 left-8 w-5 h-5 text-amber-200 opacity-75 float-3d text-sm font-bold" style={{ animationDelay: '2.5s' }}>✦</div>
      <div className="absolute bottom-1/3 right-10 w-6 h-6 text-emerald-200 opacity-80 float-3d text-base" style={{ animationDelay: '3.5s' }}>★</div>
      <div className="absolute top-20 right-1/4 w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_15px_#ffd700] animate-ping" style={{ animationDuration: '4s' }} />

      {/* Soft Vignette Gradients */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#002e13] to-transparent" />
    </div>
  );
};
