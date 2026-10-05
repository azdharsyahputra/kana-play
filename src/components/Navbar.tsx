import React from 'react';
import { AppTab, UserStats } from '../types';
import { Starburst } from './Starburst';
import { Volume2, VolumeX, RotateCcw, Zap, Flame, Trophy, Award, BookOpen, Layers } from 'lucide-react';
import { getSoundEnabled, setSoundEnabled, playKeyClickSound } from '../utils/audio';

interface NavbarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  stats: UserStats;
  onResetStats: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  stats,
  onResetStats,
}) => {
  const [soundOn, setSoundOn] = React.useState<boolean>(getSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    playKeyClickSound();
  };

  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 100;

  const totalMastered = Object.values(stats.kanaMasteryMap).filter(m => m.mastered).length;

  return (
    <header className="w-full">
      {/* 1. TOP TICKER STRIP (Nova Play style) */}
      <div className="bg-[#0b1a3d] text-white py-1.5 px-3 sm:px-6 border-b-2 border-black/40 text-xs font-heading font-extrabold flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-0.5">
          <div className="flex items-center gap-1.5 text-[#ffd200]">
            <Award className="w-4 h-4 text-[#ffd200]" />
            <span>LEVEL {stats.bruteForceLevel} UNLOCKED</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/90">
            <Zap className="w-4 h-4 text-[#ffd200]" />
            <span>MASTERED: {totalMastered} KANA</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#10b981]">
            <Trophy className="w-4 h-4" />
            <span>ACCURACY: {accuracy}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Streak Badge */}
          <div className="flex items-center gap-1 bg-[#d9261c] px-2.5 py-0.5 rounded-full border border-white/30 text-white font-black">
            <Flame className="w-3.5 h-3.5 fill-[#ffd200] text-[#ffd200]" />
            <span>STREAK: {stats.currentStreak}</span>
            <span className="text-[10px] text-white/70">(BEST: {stats.bestStreak})</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title="Toggle Sound Effects"
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded border border-white/20 cursor-pointer transition-all"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-[#ffd200]" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
            <span className="text-[11px]">{soundOn ? 'SFX ON' : 'SFX OFF'}</span>
          </button>

          {/* Reset Stats */}
          <button
            onClick={() => {
              if (window.confirm('Reset semua progress dan riwayat mastery?')) {
                onResetStats();
              }
            }}
            title="Reset Progress"
            className="flex items-center gap-1 bg-white/10 hover:bg-[#d9261c] text-white px-2 py-0.5 rounded border border-white/20 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[10px]">RESET</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN RETRO BRAND HEADER */}
      <div className="bg-[#0c389c] border-b-4 border-[#071e54] text-white py-4 px-3 sm:px-6 shadow-[0_6px_0px_rgba(0,0,0,0.15)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Starburst variant="yellow" size="md" rotation={-6} className="shrink-0">
              <span className="text-xl sm:text-2xl font-bungee text-[#0c389c] leading-none">KANA</span>
              <span className="text-lg sm:text-xl font-bungee text-[#d9261c] leading-none">PLAY</span>
            </Starburst>

            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bungee tracking-tight text-white uppercase leading-none drop-shadow-[2px_2px_0px_#071e54]">
                BUILT FOR BIG MASTERY!
              </h1>
              <p className="text-xs sm:text-sm font-heading font-extrabold text-[#ffd200] mt-1 tracking-wide">
                RAD HIRAGANA, TURBO KATAKANA & REVERSE DRILL FOR SERIOUS FUN.
              </p>
            </div>
          </div>

          {/* MODE TABS (Nova Play Pill Buttons) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-[#071e54]/80 p-1.5 rounded-xl border-2 border-white/20 shadow-inner">
            <button
              onClick={() => {
                playKeyClickSound();
                onSelectTab('brute-force');
              }}
              className={`retro-btn px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center gap-1.5 ${
                currentTab === 'brute-force'
                  ? 'retro-btn-yellow'
                  : 'bg-transparent text-white border-transparent shadow-none hover:bg-white/10'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>BRUTE FORCE</span>
            </button>

            <button
              onClick={() => {
                playKeyClickSound();
                onSelectTab('free-drill');
              }}
              className={`retro-btn px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center gap-1.5 ${
                currentTab === 'free-drill'
                  ? 'retro-btn-yellow'
                  : 'bg-transparent text-white border-transparent shadow-none hover:bg-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>FREE DRILL</span>
            </button>

            <button
              onClick={() => {
                playKeyClickSound();
                onSelectTab('word-drill');
              }}
              className={`retro-btn px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center gap-1.5 ${
                currentTab === 'word-drill'
                  ? 'retro-btn-yellow'
                  : 'bg-transparent text-white border-transparent shadow-none hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>WORD DRILL</span>
            </button>

            <button
              onClick={() => {
                playKeyClickSound();
                onSelectTab('matrix');
              }}
              className={`retro-btn px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center gap-1.5 ${
                currentTab === 'matrix'
                  ? 'retro-btn-yellow'
                  : 'bg-transparent text-white border-transparent shadow-none hover:bg-white/10'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>KANA CHART</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
