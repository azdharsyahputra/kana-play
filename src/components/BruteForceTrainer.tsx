import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { KANA_ROWS, checkRomajiMatch } from '../data/kanaData';
import { DrillDirection, KanaItem, KanaScript, UserStats } from '../types';
import { KanaKeyboard } from './KanaKeyboard';
import { Starburst } from './Starburst';
import { playCorrectSound, playIncorrectSound, playLevelUpSound, speakJapanese } from '../utils/audio';
import { recordKanaAnswer, saveUserStats } from '../utils/storage';
import { Volume2, Zap, ArrowRight, RotateCcw, CheckCircle2, XCircle, Award, Sparkles, AlertCircle } from 'lucide-react';

interface BruteForceTrainerProps {
  script: KanaScript;
  direction: DrillDirection;
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  selectedLevel: number;
  onSelectLevel: (lvl: number) => void;
}

export const BruteForceTrainer: React.FC<BruteForceTrainerProps> = ({
  script,
  direction,
  stats,
  onUpdateStats,
  selectedLevel,
  onSelectLevel,
}) => {
  const [currentPrompt, setCurrentPrompt] = useState<{
    item: KanaItem;
    activeScript: 'hiragana' | 'katakana';
  } | null>(null);

  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lastAnswerInfo, setLastAnswerInfo] = useState<{
    wasCorrect: boolean;
    item: KanaItem;
    targetChar: string;
    targetRomaji: string;
  } | null>(null);

  const [levelUpCelebration, setLevelUpCelebration] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastItemIdRef = useRef<string | null>(null);

  // Determine current active row based on selectedLevel
  const currentRow = KANA_ROWS.find(r => r.level === selectedLevel) || KANA_ROWS[0];

  // Check mastery status of current row
  const rowItemsStatus = currentRow.items.map(item => {
    const activeScript = script === 'katakana' ? 'katakana' : 'hiragana';
    const key = `${activeScript}:${item.id}`;
    const mastery = stats.kanaMasteryMap[key] || {
      correctCount: 0,
      incorrectCount: 0,
      currentStreak: 0,
      mastered: false,
    };
    return {
      item,
      mastery,
      char: activeScript === 'katakana' ? item.katakana : item.hiragana,
    };
  });

  const allRowMastered = rowItemsStatus.every(s => s.mastery.mastered);

  // Phase is derived from mastery: PRACTICE drills only this row; once passed,
  // REVIEW shuffles every row from A up to this level so older rows stay fresh.
  const isReview = allRowMastered;
  const poolItems: KanaItem[] = isReview
    ? KANA_ROWS.filter(r => r.level <= selectedLevel).flatMap(r => r.items)
    : currentRow.items;

  // Pick random next item from the pool, preventing same character twice in a row
  const pickNextQuestion = (prevId?: string) => {
    if (poolItems.length === 0) return;
    const currentPrev = prevId ?? lastItemIdRef.current;

    // Weight items that are not mastered higher
    let weightedItems: KanaItem[] = [];
    poolItems.forEach(item => {
      const hKey = `hiragana:${item.id}`;
      const kKey = `katakana:${item.id}`;
      const isMastered = stats.kanaMasteryMap[hKey]?.mastered && stats.kanaMasteryMap[kKey]?.mastered;
      
      const weight = isMastered ? 1 : 4;
      for (let i = 0; i < weight; i++) {
        weightedItems.push(item);
      }
    });

    // Ensure we don't pick the same item consecutively if more than 1 item exists
    if (poolItems.length > 1 && currentPrev) {
      const filtered = weightedItems.filter(item => item.id !== currentPrev);
      if (filtered.length > 0) {
        weightedItems = filtered;
      }
    }

    const randomItem = weightedItems[Math.floor(Math.random() * weightedItems.length)] || poolItems[0];
    lastItemIdRef.current = randomItem.id;

    // Pick script
    let chosenScript: 'hiragana' | 'katakana' = 'hiragana';
    if (script === 'katakana') {
      chosenScript = 'katakana';
    } else if (script === 'mixed') {
      chosenScript = Math.random() > 0.5 ? 'katakana' : 'hiragana';
    }

    setCurrentPrompt({
      item: randomItem,
      activeScript: chosenScript,
    });
    setInputVal('');
    setFeedback(null);

    // Auto-focus input in normal mode
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Initial pick or when row / script changes
  useEffect(() => {
    pickNextQuestion();
  }, [selectedLevel, script]);

  // Evaluate user submission
  const handleSubmitAnswer = (givenAnswer: string) => {
    if (!currentPrompt) return;
    const { item, activeScript } = currentPrompt;
    const key = `${activeScript}:${item.id}`;
    const targetChar = activeScript === 'katakana' ? item.katakana : item.hiragana;
    const targetRomaji = item.romaji;

    let isCorrect = false;

    if (direction === 'kana_to_romaji') {
      // Normal mode: check romaji typing
      isCorrect = checkRomajiMatch(givenAnswer, targetRomaji);
    } else {
      // Reverse mode: check if selected/typed kana matches
      isCorrect = givenAnswer.trim() === targetChar || givenAnswer.trim() === item.hiragana || givenAnswer.trim() === item.katakana;
    }

    if (isCorrect) {
      setFeedback('correct');
      playCorrectSound(stats.currentStreak + 1);
      speakJapanese(targetChar);

      const { nextStats, justMastered } = recordKanaAnswer(stats, key, true, 4);

      // Check if this answer just mastered all items in current level and unlocked next level!
      const currentLevelRow = KANA_ROWS.find(r => r.level === selectedLevel);
      if (currentLevelRow) {
        const checkAllNow = currentLevelRow.items.every(i => {
          const k = `${activeScript}:${i.id}`;
          return nextStats.kanaMasteryMap[k]?.mastered;
        });

        if (checkAllNow && justMastered) {
          // LEVEL PASSED! Track furthest level reached, then switch to review
          const upgradedStats: UserStats = {
            ...nextStats,
            bruteForceLevel: Math.max(nextStats.bruteForceLevel, Math.min(selectedLevel + 1, KANA_ROWS.length)),
          };
          onUpdateStats(upgradedStats);
          saveUserStats(upgradedStats);
          triggerLevelUpCelebration();
        } else {
          onUpdateStats(nextStats);
        }
      } else {
        onUpdateStats(nextStats);
      }

      setLastAnswerInfo({
        wasCorrect: true,
        item,
        targetChar,
        targetRomaji,
      });

      // Advance promptly to next question
      setTimeout(() => {
        pickNextQuestion();
      }, 350);
    } else {
      setFeedback('incorrect');
      playIncorrectSound();

      const { nextStats } = recordKanaAnswer(stats, key, false);
      onUpdateStats(nextStats);

      setLastAnswerInfo({
        wasCorrect: false,
        item,
        targetChar,
        targetRomaji,
      });

      // Clear input so user can try again or see error
      setInputVal('');
    }
  };

  const triggerLevelUpCelebration = () => {
    setLevelUpCelebration(true);
    playLevelUpSound();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ffd200', '#0c389c', '#d9261c', '#10b981'],
    });

    setTimeout(() => setLevelUpCelebration(false), 2400);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer(inputVal);
    }
  };

  // Instant typing validation for normal mode (e.g. typing "a" immediately validates)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    if (direction === 'kana_to_romaji' && currentPrompt) {
      if (checkRomajiMatch(val, currentPrompt.item.romaji)) {
        handleSubmitAnswer(val);
      }
    }
  };

  if (!currentPrompt) return null;

  const currentKanaChar =
    currentPrompt.activeScript === 'katakana'
      ? currentPrompt.item.katakana
      : currentPrompt.item.hiragana;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. BRUTE FORCE BANNER & LEVEL STATUS */}
      <div className="retro-card p-4 sm:p-5 bg-white order-last sm:order-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#0b1a3d]/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#0c389c] text-white text-xs font-black uppercase px-2.5 py-1 rounded-md">
                LEVEL {currentRow.level} OF {KANA_ROWS.length}
              </span>
              <span className="font-bungee text-lg sm:text-xl text-[#0b1a3d]">
                {currentRow.name} — {currentRow.label}
              </span>
            </div>
            <p className="text-xs font-bold text-gray-600 mt-0.5">
              {isReview ? (
                <>
                  <span className="text-[#047857]">★ REVIEW</span> — level lulus! Soal diacak dari baris A sampai level ini biar makin nempel.
                </>
              ) : (
                <>
                  <span className="text-[#0c389c]">◎ FOKUS</span> — latih baris ini sampai semua huruf <strong>MASTERED (★)</strong>, lalu lanjut ke mode review.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {allRowMastered && selectedLevel < KANA_ROWS.length && (
              <button
                onClick={() => onSelectLevel(selectedLevel + 1)}
                className="retro-btn retro-btn-yellow px-3 py-1.5 text-xs flex items-center gap-1.5 animate-bounce"
              >
                <span>NEXT LEVEL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. MINI MASTERY TRACKER TILES */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-3">
          {rowItemsStatus.map(({ item, mastery, char }) => {
            const streak = mastery.currentStreak || 0;
            const isMastered = mastery.mastered;

            return (
              <div
                key={item.id}
                className={`p-2 sm:p-2.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  isMastered
                    ? 'bg-[#d1fae5] border-[#10b981] text-[#065f46] shadow-[2px_2px_0px_#10b981]'
                    : streak > 0
                    ? 'bg-[#fffbeb] border-[#f59e0b] text-[#92400e]'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between w-full px-1">
                  <span className="text-[10px] font-black uppercase font-mono">{item.romaji}</span>
                  {isMastered ? (
                    <span className="text-[10px] text-[#10b981] font-black">★ MASTER</span>
                  ) : (
                    <span className="text-[10px] font-bold">{streak}/4</span>
                  )}
                </div>
                <div className="text-xl sm:text-2xl font-black font-kana my-0.5">
                  {char}
                </div>
                {/* Progress Mini Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isMastered ? 'bg-[#10b981]' : 'bg-[#ffd200]'
                    }`}
                    style={{ width: `${Math.min((streak / 4) * 100, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. LEVEL UP CELEBRATION MODAL BANNER */}
      {levelUpCelebration && (
        <div className="retro-card-yellow p-6 text-center animate-retro-pop shadow-[8px_8px_0px_#0b1a3d]">
          <Starburst variant="red" size="md" className="mx-auto mb-2">
            LEVEL UP!
          </Starburst>
          <h2 className="text-3xl font-bungee text-[#0b1a3d] uppercase mt-2">
            ★ LEVEL {selectedLevel} COMPLETE! ★
          </h2>
          <p className="text-sm font-heading font-black text-[#0c389c] mt-1">
            Luar biasa! Sekarang mode REVIEW: soal acak dari baris A sampai level {selectedLevel}.
          </p>
        </div>
      )}

      {/* 4. MAIN QUESTION CARD (Nova Play Style) */}
      <div className="retro-card bg-white p-4 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        
        {/* Direction Indicator Badge */}
        <div className="self-stretch pr-12 sm:pr-0 sm:absolute sm:top-3 sm:left-4 sm:right-16 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={`text-xs font-black uppercase px-2.5 py-1 rounded-md border ${
              direction === 'romaji_to_kana'
                ? 'bg-[#d9261c] text-white border-[#73130d]'
                : 'bg-[#0c389c] text-white border-[#071e54]'
            }`}
          >
            {direction === 'romaji_to_kana' ? '⚡ REVERSE (ROMAJI → KANA)' : '🎯 NORMAL (KANA → ROMAJI)'}
          </span>
          <span className="text-xs font-bold text-gray-500 uppercase">
            {currentPrompt.activeScript}
          </span>
        </div>

        {/* Audio Button */}
        <button
          onClick={() => speakJapanese(currentKanaChar)}
          title="Hear Audio Pronunciation"
          className="absolute top-3 right-4 retro-btn retro-btn-white p-2 rounded-lg text-[#0c389c] flex items-center gap-1 shadow-[2px_2px_0px_#0b1a3d]"
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-[10px] hidden sm:inline">AUDIO</span>
        </button>

        {/* BIG CHARACTER DISPLAY */}
        <div className="my-4 sm:my-6">
          {direction === 'kana_to_romaji' ? (
            // NORMAL: Show Kana
            <div
              className={`text-7xl sm:text-9xl font-black font-kana select-none text-[#0b1a3d] transition-transform ${
                feedback === 'correct'
                  ? 'animate-retro-pop text-[#10b981]'
                  : feedback === 'incorrect'
                  ? 'animate-retro-shake text-[#d9261c]'
                  : ''
              }`}
            >
              {currentKanaChar}
            </div>
          ) : (
            // REVERSE: Show Romaji
            <div className="flex flex-col items-center">
              <span className="text-xs font-extrabold uppercase text-gray-500 tracking-widest mb-1">
                PILIH KANA UNTUK BUNYI:
              </span>
              <div
                className={`text-6xl sm:text-8xl font-black font-bungee tracking-wider select-none text-[#0c389c] transition-transform ${
                  feedback === 'correct'
                    ? 'animate-retro-pop text-[#10b981]'
                    : feedback === 'incorrect'
                    ? 'animate-retro-shake text-[#d9261c]'
                    : ''
                }`}
              >
                {currentPrompt.item.romaji.toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* INPUT SECTION */}
        {direction === 'kana_to_romaji' ? (
          // NORMAL MODE: Romaji text input
          <div className="w-full max-w-md space-y-2">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder="Ketik romaji (contoh: ka)..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className={`w-full text-center text-2xl font-black font-mono py-3 px-4 rounded-xl border-3 transition-all outline-none ${
                  feedback === 'correct'
                    ? 'border-[#10b981] bg-[#d1fae5] text-[#065f46]'
                    : feedback === 'incorrect'
                    ? 'border-[#d9261c] bg-[#ffe4e6] text-[#991b1b]'
                    : 'border-[#0b1a3d] bg-[#f6eedf] focus:bg-white text-[#0b1a3d] focus:border-[#0c389c] shadow-[4px_4px_0px_#0b1a3d]'
                }`}
              />
              <button
                onClick={() => handleSubmitAnswer(inputVal)}
                className="retro-btn retro-btn-yellow py-3.5 px-5 text-sm shrink-0"
              >
                OK
              </button>
            </div>
            <p className="hidden sm:block text-[11px] font-bold text-gray-500">
              Tekan <kbd className="px-1.5 py-0.5 bg-gray-200 border border-gray-400 rounded text-[10px]">Enter</kbd> atau biarkan otomatis verifikasi saat mengetik.
            </p>
          </div>
        ) : (
          // REVERSE MODE: Interactive On-Screen Kana Keyboard!
          <div className="w-full mt-2">
            <KanaKeyboard
              script={currentPrompt.activeScript}
              focusCandidates={poolItems}
              onSelectKana={(selectedChar) => {
                handleSubmitAnswer(selectedChar);
              }}
            />
          </div>
        )}

        {/* LAST ANSWER FEEDBACK BANNER */}
        {lastAnswerInfo && !lastAnswerInfo.wasCorrect && (
          <div className="mt-4 p-3 bg-[#ffe4e6] border-2 border-[#d9261c] rounded-xl text-[#991b1b] flex items-center justify-center gap-2 max-w-md w-full animate-retro-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold">
              Jawaban yang benar: <strong>{lastAnswerInfo.targetChar}</strong> ({lastAnswerInfo.targetRomaji.toUpperCase()})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
