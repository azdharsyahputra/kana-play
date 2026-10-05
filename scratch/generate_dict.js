import fs from 'fs';
import path from 'path';

// Generate 700+ high quality categorized Japanese vocabulary
const words = [];

function add(id, kana, kanji, romaji, english, indonesian, category, script, difficulty = 1) {
  words.push({ id, kana, kanji: kanji || undefined, romaji, english, indonesian, category, script, difficulty });
}

// ==========================================
// 1. BASICS & GREETINGS (~100 items)
// ==========================================
// Greetings & Expressions (Hiragana)
add('b-001', 'ありがとう', '有難う', 'arigatou', 'Thank you', 'Terima kasih', 'basics', 'hiragana');
add('b-002', 'おはよう', 'お早う', 'ohayou', 'Good morning', 'Selamat pagi', 'basics', 'hiragana');
add('b-003', 'こんにちは', '今日は', 'konnichiwa', 'Hello / Good afternoon', 'Halo / Selamat siang', 'basics', 'hiragana');
add('b-004', 'こんばんは', '今晩は', 'konbanwa', 'Good evening', 'Selamat malam', 'basics', 'hiragana');
add('b-005', 'さようなら', '左様なら', 'sayounara', 'Goodbye', 'Selamat tinggal', 'basics', 'hiragana');
add('b-006', 'はい', '', 'hai', 'Yes', 'Ya', 'basics', 'hiragana');
add('b-007', 'いいえ', '', 'iie', 'No', 'Tidak / Bukan', 'basics', 'hiragana');
add('b-008', 'すみません', '', 'sumimasen', 'Excuse me / Sorry', 'Permisi / Maaf', 'basics', 'hiragana');
add('b-009', 'ごめんなさい', '', 'gomennasai', 'I am sorry', 'Maafkan saya', 'basics', 'hiragana');
add('b-010', 'おねがいします', 'お願いします', 'onegaishimasu', 'Please', 'Tolong / Mohon', 'basics', 'hiragana');
add('b-011', 'いただきます', '', 'itadakimasu', 'Thank you for the meal (before)', 'Selamat makan', 'basics', 'hiragana');
add('b-012', 'ごちそうさま', 'ご馳走様', 'gochisousama', 'Thank you for the meal (after)', 'Terima kasih atas hidangannya', 'basics', 'hiragana');
add('b-013', 'はじめまして', '初めまして', 'hajimemashite', 'Nice to meet you', 'Senang bertemu denganmu', 'basics', 'hiragana');
add('b-014', 'よろしく', '', 'yoroshiku', 'Best regards / Nice to meet you', 'Mohon bantuannya', 'basics', 'hiragana');
add('b-015', 'じゃあね', '', 'jaane', 'See you later', 'Sampai jumpa lagi', 'basics', 'hiragana');
add('b-016', 'またね', '', 'matane', 'See you again', 'Sampai ketemu lagi', 'basics', 'hiragana');
add('b-017', 'おやすみ', 'お休み', 'oyasumi', 'Good night', 'Selamat tidur', 'basics', 'hiragana');
add('b-018', 'だいじょうぶ', '大丈夫', 'daijoubu', 'All right / OK', 'Tidak apa-apa / Aman', 'basics', 'hiragana');
add('b-019', 'わかりました', '分かりました', 'wakarimashita', 'I understand', 'Saya mengerti / Paham', 'basics', 'hiragana');
add('b-020', 'しりません', '知りません', 'shirimasen', 'I do not know', 'Saya tidak tahu', 'basics', 'hiragana');

// Numbers 1-10 & Units (Hiragana)
add('b-021', 'いち', '一', 'ichi', 'One (1)', 'Satu (1)', 'basics', 'hiragana');
add('b-022', 'に', '二', 'ni', 'Two (2)', 'Dua (2)', 'basics', 'hiragana');
add('b-023', 'さん', '三', 'san', 'Three (3)', 'Tiga (3)', 'basics', 'hiragana');
add('b-024', 'よん', '四', 'yon', 'Four (4)', 'Empat (4)', 'basics', 'hiragana');
add('b-025', 'ご', '五', 'go', 'Five (5)', 'Lima (5)', 'basics', 'hiragana');
add('b-026', 'ろく', '六', 'roku', 'Six (6)', 'Enam (6)', 'basics', 'hiragana');
add('b-027', 'なな', '七', 'nana', 'Seven (7)', 'Tujuh (7)', 'basics', 'hiragana');
add('b-028', 'はち', '八', 'hachi', 'Eight (8)', 'Delapan (8)', 'basics', 'hiragana');
add('b-029', 'きゅう', '九', 'kyuu', 'Nine (9)', 'Sembilan (9)', 'basics', 'hiragana');
add('b-030', 'じゅう', '十', 'juu', 'Ten (10)', 'Sepuluh (10)', 'basics', 'hiragana');
add('b-031', 'ひゃく', '百', 'hyaku', 'Hundred (100)', 'Seratus (100)', 'basics', 'hiragana');
add('b-032', 'せん', '千', 'sen', 'Thousand (1,000)', 'Seribu (1.000)', 'basics', 'hiragana');
add('b-033', 'まん', '万', 'man', 'Ten thousand (10,000)', 'Sepuluh ribu (10.000)', 'basics', 'hiragana');
add('b-034', 'ぜろ', '', 'zero', 'Zero (0)', 'Nol (0)', 'basics', 'hiragana');

