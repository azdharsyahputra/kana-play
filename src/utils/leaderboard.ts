import { UserStats } from '../types';
import { LeaderboardPlayer, LeaderboardSortOption, PlayerProfile } from '../types/leaderboard';

const PROFILE_STORAGE_KEY = 'kanadrill_player_profile_v1';
const CUSTOM_PLAYERS_STORAGE_KEY = 'kanadrill_custom_players_v1';

export const AVATAR_OPTIONS = [
  '🦊', '⚡', '🌸', '🥷', '👑', '🍙', '🤖', '🐱',
  '🌟', '🎓', '🔥', '🐉', '🎯', '🍣', '🥋', '🎌',
];

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Pemain Kana',
  avatar: '🦊',
};

// Seeded rival learners (Classmates & Japanese learners)
const DEFAULT_RIVALS: Omit<LeaderboardPlayer, 'isUser'>[] = [
  {
    id: 'rival_kenji',
    name: 'Kenji (N3 Grinder)',
    avatar: '🦊',
    title: 'Speed Drill Master 🌪️',
    totalPoints: 3650,
    totalCorrect: 210,
    totalAnswered: 225,
    accuracy: 93,
    bestStreak: 28,
    level: 15,
    badge: '🔥 28 Combo Streak',
    tagline: 'Latihan 30 menit setiap bangun tidur!',
  },
  {
    id: 'rival_sakura',
    name: 'Sakura_Chan',
    avatar: '🌸',
    title: 'Kana Samurai ⚔️',
    totalPoints: 3120,
    totalCorrect: 185,
    totalAnswered: 192,
    accuracy: 96,
    bestStreak: 31,
    level: 14,
    badge: '🎯 96% Akurasi',
    tagline: 'Hafal hiragana & katakana sambil denger J-Pop',
  },
  {
    id: 'rival_budi',
    name: 'Budi Sensei',
    avatar: '👑',
    title: 'Sensei Tingkat Lanjut 🎓',
    totalPoints: 2850,
    totalCorrect: 172,
    totalAnswered: 175,
    accuracy: 98,
    bestStreak: 45,
    level: 13,
    badge: '👑 Sensei Akurasi',
    tagline: 'Konsistensi tiap hari adalah kunci bahasa Jepang!',
  },
  {
    id: 'rival_aoi',
    name: 'Aoi_Speedrunner',
    avatar: '⚡',
    title: 'Speed Drill Master 🌪️',
    totalPoints: 2420,
    totalCorrect: 150,
    totalAnswered: 168,
    accuracy: 89,
    bestStreak: 22,
    level: 11,
    badge: '⚡ Turbo Keypad',
    tagline: 'Target 100 kana dalam 3 menit!',
  },
  {
    id: 'rival_tanaka',
    name: 'Tanaka_San',
    avatar: '🍙',
    title: 'Kana Samurai ⚔️',
    totalPoints: 2150,
    totalCorrect: 138,
    totalAnswered: 145,
    accuracy: 95,
    bestStreak: 24,
    level: 10,
    badge: '🍙 Tokyo Native',
    tagline: 'Ayo semangat semua (Ganbatte)!',
  },
  {
    id: 'rival_rizky',
    name: 'Rizky_Wibu',
    avatar: '🥷',
    title: 'Kana Samurai ⚔️',
    totalPoints: 1890,
    totalCorrect: 122,
    totalAnswered: 142,
    accuracy: 86,
    bestStreak: 19,
    level: 9,
    badge: '🥷 Anime Hunter',
    tagline: 'Biar bisa nonton anime tanpa nunggu subtitel!',
  },
  {
    id: 'rival_emi',
    name: 'Emi_Sensei',
    avatar: '🎓',
    title: 'Sensei Tingkat Lanjut 🎓',
    totalPoints: 1580,
    totalCorrect: 105,
    totalAnswered: 112,
    accuracy: 94,
    bestStreak: 18,
    level: 8,
    badge: '📚 Partikel Expert',
    tagline: 'Fokus kuasai partikel wa, ka, ga, no!',
  },
  {
    id: 'rival_kaito',
    name: 'Kaito_Flash',
    avatar: '🤖',
    title: 'Katakana Trainee ⚡',
    totalPoints: 1290,
    totalCorrect: 88,
    totalAnswered: 102,
    accuracy: 86,
    bestStreak: 14,
    level: 7,
    badge: '✍️ Goresan Rapi',
    tagline: 'Urutan goresan kana jangan sampai terbalik.',
  },
  {
    id: 'rival_nadia',
    name: 'Nadia_San',
    avatar: '🐱',
    title: 'Hiragana Explorer 🍙',
    totalPoints: 960,
    totalCorrect: 70,
    totalAnswered: 82,
    accuracy: 85,
    bestStreak: 12,
    level: 5,
    badge: '🌸 Rajin Latihan',
    tagline: 'Masih suka ketuker antara Nu dan Me hehe',
  },
  {
    id: 'rival_dimas',
    name: 'Dimas_Kun',
    avatar: '🌟',
    title: 'Hiragana Explorer 🍙',
    totalPoints: 620,
    totalCorrect: 48,
    totalAnswered: 64,
    accuracy: 75,
    bestStreak: 9,
    level: 4,
    badge: '🚀 Pejuang UTS',
    tagline: 'Target nilai UTS semester ini wajib A!',
  },
  {
    id: 'rival_hana',
    name: 'Hana_Chan',
    avatar: '🎈',
    title: 'Kana Rookie 🌱',
    totalPoints: 380,
    totalCorrect: 30,
    totalAnswered: 45,
    accuracy: 67,
    bestStreak: 7,
    level: 2,
    badge: '🐣 Pemula',
    tagline: 'Baru selesai baris A, Ka, dan Sa',
  },
  {
    id: 'rival_yuto',
    name: 'Yuto_Bintang',
    avatar: '🎯',
    title: 'Kana Rookie 🌱',
    totalPoints: 210,
    totalCorrect: 18,
    totalAnswered: 30,
    accuracy: 60,
    bestStreak: 5,
    level: 1,
    badge: '✨ Semangat Baru',
    tagline: 'Mulai belajar hari ini, target bisa baca manga!',
  },
];

