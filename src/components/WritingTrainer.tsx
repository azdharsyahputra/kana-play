import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ALL_KANA_ITEMS, KANA_ROWS } from '../data/kanaData';
import { getKanaStrokeInfo } from '../data/kanaStrokeData';
import { evaluateKanaDrawing, Stroke, Point, EvaluationResult } from '../utils/drawingEvaluation';
import { playCorrectSound, playIncorrectSound, speakJapanese, playKeyClickSound } from '../utils/audio';
import { recordKanaAnswer } from '../utils/storage';
import { KanaItem, KanaScript, UserStats } from '../types';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RotateCcw,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Sparkles,
  Grid,
  PenTool,
  Check,
  AlertTriangle,
  Lightbulb,
  Zap,
} from 'lucide-react';

interface WritingTrainerProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  script: KanaScript;
  onSelectScript: (script: KanaScript) => void;
  selectedLevel?: number;
}

const BRUSH_SIZES = [
  { label: 'Tipis', size: 6 },
  { label: 'Sedang', size: 10 },
  { label: 'Tebal', size: 16 },
];

const INK_COLORS = [
  { label: 'Sumi (Hitam)', color: '#111827' },
  { label: 'Biru Retro', color: '#0c389c' },
  { label: 'Akai (Merah)', color: '#d9261c' },
  { label: 'Hijau', color: '#059669' },
];

