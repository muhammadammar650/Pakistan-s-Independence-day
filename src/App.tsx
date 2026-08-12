import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Copy, Check, Info, Clock, X } from 'lucide-react';
import { VignetteManager } from './utils/vignetteManager';
import { injectMonetagScripts } from './utils/adInjector';

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
}

interface ConfettiPiece {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRotation: number;
  color: string;
  alpha: number;
  decay: number;
  isRect: boolean;
}

export default function App() {
  const [senderName, setSenderName] = useState<string>('');
  const [mainHeadingRoman, setMainHeadingRoman] = useState<string>('14 August Jashn-e-Azadi Mubarak!');
  const [mainHeadingUrdu, setMainHeadingUrdu] = useState<string>('۱۴ اگست جشنِ آزادی مبارک!');
  const [typedNameInput, setTypedNameInput] = useState<string>('');
  
  // Modals state
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState<boolean>(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(5);
  const [isTimerFinished, setIsTimerFinished] = useState<boolean>(false);

  // Post-customization Share Section state
  const [showShareSection, setShowShareSection] = useState<boolean>(false);
  const [generatedShareUrl, setGeneratedShareUrl] = useState<string>('');
  const [copiedFeedback, setCopiedFeedback] = useState<boolean>(false);

  // Countdown state to Aug 14, 2026 00:00:00 PKT
  const [cdDays, setCdDays] = useState<string>('00');
  const [cdHours, setCdHours] = useState<string>('00');
  const [cdMinutes, setCdMinutes] = useState<string>('00');
  const [cdSeconds, setCdSeconds] = useState<string>('00');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // RECYCLED PARTICLE OBJECT POOL REFS
  const MAX_FIREWORKS = 180;
  const MAX_CONFETTI = 220;

  const fireworksPoolRef = useRef<Particle[]>(
    Array.from({ length: MAX_FIREWORKS }, () => ({
      active: false, x: 0, y: 0, vx: 0, vy: 0, color: '#FFD700', radius: 2, alpha: 0, decay: 0.02
    }))
  );

  const confettiPoolRef = useRef<ConfettiPiece[]>(
    Array.from({ length: MAX_CONFETTI }, () => ({
      active: false, x: 0, y: 0, vx: 0, vy: 0, size: 8, rotation: 0, vRotation: 0,
      color: '#FFD700', alpha: 0, decay: 0.01, isRect: true
    }))
  );

  // STRICT DOMAIN FOR LINK GENERATION
  const MANDATORY_BASE_DOMAIN = 'https://azadiwish.netlify.app';

  // Global click wrapper to track 3-click popunder rule
  const handleGlobalClick = (e: React.MouseEvent) => {
    VignetteManager.registerClick();
  };

  // Trigger Confetti Burst Animation
  const triggerConfettiBurst = (x?: number, y?: number) => {
    const posX = x ?? (window.innerWidth / 2);
    const posY = y ?? (window.innerHeight / 2);
    const colors = ['#FFD700', '#00FF66', '#FFFFFF', '#32CD32', '#00E5FF', '#FF4081'];

    let activated = 0;
    for (let i = 0; i < MAX_CONFETTI && activated < 100; i++) {
      const c = confettiPoolRef.current[i];
      if (!c.active) {
        c.active = true;
        c.x = posX;
        c.y = posY;
        c.size = Math.random() * 8 + 6;
        c.vx = (Math.random() - 0.5) * 16;
        c.vy = (Math.random() - 0.8) * 14;
        c.rotation = Math.random() * Math.PI * 2;
        c.vRotation = (Math.random() - 0.5) * 0.2;
        c.color = colors[Math.floor(Math.random() * colors.length)];
        c.alpha = 1;
        c.decay = Math.random() * 0.012 + 0.008;
        c.isRect = Math.random() > 0.4;
        activated++;
      }
    }
  };

  const triggerFireworksBurst = (x?: number, y?: number) => {
    const posX = x ?? Math.random() * (window.innerWidth || 400);
    const posY = y ?? Math.random() * ((window.innerHeight || 600) * 0.6);
    const colors = ['#FFD700', '#00FF66', '#FFFFFF', '#32CD32', '#F0E68C'];

    let activated = 0;
    for (let i = 0; i < MAX_FIREWORKS && activated < 35; i++) {
      const p = fireworksPoolRef.current[i];
      if (!p.active) {
        p.active = true;
        p.x = posX;
        p.y = posY;
        p.color = colors[Math.floor(Math.random() * colors.length)];
        p.radius = Math.random() * 3 + 1.5;
        p.vx = (Math.random() - 0.5) * 9;
        p.vy = (Math.random() - 0.5) * 9;
        p.alpha = 1;
        p.decay = Math.random() * 0.02 + 0.012;
        activated++;
      }
    }
  };

  // Helper to update Open Graph and Twitter Card tags dynamically
  const updateDynamicSocialMeta = (name: string) => {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();
    const dynamicTitle = `${cleanName} Ki Taraf Se - 14 August Jashn-e-Azadi Mubarak 🇵🇰`;
    const dynamicDesc = `${cleanName} ne aapke liye 14 August Jashn-e-Azadi ka khas paigham bheja hai! Yahan click karke apna paigham banayein.`;

    document.title = dynamicTitle;

    if (typeof document !== 'undefined') {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', dynamicTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', dynamicDesc);

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', dynamicTitle);

      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', dynamicDesc);
    }
  };

  useEffect(() => {
    // Inject Monetag ad scripts via deferred loader
    injectMonetagScripts();

    // Initial Page Load URL Parameter Check (?n= or ?name=)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sender = urlParams.get('n') || urlParams.get('name');

      if (sender && sender.trim() !== '') {
        const cleanSender = sender.trim();
        setSenderName(cleanSender);
        setMainHeadingRoman(`${cleanSender} Ki Taraf Se Aapko 14 August Mubarak!`);
        setMainHeadingUrdu(`${cleanSender} کی طرف سے آپ کو ۱۴ اگست مبارک!`);
        updateDynamicSocialMeta(cleanSender);
      } else {
        setMainHeadingRoman('14 August Jashn-e-Azadi Mubarak!');
        setMainHeadingUrdu('۱۴ اگست جشنِ آزادی مبارک!');
      }
    }

    // Countdown to August 14, 2026 00:00:00 PKT
    const targetDate = new Date('2026-08-13T19:00:00Z').getTime();
    const updateCD = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setCdDays('00');
        setCdHours('00');
        setCdMinutes('00');
        setCdSeconds('00');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCdDays(String(days).padStart(2, '0'));
      setCdHours(String(hours).padStart(2, '0'));
      setCdMinutes(String(minutes).padStart(2, '0'));
      setCdSeconds(String(seconds).padStart(2, '0'));
    };

    updateCD();
    const cdInterval = setInterval(updateCD, 1000);

    // Canvas Renderer Engine with Particle Pool Recycling
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let animationFrameId: number;

        const resizeCanvas = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Render Fireworks from Pool
          for (let i = 0; i < MAX_FIREWORKS; i++) {
            const p = fireworksPoolRef.current[i];
            if (!p.active) continue;

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
              p.active = false;
              continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.restore();
          }

          // Render Confetti from Pool
          for (let i = 0; i < MAX_CONFETTI; i++) {
            const c = confettiPoolRef.current[i];
            if (!c.active) continue;

            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.18;
            c.vx *= 0.98;
            c.rotation += c.vRotation;
            c.alpha -= c.decay;

            if (c.alpha <= 0) {
              c.active = false;
              continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, c.alpha);
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation);
            ctx.fillStyle = c.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = c.color;

            if (c.isRect) {
              ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
            } else {
              ctx.beginPath();
              ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          }

          if (Math.random() < 0.04) {
            triggerFireworksBurst();
          }

          animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
          clearInterval(cdInterval);
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener('resize', resizeCanvas);
        };
      }
    }

    return () => clearInterval(cdInterval);
  }, []);

  // Single-tap action: Open Name Input Modal
  const handleOpenCustomizer = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleGlobalClick(e);
    setIsNameModalOpen(true);
    VignetteManager.triggerVignette('open_customizer');
  };

  // Name Form Submission
  const handleNameSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    VignetteManager.registerClick();

    const val = typedNameInput.trim();
    if (!val) {
      alert("Meharbani karke apna naam likhein! / مہربانی کر کے اپنا نام لکھیں!");
      return;
    }

    setIsNameModalOpen(false);
    startRewardTimer();
  };

  // Start 5-Second Rewarded Vignette Timer
  const startRewardTimer = () => {
    setIsRewardModalOpen(true);
    setTimerSecondsLeft(5);
    setIsTimerFinished(false);

    // INJECT and EXECUTE Monetag Vignette script exactly when modal opens
    try {
      (function(s: any) {
        s.dataset.zone = '11552282';
        s.src = 'https://n6wxm.com/vignette.min.js';
      })([document.documentElement, document.body].filter(Boolean).pop()!.appendChild(document.createElement('script')));
    } catch (err) {
      console.warn('Vignette script injection notice:', err);
    }

    // Trigger Vignette Banner Ad via manager
    VignetteManager.triggerVignette('reward_timer');

    const timerInterval = setInterval(() => {
      setTimerSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setIsTimerFinished(true);
          triggerFireworksBurst();
          triggerConfettiBurst();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Final "Aage Barhein ➡️ / آگے بڑھیں" Handler
  const handleProceed = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleGlobalClick(e);
    setIsRewardModalOpen(false);

    const cleanName = typedNameInput.trim();
    setSenderName(cleanName);
    setMainHeadingRoman(`${cleanName} Ki Taraf Se 14 August Mubarak!`);
    setMainHeadingUrdu(`${cleanName} کی طرف سے ۱۴ اگست مبارک!`);
    updateDynamicSocialMeta(cleanName);

    // ALWAYS GENERATE LINK USING MANDATORY DOMAIN: https://azadiwish.netlify.app
    const netlifyShareUrl = `${MANDATORY_BASE_DOMAIN}/?n=${encodeURIComponent(cleanName)}`;
    setGeneratedShareUrl(netlifyShareUrl);

    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
      window.history.pushState({}, '', `/?n=${encodeURIComponent(cleanName)}`);
    }

    setShowShareSection(true);
    triggerFireworksBurst();
    triggerConfettiBurst();
  };

  // Copy Link Handler
  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleGlobalClick(e);
    if (!generatedShareUrl) return;

    navigator.clipboard.writeText(generatedShareUrl).then(() => {
      setCopiedFeedback(true);
      alert("Link copy ho gaya hai! / لنک کاپی ہو گیا ہے!");
      setTimeout(() => setCopiedFeedback(false), 2000);
    }).catch(() => {
      alert("Link copy ho gaya hai!");
    });
  };

  // WhatsApp Share Handler
  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleGlobalClick(e);
    if (!generatedShareUrl || !senderName) return;

    // Trigger Vignette Banner Ad via Manager
    VignetteManager.triggerVignette('whatsapp_share');

    // Confetti & Fireworks celebration
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
    triggerFireworksBurst(window.innerWidth / 2, window.innerHeight / 3);

    const messageText = `Dekhein ${senderName} ne aapke liye 14 August ka special paigham bheja hai! Yahan click karke dekhein: ${generatedShareUrl}`;
    const webWhatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;

    // Direct open without redirecting current site away
    window.open(webWhatsappUrl, '_blank');
  };

  return (
    <div 
      onClick={handleGlobalClick}
      className="min-h-screen bg-[#01411C] text-white font-roman selection:bg-yellow-400 selection:text-black relative overflow-x-hidden flex flex-col justify-between antialiased"
    >
      
      {/* Canvas Background for Fireworks & Confetti Engine */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center">
        
        {/* Header Bar */}
        <header className="w-full flex items-center justify-between py-2.5 px-4 mb-4 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2.5">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg" 
              alt="Pakistan Flag" 
              className="w-8 h-5 object-cover rounded shadow border border-white/30" 
            />
            <span className="text-xs font-black tracking-wider uppercase text-yellow-300">
              14 August Jashn-e-Azadi 🇵🇰
            </span>
          </div>

          <div className="py-1 px-3 bg-emerald-950/80 border border-yellow-400/50 rounded-xl text-[11px] font-extrabold text-yellow-300 flex items-center gap-1 shadow-sm">
            <span>Pakistan Zindabad!</span>
          </div>
        </header>

        {/* Real-Time Countdown Timer */}
        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shadow-xl mb-4">
          <p className="text-xs font-black text-yellow-300 uppercase tracking-widest mb-2.5">
            14 August Tak Baqi Waqt / ۱۴ اگست تک باقی وقت
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-black/50 p-2.5 rounded-xl border border-white/15 shadow">
              <span className="block text-2xl font-black text-white">{cdDays}</span>
              <span className="text-[10px] font-extrabold text-emerald-300 uppercase">Din / دن</span>
            </div>
            <div className="bg-black/50 p-2.5 rounded-xl border border-white/15 shadow">
              <span className="block text-2xl font-black text-white">{cdHours}</span>
              <span className="text-[10px] font-extrabold text-emerald-300 uppercase">Ghante / گھنٹے</span>
            </div>
            <div className="bg-black/50 p-2.5 rounded-xl border border-white/15 shadow">
              <span className="block text-2xl font-black text-white">{cdMinutes}</span>
              <span className="text-[10px] font-extrabold text-emerald-300 uppercase">Minat / منٹ</span>
            </div>
            <div className="bg-black/50 p-2.5 rounded-xl border border-white/15 shadow">
              <span className="block text-2xl font-black text-yellow-300">{cdSeconds}</span>
              <span className="text-[10px] font-extrabold text-emerald-300 uppercase">Second / سیکنڈ</span>
            </div>
          </div>
        </div>

        {/* STRAIGHT UPRIGHT PROMINENT PAKISTAN FLAG */}
        <div 
          onClick={(e) => { 
            e.stopPropagation();
            handleGlobalClick(e);
            triggerFireworksBurst(e.clientX, e.clientY); 
            triggerConfettiBurst(e.clientX, e.clientY); 
          }}
          className="my-5 cursor-pointer flex items-center justify-center w-full" 
          title="Touch flag for fireworks & confetti!"
        >
          <div className="w-64 sm:w-72 aspect-[16/9] relative overflow-hidden border-2 border-white/80 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(255,215,0,0.4)] bg-[#01411C]">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg" 
              alt="Flag of Pakistan - 14 August Independence Day" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <p className="text-[11px] text-yellow-300 font-extrabold uppercase tracking-widest text-center mt-2 mb-3 drop-shadow">
          ✨ Parcham Par Touch Karein / پرچم پر ٹچ کریں ✨
        </p>

        {/* Hero Card */}
        <div className="w-full bg-white/10 backdrop-blur-xl border-2 border-yellow-400/60 rounded-3xl p-5 sm:p-6 text-center shadow-2xl relative overflow-hidden mb-5">
          
          {/* Main Headings */}
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug mb-1 drop-shadow-md tracking-tight">
            {mainHeadingRoman}
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold font-urdu text-yellow-300 mb-4 drop-shadow">
            {mainHeadingUrdu}
          </h2>

          {/* Dual Message Display */}
          <div className="bg-black/55 p-4 sm:p-5 rounded-2xl border border-white/20 mb-4 text-left space-y-4 shadow-inner">
            <div>
              <span className="inline-block text-[11px] font-black text-yellow-300 uppercase tracking-wider mb-1">
                Roman Urdu Paigham:
              </span>
              <p className="text-sm sm:text-base text-emerald-100 font-extrabold leading-relaxed">
                "Dil se dua hai ke humara pyara Pakistan hamesha quaim wa daim rahe, taraqqi kare aur hum sab azaad wa khushaal rahein. Aapko aur aapki pyari family ko 14 August Jashn-e-Azadi ki dheron mubarakbaad!"
              </p>
            </div>

            <div className="border-t border-white/15 pt-3.5 text-right">
              <span className="inline-block text-[11px] font-black text-yellow-300 uppercase tracking-wider mb-1 font-urdu">
                پیغام اردو:
              </span>
              <p className="text-base sm:text-lg text-yellow-100 font-bold font-urdu">
                "دل سے دعا ہے کہ ہمارا پیارا پاکستان ہمیشہ قائم و دائم رہے، ترقی کرے اور ہم سب آزاد و خوشحال رہیں۔ آپ کو اور آپ کی پیاری فیملی کو ۱۴ اگست جشنِ آزادی کی ڈھیروں مبارکباد!"
              </p>
            </div>
          </div>

          {/* Ad Guidance Banner */}
          <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-2xl p-3.5 mb-5 text-center shadow-inner">
            <p className="text-xs font-black text-yellow-300 flex items-center justify-center gap-1.5">
              <Info className="w-4 h-4 text-yellow-400" />
              <span>Ishtihar (Ad) Hidayat / اہم ہدایت:</span>
            </p>
            <p className="text-xs text-emerald-100 font-extrabold mt-1 leading-snug">
              Agar koi ishtihar khule, toh pareshan na ho! Simply back button dabayein aur apna paigham wa link haasil karein.
            </p>
            <p className="text-xs text-yellow-200 font-urdu font-bold mt-1">
              اگر کوئی اشتہار کھلے تو گھبرائیں نہیں! بیک بٹن دبائیں اور اپنا پیغام حاصل کریں۔
            </p>
          </div>

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={handleOpenCustomizer}
            className="w-full py-4.5 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-black text-base sm:text-lg shadow-2xl animate-glow transition-all active:scale-95 flex items-center justify-center gap-2 border-2 border-white cursor-pointer hover:brightness-110"
          >
            <span>Apna Paigham Banayein ➡️</span>
            <ArrowRight className="w-5 h-5 text-black" />
          </button>

          {/* Share Section (Revealed Post-Customization) */}
          {showShareSection && (
            <div className="mt-6 pt-6 border-t border-white/20 text-left animate-fade-in">
              <label className="block text-xs font-black text-yellow-300 uppercase tracking-widest mb-1">
                Aap Ka Khas Link Tayyar Hai:
              </label>
              <p className="text-xs text-emerald-200 font-bold font-urdu mb-2.5">
                آپ کا خاص لنک تیار ہے! نیچے کاپی یا واٹس ایپ پر شیئر کریں۔
              </p>

              {/* Copyable Link Field */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  readOnly
                  value={generatedShareUrl}
                  className="w-full px-3.5 py-3 bg-black/60 border border-white/30 rounded-xl text-xs sm:text-sm text-emerald-200 outline-none font-mono font-bold select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-3 px-4.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs sm:text-sm rounded-xl shadow cursor-pointer shrink-0 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  {copiedFeedback ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
                  <span>Copy</span>
                </button>
              </div>

              {/* WhatsApp Share Button */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-4.5 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2.5 border border-white/30 cursor-pointer transition-all active:scale-95"
              >
                <span>WhatsApp Par Share Karein</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center bg-black/60 border-t border-white/10 relative z-10 mt-auto">
        <div className="max-w-md mx-auto space-y-1">
          <p className="text-xs sm:text-sm font-black text-yellow-300">
            🇵🇰 14 August Jashn-e-Azadi Mubarak 🇵🇰
          </p>
          <p className="text-xs text-white/90 font-bold">
            Pyare Pakistan Ke Liye Muhabbat Se Banaya Gaya ❤️
          </p>
          <p className="text-base text-emerald-300 font-bold font-urdu mt-1">
            پاکستان ہمیشہ زندہ باد
          </p>
        </div>
      </footer>

      {/* MODAL 1: NAME CUSTOMIZATION INPUT */}
      {isNameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-[#01411C] border-2 border-yellow-400 rounded-3xl p-6 text-white shadow-2xl relative">
            
            <button 
              type="button"
              onClick={() => setIsNameModalOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white text-lg font-bold cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto mb-2 bg-yellow-400/20 rounded-full flex items-center justify-center text-yellow-300 text-xl border border-yellow-400/40">
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              <h2 className="text-lg font-black text-white">Apna Naam Likhein / اپنا نام لکھیں</h2>
              <p className="text-xs text-emerald-200 font-bold mt-1">Yahan apna naam darj karke apna khas link banayein.</p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-yellow-300 uppercase mb-1 ml-1">
                  Aap Ka Naam / آپ کا نام
                </label>
                <input
                  type="text"
                  value={typedNameInput}
                  onChange={(e) => setTypedNameInput(e.target.value)}
                  placeholder="Yahan apna naam likhein..."
                  className="w-full px-4 py-3 bg-black/50 border border-white/30 focus:border-yellow-400 rounded-xl text-white placeholder:text-white/40 outline-none text-sm font-bold transition-all"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-sm sm:text-base shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Paigham Tayyar Karein ➡️</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: 5-SECOND REWARDED VIGNETTE TIMER MODAL */}
      {isRewardModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-[#002e13] border-2 border-emerald-400 rounded-3xl p-6 text-white text-center shadow-2xl relative overflow-hidden">
            
            <button 
              type="button"
              onClick={() => setIsRewardModalOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center text-yellow-300 text-2xl border border-emerald-400/40 animate-pulse">
              <Clock className="w-8 h-8 text-yellow-300" />
            </div>

            <h3 className="text-base font-black text-white mb-2">
              {isTimerFinished ? "Aapka Paigham Tayyar Hai! ✅ / آپ کا پیغام تیار ہے" : `Aapka Paigham Ban Raha Hai... (${timerSecondsLeft}s)`}
            </h3>

            <p className="text-xs text-emerald-200 font-bold mb-4 font-urdu">
              برائے مہربانی ۵ سیکنڈ انتظار فرمائیں... / Baraye meherbani 5 second intizar farmayein
            </p>

            <div className="bg-black/40 border border-yellow-400/30 rounded-xl p-2.5 mb-4 text-[11px] text-yellow-300 font-extrabold flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>Agar ad khule toh back button dabayein, reward tayyar hai!</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden mb-5 border border-white/20">
              <div 
                className="bg-gradient-to-r from-yellow-400 via-amber-300 to-emerald-400 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - timerSecondsLeft) / 5) * 100}%` }}
              />
            </div>

            <button
              type="button"
              disabled={!isTimerFinished}
              onClick={handleProceed}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
                isTimerFinished
                  ? "bg-gradient-to-r from-yellow-400 to-amber-400 text-black border-2 border-white cursor-pointer hover:scale-102 active:scale-95 animate-pulse"
                  : "bg-white/10 text-white/40 border border-white/10 cursor-not-allowed opacity-60"
              }`}
            >
              <span>{isTimerFinished ? "Aage Barhein ➡️ / آگے بڑھیں" : "Baraye Meherbani Intizar Karein..."}</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
