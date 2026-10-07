import React, { useState } from 'react';
import { KANA_ROWS } from '../data/kanaData';
import { speakJapanese } from '../utils/audio';
import { Volume2, BookOpen } from 'lucide-react';

export const CheatSheet: React.FC = () => {
  const [selectedScript, setSelectedScript] = useState<'hiragana' | 'katakana'>('hiragana');

  return (
    <div className="space-y-4">
      <div className="retro-card p-4 sm:p-5 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#0b1a3d]/20 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#0c389c]" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bungee text-[#0b1a3d]">
                ★ KANA CHEAT SHEET TABLE ★
              </h2>
              <p className="text-xs font-bold text-gray-600">
                Tabel lengkap bunyi Kana standar Jepang (Hiragana & Katakana).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f6eedf] p-1 rounded-xl border-2 border-[#0b1a3d]">
            <button
              onClick={() => setSelectedScript('hiragana')}
              className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all ${
                selectedScript === 'hiragana'
                  ? 'bg-[#0c389c] text-white shadow-[2px_2px_0px_#0b1a3d]'
                  : 'text-[#0b1a3d] hover:bg-white'
              }`}
            >
              Hiragana (ひらがな)
            </button>
            <button
              onClick={() => setSelectedScript('katakana')}
              className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all ${
                selectedScript === 'katakana'
                  ? 'bg-[#d9261c] text-white shadow-[2px_2px_0px_#0b1a3d]'
                  : 'text-[#0b1a3d] hover:bg-white'
              }`}
            >
              Katakana (カタカナ)
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="space-y-4">
          {KANA_ROWS.map((row) => (
            <div key={row.id} className="border-2 border-[#0b1a3d]/20 rounded-xl p-3 bg-[#f6eedf]/50">
              <div className="text-xs font-bungee text-[#0c389c] uppercase mb-2">
                {row.name} ({row.label})
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-12 gap-2">
                {row.items.map((item) => {
                  const char = selectedScript === 'katakana' ? item.katakana : item.hiragana;
                  return (
                    <button
                      key={item.id}
                      onClick={() => speakJapanese(char)}
                      title={`Klik untuk dengar audio '${item.romaji}'`}
                      className="bg-white border-2 border-[#0b1a3d] rounded-xl p-2 flex flex-col items-center justify-center hover:bg-[#ffd200] transition-all shadow-[2px_2px_0px_#0b1a3d] group cursor-pointer"
                    >
                      <span className="text-2xl font-black font-kana text-[#0b1a3d] group-hover:scale-110 transition-transform">
                        {char}
                      </span>
                      <span className="text-[10px] font-black font-mono uppercase text-[#0c389c] mt-0.5">
                        {item.romaji}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* SOKUON (促音) SPECIAL LEARNING MODULE */}
        <div className="mt-6 border-[3px] border-[#0b1a3d] rounded-2xl p-4 sm:p-6 bg-[#fffbeb] shadow-[4px_4px_0px_#0b1a3d] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#0b1a3d]/20">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 bg-[#ffd200] rounded-xl border-2 border-[#0b1a3d] text-xl font-bungee shadow-[2px_2px_0px_#0b1a3d]">
                っ / ッ
              </span>
              <div>
                <h3 className="font-bungee text-base sm:text-lg text-[#0b1a3d]">
                  ★ MATERI SOKUON (促音 - TSU KECIL) ★
                </h3>
                <p className="text-xs font-bold text-gray-600">
                  Panduan lengkap bunyi konsonan ganda (double consonant) & jeda henti sesaat.
                </p>
              </div>
            </div>
            <span className="bg-[#d9261c] text-white text-[10px] font-bungee px-2.5 py-1 rounded-md border border-[#73130d] hidden sm:inline-block">
              KONSEP PENTING
            </span>
          </div>

          {/* Explanation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border-2 border-[#0b1a3d] rounded-xl p-3 shadow-[2px_2px_0px_#0b1a3d]">
              <div className="text-xs font-bungee text-[#0c389c] mb-1">1. BENTUK HURUF</div>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                Sokuon adalah huruf <strong>つ (tsu)</strong> atau <strong>ツ</strong> yang ditulis dalam <strong>ukuran kecil</strong> (<strong>っ</strong> / <strong>ッ</strong>). Posisinya berada di sudut kiri bawah bidang kotak karakter.
              </p>
            </div>

            <div className="bg-white border-2 border-[#0b1a3d] rounded-xl p-3 shadow-[2px_2px_0px_#0b1a3d]">
              <div className="text-xs font-bungee text-[#0c389c] mb-1">2. FUNGSI BUNYI</div>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                Berfungsi sebagai <strong>jeda henti (glottal stop / 1 ketukan)</strong> yang mendobelkan konsonan huruf setelahnya (misal konsonan: <em>k, s, t, p</em>).
              </p>
            </div>

            <div className="bg-white border-2 border-[#0b1a3d] rounded-xl p-3 shadow-[2px_2px_0px_#0b1a3d]">
              <div className="text-xs font-bungee text-[#0c389c] mb-1">3. CARA KETIK KEYBOARD</div>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                Cukup <strong>ketik dobel konsonannya</strong> saat mengetik romaji (misal: ketik <code className="bg-[#f6eedf] px-1 py-0.5 rounded font-bold">kitte</code> untuk きって) atau ketik <code className="bg-[#f6eedf] px-1 py-0.5 rounded font-bold">xtsu</code> / <code className="bg-[#f6eedf] px-1 py-0.5 rounded font-bold">ltsu</code>.
              </p>
            </div>
          </div>

          {/* Interactive Examples Table */}
          <div className="bg-white border-2 border-[#0b1a3d] rounded-xl p-3.5 shadow-[2px_2px_0px_#0b1a3d]">
            <div className="text-xs font-bungee text-[#0b1a3d] mb-2.5 uppercase">
              🔊 CONTOH KATA SOKUON POPULER (KLIK UNTUK DENGAR SUARA):
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                { kana: 'きって', romaji: 'kitte', meaning: 'Perangko', breakdown: 'ki + っ + te' },
                { kana: 'がっこう', romaji: 'gakkou', meaning: 'Sekolah', breakdown: 'ga + っ + kou' },
                { kana: 'ざっし', romaji: 'zasshi', meaning: 'Majalah', breakdown: 'za + っ + shi' },
                { kana: 'きっぷ', romaji: 'kippu', meaning: 'Tiket Kereta', breakdown: 'ki + っ + pu' },
                { kana: 'もっと', romaji: 'motto', meaning: 'Lebih Banyak', breakdown: 'mo + っ + to' },
                { kana: 'コップ', romaji: 'koppu', meaning: 'Gelas / Cangkir', breakdown: 'ko + ッ + pu' },
                { kana: 'サッカー', romaji: 'sakkaa', meaning: 'Sepak Bola', breakdown: 'sa + ッ + kaa' },
                { kana: 'ベッド', romaji: 'beddo', meaning: 'Tempat Tidur', breakdown: 'be + ッ + do' },
                { kana: 'チケット', romaji: 'chiketto', meaning: 'Tiket', breakdown: 'chi + ke + ッ + to' },
              ].map((ex) => (
                <button
                  key={ex.kana}
                  onClick={() => speakJapanese(ex.kana)}
                  className="p-2.5 rounded-lg border-2 border-[#0b1a3d]/25 bg-[#f6eedf]/50 hover:bg-[#ffd200] transition-all flex items-center justify-between text-left group cursor-pointer shadow-[1px_1px_0px_#0b1a3d]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-kana text-lg font-black text-[#0b1a3d] group-hover:scale-105 transition-transform">
                        {ex.kana}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#0c389c]">
                        ({ex.romaji})
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-600 font-bold truncate">
                      {ex.meaning} • <span className="text-gray-400 font-normal">{ex.breakdown}</span>
                    </div>
                  </div>
                  <Volume2 className="w-4 h-4 text-[#0c389c] shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
