export type LeaderboardSortOption =
  | 'points'     // Total Poin (EXP akumulasi)
  | 'correct'    // Paling Sering Benar (totalCorrect)
  | 'answered'   // Paling Sering Main / Keaktifan (totalAnswered)
  | 'streak'     // Rekor Combo Streak (bestStreak)
  | 'accuracy';  // Persentase Ketepatan Akurasi

export interface LeaderboardPlayer {
  id: string;
  name: string;
  avatar: string; // Emoji avatar e.g. '🦊', '⚡', '🌸', '🥷', '👑'
  title: string;  // Julukan/Gelar e.g. 'Master Kana', 'Sensei', 'Rookie'
  isUser: boolean;
  totalPoints: number;
  totalCorrect: number;
  totalAnswered: number;
  accuracy: number;
  bestStreak: number;
  level: number;
  badge?: string;
  tagline?: string;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  customTitle?: string;
}

