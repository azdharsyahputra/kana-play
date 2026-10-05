import React, { useState, useEffect } from 'react';
import { AppTab, DrillDirection, KanaScript, UserStats } from './types';
import { loadUserStats, resetAllUserProgress, saveUserStats } from './utils/storage';
import { Navbar } from './components/Navbar';
import { RetroSidebar } from './components/RetroSidebar';
import { RetroFeatureShowcase } from './components/RetroFeatureShowcase';
import { BruteForceTrainer } from './components/BruteForceTrainer';
import { FreeTrainer } from './components/FreeTrainer';
import { WordTrainer } from './components/WordTrainer';
import { KanaMatrix } from './components/KanaMatrix';
import { CheatSheet } from './components/CheatSheet';
import { RetroFooter } from './components/RetroFooter';

export function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('brute-force');
  const [script, setScript] = useState<KanaScript>('hiragana');
  const [direction, setDirection] = useState<DrillDirection>('kana_to_romaji');
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [selectedLevel, setSelectedLevel] = useState<number>(() => {
    const loaded = loadUserStats();
    return loaded.bruteForceLevel || 1;
  });

  // Sync state if stats change
  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
    saveUserStats(newStats);
  };

  const handleResetStats = () => {
    const fresh = resetAllUserProgress();
    setStats(fresh);
    setSelectedLevel(1);
  };

  return (
    <div className="min-h-screen bg-[#f6eedf] flex flex-col font-sans text-[#0d1629]">
      {/* 1. TOP NAVBAR & STATS TICKER */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        stats={stats}
        onResetStats={handleResetStats}
      />

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 flex-1">
        
        {/* HERO FEATURE SHOWCASE BANNER */}
        <RetroFeatureShowcase
          onSelectTab={setCurrentTab}
          onSelectDirection={setDirection}
        />

        {/* 3. SIDEBAR + ACTIVE TAB DRILL WORKSPACE */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          
          {/* LEFT SIDEBAR (Category & Level Selector) */}
          <RetroSidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            script={script}
            onSelectScript={setScript}
            direction={direction}
            onSelectDirection={setDirection}
            stats={stats}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
          />

          {/* MAIN DRILL WORKSPACE */}
          <div className="flex-1 w-full min-w-0">
            {currentTab === 'brute-force' && (
              <BruteForceTrainer
                script={script}
                direction={direction}
                stats={stats}
                onUpdateStats={handleUpdateStats}
                selectedLevel={selectedLevel}
                onSelectLevel={setSelectedLevel}
              />
            )}

            {currentTab === 'free-drill' && (
              <FreeTrainer
                script={script}
                direction={direction}
                stats={stats}
                onUpdateStats={handleUpdateStats}
              />
            )}

            {currentTab === 'word-drill' && (
              <WordTrainer
                stats={stats}
                onUpdateStats={handleUpdateStats}
                direction={direction}
                onSelectDirection={setDirection}
              />
            )}

            {currentTab === 'matrix' && (
              <KanaMatrix stats={stats} />
            )}

            {currentTab === 'reference' && (
              <CheatSheet />
            )}
          </div>
        </div>
      </main>

      {/* 4. RETRO FOOTER */}
      <RetroFooter />
    </div>
  );
}

export default App;
