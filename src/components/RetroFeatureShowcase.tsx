import React from 'react';
import type { AppTab, DrillDirection } from '../types';
import { Starburst } from './Starburst';
import { Zap, Shuffle, BookOpen, PenTool } from 'lucide-react';
import { playKeyClickSound } from '../utils/audio';

interface RetroFeatureShowcaseProps {
  onSelectTab: (tab: AppTab) => void;
  onSelectDirection: (dir: DrillDirection) => void;
}

export const RetroFeatureShowcase: React.FC<RetroFeatureShowcaseProps> = ({
  onSelectTab,
  onSelectDirection,
}) => {
  return (
    <div className="space-y-4 mb-5">
      {/* 1. HERO BANNER WITH RETRO MECHA JET / MASCOT ART & STARBURST */}
      <div className="retro-card-blue p-5 sm:p-7 relative overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-block bg-[#ffd200] text-[#0b1a3d] font-bungee text-xs px-3 py-1 rounded-md border-2 border-[#0b1a3d] mb-2 shadow-[2px_2px_0px_#0b1a3d]">
              ★ 100% RETRO BRUTE FORCE ENGINE ★
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bungee leading-none text-white uppercase drop-shadow-[3px_3px_0px_#071e54]">
              HAFAL KANA DUA ARAH SECEPAT KILAT!
            </h2>
            
            <p className="font-heading font-extrabold text-sm sm:text-base text-[#ffd200] mt-2 leading-relaxed">
              Drill Hiragana & Katakana baris per baris. Latih dari Kana ke Romaji, dan sebaliknya dari Romaji ke Kana menggunakan On-Screen Arcade Keypad!
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mt-4">
              <button
                onClick={() => {
                  playKeyClickSound();
                  onSelectDirection('kana_to_romaji');
                  onSelectTab('brute-force');
                }}
                className="retro-btn retro-btn-yellow px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>MULAI BRUTE FORCE</span>
              </button>

              <button
                onClick={() => {
                  playKeyClickSound();
                  onSelectDirection('romaji_to_kana');
                  onSelectTab('brute-force');
                }}
                className="retro-btn retro-btn-red px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                <span>COBA REVERSE MODE ⚡</span>
              </button>

              <button
                onClick={() => {
                  playKeyClickSound();
                  onSelectTab('word-drill');
                }}
                className="retro-btn retro-btn-white px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#0c389c]" />
                <span>LATIHAN KATA (VOCAB)</span>
              </button>

              <button
                onClick={() => {
                  playKeyClickSound();
                  onSelectTab('writing-drill');
                }}
                className="retro-btn retro-btn-yellow px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2"
              >
                <PenTool className="w-4 h-4" />
                <span>LATIHAN MENULIS (WRITING) ✍️</span>
              </button>
            </div>
          </div>

          {/* Jet / Starburst Badge Mascot Visual */}
          <div className="flex flex-col items-center justify-center relative shrink-0">
            <Starburst variant="yellow" size="lg" rotation={6} className="shadow-lg">
              <span className="text-xs font-black uppercase text-[#d9261c] leading-tight">BARU!</span>
              <span className="text-lg font-bungee text-[#0b1a3d] leading-none">WRITING</span>
              <span className="text-sm font-bungee text-[#0c389c] leading-none">CANVAS ✍️</span>
            </Starburst>
          </div>
        </div>
      </div>

      {/* 2. FOUR HIGHLIGHT FEATURE CARDS (Nova Play Toy Showcase style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1 */}
        <div
          onClick={() => {
            playKeyClickSound();
            onSelectDirection('kana_to_romaji');
            onSelectTab('brute-force');
          }}
          className="retro-card p-3.5 bg-white cursor-pointer hover:border-[#0c389c] transition-all group"
        >
          <div className="bg-[#0c389c] text-white text-xs font-bungee px-2.5 py-1 rounded-md mb-2 flex items-center justify-between">
            <span>01 • BRUTE FORCE</span>
            <span className="text-[#ffd200]">★ TIERED</span>
          </div>
          <div className="h-20 bg-[#f6eedf] rounded-xl border-2 border-[#0b1a3d] flex items-center justify-center text-4xl font-kana font-black text-[#0c389c] group-hover:scale-105 transition-transform">
            あ・か・さ
          </div>
          <h4 className="font-bungee text-sm text-[#0b1a3d] mt-2 uppercase">
            Sistem Buka Baris
          </h4>
          <p className="text-[11px] font-bold text-gray-600 mt-0.5">
            Buka baris berikutnya setelah menguasai huruf sebelumnya 100%.
          </p>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => {
            playKeyClickSound();
            onSelectDirection('romaji_to_kana');
            onSelectTab('brute-force');
          }}
          className="retro-card p-3.5 bg-white cursor-pointer hover:border-[#d9261c] transition-all group"
        >
          <div className="bg-[#d9261c] text-white text-xs font-bungee px-2.5 py-1 rounded-md mb-2 flex items-center justify-between">
            <span>02 • REVERSE DRILL</span>
            <span className="text-[#ffd200]">⚡ KEYPAD</span>
          </div>
          <div className="h-20 bg-[#ffe4e6] rounded-xl border-2 border-[#0b1a3d] flex items-center justify-center text-3xl font-bungee text-[#d9261c] group-hover:scale-105 transition-transform">
            KA → [ か ]
          </div>
          <h4 className="font-bungee text-sm text-[#0b1a3d] mt-2 uppercase">
            Romaji ke Kana Keypad
          </h4>
          <p className="text-[11px] font-bold text-gray-600 mt-0.5">
            Soal memunculkan Romaji, kamu memilih Kana di papan ketik interaktif!
          </p>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => {
            playKeyClickSound();
            onSelectTab('word-drill');
          }}
          className="retro-card p-3.5 bg-white cursor-pointer hover:border-[#10b981] transition-all group"
        >
          <div className="bg-[#10b981] text-white text-xs font-bungee px-2.5 py-1 rounded-md mb-2 flex items-center justify-between">
            <span>03 • WORD DRILL</span>
            <span className="text-[#ffd200]">📚 VOCAB</span>
          </div>
          <div className="h-20 bg-[#d1fae5] rounded-xl border-2 border-[#0b1a3d] flex items-center justify-center text-3xl font-kana font-black text-[#047857] group-hover:scale-105 transition-transform">
            さくら 🌸
          </div>
          <h4 className="font-bungee text-sm text-[#0b1a3d] mt-2 uppercase">
            Kosakata & Reverse Kata
          </h4>
          <p className="text-[11px] font-bold text-gray-600 mt-0.5">
            Susun dan baca kosakata bahasa Jepang asli dengan audio pengucapan.
          </p>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => {
            playKeyClickSound();
            onSelectTab('writing-drill');
          }}
          className="retro-card p-3.5 bg-white cursor-pointer hover:border-[#ffd200] transition-all group"
        >
          <div className="bg-[#ffd200] text-[#0b1a3d] text-xs font-bungee px-2.5 py-1 rounded-md mb-2 flex items-center justify-between border border-[#0b1a3d]">
            <span>04 • WRITING DRILL</span>
            <span>✍️ KANVAS</span>
          </div>
          <div className="h-20 bg-[#fbf9f4] rounded-xl border-2 border-[#0b1a3d] flex items-center justify-center text-3xl font-kana font-black text-[#0b1a3d] group-hover:scale-105 transition-transform">
            ✍️ あ → 98%
          </div>
          <h4 className="font-bungee text-sm text-[#0b1a3d] mt-2 uppercase">
            Latihan Goresan & Jiplak
          </h4>
          <p className="text-[11px] font-bold text-gray-600 mt-0.5">
            Kanvas interaktif dengan grid kotak Jepang, mode bayangan, dan cek kemiripan otomatis.
          </p>
        </div>
      </div>
    </div>
  );
};
