
export enum AppState {
  HOME = 'HOME',
  LEARN = 'LEARN',
  PRACTICE = 'PRACTICE',
  TEST = 'TEST',
  AI_GEN = 'AI_GEN',
  RESULTS = 'RESULTS'
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Home Row' | 'Top Row' | 'Bottom Row' | 'Numbers' | 'Symbols' | 'Advanced';
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  timeTaken: number;
  correctChars: number;
  totalChars: number;
  mistakes: number;
}

export interface HistoryItem extends TypingStats {
  id: string;
  date: string;
  source: string;
}
