import React, { useState } from 'react';
import { Copy, CheckCircle, MessageSquare } from 'lucide-react';

interface ShareButtonProps {
  shareUrl: string;
  senderName: string;
  onShareClick?: () => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ shareUrl, senderName, onShareClick }) => {
  const [copied, setCopied] = useState(false);

  const getShareText = () => {
    const name = senderName || 'Ek Pakistani';
    return `Dekhein ${name} ne aapke liye 14 August Jashn-e-Azadi ka khas paigham bheja hai! Yahan click karke dekhein: ${shareUrl}`;
  };

  const handleWhatsAppShare = () => {
    if (onShareClick) {
      onShareClick();
    } else {
      executeWhatsAppShare();
    }
  };

  const executeWhatsAppShare = () => {
    const message = getShareText();
    const whatsappDeepLink = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const whatsappWebLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    try {
      window.location.href = whatsappDeepLink;
      setTimeout(() => {
        window.open(whatsappWebLink, '_blank');
      }, 500);
    } catch {
      window.open(whatsappWebLink, '_blank');
    }
  };

  const handleCopyLink = () => {
    const textToCopy = shareUrl;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      const input = document.createElement('input');
      input.value = textToCopy;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div id="share-section" className="w-full flex flex-col gap-2.5 my-3">
      {/* Read-only input box showing generated URL with Copy Link button */}
      <div className="w-full flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-green-300 uppercase tracking-widest ml-1">
          Aap Ka Paigham Link:
        </label>
        <div className="flex items-center gap-2 bg-black/40 border border-white/20 p-1.5 rounded-xl backdrop-blur-md">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent px-2.5 py-1 text-xs text-white/90 font-mono outline-none select-all truncate"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 whitespace-nowrap border border-white/20 transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-yellow-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* WhatsApp Share Button */}
      <button
        type="button"
        onClick={handleWhatsAppShare}
        className="w-full py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-base shadow-lg flex items-center justify-center gap-2.5 transition-transform active:scale-95 border border-white/30 cursor-pointer"
      >
        <MessageSquare className="w-5 h-5 fill-white text-[#25D366]" />
        <span>WhatsApp Par Share Karein 📲</span>
      </button>
    </div>
  );
};
