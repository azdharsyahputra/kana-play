import React from 'react';
import { ShieldCheck, RefreshCw, Zap, BookOpen, Sparkles } from 'lucide-react';

export const RetroFooter: React.FC = () => {
  return (
    <footer className="w-full mt-10 space-y-4 select-none">
      {/* 1. WHY DRILL WITH KANA PLAY BANNER */}
      <div className="retro-card-blue p-5 sm:p-7">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-white/20">
            <Sparkles className="w-5 h-5 text-[#ffd200]" />
            <h3 className="font-bungee text-lg sm:text-xl text-white uppercase tracking-wider">
              KENAPA LATIHAN DENGAN KANA PLAY?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#071e54]/80 p-3.5 rounded-xl border border-white/20">
              <div className="w-8 h-8 rounded-lg bg-[#ffd200] text-[#0b1a3d] flex items-center justify-center font-black mb-2">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <h5 className="font-bungee text-xs text-[#ffd200] uppercase">
                Brute Force Repetition
              </h5>
              <p className="text-[11px] font-heading font-medium text-white/80 mt-1 leading-normal">
                Metode repetisi intensif baris per baris sampai hafal permanen di luar kepala.
              </p>
            </div>

            <div className="bg-[#071e54]/80 p-3.5 rounded-xl border border-white/20">
              <div className="w-8 h-8 rounded-lg bg-[#d9261c] text-white flex items-center justify-center font-black mb-2">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h5 className="font-bungee text-xs text-[#ffd200] uppercase">
                Reverse Keypad Mode
              </h5>
              <p className="text-[11px] font-heading font-medium text-white/80 mt-1 leading-normal">
                Latihan 2 arah: lihat Romaji, pilih huruf Kana di papan ketik interaktif langsung.
              </p>
            </div>

            <div className="bg-[#071e54]/80 p-3.5 rounded-xl border border-white/20">
              <div className="w-8 h-8 rounded-lg bg-[#10b981] text-white flex items-center justify-center font-black mb-2">
                <BookOpen className="w-4 h-4" />
              </div>
              <h5 className="font-bungee text-xs text-[#ffd200] uppercase">
                Word & Vocab Drill
              </h5>
              <p className="text-[11px] font-heading font-medium text-white/80 mt-1 leading-normal">
                Bukan cuma huruf terisolasi, tapi juga ratusan kata nyata bahasa Jepang.
              </p>
            </div>

            <div className="bg-[#071e54]/80 p-3.5 rounded-xl border border-white/20">
              <div className="w-8 h-8 rounded-lg bg-[#ffffff] text-[#0c389c] flex items-center justify-center font-black mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h5 className="font-bungee text-xs text-[#ffd200] uppercase">
                100% Offline & Free
              </h5>
              <p className="text-[11px] font-heading font-medium text-white/80 mt-1 leading-normal">
                Web Audio synth terpasang otomatis, tersimpan lokal, bebas lag dan iklan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM COPYRIGHT BAR */}
      <div className="bg-[#0b1a3d] text-white py-4 px-4 text-center text-xs font-heading font-extrabold border-t-4 border-black/30">
        <p className="flex items-center justify-center gap-1.5 flex-wrap">
          <span>KANA PLAY ★ ULTIMATE JAPANESE DRILL</span>
          <span className="text-gray-400">•</span>
          <span className="text-[#ffd200]">Inspirasi: vedxyz/kana & Nova Play Retro Toy Catalogue</span>
        </p>
      </div>
    </footer>
  );
};
