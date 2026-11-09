import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserStats } from '../types';
import { LeaderboardPlayer, LeaderboardSortOption, PlayerProfile } from '../types/leaderboard';
import {
  AVATAR_OPTIONS,
  DEFAULT_PROFILE,
  buildLeaderboard,
  generateShareText,
  loadPlayerProfile,
  savePlayerProfile,
  addCustomPlayer,
  deleteCustomPlayer,
  resetCustomPlayers,
} from '../utils/leaderboard';
import {
  initOnlineLeaderboard,
  broadcastPlayerScore,
  subscribeOnlinePlayers,
  subscribeConnectionStatus,
  changeRoom,
  getCurrentRoom,
  reconnectOnline,
  getActiveOnlineCount,
  ConnectionStatus,
} from '../utils/onlineLeaderboard';
import { playKeyClickSound, playLevelUpSound } from '../utils/audio';
import { Starburst } from './Starburst';
import {
  Trophy,
  Award,
  Zap,
  Flame,
  UserCheck,
  Search,
  UserPlus,
  Share2,
  Edit3,
  RotateCcw,
  Check,
  Crown,
  Sparkles,
  ChevronUp,
  Target,
  BarChart3,
  Trash2,
  X,
  Globe,
  Radio,
  RefreshCw,
} from 'lucide-react';

