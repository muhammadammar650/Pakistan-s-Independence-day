import { useState, useEffect } from 'react';
import { BackgroundEffects } from './components/BackgroundEffects';
import { GreetingHero } from './components/GreetingHero';
import { PersonalizedMessageCard } from './components/PersonalizedMessageCard';
import { UrduCalligraphyCard } from './components/UrduCalligraphyCard';
import { GreetingGenerator } from './components/GreetingGenerator';
import { GeneratedLink } from './components/GeneratedLink';
import { ShareButton } from './components/ShareButton';
import { MonetagAdMockup } from './components/MonetagAdMockup';
import { Footer } from './components/Footer';
import { parseCurrentLocation } from './utils/encoder';
import { GREETING_PRESETS } from './utils/presets';
import { triggerPatrioticConfetti } from './utils/confetti';
import { fetchGreetingFromDatabase } from './services/supabase';

export default function App() {
  const [senderName, setSenderName] = useState<string>('');
  const [presetIndex, setPresetIndex] = useState<number>(0);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check path or query parameters on mount
    const initialGreeting = parseCurrentLocation();
    if (initialGreeting) {
      if (initialGreeting.senderName) {
        setSenderName(initialGreeting.senderName);
        const title = `${initialGreeting.senderName} — 14 August Mubarak 🇵🇰`;
        document.title = title;
        updateMetaTags(title, `Jashn-e-Azadi greeting from ${initialGreeting.senderName}. Click to open!`);
      }
      if (typeof initialGreeting.customMsgIndex === 'number') {
        setPresetIndex(initialGreeting.customMsgIndex);
      }

      // Try fetching async from database if ID was passed
      if (initialGreeting.id) {
        fetchGreetingFromDatabase(initialGreeting.id).then((dbData) => {
          if (dbData && dbData.senderName) {
            setSenderName(dbData.senderName);
            const title = `${dbData.senderName} — 14 August Mubarak 🇵🇰`;
            document.title = title;
            updateMetaTags(title, `Jashn-e-Azadi greeting from ${dbData.senderName}. Click to open!`);
            if (typeof dbData.customMsgIndex === 'number') {
              setPresetIndex(dbData.customMsgIndex);
            }
          }
        });
      }

      setTimeout(() => {
        triggerPatrioticConfetti();
      }, 800);
    } else {
      const defaultTitle = '14 August Jashn-e-Azadi Pakistan Mubarak 🇵🇰';
      document.title = defaultTitle;
      updateMetaTags(defaultTitle, 'Create and share your personalized Jashn-e-Azadi greeting card!');
    }
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
        {/* Patriotic Hero Section with 3D Rotating Flag */}
        <GreetingHero
          senderName={senderName}
          onCustomizeClick={() => setIsGeneratorOpen(true)}
        />

        {/* Monetag Ad Mockup */}
        <MonetagAdMockup />

        {/* Personalized Message Card in Roman Urdu */}
        <PersonalizedMessageCard
          senderName={senderName}
          preset={currentPreset}
          onCelebrate={handleCelebrateClick}
        />

        {/* Monetag Ad Mockup */}
        <MonetagAdMockup />

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
        />

        {/* Monetag Ad Mockup */}
        <MonetagAdMockup />

        {/* Customization Drawer / Modal Form with Category Tabs */}
        <GreetingGenerator
          isOpen={isGeneratorOpen}
          onClose={() => setIsGeneratorOpen(false)}
          onLinkGenerated={handleLinkGenerated}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
