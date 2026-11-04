import fs from 'fs';

// Read dist or test directly
const utsWordsFile = fs.readFileSync('src/data/utsWordsData.ts', 'utf8');
const wordsDataFile = fs.readFileSync('src/data/wordsData.ts', 'utf8');

console.log('--- Verifying Data & Code Integration ---');

const requiredVocab = [
  { kana: 'いす', meaning: 'Kursi' },
  { kana: 'つくえ', meaning: 'Meja' },
  { kana: 'えんぴつ', meaning: 'Pensil' },
  { kana: 'けしごむ', meaning: 'Karet penghapus' },
  { kana: 'ホワイトボード', meaning: 'Papan tulis putih' },
  { kana: 'れいぞうこ', meaning: 'Kulkas' },
  { kana: 'パン', meaning: 'Roti' },
  { kana: 'テレビ', meaning: 'TV' },
  { kana: 'エアコン', meaning: 'AC' },
  { kana: 'ちち', meaning: 'Ayah' },
  { kana: 'はは', meaning: 'Ibu' },
  { kana: 'いっこだて', meaning: 'Rumah tapak' },
  { kana: 'ざっし', meaning: 'Majalah' },
  { kana: 'にほんご', meaning: 'Bahasa Jepang' },
  { kana: 'ふじさん', meaning: 'Gunung Fuji' },
  { kana: 'とうきょう', meaning: 'Tokyo' },
];

let allPresent = true;
for (const v of requiredVocab) {
  const inUts = utsWordsFile.includes(`"${v.kana}"`) || utsWordsFile.includes(`'${v.kana}'`);
  if (!inUts) {
    console.error(`MISSING: ${v.kana} (${v.meaning})`);
    allPresent = false;
  } else {
    console.log(`✓ ${v.kana} (${v.meaning}) is present`);
  }
}

if (allPresent) {
  console.log('\nAll key UTS vocabulary items verified!');
}

