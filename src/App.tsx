import React, { useState, useEffect, useRef } from 'react';
import { BackgroundEffects } from './components/BackgroundEffects';
import { CountdownTimer } from './components/CountdownTimer';
import { GreetingHero } from './components/GreetingHero';
import { PersonalizedMessageCard } from './components/PersonalizedMessageCard';
import { UrduCalligraphyCard } from './components/UrduCalligraphyCard';
import { ShareButton } from './components/ShareButton';
import { Footer } from './components/Footer';
import { AdsterraBanner } from './components/AdsterraBanner';
import { TimerModal } from './components/TimerModal';
import { parseCurrentLocation, buildShareUrl, encodeGreeting } from './utils/encoder';
import { GREETING_PRESETS } from './utils/presets';
import { triggerPatrioticConfetti, triggerFireworks } from './utils/confetti';
import { loadSocialBarScript } from './utils/adManager';
import { Sparkles, ArrowRight, Users, User, Heart, CheckCircle, PlusCircle } from 'lucide-react';

export default function App() {
  const [senderName, setSenderName] = useState<string>('');
  const [presetIndex, setPresetIndex] = useState<number>(0);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [dynamicHeading, setDynamicHeading] = useState<string>('');

  // Main Form Input State
  const [inputName, setInputName] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'everyone' | 'friends' | 'family'>('everyone');
  const [selectedPresetId, setSelectedPresetId] = useState<number>(1);

  // Creator form visibility mode
  const [showCreatorForm, setShowCreatorForm] = useState<boolean>(true);
  const [isSharedLinkLoaded, setIsSharedLinkLoaded] = useState<boolean>(false);

  // Modals & Timers state
  const [isTimerModalOpen, setIsTimerModalOpen] = useState<boolean>(false);
  const [timerModalTitle, setTimerModalTitle] = useState<string>('Aapka Paigham Ban Raha Hai...');
  const [pendingName, setPendingName] = useState<string>('');
  const [pendingPresetIdx, setPendingPresetIdx] = useState<number>(0);
  const [pendingAction, setPendingAction] = useState<'create' | 'share' | null>(null);

  const creatorFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger Social Bar after exactly 10 seconds
    loadSocialBarScript(10000);

    // Parse URL query parameter ?name=Name or ?n=Name
    const urlGreeting = parseCurrentLocation();
    if (urlGreeting && urlGreeting.senderName) {
      const name = urlGreeting.senderName;
      setSenderName(name);
      setPresetIndex(urlGreeting.customMsgIndex || 0);
      setIsSharedLinkLoaded(true);
      setShowCreatorForm(false); // Hide form initially so they see sender message first
      
      const shareLink = buildShareUrl(encodeGreeting(name, urlGreeting.customMsgIndex || 0));
      setGeneratedUrl(shareLink);

      setDynamicHeading(`${name} ki taraf se 14 August Mubarak!`);
      document.title = `${name} ki taraf se - 14 August Jashn-e-Azadi Mubarak 🇵🇰`;
    }
  }, []);

  const handleEmojiAdd = (emoji: string) => {
    setInputName((prev) => prev + emoji);
  };

  // Open Creator Form for new user
  const handleOpenCreator = () => {
    setShowCreatorForm(true);
    setTimeout(() => {
      creatorFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = inputName.trim();
    if (!cleanName) {
      alert("Apna naam likhein!");
      return;
    }

    const selectedIdx = GREETING_PRESETS.findIndex((p) => p.id === selectedPresetId);
    const validIdx = selectedIdx >= 0 ? selectedIdx : 0;

    setPendingName(cleanName);
    setPendingPresetIdx(validIdx);
    setPendingAction('create');
    setTimerModalTitle('Aapka Paigham Ban Raha Hai...');
    setIsTimerModalOpen(true);
  };

  // Triggered when user clicks WhatsApp Share button
  const handleShareClick = () => {
    setPendingAction('share');
    setTimerModalTitle('Share Link Tayyar Ho Raha Hai...');
    setIsTimerModalOpen(true);
  };

  // Called when 5-second timer completes in TimerModal and user clicks Proceed
  const handleTimerModalProceed = () => {
    setIsTimerModalOpen(false);

    if (pendingAction === 'share') {
      const shareLink = generatedUrl || (typeof window !== 'undefined' ? window.location.href : '');
      const message = `Dekhein ${senderName || 'Ek Pakistani'} ne aapke liye 14 August Jashn-e-Azadi ka khas paigham bheja hai! Yahan click karke dekhein: ${shareLink}`;
      const whatsappWebLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      
      try {
        window.location.href = `whatsapp://send?text=${encodeURIComponent(message)}`;
        setTimeout(() => {
          window.open(whatsappWebLink, '_blank');
        }, 500);
      } catch {
        window.open(whatsappWebLink, '_blank');
      }
      setPendingAction(null);
      return;
    }

    if (pendingAction === 'create') {
      const finalName = pendingName;
      const finalPresetIdx = pendingPresetIdx;
      
      setSenderName(finalName);
      setPresetIndex(finalPresetIdx);

      // Build unique share URL ?name=TypedName
      const queryStr = encodeGreeting(finalName, finalPresetIdx);
      const newShareUrl = buildShareUrl(queryStr);
      setGeneratedUrl(newShareUrl);

      // Update URL in browser bar dynamically without page reload
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState({}, '', newShareUrl);
      }

      // Dynamic Heading update: "[Typed Name] ki taraf se 14 August Mubarak!"
      const heading = `${finalName} ki taraf se 14 August Mubarak!`;
      setDynamicHeading(heading);
      document.title = `${finalName} - 14 August Jashn-e-Azadi Mubarak 🇵🇰`;

      setIsSharedLinkLoaded(true);
      setShowCreatorForm(false);

      // Celebrate with confetti & fireworks
      triggerPatrioticConfetti();
      triggerFireworks();
      setPendingAction(null);
    }
  };

  const currentPreset = GREETING_PRESETS[presetIndex] || GREETING_PRESETS[0];
  const filteredPresets = GREETING_PRESETS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#002e13] text-white font-sans selection:bg-white selection:text-[#00401a] relative overflow-x-hidden antialiased flex flex-col justify-between">
      
      <div>
        {/* Background Visual Layer */}
        <BackgroundEffects />

        {/* Top Header */}
        <header className="relative z-20 w-full pt-3 pb-2 px-4 flex items-center justify-between max-w-md mx-auto border-b border-white/10">
          <div className="flex items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg"
              alt="14 August Pakistan Logo"
              className="w-8 h-5 object-cover rounded-sm drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
            />
            <div>
              <h1 className="text-xs font-extrabold text-white tracking-wide flex items-center gap-1">
                <span>Jashn-e-Azadi</span>
                <span className="text-green-300 font-black">14 August</span>
              </h1>
              <p className="text-[9px] text-green-300 font-mono tracking-wider">PAKISTAN ZINDABAD 🇵🇰</p>
            </div>
          </div>
        </header>

        {/* Real-Time Countdown Section (August 14) */}
        <CountdownTimer />

        {/* Middle Banner Ad (320x50) directly below countdown */}
        <AdsterraBanner type="middle_320x50" />

        {/* Main Content Area */}
        <main className="relative z-10 max-w-md mx-auto px-4 pb-4 flex flex-col items-center">
          
          {/* Dynamic Festive Greeting Hero */}
          <GreetingHero
            senderName={senderName}
            dynamicHeading={dynamicHeading}
          />

          {/* VIEW SENDER MESSAGE SECTION (If link was shared) */}
          {isSharedLinkLoaded && (
            <div className="w-full animate-fade-in">
              {/* Personalized Wish Message Card */}
              <PersonalizedMessageCard
                senderName={senderName}
                preset={currentPreset}
                onCelebrate={() => {
                  triggerPatrioticConfetti();
                  triggerFireworks();
                }}
              />

              {/* Urdu Calligraphy Card */}
              <UrduCalligraphyCard />

              {/* Sharing & Copy Section */}
              <ShareButton
                senderName={senderName}
                shareUrl={generatedUrl || (typeof window !== 'undefined' ? window.location.href : '')}
                onShareClick={handleShareClick}
              />
              
              {/* Mandatory Prominent Button: "Aap Bhi Apna Paigham Banayein" */}
              <div className="my-5 p-4 bg-gradient-to-r from-amber-500/20 via-green-500/20 to-emerald-500/20 rounded-2xl border-2 border-green-400/50 backdrop-blur-xl text-center shadow-2xl">
                <p className="text-xs font-black text-yellow-300 uppercase tracking-wider mb-2">
                  ✨ Aap Bhi Apne Naam Ka Link Banayein ✨
                </p>
                <button
                  id="create-own-link-btn"
                  type="button"
                  onClick={handleOpenCreator}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-extrabold text-base shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/40 cursor-pointer animate-bounce"
                >
                  <PlusCircle className="w-5 h-5 text-yellow-300" />
                  <span>Apna Paigham Banayein ➡️</span>
                </button>
              </div>
            </div>
          )}

          {/* UNIFIED CREATOR FORM */}
          {showCreatorForm && (
            <div ref={creatorFormRef} className="w-full my-4 p-5 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg" alt="Pakistan Flag" className="w-6 h-4 object-cover rounded-xs" />
                <h2 className="text-base font-extrabold text-white">Apna Naam Aur Paigham Banayein</h2>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Input Name */}
                <div>
                  <label htmlFor="user-name-input" className="block text-xs font-bold text-green-300 uppercase tracking-widest mb-1 ml-0.5">
                    Aap Ka Naam
                  </label>
                  <input
                    id="user-name-input"
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Yahan apna naam likhein..."
                    className="w-full px-4 py-3 bg-black/40 border border-white/25 focus:border-green-400 rounded-xl text-white placeholder:text-white/50 outline-none transition-all font-semibold text-sm backdrop-blur-md"
                  />

                  {/* Fast Emoji Buttons */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[11px] text-white/70 font-medium">Fast Emoji:</span>
                    {['🇵🇰', '💚', '✨', '⭐', '🔥'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiAdd(emoji)}
                        className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 text-xs hover:bg-white/20 transition-colors cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Category Tabs */}
                <div>
                  <label className="block text-xs font-bold text-green-300 uppercase tracking-widest mb-1.5 ml-0.5">
                    Paigham Select Karein
                  </label>
                  
                  <div className="grid grid-cols-3 gap-1 p-1 bg-black/30 rounded-xl border border-white/15 mb-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory('everyone');
                        const first = GREETING_PRESETS.find((p) => p.category === 'everyone');
                        if (first) setSelectedPresetId(first.id);
                      }}
                      className={`py-2 px-1 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeCategory === 'everyone'
                          ? 'bg-white text-[#00401a] shadow-md'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>Sab Ke Liye</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory('friends');
                        const first = GREETING_PRESETS.find((p) => p.category === 'friends');
                        if (first) setSelectedPresetId(first.id);
                      }}
                      className={`py-2 px-1 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeCategory === 'friends'
                          ? 'bg-white text-[#00401a] shadow-md'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span>Doston Ke Liye</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory('family');
                        const first = GREETING_PRESETS.find((p) => p.category === 'family');
                        if (first) setSelectedPresetId(first.id);
                      }}
                      className={`py-2 px-1 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeCategory === 'family'
                          ? 'bg-white text-[#00401a] shadow-md'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                      <span>Family Ke Liye</span>
                    </button>
                  </div>

                  {/* Presets List */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {filteredPresets.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => setSelectedPresetId(preset.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedPresetId === preset.id
                            ? 'bg-white/20 border-green-400 text-white shadow-md backdrop-blur-xl'
                            : 'bg-black/20 border-white/10 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-green-300">{preset.title}</p>
                          {selectedPresetId === preset.id && <CheckCircle className="w-4 h-4 text-green-400" />}
                        </div>
                        <p className="text-xs text-white/90 line-clamp-2 mt-1 leading-relaxed">
                          "{preset.romanUrdu}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  id="main-generate-btn"
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black text-base shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 border border-white/40 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                  <span>Apna Paigham Banayein</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      <div>
        {/* Bottom Banner Ad (468x60) directly above footer */}
        <AdsterraBanner type="bottom_468x60" />

        {/* Footer at the very bottom */}
        <Footer />
      </div>

      {/* 5-Second Rewarded Ad Modal */}
      <TimerModal
        isOpen={isTimerModalOpen}
        userName={pendingName || senderName}
        title={timerModalTitle}
        onClose={() => setIsTimerModalOpen(false)}
        onProceed={handleTimerModalProceed}
      />

    </div>
  );
}
