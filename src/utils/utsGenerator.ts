import {
  UtsCategory,
  UtsCategoryBreakdown,
  UtsExamConfig,
  UtsExamSessionState,
  UtsExamSummary,
  UtsGradeInfo,
  UtsGradeLetter,
  UtsQuestion,
  UtsReviewItem,
} from '../types/uts';

/**
 * Konfigurasi default sesi simulasi Ujian Tengah Semester (UTS).
 * Menjamin perbandingan proporsi 75% Hiragana/Tata Bahasa dan 25% Katakana.
 */
export const DEFAULT_UTS_CONFIG: UtsExamConfig = {
  questionCount: 20,
  category: 'all',
  hiraganaRatio: 0.75, // 75% Hiragana / Partikel / Tata Bahasa
  katakanaRatio: 0.25, // 25% Kosakata Serapan Katakana
  passingScore: 65,     // Standar kelulusan UTS (skala 100)
  shuffleOptions: true, // Kocok 4 opsi pilihan ganda
  timeLimitMinutes: 20, // 20 menit untuk 20 soal (1 menit/soal)
};

/**
 * Algoritma Pengocok Acak Murni Fisher-Yates (Knuth Shuffle).
 * O(n) waktu, non-mutating (mengembalikan salinan array baru tanpa mengubah input).
 *
 * @param array Array elemen yang ingin diacak
 * @returns Array baru dengan urutan elemen yang telah diacak secara merata (unbiased)
 */
export function fisherYatesShuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    // Pilih indeks acak dari 0 sampai i (inklusif)
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Mengocok susunan 4 pilihan ganda (A, B, C, D) menggunakan Fisher-Yates shuffle.
 * Menjamin bahwa correctAnswer tetap ada dalam daftar opsi tanpa duplikasi.
 *
 * @param question Soal UTS
 * @returns Soal baru dengan opsi pilihan ganda yang telah diacak posisinya
 */
export function shuffleQuestionOptions(question: UtsQuestion): UtsQuestion {
  // Pastikan kunci jawaban berada dalam kumpulan opsi dan unik
  const uniqueSet = new Set<string>();
  
  // Masukkan kunci jawaban terlebih dahulu agar tidak pernah hilang
  if (question.correctAnswer) {
    uniqueSet.add(question.correctAnswer);
  }
  
  for (const opt of question.options) {
    uniqueSet.add(opt);
  }

  const optionsArray = Array.from(uniqueSet);
  const shuffledOptions = fisherYatesShuffle(optionsArray);

  return {
    ...question,
    options: shuffledOptions,
  };
}

/**
 * Memeriksa apakah sebuah soal dikategorikan sebagai Katakana.
 */
export function isKatakanaQuestion(question: UtsQuestion): boolean {
  return (
    question.script === 'katakana' ||
    question.category === 'katakana_loan'
  );
}

/**
 * Memisahkan bank soal menjadi dua kelompok:
 * 1. Hiragana, Partikel, dan Tata Bahasa (Keluarga, Kelas, Rumah, Partikel)
 * 2. Katakana (Kosakata serapan pinjaman)
 */
export function partitionQuestionPool(pool: readonly UtsQuestion[]): {
  hiraganaPool: UtsQuestion[];
  katakanaPool: UtsQuestion[];
} {
  const hiraganaPool: UtsQuestion[] = [];
  const katakanaPool: UtsQuestion[] = [];

  for (const q of pool) {
    if (isKatakanaQuestion(q)) {
      katakanaPool.push(q);
    } else {
      hiraganaPool.push(q);
    }
  }

  return { hiraganaPool, katakanaPool };
}

/**
 * Menghitung kuota proporsi soal berdasarkan rasio target (misal 75% Hiragana : 25% Katakana).
 *
 * Contoh:
 * - 20 soal -> 15 Hiragana/Tata Bahasa (75%) dan 5 Katakana (25%)
 * - 40 soal -> 30 Hiragana/Tata Bahasa (75%) dan 10 Katakana (25%)
 * - 10 soal -> 8 Hiragana/Tata Bahasa dan 2 Katakana
 */
export function calculateTargetProportions(
  totalCount: number,
  katakanaRatio = 0.25
): { targetKatakana: number; targetHiragana: number } {
  const safeTotal = Math.max(1, totalCount);
  const targetKatakana = Math.round(safeTotal * katakanaRatio);
  const targetHiragana = safeTotal - targetKatakana;

  return { targetKatakana, targetHiragana };
}

