import React, { useState } from 'react';
import { UserProgress } from '../types';
import { translations } from '../data/translations';
import { scienceTopics } from '../data/topics';
import { motion } from 'motion/react';
import { Star, Flame, Award, BookOpen, Volume2, VolumeX, HelpCircle, ArrowRight, Play, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HomeProps {
  progress: UserProgress;
  lang: 'en' | 'hi';
  onNavigate: (tab: string) => void;
  onAddXp: (xp: number) => void;
}

export default function Home({ progress, lang, onNavigate, onAddXp }: HomeProps) {
  const t = translations[lang];
  const [isSpeakingFact, setIsSpeakingFact] = useState(false);

  const dailyFacts = [
    { en: "Did you know? Sound travels 4 times faster in water than in air!", hi: "क्या आप जानते हैं? ध्वनि हवा की तुलना में पानी में ४ गुना तेजी से यात्रा करती है!" },
    { en: "Did you know? Plants look green because they absorb all colors of light except green!", hi: "क्या आप जानते हैं? पौधे हरे दिखाई देते हैं क्योंकि वे हरे रंग को छोड़कर प्रकाश के सभी रंगों को अवशोषित करते हैं!" },
    { en: "Did you know? One day on Venus is longer than one whole year on Earth!", hi: "क्या आप जानते हैं? शुक्र (Venus) का एक दिन पृथ्वी के पूरे एक वर्ष से भी लंबा होता है!" },
    { en: "Did you know? Human bones are about 5 times stronger than steel of the same density!", hi: "क्या आप जानते हैं? मानव हड्डियाँ समान घनत्व के स्टील से लगभग ५ गुना अधिक मजबूत होती हैं!" }
  ];

  // Daily index selector based on date
  const factIndex = new Date().getDate() % dailyFacts.length;
  const currentDailyFact = dailyFacts[factIndex];

  const handleSpeakFact = () => {
    if ('speechSynthesis' in window) {
      if (isSpeakingFact) {
        window.speechSynthesis.cancel();
        setIsSpeakingFact(false);
      } else {
        const text = lang === 'en' ? currentDailyFact.en : currentDailyFact.hi;
        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = window.speechSynthesis.getVoices();
        const voiceLang = lang === 'en' ? 'en-IN' : 'hi-IN';
        const matchingVoice = voices.find(v => v.lang.includes(voiceLang) || v.lang.startsWith(lang));
        if (matchingVoice) utterance.voice = matchingVoice;

        utterance.onstart = () => setIsSpeakingFact(true);
        utterance.onend = () => setIsSpeakingFact(false);
        utterance.onerror = () => setIsSpeakingFact(false);

        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const celebrateClick = () => {
    onAddXp(5);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-12">
      
      {/* HERO SECTION WITH FLOATING VECTORS */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 rounded-[36px] border-4 border-white/30 p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        
        {/* Floating background vectors */}
        <div className="absolute top-6 left-6 text-3xl opacity-20 animate-float">🪐</div>
        <div className="absolute bottom-6 right-8 text-3xl opacity-20 animate-float-slow">🚀</div>
        <div className="absolute top-10 right-12 text-2xl opacity-15 animate-pulse">⚛️</div>
        <div className="absolute bottom-10 left-10 text-2xl opacity-20 animate-bounce">🌱</div>
 
        <div className="space-y-4 text-center md:text-left relative z-10 max-w-lg">
          <span className="bg-white/20 border border-white/30 text-white font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            🚀 {lang === 'en' ? 'Adventures in Science' : 'विज्ञान का रोमांच'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white drop-shadow">
            🔬 {lang === 'en' ? 'Tiny Scientists' : 'नन्हें वैज्ञानिक'}
          </h1>
          <p className="text-sm md:text-base font-extrabold text-blue-50 leading-relaxed">
            {lang === 'en'
              ? "Welcome, Little Minds! Dive into interactive virtual simulations, games, and voice-guided stories that make science extremely fun!"
              : "आपका स्वागत है, नन्हें दिमागों! मनमोहक सिमुलेशन, विज्ञान के खेल और कहानियों के साथ खेल-खेल में विज्ञान सीखें!"}
          </p>
 
          <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
            <button
              onClick={() => onNavigate('lessons')}
              className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-black text-sm rounded-2xl border-b-4 border-yellow-600 transition-all active:translate-y-0.5 active:border-b-2 btn-bouncy shadow-md"
            >
              🚀 {t.startLearning}
            </button>
            <button
              onClick={() => onNavigate('simulations')}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-blue-700 font-black text-sm rounded-2xl border-b-4 border-slate-200 transition-all active:translate-y-0.5 active:border-b-2 btn-bouncy shadow-md"
            >
              🧪 {lang === 'en' ? 'Interactive Simulations' : 'वर्चुअल प्रयोगशाला'}
            </button>
            <button
              onClick={() => onNavigate('space_mission')}
              className="px-6 py-3.5 bg-purple-500 hover:bg-purple-600 text-white font-black text-sm rounded-2xl border-b-4 border-purple-700 transition-all active:translate-y-0.5 active:border-b-2 btn-bouncy shadow-md animate-pulse"
            >
              🌌 {lang === 'en' ? 'Space Mission' : 'अंतरिक्ष मिशन'}
            </button>
          </div>
        </div>
 
        {/* Mascot Robot Hero visual */}
        <div className="w-48 h-48 md:w-56 md:h-56 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 shadow-inner relative shrink-0">
          <div className="text-8xl md:text-9xl animate-float">🤖</div>
          <div className="absolute -top-3 -right-3 bg-yellow-400 text-slate-900 border-2 border-white font-black text-xs px-3 py-1.5 rounded-xl shadow-lg rotate-12">
            Hi, I'm SciBuddy!
          </div>
        </div>
 
      </div>
 
      {/* MID PANEL: DAILY FACT & QUESTION OF THE DAY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Daily Fact card */}
        <div className="bg-amber-50 rounded-[32px] p-6 border-b-8 border-r-4 border-amber-200/80 flex flex-col justify-between space-y-5 shadow-lg relative pt-8">
          <span className="absolute -top-3.5 left-6 bg-amber-400 text-white text-[10px] font-black px-3.5 py-1 rounded-full border-2 border-white shadow-sm">
            📅 {t.dailyFact}
          </span>
          <div className="space-y-2">
            <p className="text-base md:text-lg font-black text-amber-950 leading-snug">
              {lang === 'en' ? currentDailyFact.en : currentDailyFact.hi}
            </p>
          </div>
 
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handleSpeakFact}
              className={`px-4 py-2 rounded-xl font-black text-xs border-b-4 flex items-center gap-1.5 btn-bouncy transition-all ${
                isSpeakingFact ? 'bg-red-500 text-white border-red-700' : 'bg-yellow-400 text-blue-950 border-yellow-600 hover:bg-yellow-500'
              }`}
            >
              {isSpeakingFact ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeakingFact ? (lang === 'en' ? 'Stop Voice' : 'आवाज रोकें') : (lang === 'en' ? 'Listen Aloud' : 'सुनें')}</span>
            </button>
            <span className="text-xs text-amber-600/70 font-bold">Updated Daily</span>
          </div>
        </div>
 
        {/* Question of the Day card */}
        <div className="bg-indigo-50/80 rounded-[32px] p-6 border-b-8 border-r-4 border-indigo-200/80 flex flex-col justify-between space-y-5 shadow-lg relative pt-8">
          <span className="absolute -top-3.5 left-6 bg-indigo-500 text-white text-[10px] font-black px-3.5 py-1 rounded-full border-2 border-white shadow-sm">
            ❓ {lang === 'en' ? 'Daily Science Sparker' : 'दैनिक विज्ञान चिंगारी'}
          </span>
          <div className="space-y-2">
            <h4 className="text-base md:text-lg font-black text-indigo-950 leading-snug">
              {lang === 'en' ? "How do seeds breathe when buried under heavy mud?" : "मिट्टी के नीचे दबे होने पर बीज सांस कैसे लेते हैं?"}
            </h4>
            <p className="text-xs text-indigo-600/80 font-bold">
              {lang === 'en' ? "Tap to unlock SciBuddy's magical detailed explanation!" : "साई-बडी का जादुई जवाब सुनने के लिए टैप करें!"}
            </p>
          </div>
 
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => {
                onNavigate('chat');
                onAddXp(5);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800 font-black text-xs rounded-xl flex items-center gap-1 btn-bouncy shadow-sm"
            >
              <span>🔬 Ask SciBuddy AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-indigo-600/70 font-bold">Earn +5 XP</span>
          </div>
        </div>
 
      </div>
 
      {/* FEATURED TOPICS SELECTION CAROUSEL */}
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black text-blue-900">
            {lang === 'en' ? 'Featured Expedition Topics' : 'मुख्य वैज्ञानिक विषय'}
          </h3>
          <button
            onClick={() => onNavigate('lessons')}
            className="text-sm font-black uppercase tracking-wider text-blue-600 hover:text-blue-800 hover:underline"
          >
            {lang === 'en' ? 'See All Topics ➔' : 'सभी देखें ➔'}
          </button>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {scienceTopics.slice(0, 3).map((topic, index) => {
            const topicGradients = [
              'from-indigo-500 to-blue-700',
              'from-cyan-400 to-blue-500',
              'from-green-400 to-emerald-600'
            ];
            const currentGradient = topicGradients[index % topicGradients.length];
            return (
              <div
                key={topic.id}
                onClick={() => onNavigate('lessons')}
                className="bg-white rounded-[32px] p-2 border-b-8 border-r-4 border-slate-200/80 hover:border-blue-300 transform transition-all hover:-translate-y-1 cursor-pointer select-none group shadow-md"
              >
                <div className={`h-full w-full rounded-[26px] bg-gradient-to-br ${currentGradient} p-6 flex flex-col justify-between min-h-[190px]`}>
                  <div className="text-4xl group-hover:scale-115 transition-transform duration-300">{topic.icon}</div>
                  <div className="mt-4">
                    <h4 className="text-white font-black text-lg leading-tight">
                      {lang === 'en' ? topic.titleEn : topic.titleHi}
                    </h4>
                    <p className="text-blue-100/90 text-xs font-medium mt-1 line-clamp-2">
                      {lang === 'en' ? topic.summaryEn : topic.summaryHi}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACCENT CHARACTER CAPTIONS / TESTIMONIALS */}
      <div className="bg-amber-50 rounded-[32px] border-4 border-amber-200/50 p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-black text-amber-900 text-center">
          {lang === 'en' ? 'Explorer Reviews' : 'नन्हें वैज्ञानिकों के विचार'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-white rounded-2xl border-2 border-amber-100 shadow-sm space-y-2">
            <p className="text-xs text-amber-950 font-bold italic leading-relaxed">
              {lang === 'en'
                ? "“I loved mixing potions in the States of Matter simulation! SciBuddy helped me pass my science test with 100% score!”"
                : "“मुझे पदार्थ की अवस्थाओं के सिमुलेशन में प्रयोग करना बहुत पसंद आया! साई-बडी की मदद से मैंने विज्ञान की परीक्षा में १००% अंक प्राप्त किए!”"}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-2xl">👧</span>
              <div>
                <h5 className="font-extrabold text-xs text-amber-900">Meera Patel</h5>
                <span className="text-[10px] text-slate-400 font-bold">Class 5 Student, Gujarat</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border-2 border-amber-100 shadow-sm space-y-2">
            <p className="text-xs text-amber-950 font-bold italic leading-relaxed">
              {lang === 'en'
                ? "“This is highly useful for government schools! The Hindi toggle and speech readers help students learn at their own comfortable pace.”"
                : "“सरकारी स्कूलों के बच्चों के लिए यह बहुत उपयोगी है! हिंदी अनुवाद और आवाज की सुविधा बच्चों को आसानी से सीखने में मदद करती है।”"}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-2xl">👨‍🏫</span>
              <div>
                <h5 className="font-extrabold text-xs text-amber-900">Shri R. K. Mishra</h5>
                <span className="text-[10px] text-slate-400 font-bold">Science Teacher, Uttar Pradesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