interface LeaderboardProps {
  stats: UserStats;
  initialSort?: LeaderboardSortOption;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  stats,
  initialSort = 'points',
}) => {
  const [sortBy, setSortBy] = useState<LeaderboardSortOption>(initialSort);
  const [profile, setProfile] = useState<PlayerProfile>(loadPlayerProfile);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Online Multiplayer State (Serverless via Public WebSockets & BroadcastChannel)
  const [onlinePlayers, setOnlinePlayers] = useState<LeaderboardPlayer[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [room, setRoom] = useState<string>(getCurrentRoom);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [tempRoomInput, setTempRoomInput] = useState(getCurrentRoom);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

  // Profile Form state (Rename & Avatar)
  const [tempName, setTempName] = useState(profile.name);
  const [tempAvatar, setTempAvatar] = useState(profile.avatar);
  const [tempTagline, setTempTagline] = useState(profile.tagline || '');

  // Add Friend Form state
  const [friendName, setFriendName] = useState('');
  const [friendAvatar, setFriendAvatar] = useState('🎓');
  const [friendPoints, setFriendPoints] = useState(1200);
  const [friendCorrect, setFriendCorrect] = useState(85);
  const [friendAnswered, setFriendAnswered] = useState(100);
  const [friendStreak, setFriendStreak] = useState(12);
  const [friendLevel, setFriendLevel] = useState(6);
  const [friendTagline, setFriendTagline] = useState('Semangat belajar kana!');

  // Refresh trigger when custom players change
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialize Online Serverless Sync
  useEffect(() => {
    initOnlineLeaderboard(stats, profile, room);

    const unsubPlayers = subscribeOnlinePlayers((players) => {
      setOnlinePlayers(players);
    });

    const unsubStatus = subscribeConnectionStatus((status) => {
      setConnectionStatus(status);
    });

    return () => {
      unsubPlayers();
      unsubStatus();
    };
  }, [room]);

  // Broadcast score updates whenever stats change
  useEffect(() => {
    broadcastPlayerScore(stats, profile);
  }, [stats.totalAnswered, stats.totalCorrect, stats.bestStreak, stats.bruteForceLevel]);

  // Build full sorted leaderboard including live online players
  const { players, userRank, userPlayer } = useMemo(() => {
    return buildLeaderboard(stats, profile, sortBy, onlinePlayers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats, profile, sortBy, refreshKey, onlinePlayers]);

  // Filtered players by search
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return players;
    const query = searchQuery.toLowerCase().trim();
    return players.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        (p.tagline && p.tagline.toLowerCase().includes(query))
    );
  }, [players, searchQuery]);

  // Top 3 Podium
  const top1 = players[0];
  const top2 = players[1];
  const top3 = players[2];

  // Rival right above user
  const rivalAbove = userRank > 1 ? players[userRank - 2] : null;

  // Handle Save Profile (Rename & Avatar)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PlayerProfile = {
      ...profile,
      name: tempName.trim() || DEFAULT_PROFILE.name,
      avatar: tempAvatar,
      tagline: tempTagline.trim() || 'Ayo taklukkan Kana bersama!',
    };
    setProfile(updated);
    savePlayerProfile(updated);
    broadcastPlayerScore(stats, updated);
    setIsEditProfileOpen(false);
    playLevelUpSound();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  // Handle Save Room
  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tempRoomInput.trim().toLowerCase() || 'global';
    changeRoom(clean, stats, profile);
    setRoom(clean);
    setIsRoomModalOpen(false);
    playKeyClickSound();
  };

  // Handle Add Friend
  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) return;

    addCustomPlayer({
      name: friendName.trim(),
      avatar: friendAvatar,
      totalPoints: Number(friendPoints) || 0,
      totalCorrect: Number(friendCorrect) || 0,
      totalAnswered: Number(friendAnswered) || Math.max(Number(friendCorrect), 1),
      bestStreak: Number(friendStreak) || 0,
      level: Number(friendLevel) || 1,
      tagline: friendTagline.trim(),
    });

    setRefreshKey(prev => prev + 1);
    setIsAddFriendOpen(false);
    setFriendName('');
    playLevelUpSound();
  };

  // Handle Delete Custom Player
  const handleDeletePlayer = (id: string, name: string) => {
    if (window.confirm(`Hapus catatan skor teman "${name}"?`)) {
      deleteCustomPlayer(id);
      setRefreshKey(prev => prev + 1);
      playKeyClickSound();
    }
  };

  // Handle Reset Custom Players
  const handleResetCustoms = () => {
    if (window.confirm('Reset daftar teman custom kembali ke default bawaan?')) {
      resetCustomPlayers();
      setRefreshKey(prev => prev + 1);
      playKeyClickSound();
    }
  };

  // Handle Share / Copy Ranking
  const handleShare = () => {
    const text = generateShareText(userPlayer, userRank, players.length, sortBy);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      playKeyClickSound();
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-4">
      {/* 0. LIVE ONLINE SERVERLESS SYNC STRIP */}
      <div className="bg-[#0b1a3d] border-3 border-[#071e54] rounded-xl px-3 sm:px-4 py-2.5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-[4px_4px_0px_#071e54]">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Connection Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 border border-white/20 font-bold">
            {connectionStatus === 'connected' ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
                </span>
                <span className="text-[#10b981] font-black">ONLINE (P2P SYNC)</span>
              </>
            ) : connectionStatus === 'connecting' ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffd200] animate-pulse inline-block" />
                <span className="text-[#ffd200] font-black">MENGHUBUNGKAN...</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-[#d9261c] inline-block" />
                <span className="text-[#ff7875] font-black">OFFLINE</span>
              </>
            )}
          </div>

          {/* Active online count */}
          <div className="flex items-center gap-1.5 font-bold text-[#ffd200]">
            <Radio className="w-4 h-4 text-[#ffd200] animate-pulse" />
            <span>
              {getActiveOnlineCount() > 0 ? (
                <span><strong>{getActiveOnlineCount()}</strong> Pemain Lain Online</span>
              ) : (
                <span>Menunggu Pemain Lain...</span>
              )}
            </span>
          </div>

          {/* Current Room Pill */}
          <button
            onClick={() => {
              setTempRoomInput(room);
              setIsRoomModalOpen(true);
              playKeyClickSound();
            }}
            title="Ganti room klasemen (misal room kelas atau privat)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-xs font-bold cursor-pointer transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#ffd200]" />
            <span>Room: <strong className="text-[#ffd200]">#{room}</strong></span>
            <span className="text-[9px] bg-[#ffd200] text-[#0b1a3d] px-1 rounded font-black">GANTI</span>
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end shrink-0">
          <button
            onClick={() => {
              setTempName(profile.name);
              setTempAvatar(profile.avatar);
              setTempTagline(profile.tagline || '');
              setIsEditProfileOpen(true);
              playKeyClickSound();
            }}
            className="retro-btn retro-btn-yellow py-1 px-3 text-xs flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#0b1a3d]"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#d9261c]" />
            <span>RENAME / GANTI NAMA</span>
          </button>

          <button
            onClick={() => {
              reconnectOnline(stats, profile);
              playKeyClickSound();
            }}
            title="Sinkronisasi & broadcast ulang ke pemain online"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. HERO BANNER WITH PODIUM INTRO */}
      <div className="retro-card-blue p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#ffd200] text-[#0b1a3d] font-bungee text-xs px-3 py-1 rounded-md border-2 border-[#0b1a3d] mb-2 shadow-[2px_2px_0px_#0b1a3d]">
              <Trophy className="w-4 h-4 text-[#d9261c] fill-current" />
              <span>PAPAN KLASEMEN & SKOR TERBAIK</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bungee leading-none text-white uppercase drop-shadow-[2px_2px_0px_#071e54]">
              LEADERBOARD PEJUANG KANA
            </h2>

            <p className="font-heading font-extrabold text-xs sm:text-sm text-[#ffd200] mt-1.5 max-w-2xl leading-relaxed">
              Tiap latihan benar, combo streak, dan level baru menambah poin bermain kamu!
              Bandingkan skor kamu dengan rival sekelas dan raih posisi Shogun tertinggi!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Starburst variant="yellow" size="md" rotation={4} className="shadow-lg">
              <span className="text-[10px] font-black uppercase text-[#d9261c] leading-tight">PERINGKAT</span>
              <span className="text-2xl font-bungee text-[#0b1a3d] leading-none">#{userRank}</span>
              <span className="text-[9px] font-bungee text-[#0c389c] leading-none">DARI {players.length}</span>
            </Starburst>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="mt-4 pt-3 border-t-2 border-white/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setTempName(profile.name);
                setTempAvatar(profile.avatar);
                setIsEditProfileOpen(true);
                playKeyClickSound();
              }}
              className="retro-btn retro-btn-yellow px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>GANTI NAMA / AVATAR ({profile.avatar} {profile.name})</span>
            </button>

            <button
              onClick={() => {
                setIsAddFriendOpen(true);
                playKeyClickSound();
              }}
              className="retro-btn retro-btn-white px-3 py-1.5 text-xs flex items-center gap-1.5 bg-white text-[#0b1a3d]"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#0c389c]" />
              <span>+ TAMBAH TEMAN SEKELAS</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="retro-btn px-3 py-1.5 text-xs flex items-center gap-1.5 bg-[#10b981] hover:bg-[#059669] text-white border-white shadow-[2px_2px_0px_#ffffff]"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'BERHASIL DISALIN! 📋' : 'BAGIKAN SKOR (SHARE)'}</span>
          </button>
        </div>
      </div>

      {/* 2. USER STATS SPOTLIGHT & MOTIVATION STRIP */}
      <div className="retro-card p-4 bg-gradient-to-r from-[#fffbeb] via-[#ffffff] to-[#eff6ff] border-[#0c389c]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ffd200] border-2 border-[#0b1a3d] flex items-center justify-center text-2xl shadow-[2px_2px_0px_#0b1a3d] shrink-0">
              {userPlayer.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bungee text-base sm:text-lg text-[#0b1a3d]">
                  {userPlayer.name}
                </span>
                <span className="bg-[#0c389c] text-white text-[10px] font-bungee px-2 py-0.5 rounded-full">
                  KAMU
                </span>
                <span className="bg-[#ffd200] text-[#0b1a3d] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#0b1a3d]">
                  RANK #{userRank}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-600 mt-0.5">
                {userPlayer.title} • {userPlayer.totalPoints.toLocaleString()} Total Poin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-heading font-black">
            <div className="text-center">
              <span className="text-[10px] text-gray-500 uppercase block font-bold">Benar</span>
              <span className="text-[#047857] text-sm sm:text-base font-bungee">{userPlayer.totalCorrect}</span>
            </div>
            <div className="h-6 w-px bg-gray-300" />
            <div className="text-center">
              <span className="text-[10px] text-gray-500 uppercase block font-bold">Main</span>
              <span className="text-[#0c389c] text-sm sm:text-base font-bungee">{userPlayer.totalAnswered}</span>
            </div>
            <div className="h-6 w-px bg-gray-300" />
            <div className="text-center">
              <span className="text-[10px] text-gray-500 uppercase block font-bold">Akurasi</span>
              <span className="text-[#d9261c] text-sm sm:text-base font-bungee">{userPlayer.accuracy}%</span>
            </div>
            <div className="h-6 w-px bg-gray-300" />
            <div className="text-center">
              <span className="text-[10px] text-gray-500 uppercase block font-bold">Streak</span>
              <span className="text-[#b45309] text-sm sm:text-base font-bungee">{userPlayer.bestStreak}x</span>
            </div>
          </div>
        </div>

        {/* Motivational nudge */}
        <div className="mt-3 pt-2.5 border-t border-[#0b1a3d]/15 flex items-center justify-between text-xs font-bold text-gray-700">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#ffd200] shrink-0" />
            <span>
              {userRank === 1 ? (
                <strong className="text-[#047857]">🏆 Luar biasa! Kamu memegang tahta nomor 1 saat ini! Pertahankan!</strong>
              ) : rivalAbove ? (
                <>
                  Peringkat di atasmu adalah <strong>{rivalAbove.name}</strong> ({rivalAbove.totalPoints.toLocaleString()} PTS).
                  Selisih: <span className="text-[#d9261c] font-black">{Math.max(0, rivalAbove.totalPoints - userPlayer.totalPoints).toLocaleString()} poin lagi</span> untuk menyalip!
                </>
              ) : (
                'Terus berlatih di Brute Force, Word Drill, dan Soal UTS untuk mendongkrak peringkat!'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 3. TOP 3 PODIUM DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end pt-2">
        {/* RANK 2 - SILVER (Left on desktop) */}
        {top2 && (
          <div className="retro-card p-4 bg-white border-[#64748b] order-2 md:order-1 flex flex-col items-center text-center relative overflow-hidden">
            <div className="bg-[#94a3b8] text-white font-bungee text-xs px-3 py-1 rounded-md mb-2 flex items-center gap-1 shadow-[2px_2px_0px_#334155]">
              <span>🥈 JUARA 2 (SILVER)</span>
            </div>
            <div className="text-4xl my-1">{top2.avatar}</div>
            <h3 className="font-bungee text-base text-[#0b1a3d] truncate max-w-full">
              {top2.name}
            </h3>
            <p className="text-[11px] font-bold text-gray-500">{top2.title}</p>
            <div className="mt-2 py-1 px-3 bg-[#f1f5f9] rounded-lg border border-[#cbd5e1] w-full">
              <span className="font-bungee text-sm text-[#0c389c]">
                {sortBy === 'points' ? `${top2.totalPoints.toLocaleString()} PTS` :
                 sortBy === 'correct' ? `${top2.totalCorrect} Benar` :
                 sortBy === 'answered' ? `${top2.totalAnswered} Latihan` :
                 sortBy === 'streak' ? `${top2.bestStreak}x Streak` : `${top2.accuracy}% Akurasi`}
              </span>
            </div>
            {top2.isUser && (
              <span className="mt-2 text-[10px] font-black bg-[#ffd200] text-[#0b1a3d] px-2 py-0.5 rounded-full border border-[#0b1a3d]">
                ★ KAMU
              </span>
            )}
          </div>
        )}

        {/* RANK 1 - GOLD (Center on desktop, taller & prominent) */}
        {top1 && (
          <div className="retro-card-yellow p-4 sm:p-5 order-1 md:order-2 flex flex-col items-center text-center relative shadow-[8px_8px_0px_#0b1a3d] md:-translate-y-2">
            <div className="absolute -top-3.5">
              <div className="bg-[#d9261c] text-white px-3 py-1 rounded-full font-bungee text-xs flex items-center gap-1 border-2 border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d]">
                <Crown className="w-4 h-4 text-[#ffd200] fill-current animate-bounce" />
                <span>🥇 JUARA 1 (GOLD)</span>
              </div>
            </div>

            <div className="text-5xl my-2 pt-2">{top1.avatar}</div>
            <h3 className="font-bungee text-lg sm:text-xl text-[#0b1a3d] truncate max-w-full">
              {top1.name}
            </h3>
            <p className="text-xs font-black text-[#0c389c]">{top1.title}</p>
            
            <div className="mt-2.5 py-1.5 px-4 bg-white rounded-xl border-2 border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d] w-full">
              <span className="font-bungee text-base sm:text-lg text-[#d9261c]">
                {sortBy === 'points' ? `${top1.totalPoints.toLocaleString()} PTS` :
                 sortBy === 'correct' ? `${top1.totalCorrect} Benar` :
                 sortBy === 'answered' ? `${top1.totalAnswered} Latihan` :
                 sortBy === 'streak' ? `${top1.bestStreak}x Streak` : `${top1.accuracy}% Akurasi`}
              </span>
            </div>

            {top1.tagline && (
              <p className="text-[11px] font-heading font-medium text-[#0b1a3d]/80 mt-2 italic">
                "{top1.tagline}"
              </p>
            )}

            {top1.isUser && (
              <span className="mt-2 text-xs font-black bg-[#10b981] text-white px-3 py-0.5 rounded-full border-2 border-[#0b1a3d]">
                ★ KAMU ADALAH JUARA 1!
              </span>
            )}
          </div>
        )}

        {/* RANK 3 - BRONZE (Right on desktop) */}
        {top3 && (
          <div className="retro-card p-4 bg-white border-[#b45309] order-3 md:order-3 flex flex-col items-center text-center relative overflow-hidden">
            <div className="bg-[#b45309] text-white font-bungee text-xs px-3 py-1 rounded-md mb-2 flex items-center gap-1 shadow-[2px_2px_0px_#78350f]">
              <span>🥉 JUARA 3 (BRONZE)</span>
            </div>
            <div className="text-4xl my-1">{top3.avatar}</div>
            <h3 className="font-bungee text-base text-[#0b1a3d] truncate max-w-full">
              {top3.name}
            </h3>
            <p className="text-[11px] font-bold text-gray-500">{top3.title}</p>
            <div className="mt-2 py-1 px-3 bg-[#fef3c7] rounded-lg border border-[#fde68a] w-full">
              <span className="font-bungee text-sm text-[#b45309]">
                {sortBy === 'points' ? `${top3.totalPoints.toLocaleString()} PTS` :
                 sortBy === 'correct' ? `${top3.totalCorrect} Benar` :
                 sortBy === 'answered' ? `${top3.totalAnswered} Latihan` :
                 sortBy === 'streak' ? `${top3.bestStreak}x Streak` : `${top3.accuracy}% Akurasi`}
              </span>
            </div>
            {top3.isUser && (
              <span className="mt-2 text-[10px] font-black bg-[#ffd200] text-[#0b1a3d] px-2 py-0.5 rounded-full border border-[#0b1a3d]">
                ★ KAMU
              </span>
            )}
          </div>
        )}
      </div>

      {/* 4. SORTING CONTROLS & SEARCH BAR */}
      <div className="retro-card p-3 sm:p-4 bg-white space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Sorting Option Tabs */}
          <div>
            <label className="text-[11px] font-black uppercase text-[#0c389c] tracking-wider block mb-1.5">
              URUTKAN LEADERBOARD BERDASARKAN:
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'points', label: '⭐ Total Poin (EXP)', icon: Trophy },
                { id: 'correct', label: '🎯 Sering Benar', icon: Target },
                { id: 'answered', label: '⚡ Sering Main', icon: Zap },
                { id: 'streak', label: '🔥 Best Streak', icon: Flame },
                { id: 'accuracy', label: '📈 Akurasi (%)', icon: BarChart3 },
              ].map(opt => {
                const Icon = opt.icon;
                const isActive = sortBy === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      playKeyClickSound();
                      setSortBy(opt.id as LeaderboardSortOption);
                    }}
                    className={`retro-btn px-2.5 sm:px-3 py-1.5 text-xs flex items-center gap-1.5 ${
                      isActive
                        ? 'retro-btn-yellow'
                        : 'bg-white text-[#0b1a3d] border-[#0b1a3d]/30 hover:bg-[#f6eedf]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar */}
          <div className="w-full lg:w-64">
            <label className="text-[11px] font-black uppercase text-gray-500 tracking-wider block mb-1.5">
              CARI PEMAIN / RIVAL:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Ketik nama atau gelar..."
                className="w-full pl-8 pr-3 py-1.5 text-xs font-bold rounded-lg border-2 border-[#0b1a3d]/30 focus:border-[#0c389c] focus:outline-none bg-[#f6eedf]/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. FULL LEADERBOARD TABLE */}
      <div className="retro-card overflow-hidden bg-white">
        <div className="bg-[#0b1a3d] text-white px-4 py-2.5 font-bungee text-xs uppercase flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#ffd200]" />
            <span>KLASEMEN LENGKAP ({filteredPlayers.length} PEMAIN)</span>
          </div>
          <div className="text-[11px] font-heading font-medium text-white/80 hidden sm:block">
            {sortBy === 'points' && 'Diurutkan berdasarkan akumulasi poin belajar'}
            {sortBy === 'correct' && 'Diurutkan berdasarkan total jawaban benar'}
            {sortBy === 'answered' && 'Diurutkan berdasarkan total latihan yang dicoba'}
            {sortBy === 'streak' && 'Diurutkan berdasarkan kombo streak tertinggi'}
            {sortBy === 'accuracy' && 'Diurutkan berdasarkan persentase akurasi ketepatan'}
          </div>
        </div>

        <div className="divide-y-2 divide-[#0b1a3d]/10">
          {filteredPlayers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-bold text-sm">
              Tidak ada pemain yang sesuai dengan pencarian "{searchQuery}".
            </div>
          ) : (
            filteredPlayers.map((player, index) => {
              const actualRank = players.findIndex(p => p.id === player.id) + 1;
              const isCurrentUser = player.isUser;
              const isCustom = player.id.startsWith('custom_');

              return (
                <div
                  key={player.id}
                  className={`p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isCurrentUser
                      ? 'bg-[#fef9c3] border-l-4 border-l-[#d9261c] shadow-inner font-bold'
                      : index % 2 === 0
                      ? 'bg-white hover:bg-[#f6eedf]/40'
                      : 'bg-[#faf7f2] hover:bg-[#f6eedf]/40'
                  }`}
                >
                  {/* Rank & Profile */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-8 sm:w-10 text-center shrink-0">
                      {actualRank === 1 ? (
                        <span className="text-2xl" title="Peringkat 1">🥇</span>
                      ) : actualRank === 2 ? (
                        <span className="text-2xl" title="Peringkat 2">🥈</span>
                      ) : actualRank === 3 ? (
                        <span className="text-2xl" title="Peringkat 3">🥉</span>
                      ) : (
                        <span className="font-bungee text-sm sm:text-base text-gray-600">
                          #{actualRank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl border-2 shrink-0 ${
                      isCurrentUser
                        ? 'bg-[#ffd200] border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d]'
                        : player.isOnline
                        ? 'bg-white border-[#10b981] ring-2 ring-[#10b981]/50 shadow-[2px_2px_0px_#10b981]'
                        : 'bg-white border-[#0b1a3d]/30'
                    }`}>
                      {player.avatar}
                      {player.isOnline && !isCurrentUser && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#10b981] border-2 border-white rounded-full animate-pulse" title="Live Online Sekarang" />
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`font-bungee text-sm sm:text-base truncate ${
                          isCurrentUser ? 'text-[#0c389c]' : 'text-[#0b1a3d]'
                        }`}>
                          {player.name}
                        </span>

                        {isCurrentUser && (
                          <span className="bg-[#d9261c] text-white text-[9px] font-bungee px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000]">
                            KAMU
                          </span>
                        )}

                        {player.isOnline && !isCurrentUser && (
                          <span className="bg-[#059669] text-white text-[9px] font-bungee px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                            LIVE ONLINE
                          </span>
                        )}

                        {!player.isOnline && !isCurrentUser && !player.isCustomFriend && (
                          <span className="bg-gray-200 text-gray-700 text-[9px] font-bungee px-1.5 py-0.5 rounded">
                            ⚔️ RIVAL
                          </span>
                        )}

                        {player.isCustomFriend && (
                          <span className="bg-[#6366f1] text-white text-[9px] font-bungee px-1.5 py-0.5 rounded">
                            👥 TEMAN
                          </span>
                        )}

                        {player.badge && (
                          <span className="bg-[#0b1a3d] text-[#ffd200] text-[9px] font-heading font-black px-1.5 py-0.5 rounded">
                            {player.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 font-bold mt-0.5">
                        <span className="text-[#0c389c] font-black">{player.title}</span>
                        <span>•</span>
                        <span>Level Tier {player.level}</span>
                        {player.tagline && (
                          <>
                            <span className="hidden md:inline">•</span>
                            <span className="hidden md:inline italic truncate max-w-xs text-gray-600">"{player.tagline}"</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Metrics & Badges */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pl-11 sm:pl-0 shrink-0">
                    {/* Primary Highlighted Metric */}
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-gray-500 uppercase font-black block">
                        {sortBy === 'points' && 'TOTAL POIN'}
                        {sortBy === 'correct' && 'JAWABAN BENAR'}
                        {sortBy === 'answered' && 'TOTAL LATIHAN'}
                        {sortBy === 'streak' && 'BEST STREAK'}
                        {sortBy === 'accuracy' && 'AKURASI'}
                      </span>
                      <span className="font-bungee text-base sm:text-lg text-[#0c389c]">
                        {sortBy === 'points' && `${player.totalPoints.toLocaleString()} PTS`}
                        {sortBy === 'correct' && `${player.totalCorrect} Benar`}
                        {sortBy === 'answered' && `${player.totalAnswered} Soal`}
                        {sortBy === 'streak' && `${player.bestStreak}x Combo`}
                        {sortBy === 'accuracy' && `${player.accuracy}%`}
                      </span>
                    </div>

                    {/* Secondary Metrics Strip */}
                    <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-gray-700 bg-white/80 px-2 py-1 rounded-lg border border-[#0b1a3d]/20">
                      <span title="Akurasi" className="text-[#047857]">
                        {player.accuracy}%
                      </span>
                      <span className="text-gray-300">|</span>
                      <span title="Streak" className="text-[#b45309]">
                        {player.bestStreak}🔥
                      </span>
                      <span className="text-gray-300">|</span>
                      <span title="Benar / Total" className="text-gray-600">
                        {player.totalCorrect}/{player.totalAnswered}
                      </span>
                    </div>

                    {/* Delete button if custom player */}
                    {isCustom && (
                      <button
                        onClick={() => handleDeletePlayer(player.id, player.name)}
                        title="Hapus pemain ini"
                        className="text-gray-400 hover:text-[#d9261c] p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer controls inside table */}
        <div className="bg-[#f6eedf] p-3 border-t-2 border-[#0b1a3d]/20 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-gray-600">
          <span>
            Menampilkan {filteredPlayers.length} dari total {players.length} kontestan.
          </span>
          <button
            onClick={handleResetCustoms}
            className="text-gray-500 hover:text-[#d9261c] text-[11px] underline cursor-pointer"
          >
            Reset Daftar Teman Custom
          </button>
        </div>
      </div>

      {/* 6. MODAL: EDIT PROFILE (GANTI NAMA & AVATAR) */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="retro-card p-5 bg-white w-full max-w-md space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ffd200] border-2 border-[#0b1a3d] flex items-center justify-center text-lg">
                ✏️
              </div>
              <h3 className="font-bungee text-lg text-[#0b1a3d]">
                EDIT PROFIL KAMU
              </h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-[#0b1a3d] block mb-1">
                  NAMA / NICKNAME PEMAIN:
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  placeholder="Contoh: Farras, Kenji, Sakura..."
                  className="w-full px-3 py-2 text-sm font-bold rounded-lg border-2 border-[#0b1a3d] focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-[#0b1a3d] block mb-1.5">
                  PILIH AVATAR RETRO:
                </label>
                <div className="grid grid-cols-8 gap-1.5 p-2 bg-[#f6eedf] rounded-xl border-2 border-[#0b1a3d]/20">
                  {AVATAR_OPTIONS.map(av => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setTempAvatar(av)}
                      className={`h-9 rounded-lg flex items-center justify-center text-xl transition-all cursor-pointer ${
                        tempAvatar === av
                          ? 'bg-[#ffd200] border-2 border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d] scale-110'
                          : 'bg-white hover:bg-white/80 border border-transparent'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-[#0b1a3d] block mb-1">
                  TAGLINE / PESAN PROFIL (TERLIHAT PEMAIN LAIN):
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={tempTagline}
                  onChange={e => setTempTagline(e.target.value)}
                  placeholder="Contoh: Semangat belajar 100 Kana!"
                  className="w-full px-3 py-2 text-sm font-bold rounded-lg border-2 border-[#0b1a3d] focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="retro-btn px-4 py-2 text-xs bg-gray-200 text-gray-700 border-gray-400 shadow-none hover:bg-gray-300 cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="retro-btn retro-btn-yellow px-5 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>SIMPAN PROFIL</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6B. MODAL: GANTI ROOM MULTIPLAYER */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="retro-card p-5 bg-white w-full max-w-md space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsRoomModalOpen(false)}
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ffd200] border-2 border-[#0b1a3d] flex items-center justify-center text-lg">
                🌐
              </div>
              <h3 className="font-bungee text-lg text-[#0b1a3d]">
                GANTI ROOM ONLINE
              </h3>
            </div>

            <p className="text-xs font-bold text-gray-600 leading-relaxed">
              Masuk ke room yang sama dengan teman sekelas (misal: <code className="bg-[#f6eedf] px-1.5 py-0.5 rounded font-mono font-bold text-[#0c389c]">kelas-jepang</code> atau <code className="bg-[#f6eedf] px-1.5 py-0.5 rounded font-mono font-bold text-[#0c389c]">uts-2026</code>) agar kalian saling terhubung dan bersaing langsung di room tersebut!
            </p>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-[#0b1a3d] block mb-1">
                  KODE / NAMA ROOM:
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={tempRoomInput}
                  onChange={e => setTempRoomInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="Contoh: global, kelas-a, uts-2026"
                  className="w-full px-3 py-2 text-sm font-mono font-bold rounded-lg border-2 border-[#0b1a3d] focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
                  required
                />
                <span className="text-[10px] text-gray-500 font-bold mt-1 block">
                  Hanya huruf kecil, angka, tanda strip (-) dan garis bawah (_).
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-gray-500 w-full">Room Populer:</span>
                {['global', 'kelas-jepang', 'uts-2026', 'anime-squad'].map(r => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setTempRoomInput(r)}
                    className={`px-2 py-0.5 text-xs rounded font-mono font-bold border cursor-pointer ${
                      tempRoomInput === r
                        ? 'bg-[#0c389c] text-white border-[#071e54]'
                        : 'bg-[#f6eedf] hover:bg-[#ffd200] text-[#0b1a3d] border-[#0b1a3d]/20'
                    }`}
                  >
                    #{r}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="retro-btn px-4 py-2 text-xs bg-gray-200 text-gray-700 border-gray-400 shadow-none hover:bg-gray-300 cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="retro-btn retro-btn-yellow px-5 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>MASUK ROOM</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: TAMBAH TEMAN SEKELAS */}
      {isAddFriendOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="retro-card p-5 bg-white w-full max-w-lg space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddFriendOpen(false)}
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0c389c] text-white border-2 border-[#0b1a3d] flex items-center justify-center text-lg">
                👥
              </div>
              <h3 className="font-bungee text-lg text-[#0b1a3d]">
                TAMBAH TEMAN SEKELAS
              </h3>
            </div>

            <p className="text-xs font-bold text-gray-600">
              Masukkan skor teman kamu agar kalian bisa adu peringkat di papan klasemen yang sama!
            </p>

            <form onSubmit={handleAddFriend} className="space-y-3">
              <div>
                <label className="text-[11px] font-black uppercase text-[#0b1a3d] block mb-1">
                  NAMA TEMAN:
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={friendName}
                  onChange={e => setFriendName(e.target.value)}
                  placeholder="Contoh: Andi Pratama"
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-[#0b1a3d] focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-[#0b1a3d] block mb-1">
                  AVATAR:
                </label>
                <div className="flex flex-wrap gap-1 p-2 bg-[#f6eedf] rounded-lg border border-[#0b1a3d]/20">
                  {AVATAR_OPTIONS.slice(0, 10).map(av => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setFriendAvatar(av)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-lg cursor-pointer ${
                        friendAvatar === av
                          ? 'bg-[#ffd200] border-2 border-[#0b1a3d] shadow-[1px_1px_0px_#000]'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-black uppercase text-[#0b1a3d] block mb-1">
                    TOTAL POIN:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99999"
                    value={friendPoints}
                    onChange={e => setFriendPoints(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-[#0b1a3d]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-[#0b1a3d] block mb-1">
                    BEST STREAK:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={friendStreak}
                    onChange={e => setFriendStreak(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-[#0b1a3d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-black uppercase text-[#0b1a3d] block mb-1">
                    JAWABAN BENAR:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={friendCorrect}
                    onChange={e => setFriendCorrect(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-[#0b1a3d]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-[#0b1a3d] block mb-1">
                    TOTAL SOAL:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="9999"
                    value={friendAnswered}
                    onChange={e => setFriendAnswered(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-[#0b1a3d]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-[#0b1a3d] block mb-1">
                    LEVEL TIER:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={friendLevel}
                    onChange={e => setFriendLevel(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-[#0b1a3d]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-[#0b1a3d] block mb-1">
                  MOTTO / PESAN:
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={friendTagline}
                  onChange={e => setFriendTagline(e.target.value)}
                  placeholder="Contoh: Jangan remehkan huruf Katakana!"
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-[#0b1a3d]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFriendOpen(false)}
                  className="retro-btn px-4 py-2 text-xs bg-gray-200 text-gray-700 border-gray-400 shadow-none hover:bg-gray-300"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="retro-btn retro-btn-yellow px-5 py-2 text-xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>TAMBAH KE LEADERBOARD</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