/**
 * Generator Sesi Soal UTS:
 * 1. Menjamin perbandingan 75% Hiragana/Tata Bahasa dan 25% Katakana saat kategori 'all'.
 * 2. Mengocok bank soal dengan Fisher-Yates shuffle sebelum memilih subset.
 * 3. Mengacak 4 opsi pilihan ganda tiap soal.
 * 4. Mengocok kembali urutan akhir semua soal agar soal Katakana & Hiragana tersebar natural.
 *
 * @param questionPool Kumpulan bank soal UTS lengkap
 * @param userConfig Konfigurasi simulasi UTS (jumlah soal, filter kategori, dll.)
 * @returns Daftar soal siap uji untuk sesi UTS
 */
export function generateUtsQuestions(
  questionPool: readonly UtsQuestion[],
  userConfig?: Partial<UtsExamConfig>
): UtsQuestion[] {
  const config: UtsExamConfig = {
    ...DEFAULT_UTS_CONFIG,
    ...userConfig,
  };

  if (!questionPool || questionPool.length === 0) {
    return [];
  }

  // JIKA PENGGUNA MEMILIH KATEGORI SPESIFIK (bukan simulasi penuh 'all')
  if (config.category && config.category !== 'all') {
    const filtered = questionPool.filter((q) => q.category === config.category);
    const shuffledFiltered = fisherYatesShuffle(filtered);
    const selected = shuffledFiltered.slice(0, Math.min(config.questionCount, shuffledFiltered.length));

    return selected.map((q) => (config.shuffleOptions ? shuffleQuestionOptions(q) : { ...q }));
  }

  // SIMULASI PENUH UTS ('all'): MENJAMIN 75% HIRAGANA & 25% KATAKANA
  const { hiraganaPool, katakanaPool } = partitionQuestionPool(questionPool);

  const { targetKatakana } = calculateTargetProportions(
    config.questionCount,
    config.katakanaRatio
  );

  // Acak masing-masing pool sebelum diambil
  const shuffledHiragana = fisherYatesShuffle(hiraganaPool);
  const shuffledKatakana = fisherYatesShuffle(katakanaPool);

  // Ambil soal Katakana sesuai kuota (dengan proteksi jika pool Katakana kurang)
  const actualKatakanaCount = Math.min(targetKatakana, shuffledKatakana.length);
  const selectedKatakana = shuffledKatakana.slice(0, actualKatakanaCount);

  // Jika Katakana kurang dari kuota, sisa slot dialihkan ke Hiragana
  const neededHiraganaCount = config.questionCount - selectedKatakana.length;
  const actualHiraganaCount = Math.min(neededHiraganaCount, shuffledHiragana.length);
  const selectedHiragana = shuffledHiragana.slice(0, actualHiraganaCount);

  // Jika Hiragana masih belum memenuhi target total dan masih ada sisa Katakana, tutupi dari sisa Katakana
  const totalSelectedSoFar = selectedKatakana.length + selectedHiragana.length;
  let extraKatakana: UtsQuestion[] = [];
  if (totalSelectedSoFar < config.questionCount && shuffledKatakana.length > actualKatakanaCount) {
    const neededExtra = Math.min(
      config.questionCount - totalSelectedSoFar,
      shuffledKatakana.length - actualKatakanaCount
    );
    extraKatakana = shuffledKatakana.slice(actualKatakanaCount, actualKatakanaCount + neededExtra);
  }

  // Gabungkan seluruh soal yang terpilih
  const combined = [...selectedHiragana, ...selectedKatakana, ...extraKatakana];

  // Acak pilihan ganda tiap soal jika opsi shuffle aktif
  const preparedQuestions = combined.map((q) =>
    config.shuffleOptions ? shuffleQuestionOptions(q) : { ...q }
  );

  // Kocok acak urutan final soal dengan Fisher-Yates agar Hiragana & Katakana berbaur alami
  return fisherYatesShuffle(preparedQuestions);
}

/**
 * Menghitung Nilai Huruf dan Predikat Akademik berdasarkan skala UTS Standar:
 * - 85 - 100 : A  (4.0) - Istimewa / Sangat Memuaskan
 * - 75 - 84  : B+ (3.5) - Amat Baik
 * - 65 - 74  : B  (3.0) - Baik / Memuaskan
 * - 55 - 64  : C  (2.0) - Cukup (Batas Minimum Kelulusan)
 * - 40 - 54  : D  (1.0) - Kurang (Wajib Remedial)
 * - 0 - 39   : E  (0.0) - Gagal (Harus Mengulang Materi)
 */
