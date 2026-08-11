import { useState, useEffect } from 'react';
import { BackgroundEffects } from './components/BackgroundEffects';
import { GreetingHero } from './components/GreetingHero';
import { PersonalizedMessageCard } from './components/PersonalizedMessageCard';
import { UrduCalligraphyCard } from './components/UrduCalligraphyCard';
import { GreetingGenerator } from './components/GreetingGenerator';
import { GeneratedLink } from './components/GeneratedLink';
import { ShareButton } from './components/ShareButton';
import { Footer } from './components/Footer';
import { AdPlacement } from './components/AdPlacement';
import { RewardedAdModal } from './components/RewardedAdModal';
import { parseCurrentLocation } from './utils/encoder';
import { GREETING_PRESETS } from './utils/presets';
import { triggerPatrioticConfetti } from './utils/confetti';
import { getGreeting } from './services/supabase';

export default function App() {
  const [senderName, setSenderName] = useState<string>('');
  const [presetIndex, setPresetIndex] = useState<number>(0);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);
  const [isRewardedModalOpen, setIsRewardedModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const handleActionWithAd = (action: () => void) => {
    setPendingAction(() => action);
    setIsRewardedModalOpen(true);
  };
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const initGreeting = async () => {
      let title = '14 August Jashn-e-Azadi Pakistan Mubarak 🇵🇰';
      let desc = 'Create and share your personalized Jashn-e-Azadi greeting card!';

      const match = window.location.pathname.match(/\/g\/([^/]+)/);
      if (match && match[1]) {
        const routeId = match[1];
        try {
          const dbData = await getGreeting(routeId);
          if (dbData) {
            setSenderName(dbData.name);
            setPresetIndex(dbData.presetIndex);
            title = `${dbData.name} — 14 August Mubarak 🇵🇰`;
            desc = `Jashn-e-Azadi greeting from ${dbData.name}. Click to open!`;
            setIsLoading(false);
            
            setTimeout(() => {
              triggerPatrioticConfetti();
            }, 800);
          } else {
            // Fallback for legacy local base64 IDs
            const legacyGreeting = parseCurrentLocation();
            if (legacyGreeting && legacyGreeting.senderName) {
              setSenderName(legacyGreeting.senderName);
              setPresetIndex(legacyGreeting.customMsgIndex);
              title = `${legacyGreeting.senderName} — 14 August Mubarak 🇵🇰`;
              desc = `Jashn-e-Azadi greeting from ${legacyGreeting.senderName}. Click to open!`;
              setIsLoading(false);
              
              setTimeout(() => {
                triggerPatrioticConfetti();
              }, 800);
            } else {
              setNotFound(true);
              setIsLoading(false);
            }
          }
        } catch {
          setNotFound(true);
          setIsLoading(false);
        }
      } else {
        // Query param check ?n=...
        const queryGreeting = parseCurrentLocation();
        if (queryGreeting && queryGreeting.senderName) {
          setSenderName(queryGreeting.senderName);
          setPresetIndex(queryGreeting.customMsgIndex);
          title = `${queryGreeting.senderName} — 14 August Mubarak 🇵🇰`;
          desc = `Jashn-e-Azadi greeting from ${queryGreeting.senderName}. Click to open!`;
          
          setTimeout(() => {
            triggerPatrioticConfetti();
          }, 800);
        }
        setIsLoading(false);
      }
      
      document.title = title;
      updateMetaTags(title, desc);
    };

    initGreeting();
  }, []);

  const updateMetaTags = (title: string, description: string) => {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDesc) ogDesc.setAttribute('content', description);
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    if (twitterDesc) twitterDesc.setAttribute('content', description);
  };

  const currentPreset = GREETING_PRESETS[presetIndex] || GREETING_PRESETS[0];

  const handleLinkGenerated = (url: string, name: string, selectedIdx: number) => {
    setGeneratedUrl(url);
    setSenderName(name);
    setPresetIndex(selectedIdx);
    const title = `${name} — 14 August Mubarak 🇵🇰`;
    document.title = title;
    updateMetaTags(title, `Jashn-e-Azadi greeting from ${name}. Click to open!`);
  };

  const handleCelebrateClick = () => {
    triggerPatrioticConfetti();
  };

  return (
    <div className="min-h-screen bg-[#002e13] text-white font-sans selection:bg-white selection:text-[#00401a] relative overflow-x-hidden antialiased">
      
      {/* Background Visual Layer with 3D Effects */}
      <BackgroundEffects />

      {/* Top Header Navbar with Website Logo */}
      <header className="relative z-20 w-full pt-4 pb-2 px-4 flex items-center justify-between max-w-md mx-auto border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg"
            alt="14 August Pakistan Logo"
            className="w-9 h-6 object-cover rounded-sm drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
          />
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
              <span>Jashn-e-Azadi</span>
              <span className="text-green-300 font-black">14 August</span>
            </h1>
            <p className="text-[10px] text-green-300 font-mono tracking-wider">PAKISTAN ZINDABAD 🇵🇰</p>
          </div>
        </div>
      </header>

      {/* Main Content Area - Mobile First Centered Layout */}
      <main className="relative z-10 max-w-md mx-auto px-4 pb-6 flex flex-col items-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white/80 font-medium">Loading greeting...</p>
          </div>
        ) : notFound ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Greeting Not Found</h2>
            <p className="text-white/80 mb-6">The link you followed might be invalid or expired.</p>
            <button
              onClick={() => {
                setNotFound(false);
                setIsGeneratorOpen(true);
              }}
              className="py-3 px-6 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all"
            >
              Create New Greeting
            </button>
          </div>
        ) : (
          <>
            {/* Patriotic Hero Section with 3D Rotating Flag */}
            <GreetingHero
              senderName={senderName}
              onCustomizeClick={() => handleActionWithAd(() => setIsGeneratorOpen(true))}
            />

            {/* Personalized Message Card in Roman Urdu */}
            <PersonalizedMessageCard
              senderName={senderName}
              preset={currentPreset}
              onCelebrate={handleCelebrateClick}
            />

            {/* Urdu Calligraphy Script Box */}
            <UrduCalligraphyCard />

            {/* Generated Link Card (Shows after customizing) */}
            {generatedUrl && (
              <GeneratedLink
                shareUrl={generatedUrl}
                senderName={senderName}
                onOpenShare={() => {
                  const shareSection = document.getElementById('share-section');
                  shareSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            )}

            {/* Share Section Buttons */}
            <ShareButton
              senderName={senderName}
              shareUrl={generatedUrl || (typeof window !== 'undefined' ? window.location.href : '')}
              onActionWrapper={handleActionWithAd}
            />

            {/* Banner Ad Area */}
            <AdPlacement type="native" />
            {/* Rewarded Ad Placement */}
            <AdPlacement type="rewarded" />
          </>
        )}

        {/* Customization Drawer / Modal Form with Category Tabs */}
        <GreetingGenerator
          isOpen={isGeneratorOpen}
          onClose={() => setIsGeneratorOpen(false)}
          onLinkGenerated={handleLinkGenerated}
        />
        <RewardedAdModal 
          isOpen={isRewardedModalOpen} 
          onClose={() => {
            setIsRewardedModalOpen(false);
            if (pendingAction) {
              pendingAction();
              setPendingAction(null);
            }
          }} 
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
