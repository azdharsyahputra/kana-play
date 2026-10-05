import fs from 'fs';
import path from 'path';

const words = [];

function add(id, kana, kanji, romaji, english, indonesian, category, script, difficulty = 1) {
  words.push({ id, kana, kanji: kanji || undefined, romaji, english, indonesian, category, script, difficulty });
}

// ==========================================
// 1. BASICS & GREETINGS (105 words)
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

// Numbers & Units (Hiragana)
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
add('b-058', 'りょうしん', '両親', 'ryoushin', 'Parents', 'Orang tua', 'basics', 'hiragana');
add('b-059', 'きょうだい', '兄弟', 'kyoudai', 'Siblings', 'Saudara kandung', 'basics', 'hiragana');

// Question Words & Pronouns (Hiragana)
add('b-060', 'なに', '何', 'nani', 'What', 'Apa', 'basics', 'hiragana');
add('b-061', 'だれ', '誰', 'dare', 'Who', 'Siapa', 'basics', 'hiragana');
add('b-062', 'どこ', '', 'doko', 'Where', 'Di mana', 'basics', 'hiragana');
add('b-063', 'いつ', '', 'itsu', 'When', 'Kapan', 'basics', 'hiragana');
add('b-064', 'どうして', '', 'doushite', 'Why', 'Mengapa / Kenapa', 'basics', 'hiragana');
add('b-065', 'どう', '', 'dou', 'How', 'Bagaimana', 'basics', 'hiragana');
add('b-066', 'いくら', '', 'ikura', 'How much (Price)', 'Berapa harganya', 'basics', 'hiragana');
add('b-067', 'いくつ', '', 'ikutsu', 'How many', 'Berapa banyak', 'basics', 'hiragana');
add('b-068', 'わたし', '私', 'watashi', 'I / Me', 'Saya / Aku', 'basics', 'hiragana');
add('b-069', 'あなた', '貴方', 'anata', 'You', 'Kamu / Anda', 'basics', 'hiragana');
add('b-070', 'かれ', '彼', 'kare', 'He / Boyfriend', 'Dia (laki-laki) / Pacar', 'basics', 'hiragana');
add('b-071', 'かのじょ', '彼女', 'kanojo', 'She / Girlfriend', 'Dia (perempuan) / Pacar', 'basics', 'hiragana');
add('b-072', 'これ', '', 'kore', 'This (near me)', 'Ini (dekat saya)', 'basics', 'hiragana');
add('b-073', 'それ', '', 'sore', 'That (near you)', 'Itu (dekat kamu)', 'basics', 'hiragana');
add('b-074', 'あれ', '', 'are', 'That over there', 'Itu (di sana)', 'basics', 'hiragana');
add('b-075', 'どれ', '', 'dore', 'Which one', 'Yang mana', 'basics', 'hiragana');
add('b-076', 'ここ', '', 'koko', 'Here', 'Di sini', 'basics', 'hiragana');
add('b-077', 'そこ', '', 'soko', 'There', 'Di situ', 'basics', 'hiragana');
add('b-078', 'あそこ', '', 'asoko', 'Over there', 'Di sana', 'basics', 'hiragana');
add('b-079', 'みんな', '', 'minna', 'Everyone', 'Semua orang', 'basics', 'hiragana');
add('b-080', 'だれか', '誰か', 'dareka', 'Someone', 'Seseorang', 'basics', 'hiragana');

// Common Basic Loanwords (Katakana)
add('b-081', 'トイレ', '', 'toire', 'Toilet / Restroom', 'Toilet / Kamar kecil', 'basics', 'katakana');
add('b-082', 'シャワー', '', 'shawaa', 'Shower', 'Pancuran air / Shower', 'basics', 'katakana');
add('b-083', 'エレベーター', '', 'erebeetaa', 'Elevator / Lift', 'Lift / Elevator', 'basics', 'katakana');
add('b-084', 'エスカレーター', '', 'esukareetaa', 'Escalator', 'Tangga berjalan / Eskalator', 'basics', 'katakana');
add('b-085', 'ドア', '', 'doa', 'Door', 'Pintu', 'basics', 'katakana');
add('b-086', 'テーブル', '', 'teeburu', 'Table', 'Meja', 'basics', 'katakana');
add('b-087', 'ベッド', '', 'beddo', 'Bed', 'Tempat tidur', 'basics', 'katakana');
add('b-088', 'カレンダー', '', 'karendaa', 'Calendar', 'Kalender', 'basics', 'katakana');
add('b-089', 'ホテル', '', 'hoteru', 'Hotel', 'Hotel', 'basics', 'katakana');
add('b-090', 'プール', '', 'puuru', 'Swimming pool', 'Kolam renang', 'basics', 'katakana');
add('b-091', 'サービス', '', 'saabisu', 'Service / Freebie', 'Layanan / Pelayanan', 'basics', 'katakana');
add('b-092', 'ニュース', '', 'nyuusu', 'News', 'Berita', 'basics', 'katakana');
add('b-093', 'パーティー', '', 'paatii', 'Party', 'Pesta', 'basics', 'katakana');
add('b-094', 'プレゼント', '', 'purezento', 'Gift / Present', 'Hadiah / Kado', 'basics', 'katakana');
add('b-095', 'チャンス', '', 'chansu', 'Chance / Opportunity', 'Peluang / Kesempatan', 'basics', 'katakana');
add('b-096', 'テスト', '', 'tesuto', 'Test / Exam', 'Ujian / Tes', 'basics', 'katakana');
add('b-097', 'グループ', '', 'guruupu', 'Group', 'Kelompok / Grup', 'basics', 'katakana');
add('b-098', 'クラス', '', 'kurasu', 'Class', 'Kelas', 'basics', 'katakana');
add('b-099', 'メンバー', '', 'menbaa', 'Member', 'Anggota', 'basics', 'katakana');
add('b-100', 'ルール', '', 'ruuru', 'Rule', 'Aturan', 'basics', 'katakana');
add('b-101', 'マナー', '', 'manaa', 'Manners', 'Tata krama / Etika', 'basics', 'katakana');
add('b-102', 'サイン', '', 'sain', 'Signature / Autograph', 'Tanda tangan', 'basics', 'katakana');
add('b-103', 'ページ', '', 'peeji', 'Page', 'Halaman buku', 'basics', 'katakana');
add('b-104', 'スタート', '', 'sutaato', 'Start', 'Mulai', 'basics', 'katakana');
add('b-105', 'ゴール', '', 'gooru', 'Goal / Finish line', 'Garis akhir / Tujuan', 'basics', 'katakana');

// ==========================================
// 2. FOOD & DRINK (105 words)
// ==========================================
// Hiragana Food
add('f-001', 'すし', '寿司', 'sushi', 'Sushi', 'Sushi', 'food', 'hiragana');
add('f-002', 'みず', '水', 'mizu', 'Water', 'Air', 'food', 'hiragana');
add('f-003', 'おちゃ', 'お茶', 'ocha', 'Green tea', 'Teh hijau', 'food', 'hiragana');
add('f-004', 'ごはん', 'ご飯', 'gohan', 'Cooked rice / Meal', 'Nasi / Makanan', 'food', 'hiragana');
add('f-005', 'たまご', '卵', 'tamago', 'Egg', 'Telur', 'food', 'hiragana');
add('f-006', 'にく', '肉', 'niku', 'Meat', 'Daging', 'food', 'hiragana');
add('f-007', 'ぎゅうにく', '牛肉', 'gyuuniku', 'Beef', 'Daging sapi', 'food', 'hiragana');
add('f-008', 'ぶたにく', '豚肉', 'butaniku', 'Pork', 'Daging babi', 'food', 'hiragana');
add('f-009', 'とりにく', '鶏肉', 'toriniku', 'Chicken meat', 'Daging ayam', 'food', 'hiragana');
add('f-010', 'さかな', '魚', 'sakana', 'Fish (Food)', 'Ikan', 'food', 'hiragana');
add('f-011', 'えび', '海老', 'ebi', 'Shrimp / Prawn', 'Udang', 'food', 'hiragana');
add('f-012', 'かに', '蟹', 'kani', 'Crab', 'Kepiting', 'food', 'hiragana');
add('f-013', 'たこ', '蛸', 'tako', 'Octopus', 'Gurita', 'food', 'hiragana');
add('f-014', 'いか', '烏賊', 'ika', 'Squid', 'Cumi-cumi', 'food', 'hiragana');
add('f-015', 'やさい', '野菜', 'yasai', 'Vegetable', 'Sayuran', 'food', 'hiragana');
add('f-016', 'くだもの', '果物', 'kudamono', 'Fruit', 'Buah-buahan', 'food', 'hiragana');
add('f-017', 'りんご', '林檎', 'ringo', 'Apple', 'Apel', 'food', 'hiragana');
add('f-018', 'みかん', '蜜柑', 'mikan', 'Mandarin orange', 'Jeruk mandarin', 'food', 'hiragana');
add('f-019', 'いちご', '苺', 'ichigo', 'Strawberry', 'Stroberi', 'food', 'hiragana');
add('f-020', 'ぶどう', '葡萄', 'budou', 'Grapes', 'Anggur', 'food', 'hiragana');
add('f-021', 'もも', '桃', 'momo', 'Peach', 'Persik', 'food', 'hiragana');
add('f-022', 'すいか', '西瓜', 'suika', 'Watermelon', 'Semangka', 'food', 'hiragana');
add('f-023', 'うどん', '', 'udon', 'Udon noodles', 'Mie udon', 'food', 'hiragana');
add('f-024', 'そば', '蕎麦', 'soba', 'Buckwheat soba noodles', 'Mie soba', 'food', 'hiragana');
add('f-025', 'てんぷら', '天ぷら', 'tenpura', 'Tempura', 'Tempura', 'food', 'hiragana');
add('f-026', 'さしみ', '刺身', 'sashimi', 'Sashimi raw fish', 'Sashimi', 'food', 'hiragana');
add('f-027', 'みそしる', '味噌汁', 'misoshiru', 'Miso soup', 'Sup miso', 'food', 'hiragana');
add('f-028', 'なっとう', '納豆', 'nattou', 'Natto fermented beans', 'Natto', 'food', 'hiragana');
add('f-029', 'とうふ', '豆腐', 'toufu', 'Tofu', 'Tahu', 'food', 'hiragana');
add('f-030', 'おにぎり', 'お握り', 'onigiri', 'Rice ball', 'Onigiri / Nasi kepal', 'food', 'hiragana');
add('f-031', 'べんとう', '弁当', 'bentou', 'Box lunch / Bento', 'Bento / Bekal', 'food', 'hiragana');
add('f-032', 'しお', '塩', 'shio', 'Salt', 'Garam', 'food', 'hiragana');
add('f-033', 'さとう', '砂糖', 'satou', 'Sugar', 'Gula', 'food', 'hiragana');
add('f-034', 'しょうゆ', '醤油', 'shouyu', 'Soy sauce', 'Kecap asin Jepang', 'food', 'hiragana');
add('f-035', 'す', '酢', 'su', 'Vinegar', 'Cuka', 'food', 'hiragana');
add('f-036', 'わさび', '山葵', 'wasabi', 'Wasabi', 'Wasabi', 'food', 'hiragana');
add('f-037', 'あめ', '飴', 'ame', 'Candy', 'Permen', 'food', 'hiragana');
add('f-038', 'もち', '餅', 'mochi', 'Rice cake / Mochi', 'Kue mochi', 'food', 'hiragana');
add('f-039', 'だんご', '団子', 'dango', 'Sweet dumpling', 'Dango', 'food', 'hiragana');
add('f-040', 'やきとり', '焼き鳥', 'yakitori', 'Grilled chicken skewer', 'Sate ayam Jepang', 'food', 'hiragana');
add('f-041', 'ぎょうざ', '餃子', 'gyouza', 'Dumpling / Gyoza', 'Gyoza', 'food', 'hiragana');
add('f-042', 'たいやき', '鯛焼き', 'taiyaki', 'Fish-shaped cake', 'Taiyaki', 'food', 'hiragana');
add('f-043', 'たこやき', 'たこ焼き', 'takoyaki', 'Octopus balls', 'Takoyaki', 'food', 'hiragana');
add('f-044', 'おこのみやき', 'お好み焼き', 'okonomiyaki', 'Savory pancake', 'Okonomiyaki', 'food', 'hiragana');
add('f-045', 'すきやき', 'すき焼き', 'sukiyaki', 'Sukiyaki hotpot', 'Sukiyaki', 'food', 'hiragana');
add('f-046', 'しゃぶしゃぶ', '', 'shabushabu', 'Shabu-shabu hotpot', 'Shabu-shabu', 'food', 'hiragana');
add('f-047', 'からあげ', '唐揚げ', 'karaage', 'Fried chicken', 'Ayam goreng karaage', 'food', 'hiragana');
add('f-048', 'とんかつ', '豚カツ', 'tonkatsu', 'Pork cutlet', 'Tonkatsu', 'food', 'hiragana');
add('f-049', 'かつどん', 'カツ丼', 'katsudon', 'Pork cutlet rice bowl', 'Katsudon', 'food', 'hiragana');
add('f-050', 'ぎゅうどん', '牛丼', 'gyuudon', 'Beef rice bowl', 'Gyudon / Nasi daging sapi', 'food', 'hiragana');