export const WritingTrainer: React.FC<WritingTrainerProps> = ({
  stats,
  onUpdateStats,
  script,
  onSelectScript,
  selectedLevel = 1,
}) => {
  // 1. Selection & Filter State
  const [selectedRowId, setSelectedRowId] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeScript, setActiveScript] = useState<'hiragana' | 'katakana'>('hiragana');

  // 2. Drawing State
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [brushSize, setBrushSize] = useState<number>(10);
  const [inkColor, setInkColor] = useState<string>('#111827');

  // 3. Guidance & Display Modes
  const [tracingMode, setTracingMode] = useState<boolean>(true); // Guide watermark
  const [showGrid, setShowGrid] = useState<boolean>(true); // Calligraphy crosshairs
  const [showStrokeGuide, setShowStrokeGuide] = useState<boolean>(false); // Step-by-step tips
  const [isPeeking, setIsPeeking] = useState<boolean>(false); // Temporary hint

  // 4. Evaluation & Option 3 Auto-Advance State
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true); // Option 3: auto-advance on >= 70%
  const [isAutoAdvancing, setIsAutoAdvancing] = useState<boolean>(false);
  const PASS_THRESHOLD = 70;

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const peekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filter available kana items based on row & script
  const availableItems = React.useMemo(() => {
    let pool = ALL_KANA_ITEMS;
    if (selectedRowId !== 'all') {
      const row = KANA_ROWS.find(r => r.id === selectedRowId);
      if (row) {
        pool = row.items;
      }
    }
    return pool.length > 0 ? pool : ALL_KANA_ITEMS;
  }, [selectedRowId]);

  // Sync selectedLevel if changed from outside
  useEffect(() => {
    if (selectedLevel) {
      const row = KANA_ROWS.find(r => r.level === selectedLevel);
      if (row) {
        setSelectedRowId(row.id);
        setCurrentIndex(0);
      }
    }
  }, [selectedLevel]);

  const currentKanaItem: KanaItem = availableItems[currentIndex % availableItems.length] || availableItems[0];

  // Determine active script for the prompt
  useEffect(() => {
    if (script === 'katakana') {
      setActiveScript('katakana');
    } else if (script === 'mixed') {
      setActiveScript(Math.random() > 0.5 ? 'katakana' : 'hiragana');
    } else {
      setActiveScript('hiragana');
    }
  }, [currentIndex, script, selectedRowId]);

  const targetChar = activeScript === 'katakana' ? currentKanaItem.katakana : currentKanaItem.hiragana;
  const strokeInfo = getKanaStrokeInfo(targetChar);

  // Reset drawing when target kana changes
  const resetCanvas = useCallback(() => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    setIsAutoAdvancing(false);
    setStrokes([]);
    setCurrentStroke([]);
    setEvaluation(null);
    setIsPeeking(false);
  }, []);

  useEffect(() => {
    resetCanvas();
  }, [currentIndex, selectedRowId, activeScript, resetCanvas]);

  // Redraw canvas content whenever strokes, tracing mode, or evaluation change
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Japanese Calligraphy Practice Grid (田 pattern)
    if (showGrid) {
      ctx.save();
      ctx.strokeStyle = '#d5c7b3';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);

      // Vertical center line
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      // Horizontal center line
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Diagonal guides (faint)
      ctx.strokeStyle = '#e9dfd0';
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, height);
      ctx.moveTo(width, 0);
      ctx.lineTo(0, height);
      ctx.stroke();

      // Center crosshair marker
      ctx.fillStyle = '#bda88e';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 2. Draw Tracing Guide Watermark or Peek
    const shouldShowGuide = tracingMode || isPeeking;
    if (shouldShowGuide && !evaluation) {
      ctx.save();
      ctx.fillStyle = isPeeking ? 'rgba(12, 56, 156, 0.45)' : 'rgba(11, 26, 61, 0.14)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.round(width * 0.72);
      ctx.font = `900 ${fontSize}px "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
      ctx.fillText(targetChar, width / 2, height / 2 + height * 0.035);
      ctx.restore();
    }

    // 3. Draw User Completed Strokes
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = brushSize;

    const allStrokes = [...strokes];
    if (currentStroke.length > 0) {
      allStrokes.push(currentStroke);
    }

    for (const stroke of allStrokes) {
      if (stroke.length === 0) continue;
      if (stroke.length === 1) {
        ctx.beginPath();
        ctx.arc(stroke[0].x, stroke[0].y, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = inkColor;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length - 1; i++) {
          const xc = (stroke[i].x + stroke[i + 1].x) / 2;
          const yc = (stroke[i].y + stroke[i + 1].y) / 2;
          ctx.quadraticCurveTo(stroke[i].x, stroke[i].y, xc, yc);
        }
        const last = stroke[stroke.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      }
    }
    ctx.restore();

    // 4. Draw Overlay in Evaluation Mode (shows reference outline over user drawing)
    if (evaluation) {
      ctx.save();
      // Semi-transparent target silhouette in teal/emerald
      ctx.fillStyle = evaluation.score >= 60 ? 'rgba(16, 185, 129, 0.28)' : 'rgba(217, 38, 28, 0.25)';
      ctx.strokeStyle = evaluation.score >= 60 ? '#10b981' : '#d9261c';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.round(width * 0.72);
      ctx.font = `900 ${fontSize}px "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
      ctx.fillText(targetChar, width / 2, height / 2 + height * 0.035);
      ctx.strokeText(targetChar, width / 2, height / 2 + height * 0.035);
      ctx.restore();
    }
  }, [showGrid, tracingMode, isPeeking, evaluation, targetChar, inkColor, brushSize, strokes, currentStroke]);

  // Handle Canvas Resizing with DevicePixelRatio
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.floor(Math.min(rect.width, 380));
    if (size <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    return () => window.removeEventListener('resize', updateCanvasDimensions);
  }, [updateCanvasDimensions]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Pointer Event Handlers for smooth drawing
  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Prevent drawing if already evaluated
    if (evaluation) return;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.setPointerCapture(e.pointerId);
    }

    const pt = getCanvasCoordinates(e);
    setIsDrawing(true);
    setCurrentStroke([pt]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pt = getCanvasCoordinates(e);
    setCurrentStroke(prev => [...prev, pt]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore if not captured
      }
    }

    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
      setCurrentStroke([]);
    }
  };

  const handlePointerCancel = () => {
    setIsDrawing(false);
    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
      setCurrentStroke([]);
    }
  };

  // Undo Last Stroke
  const handleUndo = () => {
    playKeyClickSound();
    if (evaluation) {
      setEvaluation(null);
    }
    setStrokes(prev => prev.slice(0, -1));
  };

  // Clear Canvas
  const handleClear = () => {
    playKeyClickSound();
    resetCanvas();
  };

  // Momentary Peek Hint
  const handlePeek = () => {
    playKeyClickSound();
    setIsPeeking(true);
    if (peekTimeoutRef.current) clearTimeout(peekTimeoutRef.current);
    peekTimeoutRef.current = setTimeout(() => {
      setIsPeeking(false);
    }, 1200);
  };

  // Check / Evaluate Drawing
  const handleEvaluate = () => {
    if (strokes.length === 0) {
      playIncorrectSound();
      alert('Tulis dulu hurufnya di kanvas sebelum memeriksa!');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const result = evaluateKanaDrawing(strokes, targetChar, rect.width, rect.height);
    setEvaluation(result);

    const isPassed = result.score >= PASS_THRESHOLD;

    if (isPassed) {
      // 1. Play sounds & animations
      playCorrectSound(stats.currentStreak + 1);
      speakJapanese(targetChar);

      if (result.score >= 80) {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.65 },
        });
      }

      // 2. Automatically record kana mastery & streak
      const kanaKey = `${activeScript}:${currentKanaItem.id}`;
      const { nextStats } = recordKanaAnswer(stats, kanaKey, true, 4);
      onUpdateStats(nextStats);

      // 3. Option 3: Auto-Advance smoothly if enabled
      if (autoAdvance) {
        setIsAutoAdvancing(true);
        if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
        autoAdvanceTimeoutRef.current = setTimeout(() => {
          setIsAutoAdvancing(false);
          handleNext();
        }, 850);
      }
    } else {
      playIncorrectSound();
      setIsAutoAdvancing(false);
    }
  };

  // Confirm Answer as Correct & Next (Manual override or when autoAdvance is off)
  const handleConfirmCorrect = () => {
    // If not already registered via auto-pass
    if (!evaluation || evaluation.score < PASS_THRESHOLD) {
      playCorrectSound(stats.currentStreak + 1);
      speakJapanese(targetChar);

      const kanaKey = `${activeScript}:${currentKanaItem.id}`;
      const { nextStats } = recordKanaAnswer(stats, kanaKey, true, 4);
      onUpdateStats(nextStats);
    }

    handleNext();
  };

  // Retry same character
  const handleRetryCurrent = () => {
    playKeyClickSound();
    resetCanvas();
  };

  // Navigation
  const handlePrev = () => {
    playKeyClickSound();
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    setIsAutoAdvancing(false);
    setCurrentIndex(prev => (prev === 0 ? availableItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    playKeyClickSound();
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    setIsAutoAdvancing(false);
    setCurrentIndex(prev => (prev + 1) % availableItems.length);
  };

  const handleRandom = () => {
    playKeyClickSound();
    const nextIdx = Math.floor(Math.random() * availableItems.length);
    setCurrentIndex(nextIdx);
  };

  // Native Audio Pronunciation
  const handlePlayVoice = () => {
    speakJapanese(targetChar);
  };

  // Keyboard Shortcuts via Ref Pattern
  const handlersRef = useRef({
    handleUndo,
    handleClear,
    handleConfirmCorrect,
    handleEvaluate,
    handlePeek,
    hasEvaluation: !!evaluation,
  });

  useEffect(() => {
    handlersRef.current = {
      handleUndo,
      handleClear,
      handleConfirmCorrect,
      handleEvaluate,
      handlePeek,
      hasEvaluation: !!evaluation,
    };
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const h = handlersRef.current;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        h.handleUndo();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        h.handleClear();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (h.hasEvaluation) {
          h.handleConfirmCorrect();
        } else {
          h.handleEvaluate();
        }
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        h.handlePeek();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. TOP HEADER & FILTER BAR */}
      <div className="retro-card p-3.5 sm:p-4 bg-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b-2 border-[#0b1a3d]/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffd200] border-2 border-[#0b1a3d] flex items-center justify-center shadow-[2px_2px_0px_#0b1a3d]">
              <PenTool className="w-5 h-5 text-[#0b1a3d]" />
            </div>
            <div>
              <h2 className="font-bungee text-base sm:text-lg text-[#0b1a3d] leading-none">
                ★ KANA WRITING DRILL ★
              </h2>
              <p className="text-xs font-bold text-gray-500 mt-1">
                Latih memori otot dan goresan huruf kana langsung di kanvas interaktif!
              </p>
            </div>
          </div>

          {/* SCRIPT SELECTOR */}
          <div className="flex items-center gap-1.5 bg-[#f6eedf] p-1.5 rounded-xl border-2 border-[#0b1a3d] self-stretch md:self-auto justify-center">
            {(['hiragana', 'katakana', 'mixed'] as KanaScript[]).map(s => (
              <button
                key={s}
                onClick={() => {
                  playKeyClickSound();
                  onSelectScript(s);
                }}
                className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all uppercase ${
                  script === s
                    ? 'bg-[#0c389c] text-white shadow-[2px_2px_0px_#0b1a3d]'
                    : 'text-[#0b1a3d] hover:bg-white'
                }`}
              >
                {s === 'hiragana' ? 'ひらがな' : s === 'katakana' ? 'カタカナ' : 'Campur'}
              </button>
            ))}
          </div>
        </div>

        {/* ROW SELECTOR & NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3">
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-[11px] font-black uppercase text-[#0c389c] tracking-wider whitespace-nowrap">
              BARIS KANA:
            </label>
            <select
              value={selectedRowId}
              onChange={e => {
                playKeyClickSound();
                setSelectedRowId(e.target.value);
                setCurrentIndex(0);
              }}
              className="bg-white border-2 border-[#0b1a3d] text-xs font-bold text-[#0b1a3d] rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#ffd200] shadow-[2px_2px_0px_#0b1a3d]"
            >
              <option value="all">Semua Baris (Gojuon)</option>
              {KANA_ROWS.map(row => (
                <option key={row.id} value={row.id}>
                  {row.name} ({row.label})
                </option>
              ))}
            </select>
          </div>

          {/* PREV / NEXT BUTTONS */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={handlePrev}
              title="Huruf Sebelumnya"
              className="retro-btn retro-btn-white p-1.5 text-xs flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bungee text-[#0b1a3d] px-2">
              {currentIndex + 1} / {availableItems.length}
            </span>
            <button
              onClick={handleNext}
              title="Huruf Berikutnya"
              className="retro-btn retro-btn-white p-1.5 text-xs flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleRandom}
              title="Acak Huruf"
              className="retro-btn retro-btn-yellow p-1.5 text-xs flex items-center gap-1"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">ACAK</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN WRITING WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: PROMPT & STROKE TIPS CARD */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* TARGET KANA CARD */}
          <div className="retro-card p-4 sm:p-5 bg-white flex flex-col items-center text-center relative overflow-hidden">
            <div className="inline-block bg-[#ffd200] text-[#0b1a3d] font-bungee text-[10px] px-2.5 py-0.5 rounded border border-[#0b1a3d] mb-2 shadow-[2px_2px_0px_#0b1a3d]">
              TARGET WRITING • {activeScript.toUpperCase()}
            </div>

            <div className="text-4xl sm:text-5xl font-bungee text-[#0c389c] tracking-wider uppercase mb-1">
              {currentKanaItem.romaji}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-heading font-bold text-gray-500">
                Bunyi vokal / suku kata
              </span>
              <button
                onClick={handlePlayVoice}
                title="Dengarkan pengucapan audio"
                className="p-1 rounded-full bg-[#f6eedf] hover:bg-[#ffd200] border border-[#0b1a3d] transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#0c389c]" />
              </button>
            </div>

            {/* STROKE COUNT BADGE */}
            <div className="w-full bg-[#f6eedf] border-2 border-[#0b1a3d] rounded-xl p-2.5 flex items-center justify-around text-center shadow-[2px_2px_0px_#0b1a3d]">
              <div>
                <div className="text-[10px] font-black text-gray-500 uppercase">STANDAR CORETAN</div>
                <div className="text-xl font-bungee text-[#d9261c] leading-none mt-0.5">
                  {strokeInfo.strokes} <span className="text-xs font-heading">Goresan</span>
                </div>
              </div>
              <div className="h-7 w-[2px] bg-[#0b1a3d]/20" />
              <div>
                <div className="text-[10px] font-black text-gray-500 uppercase">CORETAN KAMU</div>
                <div className={`text-xl font-bungee leading-none mt-0.5 ${
                  strokes.length === strokeInfo.strokes ? 'text-[#059669]' : 'text-[#0b1a3d]'
                }`}>
                  {strokes.length} <span className="text-xs font-heading">Goresan</span>
                </div>
              </div>
            </div>

            {/* QUICK PEEK BUTTON */}
            <div className="w-full mt-3">
              <button
                onClick={handlePeek}
                disabled={isPeeking || evaluation !== null}
                className="w-full retro-btn retro-btn-white py-2 text-xs flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-[#0c389c]" />
                <span>INTIP BENTUK HURUF (HINT)</span>
              </button>
            </div>
          </div>

          {/* STROKE ORDER INSTRUCTIONS */}
          <div className="retro-card p-4 bg-white flex-1 flex flex-col">
            <button
              onClick={() => setShowStrokeGuide(prev => !prev)}
              className="w-full flex items-center justify-between font-bungee text-xs text-[#0b1a3d] pb-2 border-b-2 border-[#0b1a3d]/20 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-[#ffd200] fill-[#ffd200]" />
                <span>PANDUAN URUTAN CORETAN</span>
              </div>
              <span className="text-[10px] text-[#0c389c] font-black">
                {showStrokeGuide ? 'SEMBUNYIKAN ▲' : 'LIHAT LANGKAH ▼'}
              </span>
            </button>

            {/* Short summary always visible */}
            <p className="text-xs font-heading font-medium text-gray-700 mt-2.5 leading-snug">
              {strokeInfo.tips}
            </p>

            {/* Expandable step-by-step */}
            {showStrokeGuide && (
              <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
                {strokeInfo.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-[#f6eedf] p-2 rounded-lg border border-[#0b1a3d]/20 text-xs font-medium text-[#0b1a3d]"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#0c389c] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-tight">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER / RIGHT COLUMN: DRAWING CANVAS & CONTROLS */}
        <div className="lg:col-span-8 flex flex-col items-center gap-3">
          
          {/* TOOLBAR: BRUSH SIZE, INK COLOR, TOGGLES */}
          <div className="w-full retro-card p-2.5 sm:p-3 bg-white flex flex-wrap items-center justify-between gap-2">
            
            {/* Ink Color Picker */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-[#0b1a3d] uppercase hidden sm:inline">TINTA:</span>
              <div className="flex items-center gap-1">
                {INK_COLORS.map(c => (
                  <button
                    key={c.color}
                    onClick={() => {
                      playKeyClickSound();
                      setInkColor(c.color);
                    }}
                    title={c.label}
                    style={{ backgroundColor: c.color }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                      inkColor === c.color
                        ? 'border-[#0b1a3d] scale-110 shadow-[2px_2px_0px_#0b1a3d]'
                        : 'border-white/50 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Brush Size Picker */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-[#0b1a3d] uppercase hidden sm:inline">UKURAN:</span>
              <div className="flex items-center gap-1 bg-[#f6eedf] p-1 rounded-lg border border-[#0b1a3d]/30">
                {BRUSH_SIZES.map(b => (
                  <button
                    key={b.size}
                    onClick={() => {
                      playKeyClickSound();
                      setBrushSize(b.size);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-heading font-black rounded transition-all ${
                      brushSize === b.size
                        ? 'bg-[#0c389c] text-white shadow-[1px_1px_0px_#0b1a3d]'
                        : 'text-[#0b1a3d] hover:bg-white'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guide & Grid Toggles */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  playKeyClickSound();
                  setTracingMode(prev => !prev);
                }}
                title={tracingMode ? 'Matikan bayangan jiplak' : 'Nyalakan bayangan jiplak'}
                className={`retro-btn px-2.5 py-1 text-[10px] flex items-center gap-1 ${
                  tracingMode ? 'retro-btn-yellow' : 'retro-btn-white'
                }`}
              >
                {tracingMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                <span>JIPLAK: {tracingMode ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => {
                  playKeyClickSound();
                  setShowGrid(prev => !prev);
                }}
                title={showGrid ? 'Sembunyikan garis kotak' : 'Tampilkan garis kotak'}
                className={`retro-btn px-2.5 py-1 text-[10px] flex items-center gap-1 ${
                  showGrid ? 'retro-btn-yellow' : 'retro-btn-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>GRID: {showGrid ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => {
                  playKeyClickSound();
                  setAutoAdvance(prev => !prev);
                }}
                title={autoAdvance ? 'Auto-pass aktif (lanjut otomatis jika skor ≥ 70%)' : 'Auto-pass mati (manual)'}
                className={`retro-btn px-2.5 py-1 text-[10px] flex items-center gap-1 ${
                  autoAdvance ? 'retro-btn-green' : 'retro-btn-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>AUTO-PASS: {autoAdvance ? 'ON (≥70%)' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* THE WRITING CANVAS CONTAINER */}
          <div
            ref={containerRef}
            className="w-full flex justify-center items-center py-1 select-none"
          >
            <div className="relative rounded-2xl border-4 border-[#0b1a3d] bg-[#fbf9f4] shadow-[6px_6px_0px_#0b1a3d] overflow-hidden">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                className="cursor-crosshair block touch-none"
                style={{ touchAction: 'none' }}
              />

              {/* Floating Undo & Clear overlay buttons */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                <button
                  onClick={handleUndo}
                  disabled={strokes.length === 0}
                  title="Batalkan Coretan Terakhir (Ctrl+Z)"
                  className="p-2 rounded-xl bg-white hover:bg-[#ffd200] border-2 border-[#0b1a3d] text-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClear}
                  disabled={strokes.length === 0}
                  title="Hapus Semua Coretan (C)"
                  className="p-2 rounded-xl bg-white hover:bg-[#d9261c] hover:text-white border-2 border-[#0b1a3d] text-[#0b1a3d] shadow-[2px_2px_0px_#0b1a3d] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* In-Canvas Stroke Count Indicator */}
              <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
                <span className="bg-[#0b1a3d]/80 text-white font-bungee text-[10px] px-2 py-1 rounded-md border border-white/20">
                  STROKE: {strokes.length} / {strokeInfo.strokes}
                </span>
              </div>
            </div>
          </div>

          {/* 3. EVALUATION RESULTS & ACTION BUTTONS */}
          <div className="w-full max-w-lg">
            {!evaluation ? (
              /* Pre-evaluation: CHECK ANSWER BUTTON */
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEvaluate}
                  disabled={strokes.length === 0}
                  className="flex-1 retro-btn retro-btn-yellow py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-5 h-5 fill-current" />
                  <span>PERIKSA HASIL TULISAN (ENTER)</span>
                </button>

                <button
                  onClick={handleNext}
                  title="Lewati ke huruf berikutnya"
                  className="retro-btn retro-btn-white py-3 px-4 text-xs font-bold"
                >
                  LEWATI ➔
                </button>
              </div>
            ) : (
              /* Post-evaluation: SCORE CARD & ACTIONS */
              <div className="retro-card p-4 bg-white space-y-3 animate-retro-pop">
                
                {/* Result Headline */}
                <div className="flex items-center justify-between pb-2 border-b-2 border-[#0b1a3d]/20">
                  <div className="flex items-center gap-2">
                    {evaluation.score >= PASS_THRESHOLD ? (
                      <div className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center border-2 border-[#0b1a3d]">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#d9261c] text-white flex items-center justify-center border-2 border-[#0b1a3d]">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bungee text-base sm:text-lg text-[#0b1a3d] leading-none">
                          {evaluation.feedbackTitle}
                        </h4>
                        <span className={`text-[10px] font-bungee px-1.5 py-0.5 rounded border ${
                          evaluation.score >= PASS_THRESHOLD
                            ? 'bg-[#d1fae5] text-[#047857] border-[#047857]'
                            : 'bg-[#ffe4e6] text-[#b91c1c] border-[#b91c1c]'
                        }`}>
                          {evaluation.score >= PASS_THRESHOLD ? '✓ LULUS' : 'BELUM LULUS'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-500 mt-0.5">
                        {evaluation.feedbackMessage}
                      </p>
                    </div>
                  </div>

                  {/* Score pill */}
                  <div className="text-right">
                    <span className="font-bungee text-2xl sm:text-3xl text-[#0c389c] leading-none">
                      {evaluation.score}%
                    </span>
                    <div className="text-[9px] font-black text-gray-400 uppercase">AKURASI</div>
                  </div>
                </div>

                {/* Auto-advance notification banner */}
                {isAutoAdvancing && (
                  <div className="bg-[#d1fae5] border-2 border-[#047857] text-[#065f46] p-2.5 rounded-xl font-heading font-black text-xs flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#059669] fill-current" />
                      <span>Akurasi ≥ {PASS_THRESHOLD}%! Lulus otomatis, lanjut ke huruf berikutnya...</span>
                    </div>
                    <button
                      onClick={handleNext}
                      className="bg-[#059669] hover:bg-[#047857] text-white px-2.5 py-1 rounded-lg text-[10px] font-bungee cursor-pointer"
                    >
                      LANJUT ➔
                    </button>
                  </div>
                )}

                {/* Accuracy details */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
                  <div className="bg-[#f6eedf] p-2 rounded-lg border border-[#0b1a3d]/20">
                    <span className="text-[10px] text-gray-500 uppercase block">Jumlah Coretan</span>
                    <span className={evaluation.strokeCountMatch ? 'text-[#059669]' : 'text-[#d9261c]'}>
                      {evaluation.userStrokesCount} dari {evaluation.expectedStrokes} standar {evaluation.strokeCountMatch ? '✓' : ''}
                    </span>
                  </div>
                  <div className="bg-[#f6eedf] p-2 rounded-lg border border-[#0b1a3d]/20">
                    <span className="text-[10px] text-gray-500 uppercase block">Cakupan Bentuk</span>
                    <span className="text-[#0c389c]">
                      {evaluation.coveragePercent}% pas di bidang
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  {evaluation.score >= PASS_THRESHOLD ? (
                    <button
                      onClick={handleConfirmCorrect}
                      className="w-full sm:flex-1 retro-btn retro-btn-green py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>{isAutoAdvancing ? 'LANJUT SEKARANG ➔ (ENTER)' : 'BENAR & LANJUT ➔ (ENTER)'}</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleRetryCurrent}
                        className="w-full sm:flex-1 retro-btn retro-btn-yellow py-2.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>ULANGI LAGI</span>
                      </button>

                      <button
                        onClick={handleConfirmCorrect}
                        title="Tetap anggap benar jika menurutmu sudah cukup mirip"
                        className="w-full sm:w-auto retro-btn retro-btn-white py-2.5 px-3 text-xs text-[#059669] border-[#059669] hover:bg-[#d1fae5]"
                      >
                        TETAP LULUSKAN ➔
                      </button>
                    </>
                  )}

                  {evaluation.score >= PASS_THRESHOLD && (
                    <button
                      onClick={handleRetryCurrent}
                      className="w-full sm:w-auto retro-btn retro-btn-yellow py-2.5 px-4 text-xs flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>ULANGI LAGI</span>
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    className="w-full sm:w-auto retro-btn retro-btn-white py-2.5 px-3 text-xs"
                  >
                    LEWATI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
