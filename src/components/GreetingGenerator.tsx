import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Loader2, ArrowRight, Users, Heart, User } from 'lucide-react';
import { GREETING_PRESETS } from '../utils/presets';
import { encodeGreeting, buildShareUrl } from '../utils/encoder';
import { saveGreetingToDatabase } from '../services/supabase';
import { triggerPatrioticConfetti } from '../utils/confetti';

interface GreetingGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkGenerated: (url: string, name: string, presetIndex: number) => void;
}

export const GreetingGenerator: React.FC<GreetingGeneratorProps> = ({
  isOpen,
  onClose,
  onLinkGenerated,
}) => {
  const [name, setName] = useState('');
  const [activeCategory, setActiveCategory] = useState<'everyone' | 'friends' | 'family'>('everyone');
  const [selectedPresetId, setSelectedPresetId] = useState<number>(1);
  
  // Link generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState('');

  if (!isOpen) return null;

  const filteredPresets = GREETING_PRESETS.filter((p) => p.category === activeCategory);

  const handleEmojiAdd = (emoji: string) => {
    setName((prev) => prev + emoji);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsGenerating(true);
    setProgressText('Packaging your patriotic greeting... 🇵🇰');

    // Fast & intelligent 1-second process
    await new Promise((res) => setTimeout(res, 600));
    setProgressText('Generating custom share link... ✨');
    await new Promise((res) => setTimeout(res, 600));

    const selectedIdx = GREETING_PRESETS.findIndex((p) => p.id === selectedPresetId);
    const validIdx = selectedIdx >= 0 ? selectedIdx : 0;

    const encodedId = encodeGreeting(name.trim(), validIdx);
    const shareUrl = buildShareUrl(encodedId);

    // Save to DB / Local Storage
    await saveGreetingToDatabase({
      id: encodedId,
      senderName: name.trim(),
      customMsgIndex: validIdx,
    });

    setIsGenerating(false);
    triggerPatrioticConfetti();
    onLinkGenerated(shareUrl, name.trim(), validIdx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        id="customize-modal-card"
        className="w-full max-w-md bg-[#002e13]/95 backdrop-blur-2xl border-t-2 sm:border-2 border-white/20 rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg" alt="Pakistan Flag" className="w-10 h-6 object-cover rounded-sm shadow-sm" />
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Apna Naam Likhein</h2>
            <p className="text-xs text-green-300">Create & Share Jashn-e-Azadi Card</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Input Name */}
          <div>
            <label htmlFor="user-name-input" className="block text-xs font-semibold text-green-300 uppercase tracking-widest mb-1.5 ml-0.5">
              Aap Ka Naam (Your Name)
            </label>
            <input
              id="user-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Maslan: Imran, Ayesha, Hamza..."
              disabled={isGenerating}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 focus:border-green-400 rounded-2xl text-white placeholder:text-white/40 outline-none transition-all font-semibold text-base backdrop-blur-md"
            />

            {/* Emoji Shortcuts */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-white/60">Quick Emoji:</span>
              {['🇵🇰', '💚', '✨', '⭐', '🔥'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiAdd(emoji)}
                  className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 text-xs hover:bg-white/20 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Template Category Selector Tabs (Friends, Family, Everyone) */}
          <div>
            <label className="block text-xs font-semibold text-green-300 uppercase tracking-widest mb-2 ml-0.5">
              Paigham Select Karein (Choose Template)
            </label>
            
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10 mb-3">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('everyone');
                  const first = GREETING_PRESETS.find((p) => p.category === 'everyone');
                  if (first) setSelectedPresetId(first.id);
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  activeCategory === 'everyone'
                    ? 'bg-white text-[#00401a] shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Everyone</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveCategory('friends');
                  const first = GREETING_PRESETS.find((p) => p.category === 'friends');
                  if (first) setSelectedPresetId(first.id);
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  activeCategory === 'friends'
                    ? 'bg-white text-[#00401a] shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Friends</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveCategory('family');
                  const first = GREETING_PRESETS.find((p) => p.category === 'family');
                  if (first) setSelectedPresetId(first.id);
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  activeCategory === 'family'
                    ? 'bg-white text-[#00401a] shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Family</span>
              </button>
            </div>

            {/* Category Presets List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => !isGenerating && setSelectedPresetId(preset.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedPresetId === preset.id
                      ? 'bg-white/20 border-white/40 text-white shadow-lg backdrop-blur-xl'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-green-300">{preset.title}</p>
                    {selectedPresetId === preset.id && <CheckCircle className="w-4 h-4 text-green-300" />}
                  </div>
                  <p className="text-xs text-white/90 line-clamp-2 mt-1">
                    "{preset.romanUrdu}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit / Generation Loading State */}
          {isGenerating ? (
            <div className="py-4 text-center space-y-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Loader2 className="w-7 h-7 text-green-300 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-white">{progressText}</p>
            </div>
          ) : (
            <button
              id="generate-link-btn"
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-white text-[#00401a] font-black text-base shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/40 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 text-[#00401a]" />
              <span>Generate Share Link</span>
              <ArrowRight className="w-5 h-5 text-[#00401a]" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