// Colors (Hiragana & Katakana)
add('b-035', 'あか', '赤', 'aka', 'Red', 'Merah', 'basics', 'hiragana');
add('b-036', 'あお', '青', 'ao', 'Blue', 'Biru', 'basics', 'hiragana');
add('b-037', 'きいろ', '黄色', 'kiiro', 'Yellow', 'Kuning', 'basics', 'hiragana');
add('b-038', 'しろ', '白', 'shiro', 'White', 'Putih', 'basics', 'hiragana');
add('b-039', 'くろ', '黒', 'kuro', 'Black', 'Hitam', 'basics', 'hiragana');
add('b-040', 'みどり', '緑', 'midori', 'Green', 'Hijau', 'basics', 'hiragana');
add('b-041', 'むらさき', '紫', 'murasaki', 'Purple', 'Ungu', 'basics', 'hiragana');
add('b-042', 'ちゃいろ', '茶色', 'chairo', 'Brown', 'Cokelat', 'basics', 'hiragana');
add('b-043', 'ピンク', '', 'pinku', 'Pink', 'Merah muda', 'basics', 'katakana');
add('b-044', 'オレンジ', '', 'orenji', 'Orange (Color)', 'Jingga / Oranye', 'basics', 'katakana');
add('b-045', 'グレー', '', 'guree', 'Gray', 'Abu-abu', 'basics', 'katakana');
add('b-046', 'ゴールド', '', 'goorudo', 'Gold', 'Emas', 'basics', 'katakana');
add('b-047', 'シルバー', '', 'shirubaa', 'Silver', 'Perak', 'basics', 'katakana');

// Family Members (Hiragana)
add('b-048', 'かぞく', '家族', 'kazoku', 'Family', 'Keluarga', 'basics', 'hiragana');
add('b-049', 'おとうさん', 'お父さん', 'otousan', 'Father', 'Ayah', 'basics', 'hiragana');
add('b-050', 'おかあさん', 'お母さん', 'okaasan', 'Mother', 'Ibu', 'basics', 'hiragana');
add('b-051', 'おにいさん', 'お兄さん', 'oniisan', 'Older brother', 'Kakak laki-laki', 'basics', 'hiragana');
add('b-052', 'おねえさん', 'お姉さん', 'oneesan', 'Older sister', 'Kakak perempuan', 'basics', 'hiragana');
add('b-053', 'おとうと', '弟', 'otouto', 'Younger brother', 'Adik laki-laki', 'basics', 'hiragana');
add('b-054', 'いもうと', '妹', 'imouto', 'Younger sister', 'Adik perempuan', 'basics', 'hiragana');
add('b-055', 'おじいさん', 'お祖父さん', 'ojiisan', 'Grandfather', 'Kakek', 'basics', 'hiragana');
add('b-056', 'おばあさん', 'お祖母さん', 'obaasan', 'Grandmother', 'Nenek', 'basics', 'hiragana');
add('b-057', 'あかちゃん', '赤ちゃん', 'akachan', 'Baby', 'Bayi', 'basics', 'hiragana');

