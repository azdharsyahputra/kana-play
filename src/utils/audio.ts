// Web Audio API Retro Arcade Synthesizer
let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Mobile / Web Audio unlocker - call on user gesture if needed
 */
export function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}

let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('kanadrill_sound', enabled ? 'true' : 'false');
  }
}

export function getSoundEnabled(): boolean {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kanadrill_sound');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  }
  return soundEnabled;
}

/**
 * Play a cheerful 8-bit arcade correct sound (2-tone ascending ding)
 */
export function playCorrectSound(streak = 1) {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Pitch escalates slightly with streak combo
  const baseFreq = Math.min(587.33 * (1 + (streak - 1) * 0.05), 1200); // D5 -> up
  const nextFreq = baseFreq * 1.5; // Perfect fifth

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.setValueAtTime(nextFreq, now + 0.08);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.3);
}

/**
 * Play a retro 8-bit thud / buzzer for incorrect answer
 */
export function playIncorrectSound() {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.26);
}

/**
 * Play an awesome Level Up fanfare / Starburst chime!
 */
export function playLevelUpSound() {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major arpeggio
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now + idx * 0.07);

    gain.gain.setValueAtTime(0.18, now + idx * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.07);
    osc.stop(now + idx * 0.07 + 0.28);
  });
}

/**
 * Tactile mechanical arcade button click sound
 */
export function playKeyClickSound() {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.045);
}

// -------------------------------------------------------------
// WEB SPEECH API (JAPANESE TEXT-TO-SPEECH)
// -------------------------------------------------------------

export interface SpeakJapaneseOptions {
  /**
   * If true, treats standalone particle letters with their phonetic reading:
   * 'は' -> 'わ' (wa), 'へ' -> 'え' (e), 'を' -> 'お' (o).
   */
  asParticle?: boolean;
  /** Speech rate (default: 0.85 for clean educational pronunciation) */
  rate?: number;
  /** Speech pitch (default: 1.0) */
  pitch?: number;
  /** Volume 0.0 to 1.0 (default: 1.0) */
  volume?: number;
  /** Callback fired when utterance completes */
  onEnd?: () => void;
  /** Callback fired on synthesis error */
  onError?: (err: unknown) => void;
}

// Cache Japanese voice reference
let cachedJaVoice: SpeechSynthesisVoice | null = null;

export function loadJapaneseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  if (cachedJaVoice) return cachedJaVoice;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // 1. Look for exact ja-JP match
  const exactMatch = voices.find(v => v.lang === 'ja-JP' || v.lang === 'ja_JP');
  if (exactMatch) {
    cachedJaVoice = exactMatch;
    return exactMatch;
  }

  // 2. Fallback to any ja* match
  const broadMatch = voices.find(v => v.lang.toLowerCase().startsWith('ja'));
  if (broadMatch) {
    cachedJaVoice = broadMatch;
    return broadMatch;
  }

  return null;
}

// Listen for voice loading event in browsers that populate voices asynchronously
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedJaVoice = null;
    loadJapaneseVoice();
  };
}

// Retain active utterance to prevent Chromium garbage collection bug
let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Prepares Japanese text for speech synthesis:
 * 1. Handles fill-in-the-blank placeholders (e.g. `___`, `（　）`, `[?]`)
 * 2. Normalizes spacing between Japanese characters so morphological tokenizers
 *    correctly recognize particles (e.g. `わたし は がくせい` -> `わたしはがくせい` => は pronounced 'wa')
 * 3. Strips incidental Latin particle annotations like `(wa)` or `(e)`
 */