// Katakana Food
add('f-051', 'ラーメン', '拉麺', 'raamen', 'Ramen noodles', 'Mie ramen', 'food', 'katakana');
add('f-052', 'コーヒー', '', 'koohii', 'Coffee', 'Kopi', 'food', 'katakana');
add('f-053', 'パン', '', 'pan', 'Bread', 'Roti', 'food', 'katakana');
add('f-054', 'ピザ', '', 'piza', 'Pizza', 'Pizza', 'food', 'katakana');
add('f-055', 'カレー', '', 'karee', 'Curry rice', 'Kari Jepang', 'food', 'katakana');
add('f-056', 'ケーキ', '', 'keeki', 'Cake', 'Kue bolu / Tart', 'food', 'katakana');
add('f-057', 'ミルク', '', 'miruku', 'Milk', 'Susu', 'food', 'katakana');
add('f-058', 'アイス', '', 'aisu', 'Ice cream', 'Es krim', 'food', 'katakana');
add('f-059', 'ジュース', '', 'juusu', 'Juice', 'Jus buah', 'food', 'katakana');
add('f-060', 'バーガー', '', 'baagaa', 'Burger', 'Burger', 'food', 'katakana');
add('f-061', 'ハンバーグ', '', 'hanbaagu', 'Hamburg steak', 'Steak daging cincang', 'food', 'katakana');
add('f-062', 'ステーキ', '', 'suteeki', 'Steak', 'Steak daging', 'food', 'katakana');
add('f-063', 'パスタ', '', 'pasuta', 'Pasta', 'Pasta', 'food', 'katakana');
add('f-064', 'スパゲッティ', '', 'supagetthi', 'Spaghetti', 'Spaghetti', 'food', 'katakana');
add('f-065', 'サラダ', '', 'sarada', 'Salad', 'Salad sayur', 'food', 'katakana');
add('f-066', 'スープ', '', 'suupu', 'Soup', 'Sup', 'food', 'katakana');
add('f-067', 'サンドイッチ', '', 'sandoicchi', 'Sandwich', 'Roti lapis / Sandwich', 'food', 'katakana');
add('f-068', 'トースト', '', 'toosuto', 'Toast', 'Roti panggang', 'food', 'katakana');
add('f-069', 'チーズ', '', 'chiizu', 'Cheese', 'Keju', 'food', 'katakana');
add('f-070', 'バター', '', 'bataa', 'Butter', 'Mentega', 'food', 'katakana');
add('f-071', 'ジャム', '', 'jamu', 'Jam / Jelly', 'Selai buah', 'food', 'katakana');
add('f-072', 'ヨーグルト', '', 'yooguruto', 'Yogurt', 'Yoghurt', 'food', 'katakana');
add('f-073', 'チョコ', '', 'choko', 'Chocolate', 'Cokelat manis', 'food', 'katakana');
add('f-074', 'クッキー', '', 'kukkii', 'Cookie', 'Kukis / Biskuit', 'food', 'katakana');
add('f-075', 'ポテト', '', 'poteto', 'French fries / Potato', 'Kentang goreng', 'food', 'katakana');
add('f-076', 'ソーセージ', '', 'sooseeji', 'Sausage', 'Sosis', 'food', 'katakana');
add('f-077', 'ハム', '', 'hamu', 'Ham', 'Daging asap / Ham', 'food', 'katakana');
add('f-078', 'ベーコン', '', 'beekon', 'Bacon', 'Bacon', 'food', 'katakana');
add('f-079', 'オムレツ', '', 'omuretsu', 'Omelette', 'Telur dadar / Omelet', 'food', 'katakana');
add('f-080', 'ビール', '', 'biiru', 'Beer', 'Bir', 'food', 'katakana');
add('f-081', 'ワイン', '', 'wain', 'Wine', 'Anggur minuman / Wine', 'food', 'katakana');
add('f-082', 'ウイスキー', '', 'uisukii', 'Whiskey', 'Wiski', 'food', 'katakana');
add('f-083', 'カクテル', '', 'kakuteru', 'Cocktail', 'Koktail', 'food', 'katakana');
add('f-084', 'コーラ', '', 'koora', 'Cola / Soda', 'Minuman kola / Soda', 'food', 'katakana');
add('f-085', 'サイダー', '', 'saidaa', 'Cider / Soda pop', 'Soda berkarbonasi', 'food', 'katakana');
add('f-086', 'レモン', '', 'remon', 'Lemon', 'Lemon', 'food', 'katakana');
add('f-087', 'バナナ', '', 'banana', 'Banana', 'Pisang', 'food', 'katakana');
add('f-088', 'パイナップル', '', 'painappuru', 'Pineapple', 'Nanas', 'food', 'katakana');
add('f-089', 'メロン', '', 'meron', 'Melon', 'Melon', 'food', 'katakana');
add('f-090', 'マンゴー', '', 'mangoo', 'Mango', 'Mangga', 'food', 'katakana');
add('f-091', 'トマト', '', 'tomato', 'Tomato', 'Tomat', 'food', 'katakana');
add('f-092', 'キャベツ', '', 'kyabetsu', 'Cabbage', 'Kubis / Kol', 'food', 'katakana');
add('f-093', 'レタス', '', 'retasu', 'Lettuce', 'Selada', 'food', 'katakana');
add('f-094', 'タマネギ', '', 'tamanegi', 'Onion', 'Bawang bombay', 'food', 'katakana');
add('f-095', 'ニンジン', '', 'ninjin', 'Carrot', 'Wortel', 'food', 'katakana');
add('f-096', 'ピーマン', '', 'piiman', 'Bell pepper', 'Paprika hijau', 'food', 'katakana');
add('f-097', 'マッシュルーム', '', 'masshyuruumu', 'Mushroom', 'Jamur kancing', 'food', 'katakana');
add('f-098', 'プリン', '', 'purin', 'Pudding / Flan', 'Puding karamel', 'food', 'katakana');
add('f-099', 'ドーナツ', '', 'doonatsu', 'Donut', 'Donat', 'food', 'katakana');
add('f-100', 'ポップコーン', '', 'poppukoon', 'Popcorn', 'Popcorn / Jagung berondong', 'food', 'katakana');
add('f-101', 'ガム', '', 'gamu', 'Chewing gum', 'Permen karet', 'food', 'katakana');
add('f-102', 'ゼリー', '', 'zerii', 'Jelly', 'Jeli', 'food', 'katakana');
add('f-103', 'ケチャップ', '', 'kechyappu', 'Ketchup', 'Saus tomat', 'food', 'katakana');
add('f-104', 'マヨネーズ', '', 'mayoneezu', 'Mayonnaise', 'Mayones', 'food', 'katakana');
add('f-105', 'ソース', '', 'soosu', 'Sauce', 'Saus', 'food', 'katakana');