/**
 * Hitung total poin akumulasi pemain berdasarkan performa di game
 */
export function calculateUserPoints(stats: UserStats): number {
  const correctPoints = (stats.totalCorrect || 0) * 15;
  const streakBonus = (stats.bestStreak || 0) * 25;
  const levelBonus = Math.max(0, (stats.bruteForceLevel || 1) - 1) * 80;
  
  const masteredKanaCount = Object.values(stats.kanaMasteryMap || {}).filter(m => m.mastered).length;
  const kanaMasteryPoints = masteredKanaCount * 40;
  
  const wordsMasteredCount = (stats.wordsMastered || []).length;
  const wordsPoints = wordsMasteredCount * 30;

  return correctPoints + streakBonus + levelBonus + kanaMasteryPoints + wordsPoints;
}

/**
 * Tentukan gelar kehormatan berdasarkan poin & akurasi
 */
export function getUserTitle(points: number, accuracy: number): string {
  if (points >= 5000 && accuracy >= 90) return 'Shogun Abadi 👑';
  if (points >= 3500) return 'Sensei Tingkat Lanjut 🎓';
  if (points >= 2200) return 'Speed Drill Master 🌪️';
  if (points >= 1400) return 'Kana Samurai ⚔️';
  if (points >= 750) return 'Katakana Trainee ⚡';
  if (points >= 300) return 'Hiragana Explorer 🍙';
  return 'Kana Rookie 🌱';
}

/**
 * Ambil profil pemain dari localStorage
 */
export function loadPlayerProfile(): PlayerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      id: parsed.id,
      name: parsed.name || DEFAULT_PROFILE.name,
      avatar: parsed.avatar || DEFAULT_PROFILE.avatar,
      tagline: parsed.tagline || 'Ayo taklukkan Hiragana & Katakana!',
      customTitle: parsed.customTitle,
    };
  } catch (e) {
    console.error('Failed to load player profile:', e);
    return DEFAULT_PROFILE;
  }
}

/**
 * Simpan profil pemain ke localStorage
 */
export function savePlayerProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save player profile:', e);
  }
}

/**
 * Ambil daftar pemain custom (teman sekelas yang ditambahkan secara lokal)
 */
export function loadCustomPlayers(): LeaderboardPlayer[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_PLAYERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom players:', e);
    return [];
  }
}

/**
 * Simpan daftar pemain custom
 */
export function saveCustomPlayers(players: LeaderboardPlayer[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_PLAYERS_STORAGE_KEY, JSON.stringify(players));
  } catch (e) {
    console.error('Failed to save custom players:', e);
  }
}

/**
 * Tambah teman / rival custom
 */
export function addCustomPlayer(player: {
  name: string;
  avatar: string;
  totalPoints: number;
  totalCorrect: number;
  totalAnswered: number;
  bestStreak: number;
  level: number;
  tagline?: string;
}): LeaderboardPlayer {
  const current = loadCustomPlayers();
  const accuracy = player.totalAnswered > 0
    ? Math.round((player.totalCorrect / player.totalAnswered) * 100)
    : 100;
  
  const newPlayer: LeaderboardPlayer = {
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: player.name.trim() || 'Teman Sekelas',
    avatar: player.avatar || '🎮',
    title: getUserTitle(player.totalPoints, accuracy),
    isUser: false,
    totalPoints: player.totalPoints,
    totalCorrect: player.totalCorrect,
    totalAnswered: player.totalAnswered,
    accuracy,
    bestStreak: player.bestStreak,
    level: player.level,
    badge: '👥 Teman Sekelas',
    tagline: player.tagline || 'Latihan bersama di Kana Play!',
  };

  const updated = [newPlayer, ...current];
  saveCustomPlayers(updated);
  return newPlayer;
}

/**
 * Hapus pemain custom
 */
export function deleteCustomPlayer(id: string): void {
  const current = loadCustomPlayers();
  const updated = current.filter(p => p.id !== id);
  saveCustomPlayers(updated);
}

/**
 * Reset semua custom players ke awal
 */
