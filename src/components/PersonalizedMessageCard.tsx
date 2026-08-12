import React, { useState } from 'react';
import { Copy, Check, Sparkles, Flag } from 'lucide-react';
import { PresetMessage } from '../types';

interface PersonalizedMessageCardProps {
  senderName: string;
  preset: PresetMessage;
  onCelebrate: () => void;
}

export const PersonalizedMessageCard: React.FC<PersonalizedMessageCardProps> = ({
  senderName,
  preset,
  onCelebrate,
}) => {
  const [copied, setCopied] = useState(false);

  const fullMessageText = `${senderName ? `${senderName} ki taraf se ` : ''}14 August Mubarak!\n\n${preset.romanUrdu}\n\n${preset.urduText}\n\nPakistan Zindabad! 🇵🇰`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMessageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="personalized-card"
      className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden my-4 text-white"
    >
      {/* Sender Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/15">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-green-300 shrink-0">
            <Flag className="w-4 h-4 text-green-300" />
          </div>
          <div>
            <p className="text-[10px] text-green-300 uppercase font-bold tracking-widest">
              Khas Paigham Taraf Se
            </p>
            <h3 className="text-base font-bold text-white tracking-wide">
              {senderName || 'Pakistani Dost'}
            </h3>
          </div>
        </div>

        <button
          onClick={onCelebrate}
          title="Jashn"
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-green-300 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-green-300" />
          <span>Jashn</span>
        </button>
      </div>

      {/* Message Text Area */}
      <div className="my-3 space-y-4">
        {/* Roman Urdu Message */}
        <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
          {preset.romanUrdu}
        </p>

        {/* Beautiful Urdu Script */}
        <div dir="rtl" className="text-right text-green-300 font-serif text-lg sm:text-xl leading-loose pt-2 border-t border-white/10">
          {preset.urduText}
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-end">
        <button
          onClick={handleCopy}
          className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all active:scale-95 backdrop-blur-md"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-300">Copy Ho Gaya!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-white/90" />
              <span>Paigham Copy Karein</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
