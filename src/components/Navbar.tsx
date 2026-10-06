import React from 'react';
import { AppTab, UserStats } from '../types';
import { Starburst } from './Starburst';
import { Volume2, VolumeX, RotateCcw, Zap, Flame, Trophy, Award, BookOpen, Layers, PenTool } from 'lucide-react';
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
      <div className="bg-[#0b1a3d] text-white py-1.5 px-3 sm:px-6 border-b-2 border-black/40 text-xs font-heading font-extrabold flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-3 sm:gap-6 whitespace-nowrap py-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-[#ffd200]">
            <Award className="w-4 h-4 text-[#ffd200]" />
            <span><span className="hidden sm:inline">PROGRESS: </span>LV {stats.bruteForceLevel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/90">
            <Zap className="w-4 h-4 text-[#ffd200]" />
            <span><span className="hidden sm:inline">MASTERED: </span>{totalMastered}<span className="hidden sm:inline"> KANA</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-[#10b981]">
            <Trophy className="w-4 h-4" />
            <span><span className="hidden sm:inline">ACCURACY: </span>{accuracy}%</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Streak Badge */}
          <div className="flex items-center gap-1 bg-[#d9261c] px-2.5 py-0.5 rounded-full border border-white/30 text-white font-black">
            <Flame className="w-3.5 h-3.5 fill-[#ffd200] text-[#ffd200]" />
            <span><span className="hidden sm:inline">STREAK: </span>{stats.currentStreak}</span>
            <span className="hidden sm:inline text-[10px] text-white/70">(BEST: {stats.bestStreak})</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title="Nyalakan / matikan semua suara"
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white p-1.5 sm:px-2 sm:py-0.5 rounded border border-white/20 cursor-pointer transition-all"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-[#ffd200]" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
            <span className="hidden sm:inline text-[11px]">{soundOn ? 'SUARA ON' : 'SUARA OFF'}</span>
          </button>

          {/* Reset Stats */}
          <button
            onClick={() => {
              if (window.confirm('Reset semua progress dan riwayat mastery?')) {
                onResetStats();
              }
            }}
            title="Reset Progress"
            className="flex items-center gap-1 bg-white/10 hover:bg-[#d9261c] text-white p-1.5 sm:px-2 sm:py-0.5 rounded border border-white/20 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline text-[10px]">RESET</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN RETRO BRAND HEADER */}
      <div className="bg-[#0c389c] border-b-4 border-[#071e54] text-white py-2 sm:py-4 px-3 sm:px-6 shadow-[0_6px_0px_rgba(0,0,0,0.15)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Headline (tap = back to landing) */}
          <button
            onClick={() => onSelectTab('home')}
            className="sm:hidden self-start font-bungee text-lg leading-none text-[#ffd200] drop-shadow-[2px_2px_0px_#071e54] cursor-pointer"
          >
            KANA <span className="text-white">PLAY</span> ★
          </button>
          <div className="hidden sm:flex items-center gap-3 sm:gap-4">
            <button onClick={() => onSelectTab('home')} title="Home" className="shrink-0 cursor-pointer">
              <Starburst variant="yellow" size="md" rotation={-6}>
                <span className="text-xl sm:text-2xl font-bungee text-[#0c389c] leading-none">KANA</span>
                <span className="text-lg sm:text-xl font-bungee text-[#d9261c] leading-none">PLAY</span>
              </Starburst>
            </button>

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
          <div className="w-full md:w-auto flex overflow-x-auto sm:flex-wrap items-center justify-start sm:justify-center gap-1 sm:gap-2 bg-[#071e54]/80 p-1.5 rounded-xl border-2 border-white/20 shadow-inner [scrollbar-width:none]">
            <button
              onClick={() => {
                playKeyClickSound();
                onSelectTab('brute-force');
              }}
              className={`retro-btn shrink-0 px-2 sm:px-3 py-2 text-[10px] sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 leading-tight ${
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
              className={`retro-btn shrink-0 px-2 sm:px-3 py-2 text-[10px] sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 leading-tight ${
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
              className={`retro-btn shrink-0 px-2 sm:px-3 py-2 text-[10px] sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 leading-tight ${
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
                onSelectTab('writing-drill');
              }}
              className={`retro-btn shrink-0 px-2 sm:px-3 py-2 text-[10px] sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 leading-tight ${
                currentTab === 'writing-drill'
                  ? 'retro-btn-yellow'
                  : 'bg-transparent text-white border-transparent shadow-none hover:bg-white/10'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>WRITING</span>
            </button>

            <button
              onClick={() => {
                playKeyClickSound();
                onSelectTab('matrix');
              }}
              className={`retro-btn shrink-0 px-2 sm:px-3 py-2 text-[10px] sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 leading-tight ${
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