export function formatJapaneseForTTS(text: string, fillValue?: string): string {
  if (!text) return '';

  let cleaned = text;

  // Strip parenthetical romaji / hints, e.g. "は (wa)" -> "は" or "へ (e)" -> "へ"
  cleaned = cleaned.replace(/\s*\([a-zA-Z\s]+\)/g, '');

  // Fill in blanks if fillValue provided, otherwise replace blanks with a natural pause (Japanese comma 、)
  const blankRegex = /_{2,}|\(\s*\)|（\s*）|\[\s*\.\.\.\s*\]|\[\s*\?\s*\]|\[\s*\]/g;
  if (fillValue !== undefined) {
    cleaned = cleaned.replace(blankRegex, fillValue.trim());
  } else {
    // Blank question prompt reading: pause slightly at the blank
    cleaned = cleaned.replace(blankRegex, '、');
  }

  // Remove spaces between Japanese characters (Kana/Kanji/Punctuation)
  // This is vital for TTS: "わたし は" causes Web Speech API to read は as "ha",
  // whereas "わたしは" causes TTS to read は as particle "wa".
  const jaCharPattern = /([\u3040-\u30ff\u4e00-\u9faf\u3000-\u303f])\s+([\u3040-\u30ff\u4e00-\u9faf\u3000-\u303f])/;
  while (jaCharPattern.test(cleaned)) {
    cleaned = cleaned.replace(/([\u3040-\u30ff\u4e00-\u9faf\u3000-\u303f])\s+([\u3040-\u30ff\u4e00-\u9faf\u3000-\u303f])/g, '$1$2');
  }

  return cleaned.trim();
}

/**
 * Speak standalone Japanese particle with correct phonetic pronunciation:
 * - 'は' -> synthesizes 'わ' ('wa')
 * - 'へ' -> synthesizes 'え' ('e')
 * - 'を' -> synthesizes 'お' ('o')
 * - Other particles ('か', 'も', 'の', 'が', 'に', 'と', 'で') are spoken as-is.
 */
export function speakJapaneseParticle(
  particle: string,
  options?: Omit<SpeakJapaneseOptions, 'asParticle'>
) {
  const trimmed = particle.trim();
  let phonetic = trimmed;

  if (trimmed === 'は') {
    phonetic = 'わ'; // Topic marker particle pronounced 'wa'
  } else if (trimmed === 'へ') {
    phonetic = 'え'; // Direction particle pronounced 'e'
  } else if (trimmed === 'を') {
    phonetic = 'お'; // Object marker particle pronounced 'o'
  }

  speakJapanese(phonetic, { ...options, asParticle: false });
}

/**
 * Speak full Japanese sentence or fill-in-the-blank question prompt cleanly
 */
export function speakJapaneseSentence(
  sentence: string,
  fillValue?: string,
  options?: SpeakJapaneseOptions
) {
  const prepared = formatJapaneseForTTS(sentence, fillValue);
  speakJapanese(prepared, options);
}

/**
 * Native Japanese Speech Pronunciation via Web Speech API.
 * Backward compatible with existing speakJapanese(text) calls.
 */
export function speakJapanese(
  text: string,
  options?: SpeakJapaneseOptions | boolean
) {
  if (!getSoundEnabled()) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text || !text.trim()) return;

  const opts: SpeakJapaneseOptions =
    typeof options === 'boolean'
      ? { asParticle: options }
      : options || {};

  try {
    // Handle Chrome paused queue lockup
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    let textToSpeak = text;

    // Standalone particle phonetic override
    if (opts.asParticle) {
      const trimmed = text.trim();
      if (trimmed === 'は') textToSpeak = 'わ';
      else if (trimmed === 'へ') textToSpeak = 'え';
      else if (trimmed === 'を') textToSpeak = 'お';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ja-JP';
    utterance.rate = opts.rate ?? 0.85; // slightly slower for clean learning
    utterance.pitch = opts.pitch ?? 1.0;
    utterance.volume = opts.volume ?? 1.0;

    // Explicitly set Japanese voice if available
    const jaVoice = loadJapaneseVoice();
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    // Retain reference to prevent Chromium garbage collection bug
    activeUtterance = utterance;

    utterance.onend = () => {
      activeUtterance = null;
      opts.onEnd?.();
    };

    utterance.onerror = (err) => {
      activeUtterance = null;
      opts.onError?.(err);
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    activeUtterance = null;
    opts.onError?.(err);
  }
}