export function calculateGrade(scorePercentage: number): UtsGradeInfo {
  const clamped = Math.max(0, Math.min(100, Math.round(scorePercentage)));

  if (clamped >= 85) {
    return {
      letter: 'A',
      gpaValue: 4.0,
      predicate: 'Istimewa / Sangat Memuaskan',
      status: 'Lulus',
      color: '#16a34a', // Emerald 600
      description: 'Penguasaan materi Hiragana, Partikel, dan Katakana Pertemuan 6 sangat prima!',
    };
  }

  if (clamped >= 75) {
    return {
      letter: 'B+',
      gpaValue: 3.5,
      predicate: 'Amat Baik',
      status: 'Lulus',
      color: '#059669', // Emerald 700
      description: 'Pemahaman konsep dasar dan kosakata sangat solid dengan sedikit kekeliruan kecil.',
    };
  }

  if (clamped >= 65) {
    return {
      letter: 'B',
      gpaValue: 3.0,
      predicate: 'Baik / Memuaskan',
      status: 'Lulus',
      color: '#2563eb', // Blue 600
      description: 'Lulus dengan baik. Beberapa partikel atau ejaan katakana masih perlu dilatih kembali.',
    };
  }

  if (clamped >= 55) {
    return {
      letter: 'C',
      gpaValue: 2.0,
      predicate: 'Cukup (Batas Kelulusan)',
      status: 'Lulus',
      color: '#d97706', // Amber 600
      description: 'Mencapai batas minimum kelulusan. Sangat dianjurkan mengulang materi partikel & keluarga.',
    };
  }

  if (clamped >= 40) {
    return {
      letter: 'D',
      gpaValue: 1.0,
      predicate: 'Kurang (Perlu Remedial)',
      status: 'Remedial',
      color: '#ea580c', // Orange 600
      description: 'Belum memenuhi standar minimum. Pelajari ulang daftar soal yang keliru di bawah.',
    };
  }

  return {
    letter: 'E',
    gpaValue: 0.0,
    predicate: 'Gagal (Harus Mengulang)',
    status: 'Tidak Lulus',
    color: '#dc2626', // Red 600
    description: 'Perlu bimbingan intensif dan latihan pengenalan kana serta fungsi partikel kalimat.',
  };
}

/**
 * Pemetaan label deskriptif kategori untuk laporan ringkasan hasil UTS.
 */
export const CATEGORY_LABELS: Record<UtsCategory, string> = {
  all: 'Simulasi Penuh UTS (75% Hiragana / 25% Katakana)',
  particles: 'Partikel Dasar (wa, ka, mo, no, ga, ni, to, o, de, e)',
  family_counters: 'Keluarga & Sebutan Orang (Uchi vs Soto)',
  hiragana_daily: 'Kosakata Dasar Hiragana (Benda & Alam)',
  classroom: 'Kosakata Ruang Kelas & Sekolah',
  house_rooms: 'Rumah, Ruangan & Perabot Listrik',
  katakana_loan: 'Kosakata Serapan Katakana',
};

/**
 * Menyusun ringkasan akhir simulasi UTS:
 * - Skor persentase (0-100) dan predikat huruf (A, B+, B, C, D, E)
 * - Jumlah benar, salah, dan soal yang terlewat
 * - Verifikasi rasio proporsi Hiragana vs Katakana
 * - Analisis performa per topik/kategori kurikulum Pertemuan 6
 * - Rekomendasi daftar soal yang salah untuk dipelajari ulang (review items)
 */
