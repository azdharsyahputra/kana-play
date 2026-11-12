import type { WordItem } from '../types';

// [kana, kanji, romaji, altRomaji, english, indonesian, difficulty, notes?]
type NumRow = [string, string, string, string[], string, string, 1 | 2 | 3, string?];

const NUMBER_ROWS: NumRow[] = [
  ['ゼロ', '零', 'zero', ['rei'], 'Zero (0)', 'Nol (0)', 1, 'Bisa juga dibaca れい (rei).'],
  ['いち', '一', 'ichi', ['iti'], 'One (1)', 'Satu (1)', 1],
  ['に', '二', 'ni', [], 'Two (2)', 'Dua (2)', 1],
  ['さん', '三', 'san', [], 'Three (3)', 'Tiga (3)', 1],
  ['よん', '四', 'yon', ['shi', 'si'], 'Four (4)', 'Empat (4)', 1, 'Bisa juga し (shi), tapi よん lebih umum (し mirip "mati").'],
  ['ご', '五', 'go', [], 'Five (5)', 'Lima (5)', 1],
  ['ろく', '六', 'roku', [], 'Six (6)', 'Enam (6)', 1],
  ['なな', '七', 'nana', ['shichi', 'sichi'], 'Seven (7)', 'Tujuh (7)', 1, 'Bisa juga しち (shichi).'],
  ['はち', '八', 'hachi', ['hati'], 'Eight (8)', 'Delapan (8)', 1],
  ['きゅう', '九', 'kyuu', ['kyu', 'ku'], 'Nine (9)', 'Sembilan (9)', 1, 'Bisa juga く (ku).'],
  ['じゅう', '十', 'juu', ['ju', 'zyuu'], 'Ten (10)', 'Sepuluh (10)', 1],
  ['じゅういち', '十一', 'juuichi', ['juichi'], 'Eleven (11)', 'Sebelas (11)', 1, 'Pola: 10 (juu) + 1 (ichi).'],
  ['じゅうに', '十二', 'juuni', ['juni'], 'Twelve (12)', 'Dua belas (12)', 1],
  ['じゅうさん', '十三', 'juusan', ['jusan'], 'Thirteen (13)', 'Tiga belas (13)', 1],
  ['じゅうよん', '十四', 'juuyon', ['juyon', 'juushi'], 'Fourteen (14)', 'Empat belas (14)', 2],
  ['じゅうご', '十五', 'juugo', ['jugo'], 'Fifteen (15)', 'Lima belas (15)', 1],
  ['じゅうろく', '十六', 'juuroku', ['juroku'], 'Sixteen (16)', 'Enam belas (16)', 1],
  ['じゅうなな', '十七', 'juunana', ['junana', 'juushichi'], 'Seventeen (17)', 'Tujuh belas (17)', 2],
  ['じゅうはち', '十八', 'juuhachi', ['juhachi'], 'Eighteen (18)', 'Delapan belas (18)', 1],
  ['じゅうきゅう', '十九', 'juukyuu', ['jukyu', 'juuku'], 'Nineteen (19)', 'Sembilan belas (19)', 2],
  ['にじゅう', '二十', 'nijuu', ['niju'], 'Twenty (20)', 'Dua puluh (20)', 1, 'Pola: 2 (ni) × 10 (juu).'],
  ['さんじゅう', '三十', 'sanjuu', ['sanju'], 'Thirty (30)', 'Tiga puluh (30)', 1],
  ['よんじゅう', '四十', 'yonjuu', ['yonju'], 'Forty (40)', 'Empat puluh (40)', 1],
  ['ごじゅう', '五十', 'gojuu', ['goju'], 'Fifty (50)', 'Lima puluh (50)', 1],
  ['ろくじゅう', '六十', 'rokujuu', ['rokuju'], 'Sixty (60)', 'Enam puluh (60)', 1],
  ['ななじゅう', '七十', 'nanajuu', ['nanaju'], 'Seventy (70)', 'Tujuh puluh (70)', 1],
  ['はちじゅう', '八十', 'hachijuu', ['hachiju'], 'Eighty (80)', 'Delapan puluh (80)', 1],
  ['きゅうじゅう', '九十', 'kyuujuu', ['kyuju'], 'Ninety (90)', 'Sembilan puluh (90)', 1],
  ['ひゃく', '百', 'hyaku', [], 'One hundred (100)', 'Seratus (100)', 1],
  ['にひゃく', '二百', 'nihyaku', [], 'Two hundred (200)', 'Dua ratus (200)', 2],
  ['さんびゃく', '三百', 'sanbyaku', ['sambyaku'], 'Three hundred (300)', 'Tiga ratus (300)', 2, '⚠️ Khusus: hyaku → byaku.'],
  ['よんひゃく', '四百', 'yonhyaku', [], 'Four hundred (400)', 'Empat ratus (400)', 2],
  ['ごひゃく', '五百', 'gohyaku', [], 'Five hundred (500)', 'Lima ratus (500)', 2],
  ['ろっぴゃく', '六百', 'roppyaku', [], 'Six hundred (600)', 'Enam ratus (600)', 3, '⚠️ Khusus: roku + hyaku → roppyaku.'],
  ['ななひゃく', '七百', 'nanahyaku', [], 'Seven hundred (700)', 'Tujuh ratus (700)', 2],
  ['はっぴゃく', '八百', 'happyaku', [], 'Eight hundred (800)', 'Delapan ratus (800)', 3, '⚠️ Khusus: hachi + hyaku → happyaku.'],
  ['きゅうひゃく', '九百', 'kyuuhyaku', ['kyuhyaku'], 'Nine hundred (900)', 'Sembilan ratus (900)', 2],
  ['せん', '千', 'sen', [], 'One thousand (1000)', 'Seribu (1000)', 1],
  ['にせん', '二千', 'nisen', [], 'Two thousand (2000)', 'Dua ribu (2000)', 2],
  ['さんぜん', '三千', 'sanzen', [], 'Three thousand (3000)', 'Tiga ribu (3000)', 3, '⚠️ Khusus: sen → zen.'],
  ['はっせん', '八千', 'hassen', [], 'Eight thousand (8000)', 'Delapan ribu (8000)', 3, '⚠️ Khusus: hachi + sen → hassen.'],
  ['いちまん', '一万', 'ichiman', ['itiman'], 'Ten thousand (10.000)', 'Sepuluh ribu (10.000)', 2, 'Jepang menghitung per 10.000 (man), bukan per 1.000.'],
  ['ひゃくまん', '百万', 'hyakuman', [], 'One million (1.000.000)', 'Satu juta (1.000.000)', 3, '100 × 10.000 = 1 juta.'],
];