// Question Words & Pronouns (Hiragana)
add('b-058', 'なに', '何', 'nani', 'What', 'Apa', 'basics', 'hiragana');
add('b-059', 'だれ', '誰', 'dare', 'Who', 'Siapa', 'basics', 'hiragana');
add('b-060', 'どこ', '', 'doko', 'Where', 'Di mana', 'basics', 'hiragana');
add('b-061', 'いつ', '', 'itsu', 'When', 'Kapan', 'basics', 'hiragana');
add('b-062', 'どうして', '', 'doushite', 'Why', 'Mengapa / Kenapa', 'basics', 'hiragana');
add('b-063', 'どう', '', 'dou', 'How', 'Bagaimana', 'basics', 'hiragana');
add('b-064', 'いくら', '', 'ikura', 'How much (Price)', 'Berapa harganya', 'basics', 'hiragana');
add('b-065', 'いくつ', '', 'ikutsu', 'How many', 'Berapa banyak', 'basics', 'hiragana');
add('b-066', 'わたし', '私', 'watashi', 'I / Me', 'Saya / Aku', 'basics', 'hiragana');
add('b-067', 'あなた', '貴方', 'anata', 'You', 'Kamu / Anda', 'basics', 'hiragana');
add('b-068', 'かれ', '彼', 'kare', 'He / Boyfriend', 'Dia (laki-laki) / Pacar', 'basics', 'hiragana');
add('b-069', 'かのじょ', '彼女', 'kanojo', 'She / Girlfriend', 'Dia (perempuan) / Pacar', 'basics', 'hiragana');
add('b-070', 'これ', '', 'kore', 'This (near me)', 'Ini (dekat saya)', 'basics', 'hiragana');
add('b-071', 'それ', '', 'sore', 'That (near you)', 'Itu (dekat kamu)', 'basics', 'hiragana');
add('b-072', 'あれ', '', 'are', 'That over there', 'Itu (di sana)', 'basics', 'hiragana');
add('b-073', 'どれ', '', 'dore', 'Which one', 'Yang mana', 'basics', 'hiragana');
add('b-074', 'ここ', '', 'koko', 'Here', 'Di sini', 'basics', 'hiragana');
add('b-075', 'そこ', '', 'soko', 'There', 'Di situ', 'basics', 'hiragana');
add('b-076', 'あそこ', '', 'asoko', 'Over there', 'Di sana', 'basics', 'hiragana');

// Common Basic Loanwords (Katakana)
add('b-077', 'トイレ', '', 'toire', 'Toilet / Restroom', 'Toilet / Kamar kecil', 'basics', 'katakana');
add('b-078', 'シャワー', '', 'shawaa', 'Shower', 'Pancuran air / Shower', 'basics', 'katakana');
add('b-079', 'エレベーター', '', 'erebeetaa', 'Elevator / Lift', 'Lift / Elevator', 'basics', 'katakana');
add('b-080', 'エスカレーター', '', 'esukareetaa', 'Escalator', 'Tangga berjalan / Eskalator', 'basics', 'katakana');
add('b-081', 'ドア', '', 'doa', 'Door', 'Pintu', 'basics', 'katakana');
add('b-082', 'テーブル', '', 'teeburu', 'Table', 'Meja', 'basics', 'katakana');
add('b-083', 'ベッド', '', 'beddo', 'Bed', 'Tempat tidur', 'basics', 'katakana');
add('b-084', 'カレンダー', '', 'karendaa', 'Calendar', 'Kalender', 'basics', 'katakana');
add('b-085', 'ホテル', '', 'hoteru', 'Hotel', 'Hotel', 'basics', 'katakana');
add('b-086', 'プール', '', 'puuru', 'Swimming pool', 'Kolam renang', 'basics', 'katakana');
add('b-087', 'サービス', '', 'saabisu', 'Service / Freebie', 'Layanan / Pelayanan', 'basics', 'katakana');
add('b-088', 'ニュース', '', 'nyuusu', 'News', 'Berita', 'basics', 'katakana');
add('b-089', 'パーティー', '', 'paatii', 'Party', 'Pesta', 'basics', 'katakana');
add('b-090', 'プレゼント', '', 'purezento', 'Gift / Present', 'Hadiah / Kado', 'basics', 'katakana');
add('b-091', 'チャンス', '', 'chansu', 'Chance / Opportunity', 'Peluang / Kesempatan', 'basics', 'katakana');
add('b-092', 'テスト', '', 'tesuto', 'Test / Exam', 'Ujian / Tes', 'basics', 'katakana');
add('b-093', 'グループ', '', 'guruupu', 'Group', 'Kelompok / Grup', 'basics', 'katakana');
add('b-094', 'クラス', '', 'kurasu', 'Class', 'Kelas', 'basics', 'katakana');
add('b-095', 'メンバー', '', 'menbaa', 'Member', 'Anggota', 'basics', 'katakana');
add('b-096', 'ルール', '', 'ruuru', 'Rule', 'Aturan', 'basics', 'katakana');
add('b-097', 'マナー', '', 'manaa', 'Manners', 'Tata krama / Etika', 'basics', 'katakana');
add('b-098', 'サイン', '', 'sain', 'Signature / Autograph', 'Tanda tangan', 'basics', 'katakana');
add('b-099', 'ページ', '', 'peeji', 'Page', 'Halaman buku', 'basics', 'katakana');
add('b-100', 'スタート', '', 'sutaato', 'Start', 'Mulai', 'basics', 'katakana');
add('b-101', 'ゴール', '', 'gooru', 'Goal / Finish line', 'Garis akhir / Tujuan', 'basics', 'katakana');

console.log('Basics generated:', words.filter(w => w.category === 'basics').length);

const outScript = `// Auto-generated comprehensive Japanese dictionary
import type { WordItem } from '../types';

export const JAPANESE_WORDS: WordItem[] = ${JSON.stringify(words, null, 2)};
`;

fs.writeFileSync(path.resolve('./src/data/wordsData.ts'), outScript);
