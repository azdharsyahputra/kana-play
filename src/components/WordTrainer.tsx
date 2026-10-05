import React, { useState, useEffect, useRef } from 'react';
import { JAPANESE_WORDS, checkWordRomajiMatch } from '../data/wordsData';
import type { DrillDirection, UserStats, WordItem } from '../types';
import { KanaKeyboard } from './KanaKeyboard';
import { playCorrectSound, playIncorrectSound, speakJapanese, playKeyClickSound } from '../utils/audio';
import { saveUserStats } from '../utils/storage';
import { Volume2, BookOpen, AlertCircle, Filter } from 'lucide-react';

interface WordTrainerProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  direction: DrillDirection;
  onSelectDirection: (dir: DrillDirection) => void;
}

export const WordTrainer: React.FC<WordTrainerProps> = ({
  stats,
  onUpdateStats,
  direction,
  onSelectDirection,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScriptFilter] = useState<'all' | 'hiragana' | 'katakana'>('all');
  
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [kanaBuffer, setKanaBuffer] = useState(''); // for reverse word mode builder
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lastAnswer, setLastAnswer] = useState<{ wasCorrect: boolean; word: WordItem } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastWordIdRef = useRef<string | null>(null);

  const filteredWords = JAPANESE_WORDS.filter(w => {
    const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
    const matchScript = selectedScriptFilter === 'all' || w.script === selectedScriptFilter;
    return matchCat && matchScript;
  });

  const pickNextWord = (prevId?: string) => {
    const basePool = filteredWords.length > 0 ? filteredWords : JAPANESE_WORDS;
    const currentPrev = prevId ?? lastWordIdRef.current;

    let pool = basePool;
    if (basePool.length > 1 && currentPrev) {
      const filtered = basePool.filter(w => w.id !== currentPrev);
      if (filtered.length > 0) {
        pool = filtered;
      }
    }

    const randomWord = pool[Math.floor(Math.random() * pool.length)];
    lastWordIdRef.current = randomWord.id;

    setCurrentWord(randomWord);
    setInputVal('');
    setKanaBuffer('');
    setFeedback(null);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    pickNextWord();
  }, [selectedCategory, selectedScriptFilter]);

  const handleSubmit = (submittedStr: string) => {
    if (!currentWord) return;

    let isCorrect = false;

    if (direction === 'kana_to_romaji') {
      // Normal: user inputs romaji
      isCorrect = checkWordRomajiMatch(submittedStr, currentWord.romaji);
    } else {
      // Reverse: user inputs kana sequence
      const cleanSubmit = submittedStr.trim();
      const cleanTarget = currentWord.kana.trim();
      isCorrect = cleanSubmit === cleanTarget;
    }

    if (isCorrect) {
      setFeedback('correct');
      playCorrectSound(stats.currentStreak + 1);
      speakJapanese(currentWord.kana);

      // Track mastered words
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
      }, 500);
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
    }
  };

  // Kana keypad handlers for Reverse Mode
  const handleKeypadSelect = (char: string) => {
    const newBuf = kanaBuffer + char;
    setKanaBuffer(newBuf);

    // If buffer length equals target kana length, auto-check!
    if (currentWord && newBuf.length === currentWord.kana.length) {
      handleSubmit(newBuf);
    }
  };

  const handleKeypadDelete = () => {
    setKanaBuffer(prev => prev.slice(0, -1));
  };

  const handleKeypadSubmit = () => {
    handleSubmit(kanaBuffer);
  };

  if (!currentWord) return null;

  return (
    <div className="w-full space-y-4">
      {/* 1. FILTER & CONTROLS BANNER */}
      <div className="retro-card p-4 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#0b1a3d]/20 mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0c389c]" />
            <span className="font-bungee text-sm sm:text-base text-[#0b1a3d]">
              📚 JAPANESE VOCABULARY DRILL ({filteredWords.length} KATA)
            </span>
          </div>

          {/* Direction Switcher Pill */}
          <div className="flex items-center gap-1 bg-[#f6eedf] p-1 rounded-xl border-2 border-[#0b1a3d]">
            <button
              onClick={() => {
                playKeyClickSound();
                onSelectDirection('kana_to_romaji');
              }}
              className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all ${
                direction === 'kana_to_romaji'
                  ? 'bg-[#0c389c] text-white shadow-[1px_1px_0px_#0b1a3d]'
                  : 'text-[#0b1a3d] hover:bg-white'
              }`}
            >
              Normal (Kana → Romaji)
            </button>
            <button
              onClick={() => {
                playKeyClickSound();
                onSelectDirection('romaji_to_kana');
              }}
              className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all ${
                direction === 'romaji_to_kana'
                  ? 'bg-[#d9261c] text-white shadow-[1px_1px_0px_#0b1a3d]'
                  : 'text-[#0b1a3d] hover:bg-white'
              }`}
            >
              ⚡ Reverse (Romaji → Kana Pad)
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-black uppercase text-gray-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Kategori:
          </span>
          {[
            { id: 'all', label: 'Semua Kategori' },
            { id: 'basics', label: 'Salam & Dasar' },
            { id: 'food', label: 'Makanan & Minuman' },
            { id: 'animals', label: 'Hewan' },
            { id: 'daily', label: 'Benda & Harian' },
            { id: 'anime', label: 'Anime & Game' },
            { id: 'jlpt5', label: 'JLPT N5 Core' },
            { id: 'nature', label: 'Alam & Musim' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playKeyClickSound();
                setSelectedCategory(cat.id);
              }}
              className={`px-2.5 py-1 text-xs font-heading font-bold rounded-lg border transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#ffd200] border-[#0b1a3d] text-[#0b1a3d] font-black shadow-[2px_2px_0px_#0b1a3d]'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-[#0b1a3d]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. WORD DRILL CARD */}
      <div className="retro-card bg-white p-5 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        
        {/* Top Badges */}
        <div className="absolute top-3 left-4 flex items-center gap-2">
          <span
            className={`text-xs font-black uppercase px-2.5 py-1 rounded-md border ${
              direction === 'romaji_to_kana'
                ? 'bg-[#d9261c] text-white border-[#73130d]'
                : 'bg-[#0c389c] text-white border-[#071e54]'
            }`}
          >
            {direction === 'romaji_to_kana' ? '⚡ REVERSE WORD DRILL' : '🎯 NORMAL WORD DRILL'}
          </span>
          <span className="text-xs font-bold text-gray-500 uppercase bg-gray-100 px-2 py-0.5 rounded">
            {currentWord.category}
          </span>
        </div>

        {/* Audio Button */}
        <button
          onClick={() => speakJapanese(currentWord.kana)}
          title="Hear Audio Pronunciation"
          className="absolute top-3 right-4 retro-btn retro-btn-white p-2 rounded-lg text-[#0c389c] flex items-center gap-1 shadow-[2px_2px_0px_#0b1a3d]"
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-[10px] hidden sm:inline">AUDIO</span>
        </button>

        {/* WORD DISPLAY */}
        <div className="my-6">
          {direction === 'kana_to_romaji' ? (
            // NORMAL: Show Kana Word
            <div className="flex flex-col items-center">
              {currentWord.kanji && (
                <span className="text-xl sm:text-2xl font-black text-gray-400 font-kana mb-1">
                  [{currentWord.kanji}]
                </span>
              )}
              <div
                className={`text-5xl sm:text-7xl font-black font-kana select-none text-[#0b1a3d] tracking-wider transition-transform ${
                  feedback === 'correct'
                    ? 'animate-retro-pop text-[#10b981]'
                    : feedback === 'incorrect'
                    ? 'animate-retro-shake text-[#d9261c]'
                    : ''
                }`}
              >
                {currentWord.kana}
              </div>
              <div className="mt-2 text-sm font-extrabold text-[#d9261c] bg-[#ffe4e6] px-3 py-1 rounded-full border border-[#d9261c]/30">
                Arti: {currentWord.indonesian} / {currentWord.english}
              </div>
            </div>
          ) : (
            // REVERSE: Show Romaji + Meaning
            <div className="flex flex-col items-center">
              <span className="text-xs font-black uppercase text-[#0c389c] tracking-widest mb-1">
                SUSUN KANA UNTUK KATA INI:
              </span>
              <div
                className={`text-4xl sm:text-6xl font-black font-bungee tracking-wide text-[#0b1a3d] transition-transform ${
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
                Arti: {currentWord.indonesian} ({currentWord.english})
              </div>
            </div>
          )}
        </div>

        {/* INPUT SECTION */}
        {direction === 'kana_to_romaji' ? (
          // NORMAL MODE INPUT (Typing Romaji)
          <div className="w-full max-w-md space-y-2">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputVal(val);
                  if (checkWordRomajiMatch(val, currentWord.romaji)) {
                    handleSubmit(val);
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(inputVal)}
                placeholder="Ketik romaji (contoh: arigatou)..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full text-center text-2xl font-black font-mono py-3 px-4 rounded-xl border-3 border-[#0b1a3d] bg-[#f6eedf] focus:bg-white text-[#0b1a3d] shadow-[4px_4px_0px_#0b1a3d] outline-none"
              />
              <button
                onClick={() => handleSubmit(inputVal)}
                className="retro-btn retro-btn-yellow py-3.5 px-5 text-sm shrink-0"
              >
                OK
              </button>
            </div>
            <p className="text-[11px] font-bold text-gray-500">
              Ketik bacaan Romaji dari kata di atas lalu tekan Enter.
            </p>
          </div>
        ) : (
          // REVERSE MODE: Interactive Kana Builder Keypad!
          <div className="w-full mt-2">
            <KanaKeyboard
              script={currentWord.script === 'katakana' ? 'katakana' : 'hiragana'}
              isWordMode={true}
              currentBuffer={kanaBuffer}
              onSelectKana={handleKeypadSelect}
              onDelete={handleKeypadDelete}
              onSubmit={handleKeypadSubmit}
            />
          </div>
        )}

        {/* LAST ANSWER ERROR BANNER */}
        {lastAnswer && !lastAnswer.wasCorrect && (
          <div className="mt-4 p-3 bg-[#ffe4e6] border-2 border-[#d9261c] rounded-xl text-[#991b1b] flex items-center justify-center gap-2 max-w-md w-full animate-retro-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold">
              Jawaban yang benar: <strong>{lastAnswer.word.kana}</strong> ({lastAnswer.word.romaji.toUpperCase()} - {lastAnswer.word.indonesian})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