// ==========================================
// 3. ANIMALS (105 words)
// ==========================================
// Hiragana Animals
add('a-001', 'ねこ', '猫', 'neko', 'Cat', 'Kucing', 'animals', 'hiragana');
add('a-002', 'いぬ', '犬', 'inu', 'Dog', 'Anjing', 'animals', 'hiragana');
add('a-003', 'とり', '鳥', 'tori', 'Bird', 'Burung', 'animals', 'hiragana');
add('a-004', 'さかな', '魚', 'sakana', 'Fish', 'Ikan', 'animals', 'hiragana');
add('a-005', 'うま', '馬', 'uma', 'Horse', 'Kuda', 'animals', 'hiragana');
add('a-006', 'うし', '牛', 'ushi', 'Cow / Cattle', 'Sapi', 'animals', 'hiragana');
add('a-007', 'ぶた', '豚', 'buta', 'Pig', 'Babi', 'animals', 'hiragana');
add('a-008', 'ひつじ', '羊', 'hitsuji', 'Sheep', 'Domba', 'animals', 'hiragana');
add('a-009', 'やぎ', '山羊', 'yagi', 'Goat', 'Kambing', 'animals', 'hiragana');
add('a-010', 'さる', '猿', 'saru', 'Monkey', 'Monyet / Kera', 'animals', 'hiragana');
add('a-011', 'うさぎ', '兎', 'usagi', 'Rabbit', 'Kelinci', 'animals', 'hiragana');
add('a-012', 'ねずみ', '鼠', 'nezumi', 'Mouse / Rat', 'Tikus', 'animals', 'hiragana');
add('a-013', 'くま', '熊', 'kuma', 'Bear', 'Beruang', 'animals', 'hiragana');
add('a-014', 'しか', '鹿', 'shika', 'Deer', 'Rusa', 'animals', 'hiragana');
add('a-015', 'きつね', '狐', 'kitsune', 'Fox', 'Rubah', 'animals', 'hiragana');
add('a-016', 'たぬき', '狸', 'tanuki', 'Raccoon dog', 'Tanuki / Anjing rakun', 'animals', 'hiragana');
add('a-017', 'おおかみ', '狼', 'ookami', 'Wolf', 'Serigala', 'animals', 'hiragana');
add('a-018', 'かえる', '蛙', 'kaeru', 'Frog', 'Katak / Kodok', 'animals', 'hiragana');
add('a-019', 'かめ', '亀', 'kame', 'Turtle / Tortoise', 'Kura-kura / Penyu', 'animals', 'hiragana');
add('a-020', 'へび', '蛇', 'hebi', 'Snake', 'Ular', 'animals', 'hiragana');
add('a-021', 'わに', '鰐', 'wani', 'Crocodile / Alligator', 'Buaya', 'animals', 'hiragana');
add('a-022', 'くじら', '鯨', 'kujira', 'Whale', 'Paus', 'animals', 'hiragana');
add('a-023', 'いるか', '海豚', 'iruka', 'Dolphin', 'Lumba-lumba', 'animals', 'hiragana');
add('a-024', 'さめ', '鮫', 'same', 'Shark', 'Hiu', 'animals', 'hiragana');
add('a-025', 'すずめ', '雀', 'suzume', 'Sparrow', 'Burung gereja', 'animals', 'hiragana');
add('a-026', 'からす', '烏', 'karasu', 'Crow / Raven', 'Burung gagak', 'animals', 'hiragana');
add('a-027', 'つばめ', '燕', 'tsubame', 'Swallow (Bird)', 'Burung walet', 'animals', 'hiragana');
add('a-028', 'はと', '鳩', 'hato', 'Pigeon / Dove', 'Burung merpati', 'animals', 'hiragana');
add('a-029', 'わし', '鷲', 'washi', 'Eagle', 'Burung elang', 'animals', 'hiragana');
add('a-030', 'たか', '鷹', 'taka', 'Hawk / Falcon', 'Burung rajawali', 'animals', 'hiragana');
add('a-031', 'ふくろう', '梟', 'fukurou', 'Owl', 'Burung hantu', 'animals', 'hiragana');
add('a-032', 'ぺんぎん', '', 'penguin', 'Penguin', 'Pinguin', 'animals', 'hiragana');
add('a-033', 'むし', '虫', 'mushi', 'Insect / Bug', 'Serangga', 'animals', 'hiragana');
add('a-034', 'ちょうちょ', '蝶々', 'choucho', 'Butterfly', 'Kupu-kupu', 'animals', 'hiragana');
add('a-035', 'あり', '蟻', 'ari', 'Ant', 'Semut', 'animals', 'hiragana');
add('a-036', 'はち', '蜂', 'hachi', 'Bee / Wasp', 'Lebah / Tawon', 'animals', 'hiragana');
add('a-037', 'か', '蚊', 'ka', 'Mosquito', 'Nyamuk', 'animals', 'hiragana');
add('a-038', 'はえ', '蝿', 'hae', 'Fly (Insect)', 'Lalat', 'animals', 'hiragana');
add('a-039', 'くも', '蜘蛛', 'kumo', 'Spider', 'Laba-laba', 'animals', 'hiragana');
add('a-040', 'せみ', '蝉', 'semi', 'Cicada', 'Tonggeret / Cicada', 'animals', 'hiragana');
add('a-041', 'ほたる', '蛍', 'hotaru', 'Firefly', 'Kunang-kunang', 'animals', 'hiragana');
add('a-042', 'かぶとむし', '甲虫', 'kabutomushi', 'Rhinoceros beetle', 'Kumbang tanduk', 'animals', 'hiragana');
add('a-043', 'くわがた', '鍬形', 'kuwagata', 'Stag beetle', 'Kumbang capit', 'animals', 'hiragana');
add('a-044', 'とんぼ', '蜻蛉', 'tonbo', 'Dragonfly', 'Capung', 'animals', 'hiragana');
add('a-045', 'ばった', '飛蝗', 'batta', 'Grasshopper', 'Belalang', 'animals', 'hiragana');
add('a-046', 'かまきり', '蟷螂', 'kamakiri', 'Praying mantis', 'Belalang sembah', 'animals', 'hiragana');
add('a-047', 'かたつむり', '蝸牛', 'katatsumuri', 'Snail', 'Siput / Bekicot', 'animals', 'hiragana');
add('a-048', 'みみず', '蚯蚓', 'mimizu', 'Earthworm', 'Cacing tanah', 'animals', 'hiragana');
add('a-049', 'くらげ', '水母', 'kurage', 'Jellyfish', 'Ubur-ubur', 'animals', 'hiragana');
add('a-050', 'ヒトデ', '海星', 'hitode', 'Starfish', 'Bintang laut', 'animals', 'hiragana');

// Katakana Animals
add('a-051', 'パンダ', '', 'panda', 'Panda', 'Panda', 'animals', 'katakana');
add('a-052', 'コアラ', '', 'koara', 'Koala', 'Koala', 'animals', 'katakana');
add('a-053', 'ゴリラ', '', 'gorira', 'Gorilla', 'Gorila', 'animals', 'katakana');
add('a-054', 'ライオン', '', 'raion', 'Lion', 'Singa', 'animals', 'katakana');
add('a-055', 'トラ', '虎', 'tora', 'Tiger', 'Harimau', 'animals', 'katakana');
add('a-056', 'チーター', '', 'chiitaa', 'Cheetah', 'Cheetah', 'animals', 'katakana');
add('a-057', 'ヒョウ', '豹', 'hyou', 'Leopard / Panther', 'Macan tutul', 'animals', 'katakana');
add('a-058', 'ゾウ', '象', 'zou', 'Elephant', 'Gajah', 'animals', 'katakana');
add('a-059', 'キリン', '麒麟', 'kirin', 'Giraffe', 'Jerapah', 'animals', 'katakana');
add('a-060', 'カバ', '河馬', 'kaba', 'Hippopotamus', 'Kuda nil', 'animals', 'katakana');
add('a-061', 'サイ', '犀', 'sai', 'Rhinoceros', 'Badak', 'animals', 'katakana');
add('a-062', 'シマウマ', '縞馬', 'shimauma', 'Zebra', 'Zebra', 'animals', 'katakana');
add('a-063', 'ラクダ', '駱駝', 'rakuda', 'Camel', 'Unta', 'animals', 'katakana');
add('a-064', 'カンガルー', '', 'kangaruu', 'Kangaroo', 'Kangguru', 'animals', 'katakana');
add('a-065', 'ワラビー', '', 'warabii', 'Wallaby', 'Walabi', 'animals', 'katakana');
add('a-066', 'オオカミ', '', 'ookami', 'Wolf', 'Serigala', 'animals', 'katakana');
add('a-067', 'キツネ', '', 'kitsune', 'Fox', 'Rubah', 'animals', 'katakana');
add('a-068', 'リス', '栗鼠', 'risu', 'Squirrel', 'Tupai', 'animals', 'katakana');
add('a-069', 'ハムスター', '', 'hamusutaa', 'Hamster', 'Hamster', 'animals', 'katakana');
add('a-070', 'モルモット', '', 'morumotto', 'Guinea pig', 'Marmut', 'animals', 'katakana');
add('a-071', 'ハリネズミ', '針鼠', 'harinezumi', 'Hedgehog', 'Landak mini', 'animals', 'katakana');
add('a-072', 'ナマケモノ', '樹懶', 'namakemono', 'Sloth', 'Kungkang / Sloth', 'animals', 'katakana');
add('a-073', 'コウモリ', '蝙蝠', 'koumori', 'Bat (Animal)', 'Kelelawar', 'animals', 'katakana');
add('a-074', 'オットセイ', '誜', 'ottosei', 'Fur seal', 'Anjing laut', 'animals', 'katakana');
add('a-075', 'アシカ', '海鹿', 'ashika', 'Sea lion', 'Singa laut', 'animals', 'katakana');
add('a-076', 'アザラシ', '海豹', 'azarashi', 'Seal', 'Anjing laut kutub', 'animals', 'katakana');
add('a-077', 'セイウチ', '海象', 'seiuchi', 'Walrus', 'Beruang laut / Walrus', 'animals', 'katakana');
add('a-078', 'ラッコ', '猟虎', 'rakko', 'Sea otter', 'Berang-berang laut', 'animals', 'katakana');
add('a-079', 'ペンギン', '', 'penguin', 'Penguin', 'Pinguin', 'animals', 'katakana');
add('a-080', 'フラミンゴ', '', 'furamingo', 'Flamingo', 'Flamingo', 'animals', 'katakana');
add('a-081', 'ダチョウ', '駝鳥', 'dachou', 'Ostrich', 'Burung unta', 'animals', 'katakana');
add('a-082', 'ペリカン', '', 'perikan', 'Pelican', 'Burung pelikan', 'animals', 'katakana');
add('a-083', 'オウム', '鸚鵡', 'oumu', 'Parrot', 'Burung beo / Kakatua', 'animals', 'katakana');
add('a-084', 'インコ', '', 'inko', 'Parakeet', 'Burung parkit', 'animals', 'katakana');
add('a-085', 'カナリア', '', 'kanaria', 'Canary bird', 'Burung kenari', 'animals', 'katakana');
add('a-086', 'カモメ', '鴎', 'kamome', 'Seagull', 'Burung camar', 'animals', 'katakana');
add('a-087', 'ツル', '鶴', 'tsuru', 'Crane bird', 'Burung bangau', 'animals', 'katakana');
add('a-088', 'ハクチョウ', '白鳥', 'hakuchou', 'Swan', 'Angsa putih', 'animals', 'katakana');
add('a-089', 'カモ', '鴨', 'kamo', 'Wild duck', 'Bebek liar', 'animals', 'katakana');
add('a-090', 'アヒル', '家鴨', 'ahiru', 'Domestic duck', 'Bebek / Itik', 'animals', 'katakana');
add('a-091', 'シャチ', '鯱', 'shachi', 'Killer whale / Orca', 'Paus orca / Pembunuh', 'animals', 'katakana');
add('a-092', 'マンタ', '', 'manta', 'Manta ray', 'Pari manta', 'animals', 'katakana');
add('a-093', 'エイ', '鱝', 'ei', 'Stingray', 'Ikan pari', 'animals', 'katakana');
add('a-094', 'マグロ', '鮪', 'maguro', 'Tuna fish', 'Ikan tuna', 'animals', 'katakana');
add('a-095', 'サケ', '鮭', 'sake', 'Salmon', 'Ikan salmon', 'animals', 'katakana');
add('a-096', 'タイ', '鯛', 'tai', 'Sea bream', 'Ikan kakap merah / Tai', 'animals', 'katakana');
add('a-097', 'ウナギ', '鰻', 'unagi', 'Eel', 'Belut air tawar / Unagi', 'animals', 'katakana');
add('a-098', 'チンパンジー', '', 'chinpanjii', 'Chimpanzee', 'Simpanse', 'animals', 'katakana');
add('a-099', 'オランウータン', '', 'oran-uutan', 'Orangutan', 'Orangutan', 'animals', 'katakana');
add('a-100', 'トカゲ', '蜥蜴', 'tokage', 'Lizard', 'Kadal', 'animals', 'katakana');
add('a-101', 'ヤモリ', '守宮', 'yamori', 'Gecko', 'Cicak / Tokek', 'animals', 'katakana');
add('a-102', 'イグアナ', '', 'iguana', 'Iguana', 'Iguana', 'animals', 'katakana');
add('a-103', 'カメレオン', '', 'kamereon', 'Chameleon', 'Bunglon', 'animals', 'katakana');
add('a-104', 'サソリ', '蠍', 'sasori', 'Scorpion', 'Kalajengking', 'animals', 'katakana');
add('a-105', 'ゴキブリ', '蜚蠊', 'gokiburi', 'Cockroach', 'Kecoak', 'animals', 'katakana');

