import React, { useEffect, useState } from 'react';
import { Clock, ArrowRight, X, CheckCircle } from 'lucide-react';

interface TimerModalProps {
  isOpen: boolean;
  userName?: string;
  title?: string;
  onClose: () => void;
  onProceed: () => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  userName,
  title = 'Aapka Paigham Ban Raha Hai...',
  onClose,
  onProceed,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(5); // 5-second timer
      setIsReady(false);

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsReady(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#002810] border-2 border-yellow-400 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-white my-auto">
        
        {/* Header with Close Button */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400 animate-spin" />
            <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
              {title} {timeLeft > 0 ? `(${timeLeft}s)` : '✅'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Greeting Teaser */}
        <div className="px-5 pt-3.5 text-center">
          <p className="text-xs text-emerald-200 font-semibold">
            {userName ? (
              <>
                <span className="font-extrabold text-yellow-300">{userName}</span> ka 14 August paigham tayyar ho raha hai...
              </>
            ) : (
              'Baraye meherbani 5 second intizar farmayein...'
            )}
          </p>
        </div>

        {/* Ready Confirmation Message */}
        {isReady && (
          <div className="px-4 py-2 mt-4 text-center bg-emerald-500/20 border-y border-emerald-500/30 animate-pulse">
            <p className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-yellow-400" />
              <span>Aapka Paigham Tayyar Hai!</span>
            </p>
          </div>
        )}

        {/* Countdown / Proceed Button */}
        <div className="p-4">
          <button
            type="button"
            disabled={!isReady}
            onClick={onProceed}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-xl ${
              isReady
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black border-2 border-white cursor-pointer animate-pulse scale-102'
                : 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed opacity-60'
            }`}
          >
            {isReady ? (
              <>
                <span>Aage Barhein ➡️</span>
                <ArrowRight className="w-5 h-5 text-black" />
              </>
            ) : (
              <span>Baraye Meherbani {timeLeft}s Intizar Karein...</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
