import { UserStats, KanaMastery } from '../types';

const STORAGE_KEY = 'kanadrill_user_stats_v1';

const DEFAULT_STATS: UserStats = {
  totalAnswered: 0,
  totalCorrect: 0,
  bestStreak: 0,
  currentStreak: 0,
  bruteForceLevel: 1, // Start at Level 1 (A-Row)
  kanaMasteryMap: {},
  wordsMastered: [],
};

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_STATS;
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      kanaMasteryMap: parsed.kanaMasteryMap || {},
      wordsMastered: parsed.wordsMastered || [],
    };
  } catch (e) {
    console.error('Failed to load stats:', e);
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

export function resetAllUserProgress(): UserStats {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_STATS;
}

// Update single kana mastery record
export function recordKanaAnswer(
  stats: UserStats,
  key: string, // e.g. "hiragana:ka" or "katakana:ka"
  isCorrect: boolean,
  masteryThreshold = 4
): { nextStats: UserStats; justMastered: boolean } {
  const current = stats.kanaMasteryMap[key] || {
    correctCount: 0,
    incorrectCount: 0,
    currentStreak: 0,
    mastered: false,
  };

  let justMastered = false;
  let newMastery: KanaMastery;

  if (isCorrect) {
    const nextStreak = current.currentStreak + 1;
    const isNowMastered = current.mastered || nextStreak >= masteryThreshold;
    if (isNowMastered && !current.mastered) {
      justMastered = true;
    }
    newMastery = {
      correctCount: current.correctCount + 1,
      incorrectCount: current.incorrectCount,
      currentStreak: nextStreak,
      mastered: isNowMastered,
      lastSeen: Date.now(),
    };
  } else {
    newMastery = {
      correctCount: current.correctCount,
      incorrectCount: current.incorrectCount + 1,
      currentStreak: 0,
      mastered: current.mastered, // keep mastered status once unlocked or soften it
      lastSeen: Date.now(),
    };
  }

  const nextCurrentStreak = isCorrect ? stats.currentStreak + 1 : 0;
  const nextBestStreak = Math.max(stats.bestStreak, nextCurrentStreak);

  const nextStats: UserStats = {
    ...stats,
    totalAnswered: stats.totalAnswered + 1,
    totalCorrect: stats.totalCorrect + (isCorrect ? 1 : 0),
    currentStreak: nextCurrentStreak,
    bestStreak: nextBestStreak,
    kanaMasteryMap: {
      ...stats.kanaMasteryMap,
      [key]: newMastery,
    },
  };

  saveUserStats(nextStats);
  return { nextStats, justMastered };
}
