export type UtsCategory =
  | 'all'              // Simulasi Penuh UTS (75% Hiragana / 25% Katakana)
  | 'particles'        // Partikel Dasar (wa, ka, mo, no, ga, ni, to, o, de, e)
  | 'family_counters'  // Anggota Keluarga & Hitungan Orang (Uchi vs Soto, hitori, futari, dll.)
  | 'hiragana_daily'   // Kosakata Hiragana: Benda, Makanan, Alam, Fuji, dll.
  | 'classroom'        // Kosakata Kelas & Sekolah (gakusei, sensei, kyooshitsu, dll.)
  | 'house_rooms'      // Rumah, Ruangan, Perabot, Alat Listrik
  | 'katakana_loan';   // Kosakata Katakana (Pan, terebi, kamera, dll. - 25% ratio)

export type UtsQuestionType =
  | 'particle_fill'    // Melengkapi partikel dalam kalimat
  | 'kana_reading'     // Membaca kana ke romaji / arti
  | 'meaning_to_kana'  // Arti Indonesia -> pilih kata kana yang tepat
  | 'spelling_choice'  // Memilih ejaan kana yang tepat (distraktor visual)
  | 'honorific_choice' // Uchi (keluarga sendiri) vs Soto (keluarga orang lain)
  | 'counter_choice';  // Hitungan orang (hitori, futari, yo-nin, dll.)

export interface UtsQuestion {
  id: string;
  category: UtsCategory;
  script: 'hiragana' | 'katakana' | 'grammar';
  type: UtsQuestionType;
  prompt: string;               // Display text/sentence/word
  subPrompt?: string;            // Secondary hint, instruction
  audioText?: string;            // Japanese text for speech synthesizer
  options: string[];             // 4 choices
  correctAnswer: string;         // The correct answer string
  romaji?: string;               // Romaji transcription
  indonesianMeaning: string;     // Indonesian translation / meaning
  vocabHelper?: string;          // Key vocabulary guide (e.g. "chichi = ayah • haha = ibu")
  hint?: string;                 // Contextual hint
  explanation: string;           // In-depth explanation for learning
  pdfReference?: string;         // Page reference in PDF Pertemuan 6
}

export interface UtsExamConfig {
  questionCount: number;         // Jumlah soal (e.g. 20 atau 40)
  category: UtsCategory;         // Kategori ('all' untuk simulasi proporsi 75:25)
  hiraganaRatio: number;         // Proporsi Hiragana (default 0.75)
  katakanaRatio: number;         // Proporsi Katakana (default 0.25)
  passingScore: number;          // Batas kelulusan persentase (default 65)
  shuffleOptions: boolean;       // Kocok acak 4 opsi jawaban (default true)
  timeLimitMinutes?: number;     // Durasi pengerjaan dalam menit
}

export type UtsGradeLetter = 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E';

export interface UtsGradeInfo {
  letter: UtsGradeLetter;
  gpaValue: number;              // 4.0, 3.5, 3.0, 2.5, 2.0, 1.0, 0.0
  predicate: string;             // Predikat (e.g. "Istimewa", "Amat Baik", dll.)
  status: 'Lulus' | 'Remedial' | 'Tidak Lulus';
  color: string;                 // Hex color code untuk badge UI
  description: string;           // Keterangan evaluasi akademik
}

export interface UtsCategoryBreakdown {
  category: UtsCategory;
  categoryLabel: string;
  total: number;
  correct: number;
  accuracy: number;              // 0 - 100%
}

export interface UtsReviewItem {
  questionIndex: number;
  question: UtsQuestion;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  pdfReference?: string;
}

export interface UtsExamSummary {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number;                 // Nilai skala 0 - 100
  grade: UtsGradeInfo;
  hiraganaCount: number;
  katakanaCount: number;
  hiraganaRatioAchieved: number; // e.g. 0.75
  katakanaRatioAchieved: number; // e.g. 0.25
  categoryBreakdown: Record<string, UtsCategoryBreakdown>;
  reviewItems: UtsReviewItem[];
  mistakesToReview: UtsReviewItem[]; // Khusus soal salah untuk dipelajari ulang
  completedAt: number;           // Epoch timestamp
  timeSpentSeconds?: number;
}

export interface UtsAnswerRecord {
  question: UtsQuestion;
  userAnswer: string;
  isCorrect: boolean;
  answeredAt?: number;
}

export interface UtsExamSessionState {
  questions: UtsQuestion[];
  currentIndex: number;
  selectedAnswer: string | null;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
  score: number;
  answersHistory: UtsAnswerRecord[];
  isFinished: boolean;
  config?: UtsExamConfig;
  summary?: UtsExamSummary | null;
  timeRemainingSeconds?: number;
}