// ==========================================
// 4. DAILY & OBJECTS (105 words)
// ==========================================
// Hiragana Daily Objects
add('d-001', 'ほん', '本', 'hon', 'Book', 'Buku', 'daily', 'hiragana');
add('d-002', 'くるま', '車', 'kuruma', 'Car', 'Mobil', 'daily', 'hiragana');
add('d-003', 'いえ', '家', 'ie', 'House / Home', 'Rumah', 'daily', 'hiragana');
add('d-004', 'まち', '町', 'machi', 'Town / City', 'Kota', 'daily', 'hiragana');
add('d-005', 'みち', '道', 'michi', 'Road / Street', 'Jalan raya', 'daily', 'hiragana');
add('d-006', 'でんしゃ', '電車', 'densha', 'Train', 'Kereta api listrik', 'daily', 'hiragana');
add('d-007', 'ちかてつ', '地下鉄', 'chikatetsu', 'Subway / Underground', 'Kereta bawah tanah / MRT', 'daily', 'hiragana');
add('d-008', 'ひこうき', '飛行機', 'hikouki', 'Airplane', 'Pesawat terbang', 'daily', 'hiragana');
add('d-009', 'ふね', '船', 'fune', 'Ship / Boat', 'Kapal laut', 'daily', 'hiragana');
add('d-010', 'じてんしゃ', '自転車', 'jitensha', 'Bicycle', 'Sepeda', 'daily', 'hiragana');
add('d-011', 'えき', '駅', 'eki', 'Train station', 'Stasiun kereta', 'daily', 'hiragana');
add('d-012', 'くうこう', '空港', 'kuukou', 'Airport', 'Bandara udara', 'daily', 'hiragana');
add('d-013', 'がっこう', '学校', 'gakkou', 'School', 'Sekolah', 'daily', 'hiragana');
add('d-014', 'びょういん', '病院', 'byouin', 'Hospital', 'Rumah sakit', 'daily', 'hiragana');
add('d-015', 'ぎんこう', '銀行', 'ginkou', 'Bank', 'Bank', 'daily', 'hiragana');
add('d-016', 'ゆうびんきょく', '郵便局', 'yuubinkyoku', 'Post office', 'Kantor pos', 'daily', 'hiragana');
add('d-017', 'こうえん', '公園', 'kouen', 'Park', 'Taman kota', 'daily', 'hiragana');
add('d-018', 'としょかん', '図書館', 'toshokan', 'Library', 'Perpustakaan', 'daily', 'hiragana');
add('d-019', 'へや', '部屋', 'heya', 'Room', 'Kamar / Ruangan', 'daily', 'hiragana');
add('d-020', 'つくえ', '机', 'tsukue', 'Desk', 'Meja belajar / kerja', 'daily', 'hiragana');
add('d-021', 'いす', '椅子', 'isu', 'Chair', 'Kursi', 'daily', 'hiragana');
add('d-022', 'まど', '窓', 'mado', 'Window', 'Jendela', 'daily', 'hiragana');
add('d-023', 'かぎ', '鍵', 'kagi', 'Key / Lock', 'Kunci', 'daily', 'hiragana');
add('d-024', 'とけい', '時計', 'tokei', 'Clock / Watch', 'Jam dinding / tangan', 'daily', 'hiragana');
add('d-025', 'でんわ', '電話', 'denwa', 'Telephone', 'Telepon', 'daily', 'hiragana');
add('d-026', 'めがね', '眼鏡', 'megane', 'Glasses / Spectacles', 'Kacamata', 'daily', 'hiragana');
add('d-027', 'かばん', '鞄', 'kaban', 'Bag / Briefcase', 'Tas', 'daily', 'hiragana');
add('d-028', 'さいふ', '財布', 'saifu', 'Wallet / Purse', 'Dompet', 'daily', 'hiragana');
add('d-029', 'おかね', 'お金', 'okane', 'Money', 'Uang', 'daily', 'hiragana');
add('d-030', 'きっぷ', '切符', 'kippu', 'Ticket', 'Tiket karcis', 'daily', 'hiragana');
add('d-031', 'かさ', '傘', 'kasa', 'Umbrella', 'Payung', 'daily', 'hiragana');
add('d-032', 'くつ', '靴', 'kutsu', 'Shoes', 'Sepatu', 'daily', 'hiragana');
add('d-033', 'くつした', '靴下', 'kutsushita', 'Socks', 'Kaos kaki', 'daily', 'hiragana');
add('d-034', 'ふく', '服', 'fuku', 'Clothes / Clothing', 'Pakaian / Baju', 'daily', 'hiragana');
add('d-035', 'ぼうし', '帽子', 'boushi', 'Hat / Cap', 'Topi', 'daily', 'hiragana');
add('d-036', 'てがみ', '手紙', 'tegami', 'Letter', 'Surat', 'daily', 'hiragana');
add('d-037', 'きって', '切手', 'kitte', 'Postage stamp', 'Prangko', 'daily', 'hiragana');
add('d-038', 'はし', '箸', 'hashi', 'Chopsticks', 'Sumpit', 'daily', 'hiragana');
add('d-039', 'さら', '皿', 'sara', 'Plate / Dish', 'Piring', 'daily', 'hiragana');
add('d-040', 'ちゃわん', '茶碗', 'chawan', 'Rice bowl / Teacup', 'Mangkok nasi', 'daily', 'hiragana');
add('d-041', 'ふとん', '布団', 'futon', 'Futon bedding', 'Kasur futon Jepang', 'daily', 'hiragana');
add('d-042', 'まくら', '枕', 'makura', 'Pillow', 'Bantal', 'daily', 'hiragana');
add('d-043', 'かがみ', '鏡', 'kagami', 'Mirror', 'Cermin', 'daily', 'hiragana');
add('d-044', 'はぶらし', '歯ブラシ', 'haburashi', 'Toothbrush', 'Sikat gigi', 'daily', 'hiragana');
add('d-045', 'せっけん', '石鹸', 'sekken', 'Soap', 'Sabun mandi', 'daily', 'hiragana');
add('d-046', 'くすり', '薬', 'kusuri', 'Medicine', 'Obat', 'daily', 'hiragana');
add('d-047', 'ばんごう', '番号', 'bangou', 'Number', 'Nomor', 'daily', 'hiragana');
add('d-048', 'なまえ', '名前', 'namae', 'Name', 'Nama', 'daily', 'hiragana');
add('d-049', 'しごと', '仕事', 'shigoto', 'Work / Job', 'Pekerjaan', 'daily', 'hiragana');
add('d-050', 'やすみ', '休み', 'yasumi', 'Holiday / Rest', 'Libur / Istirahat', 'daily', 'hiragana');

// Katakana Daily Objects
add('d-051', 'テレビ', '', 'terebi', 'Television', 'Televisi', 'daily', 'katakana');
add('d-052', 'スマホ', '', 'sumaho', 'Smartphone', 'Ponsel pintar', 'daily', 'katakana');
add('d-053', 'パソコン', '', 'pasokon', 'Laptop / PC', 'Komputer jinjing / Laptop', 'daily', 'katakana');
add('d-054', 'カメラ', '', 'kamera', 'Camera', 'Kamera foto', 'daily', 'katakana');
add('d-055', 'ノート', '', 'nooto', 'Notebook', 'Buku catatan', 'daily', 'katakana');
add('d-056', 'ペン', '', 'pen', 'Pen', 'Pena / Pulpen', 'daily', 'katakana');
add('d-057', 'ボールペン', '', 'boorupen', 'Ballpoint pen', 'Pulpen bolpoin', 'daily', 'katakana');
add('d-058', 'シャープペン', '', 'shaapupen', 'Mechanical pencil', 'Pensil mekanik', 'daily', 'katakana');
add('d-059', '消しゴム', '', 'keshigomu', 'Eraser / Rubber', 'Penghapus karet', 'daily', 'katakana');
add('d-060', 'ハサミ', '', 'hasami', 'Scissors', 'Gunting', 'daily', 'katakana');
add('d-061', 'テープ', '', 'teepu', 'Tape', 'Plester / Lakban', 'daily', 'katakana');
add('d-062', 'タオル', '', 'taoru', 'Towel', 'Handuk', 'daily', 'katakana');
add('d-063', 'ティッシュ', '', 'thisshyu', 'Tissue paper', 'Tisu', 'daily', 'katakana');
add('d-064', 'ハンカチ', '', 'hankachi', 'Handkerchief', 'Sapu tangan', 'daily', 'katakana');
add('d-065', 'シャツ', '', 'shatsu', 'Shirt', 'Kemeja / Kaos', 'daily', 'katakana');
add('d-066', 'Tシャツ', '', 'tiishatsu', 'T-shirt', 'Kaos oblong', 'daily', 'katakana');
add('d-067', 'ズボン', '', 'zubon', 'Trousers / Pants', 'Celana panjang', 'daily', 'katakana');
add('d-068', 'スカート', '', 'sukaato', 'Skirt', 'Rok', 'daily', 'katakana');
add('d-069', 'ワンピース', '', 'wanpiisu', 'Dress / One-piece', 'Gaun terusan', 'daily', 'katakana');
add('d-070', 'コート', '', 'kooto', 'Coat', 'Mantel / Jas panjang', 'daily', 'katakana');
add('d-071', 'ジャケット', '', 'jaketto', 'Jacket', 'Jaket', 'daily', 'katakana');
add('d-072', 'セーター', '', 'seetaa', 'Sweater', 'Baju hangat / Sweater', 'daily', 'katakana');
add('d-073', 'ネクタイ', '', 'nekutai', 'Necktie', 'Dasi', 'daily', 'katakana');
add('d-074', 'ベルト', '', 'beruto', 'Belt', 'Ikat pinggang / Sabuk', 'daily', 'katakana');
add('d-075', 'スニーカー', '', 'suniikaa', 'Sneakers', 'Sepatu kets / Sneaker', 'daily', 'katakana');
add('d-076', 'サンダル', '', 'sandaru', 'Sandals', 'Sandal', 'daily', 'katakana');
add('d-077', 'ブーツ', '', 'buutsu', 'Boots', 'Sepatu bot', 'daily', 'katakana');
add('d-078', 'スリッパ', '', 'surippa', 'Slippers', 'Sandal rumah', 'daily', 'katakana');
add('d-079', 'メガネ', '', 'megane', 'Glasses', 'Kacamata', 'daily', 'katakana');
add('d-080', 'コンタクト', '', 'kontakuto', 'Contact lenses', 'Lensa kontak', 'daily', 'katakana');
add('d-081', 'イヤホン', '', 'iyahon', 'Earphones', 'Earphone / Headset', 'daily', 'katakana');
add('d-082', 'ヘッドホン', '', 'heddohon', 'Headphones', 'Headphone', 'daily', 'katakana');
add('d-083', 'スピーカー', '', 'supiikaa', 'Speaker', 'Pengeras suara / Speaker', 'daily', 'katakana');
add('d-084', 'マイク', '', 'maiku', 'Microphone', 'Mikrofon', 'daily', 'katakana');
add('d-085', 'ラジオ', '', 'rajio', 'Radio', 'Radio', 'daily', 'katakana');
add('d-086', 'エアコン', '', 'eakon', 'Air conditioner', 'Pendingin ruangan / AC', 'daily', 'katakana');
add('d-087', 'ヒーター', '', 'hiitaa', 'Heater', 'Pemanas ruangan', 'daily', 'katakana');
add('d-088', 'ファン', '', 'fan', 'Electric fan', 'Kipas angin', 'daily', 'katakana');
add('d-089', '冷蔵庫', '', 'reizouko', 'Refrigerator', 'Kulkas', 'daily', 'katakana');
add('d-090', 'レンジ', '', 'renji', 'Microwave oven', 'Microwave', 'daily', 'katakana');
add('d-091', 'トースター', '', 'toosutaa', 'Toaster', 'Pemanggang roti', 'daily', 'katakana');
add('d-092', 'ポット', '', 'potto', 'Electric kettle / Pot', 'Teko listrik', 'daily', 'katakana');
add('d-093', 'アイロン', '', 'airon', 'Iron (Clothes)', 'Setrika baju', 'daily', 'katakana');
add('d-094', 'ドライヤー', '', 'doraiyaa', 'Hair dryer', 'Pengering rambut', 'daily', 'katakana');
add('d-095', 'バス', '', 'basu', 'Bus', 'Bus kota', 'daily', 'katakana');
add('d-096', 'タクシー', '', 'takushii', 'Taxi', 'Taksi', 'daily', 'katakana');
add('d-097', 'トラック', '', 'torakku', 'Truck', 'Truk', 'daily', 'katakana');
add('d-098', 'バイク', '', 'baiku', 'Motorcycle', 'Sepeda motor', 'daily', 'katakana');
add('d-099', 'スクーター', '', 'sukuutaa', 'Scooter', 'Skuter', 'daily', 'katakana');
add('d-100', 'ヘルメット', '', 'herumetto', 'Helmet', 'Helm', 'daily', 'katakana');
add('d-101', 'ガソリン', '', 'gasorin', 'Gasoline / Petrol', 'Bensin', 'daily', 'katakana');
add('d-102', 'コンビニ', '', 'konbini', 'Convenience store', 'Minimarket / Toserba', 'daily', 'katakana');
add('d-103', 'スーパー', '', 'suupaa', 'Supermarket', 'Supermarket', 'daily', 'katakana');
add('d-104', 'デパート', '', 'depaato', 'Department store', 'Toserba besar', 'daily', 'katakana');
add('d-105', 'レストラン', '', 'resutoran', 'Restaurant', 'Restoran / Rumah makan', 'daily', 'katakana');

