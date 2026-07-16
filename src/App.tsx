import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LessonsZone from './components/LessonsZone';
import SimulationsZone from './components/SimulationsZone';
import SpaceMission from './components/SpaceMission';
import GamesZone from './components/GamesZone';
import RewardsZone from './components/RewardsZone';
import SciBuddyChat from './components/SciBuddyChat';
import Dashboard from './components/Dashboard';
import { UserProgress } from './types';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'lessons' | 'lab' | 'space_mission' | 'games' | 'rewards' | 'ai_tutor' | 'dashboard'>('home');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  
  // Accessibility states
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load state from LocalStorage on mount
  const [progress, setProgress] = useState<UserProgress>(() => {
    const defaultProgress: UserProgress = {
      name: 'Pranav Kumar',
      grade: '5',
      xp: 0,
      level: 1,
      coins: 0,
      streak: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessons: [],
      quizScores: {},
      badges: [],
      unlockedItems: [],
      timeSpent: 12,
    };

    const saved = localStorage.getItem('tiny_scientists_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultProgress,
          ...parsed,
          completedLessons: parsed.completedLessons || [],
          quizScores: parsed.quizScores || {},
          badges: parsed.badges || [],
          unlockedItems: parsed.unlockedItems || [],
        };
      } catch (e) {
        console.error("Error parsing saved progress", e);
      }
    }
    return defaultProgress;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tiny_scientists_progress', JSON.stringify(progress));
  }, [progress]);

  // Track time spent periodically (simulate real session tracking)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 60000); // add 1 minute every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Level up alert engine
  const addXp = (amount: number) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      if (newLevel > prev.level) {
        // Trigger level up celebration!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
        alert(lang === 'en' 
          ? `🌟 LEVEL UP! You reached Level ${newLevel}! Here is +5 Bonus Coins!` 
          : `🌟 स्तर बढ़ गया! आप स्तर ${newLevel} पर पहुंच गए हैं! आपको +5 बोनस सिक्के मिले!`
        );
        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          coins: prev.coins + 5
        };
      }

      return {
        ...prev,
        xp: newXp
      };
    });
  };

  const addCoins = (amount: number) => {
    setProgress(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  };

  const handleLessonComplete = (topicId: string, quizScore: number) => {
    setProgress(prev => {
      const completedList = prev.completedLessons.includes(topicId)
        ? prev.completedLessons
        : [...prev.completedLessons, topicId];

      const updatedScores = {
        ...prev.quizScores,
        [topicId]: Math.max(prev.quizScores[topicId] || 0, quizScore)
      };

      // Add special badge for scoring 100%
      const badgesList = [...(prev.badges || [])];
      if (quizScore === 100) {
        const badgeId = `${topicId}_expert`;
        if (!badgesList.includes(badgeId)) {
          badgesList.push(badgeId);
        }
      }

      return {
        ...prev,
        completedLessons: completedList,
        quizScores: updatedScores,
        badges: badgesList
      };
    });
  };

  const handleUnlockItem = (itemId: string, price: number) => {
    setProgress(prev => ({
      ...prev,
      coins: prev.coins - price,
      unlockedItems: [...prev.unlockedItems, itemId]
    }));
  };

  const handleUnlockBadge = (badgeId: string) => {
    setProgress(prev => {
      const badgesList = [...(prev.badges || [])];
      if (!badgesList.includes(badgeId)) {
        badgesList.push(badgeId);
      }
      return {
        ...prev,
        badges: badgesList
      };
    });
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'chat') {
      setActiveTab('ai_tutor');
    } else if (tab === 'simulations' || tab === 'solar_system' || tab === 'space') {
      setActiveTab('space_mission');
    } else {
      setActiveTab(tab as any);
    }
  };

  const handleResetProgress = () => {
    setProgress({
      name: 'Pranav Kumar',
      grade: '5',
      xp: 0,
      level: 1,
      coins: 0,
      streak: 1,
      completedLessons: [],
      quizScores: {},
      unlockedItems: [],
      timeSpent: 0,
      badges: []
    });
    setActiveTab('home');
  };

  return (
    <div 
      className={`min-h-screen text-slate-800 ${
        dyslexicFont ? 'font-dyslexic' : 'font-sans'
      } ${
        highContrast ? 'high-contrast' : ''
      }`}
      style={{
        background: highContrast ? '#000000' : 'radial-gradient(circle at top right, #E0F2FE, #F0F9FF)',
        backgroundColor: highContrast ? '#000000' : '#F0F9FF'
      }}
    >
      
      {/* Dynamic Navbar */}
      <Navbar
        progress={progress}
        lang={lang}
        setLang={setLang}
        dyslexiaMode={dyslexicFont}
        setDyslexiaMode={setDyslexicFont}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        currentTab={activeTab}
        setCurrentTab={setActiveTab}
      />

      {/* Main Container spacing */}
      <main className="py-6 px-4 md:px-8 max-w-7xl mx-auto pb-24">
        {activeTab === 'home' && (
          <Home
            progress={progress}
            lang={lang}
            onNavigate={handleNavigate}
            onAddXp={addXp}
          />
        )}

        {activeTab === 'lessons' && (
          <LessonsZone
            progress={progress}
            lang={lang}
            onAddXp={addXp}
            onAddCoins={addCoins}
            onLessonComplete={handleLessonComplete}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'lab' && (
          <SimulationsZone
            lang={lang}
            onAddXp={addXp}
            onAddCoins={addCoins}
          />
        )}

        {activeTab === 'space_mission' && (
          <SpaceMission
            progress={progress}
            lang={lang}
            onAddXp={addXp}
            onAddCoins={addCoins}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeTab === 'games' && (
          <GamesZone
            lang={lang}
            onAddXp={addXp}
            onAddCoins={addCoins}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsZone
            progress={progress}
            lang={lang}
            onAddCoins={addCoins}
            onUnlockItem={handleUnlockItem}
          />
        )}

        {activeTab === 'ai_tutor' && (
          <SciBuddyChat
            progress={progress}
            lang={lang}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            progress={progress}
            lang={lang}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Footer Branding line */}
      <footer className="border-t border-slate-200 py-6 bg-white text-center text-xs font-bold text-slate-400">
        <p>© 2026 Tiny Scientists. Made for Government School Learners with Love 🔬🤖</p>
      </footer>
    </div>
  );
}
