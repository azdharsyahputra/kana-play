import React, { useState, useEffect, useRef } from 'react';
import { KANA_ROWS, ALL_KANA_ITEMS, checkRomajiMatch } from '../data/kanaData';
import { DrillDirection, KanaItem, KanaScript, UserStats } from '../types';
import { KanaKeyboard } from './KanaKeyboard';
import { playCorrectSound, playIncorrectSound, speakJapanese } from '../utils/audio';
import { recordKanaAnswer } from '../utils/storage';
import { Volume2, CheckSquare, Square, Zap, Sparkles, AlertCircle } from 'lucide-react';

interface FreeTrainerProps {
  script: KanaScript;
  direction: DrillDirection;
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export const FreeTrainer: React.FC<FreeTrainerProps> = ({
  script,
  direction,
  stats,
  onUpdateStats,
}) => {
  // Selected rows for custom practice (defaults to first 5 main rows)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([
    'row-a', 'row-k', 'row-s', 'row-t', 'row-n'
  ]);

  const [currentPrompt, setCurrentPrompt] = useState<{
    item: KanaItem;
    activeScript: 'hiragana' | 'katakana';
  } | null>(null);

  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lastError, setLastError] = useState<{ targetChar: string; targetRomaji: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastIdRef = useRef<string | null>(null);

  const activePoolItems: KanaItem[] = KANA_ROWS
    .filter(row => selectedRowIds.includes(row.id))
    .flatMap(row => row.items);

  const toggleRow = (rowId: string) => {
    setSelectedRowIds(prev => {
      if (prev.includes(rowId)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter(id => id !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  };

  const selectAllRows = () => {
    setSelectedRowIds(KANA_ROWS.map(r => r.id));
  };

  const selectMainOnly = () => {
    setSelectedRowIds(KANA_ROWS.filter(r => r.groupType === 'main').map(r => r.id));
  };

  const pickNext = (prevId?: string) => {
    const basePool = activePoolItems.length > 0 ? activePoolItems : ALL_KANA_ITEMS.slice(0, 5);
    const currentPrev = prevId ?? lastIdRef.current;

    let pool = basePool;
    if (basePool.length > 1 && currentPrev) {
      const filtered = basePool.filter(item => item.id !== currentPrev);
      if (filtered.length > 0) {
        pool = filtered;
      }
    }

    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    lastIdRef.current = randomItem.id;

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

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    pickNext();
  }, [selectedRowIds, script]);

  const handleSubmit = (val: string) => {
    if (!currentPrompt) return;
    const { item, activeScript } = currentPrompt;
    const key = `${activeScript}:${item.id}`;
    const targetChar = activeScript === 'katakana' ? item.katakana : item.hiragana;
    const targetRomaji = item.romaji;

    let isCorrect = false;
    if (direction === 'kana_to_romaji') {
      isCorrect = checkRomajiMatch(val, targetRomaji);
    } else {
      isCorrect = val.trim() === targetChar || val.trim() === item.hiragana || val.trim() === item.katakana;
    }

    if (isCorrect) {
      setFeedback('correct');
      playCorrectSound(stats.currentStreak + 1);
      speakJapanese(targetChar);

      const { nextStats } = recordKanaAnswer(stats, key, true);
      onUpdateStats(nextStats);
      setLastError(null);

      setTimeout(() => {
        pickNext();
      }, 300);
    } else {
      setFeedback('incorrect');
      playIncorrectSound();

      const { nextStats } = recordKanaAnswer(stats, key, false);
      onUpdateStats(nextStats);

      setLastError({ targetChar, targetRomaji });
      setInputVal('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    if (direction === 'kana_to_romaji' && currentPrompt) {
      if (checkRomajiMatch(val, currentPrompt.item.romaji)) {
        handleSubmit(val);
      }
    }
  };

  if (!currentPrompt) return null;

  const currentKanaChar =
    currentPrompt.activeScript === 'katakana'
      ? currentPrompt.item.katakana
      : currentPrompt.item.hiragana;

  return (
    <div className="w-full space-y-4">
      {/* 1. ROW FILTER CONTROLS */}
      <div className="retro-card p-4 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#0b1a3d]/20 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bungee text-sm sm:text-base text-[#0b1a3d]">
              🎯 CUSTOM SET SELECTION ({activePoolItems.length} KARAKTER AKTIF)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={selectMainOnly}
              className="retro-btn retro-btn-white px-2.5 py-1 text-xs"
            >
              Hanya Gojūon (46)
            </button>
            <button
              onClick={selectAllRows}
              className="retro-btn retro-btn-yellow px-2.5 py-1 text-xs"
            >
              Pilih Semua (104)
            </button>
          </div>
        </div>

        {/* Rows Checkboxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
          {KANA_ROWS.map((row) => {
            const isSelected = selectedRowIds.includes(row.id);
            return (
              <button
                key={row.id}
                onClick={() => toggleRow(row.id)}
                className={`p-1.5 text-xs rounded-lg border flex items-center gap-1.5 transition-all text-left font-bold ${
                  isSelected
                    ? 'bg-[#e0e7ff] border-[#0c389c] text-[#0c389c] shadow-[1px_1px_0px_#0c389c]'
                    : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                }`}
              >
                {isSelected ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#0c389c] shrink-0" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                )}
                <span className="truncate">{row.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DRILL CARD */}
      <div className="retro-card bg-white p-5 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-3 left-4 flex items-center gap-2">
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

        <button
          onClick={() => speakJapanese(currentKanaChar)}
          className="absolute top-3 right-4 retro-btn retro-btn-white p-2 rounded-lg text-[#0c389c] flex items-center gap-1 shadow-[2px_2px_0px_#0b1a3d]"
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-[10px] hidden sm:inline">AUDIO</span>
        </button>

        {/* CHARACTER DISPLAY */}
        <div className="my-6">
          {direction === 'kana_to_romaji' ? (
            <div
              className={`text-7xl sm:text-9xl font-black font-kana select-none text-[#0b1a3d] ${
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
            <div className="flex flex-col items-center">
              <span className="text-xs font-extrabold uppercase text-gray-500 tracking-widest mb-1">
                PILIH KANA UNTUK:
              </span>
              <div
                className={`text-6xl sm:text-8xl font-black font-bungee tracking-wider select-none text-[#0c389c] ${
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

        {/* INPUT */}
        {direction === 'kana_to_romaji' ? (
          <div className="w-full max-w-md space-y-2">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(inputVal)}
                placeholder="Ketik romaji..."
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
          </div>
        ) : (
          <div className="w-full mt-2">
            <KanaKeyboard
              script={currentPrompt.activeScript}
              onSelectKana={(selectedChar) => {
                handleSubmit(selectedChar);
              }}
            />
          </div>
        )}

        {/* ERROR FEEDBACK */}
        {lastError && (
          <div className="mt-4 p-3 bg-[#ffe4e6] border-2 border-[#d9261c] rounded-xl text-[#991b1b] flex items-center justify-center gap-2 max-w-md w-full animate-retro-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold">
              Jawaban yang benar: <strong>{lastError.targetChar}</strong> ({lastError.targetRomaji.toUpperCase()})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
