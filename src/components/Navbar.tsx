import React, { useState } from 'react';
import { UserProgress } from '../types';
import { translations } from '../data/translations';
import { Sparkles, Star, Flame, Award, Accessibility, Volume2, Globe } from 'lucide-react';

interface NavbarProps {
  progress: UserProgress;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  dyslexiaMode: boolean;
  setDyslexiaMode: (mode: boolean) => void;
  highContrast: boolean;
  setHighContrast: (mode: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Navbar({
  progress,
  lang,
  setLang,
  dyslexiaMode,
  setDyslexiaMode,
  highContrast,
  setHighContrast,
  soundEnabled,
  setSoundEnabled,
  currentTab,
  setCurrentTab,
}: NavbarProps) {
  const [showAccessModal, setShowAccessModal] = useState(false);
  const t = translations[lang];

  // Map of tabs
  const tabs = [
    { id: 'lessons', label: t.lessons, icon: '📚', color: 'text-indigo-600' },
    { id: 'lab', label: t.lab, icon: '🧪', color: 'text-amber-500' },
    { id: 'space_mission', label: lang === 'en' ? 'Space Mission' : 'अंतरिक्ष मिशन', icon: '🚀', color: 'text-purple-600' },
    { id: 'games', label: t.games, icon: '🎮', color: 'text-emerald-500' },
    { id: 'ai_tutor', label: t.aiTutor, icon: '🤖', color: 'text-rose-500' },
    { id: 'rewards', label: t.rewards, icon: '⭐', color: 'text-yellow-500' },
    { id: 'dashboard', label: t.dashboard, icon: '📊', color: 'text-sky-500' },
  ];

  return (
    <header className="w-full bg-white border-b-4 border-blue-200 sticky top-0 z-50 px-4 md:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* LOGO AREA */}
        <div 
          onClick={() => setCurrentTab('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center border-b-4 border-yellow-600 shadow-sm group-hover:rotate-12 transition-transform">
            <span className="text-2xl">🔬</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-blue-600 leading-none tracking-tight flex items-center gap-1">
              {lang === 'en' ? 'TINY SCIENTISTS' : 'नन्हें वैज्ञानिक'}
              <span className="text-orange-500 animate-pulse text-lg">✦</span>
            </h1>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">
              {lang === 'en' ? 'Little Minds • Big Discoveries' : 'छोटे दिमाग • बड़ी खोजें'}
            </p>
          </div>
        </div>

        {/* STATS WIDGETS */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center bg-blue-50/50 p-1.5 rounded-2xl border-2 border-blue-100">
          {/* Level */}
          <div className="flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-black text-xs md:text-sm shadow-sm">
            <Award className="w-3.5 h-3.5 text-white" />
            <span>Lvl {progress.level}</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 px-3.5 py-1 bg-purple-600 text-white rounded-full font-black text-xs md:text-sm shadow-sm">
            <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            <span>{progress.xp} XP</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3.5 py-1 bg-yellow-400 text-blue-950 rounded-full font-black text-xs md:text-sm border-b-2 border-yellow-600 shadow-sm">
            <span>🪙</span>
            <span>{progress.coins}</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3.5 py-1 bg-orange-400 text-white rounded-full font-black text-xs md:text-sm border-b-2 border-orange-600 shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-white text-white animate-bounce" />
            <span>{progress.streak} {lang === 'en' ? 'Days' : 'दिन'}</span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 shadow-inner">
            <button
              onClick={() => setLang('en')}
              className={`px-3.5 py-1 rounded-full text-xs font-black transition-all ${
                lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3.5 py-1 rounded-full text-xs font-black transition-all ${
                lang === 'hi' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Accessibility Toggle button */}
          <button
            onClick={() => setShowAccessModal(!showAccessModal)}
            className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl border-b-4 border-blue-700 hover:border-blue-800 transition-all btn-bouncy shadow-sm flex items-center justify-center"
            title={t.settings}
          >
            <Accessibility className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* LOWER TAB NAVIGATION */}
      <div className="max-w-7xl mx-auto mt-4.5 border-t-2 border-slate-100 pt-3 flex justify-center overflow-x-auto gap-2.5 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-xs md:text-sm font-extrabold whitespace-nowrap transition-all border-b-4 ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-800 shadow-md scale-105'
                  : 'bg-white hover:bg-blue-50 text-blue-700 border border-blue-100 hover:border-blue-200 shadow-sm'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ACCESSIBILITY PREFERENCES FLOATING MODAL */}
      {showAccessModal && (
        <div className="absolute right-4 md:right-12 top-full mt-2.5 w-72 bg-white rounded-3xl border-4 border-blue-100 p-5 shadow-2xl z-50">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2 mb-3">
            <h3 className="font-extrabold text-blue-600 flex items-center gap-1.5">
              <Accessibility className="w-5 h-5 text-blue-500" />
              <span>{t.settings}</span>
            </h3>
            <button 
              onClick={() => setShowAccessModal(false)}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              ✖
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Dyslexia Mode Switch */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block">
                {t.dyslexiaMode}
              </label>
              <button
                onClick={() => setDyslexiaMode(!dyslexiaMode)}
                className={`w-12 h-6 rounded-full p-0.5 border-2 border-slate-300 transition-colors ${
                  dyslexiaMode ? 'bg-indigo-500 border-indigo-600' : 'bg-slate-200'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  dyslexiaMode ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* High Contrast Mode Switch */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block">
                {t.highContrast}
              </label>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-12 h-6 rounded-full p-0.5 border-2 border-slate-300 transition-colors ${
                  highContrast ? 'bg-amber-500 border-amber-600' : 'bg-slate-200'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Audio narration Switch */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block">
                {t.textToSpeech}
              </label>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-6 rounded-full p-0.5 border-2 border-slate-300 transition-colors ${
                  soundEnabled ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-200'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 text-[10px] text-amber-800 font-bold">
              💡 {lang === 'en' ? 'Tip: Audio Speech is generated directly using your browser\'s voices!' : 'सुझाव: ऑडियो सीधे आपके ब्राउज़र की आवाज़ों से उत्पन्न होता है!'}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
