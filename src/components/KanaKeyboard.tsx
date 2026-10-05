import React, { useState } from 'react';
import { KANA_ROWS } from '../data/kanaData';
import type { KanaItem, KanaScript } from '../types';
import { playKeyClickSound, speakJapanese } from '../utils/audio';
import { Delete, CornerDownLeft, Volume2, Grid3X3, Layers } from 'lucide-react';

interface KanaKeyboardProps {
  script: KanaScript;
  onSelectKana: (char: string) => void;
  // Multi-character builder props (for Word Reverse Mode)
  isWordMode?: boolean;
  currentBuffer?: string;
  onDelete?: () => void;
  onSubmit?: () => void;
  // Candidates focus (e.g., current brute-force row items)
  focusCandidates?: KanaItem[];
}

export const KanaKeyboard: React.FC<KanaKeyboardProps> = ({
  script,
  onSelectKana,
  isWordMode = false,
  currentBuffer = '',
  onDelete,
  onSubmit,
  focusCandidates,
}) => {
  // Default to 'main' so user sees the real kana table without giveaway shortcuts, or allow tab switching
  const [activeTab, setActiveTab] = useState<'main' | 'dakuten' | 'yoon' | 'tier'>('main');

  const activeScript: 'hiragana' | 'katakana' = script === 'katakana' ? 'katakana' : 'hiragana';

  const handleKeyClick = (item: KanaItem) => {
    playKeyClickSound();
    const char = activeScript === 'katakana' ? item.katakana : item.hiragana;
    onSelectKana(char);
  };

  const mainRows = KANA_ROWS.filter(r => r.groupType === 'main');
  const dakuRows = KANA_ROWS.filter(r => r.groupType === 'dakuten' || r.groupType === 'handakuten');
  const yoonRows = KANA_ROWS.filter(r => r.groupType === 'youon');

  return (
    <div className="w-full bg-[#f6eedf] border-[3.5px] border-[#0b1a3d] rounded-2xl p-3 sm:p-4 shadow-[5px_5px_0px_#0b1a3d]">
      {/* Keyboard Header / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b-2 border-[#0b1a3d]/20 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bungee tracking-wider bg-[#0c389c] text-white px-2.5 py-1 rounded-md border border-[#071e54]">
            ⌨️ {activeScript === 'hiragana' ? 'HIRAGANA KEYPAD' : 'KATAKANA KEYPAD'}
          </span>
          <span className="text-xs font-bold text-[#0b1a3d]/70 hidden sm:inline">
            (Pilih huruf Kana yang sesuai)
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap gap-1">
          {focusCandidates && focusCandidates.length > 0 && (
            <button
              onClick={() => setActiveTab('tier')}
              className={`px-2.5 py-1 text-xs font-heading font-black rounded-lg border-2 transition-all ${
                activeTab === 'tier'
                  ? 'bg-[#ffd200] text-[#0b1a3d] border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d]'
                  : 'bg-white text-[#0b1a3d] border-[#0b1a3d]/40 hover:bg-[#fff9db]'
              }`}
            >
              ★ Baris Aktif
            </button>
          )}
          <button
            onClick={() => setActiveTab('main')}
            className={`px-2.5 py-1 text-xs font-heading font-black rounded-lg border-2 transition-all ${
              activeTab === 'main'
                ? 'bg-[#0c389c] text-white border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d]'
                : 'bg-white text-[#0b1a3d] border-[#0b1a3d]/40 hover:bg-[#e0e7ff]'
            }`}
          >
            Dasar (五十音)
          </button>
          <button
            onClick={() => setActiveTab('dakuten')}
            className={`px-2.5 py-1 text-xs font-heading font-black rounded-lg border-2 transition-all ${
              activeTab === 'dakuten'
                ? 'bg-[#d9261c] text-white border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d]'
                : 'bg-white text-[#0b1a3d] border-[#0b1a3d]/40 hover:bg-[#ffe4e6]'
            }`}
          >
            Dakuten (濁音)
          </button>
          <button
            onClick={() => setActiveTab('yoon')}
            className={`px-2.5 py-1 text-xs font-heading font-black rounded-lg border-2 transition-all ${
              activeTab === 'yoon'
                ? 'bg-[#10b981] text-white border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d]'
                : 'bg-white text-[#0b1a3d] border-[#0b1a3d]/40 hover:bg-[#d1fae5]'
            }`}
          >
            Yōon (拗音)
          </button>
        </div>
      </div>

      {/* Word Mode Action Bar (Buffer & Backspace/Submit) */}
      {isWordMode && (
        <div className="bg-white border-2 border-[#0b1a3d] rounded-xl p-2.5 mb-3 flex items-center justify-between gap-2 shadow-[3px_3px_0px_#0b1a3d]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-extrabold uppercase text-[#0c389c] bg-[#e0e7ff] px-2 py-0.5 rounded border border-[#0c389c]/30">
              Input:
            </span>
            <div className="font-kana font-bold text-2xl text-[#0b1a3d] tracking-wider min-h-[34px] flex items-center truncate">
              {currentBuffer ? (
                <span className="bg-[#ffd200]/40 px-3 py-0.5 rounded-lg border border-[#ffd200]">
                  {currentBuffer}
                </span>
              ) : (
                <span className="text-gray-400 text-xs italic font-normal">
                  (Pilih huruf di keypad bawah untuk menyusun kata...)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {currentBuffer && (
              <button
                onClick={() => speakJapanese(currentBuffer)}
                title="Dengarkan Pengucapan"
                className="retro-btn retro-btn-white p-1.5 text-xs flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4 text-[#0c389c]" />
              </button>
            )}
            <button
              onClick={onDelete}
              title="Hapus huruf terakhir"
              className="retro-btn retro-btn-red px-2.5 py-1.5 text-xs flex items-center gap-1"
            >
              <Delete className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">HAPUS</span>
            </button>
            <button
              onClick={onSubmit}
              disabled={!currentBuffer}
              title="Kirim jawaban"
              className={`retro-btn px-3 py-1.5 text-xs flex items-center gap-1.5 ${
                currentBuffer
                  ? 'retro-btn-yellow shadow-[3px_3px_0px_#0b1a3d]'
                  : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed shadow-none'
              }`}
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span>SUBMIT</span>
            </button>
          </div>
        </div>
      )}

      {/* KEYPAD TILES: CLEAN TEXTBOOK FONT WITH NO ROMAJI HINTS */}
      <div className="max-h-[290px] overflow-y-auto pr-1 space-y-2">
        
        {/* TAB: FOCUS TIER (Active Level) - NO ROMAJI HINTS */}
        {activeTab === 'tier' && focusCandidates && (
          <div className="bg-white border-2 border-[#0b1a3d] rounded-xl p-3 shadow-[3px_3px_0px_#0b1a3d]">
            <div className="text-xs font-bungee text-[#0c389c] mb-2.5 uppercase tracking-wide">
              ★ PILIH KARAKTER KANA:
            </div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {focusCandidates.map((item) => {
                const char = activeScript === 'katakana' ? item.katakana : item.hiragana;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleKeyClick(item)}
                    className="kana-key bg-white hover:bg-[#ffd200] text-[#0b1a3d] flex items-center justify-center p-3 sm:p-4 border-[2.5px] border-[#0b1a3d] rounded-xl group transition-all"
                  >
                    <span className="text-3xl sm:text-4xl font-bold font-kana group-hover:scale-110 transition-transform">
                      {char}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: MAIN GOJUON (五十音) - NO ROMAJI HINTS */}
        {activeTab === 'main' && (
          <div className="space-y-1.5">
            {mainRows.map((row) => (
              <div
                key={row.id}
                className="bg-white border-2 border-[#0b1a3d]/20 rounded-xl p-1.5 sm:p-2 flex items-center gap-2 hover:border-[#0b1a3d]/50 transition-colors"
              >
                <span className="text-xs font-black w-10 sm:w-12 text-[#0c389c] uppercase shrink-0 font-heading">
                  {row.name.replace('-Row', '')}
                </span>
                <div className="grid grid-cols-5 gap-1.5 flex-1">
                  {row.items.map((item) => {
                    const char = activeScript === 'katakana' ? item.katakana : item.hiragana;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleKeyClick(item)}
                        className="kana-key bg-white hover:bg-[#ffd200] text-[#0b1a3d] py-2 sm:py-2.5 px-1 flex items-center justify-center rounded-lg border-2 border-[#0b1a3d]"
                      >
                        <span className="text-2xl sm:text-3xl font-bold font-kana leading-none">
                          {char}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: DAKUTEN & HANDAKUTEN (濁音・半濁音) - NO ROMAJI HINTS */}
        {activeTab === 'dakuten' && (
          <div className="space-y-1.5">
            {dakuRows.map((row) => (
              <div
                key={row.id}
                className="bg-white border-2 border-[#0b1a3d]/20 rounded-xl p-1.5 sm:p-2 flex items-center gap-2 hover:border-[#0b1a3d]/50 transition-colors"
              >
                <span className="text-xs font-black w-10 sm:w-14 text-[#d9261c] uppercase shrink-0 font-heading">
                  {row.name.replace('-Row', '')}
                </span>
                <div className="grid grid-cols-5 gap-1.5 flex-1">
                  {row.items.map((item) => {
                    const char = activeScript === 'katakana' ? item.katakana : item.hiragana;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleKeyClick(item)}
                        className="kana-key bg-white hover:bg-[#ffe4e6] text-[#0b1a3d] py-2 sm:py-2.5 px-1 flex items-center justify-center rounded-lg border-2 border-[#0b1a3d]"
                      >
                        <span className="text-2xl sm:text-3xl font-bold font-kana leading-none">
                          {char}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: YOON (拗音) - NO ROMAJI HINTS */}
        {activeTab === 'yoon' && (
          <div className="space-y-2">
            {yoonRows.map((row) => (
              <div
                key={row.id}
                className="bg-white border-2 border-[#0b1a3d]/20 rounded-xl p-2.5"
              >
                <div className="text-xs font-bungee text-[#10b981] uppercase mb-2">
                  {row.name}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
                  {row.items.map((item) => {
                    const char = activeScript === 'katakana' ? item.katakana : item.hiragana;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleKeyClick(item)}
                        className="kana-key bg-white hover:bg-[#d1fae5] text-[#0b1a3d] py-2 sm:py-2.5 px-1 flex items-center justify-center rounded-lg border-2 border-[#0b1a3d]"
                      >
                        <span className="text-xl sm:text-2xl font-bold font-kana leading-none">
                          {char}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extra katakana sound extender (chouonpu ー) in katakana mode */}
      {activeScript === 'katakana' && (
        <div className="mt-2 pt-2 border-t border-[#0b1a3d]/15 flex items-center justify-end gap-2">
          <span className="text-xs font-bold text-gray-600">Vokal Panjang:</span>
          <button
            onClick={() => {
              playKeyClickSound();
              onSelectKana('ー');
            }}
            className="retro-btn retro-btn-yellow px-3 py-1 text-base font-kana font-bold"
          >
            ー
          </button>
        </div>
      )}
    </div>
  );
};