// [kana, kanji?, romaji, altRomaji, english, indonesian, script, difficulty]
type CountryRow = [string, string | undefined, string, string[], string, string, 'hiragana' | 'katakana', 1 | 2 | 3];

const COUNTRY_ROWS: CountryRow[] = [
  ['インドネシア', undefined, 'indoneshia', ['indonesia'], 'Indonesia', 'Indonesia', 'katakana', 1],
  ['ちゅうごく', '中国', 'chuugoku', ['chugoku', 'tyuugoku'], 'China', 'Tiongkok / China', 'hiragana', 1],
  ['かんこく', '韓国', 'kankoku', [], 'South Korea', 'Korea Selatan', 'hiragana', 1],
  ['アメリカ', undefined, 'amerika', [], 'America (USA)', 'Amerika Serikat', 'katakana', 1],
  ['イギリス', undefined, 'igirisu', [], 'United Kingdom', 'Inggris', 'katakana', 1],
  ['フランス', undefined, 'furansu', [], 'France', 'Prancis', 'katakana', 1],
  ['ドイツ', undefined, 'doitsu', ['doitu'], 'Germany', 'Jerman', 'katakana', 1],
  ['イタリア', undefined, 'itaria', [], 'Italy', 'Italia', 'katakana', 1],
  ['スペイン', undefined, 'supein', [], 'Spain', 'Spanyol', 'katakana', 1],
  ['オランダ', undefined, 'oranda', [], 'Netherlands', 'Belanda', 'katakana', 1],
  ['ロシア', undefined, 'roshia', ['rosia'], 'Russia', 'Rusia', 'katakana', 1],
  ['インド', undefined, 'indo', [], 'India', 'India', 'katakana', 1],
  ['タイ', undefined, 'tai', [], 'Thailand', 'Thailand', 'katakana', 1],
  ['ベトナム', undefined, 'betonamu', [], 'Vietnam', 'Vietnam', 'katakana', 1],
  ['マレーシア', undefined, 'mareeshia', ['mareshia', 'malaysia'], 'Malaysia', 'Malaysia', 'katakana', 2],
  ['シンガポール', undefined, 'shingapooru', ['shingaporu', 'singapore'], 'Singapore', 'Singapura', 'katakana', 2],
  ['フィリピン', undefined, 'firipin', [], 'Philippines', 'Filipina', 'katakana', 2],
  ['オーストラリア', undefined, 'oosutoraria', ['osutoraria'], 'Australia', 'Australia', 'katakana', 2],
  ['カナダ', undefined, 'kanada', [], 'Canada', 'Kanada', 'katakana', 1],
  ['ブラジル', undefined, 'burajiru', [], 'Brazil', 'Brasil', 'katakana', 1],
  ['メキシコ', undefined, 'mekishiko', ['mekisiko'], 'Mexico', 'Meksiko', 'katakana', 1],
  ['エジプト', undefined, 'ejiputo', [], 'Egypt', 'Mesir', 'katakana', 2],
  ['サウジアラビア', undefined, 'saujiarabia', [], 'Saudi Arabia', 'Arab Saudi', 'katakana', 3],
  ['トルコ', undefined, 'toruko', [], 'Turkey', 'Turki', 'katakana', 1],
];

