import React, { useState } from 'react';
import { KANA_ROWS } from '../data/kanaData';
import { KanaItem, KanaScript, UserStats } from '../types';
import { speakJapanese, playKeyClickSound } from '../utils/audio';
import { Volume2, Award, Star, CheckCircle, Search } from 'lucide-react';

interface KanaMatrixProps {
  stats: UserStats;
}

export const KanaMatrix: React.FC<KanaMatrixProps> = ({ stats }) => {
  const [activeScript, setActiveScript] = useState<'hiragana' | 'katakana'>('hiragana');
  const [activeGroup, setActiveGroup] = useState<'main' | 'dakuten' | 'youon'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKana, setSelectedKana] = useState<KanaItem | null>(null);

  const filteredRows = KANA_ROWS.filter(row => {
    if (activeGroup === 'main') return row.groupType === 'main';
    if (activeGroup === 'dakuten') return row.groupType === 'dakuten' || row.groupType === 'handakuten';
    if (activeGroup === 'youon') return row.groupType === 'youon';
    return true;
  });

  const handleTileClick = (item: KanaItem) => {
    playKeyClickSound();
    setSelectedKana(item);
    const char = activeScript === 'katakana' ? item.katakana : item.hiragana;
    speakJapanese(char);
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. MATRIX HEADER & TAB SWITCHERS */}
      <div className="retro-card p-4 sm:p-5 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#0b1a3d]/20 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bungee text-[#0b1a3d]">
              ★ KANA MASTERY MATRIX ★
            </h2>
            <p className="text-xs font-bold text-gray-600 mt-0.5">
              Klik karakter mana saja untuk mendengarkan audio pengucapan asli dan melihat status penguasaanmu.
            </p>
          </div>

          {/* Script Toggle */}
          <div className="flex items-center gap-1.5 bg-[#f6eedf] p-1 rounded-xl border-2 border-[#0b1a3d]">
            <button
              onClick={() => {
                playKeyClickSound();
                setActiveScript('hiragana');
              }}
              className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all ${
                activeScript === 'hiragana'
                  ? 'bg-[#0c389c] text-white shadow-[2px_2px_0px_#0b1a3d]'
                  : 'text-[#0b1a3d] hover:bg-white'
              }`}
            >
              ひらがな (Hiragana)
            </button>
            <button
              onClick={() => {
                playKeyClickSound();
                setActiveScript('katakana');
              }}
              className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all ${
                activeScript === 'katakana'
                  ? 'bg-[#d9261c] text-white shadow-[2px_2px_0px_#0b1a3d]'
                  : 'text-[#0b1a3d] hover:bg-white'
              }`}
            >
              カタカナ (Katakana)
            </button>
          </div>
        </div>

        {/* Group Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              playKeyClickSound();
              setActiveGroup('main');
            }}
            className={`px-3 py-1.5 text-xs font-heading font-black rounded-xl border-2 transition-all ${
              activeGroup === 'main'
                ? 'bg-[#ffd200] text-[#0b1a3d] border-[#0b1a3d] shadow-[3px_3px_0px_#0b1a3d]'
                : 'bg-white text-[#0b1a3d] border-gray-300 hover:border-[#0b1a3d]'
            }`}
          >
            五十音 Basic (46 Gojūon)
          </button>
          <button
            onClick={() => {
              playKeyClickSound();
              setActiveGroup('dakuten');
            }}
            className={`px-3 py-1.5 text-xs font-heading font-black rounded-xl border-2 transition-all ${
              activeGroup === 'dakuten'
                ? 'bg-[#ffd200] text-[#0b1a3d] border-[#0b1a3d] shadow-[3px_3px_0px_#0b1a3d]'
                : 'bg-white text-[#0b1a3d] border-gray-300 hover:border-[#0b1a3d]'
            }`}
          >
            濁音 / 半濁音 Dakuten & P-Row (25)
          </button>
          <button
            onClick={() => {
              playKeyClickSound();
              setActiveGroup('youon');
            }}
            className={`px-3 py-1.5 text-xs font-heading font-black rounded-xl border-2 transition-all ${
              activeGroup === 'youon'
                ? 'bg-[#ffd200] text-[#0b1a3d] border-[#0b1a3d] shadow-[3px_3px_0px_#0b1a3d]'
                : 'bg-white text-[#0b1a3d] border-gray-300 hover:border-[#0b1a3d]'
            }`}
          >
            拗音 Yōon Combinations (33)
          </button>
        </div>
      </div>

      {/* 2. MATRIX GRID */}
      <div className="space-y-3">
        {filteredRows.map((row) => (
          <div key={row.id} className="retro-card p-3.5 bg-white">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
              <span className="font-bungee text-xs text-[#0c389c] uppercase">
                {row.name} — {row.label}
              </span>
              <span className="text-[10px] font-extrabold text-gray-500">
                LEVEL {row.level}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {row.items.map((item) => {
                const char = activeScript === 'katakana' ? item.katakana : item.hiragana;
                const masteryKey = `${activeScript}:${item.id}`;
                const mastery = stats.kanaMasteryMap[masteryKey];
                const isMastered = mastery?.mastered;
                const streak = mastery?.currentStreak || 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTileClick(item)}
                    className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center justify-center relative group ${
                      isMastered
                        ? 'bg-[#d1fae5] border-[#10b981] text-[#065f46] shadow-[2px_2px_0px_#10b981]'
                        : streak > 0
                        ? 'bg-[#fffbeb] border-[#f59e0b] text-[#92400e] shadow-[2px_2px_0px_#f59e0b]'
                        : 'bg-white border-[#0b1a3d]/20 text-[#0b1a3d] hover:border-[#0b1a3d] shadow-[2px_2px_0px_rgba(0,0,0,0.05)]'
                    }`}
                  >
                    {isMastered && (
                      <span className="absolute top-1 right-1 text-[9px] text-[#10b981] font-black">
                        ★
                      </span>
                    )}

                    <span className="text-3xl font-black font-kana leading-tight group-hover:scale-110 transition-transform">
                      {char}
                    </span>

                    <span className="text-[11px] font-black font-mono uppercase text-[#0c389c] mt-0.5">
                      {item.romaji}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. SELECTED KANA DETAIL MODAL / POPUP */}
      {selectedKana && (
        <div className="retro-card-yellow p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[6px_6px_0px_#0b1a3d]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white border-3 border-[#0b1a3d] rounded-2xl flex items-center justify-center text-4xl font-black font-kana shadow-[3px_3px_0px_#0b1a3d]">
              {activeScript === 'katakana' ? selectedKana.katakana : selectedKana.hiragana}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bungee text-[#0b1a3d]">
                  {selectedKana.romaji.toUpperCase()}
                </span>
                <span className="text-xs bg-[#0c389c] text-white px-2 py-0.5 rounded font-black">
                  Hiragana: {selectedKana.hiragana} | Katakana: {selectedKana.katakana}
                </span>
              </div>
              <p className="text-xs font-bold text-[#0b1a3d]/80 mt-1">
                Grup: {selectedKana.rowId.replace('row-', '').toUpperCase()} Row • Status:{' '}
                {stats.kanaMasteryMap[`${activeScript}:${selectedKana.id}`]?.mastered
                  ? '★ MASTERED'
                  : 'Sedang dipelajari'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const char = activeScript === 'katakana' ? selectedKana.katakana : selectedKana.hiragana;
                speakJapanese(char);
              }}
              className="retro-btn retro-btn-blue px-3 py-2 text-xs flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>PUTAR AUDIO</span>
            </button>
            <button
              onClick={() => setSelectedKana(null)}
              className="retro-btn retro-btn-white px-3 py-2 text-xs"
            >
              TUTUP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
