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
      </div>
    </div>
  );
};