export function generateUtsSummary(
  questions: readonly UtsQuestion[],
  answersHistory: readonly {
    question: UtsQuestion;
    userAnswer: string;
    isCorrect: boolean;
  }[],
  timeSpentSeconds?: number
): UtsExamSummary {
  const totalQuestions = questions.length;
  const answeredCount = answersHistory.length;
  const correctCount = answersHistory.filter((a) => a.isCorrect).length;
  const incorrectCount = answersHistory.filter((a) => !a.isCorrect).length;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  // Skor persentase skala 0 - 100
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const grade = calculateGrade(score);

  // Hitung rasio aktual Hiragana vs Katakana yang tersaji dalam sesi ini
  const katakanaCount = questions.filter(isKatakanaQuestion).length;
  const hiraganaCount = totalQuestions - katakanaCount;
  const hiraganaRatioAchieved = totalQuestions > 0 ? Number((hiraganaCount / totalQuestions).toFixed(2)) : 0;
  const katakanaRatioAchieved = totalQuestions > 0 ? Number((katakanaCount / totalQuestions).toFixed(2)) : 0;

  // Analisis performa berdasarkan kategori materi PDF Pertemuan 6
  const breakdownMap: Record<string, { total: number; correct: number; category: UtsCategory }> = {};

  for (const q of questions) {
    const cat = q.category;
    if (!breakdownMap[cat]) {
      breakdownMap[cat] = { total: 0, correct: 0, category: cat };
    }
    breakdownMap[cat].total += 1;
  }

  for (const answer of answersHistory) {
    const cat = answer.question.category;
    if (breakdownMap[cat] && answer.isCorrect) {
      breakdownMap[cat].correct += 1;
    }
  }

  const categoryBreakdown: Record<string, UtsCategoryBreakdown> = {};
  for (const [catKey, stats] of Object.entries(breakdownMap)) {
    const cat = catKey as UtsCategory;
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    categoryBreakdown[catKey] = {
      category: cat,
      categoryLabel: CATEGORY_LABELS[cat] || catKey,
      total: stats.total,
      correct: stats.correct,
      accuracy,
    };
  }

  // Buat riwayat lengkap semua soal (review items)
  const answerMap = new Map<string, { userAnswer: string; isCorrect: boolean }>();
  for (const item of answersHistory) {
    answerMap.set(item.question.id, {
      userAnswer: item.userAnswer,
      isCorrect: item.isCorrect,
    });
  }

  const reviewItems: UtsReviewItem[] = questions.map((q, idx) => {
    const record = answerMap.get(q.id);
    const userAnswer = record ? record.userAnswer : '(Belum dijawab)';
    const isCorrect = record ? record.isCorrect : false;

    return {
      questionIndex: idx + 1,
      question: q,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      pdfReference: q.pdfReference,
    };
  });

  // Filter khusus daftar soal yang salah/belum terjawab untuk dipelajari ulang
  const mistakesToReview = reviewItems.filter((item) => !item.isCorrect);

  return {
    totalQuestions,
    answeredCount,
    correctCount,
    incorrectCount,
    unansweredCount,
    score,
    grade,
    hiraganaCount,
    katakanaCount,
    hiraganaRatioAchieved,
    katakanaRatioAchieved,
    categoryBreakdown,
    reviewItems,
    mistakesToReview,
    completedAt: Date.now(),
    timeSpentSeconds,
  };
}

/**
 * Format string teks nilai UTS siap pajang (e.g. "85/100 (A - Istimewa)").
 */
export function formatScoreBadge(score: number, gradeLetter: UtsGradeLetter): string {
  return `${score}/100 (${gradeLetter})`;
}

/**
 * Inisialisasi State Sesi Simulasi UTS baru.
 */
export function createInitialUtsSession(
  questions: UtsQuestion[],
  config?: Partial<UtsExamConfig>
): UtsExamSessionState {
  const mergedConfig: UtsExamConfig = {
    ...DEFAULT_UTS_CONFIG,
    ...config,
  };

  const timeLimitSeconds = mergedConfig.timeLimitMinutes
    ? mergedConfig.timeLimitMinutes * 60
    : undefined;

  return {
    questions,
    currentIndex: 0,
    selectedAnswer: null,
    isAnswerSubmitted: false,
    isCorrect: null,
    score: 0,
    answersHistory: [],
    isFinished: false,
    config: mergedConfig,
    summary: null,
    timeRemainingSeconds: timeLimitSeconds,
  };
}

/**
 * Submit jawaban untuk soal saat ini pada sesi simulasi.
 */
export function submitAnswerToSession(
  state: UtsExamSessionState,
  selectedAnswer: string
): UtsExamSessionState {
  if (state.isFinished || state.currentIndex >= state.questions.length) {
    return state;
  }

  const currentQuestion = state.questions[state.currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const newScore = isCorrect ? state.score + 1 : state.score;

  const newHistory = [
    ...state.answersHistory,
    {
      question: currentQuestion,
      userAnswer: selectedAnswer,
      isCorrect,
      answeredAt: Date.now(),
    },
  ];

  return {
    ...state,
    selectedAnswer,
    isAnswerSubmitted: true,
    isCorrect,
    score: newScore,
    answersHistory: newHistory,
  };
}

/**
 * Berpindah ke soal berikutnya dalam sesi UTS, atau menyelesaikan sesi jika sudah soal terakhir.
 */
export function advanceToNextQuestion(
  state: UtsExamSessionState
): UtsExamSessionState {
  const nextIndex = state.currentIndex + 1;

  if (nextIndex >= state.questions.length) {
    return finishUtsSession(state);
  }

  return {
    ...state,
    currentIndex: nextIndex,
    selectedAnswer: null,
    isAnswerSubmitted: false,
    isCorrect: null,
  };
}

/**
 * Mengunci dan menyelesaikan sesi UTS serta menyusun laporan ringkasan hasil secara otomatis.
 */
export function finishUtsSession(state: UtsExamSessionState): UtsExamSessionState {
  const summary = generateUtsSummary(state.questions, state.answersHistory);

  return {
    ...state,
    isFinished: true,
    summary,
  };
}