// ==========================================
// 5. NATURE & SEASONS (105 words)
// ==========================================
// Hiragana Nature
add('n-001', 'さくら', '桜', 'sakura', 'Cherry blossom', 'Bunga Sakura', 'nature', 'hiragana');
add('n-002', 'はな', '花', 'hana', 'Flower', 'Bunga', 'nature', 'hiragana');
add('n-003', 'き', '木', 'ki', 'Tree / Wood', 'Pohon / Kayu', 'nature', 'hiragana');
add('n-004', 'くさ', '草', 'kusa', 'Grass / Weed', 'Rumput', 'nature', 'hiragana');
add('n-005', 'はっぱ', '葉っぱ', 'happa', 'Leaf', 'Daun', 'nature', 'hiragana');
add('n-006', 'もり', '森', 'mori', 'Forest', 'Hutan lebat', 'nature', 'hiragana');
add('n-007', 'はやし', '林', 'hayashi', 'Woods / Grove', 'Hutan kecil', 'nature', 'hiragana');
add('n-008', 'やま', '山', 'yama', 'Mountain', 'Gunung', 'nature', 'hiragana');
add('n-009', 'かわ', '川', 'kawa', 'River', 'Sungai', 'nature', 'hiragana');
add('n-010', 'うみ', '海', 'umi', 'Sea / Ocean', 'Laut / Samudra', 'nature', 'hiragana');
add('n-011', 'みずうみ', '湖', 'mizuumi', 'Lake', 'Danau', 'nature', 'hiragana');
add('n-012', 'いけ', '池', 'ike', 'Pond', 'Kolam air alami', 'nature', 'hiragana');
add('n-013', 'たき', '滝', 'taki', 'Waterfall', 'Air terjun', 'nature', 'hiragana');
add('n-014', 'しま', '島', 'shima', 'Island', 'Pulau', 'nature', 'hiragana');
add('n-015', 'かいがん', '海岸', 'kaigan', 'Seashore / Beach', 'Pesisir pantai', 'nature', 'hiragana');
add('n-016', 'すな', '砂', 'suna', 'Sand', 'Pasir', 'nature', 'hiragana');
add('n-017', 'いし', '石', 'ishi', 'Stone / Rock', 'Batu', 'nature', 'hiragana');
add('n-018', 'いわ', '岩', 'iwa', 'Boulder / Cliff', 'Batu karang / Cadas', 'nature', 'hiragana');
add('n-019', 'つち', '土', 'tsuchi', 'Earth / Soil', 'Tanah', 'nature', 'hiragana');
add('n-020', 'そら', '空', 'sora', 'Sky', 'Langit', 'nature', 'hiragana');
add('n-021', 'たいよう', '太陽', 'taiyou', 'Sun', 'Matahari', 'nature', 'hiragana');
add('n-022', 'つき', '月', 'tsuki', 'Moon', 'Bulan', 'nature', 'hiragana');
add('n-023', 'ほし', '星', 'hoshi', 'Star', 'Bintang', 'nature', 'hiragana');
add('n-024', 'くも', '雲', 'kumo', 'Cloud', 'Awan', 'nature', 'hiragana');
add('n-025', 'あめ', '雨', 'ame', 'Rain', 'Hujan', 'nature', 'hiragana');
add('n-026', 'ゆき', '雪', 'yuki', 'Snow', 'Salju', 'nature', 'hiragana');
add('n-027', 'かぜ', '風', 'kaze', 'Wind / Breeze', 'Angin', 'nature', 'hiragana');
add('n-028', 'あらし', '嵐', 'arashi', 'Storm / Tempest', 'Badai', 'nature', 'hiragana');
add('n-029', 'たいふう', '台風', 'taifuu', 'Typhoon', 'Topan badai', 'nature', 'hiragana');
add('n-030', 'かみなり', '雷', 'kaminari', 'Thunder / Lightning', 'Petir / Halilintar', 'nature', 'hiragana');
add('n-031', 'にじ', '虹', 'niji', 'Rainbow', 'Pelangi', 'nature', 'hiragana');
add('n-032', 'ひかり', '光', 'hikari', 'Light / Ray', 'Cahaya / Sinar', 'nature', 'hiragana');
add('n-033', 'かげ', '影', 'kage', 'Shadow', 'Bayangan', 'nature', 'hiragana');
add('n-034', 'きせつ', '季節', 'kisetsu', 'Season', 'Musim', 'nature', 'hiragana');
add('n-035', 'はる', '春', 'haru', 'Spring season', 'Musim semi', 'nature', 'hiragana');
add('n-036', 'なつ', '夏', 'natsu', 'Summer season', 'Musim panas', 'nature', 'hiragana');
add('n-037', 'あき', '秋', 'aki', 'Autumn / Fall', 'Musim gugur', 'nature', 'hiragana');
add('n-038', 'ふゆ', '冬', 'fuyu', 'Winter season', 'Musim dingin', 'nature', 'hiragana');
add('n-039', 'あさ', '朝', 'asa', 'Morning', 'Pagi hari', 'nature', 'hiragana');
add('n-040', 'ひる', '昼', 'hiru', 'Noon / Daytime', 'Siang hari', 'nature', 'hiragana');
add('n-041', 'ゆうがた', '夕方', 'yuugata', 'Evening / Dusk', 'Sore hari / Senja', 'nature', 'hiragana');
add('n-042', 'よる', '夜', 'yoru', 'Night', 'Malam hari', 'nature', 'hiragana');
add('n-043', 'よなか', '夜中', 'yonaka', 'Midnight', 'Tengah malam', 'nature', 'hiragana');
add('n-044', 'きょう', '今日', 'kyou', 'Today', 'Hari ini', 'nature', 'hiragana');
add('n-045', 'あした', '明日', 'ashita', 'Tomorrow', 'Besok', 'nature', 'hiragana');
add('n-046', 'きのう', '昨日', 'kinou', 'Yesterday', 'Kemarin', 'nature', 'hiragana');
add('n-047', 'てんき', '天気', 'tenki', 'Weather', 'Cuaca', 'nature', 'hiragana');
add('n-048', 'おんせん', '温泉', 'onsen', 'Hot spring', 'Pemandian air panas alami / Onsen', 'nature', 'hiragana');
add('n-049', 'たに', '谷', 'tani', 'Valley', 'Lembah', 'nature', 'hiragana');
add('n-050', 'さばく', '砂漠', 'sabaku', 'Desert', 'Gurun pasir', 'nature', 'hiragana');

// Katakana Nature & Earth
add('n-051', 'シーズン', '', 'shiizun', 'Season', 'Musim / Masa', 'nature', 'katakana');
add('n-052', 'キャンプ', '', 'kyanpu', 'Camping', 'Berkemah / Camping', 'nature', 'katakana');
add('n-053', 'ビーチ', '', 'biichi', 'Beach', 'Pantai berpasir', 'nature', 'katakana');
add('n-054', 'ジャングル', '', 'janguru', 'Jungle', 'Hutan rimba / Belantara', 'nature', 'katakana');
add('n-055', 'サバンナ', '', 'sabanna', 'Savanna', 'Padang rumput sabana', 'nature', 'katakana');
add('n-056', 'オーシャン', '', 'ooshan', 'Ocean', 'Samudra lautan', 'nature', 'katakana');
add('n-057', 'アイランド', '', 'airando', 'Island', 'Kepulauan / Pulau', 'nature', 'katakana');
add('n-058', 'ボルケーノ', '', 'borukeeno', 'Volcano', 'Gunung berapi', 'nature', 'katakana');
add('n-059', 'キャニオン', '', 'kyanion', 'Canyon', 'Ngarai cadas', 'nature', 'katakana');
add('n-060', 'リバー', '', 'ribaa', 'River', 'Aliran sungai', 'nature', 'katakana');
add('n-061', 'フォレスト', '', 'foresuto', 'Forest', 'Hutan lindung', 'nature', 'katakana');
add('n-062', 'ガーデン', '', 'gaaden', 'Garden', 'Kebun taman', 'nature', 'katakana');
add('n-063', 'プラント', '', 'puranto', 'Plant / Flora', 'Tumbuhan hijau', 'nature', 'katakana');
add('n-064', 'ローズ', '', 'roozu', 'Rose flower', 'Bunga mawar', 'nature', 'katakana');
add('n-065', 'チューリップ', '', 'chuurippu', 'Tulip', 'Bunga tulip', 'nature', 'katakana');
add('n-066', 'ヒマワリ', '向日葵', 'himawari', 'Sunflower', 'Bunga matahari', 'nature', 'katakana');
add('n-067', 'サボテン', '仙人掌', 'saboten', 'Cactus', 'Kaktus', 'nature', 'katakana');
add('n-068', 'パームツリー', '', 'paamutsurii', 'Palm tree', 'Pohon palem / kelapa', 'nature', 'katakana');
add('n-069', 'アース', '', 'aasu', 'Earth (Planet)', 'Bumi planet', 'nature', 'katakana');
add('n-070', 'プラネット', '', 'puranetto', 'Planet', 'Planet antariksa', 'nature', 'katakana');
add('n-071', 'ムーン', '', 'muun', 'Moon', 'Bulan angkasa', 'nature', 'katakana');
add('n-072', 'サン', '', 'san', 'Sun', 'Sang surya matahari', 'nature', 'katakana');
add('n-073', 'スター', '', 'sutaa', 'Star', 'Bintang langit', 'nature', 'katakana');
add('n-074', 'コメット', '', 'kometto', 'Comet', 'Komet / Bintang berekor', 'nature', 'katakana');
add('n-075', 'ギャラクシー', '', 'gyarakushii', 'Galaxy', 'Galaksi bimasakti', 'nature', 'katakana');
add('n-076', 'オーロラ', '', 'oorora', 'Aurora', 'Cahaya aurora kutub', 'nature', 'katakana');
add('n-077', 'レインボー', '', 'reinboo', 'Rainbow', 'Bianglala pelangi', 'nature', 'katakana');
add('n-078', 'サンライズ', '', 'sanraizu', 'Sunrise', 'Matahari terbit / Fajar', 'nature', 'katakana');
add('n-079', 'サンセット', '', 'sansetto', 'Sunset', 'Matahari terbenam / Senja', 'nature', 'katakana');
add('n-080', 'ストーム', '', 'sutoomu', 'Storm', 'Badai angin topan', 'nature', 'katakana');
add('n-081', 'トルネード', '', 'toruneedo', 'Tornado', 'Puting beliung / Tornado', 'nature', 'katakana');
add('n-082', 'ハリケーン', '', 'harikeen', 'Hurricane', 'Angin ribut topan', 'nature', 'katakana');
add('n-083', 'アイスバーグ', '', 'aisubaagu', 'Iceberg', 'Gunung es terapung', 'nature', 'katakana');
add('n-084', 'グレイシャー', '', 'gureishaa', 'Glacier', 'Gletser es abadi', 'nature', 'katakana');
add('n-085', 'オアシス', '', 'oashisu', 'Oasis', 'Mata air oase gurun', 'nature', 'katakana');
add('n-086', 'ネイチャー', '', 'neichaa', 'Nature', 'Alam semesta', 'nature', 'katakana');
add('n-087', 'エコロジー', '', 'ekorojii', 'Ecology', 'Ekologi lingkungan', 'nature', 'katakana');
add('n-088', 'ハイキング', '', 'haikingu', 'Hiking', 'Mendaki gunung / Hiking', 'nature', 'katakana');
add('n-089', 'トレッキング', '', 'torekkingu', 'Trekking', 'Penjelajahan alam', 'nature', 'katakana');
add('n-090', 'クライミング', '', 'kuraimingu', 'Climbing', 'Panjat tebing', 'nature', 'katakana');
add('n-091', 'ダイビング', '', 'daibingu', 'Scuba diving', 'Selam bawah laut', 'nature', 'katakana');
add('n-092', 'サーフィン', '', 'saafin', 'Surfing', 'Berselancar ombak', 'nature', 'katakana');
add('n-093', 'カヤック', '', 'kayakku', 'Kayak', 'Perahu kayak', 'nature', 'katakana');
add('n-094', 'ラフティング', '', 'rafutingu', 'Rafting', 'Arung jeram', 'nature', 'katakana');
add('n-095', 'スノーボード', '', 'sunooboodo', 'Snowboard', 'Papan seluncur salju', 'nature', 'katakana');
add('n-096', 'スキー', '', 'sukii', 'Skiing', 'Bermain ski salju', 'nature', 'katakana');
add('n-097', 'スケート', '', 'sukeeto', 'Skating', 'Seluncur es', 'nature', 'katakana');
add('n-098', 'サファリ', '', 'safari', 'Safari', 'Wisata safari alam', 'nature', 'katakana');
add('n-099', 'パーク', '', 'paaku', 'Park', 'Taman rekreasi', 'nature', 'katakana');
add('n-100', 'リゾート', '', 'rizooto', 'Resort', 'Resor wisata santai', 'nature', 'katakana');
add('n-101', 'コテージ', '', 'koteeji', 'Cottage', 'Pondok peristirahatan', 'nature', 'katakana');
add('n-102', 'バンガロー', '', 'bangaroo', 'Bungalow', 'Bungalo kayu', 'nature', 'katakana');
add('n-103', 'テント', '', 'tento', 'Tent', 'Tenda kemah', 'nature', 'katakana');
add('n-104', 'ランタン', '', 'rantan', 'Lantern', 'Lentera penerang', 'nature', 'katakana');
add('n-105', 'コンパス', '', 'konpasu', 'Compass', 'Kompas penunjuk arah', 'nature', 'katakana');