// ---------------------------------------------------------------------------
// Angka gabungan (ratusan, ribuan, puluh ribu, juta, ...) via converter
// ---------------------------------------------------------------------------
type Part = [kana: string, romaji: string];

const DIGITS: Part[] = [
  ['', ''], ['いち', 'ichi'], ['に', 'ni'], ['さん', 'san'], ['よん', 'yon'],
  ['ご', 'go'], ['ろく', 'roku'], ['なな', 'nana'], ['はち', 'hachi'], ['きゅう', 'kyuu'],
];
const KANJI_DIGITS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

const SPECIAL_HUNDREDS: Record<number, Part> = {
  1: ['ひゃく', 'hyaku'], 3: ['さんびゃく', 'sanbyaku'], 6: ['ろっぴゃく', 'roppyaku'], 8: ['はっぴゃく', 'happyaku'],
};
const SPECIAL_THOUSANDS: Record<number, Part> = {
  1: ['せん', 'sen'], 3: ['さんぜん', 'sanzen'], 8: ['はっせん', 'hassen'],
};

/** Reads 1..9999 as parts. `bigUnitFollows` → 1000 becomes いっせん (e.g. いっせんまん). */
function groupParts(n: number, bigUnitFollows: boolean): Part[] {
  const parts: Part[] = [];
  const th = Math.floor(n / 1000);
  const hu = Math.floor((n % 1000) / 100);
  const te = Math.floor((n % 100) / 10);
  const on = n % 10;
  if (th) {
    if (th === 1 && bigUnitFollows && n % 1000 === 0) parts.push(['いっせん', 'issen']);
    else parts.push(SPECIAL_THOUSANDS[th] ?? [DIGITS[th][0] + 'せん', DIGITS[th][1] + 'sen']);
  }
  if (hu) parts.push(SPECIAL_HUNDREDS[hu] ?? [DIGITS[hu][0] + 'ひゃく', DIGITS[hu][1] + 'hyaku']);
  if (te) parts.push(te === 1 ? ['じゅう', 'juu'] : [DIGITS[te][0] + 'じゅう', DIGITS[te][1] + 'juu']);
  if (on) parts.push(DIGITS[on]);
  return parts;
}

function groupKanji(n: number): string {
  const th = Math.floor(n / 1000);
  const hu = Math.floor((n % 1000) / 100);
  const te = Math.floor((n % 100) / 10);
  const on = n % 10;
  const unit = (d: number, u: string) => (d === 0 ? '' : (d === 1 ? '' : KANJI_DIGITS[d]) + u);
  return unit(th, '千') + unit(hu, '百') + unit(te, '十') + KANJI_DIGITS[on];
}

const BIG_UNITS: { value: number; kana: string; romaji: string; kanji: string }[] = [
  { value: 1e8, kana: 'おく', romaji: 'oku', kanji: '億' },
  { value: 1e4, kana: 'まん', romaji: 'man', kanji: '万' },
];

