import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TIME_WORDS, JIKAN_MNEMONICS, JikanMnemonicGroup } from '../data/timeWordsData';
import { checkWordRomajiMatch } from '../data/wordsData';
import type { DrillDirection, UserStats, WordItem } from '../types';
import { KanaKeyboard } from './KanaKeyboard';
import { playCorrectSound, playIncorrectSound, speakJapanese, playKeyClickSound } from '../utils/audio';
import { saveUserStats } from '../utils/storage';
import {
  Volume2,
  BookOpen,
  AlertCircle,
  Sparkles,
  Calendar,
  Clock,
  Layers,
  CheckSquare,
  Square,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Zap,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface JikanTrainerProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  initialSubCategory?: string;
}

type DrillInputMode = 'choice' | 'typing' | 'reverse';

interface SubCategoryOption {
  id: string;
  label: string;
  icon: string;
  badge: string;
  count: number;
}

export const JikanTrainer: React.FC<JikanTrainerProps> = ({
  stats,
  onUpdateStats,
  initialSubCategory = 'all',
}) => {
  // Free Drill Category Checkboxes
  const [selectedSubCats, setSelectedSubCats] = useState<string[]>([
    'time_days',
    'time_relative',
    'time_dates_special',
    'time_sentences',
  ]);

  const [inputMode, setInputMode] = useState<DrillInputMode>('choice');
  const [direction, setDirection] = useState<DrillDirection>('kana_to_romaji');

  // Mnemonic Drawer visibility
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [activeMnemonicTab, setActiveMnemonicTab] = useState<string>('days');

  // Question State
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [kanaBuffer, setKanaBuffer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [lastAnswer, setLastAnswer] = useState<{ wasCorrect: boolean; word: WordItem } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastWordIdRef = useRef<string | null>(null);

  // Subcategory list definitions
  const subCategoryOptions: SubCategoryOption[] = useMemo(() => [
    {
      id: 'time_days',
      label: '🗓️ 7 Hari (Senin - Minggu + Tanya)',
      icon: '🗓️',
      badge: 'Hari',
      count: TIME_WORDS.filter(w => w.subCategories?.includes('time_days')).length,
    },
    {
      id: 'time_months',
      label: '🌕 12 Bulan (Jan - Des + Khusus 4/7/9)',
      icon: '🌕',
      badge: 'Bulan',
      count: TIME_WORDS.filter(w => w.subCategories?.includes('time_months')).length,
    },
    {
      id: 'time_dates_special',
      label: '📌 Tanggal Spesial (Tsuitachi, Futsuka, Hatsuka...)',
      icon: '📌',
      badge: 'Spesial',
      count: TIME_WORDS.filter(w => w.subCategories?.includes('time_dates_special')).length,
    },
    {
      id: 'time_dates',
      label: '🔢 Semua Tanggal Lengkap (1 - 31)',
      icon: '🔢',
      badge: '1-31',
      count: TIME_WORDS.filter(w => w.subCategories?.includes('time_dates')).length,
    },
    {
      id: 'time_relative',
      label: '⏳ Waktu Relatif (Hari Ini, Besok, Lusa, Kemarin...)',
      icon: '⏳',
      badge: 'Relatif',
      count: TIME_WORDS.filter(w => w.subCategories?.includes('time_relative')).length,
    },
    {
      id: 'time_sentences',
      label: '💬 Kalimat & Komunikasi Waktu (Percakapan)',
      icon: '💬',
      badge: 'Kalimat',
      count: TIME_WORDS.filter(w => w.subCategories?.includes('time_sentences')).length,
    },
  ], []);

  // Filter words according to active checkboxes
  const activePool = useMemo(() => {
    if (selectedSubCats.length === 0) return TIME_WORDS;
    return TIME_WORDS.filter(w =>
      selectedSubCats.some(sub => w.subCategories?.includes(sub))
    );
  }, [selectedSubCats]);

  // Toggle Category Checkbox
  const toggleSubCat = (id: string) => {
    playKeyClickSound();
    setSelectedSubCats(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter(c => c !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const selectAllSubCats = () => {
    playKeyClickSound();
    setSelectedSubCats(subCategoryOptions.map(o => o.id));
  };

  const selectPreset = (type: 'days_rel' | 'special_dates' | 'sentences') => {
    playKeyClickSound();
    if (type === 'days_rel') {
      setSelectedSubCats(['time_days', 'time_relative']);
    } else if (type === 'special_dates') {
      setSelectedSubCats(['time_dates_special', 'time_months']);
    } else if (type === 'sentences') {
      setSelectedSubCats(['time_sentences']);
    }
  };

  // Generate 4 multiple choices for rapid recognition mode
  const generateChoices = (targetWord: WordItem, pool: WordItem[]) => {
    const isSentence = targetWord.subCategories?.includes('time_sentences');
    // Filter distractors from same type if possible
    const sameTypePool = pool.filter(w =>
      w.id !== targetWord.id &&
      Boolean(w.subCategories?.includes('time_sentences')) === isSentence
    );
    const candidatePool = sameTypePool.length >= 3 ? sameTypePool : pool.filter(w => w.id !== targetWord.id);

    // Shuffle and pick 3 distractors
    const shuffled = [...candidatePool].sort(() => 0.5 - Math.random());
    const distractors = shuffled.slice(0, 3).map(w => w.indonesian);

    const allChoices = [targetWord.indonesian, ...distractors].sort(() => 0.5 - Math.random());
    return allChoices;
  };

  // Pick Next Word
  const pickNextWord = (prevId?: string) => {
    const basePool = activePool.length > 0 ? activePool : TIME_WORDS;
    const currentPrev = prevId ?? lastWordIdRef.current;

    let pool = basePool;
    if (basePool.length > 1 && currentPrev) {
      const filtered = basePool.filter(w => w.id !== currentPrev);
      if (filtered.length > 0) {
        pool = filtered;
      }
    }

    const randomWord = pool[Math.floor(Math.random() * pool.length)];
    lastWordIdRef.current = randomWord ? randomWord.id : null;

    setCurrentWord(randomWord || null);
    setInputVal('');
    setKanaBuffer('');
    setFeedback(null);
    setSelectedChoice(null);

    if (randomWord) {
      setChoices(generateChoices(randomWord, basePool));
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    pickNextWord();
  }, [selectedSubCats]);

  // Handle Answers
  const handleAnswerResult = (isCorrect: boolean, chosenText?: string) => {
    if (!currentWord) return;

    if (chosenText) {
      setSelectedChoice(chosenText);
    }

    if (isCorrect) {
      setFeedback('correct');
      playCorrectSound(stats.currentStreak + 1);
      speakJapanese(currentWord.kana);

      const nextWordsMastered = Array.from(new Set([...stats.wordsMastered, currentWord.id]));
      const nextStats: UserStats = {
        ...stats,
        totalAnswered: stats.totalAnswered + 1,
        totalCorrect: stats.totalCorrect + 1,
        currentStreak: stats.currentStreak + 1,
        bestStreak: Math.max(stats.bestStreak, stats.currentStreak + 1),
        wordsMastered: nextWordsMastered,
      };

      onUpdateStats(nextStats);
      saveUserStats(nextStats);
      setLastAnswer({ wasCorrect: true, word: currentWord });

      setTimeout(() => {
        pickNextWord();
      }, 550);
    } else {
      setFeedback('incorrect');
      playIncorrectSound();

      const nextStats: UserStats = {
        ...stats,
        totalAnswered: stats.totalAnswered + 1,
        currentStreak: 0,
      };
      onUpdateStats(nextStats);
      saveUserStats(nextStats);

      setLastAnswer({ wasCorrect: false, word: currentWord });
      setInputVal('');
      setKanaBuffer('');
    }
  };

  // Multiple Choice click handler
  const handleChoiceClick = (choice: string) => {
    if (!currentWord || feedback !== null) return;
    const isCorrect = choice === currentWord.indonesian;
    handleAnswerResult(isCorrect, choice);
  };

  // Typing submit handler
  const handleTypingSubmit = (val: string) => {
    if (!currentWord || feedback !== null) return;
    const isCorrect = checkWordRomajiMatch(val, currentWord.romaji, currentWord.altRomaji);
    handleAnswerResult(isCorrect);
  };

  // Reverse Keypad handlers
  const handleKeypadSelect = (char: string) => {
    const newBuf = kanaBuffer + char;
    setKanaBuffer(newBuf);

    const cleanTarget = currentWord ? currentWord.kana.replace(/[\s\-_ー.,?!~〜。、！？\(\)\[\]]/g, '') : '';
    if (currentWord && newBuf.length === cleanTarget.length) {
      const cleanSubmit = newBuf.replace(/[\s\-_ー.,?!~〜。、！？\(\)\[\]]/g, '');
      const isCorrect = cleanSubmit === cleanTarget;
      handleAnswerResult(isCorrect);
    }
  };

  const handleKeypadDelete = () => {
    setKanaBuffer(prev => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setKanaBuffer('');
  };

  const handleKeypadSubmit = () => {
    if (!currentWord) return;
    const cleanTarget = currentWord.kana.replace(/[\s\-_ー.,?!~〜。、！？\(\)\[\]]/g, '');
    const cleanSubmit = kanaBuffer.replace(/[\s\-_ー.,?!~〜。、！？\(\)\[\]]/g, '');
    const isCorrect = cleanSubmit === cleanTarget;
    handleAnswerResult(isCorrect);
  };

  // Physical keyboard shortcuts: 1, 2, 3, 4 for choices, Enter for typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inputMode === 'choice' && choices.length === 4) {
        if (e.key === '1') handleChoiceClick(choices[0]);
        if (e.key === '2') handleChoiceClick(choices[1]);
        if (e.key === '3') handleChoiceClick(choices[2]);
        if (e.key === '4') handleChoiceClick(choices[3]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputMode, choices, currentWord, feedback]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. RETRO HERO BANNER & MNEMONIC DRAWER BUTTON */}
      <div className="retro-card p-4 sm:p-5 bg-white border-3 border-[#0b1a3d] shadow-[4px_4px_0px_#0b1a3d]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b-2 border-[#0b1a3d]/20 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#ffd200] border-2 border-[#0b1a3d] flex items-center justify-center text-2xl shadow-[2px_2px_0px_#0b1a3d] shrink-0">
              ⏰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bungee text-base sm:text-xl text-[#0b1a3d] leading-none">
                  JIKAN NO KOTOBA DRILL
                </h2>
                <span className="text-[10px] bg-[#d9261c] text-white px-2 py-0.5 rounded font-bungee animate-pulse">
                  BARU!
                </span>
              </div>
              <p className="text-xs font-bold text-gray-600 mt-1">
                Latihan Bebas Hari, Bulan, Tanggal Spesial, Waktu Relatif & Komunikasi Kalimat
              </p>
            </div>
          </div>

          {/* Quick Cheat Sheet Drawer Trigger */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                playKeyClickSound();
                setShowMnemonic(!showMnemonic);
              }}
              className={`retro-btn px-3 py-1.5 text-xs font-heading font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                showMnemonic ? 'retro-btn-yellow' : 'retro-btn-white'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-[#d9261c]" />
              <span>{showMnemonic ? 'TUTUP PANDUAN HAFAL' : '💡 PANDUAN CEPAT HAFAL'}</span>
              {showMnemonic ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 2. MNEMONIC DRAWER (COLLAPSIBLE PANDUAN HAFAL) */}
        {showMnemonic && (
          <div className="mb-4 p-3.5 bg-[#fefce8] border-2 border-[#ca8a04] rounded-xl shadow-inner animate-retro-pop">
            <div className="flex items-center justify-between pb-2 border-b border-[#ca8a04]/30 mb-3">
              <span className="text-xs font-black uppercase text-[#854d0e] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#eab308] fill-current" />
                CONTEKAN KILAT (MNEMONIC & STRATEGI INGATAN JIKAN):
              </span>
              <span className="text-[10px] font-bold text-[#854d0e] bg-white px-2 py-0.5 rounded-full border border-[#ca8a04]/30">
                Tekan tombol untuk beralih topik
              </span>
            </div>

            {/* Mnemonic Tab Buttons */}
            <div className="flex flex-wrap gap-1 mb-3">
              {JIKAN_MNEMONICS.map(grp => (
                <button
                  key={grp.id}
                  onClick={() => {
                    playKeyClickSound();
                    setActiveMnemonicTab(grp.id);
                  }}
                  className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all cursor-pointer ${
                    activeMnemonicTab === grp.id
                      ? 'bg-[#0c389c] text-white shadow-[2px_2px_0px_#0b1a3d]'
                      : 'bg-white text-[#0b1a3d] border border-gray-300 hover:bg-[#f6eedf]'
                  }`}
                >
                  {grp.badge}
                </button>
              ))}
            </div>

            {/* Mnemonic Table Display */}
            {(() => {
              const grp = JIKAN_MNEMONICS.find(g => g.id === activeMnemonicTab) || JIKAN_MNEMONICS[0];
              return (
                <div className="space-y-2">
                  <div className="text-xs font-black text-[#0b1a3d] flex items-center justify-between">
                    <span>{grp.title}</span>
                    <span className="text-[11px] font-bold text-gray-500">{grp.subtitle}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                    {grp.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2 rounded-lg border border-[#0b1a3d]/20 text-xs shadow-sm flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-[#0c389c] font-kana text-sm">{it.kanji}</span>
                          <span className="text-gray-500 font-mono text-[11px]">{it.romaji}</span>
                        </div>
                        <div className="text-[11px] font-kana text-gray-700 mt-0.5">
                          {it.kana} = <strong>{it.meaning}</strong>
                        </div>
                        <div className="text-[10px] text-[#047857] font-semibold bg-[#ecfdf5] px-1.5 py-0.5 rounded mt-1">
                          💡 {it.mnemonic}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 3. FREE DRILL CUSTOM SELECTION (CHECKBOXES) */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-gray-200">
            <span className="text-xs font-black uppercase text-gray-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#0c389c]" /> PILIH KATEGORI UNTUK FREE DRILL ({activePool.length} KATA AKTIF):
            </span>
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={selectAllSubCats}
                className="retro-btn retro-btn-yellow px-2 py-0.5 text-[11px]"
              >
                Pilih Semua
              </button>
              <button
                onClick={() => selectPreset('days_rel')}
                className="retro-btn retro-btn-white px-2 py-0.5 text-[11px]"
              >
                🗓️ Hari & Relatif Saja
              </button>
              <button
                onClick={() => selectPreset('special_dates')}
                className="retro-btn retro-btn-white px-2 py-0.5 text-[11px]"
              >
                📌 Tanggal Spesial Saja
              </button>
              <button
                onClick={() => selectPreset('sentences')}
                className="retro-btn retro-btn-white px-2 py-0.5 text-[11px]"
              >
                💬 Percakapan Saja
              </button>
            </div>
          </div>

          {/* Checkboxes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {subCategoryOptions.map(cat => {
              const isChecked = selectedSubCats.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleSubCat(cat.id)}
                  className={`p-2 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    isChecked
                      ? 'bg-[#eff6ff] border-[#0c389c] text-[#0c389c] shadow-[2px_2px_0px_#0c389c] font-black'
                      : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#0c389c] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    <span className="truncate">{cat.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 shrink-0 ${
                      isChecked ? 'bg-[#0c389c] text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* DRILL MODE SELECTOR (Choice vs Typing vs Reverse) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-gray-200">
            <span className="text-xs font-black uppercase text-gray-500 flex items-center gap-1">
              🎮 TIPE DRILL & UJI DAYA INGAT:
            </span>
            <div className="flex items-center gap-1.5 bg-[#f6eedf] p-1 rounded-xl border-2 border-[#0b1a3d]">
              <button
                onClick={() => {
                  playKeyClickSound();
                  setInputMode('choice');
                }}
                className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all cursor-pointer ${
                  inputMode === 'choice'
                    ? 'bg-[#0c389c] text-white shadow-[1px_1px_0px_#0b1a3d]'
                    : 'text-[#0b1a3d] hover:bg-white'
                }`}
              >
                🎴 Pilihan Ganda (Cepat)
              </button>
              <button
                onClick={() => {
                  playKeyClickSound();
                  setInputMode('typing');
                }}
                className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all cursor-pointer ${
                  inputMode === 'typing'
                    ? 'bg-[#0c389c] text-white shadow-[1px_1px_0px_#0b1a3d]'
                    : 'text-[#0b1a3d] hover:bg-white'
                }`}
              >
                ⌨️ Ketik Romaji
              </button>
              <button
                onClick={() => {
                  playKeyClickSound();
                  setInputMode('reverse');
                }}
                className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all cursor-pointer ${
                  inputMode === 'reverse'
                    ? 'bg-[#d9261c] text-white shadow-[1px_1px_0px_#0b1a3d]'
                    : 'text-[#0b1a3d] hover:bg-white'
                }`}
              >
                ⚡ Susun Kana (Arcade)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN QUESTION CARD */}
      {!currentWord ? (
        <div className="retro-card bg-white p-8 text-center flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-[#d9261c]" />
          <h3 className="text-lg font-bungee text-[#0b1a3d]">TIDAK ADA KATA AKTIF</h3>
          <p className="text-sm font-bold text-gray-600">
            Centang minimal 1 kategori pada daftar di atas untuk mulai berlatih.
          </p>
          <button
            onClick={selectAllSubCats}
            className="retro-btn retro-btn-yellow px-5 py-2 text-xs font-heading font-black"
          >
            Pilih Semua Kategori
          </button>
        </div>
      ) : (
        <div className="retro-card bg-white p-4 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Top Badges */}
          <div className="self-stretch pr-12 sm:pr-0 sm:absolute sm:top-3 sm:left-4 sm:right-16 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-black uppercase bg-[#0c389c] text-white px-2.5 py-1 rounded-md border border-[#071e54]">
              {inputMode === 'choice' ? '🎴 PILIHAN GANDA' : inputMode === 'typing' ? '⌨️ KETIK ROMAJI' : '⚡ SUSUN KANA'}
            </span>
            <span className="text-xs font-black uppercase bg-[#ffd200] text-[#0b1a3d] border border-[#0b1a3d] px-2 py-0.5 rounded">
              {currentWord.subCategories?.includes('time_days')
                ? '🗓️ HARI'
                : currentWord.subCategories?.includes('time_months')
                ? '🌕 BULAN'
                : currentWord.subCategories?.includes('time_dates_special')
                ? '📌 TANGGAL SPESIAL'
                : currentWord.subCategories?.includes('time_dates')
                ? '🔢 TANGGAL'
                : currentWord.subCategories?.includes('time_sentences')
                ? '💬 KOMUNIKASI'
                : '⏳ WAKTU RELATIF'}
            </span>
            {stats.currentStreak > 0 && (
              <span className="text-xs font-black uppercase bg-[#d9261c] text-white border border-[#73130d] px-2 py-0.5 rounded flex items-center gap-1">
                <Flame className="w-3 h-3 fill-[#ffd200] text-[#ffd200]" /> STREAK {stats.currentStreak}
              </span>
            )}
          </div>

          {/* Audio Speaker Button */}
          <button
            onClick={() => speakJapanese(currentWord.kana)}
            title="Dengarkan pelafalan asli"
            className="absolute top-3 right-4 retro-btn retro-btn-white p-2 rounded-lg text-[#0c389c] flex items-center gap-1 shadow-[2px_2px_0px_#0b1a3d] cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#0c389c]" />
            <span className="text-[10px] hidden sm:inline font-bold">SUARA</span>
          </button>

          {/* QUESTION PROMPT DISPLAY */}
          <div className="my-5 sm:my-8 max-w-2xl w-full">
            {inputMode !== 'reverse' ? (
              // PROMPT KANA & KANJI
              <div className="flex flex-col items-center">
                {currentWord.kanji && (
                  <div className="text-xl sm:text-2xl font-black font-kana text-gray-500 mb-1">
                    {currentWord.kanji}
                  </div>
                )}
                <div
                  className={`text-4xl sm:text-6xl font-black font-kana tracking-wide text-[#0b1a3d] transition-transform select-none ${
                    feedback === 'correct'
                      ? 'animate-retro-pop text-[#10b981]'
                      : feedback === 'incorrect'
                      ? 'animate-retro-shake text-[#d9261c]'
                      : ''
                  }`}
                >
                  {currentWord.kana}
                </div>
                <div className="mt-2 text-sm sm:text-base font-extrabold font-mono text-[#0c389c] bg-[#e0e7ff] px-3.5 py-0.5 rounded-full border border-[#0c389c]/30">
                  {currentWord.romaji}
                </div>
              </div>
            ) : (
              // REVERSE PROMPT: SHOW ROMAJI & MEANING
              <div className="flex flex-col items-center">
                <span className="text-xs font-black uppercase text-[#0c389c] tracking-widest mb-1">
                  SUSUN KANA UNTUK:
                </span>
                <div
                  className={`text-3xl sm:text-5xl font-black font-bungee tracking-wide text-[#0b1a3d] transition-transform ${
                    feedback === 'correct'
                      ? 'animate-retro-pop text-[#10b981]'
                      : feedback === 'incorrect'
                      ? 'animate-retro-shake text-[#d9261c]'
                      : ''
                  }`}
                >
                  {currentWord.romaji.toUpperCase()}
                </div>
                <div className="mt-2 text-base font-extrabold text-[#0c389c] bg-[#e0e7ff] px-4 py-1 rounded-full border border-[#0c389c]/30">
                  Arti: {currentWord.indonesian}
                </div>
              </div>
            )}

            {/* Mnemonic / Helpful Tip Note */}
            {currentWord.notes && (
              <div className="mt-4 text-xs font-bold text-[#0b1a3d] bg-[#fefce8] px-3.5 py-2 rounded-xl border border-[#ca8a04]/40 max-w-xl mx-auto shadow-sm flex items-start gap-2 text-left">
                <span className="shrink-0 text-base">💡</span>
                <span>{currentWord.notes}</span>
              </div>
            )}
          </div>

          {/* 5. INTERACTIVE ANSWER SECTIONS */}
          {inputMode === 'choice' ? (
            // MODE 1: MULTIPLE CHOICE 4 OPTIONS (RAPID DRILL)
            <div className="w-full max-w-xl space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {choices.map((choice, idx) => {
                  let btnColor = 'bg-white border-[#0b1a3d]/25 text-[#0b1a3d] hover:bg-[#ffd200] hover:border-[#0b1a3d]';
                  if (selectedChoice !== null) {
                    if (choice === currentWord.indonesian) {
                      btnColor = 'bg-[#10b981] border-[#047857] text-white shadow-[2px_2px_0px_#047857] font-black';
                    } else if (choice === selectedChoice) {
                      btnColor = 'bg-[#d9261c] border-[#73130d] text-white shadow-[2px_2px_0px_#73130d] font-black';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={feedback !== null}
                      onClick={() => handleChoiceClick(choice)}
                      className={`p-3 sm:p-3.5 rounded-xl border-3 text-left font-bold transition-all shadow-[2px_2px_0px_#0b1a3d] flex items-center justify-between cursor-pointer active:translate-x-0.5 active:translate-y-0.5 ${btnColor}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-6 h-6 rounded-lg bg-[#0b1a3d] text-white font-bungee text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm truncate">{choice}</span>
                      </div>
                      {selectedChoice !== null && choice === currentWord.indonesian && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1" />
                      )}
                      {selectedChoice === choice && choice !== currentWord.indonesian && (
                        <XCircle className="w-4 h-4 text-white shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] font-bold text-gray-500">
                Pilih jawaban yang benar atau tekan tombol angka [1] [2] [3] [4] di keyboard.
              </p>
            </div>
          ) : inputMode === 'typing' ? (
            // MODE 2: TYPING ROMAJI (ACTIVE RECALL)
            <div className="w-full max-w-md space-y-2">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInputVal(val);
                    if (checkWordRomajiMatch(val, currentWord.romaji, currentWord.altRomaji)) {
                      handleTypingSubmit(val);
                    }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleTypingSubmit(inputVal)}
                  placeholder="Ketik romaji (contoh: getsuyoubi, asatte)..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="w-full text-center text-xl sm:text-2xl font-black font-mono py-3 px-4 rounded-xl border-3 border-[#0b1a3d] bg-[#f6eedf] focus:bg-white text-[#0b1a3d] shadow-[4px_4px_0px_#0b1a3d] outline-none"
                />
                <button
                  onClick={() => handleTypingSubmit(inputVal)}
                  className="retro-btn retro-btn-yellow py-3.5 px-5 text-sm shrink-0 cursor-pointer"
                >
                  OK
                </button>
              </div>
              <p className="text-[11px] font-bold text-gray-500">
                Ketik bacaan Romaji lalu tekan Enter atau OK.
              </p>
            </div>
          ) : (
            // MODE 3: REVERSE KEYPAD KANA BUILDER
            <div className="w-full mt-2">
              <KanaKeyboard
                script="hiragana"
                isWordMode={true}
                currentBuffer={kanaBuffer}
                onSelectKana={handleKeypadSelect}
                onDelete={handleKeypadDelete}
                onClear={handleKeypadClear}
                onSubmit={handleKeypadSubmit}
              />
            </div>
          )}

          {/* LAST ANSWER ERROR BANNER */}
          {lastAnswer && !lastAnswer.wasCorrect && (
            <div className="mt-4 p-3 bg-[#ffe4e6] border-2 border-[#d9261c] rounded-xl text-[#991b1b] flex items-center justify-center gap-2 max-w-md w-full animate-retro-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-xs font-bold">
                Jawaban benar: <strong>{lastAnswer.word.kana}</strong> ({lastAnswer.word.romaji.toUpperCase()} - {lastAnswer.word.indonesian})
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

