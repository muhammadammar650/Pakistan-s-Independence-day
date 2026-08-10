import React, { useState } from 'react';
import { Share2, Send, Copy, Check, MessageSquare } from 'lucide-react';

interface ShareButtonProps {
  senderName: string;
  shareUrl: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ senderName, shareUrl }) => {
  const [copied, setCopied] = useState(false);

  const displaySender = senderName.trim() || 'Pakistani Bhai';

  const shareTitle = `14 August Independence Day Greeting from ${displaySender} 🇵🇰`;
  const shareMessage = `🇵🇰 *${displaySender}* ne aap ke liye 14 August Independence Day ka khas paigham bheja hai! 💚\n\nApna paigham dekhne aur apna naam likhne ke liye click karein:\n${shareUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleWhatsAppShare();
        }
      }
    } else {
      handleWhatsAppShare();
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="share-section" className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-6 shadow-2xl my-4 text-white">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
          <span>Aap Bhi Apne Doston Ko Share Karein</span>
          <span className="text-amber-300">🇵🇰</span>
        </h3>
        <p className="text-xs text-white/70 mt-1">
          WhatsApp aur social media par 1-tap main share karein
        </p>
      </div>

      {/* Primary WhatsApp Big Button */}
      <button
        id="whatsapp-share-btn"
        onClick={handleWhatsAppShare}
        className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-base shadow-[0_0_20px_rgba(37,211,102,0.4)] animate-pulse hover:animate-none flex items-center justify-center gap-3 transition-all active:scale-95 border border-white/20 mb-3"
      >
        <MessageSquare className="w-5 h-5 text-white fill-white" />
        <span>WhatsApp Par Share Karein</span>
      </button>

      {/* Grid of Other Social Share Channels */}
      <div className="grid grid-cols-3 gap-2">
        <button
          id="native-web-share-btn"
          onClick={handleNativeShare}
          className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 backdrop-blur-md"
        >
          <Share2 className="w-3.5 h-3.5 text-green-300" />
          <span>More Share</span>
        </button>

        <button
          id="facebook-share-btn"
          onClick={handleFacebookShare}
          className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 backdrop-blur-md"
        >
          <Send className="w-3.5 h-3.5 text-blue-300" />
          <span>Facebook</span>
        </button>

        <button
          id="telegram-share-btn"
          onClick={handleTelegramShare}
          className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 backdrop-blur-md"
        >
          <Send className="w-3.5 h-3.5 text-sky-300" />
          <span>Telegram</span>
        </button>
      </div>

      {/* Quick Copy Link Row */}
      <button
        id="copy-link-alt-btn"
        onClick={handleCopyLink}
        className="w-full mt-3 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center justify-center gap-2 transition-all active:scale-95 backdrop-blur-md"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Link Copied To Clipboard!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-green-300" />
            <span>Copy Greeting Link</span>
          </>
        )}
      </button>
    </div>
  );
};