/** Converts 1..999,999,999,999 to Japanese reading parts + kanji. */
export function numberToJapanese(n: number): { parts: Part[]; kanji: string } {
  const parts: Part[] = [];
  let kanji = '';
  let rest = n;
  for (const u of BIG_UNITS) {
    const g = Math.floor(rest / u.value);
    rest %= u.value;
    if (!g) continue;
    // 1万 / 1億 always read with いち
    const gp = g === 1 ? [DIGITS[1]] : groupParts(g, true);
    parts.push(...gp.slice(0, -1), [gp[gp.length - 1][0] + u.kana, gp[gp.length - 1][1] + u.romaji]);
    kanji += (g === 1 ? '一' : groupKanji(g)) + u.kanji;
  }
  if (rest) {
    parts.push(...groupParts(rest, false));
    kanji += groupKanji(rest);
  }
  return { parts, kanji };
}

const fmt = (n: number, sep: string) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);

const COMPOSITE_NUMBERS = [
  // puluhan gabungan
  21, 34, 47, 58, 63, 75, 82, 99,
  // ratusan
  101, 110, 150, 234, 345, 368, 486, 555, 640, 777, 812, 999,
  // ribuan
  1001, 1100, 1234, 1500, 2026, 3456, 4000, 5000, 6000, 6789, 7000, 8888, 9000, 9999,
  // puluh ribu & ratus ribu
  15000, 20000, 25000, 30000, 35000, 50000, 75000, 99999,
  100000, 120000, 250000, 300000, 500000, 680000, 800000,
  // juta
  2000000, 2500000, 5000000, 10000000, 12345678, 30000000, 50000000,
  // ratus juta & miliar
  100000000, 300000000, 1000000000,
];

const COMPOSITE_WORDS: WordItem[] = COMPOSITE_NUMBERS.map(n => {
  const { parts, kanji } = numberToJapanese(n);
  const kana = parts.map(p => p[0]).join('');
  const romaji = parts.map(p => p[1]).join(' ');
  const alts = new Set<string>([parts.map(p => p[1]).join('')]);
  // sanbyaku ↔ sambyaku, issenman ↔ senman
  for (const a of [...alts]) {
    alts.add(a.replace(/nb/g, 'mb').replace(/np/g, 'mp'));
    alts.add(a.replace(/issen/g, 'sen'));
  }
  alts.delete(romaji);
  return {
    id: `num-v-${n}`,
    kana,
    kanji,
    romaji,
    altRomaji: [...alts],
    english: fmt(n, ','),
    indonesian: `Angka ${fmt(n, '.')}`,
    category: 'numbers',
    subCategories: ['numbers', ...(n >= 100 ? ['numbers_big'] : [])],
    script: 'hiragana' as const,
    difficulty: (n < 1000 ? 1 : n < 100000 ? 2 : 3) as 1 | 2 | 3,
    notes: `${fmt(n, '.')} = ${parts.map(p => `${p[0]} (${p[1]})`).join(' + ')}`,
  };
});

const BASIC_NUMBER_WORDS: WordItem[] = NUMBER_ROWS.map(
  ([kana, kanji, romaji, altRomaji, english, indonesian, difficulty, notes], i) => ({
    id: `num-${String(i + 1).padStart(3, '0')}`,
    kana,
    kanji,
    romaji,
    altRomaji,
    english,
    indonesian,
    category: 'numbers',
    subCategories: ['numbers', 'basics', ...(i >= NUMBER_ROWS.findIndex(r => r[1] === '百') ? ['numbers_big'] : [])],
    script: kana === 'ゼロ' ? 'katakana' : 'hiragana',
    difficulty,
    notes,
  })
);

export const NUMBER_WORDS: WordItem[] = [...BASIC_NUMBER_WORDS, ...COMPOSITE_WORDS];

export const COUNTRY_WORDS: WordItem[] = COUNTRY_ROWS.map(
  ([kana, kanji, romaji, altRomaji, english, indonesian, script, difficulty], i) => ({
    id: `ctry-${String(i + 1).padStart(3, '0')}`,
    kana,
    kanji,
    romaji,
    altRomaji,
    english,
    indonesian,
    category: 'countries',
    subCategories: ['countries'],
    script,
    difficulty,
  })
);
