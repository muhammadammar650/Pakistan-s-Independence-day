import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles, Share2 } from 'lucide-react';

interface GeneratedLinkProps {
  shareUrl: string;
  senderName: string;
  onOpenShare: () => void;
}

export const GeneratedLink: React.FC<GeneratedLinkProps> = ({
  shareUrl,
  senderName,
  onOpenShare,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="generated-link-card"
      className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-6 shadow-2xl my-4 animate-slide-up text-white"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
        <h3 className="text-base font-extrabold text-white tracking-wide">
          Aap Ka Khaas Link Tayyar Hai! 🎉
        </h3>
      </div>

      <p className="text-xs text-white/80 mb-3 font-medium">
        Yeh link apne doston aur khandan ke sath WhatsApp par share karein. Is link par <strong>{senderName}</strong> ka naam aayega!
      </p>

      {/* Generated Link Input Box */}
      <div className="flex items-center gap-2 p-2 bg-black/20 border border-white/20 rounded-2xl mb-3 backdrop-blur-md">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="w-full bg-transparent text-green-300 text-xs font-mono px-2 outline-none overflow-hidden text-ellipsis whitespace-nowrap"
        />
        <button
          id="copy-generated-link-btn"
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-white hover:bg-green-50 text-[#00401a] font-bold text-xs shrink-0 flex items-center gap-1.5 transition-transform active:scale-95 shadow-md"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#00401a]" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#00401a]" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* Fast Share Action Trigger */}
      <div className="grid grid-cols-2 gap-2">
        <button
          id="open-share-dialog-btn"
          onClick={onOpenShare}
          className="py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs border border-green-400/30 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
        >
          <Share2 className="w-4 h-4 text-white" />
          <span>Share Karein</span>
        </button>

        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-2 transition-all active:scale-95 text-center backdrop-blur-md"
        >
          <ExternalLink className="w-4 h-4 text-green-300" />
          <span>Preview Link</span>
        </a>
      </div>
    </div>
  );
};
