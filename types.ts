export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export enum Mood {
  JOYFUL = 'JOYFUL',
  CALM = 'CALM',
  NEUTRAL = 'NEUTRAL',
  LOW = 'LOW',
  ANXIOUS = 'ANXIOUS'
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: Mood;
  title: string;
  preview: string;
}

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold?: number;
  exhale: number;
  holdOut?: number;
  color: string;
}
