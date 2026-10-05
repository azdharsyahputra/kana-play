export type KanaScript = 'hiragana' | 'katakana' | 'mixed';

export type DrillDirection = 'kana_to_romaji' | 'romaji_to_kana'; // Normal vs Reverse

export type AppTab = 'home' | 'brute-force' | 'free-drill' | 'word-drill' | 'matrix' | 'reference';

export interface KanaItem {
  id: string; // e.g. "a", "ka", "shi", "kya"
  romaji: string;
  hiragana: string;
  katakana: string;
  rowId: string;
  groupType: 'main' | 'dakuten' | 'handakuten' | 'youon';
  orderIndex: number;
}

export interface KanaRow {
  id: string;
  name: string;
  label: string; // e.g. "A Row (あ・い・う・え・お)"
  groupType: 'main' | 'dakuten' | 'handakuten' | 'youon';
  items: KanaItem[];
  level: number; // Tier sequence in brute force mode
}

export interface WordItem {
  id: string;
  kana: string; // Hiragana or Katakana word
  kanji?: string;
  romaji: string;
  english: string;
  indonesian: string;
  category: 'food' | 'animals' | 'daily' | 'basics' | 'anime' | 'jlpt5' | 'nature' | 'travel';
  script: 'hiragana' | 'katakana' | 'mixed';
  difficulty: 1 | 2 | 3;
}

export interface KanaMastery {
  correctCount: number;
  incorrectCount: number;
  currentStreak: number;
  mastered: boolean; // reaches mastery threshold
  lastSeen?: number;
}

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  bestStreak: number;
  currentStreak: number;
  bruteForceLevel: number; // Current unlocked level (1-indexed)
  kanaMasteryMap: Record<string, KanaMastery>; // key is e.g. "hiragana:ka" or "katakana:ka"
  wordsMastered: string[];
}