// ==========================================
// 6. ANIME, GAMING & POP CULTURE (105 words)
// ==========================================
// Hiragana Anime/Tradition
add('m-001', 'にんじゃ', '忍者', 'ninja', 'Ninja', 'Ninja', 'anime', 'hiragana');
add('m-002', 'さむらい', '侍', 'samurai', 'Samurai', 'Pendekar samurai', 'anime', 'hiragana');
add('m-003', 'かたな', '刀', 'katana', 'Katana sword', 'Pedang katana', 'anime', 'hiragana');
add('m-004', 'まほう', '魔法', 'mahou', 'Magic / Sorcery', 'Sihir / Keajaiban', 'anime', 'hiragana');
add('m-005', 'ゆうしゃ', '勇者', 'yuusha', 'Hero / Brave warrior', 'Pahlawan pemberani', 'anime', 'hiragana');
add('m-006', 'まおう', '魔王', 'maou', 'Demon King', 'Raja Iblis', 'anime', 'hiragana');
add('m-007', 'きし', '騎士', 'kishi', 'Knight', 'Ksatria berkuda', 'anime', 'hiragana');
add('m-008', 'ひめ', '姫', 'hime', 'Princess', 'Putri kerajaan', 'anime', 'hiragana');
add('m-009', 'おうじ', '王子', 'ouji', 'Prince', 'Pangeran kerajaan', 'anime', 'hiragana');
add('m-010', 'おうさま', '王様', 'ousama', 'King', 'Baginda Raja', 'anime', 'hiragana');
add('m-011', 'まじょ', '魔女', 'majo', 'Witch', 'Penyihir wanita', 'anime', 'hiragana');
add('m-012', 'ようかい', '妖怪', 'youkai', 'Yokai / Spirit monster', 'Siluman Yokai Jepang', 'anime', 'hiragana');
add('m-013', 'おに', '鬼', 'oni', 'Ogre / Demon', 'Raksasa iblis Oni', 'anime', 'hiragana');
add('m-014', 'りゅう', '竜', 'ryuu', 'Dragon', 'Naga mitologi', 'anime', 'hiragana');
add('m-015', 'かみさま', '神様', 'kamisama', 'God / Deity', 'Dewa penolong', 'anime', 'hiragana');
add('m-016', 'ちから', '力', 'chikara', 'Power / Strength', 'Kekuatan fisik/batin', 'anime', 'hiragana');
add('m-017', 'ひかり', '光', 'hikari', 'Light element', 'Elemen cahaya', 'anime', 'hiragana');
add('m-018', 'やみ', '闇', 'yami', 'Darkness element', 'Elemen kegelapan', 'anime', 'hiragana');
add('m-019', 'ほのお', '炎', 'honoo', 'Flame / Blaze', 'Kobaran api membara', 'anime', 'hiragana');
add('m-020', 'こおり', '氷', 'koori', 'Ice / Frost', 'Elemen es beku', 'anime', 'hiragana');
add('m-021', 'いかずち', '雷', 'ikazuchi', 'Thunderbolt', 'Sambaran halilintar', 'anime', 'hiragana');
add('m-022', 'しゅじんこう', '主人公', 'shujinkou', 'Protagonist / Main hero', 'Tokoh utama protagonis', 'anime', 'hiragana');
add('m-023', 'てき', '敵', 'teki', 'Enemy / Rival', 'Musuh / Lawan tanding', 'anime', 'hiragana');
add('m-024', 'なかま', '仲間', 'nakama', 'Comrades / Companions', 'Sahabat seperjuangan / Nakama', 'anime', 'hiragana');
add('m-025', 'しょうり', '勝利', 'shouri', 'Victory', 'Kemenangan jaya', 'anime', 'hiragana');
add('m-026', 'はいぼく', '敗北', 'haiboku', 'Defeat', 'Kekalahan pahit', 'anime', 'hiragana');
add('m-027', 'ぼうけん', '冒険', 'bouken', 'Adventure', 'Petualangan seru', 'anime', 'hiragana');
add('m-028', 'せかい', '世界', 'sekai', 'World / Universe', 'Dunia semesta', 'anime', 'hiragana');
add('m-029', 'みらい', '未来', 'mirai', 'Future', 'Masa depan cerah', 'anime', 'hiragana');
add('m-030', 'かこ', '過去', 'kako', 'Past', 'Masa lalu lampau', 'anime', 'hiragana');
add('m-031', 'いのち', '命', 'inochi', 'Life / Soul', 'Nyawa kehidupan', 'anime', 'hiragana');
add('m-032', 'こころ', '心', 'kokoro', 'Heart / Spirit', 'Hati nurani batin', 'anime', 'hiragana');
add('m-033', 'きずな', '絆', 'kizuna', 'Bonds / Connection', 'Ikatan persaudaraan batin', 'anime', 'hiragana');
add('m-034', 'ゆめ', '夢', 'yume', 'Dream / Ambition', 'Cita-cita / Impian', 'anime', 'hiragana');
add('m-035', 'きぼう', '希望', 'kibou', 'Hope', 'Harapan asa', 'anime', 'hiragana');
add('m-036', 'ぜつぼう', '絶望', 'zetsubou', 'Despair', 'Keputusasaan mendalam', 'anime', 'hiragana');
add('m-037', 'せんそう', '戦争', 'sensou', 'War / Battle', 'Perang dahsyat', 'anime', 'hiragana');
add('m-038', 'へいわ', '平和', 'heiwa', 'Peace', 'Perdamaian abadi', 'anime', 'hiragana');
add('m-039', 'しんじつ', '真実', 'shinjitsu', 'Truth', 'Kebenaran sejati', 'anime', 'hiragana');
add('m-040', 'うそ', '嘘', 'uso', 'Lie / Falsehood', 'Kebohongan dusta', 'anime', 'hiragana');
add('m-041', 'ひみつ', '秘密', 'himitsu', 'Secret', 'Rahasia rahasia', 'anime', 'hiragana');
add('m-042', 'やくそく', '約束', 'yakusoku', 'Promise / Vow', 'Janji setia', 'anime', 'hiragana');
add('m-043', 'うんめい', '運命', 'unmei', 'Destiny / Fate', 'Takdir nasib', 'anime', 'hiragana');
add('m-044', 'きせき', '奇跡', 'kiseki', 'Miracle', 'Mukjizat keajaiban', 'anime', 'hiragana');
add('m-045', 'でんせつ', '伝説', 'densetsu', 'Legend', 'Legenda kisah', 'anime', 'hiragana');
add('m-046', 'しんわ', '神話', 'shinwa', 'Mythology', 'Mitos dongeng kuno', 'anime', 'hiragana');
add('m-047', 'ぶき', '武器', 'buki', 'Weapon', 'Senjata perang', 'anime', 'hiragana');
add('m-048', 'たて', '盾', 'tate', 'Shield', 'Perisai pelindung', 'anime', 'hiragana');
add('m-049', 'よろい', '鎧', 'yoroi', 'Armor', 'Baju zirah pelindung', 'anime', 'hiragana');
add('m-050', 'ゆみ', '弓', 'yumi', 'Bow & Arrow', 'Busur panah', 'anime', 'hiragana');