export function resetCustomPlayers(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CUSTOM_PLAYERS_STORAGE_KEY);
  }
}

/**
 * Bangun seluruh daftar leaderboard dengan menggabungkan profil pemain aktif,
 * default rivals, dan custom players, kemudian diurutkan sesuai kriteria.
 */
export function buildLeaderboard(
  stats: UserStats,
  profile: PlayerProfile,
  sortBy: LeaderboardSortOption,
  onlinePlayers: LeaderboardPlayer[] = []
): {
  players: LeaderboardPlayer[];
  userRank: number;
  userPlayer: LeaderboardPlayer;
} {
  const userPoints = calculateUserPoints(stats);
  const userAccuracy = stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 100;

  const userPlayer: LeaderboardPlayer = {
    id: 'active_user',
    name: profile.name || 'Kamu (Player)',
    avatar: profile.avatar || '🦊',
    title: profile.customTitle || getUserTitle(userPoints, userAccuracy),
    isUser: true,
    totalPoints: userPoints,
    totalCorrect: stats.totalCorrect || 0,
    totalAnswered: stats.totalAnswered || 0,
    accuracy: userAccuracy,
    bestStreak: stats.bestStreak || 0,
    level: stats.bruteForceLevel || 1,
    badge: stats.bestStreak >= 20 ? '🔥 Streak Monster' : stats.totalCorrect >= 100 ? '🎯 Master 100+' : '★ Kamu',
    tagline: profile.tagline || 'Terus tingkatkan skor dan taklukkan peringkat 1!',
    isOnline: true,
  };

  const customPlayers = loadCustomPlayers();

  // Combine while avoiding duplicate IDs and prioritizing Live Online Players
  const seenIds = new Set<string>(['active_user']);
  const allPlayers: LeaderboardPlayer[] = [userPlayer];

  // 1. Live Online Players (from other devices/tabs)
  for (const op of onlinePlayers) {
    if (!seenIds.has(op.id) && !op.isUser) {
      seenIds.add(op.id);
      allPlayers.push(op);
    }
  }

  // 2. Custom Locally Added Friends
  for (const cp of customPlayers) {
    if (!seenIds.has(cp.id)) {
      seenIds.add(cp.id);
      allPlayers.push({ ...cp, isCustomFriend: true });
    }
  }

  // 3. Default Rivals (Classmates)
  for (const r of DEFAULT_RIVALS) {
    if (!seenIds.has(r.id)) {
      seenIds.add(r.id);
      allPlayers.push({ ...r, isUser: false });
    }
  }

  // Sorting logic
  allPlayers.sort((a, b) => {
    switch (sortBy) {
      case 'points':
        return b.totalPoints - a.totalPoints || b.totalCorrect - a.totalCorrect;
      case 'correct':
        return b.totalCorrect - a.totalCorrect || b.totalPoints - a.totalPoints;
      case 'answered':
        return b.totalAnswered - a.totalAnswered || b.totalPoints - a.totalPoints;
      case 'streak':
        return b.bestStreak - a.bestStreak || b.totalPoints - a.totalPoints;
      case 'accuracy':
        // Minimal 10 soal untuk masuk urutan akurasi murni
        if (a.totalAnswered < 10 && b.totalAnswered >= 10) return 1;
        if (b.totalAnswered < 10 && a.totalAnswered >= 10) return -1;
        return b.accuracy - a.accuracy || b.totalCorrect - a.totalCorrect;
      default:
        return b.totalPoints - a.totalPoints;
    }
  });

  const userRank = allPlayers.findIndex(p => p.id === 'active_user') + 1;

  return {
    players: allPlayers,
    userRank: userRank > 0 ? userRank : allPlayers.length,
    userPlayer,
  };
}

/**
 * Format teks untuk share ranking ke WhatsApp / Discord / medsos
 */
export function generateShareText(
  player: LeaderboardPlayer,
  rank: number,
  totalPlayers: number,
  sortBy: LeaderboardSortOption
): string {
  const medals = ['🥇', '🥈', '🥉'];
  const medal = rank <= 3 ? medals[rank - 1] : '🎖️';

  const sortLabel =
    sortBy === 'points' ? 'Total Poin (EXP)' :
    sortBy === 'correct' ? 'Total Jawaban Benar' :
    sortBy === 'answered' ? 'Keaktifan Latihan' :
    sortBy === 'streak' ? 'Best Streak' : 'Akurasi';

  return (
`🏆 *KANA PLAY LEADERBOARD* 🏆
${medal} Peringkat #${rank} dari ${totalPlayers} pemain!
👤 Nama: ${player.avatar} ${player.name}
🎖️ Gelar: ${player.title}
⭐ Total Poin: ${player.totalPoints.toLocaleString()} PTS
🎯 Akurasi: ${player.accuracy}% (${player.totalCorrect}/${player.totalAnswered} Soal)
🔥 Best Streak: ${player.bestStreak} berturut-turut
📈 Level: Tier ${player.level}
Kategori: Berdasarkan ${sortLabel}

Ayo uji kemampuan Hiragana & Katakana di Kana Play!`
  );
}

