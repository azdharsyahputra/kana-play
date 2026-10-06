import { KanaItem, KanaRow } from '../types';

export const KANA_ROWS: KanaRow[] = [
  // MAIN GOJUON (Levels 1 to 10)
  {
    id: 'row-a',
    name: 'A-Row',
    label: 'Vowels (あいうえお / アイウエオ)',
    groupType: 'main',
    level: 1,
    items: [
      { id: 'a', romaji: 'a', hiragana: 'あ', katakana: 'ア', rowId: 'row-a', groupType: 'main', orderIndex: 1 },
      { id: 'i', romaji: 'i', hiragana: 'い', katakana: 'イ', rowId: 'row-a', groupType: 'main', orderIndex: 2 },
      { id: 'u', romaji: 'u', hiragana: 'う', katakana: 'ウ', rowId: 'row-a', groupType: 'main', orderIndex: 3 },
      { id: 'e', romaji: 'e', hiragana: 'え', katakana: 'エ', rowId: 'row-a', groupType: 'main', orderIndex: 4 },
      { id: 'o', romaji: 'o', hiragana: 'お', katakana: 'オ', rowId: 'row-a', groupType: 'main', orderIndex: 5 },
    ],
  },
  {
    id: 'row-k',
    name: 'K-Row',
    label: 'K-Row (かきくけこ / カキクケコ)',
    groupType: 'main',
    level: 2,
    items: [
      { id: 'ka', romaji: 'ka', hiragana: 'か', katakana: 'カ', rowId: 'row-k', groupType: 'main', orderIndex: 6 },
      { id: 'ki', romaji: 'ki', hiragana: 'き', katakana: 'キ', rowId: 'row-k', groupType: 'main', orderIndex: 7 },
      { id: 'ku', romaji: 'ku', hiragana: 'く', katakana: 'ク', rowId: 'row-k', groupType: 'main', orderIndex: 8 },
      { id: 'ke', romaji: 'ke', hiragana: 'け', katakana: 'ケ', rowId: 'row-k', groupType: 'main', orderIndex: 9 },
      { id: 'ko', romaji: 'ko', hiragana: 'こ', katakana: 'コ', rowId: 'row-k', groupType: 'main', orderIndex: 10 },
    ],
  },
  {
    id: 'row-s',
    name: 'S-Row',
    label: 'S-Row (さしすせそ / サシスセソ)',
    groupType: 'main',
    level: 3,
    items: [
      { id: 'sa', romaji: 'sa', hiragana: 'さ', katakana: 'サ', rowId: 'row-s', groupType: 'main', orderIndex: 11 },
      { id: 'shi', romaji: 'shi', hiragana: 'し', katakana: 'シ', rowId: 'row-s', groupType: 'main', orderIndex: 12 },
      { id: 'su', romaji: 'su', hiragana: 'す', katakana: 'ス', rowId: 'row-s', groupType: 'main', orderIndex: 13 },
      { id: 'se', romaji: 'se', hiragana: 'せ', katakana: 'セ', rowId: 'row-s', groupType: 'main', orderIndex: 14 },
      { id: 'so', romaji: 'so', hiragana: 'そ', katakana: 'ソ', rowId: 'row-s', groupType: 'main', orderIndex: 15 },
    ],
  },
  {
    id: 'row-t',
    name: 'T-Row',
    label: 'T-Row (たちつてと / タチツテト)',
    groupType: 'main',
    level: 4,
    items: [
      { id: 'ta', romaji: 'ta', hiragana: 'た', katakana: 'タ', rowId: 'row-t', groupType: 'main', orderIndex: 16 },
      { id: 'chi', romaji: 'chi', hiragana: 'ち', katakana: 'チ', rowId: 'row-t', groupType: 'main', orderIndex: 17 },
      { id: 'tsu', romaji: 'tsu', hiragana: 'つ', katakana: 'ツ', rowId: 'row-t', groupType: 'main', orderIndex: 18 },
      { id: 'te', romaji: 'te', hiragana: 'て', katakana: 'テ', rowId: 'row-t', groupType: 'main', orderIndex: 19 },
      { id: 'to', romaji: 'to', hiragana: 'と', katakana: 'ト', rowId: 'row-t', groupType: 'main', orderIndex: 20 },
    ],
  },
  {
    id: 'row-n',
    name: 'N-Row',
    label: 'N-Row (なにぬねの / ナニヌネノ)',
    groupType: 'main',
    level: 5,
    items: [
      { id: 'na', romaji: 'na', hiragana: 'な', katakana: 'ナ', rowId: 'row-n', groupType: 'main', orderIndex: 21 },
      { id: 'ni', romaji: 'ni', hiragana: 'に', katakana: 'ニ', rowId: 'row-n', groupType: 'main', orderIndex: 22 },
      { id: 'nu', romaji: 'nu', hiragana: 'ぬ', katakana: 'ヌ', rowId: 'row-n', groupType: 'main', orderIndex: 23 },
      { id: 'ne', romaji: 'ne', hiragana: 'ね', katakana: 'ネ', rowId: 'row-n', groupType: 'main', orderIndex: 24 },
      { id: 'no', romaji: 'no', hiragana: 'の', katakana: 'ノ', rowId: 'row-n', groupType: 'main', orderIndex: 25 },
    ],
  },
  {
    id: 'row-h',
    name: 'H-Row',
    label: 'H-Row (はひふへほ / ハヒフヘホ)',
    groupType: 'main',
    level: 6,
    items: [
      { id: 'ha', romaji: 'ha', hiragana: 'は', katakana: 'ハ', rowId: 'row-h', groupType: 'main', orderIndex: 26 },
      { id: 'hi', romaji: 'hi', hiragana: 'ひ', katakana: 'ヒ', rowId: 'row-h', groupType: 'main', orderIndex: 27 },
      { id: 'fu', romaji: 'fu', hiragana: 'ふ', katakana: 'フ', rowId: 'row-h', groupType: 'main', orderIndex: 28 },
      { id: 'he', romaji: 'he', hiragana: 'へ', katakana: 'ヘ', rowId: 'row-h', groupType: 'main', orderIndex: 29 },
      { id: 'ho', romaji: 'ho', hiragana: 'ほ', katakana: 'ホ', rowId: 'row-h', groupType: 'main', orderIndex: 30 },
    ],
  },
  {
    id: 'row-m',
    name: 'M-Row',
    label: 'M-Row (まみむめも / マミムメモ)',
    groupType: 'main',
    level: 7,
    items: [
      { id: 'ma', romaji: 'ma', hiragana: 'ま', katakana: 'マ', rowId: 'row-m', groupType: 'main', orderIndex: 31 },
      { id: 'mi', romaji: 'mi', hiragana: 'み', katakana: 'ミ', rowId: 'row-m', groupType: 'main', orderIndex: 32 },
      { id: 'mu', romaji: 'mu', hiragana: 'む', katakana: 'ム', rowId: 'row-m', groupType: 'main', orderIndex: 33 },
      { id: 'me', romaji: 'me', hiragana: 'め', katakana: 'メ', rowId: 'row-m', groupType: 'main', orderIndex: 34 },
      { id: 'mo', romaji: 'mo', hiragana: 'も', katakana: 'モ', rowId: 'row-m', groupType: 'main', orderIndex: 35 },
    ],
  },
  {
    id: 'row-y',
    name: 'Y-Row',
    label: 'Y-Row (やゆよ / ヤユヨ)',
    groupType: 'main',
    level: 8,
    items: [
      { id: 'ya', romaji: 'ya', hiragana: 'や', katakana: 'ヤ', rowId: 'row-y', groupType: 'main', orderIndex: 36 },
      { id: 'yu', romaji: 'yu', hiragana: 'ゆ', katakana: 'ユ', rowId: 'row-y', groupType: 'main', orderIndex: 37 },
      { id: 'yo', romaji: 'yo', hiragana: 'よ', katakana: 'ヨ', rowId: 'row-y', groupType: 'main', orderIndex: 38 },
    ],
  },
  {
    id: 'row-r',
    name: 'R-Row',
    label: 'R-Row (らりるれろ / ラリルレロ)',
    groupType: 'main',
    level: 9,
    items: [
      { id: 'ra', romaji: 'ra', hiragana: 'ら', katakana: 'ラ', rowId: 'row-r', groupType: 'main', orderIndex: 39 },
      { id: 'ri', romaji: 'ri', hiragana: 'り', katakana: 'リ', rowId: 'row-r', groupType: 'main', orderIndex: 40 },
      { id: 'ru', romaji: 'ru', hiragana: 'る', katakana: 'ル', rowId: 'row-r', groupType: 'main', orderIndex: 41 },
      { id: 're', romaji: 're', hiragana: 'れ', katakana: 'レ', rowId: 'row-r', groupType: 'main', orderIndex: 42 },
      { id: 'ro', romaji: 'ro', hiragana: 'ろ', katakana: 'ロ', rowId: 'row-r', groupType: 'main', orderIndex: 43 },
    ],
  },
  {
    id: 'row-w-n',
    name: 'W & N-Row',
    label: 'W & N (わをん / ワヲン)',
    groupType: 'main',
    level: 10,
    items: [
      { id: 'wa', romaji: 'wa', hiragana: 'わ', katakana: 'ワ', rowId: 'row-w-n', groupType: 'main', orderIndex: 44 },
      { id: 'wo', romaji: 'wo', hiragana: 'を', katakana: 'ヲ', rowId: 'row-w-n', groupType: 'main', orderIndex: 45 },
      { id: 'n', romaji: 'n', hiragana: 'ん', katakana: 'ン', rowId: 'row-w-n', groupType: 'main', orderIndex: 46 },
    ],
  },

  // DAKUTEN (Levels 11 to 14)
  {
    id: 'row-g',
    name: 'G-Row',
    label: 'G-Row (がぎぐげご / ガギグゲゴ)',
    groupType: 'dakuten',
    level: 11,
    items: [
      { id: 'ga', romaji: 'ga', hiragana: 'が', katakana: 'ガ', rowId: 'row-g', groupType: 'dakuten', orderIndex: 47 },
      { id: 'gi', romaji: 'gi', hiragana: 'ぎ', katakana: 'ギ', rowId: 'row-g', groupType: 'dakuten', orderIndex: 48 },
      { id: 'gu', romaji: 'gu', hiragana: 'ぐ', katakana: 'グ', rowId: 'row-g', groupType: 'dakuten', orderIndex: 49 },
      { id: 'ge', romaji: 'ge', hiragana: 'げ', katakana: 'ゲ', rowId: 'row-g', groupType: 'dakuten', orderIndex: 50 },
      { id: 'go', romaji: 'go', hiragana: 'ご', katakana: 'ゴ', rowId: 'row-g', groupType: 'dakuten', orderIndex: 51 },
    ],
  },
  {
    id: 'row-z',
    name: 'Z-Row',
    label: 'Z-Row (ざじずぜぞ / ザジズゼゾ)',
    groupType: 'dakuten',
    level: 12,
    items: [
      { id: 'za', romaji: 'za', hiragana: 'ざ', katakana: 'ザ', rowId: 'row-z', groupType: 'dakuten', orderIndex: 52 },
      { id: 'ji', romaji: 'ji', hiragana: 'じ', katakana: 'ジ', rowId: 'row-z', groupType: 'dakuten', orderIndex: 53 },
      { id: 'zu', romaji: 'zu', hiragana: 'ず', katakana: 'ズ', rowId: 'row-z', groupType: 'dakuten', orderIndex: 54 },
      { id: 'ze', romaji: 'ze', hiragana: 'ぜ', katakana: 'ゼ', rowId: 'row-z', groupType: 'dakuten', orderIndex: 55 },
      { id: 'zo', romaji: 'zo', hiragana: 'ぞ', katakana: 'ゾ', rowId: 'row-z', groupType: 'dakuten', orderIndex: 56 },
    ],
  },
  {
    id: 'row-d',
    name: 'D-Row',
    label: 'D-Row (だぢづでど / ダヂヅデド)',
    groupType: 'dakuten',
    level: 13,
    items: [
      { id: 'da', romaji: 'da', hiragana: 'だ', katakana: 'ダ', rowId: 'row-d', groupType: 'dakuten', orderIndex: 57 },
      { id: 'di', romaji: 'ji', hiragana: 'ぢ', katakana: 'ヂ', rowId: 'row-d', groupType: 'dakuten', orderIndex: 58 },
      { id: 'du', romaji: 'zu', hiragana: 'づ', katakana: 'ヅ', rowId: 'row-d', groupType: 'dakuten', orderIndex: 59 },
      { id: 'de', romaji: 'de', hiragana: 'で', katakana: 'デ', rowId: 'row-d', groupType: 'dakuten', orderIndex: 60 },
      { id: 'do', romaji: 'do', hiragana: 'ど', katakana: 'ド', rowId: 'row-d', groupType: 'dakuten', orderIndex: 61 },
    ],
  },
  {
    id: 'row-b',
    name: 'B-Row',
    label: 'B-Row (ばびぶべぼ / バビブベボ)',
    groupType: 'dakuten',
    level: 14,
    items: [
      { id: 'ba', romaji: 'ba', hiragana: 'ば', katakana: 'バ', rowId: 'row-b', groupType: 'dakuten', orderIndex: 62 },
      { id: 'bi', romaji: 'bi', hiragana: 'び', katakana: 'ビ', rowId: 'row-b', groupType: 'dakuten', orderIndex: 63 },
      { id: 'bu', romaji: 'bu', hiragana: 'ぶ', katakana: 'ブ', rowId: 'row-b', groupType: 'dakuten', orderIndex: 64 },
      { id: 'be', romaji: 'be', hiragana: 'べ', katakana: 'ベ', rowId: 'row-b', groupType: 'dakuten', orderIndex: 65 },
      { id: 'bo', romaji: 'bo', hiragana: 'ぼ', katakana: 'ボ', rowId: 'row-b', groupType: 'dakuten', orderIndex: 66 },
    ],
  },

  // HANDAKUTEN (Level 15)
  {
    id: 'row-p',
    name: 'P-Row',
    label: 'P-Row (ぱぴぷぺぽ / パピプペポ)',
    groupType: 'handakuten',
    level: 15,
    items: [
      { id: 'pa', romaji: 'pa', hiragana: 'ぱ', katakana: 'パ', rowId: 'row-p', groupType: 'handakuten', orderIndex: 67 },
      { id: 'pi', romaji: 'pi', hiragana: 'ぴ', katakana: 'ピ', rowId: 'row-p', groupType: 'handakuten', orderIndex: 68 },
      { id: 'pu', romaji: 'pu', hiragana: 'ぷ', katakana: 'プ', rowId: 'row-p', groupType: 'handakuten', orderIndex: 69 },
      { id: 'pe', romaji: 'pe', hiragana: 'ぺ', katakana: 'ペ', rowId: 'row-p', groupType: 'handakuten', orderIndex: 70 },
      { id: 'po', romaji: 'po', hiragana: 'ぽ', katakana: 'ポ', rowId: 'row-p', groupType: 'handakuten', orderIndex: 71 },
    ],
  },

  // YOON / COMBINATIONS (Levels 16 to 18)
  {
    id: 'row-yoon-main',
    name: 'Main Yōon',
    label: 'K/S/T/N Yōon (きゃ・しゃ・ちゃ・にゃ / キャ・シャ・チャ・ニャ)',
    groupType: 'youon',
    level: 16,
    items: [
      { id: 'kya', romaji: 'kya', hiragana: 'きゃ', katakana: 'キャ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 72 },
      { id: 'kyu', romaji: 'kyu', hiragana: 'きゅ', katakana: 'キュ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 73 },
      { id: 'kyo', romaji: 'kyo', hiragana: 'きょ', katakana: 'キョ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 74 },
      { id: 'sha', romaji: 'sha', hiragana: 'しゃ', katakana: 'シャ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 75 },
      { id: 'shu', romaji: 'shu', hiragana: 'しゅ', katakana: 'シュ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 76 },
      { id: 'sho', romaji: 'sho', hiragana: 'しょ', katakana: 'ショ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 77 },
      { id: 'cha', romaji: 'cha', hiragana: 'ちゃ', katakana: 'チャ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 78 },
      { id: 'chu', romaji: 'chu', hiragana: 'ちゅ', katakana: 'チュ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 79 },
      { id: 'cho', romaji: 'cho', hiragana: 'ちょ', katakana: 'チョ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 80 },
      { id: 'nya', romaji: 'nya', hiragana: 'にゃ', katakana: 'ニャ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 81 },
      { id: 'nyu', romaji: 'nyu', hiragana: 'にゅ', katakana: 'ニュ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 82 },
      { id: 'nyo', romaji: 'nyo', hiragana: 'にょ', katakana: 'ニョ', rowId: 'row-yoon-main', groupType: 'youon', orderIndex: 83 },
    ],
  },
  {
    id: 'row-yoon-h-m-r',
    name: 'H/M/R Yōon',
    label: 'H/M/R Yōon (ひゃ・みゃ・りゃ / ヒャ・ミャ・リャ)',
    groupType: 'youon',
    level: 17,
    items: [
      { id: 'hya', romaji: 'hya', hiragana: 'ひゃ', katakana: 'ヒャ', rowId: 'row-yoon-h-m-r', groupType: 'youon', orderIndex: 84 },
      { id: 'hyu', romaji: 'hyu', hiragana: 'ひゅ', katakana: 'ヒュ', rowId: 'row-yoon-h-m-r', groupType: 'youon', orderIndex: 85 },
      { id: 'hyo', romaji: 'hyo', hiragana: 'ひょ', katakana: 'ヒョ', rowId: 'row-yoon-h-m-r', groupType: 'youon', orderIndex: 86 },
      { id: 'mya', romaji: 'mya', hiragana: 'みゃ', katakana: 'ミャ', rowId: 'row-yoon-h-m-r', groupType: 'youon', orderIndex: 87 },
      { id: 'myu', romaji: 'myu', hiragana: 'みゅ', katakana: 'ミュ', rowId: 'row-yoon-h-m-r', groupType: 'youon', orderIndex: 88 },
      { id: 'myo', romaji: 'myo', hiragana: 'みょ', katakana: 'ミョ', rowId: 'row-yoon-h-m-r', groupType: 'youon', orderIndex: 89 },
      { id: 'rya', romaji: 'rya', hiragana: 'りゃ', katakana: 'リャ', rowId: 'row-yoon-h-m-r', groupType: 'youon', orderIndex: 90 },
      { id: 'ryu', romaji: 'ryu', hiragana: 'りゅ', katakana: 'リュ', rowId: 'row-yoon-h-m-r', groupType: 'youon', orderIndex: 91 },
      { id: 'ryo', romaji: 'ryo', hiragana: 'りょ', katakana: 'リョ', rowId: 'row-yoon-h-m-r', groupType: 'youon', orderIndex: 92 },
    ],
  },
  {
    id: 'row-yoon-dakuten',
    name: 'Voiced Yōon',
    label: 'G/J/B/P Yōon (ぎゃ・じゃ・びゃ・ぴゃ / ギャ・ジャ・ビャ・ピャ)',
    groupType: 'youon',
    level: 18,
    items: [
      { id: 'gya', romaji: 'gya', hiragana: 'ぎゃ', katakana: 'ギャ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 93 },
      { id: 'gyu', romaji: 'gyu', hiragana: 'ぎゅ', katakana: 'ギュ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 94 },
      { id: 'gyo', romaji: 'gyo', hiragana: 'ぎょ', katakana: 'ギョ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 95 },
      { id: 'ja', romaji: 'ja', hiragana: 'じゃ', katakana: 'ジャ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 96 },
      { id: 'ju', romaji: 'ju', hiragana: 'じゅ', katakana: 'ジュ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 97 },
      { id: 'jo', romaji: 'jo', hiragana: 'じょ', katakana: 'ジョ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 98 },
      { id: 'bya', romaji: 'bya', hiragana: 'びゃ', katakana: 'ビャ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 99 },
      { id: 'byu', romaji: 'byu', hiragana: 'びゅ', katakana: 'ビュ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 100 },
      { id: 'byo', romaji: 'byo', hiragana: 'びょ', katakana: 'ビョ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 101 },
      { id: 'pya', romaji: 'pya', hiragana: 'ぴゃ', katakana: 'ピャ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 102 },
      { id: 'pyu', romaji: 'pyu', hiragana: 'ぴゅ', katakana: 'ピュ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 103 },
      { id: 'pyo', romaji: 'pyo', hiragana: 'ぴょ', katakana: 'ピョ', rowId: 'row-yoon-dakuten', groupType: 'youon', orderIndex: 104 },
    ],
  },
];

// Flat lists for quick lookup
export const ALL_KANA_ITEMS: KanaItem[] = KANA_ROWS.flatMap(row => row.items);

export const KANA_BY_ID = new Map<string, KanaItem>(
  ALL_KANA_ITEMS.map(item => [item.id, item])
);

// Map of alternative romanization acceptances (e.g., 'si' for 'shi', 'ti' for 'chi', 'tu' for 'tsu', 'hu' for 'fu', 'zi' for 'ji')
export const ROMAJI_ALIASES: Record<string, string[]> = {
  'shi': ['shi', 'si'],
  'chi': ['chi', 'ti'],
  'tsu': ['tsu', 'tu'],
  'fu': ['fu', 'hu'],
  'ji': ['ji', 'zi'],
  'sha': ['sha', 'sya'],
  'shu': ['shu', 'syu'],
  'sho': ['sho', 'syo'],
  'cha': ['cha', 'tya'],
  'chu': ['chu', 'tyu'],
  'cho': ['cho', 'tyo'],
  'ja': ['ja', 'zya', 'jya'],
  'ju': ['ju', 'zyu', 'jyu'],
  'jo': ['jo', 'zyo', 'jyo'],
  'wo': ['wo', 'o'],
  'n': ['n', 'nn'],
};

// Check if user's input matches romaji target (case-insensitive & trimmed)
export function checkRomajiMatch(userInput: string, targetRomaji: string): boolean {
  const cleanInput = userInput.trim().toLowerCase();
  const cleanTarget = targetRomaji.trim().toLowerCase();

  if (cleanInput === cleanTarget) return true;

  const aliases = ROMAJI_ALIASES[cleanTarget];
  if (aliases && aliases.includes(cleanInput)) return true;

  return false;
}

// Unvoiced / Handakuten -> Dakuten (゛)
export const DAKUTEN_MAP: Record<string, string> = {
  // Hiragana
  'か': 'が', 'き': 'ぎ', 'く': 'ぐ', 'け': 'げ', 'こ': 'ご',
  'さ': 'ざ', 'し': 'じ', 'す': 'ず', 'せ': 'ぜ', 'そ': 'ぞ',
  'た': 'だ', 'ち': 'ぢ', 'つ': 'づ', 'て': 'で', 'と': 'ど',
  'は': 'ば', 'ひ': 'び', 'ふ': 'ぶ', 'へ': 'べ', 'ほ': 'ぼ',
  'う': 'ゔ',
  'ぱ': 'ば', 'ぴ': 'び', 'ぷ': 'ぶ', 'ぺ': 'べ', 'ぽ': 'ぼ',

  // Katakana
  'カ': 'ガ', 'キ': 'ギ', 'ク': 'グ', 'ケ': 'ゲ', 'コ': 'ゴ',
  'サ': 'ザ', 'シ': 'ジ', 'ス': 'ズ', 'セ': 'ゼ', 'ソ': 'ゾ',
  'タ': 'ダ', 'チ': 'ヂ', 'ツ': 'ヅ', 'テ': 'デ', 'ト': 'ド',
  'ハ': 'バ', 'ヒ': 'ビ', 'フ': 'ブ', 'ヘ': 'ベ', 'ホ': 'ボ',
  'ウ': 'ヴ',
  'パ': 'バ', 'ピ': 'ビ', 'プ': 'ブ', 'ペ': 'ベ', 'ポ': 'ボ',
};

// Dakuten -> Unvoiced (for toggle back)
export const DAKUTEN_REVERSE_MAP: Record<string, string> = {
  // Hiragana
  'が': 'か', 'ぎ': 'き', 'ぐ': 'く', 'げ': 'け', 'ご': 'こ',
  'ざ': 'さ', 'じ': 'し', 'ず': 'す', 'ぜ': 'せ', 'ぞ': 'そ',
  'だ': 'た', 'ぢ': 'ち', 'づ': 'つ', 'で': 'て', 'ど': 'と',
  'ば': 'は', 'び': 'ひ', 'ぶ': 'ふ', 'べ': 'へ', 'ぼ': 'ほ',
  'ゔ': 'う',

  // Katakana
  'ガ': 'カ', 'ギ': 'キ', 'グ': 'ク', 'ゲ': 'ケ', 'ゴ': 'コ',
  'ザ': 'サ', 'ジ': 'シ', 'ズ': 'ス', 'ゼ': 'セ', 'ゾ': 'ソ',
  'ダ': 'タ', 'ヂ': 'チ', 'ヅ': 'ツ', 'デ': 'テ', 'ド': 'ト',
  'バ': 'ハ', 'ビ': 'ヒ', 'ブ': 'フ', 'ベ': 'ヘ', 'ボ': 'ホ',
  'ヴ': 'ウ',
};

// Unvoiced / Dakuten -> Handakuten (゜)
export const HANDAKUTEN_MAP: Record<string, string> = {
  // Hiragana
  'は': 'ぱ', 'ひ': 'ぴ', 'ふ': 'ぷ', 'へ': 'ぺ', 'ほ': 'ぽ',
  'ば': 'ぱ', 'び': 'ぴ', 'ぶ': 'ぷ', 'べ': 'ぺ', 'ぼ': 'ぽ',

  // Katakana
  'ハ': 'パ', 'ヒ': 'ピ', 'フ': 'プ', 'ヘ': 'ペ', 'ホ': 'ポ',
  'バ': 'パ', 'ビ': 'ピ', 'ブ': 'プ', 'ベ': 'ペ', 'ボ': 'ポ',
};

// Handakuten -> Unvoiced (for toggle back)
export const HANDAKUTEN_REVERSE_MAP: Record<string, string> = {
  // Hiragana
  'ぱ': 'は', 'ぴ': 'ひ', 'ぷ': 'ふ', 'ぺ': 'へ', 'ぽ': 'ほ',

  // Katakana
  'パ': 'ハ', 'ピ': 'ヒ', 'プ': 'フ', 'ペ': 'ヘ', 'ポ': 'ホ',
};

// Big <-> Small Kana Map
export const SMALL_KANA_MAP: Record<string, string> = {
  // Hiragana: big to small
  'つ': 'っ', 'や': 'ゃ', 'ゆ': 'ゅ', 'よ': 'ょ',
  'あ': 'ぁ', 'い': 'ぃ', 'う': 'ぅ', 'え': 'ぇ', 'お': 'ぉ',
  'わ': 'ゎ',
  // Hiragana: small to big
  'っ': 'つ', 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ',
  'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
  'ゎ': 'わ',

  // Katakana: big to small
  'ツ': 'ッ', 'ヤ': 'ャ', 'ユ': 'ュ', 'ヨ': 'ョ',
  'ア': 'ァ', 'イ': 'ィ', 'ウ': 'ゥ', 'エ': 'ェ', 'オ': 'ォ',
  'ワ': 'ヮ', 'カ': 'ヵ', 'ケ': 'ヶ',
  // Katakana: small to big
  'ッ': 'ツ', 'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ',
  'ァ': 'ア', 'ィ': 'イ', 'ゥ': 'ウ', 'ェ': 'エ', 'ォ': 'オ',
  'ヮ': 'ワ', 'ヵ': 'カ', 'ヶ': 'ケ',
};

export function applyDakuten(lastChar: string): string {
  if (DAKUTEN_MAP[lastChar]) return DAKUTEN_MAP[lastChar];
  if (DAKUTEN_REVERSE_MAP[lastChar]) return DAKUTEN_REVERSE_MAP[lastChar];
  return lastChar;
}

export function applyHandakuten(lastChar: string): string {
  if (HANDAKUTEN_MAP[lastChar]) return HANDAKUTEN_MAP[lastChar];
  if (HANDAKUTEN_REVERSE_MAP[lastChar]) return HANDAKUTEN_REVERSE_MAP[lastChar];
  return lastChar;
}

export function toggleSmallKana(lastChar: string): string {
  if (SMALL_KANA_MAP[lastChar]) return SMALL_KANA_MAP[lastChar];
  return lastChar;
}