// Katakana Anime, Gaming & Pop Culture
add('m-051', 'アニメ', '', 'anime', 'Anime / Animation', 'Animasi Jepang / Anime', 'anime', 'katakana');
add('m-052', 'マンガ', '', 'manga', 'Manga / Comic', 'Komik Jepang / Manga', 'anime', 'katakana');
add('m-053', 'ゲーム', '', 'geemu', 'Video Game', 'Permainan video game', 'anime', 'katakana');
add('m-054', 'ロボット', '', 'robotto', 'Robot / Mecha', 'Robot mesin canggih', 'anime', 'katakana');
add('m-055', 'ヒーロー', '', 'hiiroo', 'Hero', 'Pahlawan super', 'anime', 'katakana');
add('m-056', 'モンスター', '', 'monsutaa', 'Monster / Beast', 'Monster buas', 'anime', 'katakana');
add('m-057', 'ドラゴン', '', 'doragon', 'Dragon', 'Naga naga', 'anime', 'katakana');
add('m-058', 'オタク', '', 'otaku', 'Otaku / Geek', 'Penggemar fanatik / Otaku', 'anime', 'katakana');
add('m-059', 'コスプレ', '', 'kosupure', 'Cosplay', 'Bermain kostum anime / Cosplay', 'anime', 'katakana');
add('m-060', 'フィギュア', '', 'figyua', 'Figure / Collectible', 'Action figure pajangan', 'anime', 'katakana');
add('m-061', 'ポスター', '', 'posutaa', 'Poster', 'Poster gambar dinding', 'anime', 'katakana');
add('m-062', 'イベント', '', 'ibento', 'Event / Convention', 'Acara pameran / Event', 'anime', 'katakana');
add('m-063', 'コミック', '', 'komikku', 'Comic book', 'Buku komik cetak', 'anime', 'katakana');
add('m-064', 'キャラクター', '', 'kyarakutaa', 'Character', 'Karakter tokoh cerita', 'anime', 'katakana');
add('m-065', 'ストーリー', '', 'sutoorii', 'Story / Plot', 'Alur cerita / Kisah', 'anime', 'katakana');
add('m-066', 'エピソード', '', 'episoodo', 'Episode', 'Episode tayangan', 'anime', 'katakana');
add('m-067', 'シーズン', '', 'shiizun', 'Season (Anime)', 'Musim penayangan', 'anime', 'katakana');
add('m-068', 'オープニング', '', 'oopuningu', 'Opening song (OP)', 'Lagu pembuka anime', 'anime', 'katakana');
add('m-069', 'エンディング', '', 'endingu', 'Ending song (ED)', 'Lagu penutup anime', 'anime', 'katakana');
add('m-070', 'サウンド', '', 'saundo', 'Soundtrack / Audio', 'Musik pengiring suara', 'anime', 'katakana');
add('m-071', 'レベル', '', 'reberu', 'Level (Gaming)', 'Tingkatan level game', 'anime', 'katakana');
add('m-072', 'スキル', '', 'sukiru', 'Skill / Ability', 'Keahlian jurus khusus', 'anime', 'katakana');
add('m-073', 'ステータス', '', 'suteetasu', 'Status / Stats', 'Status kemampuan bertarung', 'anime', 'katakana');
add('m-074', 'アイテム', '', 'aitemu', 'Item / Inventory', 'Barang perlengkapan game', 'anime', 'katakana');
add('m-075', 'ポーション', '', 'pooshon', 'Potion / Elixir', 'Ramuan obat penyembuh', 'anime', 'katakana');
add('m-076', 'クエスト', '', 'kuesto', 'Quest / Mission', 'Misi petualangan quest', 'anime', 'katakana');
add('m-077', 'ダンジョン', '', 'danjon', 'Dungeon / Labyrinth', 'Ruang bawah tanah misterius', 'anime', 'katakana');
add('m-078', 'ボス', '', 'bosu', 'Boss enemy', 'Musuh bos besar', 'anime', 'katakana');
add('m-079', 'クリア', '', 'kuria', 'Game clear / Beaten', 'Menamatkan permainan', 'anime', 'katakana');
add('m-080', 'セーブ', '', 'seebu', 'Save game data', 'Menyimpan data permainan', 'anime', 'katakana');
add('m-081', 'ロード', '', 'roodo', 'Load game data', 'Memuat data permainan', 'anime', 'katakana');
add('m-082', 'コマンド', '', 'komando', 'Command', 'Perintah tombol aksi', 'anime', 'katakana');
add('m-083', 'コンボ', '', 'konbo', 'Combo attack', 'Serangan bertubi combo', 'anime', 'katakana');
add('m-084', 'クリティカル', '', 'kuritikaru', 'Critical hit', 'Serangan telak kritikal', 'anime', 'katakana');
add('m-085', 'ダメージ', '', 'dameeji', 'Damage dealt', 'Daya rusak kerusakan', 'anime', 'katakana');
add('m-086', 'シールド', '', 'shiirudo', 'Energy shield', 'Perisai pelindung energi', 'anime', 'katakana');
add('m-087', 'ソード', '', 'soodo', 'Sword', 'Pedang kesatria', 'anime', 'katakana');
add('m-088', 'ブレード', '', 'bureedo', 'Blade', 'Bilah pedang tajam', 'anime', 'katakana');
add('m-089', 'ガン', '', 'gan', 'Gun / Firearm', 'Pistol penembak', 'anime', 'katakana');
add('m-090', 'レーザー', '', 'reezaa', 'Laser beam', 'Sinar laser tembak', 'anime', 'katakana');
add('m-091', 'ビーム', '', 'biimu', 'Energy beam', 'Pancaran sinar energi', 'anime', 'katakana');
add('m-092', 'サイボーグ', '', 'saiboogu', 'Cyborg', 'Manusia robot cyborg', 'anime', 'katakana');
add('m-093', 'アンドロイド', '', 'andoroido', 'Android', 'Robot berwujud manusia', 'anime', 'katakana');
add('m-094', 'エイリアン', '', 'eirian', 'Alien / Extraterrestrial', 'Makhluk luar angkasa alien', 'anime', 'katakana');
add('m-095', 'ゾンビ', '', 'zonbi', 'Zombie / Undead', 'Mayat hidup zombi', 'anime', 'katakana');
add('m-096', 'ヴァンパイア', '', 'vanpaia', 'Vampire', 'Drakula penghisap darah', 'anime', 'katakana');
add('m-097', 'ゴースト', '', 'goosuto', 'Ghost / Phantom', 'Hantu gentayangan', 'anime', 'katakana');
add('m-098', 'ギルド', '', 'girudo', 'Guild / Alliance', 'Serikat petualang guild', 'anime', 'katakana');
add('m-099', 'パーティー', '', 'paatii', 'Adventuring party', 'Kelompok regu bertarung', 'anime', 'katakana');
add('m-100', 'アリーナ', '', 'ariina', 'Arena / Battleground', 'Gelanggang tarung arena', 'anime', 'katakana');
add('m-101', 'トーナメント', '', 'toonamento', 'Tournament', 'Turnamen kejuaraan', 'anime', 'katakana');
add('m-102', 'チャンピオン', '', 'chanpion', 'Champion / Winner', 'Juara bertahan kampiun', 'anime', 'katakana');
add('m-103', 'トロフィー', '', 'torofii', 'Trophy / Cup', 'Piala penghargaan kemenangan', 'anime', 'katakana');
add('m-104', 'バッジ', '', 'bajji', 'Badge / Emblem', 'Lencana prestasi badge', 'anime', 'katakana');
add('m-105', 'オンライン', '', 'onrain', 'Online gaming', 'Jaringan daring online', 'anime', 'katakana');

// ==========================================
// 7. JLPT N5 CORE VOCABULARY (105 words)
// ==========================================
// Essential N5 Verbs & Adjectives (Hiragana)
add('j-001', 'たべる', '食べる', 'taberu', 'To eat', 'Makan', 'jlpt5', 'hiragana');
add('j-002', 'のむ', '飲む', 'nomu', 'To drink', 'Minum', 'jlpt5', 'hiragana');
add('j-003', 'みる', '見る', 'miru', 'To see / To look', 'Melihat / Menonton', 'jlpt5', 'hiragana');
add('j-004', 'きく', '聞く', 'kiku', 'To hear / To listen', 'Mendengar / Bertanya', 'jlpt5', 'hiragana');
add('j-005', 'よむ', '読む', 'yomu', 'To read', 'Membaca', 'jlpt5', 'hiragana');
add('j-006', 'かく', '書く', 'kaku', 'To write / To draw', 'Menulis / Menggambar', 'jlpt5', 'hiragana');
add('j-007', 'はなす', '話す', 'hanasu', 'To speak / To talk', 'Berbicara / Mengobrol', 'jlpt5', 'hiragana');
add('j-008', 'いく', '行く', 'iku', 'To go', 'Pergi', 'jlpt5', 'hiragana');
add('j-009', 'くる', '来る', 'kuru', 'To come', 'Datang', 'jlpt5', 'hiragana');
add('j-010', 'かえる', '帰る', 'kaeru', 'To return / To go home', 'Pulang ke rumah', 'jlpt5', 'hiragana');
add('j-011', 'かう', '買う', 'kau', 'To buy', 'Membeli', 'jlpt5', 'hiragana');
add('j-012', 'うる', '売る', 'uru', 'To sell', 'Menjual', 'jlpt5', 'hiragana');
add('j-013', 'あう', '会う', 'au', 'To meet', 'Bertemu dengan', 'jlpt5', 'hiragana');
add('j-014', 'あそぶ', '遊ぶ', 'asobu', 'To play', 'Bermain / Bersenang-senang', 'jlpt5', 'hiragana');
add('j-015', 'あるく', '歩く', 'aruku', 'To walk', 'Berjalan kaki', 'jlpt5', 'hiragana');
add('j-016', 'はしる', '走る', 'hashiru', 'To run', 'Berlari cepat', 'jlpt5', 'hiragana');
add('j-017', 'およぐ', '泳ぐ', 'oyogu', 'To swim', 'Berenang', 'jlpt5', 'hiragana');
add('j-018', 'ねる', '寝る', 'neru', 'To sleep / To lie down', 'Tidur terlelap', 'jlpt5', 'hiragana');
add('j-019', 'おきる', '起きる', 'okiru', 'To wake up / To get up', 'Bangun tidur', 'jlpt5', 'hiragana');
add('j-020', 'まつ', '待つ', 'matsu', 'To wait', 'Menunggu', 'jlpt5', 'hiragana');
add('j-021', 'もつ', '持つ', 'motsu', 'To hold / To carry', 'Memegang / Membawa', 'jlpt5', 'hiragana');
add('j-022', 'たつ', '立つ', 'tatsu', 'To stand', 'Berdiri tegak', 'jlpt5', 'hiragana');
add('j-023', 'すわる', '座る', 'suwaru', 'To sit', 'Duduk manis', 'jlpt5', 'hiragana');
add('j-024', 'あける', '開ける', 'akeru', 'To open', 'Membuka', 'jlpt5', 'hiragana');
add('j-025', 'しめる', '閉める', 'shimeru', 'To close', 'Menutup rapat', 'jlpt5', 'hiragana');
add('j-026', 'つける', '点ける', 'tsukeru', 'To turn on (light/switch)', 'Menyalakan (lampu)', 'jlpt5', 'hiragana');
add('j-027', 'けす', '消す', 'kesu', 'To turn off / To erase', 'Mematikan / Menghapus', 'jlpt5', 'hiragana');
add('j-028', 'おしえる', '教える', 'oshieru', 'To teach / To tell', 'Mengajar / Memberi tahu', 'jlpt5', 'hiragana');
add('j-029', 'ならう', '習う', 'narau', 'To learn', 'Belajar dari guru', 'jlpt5', 'hiragana');
add('j-030', 'おぼえる', '覚える', 'oboeru', 'To remember / To memorize', 'Mengingat / Menghafal', 'jlpt5', 'hiragana');
add('j-031', 'わすれる', '忘れる', 'wasureru', 'To forget', 'Lupa / Melupakan', 'jlpt5', 'hiragana');
add('j-032', 'つくる', '作る', 'tsukuru', 'To make / To create', 'Membuat / Menciptakan', 'jlpt5', 'hiragana');
add('j-033', 'つかう', '使う', 'tsukau', 'To use', 'Menggunakan / Memakai', 'jlpt5', 'hiragana');
add('j-034', 'あげる', '上げる', 'ageru', 'To give', 'Memberikan kepada', 'jlpt5', 'hiragana');
add('j-035', 'もらう', '', 'morau', 'To receive / To get', 'Menerima hadiah', 'jlpt5', 'hiragana');
add('j-036', 'うたう', '歌う', 'utau', 'To sing', 'Menyanyi merdu', 'jlpt5', 'hiragana');
add('j-037', 'おどる', '踊る', 'odoru', 'To dance', 'Menari lincah', 'jlpt5', 'hiragana');
add('j-038', 'おもう', '思う', 'omou', 'To think / To feel', 'Berpikir / Mengira', 'jlpt5', 'hiragana');
add('j-039', 'いう', '言う', 'iu', 'To say / To utter', 'Mengatakan', 'jlpt5', 'hiragana');
add('j-040', 'とる', '取る', 'toru', 'To take / To capture', 'Mengambil / Memotret', 'jlpt5', 'hiragana');

