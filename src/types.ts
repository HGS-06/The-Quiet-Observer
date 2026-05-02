export type Mood = 'calm' | 'joy' | 'melancholy' | 'energy' | 'balance' | 'inspired' | 'tired' | 'grounded' | 'stressed';

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: Mood;
  tags: string[];
  wordCount: number;
  readTime: number;
}

export interface TimeCapsule {
  id: string;
  title: string;
  sealedDate: string;
  unlockDate: string;
  isUnlocked: boolean;
  theme: string;
  description: string;
}

export type Screen = 'LOCK' | 'CHRONICLE' | 'WRITING' | 'INSIGHTS' | 'CAPSULES' | 'REFRAMING' | 'BREATHING' | 'PROFILE' | 'SETTINGS' | 'ABOUT' | 'PRIVACY';
