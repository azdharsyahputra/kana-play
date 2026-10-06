import React, { useState, useMemo } from 'react';
import {
  KANA_ROWS,
  DAKUTEN_MAP,
  HANDAKUTEN_MAP,
  SMALL_KANA_MAP,
  applyDakuten,
  applyHandakuten,
  toggleSmallKana,
} from '../data/kanaData';
import type { KanaItem, KanaScript } from '../types';
import { playKeyClickSound, speakJapanese } from '../utils/audio';
import { Delete, CornerDownLeft, Volume2, Shuffle, ArrowDownUp } from 'lucide-react';

interface KanaKeyboardProps {
  script: KanaScript;
  onSelectKana: (char: string) => void;
  // Multi-character builder props (for Word Reverse Mode)
  isWordMode?: boolean;
  currentBuffer?: string;
  onUpdateBuffer?: (newBuffer: string) => void;
  onDelete?: () => void;
  onClear?: () => void;
  onSubmit?: () => void;
  // Candidates focus (e.g., current brute-force row items)
  focusCandidates?: KanaItem[];
}

// Utility to shuffle an array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const KanaKeyboard: React.FC<KanaKeyboardProps> = ({
  script,
  onSelectKana,
  isWordMode = false,
  currentBuffer = '',
  onUpdateBuffer,
  onDelete,
  onClear,
  onSubmit,
  focusCandidates,
}) => {
  // Default to 'main' or 'tier' if candidates present
  const [activeTab, setActiveTab] = useState<'main' | 'dakuten' | 'yoon' | 'tier'>('main');
  const [isShuffled, setIsShuffled] = useState<boolean>(!isWordMode); // Default to standard order for word drill, randomized for recognition drill
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  const activeScript: 'hiragana' | 'katakana' = script === 'katakana' ? 'katakana' : 'hiragana';

  const handleKeyClick = (item: KanaItem) => {
    playKeyClickSound();
    const char = activeScript === 'katakana' ? item.katakana : item.hiragana;

    // Check if buffer ends with a pending modifier (e.g. user tapped ゛ then a kana)
    if (onUpdateBuffer && currentBuffer) {
      if (currentBuffer.endsWith('゛') && DAKUTEN_MAP[char]) {
        onUpdateBuffer(currentBuffer.slice(0, -1) + DAKUTEN_MAP[char]);
        return;
      }
      if (currentBuffer.endsWith('゜') && HANDAKUTEN_MAP[char]) {
        onUpdateBuffer(currentBuffer.slice(0, -1) + HANDAKUTEN_MAP[char]);
        return;
      }
      if (currentBuffer.endsWith('小') && SMALL_KANA_MAP[char]) {
        onUpdateBuffer(currentBuffer.slice(0, -1) + SMALL_KANA_MAP[char]);
        return;
      }
    }

    onSelectKana(char);
  };

  const handleTentenClick = () => {
    playKeyClickSound();
    if (!currentBuffer) {
      if (onUpdateBuffer) onUpdateBuffer('゛');
      else onSelectKana('゛');
      return;
    }

    const lastChar = currentBuffer.slice(-1);
    const prefix = currentBuffer.slice(0, -1);
    const transformed = applyDakuten(lastChar);

    if (transformed !== lastChar) {
      if (onUpdateBuffer) onUpdateBuffer(prefix + transformed);
      else {
        onDelete?.();
        onSelectKana(transformed);
      }
    } else if (lastChar === '゛') {
      if (onUpdateBuffer) onUpdateBuffer(prefix);
      else onDelete?.();
    } else {
      if (onUpdateBuffer) onUpdateBuffer(currentBuffer + '゛');
      else onSelectKana('゛');
    }
  };

  const handleMaruClick = () => {
    playKeyClickSound();
    if (!currentBuffer) {
      if (onUpdateBuffer) onUpdateBuffer('゜');
      else onSelectKana('゜');
      return;
    }

    const lastChar = currentBuffer.slice(-1);
    const prefix = currentBuffer.slice(0, -1);
    const transformed = applyHandakuten(lastChar);

    if (transformed !== lastChar) {
      if (onUpdateBuffer) onUpdateBuffer(prefix + transformed);
      else {
        onDelete?.();
        onSelectKana(transformed);
      }
    } else if (lastChar === '゜') {
      if (onUpdateBuffer) onUpdateBuffer(prefix);
      else onDelete?.();
    } else {
      if (onUpdateBuffer) onUpdateBuffer(currentBuffer + '゜');
      else onSelectKana('゜');
    }
  };

  const handleDirectSmallTsuClick = () => {
    playKeyClickSound();
    const smallTsu = activeScript === 'katakana' ? 'ッ' : 'っ';
    if (onUpdateBuffer) {
      if (currentBuffer.endsWith('小')) {
        onUpdateBuffer(currentBuffer.slice(0, -1) + smallTsu);
      } else {
        onUpdateBuffer(currentBuffer + smallTsu);
      }
    } else {
      onSelectKana(smallTsu);
    }
  };

  const handleToggleSmallClick = () => {
    playKeyClickSound();
    if (!currentBuffer) {
      if (onUpdateBuffer) onUpdateBuffer('小');
      else onSelectKana('小');
      return;
    }

    const lastChar = currentBuffer.slice(-1);
    const prefix = currentBuffer.slice(0, -1);
    const transformed = toggleSmallKana(lastChar);

    if (transformed !== lastChar) {
      if (onUpdateBuffer) onUpdateBuffer(prefix + transformed);
      else {
        onDelete?.();
        onSelectKana(transformed);
      }
    } else if (lastChar === '小') {
      if (onUpdateBuffer) onUpdateBuffer(prefix);
      else onDelete?.();
    } else {
      if (onUpdateBuffer) onUpdateBuffer(currentBuffer + '小');
      else onSelectKana('小');
    }
  };

  const handleChouonpuClick = () => {
    playKeyClickSound();
    if (onUpdateBuffer) {
      onUpdateBuffer(currentBuffer + 'ー');
    } else {
      onSelectKana('ー');
    }
  };

  const toggleShuffle = () => {
    playKeyClickSound();
    setIsShuffled(prev => !prev);
    setShuffleSeed(s => s + 1);
  };

  const reRollShuffle = () => {
    playKeyClickSound();
    setShuffleSeed(s => s + 1);
  };

  const mainRows = KANA_ROWS.filter(r => r.groupType === 'main');
  const dakuRows = KANA_ROWS.filter(r => r.groupType === 'dakuten' || r.groupType === 'handakuten');
  const yoonRows = KANA_ROWS.filter(r => r.groupType === 'youon');

  // Compute displayed candidates based on shuffle state
  const displayedFocusCandidates = useMemo(() => {
    if (!focusCandidates) return [];
    return isShuffled ? shuffleArray(focusCandidates) : focusCandidates;
  }, [focusCandidates, isShuffled, shuffleSeed]);

  // Compute all main items for grid
  const allMainItems = useMemo(() => {
    const flat = mainRows.flatMap(r => r.items);
    return isShuffled ? shuffleArray(flat) : null;
  }, [mainRows, isShuffled, shuffleSeed]);

  const allDakuItems = useMemo(() => {
    const flat = dakuRows.flatMap(r => r.items);
    return isShuffled ? shuffleArray(flat) : null;
  }, [dakuRows, isShuffled, shuffleSeed]);

  const allYoonItems = useMemo(() => {
    const flat = yoonRows.flatMap(r => r.items);
    return isShuffled ? shuffleArray(flat) : null;
  }, [yoonRows, isShuffled, shuffleSeed]);

  return (
    <div className="w-full bg-[#f6eedf] border-[3.5px] border-[#0b1a3d] rounded-2xl p-3 sm:p-4 shadow-[5px_5px_0px_#0b1a3d]">
      {/* Keyboard Header / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b-2 border-[#0b1a3d]/20 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bungee tracking-wider bg-[#0c389c] text-white px-2.5 py-1 rounded-md border border-[#071e54]">
            ⌨️ {activeScript === 'hiragana' ? 'HIRAGANA KEYPAD' : 'KATAKANA KEYPAD'}
          </span>

          {/* Shuffle Toggle Button */}
          <button
            onClick={toggleShuffle}
            title={isShuffled ? 'Urutan Diacak (Klik untuk Urutkan)' : 'Urutan Standar (Klik untuk Acak)'}
            className={`px-2 py-1 text-[11px] font-heading font-black rounded-lg border-2 flex items-center gap-1 transition-all ${
              isShuffled
                ? 'bg-[#d9261c] text-white border-[#73130d] shadow-[1px_1px_0px_#0b1a3d]'
                : 'bg-white text-[#0b1a3d] border-[#0b1a3d]/40'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{isShuffled ? 'ACAK: ON' : 'ACAK: OFF'}</span>
          </button>

          {isShuffled && (
            <button
              onClick={reRollShuffle}
              title="Kocok ulang posisi tombol"
              className="px-2 py-1 text-[11px] font-heading font-bold bg-white hover:bg-[#ffd200] text-[#0b1a3d] rounded-lg border border-[#0b1a3d]/40 flex items-center gap-1"
            >
              <ArrowDownUp className="w-3 h-3" />
              <span className="hidden sm:inline">Kocok</span>
            </button>
          )}
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
            Dakuten & Maru (濁音・半濁音 ゛/ ゜)
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

      {/* Word Mode Action Bar (Buffer & Actions) */}
      {isWordMode && (
        <div className="bg-white border-2 border-[#0b1a3d] rounded-xl p-2.5 sm:p-3 mb-3 shadow-[3px_3px_0px_#0b1a3d] space-y-2">
          {/* Row 1: Full-width Roomy Input Display Box */}
          <div className="flex items-center justify-between gap-2 bg-[#f6eedf] border-2 border-[#0b1a3d]/20 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto">
              <span className="text-[11px] font-black uppercase text-[#0c389c] bg-[#e0e7ff] px-2 py-0.5 rounded border border-[#0c389c]/30 shrink-0">
                INPUT:
              </span>
              <div className="font-kana font-bold text-2xl sm:text-3xl text-[#0b1a3d] tracking-wider flex items-center min-h-[34px]">
                {currentBuffer ? (
                  <span className="bg-[#ffd200] text-[#0b1a3d] px-3 py-0.5 rounded-lg border-2 border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d] whitespace-nowrap">
                    {currentBuffer}
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs italic font-normal">
                    (Pilih huruf di bawah untuk menyusun kata...)
                  </span>
                )}
              </div>
            </div>

            {/* Audio Button */}
            {currentBuffer && (
              <button
                type="button"
                onClick={() => speakJapanese(currentBuffer)}
                title="Dengarkan Pengucapan"
                className="retro-btn retro-btn-white p-1.5 text-xs flex items-center shrink-0"
              >
                <Volume2 className="w-4 h-4 text-[#0c389c]" />
              </button>
            )}
          </div>

          {/* Row 2: Quick Modifiers Toolbar (Tenten ゛, Bulet/Maru ゜, Sokuon っ/ッ, Kecil 小, Panjang ー) */}
          <div className="bg-[#fefce8] border-2 border-[#0b1a3d] rounded-xl p-2 shadow-[2px_2px_0px_#0b1a3d]">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase text-[#0b1a3d] tracking-wider mr-0.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#d9261c]"></span>
                  TANDA:
                </span>

                {/* Tenten ゛ (Teng-teng / Dakuten) */}
                <button
                  type="button"
                  onClick={handleTentenClick}
                  title="Tambahkan/Ubah Teng-teng (゛) pada huruf terakhir (k->g, s->z, t->d, h->b)"
                  className="retro-btn bg-[#ffd200] hover:bg-[#ffe066] text-[#0b1a3d] px-2.5 py-1 rounded-lg border-2 border-[#0b1a3d] text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_#0b1a3d] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span className="text-base sm:text-lg leading-none font-kana font-black">゛</span>
                  <span className="text-[11px] font-heading font-black">Teng-teng (゛)</span>
                </button>

                {/* Bulet / Maru ゜ (Handakuten) */}
                <button
                  type="button"
                  onClick={handleMaruClick}
                  title="Tambahkan/Ubah Bulet / Maru (゜) pada huruf terakhir (h->p)"
                  className="retro-btn bg-[#fed7aa] hover:bg-[#fdba74] text-[#0b1a3d] px-2.5 py-1 rounded-lg border-2 border-[#0b1a3d] text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_#0b1a3d] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span className="text-base sm:text-lg leading-none font-kana font-black">゜</span>
                  <span className="text-[11px] font-heading font-black">Bulet (゜)</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Sokuon langsung (っ / ッ) */}
                <button
                  type="button"
                  onClick={handleDirectSmallTsuClick}
                  title={`Ketik huruf kecil (${activeScript === 'katakana' ? 'ッ' : 'っ'})`}
                  className="retro-btn bg-[#e0e7ff] hover:bg-[#c7d2fe] text-[#0b1a3d] px-2.5 py-1 rounded-lg border-2 border-[#0b1a3d] text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_#0b1a3d] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span className="text-sm leading-none font-kana font-bold">{activeScript === 'katakana' ? 'ッ' : 'っ'}</span>
                  <span className="text-[11px] font-heading font-black">Kecil</span>
                </button>

                {/* Toggle Small / Big (小/大) */}
                <button
                  type="button"
                  onClick={handleToggleSmallClick}
                  title="Ubah huruf terakhir jadi Kecil / Besar (っ・ゃ・ゅ・ょ・ぁ)"
                  className="retro-btn bg-white hover:bg-gray-100 text-[#0b1a3d] px-2 py-1 rounded-lg border-2 border-[#0b1a3d] text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_#0b1a3d] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span className="text-[11px] font-heading font-black">小/大</span>
                </button>

                {/* Chouonpu (ー) */}
                <button
                  type="button"
                  onClick={handleChouonpuClick}
                  title="Tanda vokal panjang (ー)"
                  className="retro-btn bg-[#fbcfe8] hover:bg-[#f472b6] text-[#0b1a3d] px-2.5 py-1 rounded-lg border-2 border-[#0b1a3d] text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_#0b1a3d] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span className="text-sm leading-none font-kana font-bold">ー</span>
                  <span className="text-[11px] font-heading font-black">Panjang</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Action Controls (Clear, Hapus, Submit) */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-1 border-t border-[#0b1a3d]/10">
            <div className="text-[11px] text-gray-500 font-bold hidden sm:block">
              Tip: Tekan <strong>゛</strong> atau <strong>゜</strong> untuk bunyi teng-teng / bulet!
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              {currentBuffer && onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  title="Hapus semua input"
                  className="text-xs font-bold text-gray-500 hover:text-[#d9261c] px-2 py-1 underline transition-colors"
                >
                  Reset
                </button>
              )}

              <button
                type="button"
                onClick={onDelete}
                disabled={!currentBuffer}
                title="Hapus huruf terakhir"
                className={`retro-btn px-2.5 sm:px-3 py-1.5 text-xs flex items-center gap-1 ${
                  currentBuffer
                    ? 'retro-btn-red shadow-[2px_2px_0px_#0b1a3d]'
                    : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed shadow-none'
                }`}
              >
                <Delete className="w-3.5 h-3.5" />
                <span>HAPUS</span>
              </button>

              <button
                type="button"
                onClick={onSubmit}
                disabled={!currentBuffer}
                title="Kirim jawaban"
                className={`retro-btn px-3.5 sm:px-4 py-1.5 text-xs flex items-center gap-1.5 font-black ${
                  currentBuffer
                    ? 'retro-btn-yellow shadow-[2px_2px_0px_#0b1a3d]'
                    : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed shadow-none'
                }`}
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
                <span>SUBMIT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KEYPAD TILES: CLEAN TEXTBOOK FONT WITH NO ROMAJI / CONSONANT HINTS */}
      <div className="max-h-[290px] overflow-y-auto pr-1 space-y-2">
        
        {/* TAB: FOCUS TIER (Active Level) */}
        {activeTab === 'tier' && focusCandidates && (
          <div className="bg-white border-2 border-[#0b1a3d] rounded-xl p-3 shadow-[3px_3px_0px_#0b1a3d]">
            <div className="text-xs font-bungee text-[#0c389c] mb-2.5 uppercase tracking-wide flex items-center justify-between">
              <span>★ PILIH KARAKTER KANA:</span>
              {isShuffled && <span className="text-[10px] text-[#d9261c] font-black">🔀 Posisi Diacak</span>}
            </div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {displayedFocusCandidates.map((item) => {
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

        {/* TAB: MAIN GOJUON (五十音) */}
        {activeTab === 'main' && (
          <div className="bg-white border-2 border-[#0b1a3d]/20 rounded-xl p-2 sm:p-3">
            {isShuffled && allMainItems ? (
              // Shuffled grid of all basic kana
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {allMainItems.map((item) => {
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
            ) : (
              // Ordered rows
              <div className="space-y-1.5">
                {mainRows.map((row) => (
                  <div key={row.id} className="grid grid-cols-5 gap-1.5 sm:gap-2">
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: DAKUTEN & HANDAKUTEN (濁音・半濁音) */}
        {activeTab === 'dakuten' && (
          <div className="bg-white border-2 border-[#0b1a3d]/20 rounded-xl p-2 sm:p-3">
            {isShuffled && allDakuItems ? (
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {allDakuItems.map((item) => {
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
            ) : (
              <div className="space-y-1.5">
                {dakuRows.map((row) => (
                  <div key={row.id} className="grid grid-cols-5 gap-1.5 sm:gap-2">
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: YOON (拗音) */}
        {activeTab === 'yoon' && (
          <div className="bg-white border-2 border-[#0b1a3d]/20 rounded-xl p-2 sm:p-3">
            {isShuffled && allYoonItems ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-1.5 sm:gap-2">
                {allYoonItems.map((item) => {
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
            ) : (
              <div className="space-y-2">
                {yoonRows.map((row) => (
                  <div key={row.id} className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
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
                ))}
              </div>
            )}
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
