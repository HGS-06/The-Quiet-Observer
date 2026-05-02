import { JournalEntry, TimeCapsule } from './types';

export const MOCK_ENTRIES: JournalEntry[] = [];

export const MOCK_CAPSULES: TimeCapsule[] = [
  {
    id: 'c1',
    title: 'Initial Reflection',
    sealedDate: new Date().toLocaleDateString(),
    unlockDate: 'May 01, 2026',
    isUnlocked: false,
    theme: '#Growth',
    description: 'A message for the future.',
  },
];

export const MOOD_TREND_DATA = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 70 },
  { name: 'Wed', value: 50 },
  { name: 'Thu', value: 65 },
  { name: 'Fri', value: 85 },
  { name: 'Sat', value: 60 },
  { name: 'Sun', value: 75 },
];

export const MOOD_DISTRIBUTION = [
  { name: 'Calm', value: 45, color: 'bg-primary' },
  { name: 'Joy', value: 75, color: 'bg-secondary' },
  { name: 'Focus', value: 30, color: 'bg-tertiary' },
  { name: 'Quiet', value: 20, color: 'bg-primary/60' },
  { name: 'Stress', value: 15, color: 'bg-red-400' },
];
