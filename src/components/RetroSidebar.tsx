import React from 'react';
import { KANA_ROWS } from '../data/kanaData';
import type { AppTab, DrillDirection, KanaScript, UserStats } from '../types';
import { playKeyClickSound } from '../utils/audio';
import { ChevronRight, Sparkles } from 'lucide-react';

interface RetroSidebarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  script: KanaScript;
  onSelectScript: (script: KanaScript) => void;
  direction: DrillDirection;
  onSelectDirection: (direction: DrillDirection) => void;
  stats: UserStats;
  selectedLevel: number;
  onSelectLevel: (lvl: number) => void;
}

export const RetroSidebar: React.FC<RetroSidebarProps> = ({
  currentTab,
  onSelectTab,
  script,
  onSelectScript,
  direction,
  onSelectDirection,
  stats,
  selectedLevel,
  onSelectLevel,
}) => {
  return (
    <aside className="w-full lg:w-72 space-y-4 select-none shrink-0">
      {/* 1. DRILL SCRIPT & DIRECTION SELECTOR (Toy Style Card) */}
      <div className="retro-card p-3.5 bg-white">
        <div className="bg-[#ffd200] border-2 border-[#0b1a3d] text-[#0b1a3d] px-3 py-1.5 rounded-lg font-bungee text-xs uppercase tracking-wider text-center mb-3 shadow-[2px_2px_0px_#0b1a3d]">
          ★ MODE CONTROLLER
        </div>

        {/* Script Selection (Hiragana / Katakana / Mixed) */}
        <div className="space-y-1.5 mb-3">
          <label className="text-[11px] font-black uppercase text-[#0c389c] tracking-wider block">
            PILIH SCRIPT (HURUF):
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['hiragana', 'katakana', 'mixed'] as KanaScript[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  playKeyClickSound();
                  onSelectScript(s);
                }}
                className={`py-1.5 px-1 text-xs font-heading font-black rounded-lg border-2 transition-all uppercase ${
                  script === s
                    ? 'bg-[#0c389c] text-white border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d]'
                    : 'bg-white text-[#0b1a3d] border-[#0b1a3d]/30 hover:bg-[#f6eedf]'
                }`}
              >
                {s === 'hiragana' ? 'ひらがな' : s === 'katakana' ? 'カタカナ' : 'Campur'}
              </button>
            ))}
          </div>
        </div>

        {/* Direction Selection (Normal vs REVERSE) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase text-[#d9261c] tracking-wider block flex items-center justify-between">
            <span>ARAH DRILL:</span>
            {direction === 'romaji_to_kana' && (
              <span className="bg-[#ffd200] text-[#0b1a3d] text-[9px] px-1.5 py-0.5 rounded font-black">
                REVERSE ON
              </span>
            )}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                playKeyClickSound();
                onSelectDirection('kana_to_romaji');
              }}
              className={`p-2 text-xs font-heading font-black rounded-lg border-2 transition-all text-center flex flex-col items-center ${
                direction === 'kana_to_romaji'
                  ? 'bg-[#0c389c] text-white border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d]'
                  : 'bg-white text-[#0b1a3d] border-[#0b1a3d]/30 hover:bg-[#f6eedf]'
              }`}
            >
              <span className="font-kana text-sm">あ → a</span>
              <span className="text-[10px] font-bold mt-0.5">NORMAL (KANA)</span>
            </button>

            <button
              onClick={() => {
                playKeyClickSound();
                onSelectDirection('romaji_to_kana');
              }}
              className={`p-2 text-xs font-heading font-black rounded-lg border-2 transition-all text-center flex flex-col items-center ${
                direction === 'romaji_to_kana'
                  ? 'bg-[#d9261c] text-white border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d]'
                  : 'bg-white text-[#0b1a3d] border-[#0b1a3d]/30 hover:bg-[#f6eedf]'
              }`}
            >
              <span className="font-kana text-sm">a → あ</span>
              <span className="text-[10px] font-bold mt-0.5">REVERSE (KEYPAD)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY ROW LIST (Nova Play style with circular icons) */}
      <div className="retro-card p-3 bg-white">
        <div className="text-xs font-black uppercase text-[#0b1a3d] pb-2 border-b-2 border-[#0b1a3d]/20 mb-2 flex items-center justify-between">
          <span>BRUTE FORCE LEVEL</span>
          <span className="text-[10px] bg-[#0c389c] text-white px-2 py-0.5 rounded font-bungee">
            TIER 1-{KANA_ROWS.length}
          </span>
        </div>

        <div className="max-h-[320px] overflow-y-auto space-y-1 pr-1">
          {KANA_ROWS.map((row) => {
            const isCurrent = row.level === selectedLevel;

            // Count mastered items in this row
            const rowMasteredCount = row.items.filter(item => {
              const hKey = `hiragana:${item.id}`;
              const kKey = `katakana:${item.id}`;
              return (stats.kanaMasteryMap[hKey]?.mastered || stats.kanaMasteryMap[kKey]?.mastered);
            }).length;

            const isFullyMastered = rowMasteredCount === row.items.length;

            return (
              <button
                key={row.id}
                onClick={() => {
                  playKeyClickSound();
                  onSelectLevel(row.level);
                  if (currentTab !== 'brute-force' && currentTab !== 'writing-drill') onSelectTab('brute-force');
                }}
                className={`w-full text-left p-2 rounded-xl border-2 transition-all flex items-center justify-between group ${
                  isCurrent
                    ? 'bg-[#ffd200] border-[#0b1a3d] text-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d] font-black'
                    : 'bg-white border-[#0b1a3d]/20 text-[#0b1a3d] hover:border-[#0b1a3d] hover:bg-[#f6eedf]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black font-bungee border shrink-0 ${
                      isFullyMastered
                        ? 'bg-[#10b981] text-white border-[#047857]'
                        : 'bg-[#0c389c] text-white border-[#071e54]'
                    }`}
                  >
                    {row.level}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold truncate">
                      {row.name}
                    </div>
                    <div className="text-[10px] text-gray-500 font-kana truncate">
                      {row.items.map(i => script === 'katakana' ? i.katakana : i.hiragana).join(' ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isFullyMastered && (
                    <span className="text-[10px] text-[#047857] font-black bg-[#d1fae5] px-1 rounded">
                      ★ 100%
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0b1a3d] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRO TIPS & MOTIVATION BANNER (Nova Play style) */}
      <div className="retro-card-blue p-3.5 text-center hidden lg:block">
        <Sparkles className="w-6 h-6 text-[#ffd200] mx-auto mb-1 animate-pulse" />
        <h4 className="font-bungee text-sm text-[#ffd200] uppercase">
          {currentTab === 'writing-drill' ? 'TIPS MENULIS KANA' : 'CARA CEPAT HAFAL'}
        </h4>
        <p className="text-[11px] font-heading font-medium text-white/90 mt-1 leading-snug">
          {currentTab === 'writing-drill' ? (
            <>
              Mulailah dengan <strong>Mode Jiplak ON</strong> untuk membiasakan arah goresan. Matikan jiplak untuk menguji daya ingat dan presisi bentuk huruf!
            </>
          ) : (
            <>
              Gunakan <strong>Brute Force Mode</strong> untuk hafal baris per baris. Aktifkan <strong>Reverse Mode</strong> untuk menguji daya ingat aktif melalui keypad!
            </>
          )}
        </p>
      </div>
    </aside>
  );
};
