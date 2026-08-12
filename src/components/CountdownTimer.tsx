import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isIndependenceDay: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Target: 14 August 2026 00:00:00 PKT (+05:00)
      const targetDate = new Date("2026-08-14T00:00:00+05:00").getTime();
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isIndependenceDay: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isIndependenceDay: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto my-3 px-4">
      <div className="bg-gradient-to-r from-black/60 via-[#003816]/70 to-black/60 border border-green-400/30 rounded-2xl p-3.5 shadow-xl backdrop-blur-md text-center">
        
        {/* Header Badge */}
        <div className="flex items-center justify-center gap-2 mb-2 text-xs font-bold text-green-300 uppercase tracking-wider">
          <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
          <span>14 August Jashn-e-Azadi Countdown</span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
        </div>

        {timeLeft.isIndependenceDay ? (
          <div className="py-2 text-lg font-black text-yellow-300 animate-bounce">
            🇵🇰 Jashn-e-Azadi Mubarak! 🇵🇰
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-white">
            {/* Days */}
            <div className="flex flex-col items-center bg-white/10 border border-white/15 px-2.5 sm:px-3 py-1.5 rounded-xl min-w-[62px]">
              <span className="text-lg sm:text-xl font-extrabold text-yellow-300 font-mono">
                {timeLeft.days}
              </span>
              <span className="text-[10px] text-green-200 font-medium">Din</span>
            </div>

            <span className="text-yellow-400 font-bold text-sm">:</span>

            {/* Hours */}
            <div className="flex flex-col items-center bg-white/10 border border-white/15 px-2.5 sm:px-3 py-1.5 rounded-xl min-w-[62px]">
              <span className="text-lg sm:text-xl font-extrabold text-yellow-300 font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-green-200 font-medium">Ghante</span>
            </div>

            <span className="text-yellow-400 font-bold text-sm">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center bg-white/10 border border-white/15 px-2.5 sm:px-3 py-1.5 rounded-xl min-w-[62px]">
              <span className="text-lg sm:text-xl font-extrabold text-yellow-300 font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-green-200 font-medium">Mint</span>
            </div>

            <span className="text-yellow-400 font-bold text-sm">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center bg-white/10 border border-white/15 px-2.5 sm:px-3 py-1.5 rounded-xl min-w-[62px]">
              <span className="text-lg sm:text-xl font-extrabold text-green-300 font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-green-200 font-medium">Sec</span>
            </div>
          </div>
        )}

        <p className="text-[11px] text-white/80 mt-2 font-medium">
          {timeLeft.isIndependenceDay
            ? 'Pakistan Zindabad!'
            : `${timeLeft.days} Din, ${timeLeft.hours} Ghante, ${timeLeft.minutes} Mint, ${timeLeft.seconds} Sec Baki Hain!`}
        </p>
      </div>
    </div>
  );
};
