import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { AdPlacement } from './AdPlacement';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({ isOpen, onClose, title = "Sponsored Content" }) => {
  const [canClose, setCanClose] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [adLoaded, setAdLoaded] = useState(false);
  const isAutoClosing = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      setTimeLeft(5);
      setAdLoaded(false);
      isAutoClosing.current = false;
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  // Handle the 5-second fallback: if ad is NOT loaded in 5 seconds, auto-close
  useEffect(() => {
    if (isOpen && canClose && !adLoaded && !isAutoClosing.current) {
      isAutoClosing.current = true;
      onClose(); // Automatically close and trigger pending action
    }
  }, [isOpen, canClose, adLoaded, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-[#001a0a] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
          <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">{title}</span>
          {canClose ? (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs font-medium text-white/50 bg-white/5 px-2 py-1 rounded-full">
              Close in {timeLeft}s
            </span>
          )}
        </div>

        {/* Ad Container */}
        <div className="p-4 flex justify-center bg-black/40">
          <AdPlacement type="rewarded" onLoaded={() => setAdLoaded(true)} />
        </div>
        
        {canClose && (
          <button 
            onClick={onClose}
            className="w-full py-4 text-center text-sm font-bold text-green-400 hover:text-green-300 bg-white/5 hover:bg-white/10 transition-colors border-t border-white/10"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};
