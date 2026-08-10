export interface GreetingData {
  id: string;
  senderName: string;
  customMsgIndex?: number;
  customNote?: string;
  createdAt?: string;
}

export interface PresetMessage {
  id: number;
  category: 'everyone' | 'friends' | 'family';
  categoryName: string;
  title: string;
  romanUrdu: string;
  urduText: string;
  englishTranslation: string;
}

export type CelebrationTheme = 'emerald' | 'gold' | 'flag';