// Essential N5 Adjectives (Hiragana)
add('j-041', 'おおきい', '大きい', 'ookii', 'Big / Large', 'Besar', 'jlpt5', 'hiragana');
add('j-042', 'ちいさい', '小さい', 'chiisai', 'Small / Little', 'Kecil', 'jlpt5', 'hiragana');
add('j-043', 'たかい', '高い', 'takai', 'High / Tall / Expensive', 'Tinggi / Mahal', 'jlpt5', 'hiragana');
add('j-044', 'やすい', '安い', 'yasui', 'Cheap / Inexpensive', 'Murah meriah', 'jlpt5', 'hiragana');
add('j-045', 'ひくい', '低い', 'hikui', 'Low / Short (Height)', 'Rendah / Pendek', 'jlpt5', 'hiragana');
add('j-046', 'あたらし', '新しい', 'atarashii', 'New / Fresh', 'Baru gres', 'jlpt5', 'hiragana');
add('j-047', 'ふるい', '古い', 'furui', 'Old (Thing)', 'Tua / Kuno', 'jlpt5', 'hiragana');
add('j-048', 'いい', '良い', 'ii', 'Good / Fine', 'Bagus / Baik', 'jlpt5', 'hiragana');
add('j-049', 'わるい', '悪い', 'warui', 'Bad / Evil', 'Buruk / Jelek', 'jlpt5', 'hiragana');
add('j-050', 'あつい', '暑い', 'atsui', 'Hot (Weather/Thing)', 'Panas (cuaca/benda)', 'jlpt5', 'hiragana');
add('j-051', 'さむい', '寒い', 'samui', 'Cold (Weather)', 'Dingin (hawa cuaca)', 'jlpt5', 'hiragana');
add('j-052', 'つめたい', '冷たい', 'tsumetai', 'Cold (To touch)', 'Dingin (disentuh)', 'jlpt5', 'hiragana');
add('j-053', 'あたたかい', '温かい', 'atatakai', 'Warm / Mild', 'Hangat nyaman', 'jlpt5', 'hiragana');
add('j-054', 'すずしい', '涼しい', 'suzushii', 'Cool / Refreshing', 'Sejuk segar', 'jlpt5', 'hiragana');
add('j-055', 'むずかしい', '難しい', 'muzukashii', 'Difficult / Hard', 'Sulit / Sukar', 'jlpt5', 'hiragana');
add('j-056', 'やさしい', '優しい', 'yasashii', 'Easy / Kind', 'Mudah / Ramah baik hati', 'jlpt5', 'hiragana');
add('j-057', 'おもしろい', '面白い', 'omoshiroi', 'Interesting / Funny', 'Menarik / Lucu', 'jlpt5', 'hiragana');
add('j-058', 'つまらない', '', 'tsumaranai', 'Boring / Dull', 'Membosankan garing', 'jlpt5', 'hiragana');
add('j-059', 'おいしい', '美味しい', 'oishii', 'Delicious / Tasty', 'Enak lezat', 'jlpt5', 'hiragana');
add('j-060', 'まずい', '', 'mazui', 'Bad tasting / Unappetizing', 'Hambar / Tidak enak', 'jlpt5', 'hiragana');
add('j-061', 'いそがしい', '忙しい', 'isogashii', 'Busy / Occupied', 'Sibuk padat', 'jlpt5', 'hiragana');
add('j-062', 'ひま', '暇', 'hima', 'Free time / Idle', 'Senggang luang', 'jlpt5', 'hiragana');
add('j-063', 'げんき', '元気', 'genki', 'Healthy / Energetic', 'Sehat bugar bersemangat', 'jlpt5', 'hiragana');
add('j-064', 'びょうき', '病気', 'byouki', 'Illness / Sick', 'Sakit penyakit', 'jlpt5', 'hiragana');
add('j-065', 'すき', '好き', 'suki', 'Liked / Favorite', 'Suka / Gemar', 'jlpt5', 'hiragana');
add('j-066', 'きらい', '嫌い', 'kirai', 'Disliked / Hated', 'Benci / Tidak suka', 'jlpt5', 'hiragana');
add('j-067', 'じょうず', '上手', 'jouzu', 'Skillful / Good at', 'Pintar mahir', 'jlpt5', 'hiragana');
add('j-068', 'へた', '下手', 'heta', 'Unskillful / Poor at', 'Kurang mahir / Payah', 'jlpt5', 'hiragana');
add('j-069', 'しずか', '静か', 'shizuka', 'Quiet / Peaceful', 'Tenang hening sunyi', 'jlpt5', 'hiragana');
add('j-070', 'にぎやか', '賑やか', 'nigiyaka', 'Lively / Bustling', 'Ramai meriah padat', 'jlpt5', 'hiragana');
add('j-071', 'べんり', '便利', 'benri', 'Convenient / Handy', 'Praktis nyaman mudah', 'jlpt5', 'hiragana');
add('j-072', 'ふべん', '不便', 'fuben', 'Inconvenient', 'Tidak praktis / Merepotkan', 'jlpt5', 'hiragana');
add('j-073', 'ゆうめい', '有名', 'yuumei', 'Famous / Well-known', 'Terkenal mashyur', 'jlpt5', 'hiragana');
add('j-074', 'きれい', '綺麗', 'kirei', 'Beautiful / Clean', 'Cantik indah / Bersih', 'jlpt5', 'hiragana');
add('j-075', 'たいせつ', '大切', 'taisetsu', 'Important / Precious', 'Penting berharga', 'jlpt5', 'hiragana');

// Essential N5 Loanwords & Place terms (Katakana)
add('j-076', 'アパート', '', 'apaato', 'Apartment', 'Apartemen / Flat', 'jlpt5', 'katakana');
add('j-077', 'マンション', '', 'manshon', 'Condominium / Apartment', 'Kondominium mewah', 'jlpt5', 'katakana');
add('j-078', 'ビル', '', 'biru', 'Building', 'Gedung bertingkat', 'jlpt5', 'katakana');
add('j-079', 'ポスト', '', 'posuto', 'Mailbox / Postbox', 'Kotak surat pos', 'jlpt5', 'katakana');
add('j-080', 'キロ', '', 'kiro', 'Kilogram / Kilometer', 'Kilo / Kilometer', 'jlpt5', 'katakana');
add('j-081', 'メートル', '', 'meetoru', 'Meter', 'Meter satuan panjang', 'jlpt5', 'katakana');
add('j-082', 'グラム', '', 'guramu', 'Gram', 'Gram satuan berat', 'jlpt5', 'katakana');
add('j-083', 'スポーツ', '', 'supootsu', 'Sports', 'Olahraga', 'jlpt5', 'katakana');
add('j-084', 'サッカー', '', 'sakkaa', 'Soccer / Football', 'Sepak bola', 'jlpt5', 'katakana');
add('j-085', 'テニス', '', 'tenisu', 'Tennis', 'Tenis lapangan', 'jlpt5', 'katakana');
add('j-086', 'ゴルフ', '', 'gorufu', 'Golf', 'Olahraga golf', 'jlpt5', 'katakana');
add('j-087', 'ピアノ', '', 'piano', 'Piano', 'Alat musik piano', 'jlpt5', 'katakana');
add('j-088', 'ギター', '', 'gitaa', 'Guitar', 'Gitar petik', 'jlpt5', 'katakana');
add('j-089', 'バイオリン', '', 'baiorin', 'Violin', 'Biola gesek', 'jlpt5', 'katakana');
add('j-090', 'ダンス', '', 'dansu', 'Dance', 'Tarian dansa', 'jlpt5', 'katakana');
add('j-091', 'フィルム', '', 'firumu', 'Film (Camera)', 'Rol film kamera', 'jlpt5', 'katakana');
add('j-092', 'マッチ', '', 'macchi', 'Match / Matchstick', 'Korek api batang', 'jlpt5', 'katakana');
add('j-093', 'ナイフ', '', 'naifu', 'Knife', 'Pisau makan', 'jlpt5', 'katakana');
add('j-094', 'フォーク', '', 'fooku', 'Fork', 'Garpu makan', 'jlpt5', 'katakana');
add('j-095', 'スプーン', '', 'supuun', 'Spoon', 'Sendok makan', 'jlpt5', 'katakana');
add('j-096', 'コップ', '', 'koppu', 'Cup / Glass', 'Gelas minum', 'jlpt5', 'katakana');
add('j-097', 'グラス', '', 'gurasu', 'Glass (Wine/Cocktail)', 'Gelas kaca bening', 'jlpt5', 'katakana');
add('j-098', 'ボタン', '', 'botan', 'Button (Clothing/Key)', 'Kancing baju / Tombol', 'jlpt5', 'katakana');
add('j-099', 'ポケット', '', 'poketto', 'Pocket', 'Saku kantong baju/celana', 'jlpt5', 'katakana');
add('j-100', 'レシート', '', 'reshiito', 'Receipt', 'Struk belanja / Kuitansi', 'jlpt5', 'katakana');
add('j-101', 'キャッシュ', '', 'kyasshyu', 'Cash money', 'Uang tunai kas', 'jlpt5', 'katakana');
add('j-102', 'カード', '', 'kaado', 'Card / Credit card', 'Kartu debit/kredit', 'jlpt5', 'katakana');
add('j-103', 'パスポート', '', 'pasupooto', 'Passport', 'Paspor perjalanan luar negeri', 'jlpt5', 'katakana');
add('j-104', 'ビザ', '', 'biza', 'Visa (Travel)', 'Visa izin tinggal', 'jlpt5', 'katakana');
add('j-105', 'チケット', '', 'chiketto', 'Ticket', 'Tiket karcis masuk', 'jlpt5', 'katakana');

console.log('Total words generated:', words.length);

const catCounts = {};
words.forEach(w => {
  catCounts[w.category] = (catCounts[w.category] || 0) + 1;
});
console.log('Category Counts:', catCounts);

const hCount = words.filter(w => w.script === 'hiragana').length;
const kCount = words.filter(w => w.script === 'katakana').length;
console.log(`Hiragana words: ${hCount}, Katakana words: ${kCount}`);

const fileOutput = `import type { WordItem } from '../types';

export const JAPANESE_WORDS: WordItem[] = ${JSON.stringify(words, null, 2)};

// Helper to sanitize word comparison
export function cleanWordString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\\s\\-_ー]/g, '')
    .replace(/ō|ou|oo/g, 'o')
    .replace(/ū|uu/g, 'u')
    .replace(/ā|aa/g, 'a')
    .replace(/ē|ee/g, 'e')
    .replace(/ī|ii/g, 'i');
}

export function checkWordRomajiMatch(userInput: string, targetRomaji: string): boolean {
  const u = userInput.trim().toLowerCase();
  const t = targetRomaji.trim().toLowerCase();
  if (u === t) return true;
  if (cleanWordString(u) === cleanWordString(t)) return true;
  return false;
}
`;

fs.writeFileSync(path.resolve('./src/data/wordsData.ts'), fileOutput);
console.log('Successfully wrote to src/data/wordsData.ts');
