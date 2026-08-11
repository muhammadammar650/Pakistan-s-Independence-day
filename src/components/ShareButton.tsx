import React, { useState } from 'react';
import { Share2, Copy, CheckCircle, MessageSquare } from 'lucide-react';

interface ShareButtonProps {
  shareUrl: string;
  senderName: string;
  onActionWrapper?: (action: () => void) => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ shareUrl, senderName, onActionWrapper }) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const performShare = async () => {
    const title = '14 August Jashn-e-Azadi Pakistan Mubarak 🇵🇰';
    const text = senderName 
      ? `${senderName} ne aapko 14 August Independence Day ka khas paigham bheja hai! Dekhne ke liye link par click karein. \n\n`
      : 'Apne doston ke sath 14 August Independence Day ka khas Roman Urdu paigham share karein! \n\n';
      
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setShowMenu(true);
        }
      }
    } else {
      setShowMenu(true);
    }
  };

  const handleShare = () => {
    if (showMenu) {
      setShowMenu(false);
      return;
    }
    
    if (onActionWrapper) {
      onActionWrapper(() => performShare());
    } else {
      performShare();
    }
  };

  const performWhatsAppShare = () => {
    const text = senderName 
      ? `${senderName} ne aapko 14 August Independence Day ka khas paigham bheja hai! Dekhne ke liye link par click karein. \n\n${shareUrl}`
      : `Apne doston ke sath 14 August Independence Day ka khas Roman Urdu paigham share karein! \n\n${shareUrl}`;
      
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    setShowMenu(false);
  };

  const handleWhatsAppShare = () => {
    if (onActionWrapper) {
      onActionWrapper(() => performWhatsAppShare());
    } else {
      performWhatsAppShare();
    }
  };

  const performCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    }).catch(() => {
      // Fallback if clipboard API fails
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    });
  };

  const handleCopyLink = () => {
    if (onActionWrapper) {
      onActionWrapper(() => performCopyLink());
    } else {
      performCopyLink();
    }
  };

  return (
    <div id="share-section" className="w-full flex flex-col items-center my-4 relative">
      <button
        onClick={handleShare}
        className="w-full py-4 px-6 rounded-2xl bg-white text-[#00401a] font-extrabold text-lg shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95 border border-white/40"
      >
        <Share2 className="w-5 h-5 text-[#00401a]" />
        <span>Share</span>
      </button>

      {showMenu && (
        <div className="absolute bottom-full left-0 right-0 mb-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-3 flex flex-col gap-2 shadow-2xl animate-fade-in z-20">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm flex items-center gap-3 transition-colors"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-3 transition-colors border border-white/10"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
