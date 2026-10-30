import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { UtsCategory, UtsExamConfig, UtsExamSummary, UtsQuestion } from '../types/uts';
import { ALL_UTS_QUESTIONS } from '../data/utsExamData';
import {
  generateUtsQuestions,
  generateUtsSummary,
  DEFAULT_UTS_CONFIG,
} from '../utils/utsGenerator';
import {
  playCorrectSound,
  playIncorrectSound,
  playKeyClickSound,
  speakJapanese,
  speakJapaneseParticle,
  speakJapaneseSentence,
  unlockAudio,
} from '../utils/audio';
import {
  GraduationCap,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
  Flame,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UtsExamTrainerProps {
  initialCategory?: UtsCategory;
  onSelectCategory?: (cat: UtsCategory) => void;
  onBackToHome?: () => void;
}

/**
 * Helper to match user selected option with question's correct answer.
 * Handles both exact equality and token prefix equality
 * (e.g. 'と' matches 'と (to) — dan / bersama').
 */
export const checkAnswerMatch = (userAns: string, correctAns: string): boolean => {
  if (!userAns || !correctAns) return false;
  const cleanA = userAns.trim().toLowerCase();
  const cleanB = correctAns.trim().toLowerCase();
  if (cleanA === cleanB) return true;

  const getKanaToken = (s: string) => s.split(/[\s(（—\-–]/)[0].trim().toLowerCase();
  const tokA = getKanaToken(cleanA);
  const tokB = getKanaToken(cleanB);
  return tokA.length > 0 && tokA === tokB;
};

/**
 * Extracts pure Japanese kana/word before any romaji parentheses or Indonesian translation
 * so Web Speech API TTS only pronounces the Japanese text.
 */
export const getKanaOnly = (text: string): string => {
  if (!text) return '';
  return text.split(/[\s(（—\-–]/)[0].trim();
};

/**
 * Parses rich options formatted like "と (to) — dan / bersama"
 * into structured components { main, romaji, desc }.
 */
export const parseOption = (opt: string) => {
  const match = opt.match(/^([^\s(（]+)(?:\s*[（(]([^)）]+)[)）])?(?:\s*[—\-–]\s*(.+))?$/);
  if (match) {
    return {
      main: match[1],
      romaji: match[2] || '',
      desc: match[3] || '',
    };
  }
  return { main: opt, romaji: '', desc: '' };
};

export const UtsExamTrainer: React.FC<UtsExamTrainerProps> = ({
  initialCategory = 'all',
  onSelectCategory,
  onBackToHome,
}) => {
  // Config & Session State
  const [category, setCategory] = useState<UtsCategory>(initialCategory);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);

  // Active Questions & Navigation
  const [sessionQuestions, setSessionQuestions] = useState<UtsQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  // Pedagogical toggles
  const [showRomaji, setShowRomaji] = useState<boolean>(true);

  // Answers history for grading
  const [answersHistory, setAnswersHistory] = useState<
    { question: UtsQuestion; userAnswer: string; isCorrect: boolean }[]
  >([]);
  const [summary, setSummary] = useState<UtsExamSummary | null>(null);

  // Auto-next on correct setting (default false so user can digest or true with instant keypress)
  const [autoNextOnCorrect, setAutoNextOnCorrect] = useState<boolean>(false);
  const autoNextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mistake persistence in localStorage
  const [storedMistakeIds, setStoredMistakeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kana_uts_mistakes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep category in sync with prop
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const currentQuestion: UtsQuestion | null =
    sessionQuestions.length > 0 && currentIndex < sessionQuestions.length
      ? sessionQuestions[currentIndex]
      : null;

  // Start or restart an exam session
  const startExam = (chosenCategory = category, chosenCount = questionCount) => {
    unlockAudio();
    playKeyClickSound();

    let pool = ALL_UTS_QUESTIONS;
    if (chosenCategory === 'particles') {
      pool = ALL_UTS_QUESTIONS.filter(q => q.category === 'particles');
    } else if (chosenCategory === 'family_counters') {
      pool = ALL_UTS_QUESTIONS.filter(q => q.category === 'family_counters');
    } else if (chosenCategory === 'hiragana_daily') {
      pool = ALL_UTS_QUESTIONS.filter(q => q.category === 'hiragana_daily');
    } else if (chosenCategory === 'classroom') {
      pool = ALL_UTS_QUESTIONS.filter(q => q.category === 'classroom');
    } else if (chosenCategory === 'house_rooms') {
      pool = ALL_UTS_QUESTIONS.filter(q => q.category === 'house_rooms');
    } else if (chosenCategory === 'katakana_loan') {
      pool = ALL_UTS_QUESTIONS.filter(q => q.category === 'katakana_loan');
    }

    const config: UtsExamConfig = {
      ...DEFAULT_UTS_CONFIG,
      category: chosenCategory,
      questionCount: chosenCount,
      hiraganaRatio: chosenCategory === 'all' ? 0.75 : 1.0,
      katakanaRatio: chosenCategory === 'all' ? 0.25 : 0.0,
    };

    const questions = generateUtsQuestions(pool, config);

    setSessionQuestions(questions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setAnswersHistory([]);
    setSummary(null);
    setIsExamRunning(true);
    setIsExamFinished(false);
    setStreak(0);
  };

  // Start exam from previous mistake IDs
  const startMistakesReview = () => {
    if (storedMistakeIds.length === 0) return;
    unlockAudio();
    playKeyClickSound();

    const mistakePool = ALL_UTS_QUESTIONS.filter(q => storedMistakeIds.includes(q.id));
    if (mistakePool.length === 0) return;

    const config: UtsExamConfig = {
      ...DEFAULT_UTS_CONFIG,
      category: 'all',
      questionCount: mistakePool.length,
    };

    const questions = generateUtsQuestions(mistakePool, config);
    setSessionQuestions(questions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setAnswersHistory([]);
    setSummary(null);
    setIsExamRunning(true);
    setIsExamFinished(false);
    setStreak(0);
  };

  // Immediate answer handler
  const handleAnswer = (option: string) => {
    if (isAnswerSubmitted || !currentQuestion) return;

    setSelectedAnswer(option);
    setIsAnswerSubmitted(true);

    const correct = checkAnswerMatch(option, currentQuestion.correctAnswer);
    setIsCorrect(correct);

    // Record answer
    const newHistory = [
      ...answersHistory,
      {
        question: currentQuestion,
        userAnswer: option,
        isCorrect: correct,
      },
    ];
    setAnswersHistory(newHistory);

    const kanaPart = getKanaOnly(currentQuestion.correctAnswer);

    if (correct) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setBestStreak(prev => Math.max(prev, nextStreak));
      playCorrectSound(nextStreak);

      // Play audio pronunciation of the word / sentence
      if (currentQuestion.category === 'particles') {
        const sentenceWithAnswer = currentQuestion.prompt
          .replace(/\[\s*＿＿\s*\]|（\s*）/g, kanaPart);
        speakJapaneseSentence(sentenceWithAnswer, kanaPart);
      } else {
        speakJapanese(currentQuestion.audioText || kanaPart);
      }

      // Small confetti when streak hits multiples of 5
      if (nextStreak > 0 && nextStreak % 5 === 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }

      // Auto-advance if enabled by user
      if (autoNextOnCorrect) {
        autoNextTimerRef.current = setTimeout(() => {
          handleNextQuestion(newHistory);
        }, 800);
      }
    } else {
      // WRONG ANSWER:
      // 1. Reset streak
      setStreak(0);
      playIncorrectSound();

      // 2. Pronounce the correct answer for learning
      if (currentQuestion.category === 'particles') {
        speakJapaneseParticle(kanaPart);
      } else {
        speakJapanese(currentQuestion.audioText || kanaPart);
      }

      // 3. Save to localStorage mistakes
      const updatedMistakes = Array.from(new Set([...storedMistakeIds, currentQuestion.id]));
      setStoredMistakeIds(updatedMistakes);
      try {
        localStorage.setItem('kana_uts_mistakes', JSON.stringify(updatedMistakes));
      } catch (err) {
        console.error('Failed to save mistakes', err);
      }

      // 4. IMPORTANT REQUIREMENT:
      // DO NOT AUTO-ADVANCE! The user must click or press Enter/Space to move forward.
      if (autoNextTimerRef.current) {
        clearTimeout(autoNextTimerRef.current);
      }
    }
  };

  // Advance to next question or finalize
  const handleNextQuestion = (history = answersHistory) => {
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
    }

    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    } else {
      // Exam finished!
      finishExam(history);
    }
  };

  // Compile summary results
  const finishExam = (history = answersHistory) => {
    const finalSummary = generateUtsSummary(sessionQuestions, history);
    setSummary(finalSummary);
    setIsExamRunning(false);
    setIsExamFinished(true);

    if (finalSummary.grade.letter === 'A' || finalSummary.grade.letter === 'B+') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ffd200', '#0c389c', '#d9261c', '#10b981'],
      });
    }
  };

  // Keyboard shortcuts (1, 2, 3, 4 for options, Enter/Space for next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isExamRunning || !currentQuestion) return;

      // When answered: Enter or Space triggers Next Question
      if (isAnswerSubmitted) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
        return;
      }

      // When waiting for answer: keys 1, 2, 3, 4 choose options
      const optKeys = ['1', '2', '3', '4'];
      const keyIndex = optKeys.indexOf(e.key);
      if (keyIndex !== -1 && keyIndex < currentQuestion.options.length) {
        e.preventDefault();
        handleAnswer(currentQuestion.options[keyIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExamRunning, currentQuestion, isAnswerSubmitted, answersHistory, currentIndex]);

  // Handle category switch from pills
  const handleCategoryChange = (newCat: UtsCategory) => {
    setCategory(newCat);
    onSelectCategory?.(newCat);
    if (isExamRunning) {
      startExam(newCat, questionCount);
    }
  };

  // Audio helper for prompt / option
  const handlePlayAudio = (e: React.MouseEvent, text: string, isParticle = false) => {
    e.stopPropagation();
    unlockAudio();
    const kana = getKanaOnly(text);
    if (isParticle) {
      speakJapaneseParticle(kana);
    } else {
      speakJapanese(currentQuestion?.audioText || kana);
    }
  };

  // =========================================================================
  // RENDER: 1. SETUP SCREEN (BEFORE START)
  // =========================================================================
  if (!isExamRunning && !isExamFinished) {
    const mistakesCount = storedMistakeIds.length;

    return (
      <div className="w-full space-y-6">
        {/* HERO INTRO CARD */}
        <div className="retro-card p-5 sm:p-7 bg-white relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#0b1a3d]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#d9261c] text-[#ffd200] rounded-2xl border-2 border-[#0b1a3d] flex items-center justify-center shadow-[3px_3px_0px_#0b1a3d]">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bungee text-lg sm:text-2xl text-[#0b1a3d] leading-none">
                    GAMBARAN SOAL UTS JEPANG
                  </h2>
                  <span className="bg-[#ffd200] text-[#0b1a3d] font-bungee text-[10px] px-2 py-0.5 rounded border border-[#0b1a3d]">
                    BAB 1 - 8
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-600 mt-1">
                  Patokan Kurikulum Pertemuan 6 • Proporsi Terstruktur: 75% Hiragana & 25% Katakana
                </p>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="flex items-center gap-2">
              <span className="bg-[#f6eedf] px-3 py-1.5 rounded-lg border-2 border-[#0b1a3d] text-xs font-black text-[#0c389c]">
                TOTAL: {ALL_UTS_QUESTIONS.length} SOAL TERSEDIA
              </span>
            </div>
          </div>

          {/* SYLLABUS FEATURE HIGHLIGHTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
            <div className="p-3 bg-[#f6eedf] rounded-xl border-2 border-[#0b1a3d]">
              <div className="flex items-center gap-2 text-[#0c389c] font-bungee text-xs">
                <Sparkles className="w-4 h-4 text-[#ffd200]" />
                <span>FORMAT UTS ASLI</span>
              </div>
              <p className="text-xs font-bold text-[#0b1a3d] mt-1.5 leading-snug">
                Disertai konteks kalimat, arti bahasa Indonesia, cara baca romaji, dan glosarium kosakata pembantu agar mudah dipahami.
              </p>
            </div>

            <div className="p-3 bg-[#f6eedf] rounded-xl border-2 border-[#0b1a3d]">
              <div className="flex items-center gap-2 text-[#d9261c] font-bungee text-xs">
                <AlertTriangle className="w-4 h-4 text-[#d9261c]" />
                <span>EVALUASI LANGSUNG</span>
              </div>
              <p className="text-xs font-bold text-[#0b1a3d] mt-1.5 leading-snug">
                Langsung tahu benar/salah. Jika salah, jawaban benar & bedah tata bahasa muncul dan <span className="text-[#d9261c] font-black underline">tidak langsung lompat</span> agar sempat dipelajari!
              </p>
            </div>

            <div className="p-3 bg-[#f6eedf] rounded-xl border-2 border-[#0b1a3d]">
              <div className="flex items-center gap-2 text-[#047857] font-bungee text-xs">
                <Award className="w-4 h-4 text-[#10b981]" />
                <span>RAPOR & REVIEW</span>
              </div>
              <p className="text-xs font-bold text-[#0b1a3d] mt-1.5 leading-snug">
                Skala nilai UTS standar akademik (A, B+, B, C, D, E), rekap soal salah, dan fitur review pengulangan soal yang keliru.
              </p>
            </div>
          </div>

          {/* CATEGORY SELECTOR */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-[#0b1a3d] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#0c389c]" />
              <span>PILIH MODE & KATEGORI SOAL:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'all',
                  title: '🎯 SIMULASI PENUH UTS',
                  desc: 'Proporsi acak 75% Hiragana & 25% Katakana sesuai kisi-kisi.',
                  badge: 'DIREKOMENDASIKAN',
                  color: 'border-[#0c389c]',
                },
                {
                  id: 'particles',
                  title: '🌸 PARTIKEL DASAR (HAL 1)',
                  desc: 'は (wa), か, も, の, が, に, と, を (o), で, へ (e) dalam kalimat.',
                  badge: '20 SOAL',
                  color: 'border-[#d9261c]',
                },
                {
                  id: 'family_counters',
                  title: '👨‍👩‍👧 KELUARGA & HITUNGAN (HAL 2-5)',
                  desc: 'Uchi (chichi/haha) vs Soto (otoosan/okaasan) & ひとり/ふたり/よにん.',
                  badge: '15 SOAL',
                  color: 'border-[#ffd200]',
                },
                {
                  id: 'hiragana_daily',
                  title: '🍙 HIRAGANA & ALAM (HAL 6-7)',
                  desc: 'あさ/ひる/よる, いぬ/ねこ, とけい, ざっし, とうきょう & huruf mirip.',
                  badge: '10 SOAL',
                  color: 'border-[#10b981]',
                },
                {
                  id: 'classroom',
                  title: '🏫 KELAS & SEKOLAH (HAL 10-11)',
                  desc: 'がくせい, せんせい, きょうしつ, じゅぎょう, つくえ, けしごむ, じしょ.',
                  badge: '8 SOAL',
                  color: 'border-[#6366f1]',
                },
                {
                  id: 'house_rooms',
                  title: '🏠 RUMAH & PERABOT (HAL 12-16)',
                  desc: 'いっこだて, げんかん, だいどころ, おふろ, そうじき, れいぞうこ.',
                  badge: '8 SOAL',
                  color: 'border-[#ec4899]',
                },
                {
                  id: 'katakana_loan',
                  title: '☕ KATAKANA MODERN (HAL 8-16)',
                  desc: 'パン, テレビ, カメラ, トイレ, ベッド, コーヒー, エアコン, コンピューター.',
                  badge: '25% PORSI UTS',
                  color: 'border-[#f97316]',
                },
              ].map(catItem => (
                <button
                  key={catItem.id}
                  onClick={() => {
                    playKeyClickSound();
                    handleCategoryChange(catItem.id as UtsCategory);
                  }}
                  className={`p-3 text-left rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    category === catItem.id
                      ? 'bg-[#ffd200] border-[#0b1a3d] shadow-[3px_3px_0px_#0b1a3d] scale-[1.02]'
                      : 'bg-white border-[#0b1a3d]/20 hover:border-[#0b1a3d] hover:bg-[#fef8ea]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bungee text-xs text-[#0b1a3d]">{catItem.title}</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white/80 border border-[#0b1a3d]/30 text-[#0b1a3d]">
                        {catItem.badge}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-600 leading-snug">{catItem.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION COUNT SELECTOR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t-2 border-[#0b1a3d]/20 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-[#0b1a3d]">JUMLAH SOAL:</span>
              <div className="flex items-center gap-1.5">
                {[10, 20, 30, 40].map(count => (
                  <button
                    key={count}
                    onClick={() => {
                      playKeyClickSound();
                      setQuestionCount(count);
                    }}
                    className={`px-3 py-1.5 rounded-lg border-2 font-bungee text-xs cursor-pointer transition-all ${
                      questionCount === count
                        ? 'bg-[#0c389c] text-white border-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d]'
                        : 'bg-white text-[#0b1a3d] border-[#0b1a3d]/30 hover:bg-[#f6eedf]'
                    }`}
                  >
                    {count} SOAL
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {mistakesCount > 0 && (
                <button
                  onClick={startMistakesReview}
                  className="retro-btn bg-[#fef2f2] text-[#d9261c] border-2 border-[#d9261c] px-3 py-2 text-xs font-black flex items-center gap-1.5 hover:bg-[#fee2e2]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>REVIEW {mistakesCount} SOAL SALAH</span>
                </button>
              )}

              <button
                onClick={() => startExam()}
                className="retro-btn retro-btn-yellow px-6 py-2.5 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <GraduationCap className="w-5 h-5 text-[#0c389c]" />
                <span className="font-bungee">MULAI LATIHAN UTS ➔</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: 2. ACTIVE EXAM RUNNER
  // =========================================================================
  if (isExamRunning && currentQuestion) {
    const questionNumber = currentIndex + 1;
    const totalQuestions = sessionQuestions.length;
    const progressPercent = Math.round((questionNumber / totalQuestions) * 100);

    return (
      <div className="w-full space-y-4 select-none">
        {/* HEADER STRIP */}
        <div className="retro-card p-3 sm:p-4 bg-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-3">
              <span className="bg-[#0c389c] text-white font-bungee text-xs px-2.5 py-1 rounded-md border border-[#0b1a3d]">
                SOAL #{questionNumber} / {totalQuestions}
              </span>
              <span className="text-xs font-bold text-gray-600">
                Kategori: <strong className="text-[#0b1a3d] uppercase">{currentQuestion.category}</strong>
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
                  currentQuestion.script === 'katakana'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : currentQuestion.script === 'grammar'
                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {currentQuestion.script === 'katakana'
                  ? 'カタカナ (25%)'
                  : currentQuestion.script === 'grammar'
                  ? '文法 / PARTIKEL'
                  : 'ひらがな (75%)'}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {streak > 1 && (
                <div className="flex items-center gap-1 bg-[#d9261c] text-white px-2 py-0.5 rounded-full text-xs font-black">
                  <Flame className="w-3.5 h-3.5 text-[#ffd200] fill-[#ffd200]" />
                  <span>{streak} STREAK!</span>
                </div>
              )}

              <button
                onClick={() => {
                  if (window.confirm('Batalkan latihan UTS dan kembali ke menu?')) {
                    setIsExamRunning(false);
                  }
                }}
                className="text-xs font-bold text-gray-500 hover:text-[#d9261c] underline cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-[#f6eedf] h-2.5 rounded-full border border-[#0b1a3d]/20 mt-3 overflow-hidden">
            <div
              className="bg-[#10b981] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* QUESTION CARD */}
        <div className="retro-card p-5 sm:p-7 bg-white relative">
          {/* 1. TARGET INDONESIAN TRANSLATION & CONTEXT BOX (SHOWN BEFORE ANSWERING) */}
          <div className="bg-[#eff6ff] border-2 border-[#0284c7] rounded-xl p-3.5 sm:p-4 mb-3 shadow-[2px_2px_0px_#0284c7]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-black uppercase text-[#0369a1] tracking-wider flex items-center gap-1.5">
                <span className="text-base">🇮🇩</span> MAKSUD / ARTI KALIMAT TARGET:
              </span>
              {currentQuestion.pdfReference && (
                <span className="text-[10px] font-bold text-gray-500 bg-white/90 px-2 py-0.5 rounded border border-[#0284c7]/30">
                  {currentQuestion.pdfReference}
                </span>
              )}
            </div>
            <p className="text-base sm:text-xl font-heading font-black text-[#0b1a3d]">
              "{currentQuestion.indonesianMeaning}"
            </p>
            {currentQuestion.hint && (
              <div className="text-xs font-bold text-[#0369a1] mt-1.5 flex items-start gap-1.5 pt-1.5 border-t border-[#0284c7]/20">
                <span className="shrink-0 font-black">💡 Petunjuk:</span>
                <span>{currentQuestion.hint}</span>
              </div>
            )}
          </div>

          {/* 2. MINI GLOSSARY / VOCABULARY HELPER (SHOWN BEFORE ANSWERING) */}
          {currentQuestion.vocabHelper && (
            <div className="bg-[#fefce8] border-2 border-[#eab308] rounded-xl p-3 mb-3 shadow-[2px_2px_0px_#ca8a04]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase text-[#854d0e] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#ca8a04]" />
                  <span>BANTUAN KOSAKATA PENTING:</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentQuestion.vocabHelper.split('•').map((item, i) => (
                  <span
                    key={i}
                    className="text-xs font-bold text-[#713f12] bg-white px-2.5 py-1 rounded-lg border border-[#eab308]/40 shadow-sm"
                  >
                    {item.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subprompt / Instruction */}
          {currentQuestion.subPrompt && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-2">
              <HelpCircle className="w-4 h-4 text-[#0c389c]" />
              <span>{currentQuestion.subPrompt}</span>
            </div>
          )}

          {/* 3. MAIN JAPANESE PROMPT BOX (SPACED KANA + AUDIO + ROMAJI) */}
          <div className="p-4 sm:p-6 bg-[#f6eedf] rounded-2xl border-2 border-[#0b1a3d] text-center my-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] relative">
            <h3 className="font-bungee text-2xl sm:text-4xl text-[#0b1a3d] tracking-wide break-words py-2 leading-relaxed">
              {currentQuestion.prompt}
            </h3>

            {/* Cara Baca (Romaji) Always Available */}
            {showRomaji && currentQuestion.romaji && (
              <div className="mt-2 text-xs sm:text-sm font-mono font-bold text-[#0c389c] bg-white/80 py-1 px-3 rounded-lg inline-block border border-[#0b1a3d]/20">
                Cara baca: <span className="underline decoration-wavy decoration-[#ffd200]">{currentQuestion.romaji}</span>
              </div>
            )}

            {/* Romaji toggle button */}
            <button
              onClick={() => setShowRomaji(prev => !prev)}
              title="Aktifkan/Matikan Romaji"
              className="absolute top-2 left-2 px-2 py-1 bg-white rounded-lg border border-[#0b1a3d]/30 text-[10px] font-black text-[#0b1a3d] hover:bg-[#ffd200] transition-all flex items-center gap-1"
            >
              {showRomaji ? <Eye className="w-3 h-3 text-[#0c389c]" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
              <span>{showRomaji ? 'ROMAJI: ON' : 'ROMAJI: OFF'}</span>
            </button>

            {/* Audio Button on Prompt */}
            <button
              onClick={(e) =>
                handlePlayAudio(
                  e,
                  currentQuestion.audioText || currentQuestion.prompt,
                  currentQuestion.category === 'particles'
                )
              }
              title="Dengarkan pengucapan audio"
              className="absolute top-2 right-2 p-2 bg-white rounded-xl border border-[#0b1a3d]/30 hover:bg-[#ffd200] text-[#0b1a3d] cursor-pointer transition-all shadow-[2px_2px_0px_#0b1a3d]"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* 4. CHOICES (A, B, C, D) WITH INFORMATIVE MEANING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {currentQuestion.options.map((opt, idx) => {
              const optLabel = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = selectedAnswer === opt;
              const isOptionMatch = checkAnswerMatch(opt, currentQuestion.correctAnswer);
              const parsed = parseOption(opt);

              let buttonStyle = 'bg-white border-[#0b1a3d] text-[#0b1a3d] hover:bg-[#f6eedf] hover:border-[#0c389c]';

              if (isAnswerSubmitted) {
                if (isOptionMatch) {
                  // CORRECT ANSWER: Emerald Green
                  buttonStyle =
                    'bg-[#d1fae5] border-[#047857] text-[#065f46] shadow-[0_0_0_2px_#047857] font-black scale-[1.01]';
                } else if (isSelected && !isCorrect) {
                  // WRONG SELECTED ANSWER: Bright Red
                  buttonStyle =
                    'bg-[#fee2e2] border-[#d9261c] text-[#991b1b] shadow-[0_0_0_2px_#d9261c] font-black line-through';
                } else {
                  buttonStyle = 'bg-gray-100 border-gray-300 text-gray-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleAnswer(opt)}
                  className={`p-3 sm:p-4 rounded-xl border-2 text-left font-bold transition-all flex items-center justify-between cursor-pointer ${buttonStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0b1a3d] text-white font-bungee text-xs flex items-center justify-center shrink-0 shadow-[1px_1px_0px_rgba(0,0,0,0.3)]">
                      {optLabel}
                    </span>
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-lg sm:text-xl text-[#0b1a3d] font-black">
                          {parsed.main}
                        </span>
                        {parsed.romaji && (
                          <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300">
                            {parsed.romaji}
                          </span>
                        )}
                      </div>
                      {parsed.desc && (
                        <span className="text-xs font-bold text-gray-600 mt-0.5">
                          {parsed.desc}
                        </span>
                      )}
                    </div>
                  </div>

                  {isAnswerSubmitted && isOptionMatch && (
                    <span className="bg-[#10b981] text-white text-[11px] font-black px-2 py-1 rounded flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> BENAR
                    </span>
                  )}

                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <span className="bg-[#d9261c] text-white text-[11px] font-black px-2 py-1 rounded flex items-center gap-1 shrink-0">
                      <XCircle className="w-3.5 h-3.5" /> SALAH
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 5. IN-DEPTH EXPLANATION DRAWER WHEN ANSWERED */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border-2 mt-5 transition-all ${
                isCorrect
                  ? 'bg-[#ecfdf5] border-[#047857]'
                  : 'bg-[#fff1f2] border-[#d9261c]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 border-b border-black/10 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <div className="flex items-center gap-1.5 text-[#047857] font-bungee text-sm sm:text-base">
                      <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                      <span>JAWABAN KAMU TEPAT! ★</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[#d9261c] font-bungee text-sm sm:text-base">
                      <XCircle className="w-5 h-5 text-[#d9261c]" />
                      <span>JAWABAN BELUM BENAR • PELAJARI KUNCI INI:</span>
                    </div>
                  )}
                </div>

                {currentQuestion.pdfReference && (
                  <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded border border-[#0b1a3d]/20 text-gray-600">
                    {currentQuestion.pdfReference}
                  </span>
                )}
              </div>

              {/* Translation & Reading */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-[#0b1a3d] mb-3">
                <div className="bg-white/80 p-2 rounded-lg border border-[#0b1a3d]/15">
                  <span className="text-gray-500 text-[10px] uppercase block font-black">
                    Kunci Jawaban:
                  </span>
                  <span className="text-sm font-black text-[#047857]">
                    {currentQuestion.correctAnswer}
                  </span>
                  {currentQuestion.romaji && (
                    <span className="text-gray-600 ml-1.5 font-mono">
                      ({currentQuestion.romaji})
                    </span>
                  )}
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-[#0b1a3d]/15">
                  <span className="text-gray-500 text-[10px] uppercase block font-black">
                    Arti Bahasa Indonesia:
                  </span>
                  <span className="text-sm font-black text-[#0b1a3d]">
                    {currentQuestion.indonesianMeaning}
                  </span>
                </div>
              </div>

              {/* Academic Explanation */}
              <div className="bg-white/90 p-3 rounded-xl border border-[#0b1a3d]/20 text-xs text-[#0b1a3d] leading-relaxed">
                <strong className="text-[#0c389c] font-bungee block mb-1">
                  💡 BEDAH SOAL & PEMBAHASAN UTS:
                </strong>
                <p className="font-heading font-medium text-gray-800">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* IMPORTANT REQUIREMENT: MANUAL NEXT BUTTON (DOES NOT AUTO JUMP IF WRONG) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-black/10">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <span className="bg-[#0b1a3d] text-white px-2 py-0.5 rounded font-mono text-[10px]">
                    Enter / Spasi
                  </span>
                  <span>untuk lanjut ke soal berikutnya</span>
                </div>

                <button
                  onClick={() => handleNextQuestion()}
                  className={`retro-btn px-6 py-2.5 text-xs sm:text-sm font-bungee flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto ${
                    isCorrect ? 'retro-btn-yellow' : 'retro-btn-red animate-pulse'
                  }`}
                >
                  <span>
                    {currentIndex + 1 === sessionQuestions.length
                      ? 'LIHAT HASIL & RAPOR UTS ➔'
                      : 'LANJUT KE SOAL BERIKUTNYA ➔'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM HELPER CONTROLS */}
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
          <div className="flex items-center gap-2">
            <span>Pintasan keyboard: [1, 2, 3, 4] untuk memilih opsi</span>
          </div>
          <button
            onClick={() => setAutoNextOnCorrect(!autoNextOnCorrect)}
            className="flex items-center gap-1.5 text-gray-600 hover:text-[#0b1a3d] cursor-pointer"
          >
            <span
              className={`w-3 h-3 rounded-sm border border-[#0b1a3d] ${
                autoNextOnCorrect ? 'bg-[#0c389c]' : 'bg-white'
              }`}
            />
            <span>Auto-next hanya saat benar</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: 3. EXAM FINISHED / RAPOR SUMMARY SCREEN
  // =========================================================================
  if (isExamFinished && summary) {
    const isPass = summary.score >= DEFAULT_UTS_CONFIG.passingScore;

    return (
      <div className="w-full space-y-6">
        {/* SUMMARY HERO CARD */}
        <div className="retro-card p-5 sm:p-7 bg-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b-2 border-[#0b1a3d]/20 pb-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div
                className="w-20 h-20 rounded-2xl border-4 border-[#0b1a3d] flex flex-col items-center justify-center shadow-[4px_4px_0px_#0b1a3d] shrink-0"
                style={{ backgroundColor: summary.grade.color }}
              >
                <span className="font-bungee text-3xl leading-none text-white drop-shadow-[1px_1px_0px_#0b1a3d]">
                  {summary.grade.letter}
                </span>
                <span className="text-[10px] font-black text-white/90">
                  {summary.grade.status}
                </span>
              </div>

              <div>
                <span className="bg-[#ffd200] text-[#0b1a3d] font-bungee text-xs px-2.5 py-0.5 rounded border border-[#0b1a3d]">
                  RAPOR LATIHAN UTS
                </span>
                <h2 className="font-bungee text-2xl sm:text-3xl text-[#0b1a3d] mt-1 leading-none">
                  NILAI AKHIR: {summary.score} / 100
                </h2>
                <p className="text-xs font-bold text-gray-600 mt-1">
                  Predikat: <strong>{summary.grade.predicate}</strong> • {summary.grade.description}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => startExam(category, questionCount)}
                className="retro-btn retro-btn-yellow px-4 py-2 text-xs font-bungee flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ULANGI TES UTS</span>
              </button>

              <button
                onClick={() => {
                  setIsExamFinished(false);
                  setIsExamRunning(false);
                }}
                className="retro-btn bg-white text-[#0b1a3d] border-2 border-[#0b1a3d] px-4 py-2 text-xs font-bungee flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>MENU UTAMA UTS</span>
              </button>
            </div>
          </div>

          {/* STATS TILES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <div className="p-3 bg-[#f6eedf] rounded-xl border-2 border-[#0b1a3d] text-center">
              <span className="text-[10px] font-black text-gray-500 uppercase block">
                BENAR
              </span>
              <span className="font-bungee text-xl text-[#047857]">
                {summary.correctCount} SOAL
              </span>
            </div>

            <div className="p-3 bg-[#f6eedf] rounded-xl border-2 border-[#0b1a3d] text-center">
              <span className="text-[10px] font-black text-gray-500 uppercase block">
                SALAH
              </span>
              <span className="font-bungee text-xl text-[#d9261c]">
                {summary.incorrectCount} SOAL
              </span>
            </div>

            <div className="p-3 bg-[#f6eedf] rounded-xl border-2 border-[#0b1a3d] text-center">
              <span className="text-[10px] font-black text-gray-500 uppercase block">
                HIRAGANA (75%)
              </span>
              <span className="font-bungee text-xl text-[#0c389c]">
                {summary.hiraganaCount} SOAL
              </span>
            </div>

            <div className="p-3 bg-[#f6eedf] rounded-xl border-2 border-[#0b1a3d] text-center">
              <span className="text-[10px] font-black text-gray-500 uppercase block">
                KATAKANA (25%)
              </span>
              <span className="font-bungee text-xl text-[#ec4899]">
                {summary.katakanaCount} SOAL
              </span>
            </div>
          </div>

          {/* CATEGORY BREAKDOWN ACCURACY */}
          <div className="space-y-2 mt-5">
            <h4 className="font-bungee text-xs uppercase text-[#0b1a3d]">
              EVALUASI PER BAB PERTEMUAN 6:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Object.values(summary.categoryBreakdown).map(bd => (
                <div
                  key={bd.category}
                  className="p-2.5 bg-white rounded-lg border-2 border-[#0b1a3d]/20 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-black text-[#0b1a3d] block">
                      {bd.categoryLabel}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold">
                      {bd.correct} dari {bd.total} benar
                    </span>
                  </div>
                  <span
                    className={`font-bungee text-xs px-2 py-0.5 rounded ${
                      bd.accuracy >= 75
                        ? 'bg-emerald-100 text-emerald-800'
                        : bd.accuracy >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {bd.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LIST OF MISTAKES TO STUDY */}
        {summary.mistakesToReview.length > 0 && (
          <div className="retro-card p-5 bg-white space-y-3">
            <div className="flex items-center justify-between border-b-2 border-[#0b1a3d]/20 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#d9261c]" />
                <h3 className="font-bungee text-sm sm:text-base text-[#0b1a3d]">
                  DAFTAR SOAL YANG PERLU DIPELAJARI ULANG ({summary.mistakesToReview.length} SOAL)
                </h3>
              </div>
              <button
                onClick={startMistakesReview}
                className="retro-btn retro-btn-red px-3 py-1 text-xs font-black"
              >
                Latih Ulang Soal Ini ➔
              </button>
            </div>

            <div className="space-y-3">
              {summary.mistakesToReview.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#fef2f2] rounded-xl border-2 border-[#d9261c]/30 text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bungee text-sm text-[#0b1a3d]">
                      #{item.questionIndex} {item.question.prompt}
                    </span>
                    {item.pdfReference && (
                      <span className="text-[9px] bg-white px-2 py-0.5 rounded border border-[#0b1a3d]/20 font-bold text-gray-600 shrink-0">
                        {item.pdfReference}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-[11px] font-bold">
                    <span className="text-[#d9261c]">
                      Pilihan kamu: <strong className="line-through">{item.userAnswer}</strong>
                    </span>
                    <span className="text-[#047857]">
                      Kunci yang benar: <strong>{item.correctAnswer}</strong>
                    </span>
                    <span className="text-gray-600">
                      Arti: <em>{item.question.indonesianMeaning}</em>
                    </span>
                  </div>

                  <p className="text-gray-700 bg-white/80 p-2 rounded border border-[#0b1a3d]/10 font-medium">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
