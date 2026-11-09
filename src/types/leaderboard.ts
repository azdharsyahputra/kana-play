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
  isOnline?: boolean;
  lastSeen?: number;
  isCustomFriend?: boolean;
}

export interface PlayerProfile {
  id?: string;
  name: string;
  avatar: string;
  tagline?: string;
  customTitle?: string;
}

export interface OnlineSyncPayload {
  type: 'PLAYER_UPDATE' | 'DISCOVERY_REQUEST' | 'PLAYER_LEAVE';
  player: {
    id: string;
    name: string;
    avatar: string;
    totalPoints: number;
    totalCorrect: number;
    totalAnswered: number;
    accuracy: number;
    bestStreak: number;
    level: number;
    title: string;
    tagline?: string;
    updatedAt: number;
  };
  room?: string;
}

