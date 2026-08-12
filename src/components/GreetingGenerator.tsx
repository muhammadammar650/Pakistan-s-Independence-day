import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, ArrowRight, Users, Heart, User } from 'lucide-react';
import { GREETING_PRESETS } from '../utils/presets';

interface GreetingGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNameAndPreset: (name: string, presetIndex: number) => void;
}

export const GreetingGenerator: React.FC<GreetingGeneratorProps> = ({
  isOpen,
  onClose,
  onSubmitNameAndPreset,
}) => {
  const [name, setName] = useState('');
  const [activeCategory, setActiveCategory] = useState<'everyone' | 'friends' | 'family'>('everyone');
  const [selectedPresetId, setSelectedPresetId] = useState<number>(1);

  if (!isOpen) return null;

  const filteredPresets = GREETING_PRESETS.filter((p) => p.category === activeCategory);

  const handleEmojiAdd = (emoji: string) => {
    setName((prev) => prev + emoji);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert("Apna naam likhein!");
      return;
    }

    const selectedIdx = GREETING_PRESETS.findIndex((p) => p.id === selectedPresetId);
    const validIdx = selectedIdx >= 0 ? selectedIdx : 0;

    onSubmitNameAndPreset(trimmedName, validIdx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        id="customize-modal-card"
        className="w-full max-w-md bg-[#002e13]/95 backdrop-blur-2xl border-t-2 sm:border-2 border-white/20 rounded-t-[32px] sm:rounded-[32px] p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto text-white"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg" alt="Pakistan Flag" className="w-8 h-5 object-cover rounded-sm shadow-sm" />
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">Apna Naam Likhein</h2>
            <p className="text-xs text-green-300">14 August Paigham Banayein</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Input Name */}
          <div>
            <label htmlFor="user-name-input" className="block text-xs font-semibold text-green-300 uppercase tracking-widest mb-1 ml-0.5">
              Aap Ka Naam
            </label>
            <input
              id="user-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Yahan apna naam likhein..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 focus:border-green-400 rounded-xl text-white placeholder:text-white/50 outline-none transition-all font-semibold text-sm backdrop-blur-md"
            />

            {/* Emoji Shortcuts */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] text-white/60">Fast Emoji:</span>
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

          {/* Template Category Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-green-300 uppercase tracking-widest mb-1.5 ml-0.5">
              Paigham Select Karein
            </label>
            
            <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-xl border border-white/10 mb-2">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('everyone');
                  const first = GREETING_PRESETS.find((p) => p.category === 'everyone');
                  if (first) setSelectedPresetId(first.id);
                }}
                className={`py-1.5 px-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeCategory === 'everyone'
                    ? 'bg-white text-[#00401a] shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Sab Ke Liye</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveCategory('friends');
                  const first = GREETING_PRESETS.find((p) => p.category === 'friends');
                  if (first) setSelectedPresetId(first.id);
                }}
                className={`py-1.5 px-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeCategory === 'friends'
                    ? 'bg-white text-[#00401a] shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Doston Ke Liye</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveCategory('family');
                  const first = GREETING_PRESETS.find((p) => p.category === 'family');
                  if (first) setSelectedPresetId(first.id);
                }}
                className={`py-1.5 px-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeCategory === 'family'
                    ? 'bg-white text-[#00401a] shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Ghar Walon Ke Liye</span>
              </button>
            </div>

            {/* Category Presets List */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedPresetId === preset.id
                      ? 'bg-white/20 border-white/40 text-white shadow-md backdrop-blur-xl'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-green-300">{preset.title}</p>
                    {selectedPresetId === preset.id && <CheckCircle className="w-4 h-4 text-green-300" />}
                  </div>
                  <p className="text-xs text-white/90 line-clamp-2 mt-0.5">
                    "{preset.romanUrdu}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            id="generate-link-btn"
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-extrabold text-sm shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/40 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Apna Paigham Banayein</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};
