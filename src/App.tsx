import React, { useState, useEffect } from 'react';
import { AppTab, DrillDirection, KanaScript, UserStats } from './types';
import { loadUserStats, resetAllUserProgress, saveUserStats } from './utils/storage';
import { Navbar } from './components/Navbar';
import { RetroSidebar } from './components/RetroSidebar';
import { RetroFeatureShowcase } from './components/RetroFeatureShowcase';
import { BruteForceTrainer } from './components/BruteForceTrainer';
import { FreeTrainer } from './components/FreeTrainer';
import { WordTrainer } from './components/WordTrainer';
import { WritingTrainer } from './components/WritingTrainer';
import { KanaMatrix } from './components/KanaMatrix';
import { CheatSheet } from './components/CheatSheet';
import { RetroFooter } from './components/RetroFooter';

export function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [script, setScript] = useState<KanaScript>('hiragana');
  const [direction, setDirection] = useState<DrillDirection>('kana_to_romaji');
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [selectedLevel, setSelectedLevel] = useState<number>(() => {
    const loaded = loadUserStats();
    return loaded.bruteForceLevel || 1;
  });

  // New page feel on every tab switch — matters on phones where the drill was scrolled
  const selectTab = (tab: AppTab) => {
    setCurrentTab(tab);
    window.scrollTo(0, 0);
  };

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
        onSelectTab={selectTab}
        stats={stats}
        onResetStats={handleResetStats}
      />

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1">
        
        {/* LANDING: simple intro, drills open from the navbar / CTA buttons */}
        {currentTab === 'home' ? (
          <RetroFeatureShowcase
            onSelectTab={selectTab}
            onSelectDirection={setDirection}
          />
        ) : (
        <div className="flex flex-col lg:flex-row items-start gap-6">
          
          {/* LEFT SIDEBAR (Category & Level Selector) */}
          <RetroSidebar
            currentTab={currentTab}
            onSelectTab={selectTab}
            script={script}
            onSelectScript={setScript}
            direction={direction}
            onSelectDirection={setDirection}
            stats={stats}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
          />

          {/* MAIN DRILL WORKSPACE (first on mobile, settings sidebar below) */}
          <div className="flex-1 w-full min-w-0 order-first lg:order-none">
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

            {currentTab === 'writing-drill' && (
              <WritingTrainer
                stats={stats}
                onUpdateStats={handleUpdateStats}
                script={script}
                onSelectScript={setScript}
                selectedLevel={selectedLevel}
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
        )}
      </main>

      {/* 4. RETRO FOOTER */}
      <RetroFooter />
    </div>
  );
}

export default App;
