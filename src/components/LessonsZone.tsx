import React, { useState, useEffect } from 'react';
import { UserProgress, ScienceTopic } from '../types';
import { translations } from '../data/translations';
import { scienceTopics } from '../data/topics';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, ChevronRight, CheckCircle2, Volume2, VolumeX, ArrowLeft, 
  Lightbulb, Play, Pause, RotateCcw, HelpCircle, Sparkles, Trophy, 
  Gamepad2, Flame, Heart, Zap, RefreshCw, Star, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonsZoneProps {
  progress: UserProgress;
  lang: 'en' | 'hi';
  onAddXp: (xp: number) => void;
  onAddCoins: (coins: number) => void;
  onLessonComplete: (topicId: string, quizScore: number) => void;
  soundEnabled: boolean;
}

export default function LessonsZone({
  progress,
  lang,
  onAddXp,
  onAddCoins,
  onLessonComplete,
  soundEnabled
}: LessonsZoneProps) {
  const t = translations[lang];

  // Selected topic & active lesson step:
  // 0: Story, 1: Animation, 2: Experiment (Interaction), 3: Mini Game, 4: Quiz, 5: Reward
  const [selectedTopic, setSelectedTopic] = useState<ScienceTopic | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Voice speech states
  const [speechState, setSpeechState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Mini simulation interaction states inside lessons (Step 2)
  const [solarClickedPlanet, setSolarClickedPlanet] = useState<any | null>(null);
  const [plantGrowthStage, setPlantGrowthStage] = useState<number>(0); // 0: seed, 1: sprout, 2: flower
  const [waterCloudHeight, setWaterCloudHeight] = useState<number>(50); // cloud height representation
  const [humanBeats, setHumanBeats] = useState<boolean>(true);
  const [electricityConnected, setElectricityConnected] = useState<boolean>(false);
  const [magnetPolarity, setMagnetPolarity] = useState<'attract' | 'repel'>('attract');

  // Topic Mini Game States (Step 3)
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [gameFeedback, setGameFeedback] = useState<string>('');

  // Specific mini game states:
  // Solar: Ordering closest planets
  const [solarOrder, setSolarOrder] = useState<string[]>([]);
  // Water cycle: matching vocabulary definition
  const [waterMatchSelection, setWaterMatchSelection] = useState<string | null>(null);
  const [waterMatchedCount, setWaterMatchedCount] = useState<number>(0);
  // Plant growth: catching food ingredients
  const [photosynthesisCaught, setPhotosynthesisCaught] = useState<string[]>([]);
  // Human body: match organ with correct function
  const [humanSelectedOrgan, setHumanSelectedOrgan] = useState<string | null>(null);
  // Electricity: conductor/insulator categorization
  const [electricityConductSorted, setElectricityConductSorted] = useState<{ [key: string]: 'conductor' | 'insulator' | null }>({});
  // Magnet: sticking materials to magnet
  const [magnetStuckMaterials, setMagnetStuckMaterials] = useState<string[]>([]);

  // Quiz states (Step 4)
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Reset states when topic changes
  useEffect(() => {
    if (selectedTopic) {
      setActiveStep(0);
      setPlantGrowthStage(0);
      setElectricityConnected(false);
      setSolarClickedPlanet(null);
      setCurrentQuizIndex(0);
      setSelectedAnswerIdx(null);
      setShowExplanation(false);
      setCorrectAnswersCount(0);
      setQuizFinished(false);

      // Reset Mini-Games
      setGameScore(0);
      setGameWon(false);
      setGameFeedback('');
      setSolarOrder([]);
      setWaterMatchSelection(null);
      setWaterMatchedCount(0);
      setPhotosynthesisCaught([]);
      setHumanSelectedOrgan(null);
      setElectricityConductSorted({});
      setMagnetStuckMaterials([]);
    }
    // Cancel any speech synthesis on exit
    handleStopSpeech();
  }, [selectedTopic]);

  const celebrate = () => {
    if (soundEnabled) {
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav');
        audio.volume = 0.25;
        audio.play().catch(() => {});
      } catch (e) {}
    }
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  const playSuccessSound = () => {
    if (soundEnabled) {
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-84.wav');
        audio.volume = 0.2;
        audio.play().catch(() => {});
      } catch (e) {}
    }
  };

  // Browser speech synthesis controls
  const handlePlaySpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const cleaned = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleaned);
      const voices = window.speechSynthesis.getVoices();
      
      // Look for Indian accent voices for better localized clarity
      const voiceLang = lang === 'en' ? 'en-IN' : 'hi-IN';
      const matchingVoice = voices.find(v => v.lang.includes(voiceLang) || v.lang.startsWith(lang));
      
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      
      utterance.onstart = () => {
        setSpeechState('playing');
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        setSpeechState('idle');
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setSpeechState('idle');
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePauseSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setSpeechState('paused');
    }
  };

  const handleResumeSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setSpeechState('playing');
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeechState('idle');
      setIsSpeaking(false);
    }
  };

  // Trigger speech read out for current step
  const readCurrentStepAloud = () => {
    if (!selectedTopic) return;
    let textToSpeak = "";
    if (activeStep === 0) {
      textToSpeak = lang === 'en' ? selectedTopic.lesson.storyEn : selectedTopic.lesson.storyHi;
    } else if (activeStep === 1) {
      textToSpeak = lang === 'en' 
        ? `Watch this magical science animation of the ${selectedTopic.titleEn}!` 
        : `इस ${selectedTopic.titleHi} के जादुई विज्ञान एनीमेशन को देखें!`;
    } else if (activeStep === 2) {
      textToSpeak = lang === 'en' 
        ? `Let's perform a virtual hands-on science experiment in our lab!` 
        : `आइए हमारी प्रयोगशाला में एक वर्चुअल व्यावहारिक विज्ञान प्रयोग करें!`;
    } else if (activeStep === 3) {
      textToSpeak = lang === 'en' 
        ? `Time for the Mini Game challenge! Win the game to unlock points!` 
        : `मिनी गेम चुनौती का समय! अंक अनलॉक करने के लिए गेम जीतें!`;
    }
    handlePlaySpeech(textToSpeak);
  };

  // Step names translation helper
  const getStepName = (stepIdx: number) => {
    const stepsEn = ['📖 Story', '🎬 Animation', '🧪 Interaction', '🎮 Mini Game', '🧠 Quiz', '🏆 Reward'];
    const stepsHi = ['📖 कहानी', '🎬 एनीमेशन', '🧪 प्रयोग', '🎮 मिनी गेम', '🧠 क्विज़', '🏆 पुरस्कार'];
    return lang === 'en' ? stepsEn[stepIdx] : stepsHi[stepIdx];
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6" id="lessons_zone_container">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: TOPICS GRID SELECTOR */}
        {!selectedTopic ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Grid Header */}
            <div className="text-center space-y-2">
              <span className="text-5xl inline-block animate-bounce" id="lesson_emoji">📚</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                {lang === 'en' ? 'Choose Science Expedition' : 'विज्ञान अभियान चुनें'}
              </h2>
              <p className="text-slate-600 font-bold max-w-xl mx-auto text-sm md:text-base">
                {lang === 'en' 
                  ? 'Explore beautiful modules filled with games, animations, fun experiments, and reward points!' 
                  : 'मनोरंजक एनिमेशन, खेलों, प्रयोगों और पुरस्कारों से भरे विज्ञान पाठों की खोज करें!'}
              </p>
            </div>

            {/* Topics grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="topics_grid">
              {scienceTopics.map((topic, index) => {
                const isCompleted = progress.completedLessons.includes(topic.id);
                const topicGradients = [
                  'from-indigo-500 to-blue-700',
                  'from-sky-400 to-blue-500',
                  'from-green-400 to-emerald-600',
                  'from-rose-400 to-red-600',
                  'from-amber-400 to-orange-500',
                  'from-purple-500 to-pink-600'
                ];
                const currentGradient = topicGradients[index % topicGradients.length];
                return (
                  <div
                    key={topic.id}
                    id={`topic_card_${topic.id}`}
                    onClick={() => {
                      setSelectedTopic(topic);
                      onAddXp(5);
                    }}
                    className="bg-white rounded-[32px] p-2 border-b-8 border-r-4 border-slate-200 hover:border-blue-400 transform transition-all hover:-translate-y-1 cursor-pointer select-none relative group shadow-md"
                  >
                    {/* Completion tag badge */}
                    {isCompleted && (
                      <span className="absolute top-5 right-5 bg-emerald-500 border border-white text-white font-black text-[9px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>COMPLETED</span>
                      </span>
                    )}

                    <div className={`h-full w-full rounded-[26px] bg-gradient-to-br ${currentGradient} p-6 flex flex-col justify-between min-h-[250px]`}>
                      <div className="space-y-4">
                        {/* Topic Category Tag */}
                        <span className="px-2.5 py-1 bg-white/20 border border-white/20 rounded-full text-[9px] font-black uppercase text-white tracking-wider">
                          {topic.category}
                        </span>

                        {/* Icon */}
                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                          {topic.icon}
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-white leading-tight">
                            {lang === 'en' ? topic.titleEn : topic.titleHi}
                          </h3>
                          <p className="text-xs text-blue-50/80 font-medium leading-normal line-clamp-3">
                            {lang === 'en' ? topic.summaryEn : topic.summaryHi}
                          </p>
                        </div>
                      </div>

                      {/* CTA link button */}
                      <div className="border-t border-white/10 pt-4 mt-5 flex justify-between items-center text-xs font-black uppercase tracking-wider text-white">
                        <span>{lang === 'en' ? 'Start Expedition' : 'अभियान शुरू करें'}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          
          /* VIEW 2: ACTIVE ADVENTURE LESSON WORKFLOW */
          <motion.div
            key="lesson"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
            id="active_lesson_adventure"
          >
            {/* ACTIVE HEADER & PROGRESS TRACKER */}
            <div className="flex justify-between items-center bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-md flex-wrap gap-4">
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-2xl font-black text-xs flex items-center gap-1.5 btn-bouncy"
                id="back_to_topics_btn"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{lang === 'en' ? 'Back to Missions' : 'अभियानों पर लौटें'}</span>
              </button>

              <div className="text-center md:text-left flex-1 md:pl-4">
                <span className="text-xs font-extrabold uppercase text-indigo-600 tracking-widest block">
                  {lang === 'en' ? 'ACTIVE EXPEDITION' : 'सक्रिय अभियान'}
                </span>
                <h3 className="text-lg md:text-xl font-black text-slate-800">
                  {lang === 'en' ? selectedTopic.titleEn : selectedTopic.titleHi}
                </h3>
                
                {/* 6 Step Adventure Progress bar */}
                <div className="flex gap-1.5 justify-center md:justify-start mt-2.5 overflow-x-auto py-1">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        if (idx <= activeStep || idx === 5) {
                          setActiveStep(idx);
                        }
                      }}
                      className={`text-[9px] px-2.5 py-1.5 rounded-full font-black uppercase border transition-all whitespace-nowrap ${
                        activeStep === idx 
                          ? 'bg-purple-600 text-white border-slate-950 scale-105 shadow-sm' 
                          : idx < activeStep
                          ? 'bg-emerald-500 text-white border-slate-950'
                          : 'bg-white text-slate-400 border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      {getStepName(idx)}
                    </button>
                  ))}
                </div>
              </div>

              {/* READ ALOUD MASTER VOICE CONTROLLER (Bilingual with full play, pause, resume, stop) */}
              {activeStep < 4 && (
                <div className="bg-slate-50 border-2 border-slate-950 rounded-2xl p-2 flex items-center gap-1.5 shadow-sm" id="voice_controller_dock">
                  <span className="text-xs font-black text-slate-500 px-2 flex items-center gap-1">
                    <Volume2 className="w-4 h-4 text-purple-600 animate-pulse" />
                    <span className="hidden sm:inline">{lang === 'en' ? 'Voice Read Aloud' : 'आवाज बोलें'}</span>
                  </span>
                  
                  {speechState === 'idle' ? (
                    <button
                      onClick={readCurrentStepAloud}
                      className="p-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 border border-slate-950 rounded-xl font-bold text-xs btn-bouncy"
                      title={lang === 'en' ? 'Play read aloud' : 'आवाज चलाएं'}
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  ) : speechState === 'playing' ? (
                    <button
                      onClick={handlePauseSpeech}
                      className="p-2 bg-amber-400 hover:bg-amber-500 text-slate-900 border border-slate-950 rounded-xl font-bold text-xs btn-bouncy"
                      title={lang === 'en' ? 'Pause' : 'रोकें'}
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleResumeSpeech}
                      className="p-2 bg-emerald-400 hover:bg-emerald-500 text-white border border-slate-950 rounded-xl font-bold text-xs btn-bouncy"
                      title={lang === 'en' ? 'Resume' : 'फिर शुरू करें'}
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {(speechState === 'playing' || speechState === 'paused') && (
                    <button
                      onClick={handleStopSpeech}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white border border-slate-950 rounded-xl font-bold text-xs btn-bouncy"
                      title={lang === 'en' ? 'Stop' : 'बंद करें'}
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* MAIN STAGE BOX */}
            <div className="bg-white border-4 border-slate-900 border-b-8 rounded-[36px] p-6 md:p-8 min-h-[420px] shadow-lg relative overflow-hidden" id="main_adventure_stage">
              
              {/* STAGE 0: ADVENTURE STORY */}
              {activeStep === 0 && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    {/* Story book paper */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-4xl animate-bounce">📖</span>
                        <span className="bg-amber-100 text-amber-800 border-2 border-amber-300 font-black text-xs px-3 py-1 rounded-full">
                          {lang === 'en' ? 'STAGE 1: ADVENTURE STORY' : 'अध्याय १: जादुई कहानी'}
                        </span>
                      </div>
                      
                      <h4 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                        {lang === 'en' ? 'The Magical Sci-Adventure!' : 'एक जादुई विज्ञान रोमांच!'}
                      </h4>
                      
                      <p className="text-sm md:text-base text-slate-700 font-extrabold leading-relaxed bg-amber-50/60 p-6 rounded-[28px] border-3 border-dashed border-amber-300 shadow-inner relative">
                        <span className="absolute -top-3 -left-2 text-4xl text-amber-300">“</span>
                        {lang === 'en' ? selectedTopic.lesson.storyEn : selectedTopic.lesson.storyHi}
                        <span className="absolute -bottom-6 -right-2 text-4xl text-amber-300">”</span>
                      </p>
                    </div>

                    {/* Fun Graphic card */}
                    <div className="w-full max-w-xs h-64 bg-indigo-50 border-4 border-slate-900 rounded-[32px] flex items-center justify-center text-8xl animate-float relative overflow-hidden shadow-md shrink-0">
                      <span className="absolute top-3 left-3 text-2xl opacity-25">✨</span>
                      <span className="absolute bottom-3 right-3 text-2xl opacity-25">⭐</span>
                      <span>{selectedTopic.icon}</span>
                    </div>
                  </div>

                  {/* Flow controls */}
                  <div className="flex justify-between items-center pt-6 border-t border-slate-150">
                    <span className="text-xs font-black text-slate-400">XP reward for completing: +5 XP 🌟</span>
                    <button
                      onClick={() => {
                        setActiveStep(1);
                        onAddXp(5);
                        playSuccessSound();
                      }}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl border-b-4 border-indigo-900 flex items-center gap-1.5 btn-bouncy shadow-md"
                      id="next_step_animation_btn"
                    >
                      <span>{lang === 'en' ? 'Next: Magical Animation 🎬' : 'आगे: जादुई एनीमेशन 🎬'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 1: MAGICAL ANNIHILATION / CARTOON ANIMATION */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                    <div>
                      <span className="bg-purple-100 text-purple-800 border-2 border-purple-300 font-black text-xs px-3 py-1 rounded-full">
                        {lang === 'en' ? 'STAGE 2: CARTOON ANIMATION' : 'अध्याय २: जादुई कार्टून एनीमेशन'}
                      </span>
                      <h4 className="text-xl md:text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
                        <span>🎬</span> {lang === 'en' ? 'Watch Science in Action!' : 'विज्ञान को चलते-फिरते देखें!'}
                      </h4>
                    </div>
                  </div>

                  {/* SPECIFIC TOPIC MAGICAL ANIMATION PANELS */}
                  <div className="bg-slate-900 border-4 border-slate-950 rounded-[32px] p-6 min-h-[300px] flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner">
                    
                    {/* Atmospheric Stars Background */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                      <div className="absolute top-4 left-6 text-xs animate-pulse">⭐</div>
                      <div className="absolute top-12 right-24 text-sm animate-pulse delay-75">✨</div>
                      <div className="absolute bottom-12 left-20 text-xs animate-pulse">⭐</div>
                      <div className="absolute bottom-6 right-10 text-sm animate-pulse delay-100">✨</div>
                    </div>

                    {/* 1. SOLAR SYSTEM ODYSSEY ANIMATION */}
                    {selectedTopic.id === 'solar_system' && (
                      <div className="flex flex-col items-center gap-6 w-full">
                        <div className="relative w-64 h-64 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center">
                          {/* Pulsing Sun */}
                          <motion.div 
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 border-2 border-white flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(234,179,8,0.6)] z-10"
                          >
                            ☀️
                          </motion.div>
                          
                          {/* Inner Orbit Line & Mercury */}
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                            className="absolute w-36 h-36 border border-white/10 rounded-full flex items-center"
                          >
                            <span className="text-xl -ml-2.5" title="Mercury">🪨</span>
                          </motion.div>

                          {/* Middle Orbit Line & Earth */}
                          <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                            className="absolute w-48 h-48 border border-white/10 rounded-full flex items-center justify-end"
                          >
                            <span className="text-2xl -mr-3 animate-pulse" title="Earth">🌍</span>
                          </motion.div>

                          {/* Outer Orbit Line & Saturn */}
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                            className="absolute w-60 h-60 border border-white/10 rounded-full flex items-center justify-center"
                          >
                            <span className="text-3xl -mt-58" title="Saturn">🪐</span>
                          </motion.div>
                        </div>
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest text-center">
                          {lang === 'en' ? 'Spinning Planets on Orbits with Invisible Gravity!' : 'अदृश्य गुरुत्वाकर्षण के कारण कक्षा में चक्कर लगाते ग्रह!'}
                        </p>
                      </div>
                    )}

                    {/* 2. WATER CYCLE ANIMATION */}
                    {selectedTopic.id === 'water_cycle' && (
                      <div className="flex flex-col items-center justify-between w-full h-64">
                        {/* Sun and Cloud */}
                        <div className="flex justify-around items-center w-full px-6">
                          <motion.span 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            className="text-5xl drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]"
                          >
                            ☀️
                          </motion.span>
                          
                          <motion.div 
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="text-6xl relative"
                          >
                            ☁️
                            {/* Rain drops falling */}
                            <div className="absolute left-4 top-10 flex gap-1">
                              <span className="text-blue-400 text-xs animate-bounce delay-75">💧</span>
                              <span className="text-blue-400 text-xs animate-bounce">💧</span>
                              <span className="text-blue-400 text-xs animate-bounce delay-150">💧</span>
                            </div>
                          </motion.div>
                        </div>

                        {/* Evaporating Bubble Particles */}
                        <div className="relative w-48 h-20 flex justify-center gap-6 overflow-hidden">
                          <span className="text-xs text-white/40 absolute top-2">{lang === 'en' ? 'Rising Water Vapor' : 'उड़ती हुई भाप'}</span>
                          <motion.span animate={{ y: [-10, -80], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-lg">💨</motion.span>
                          <motion.span animate={{ y: [-10, -80], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} className="text-lg">💧</motion.span>
                          <motion.span animate={{ y: [-10, -80], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.2 }} className="text-lg">💨</motion.span>
                        </div>

                        {/* Lake Water */}
                        <div className="w-full bg-blue-600/30 h-10 border-t border-blue-400 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-blue-200">
                          🌊 {lang === 'en' ? 'Puddle / Lake' : 'तालाब / झील'}
                        </div>
                      </div>
                    )}

                    {/* 3. PLANT GROWTH ANIMATION */}
                    {selectedTopic.id === 'plant_growth' && (
                      <div className="flex flex-col items-center justify-around h-64 w-full">
                        <div className="flex justify-between w-full px-12">
                          <motion.div 
                            animate={{ scale: [1, 1.1, 1] }} 
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="text-5xl"
                          >
                            ☀️
                          </motion.div>
                          {/* Raincloud watering */}
                          <div className="text-4xl relative">
                            ☁️💦
                          </div>
                        </div>

                        <div className="relative flex flex-col items-center">
                          {/* Soil block */}
                          <div className="w-32 h-14 bg-amber-900 border-2 border-amber-950 rounded-xl relative flex justify-center">
                            <span className="text-xs text-amber-100 font-extrabold mt-1">{lang === 'en' ? 'Nourished Soil' : 'उर्वरक मिट्टी'}</span>
                            
                            {/* Roots inside mud */}
                            <div className="absolute -bottom-4 flex justify-around w-full px-4 text-xs opacity-60">
                              <span>🌱</span>
                              <span>🌱</span>
                            </div>
                          </div>

                          {/* Swaying plant sprout */}
                          <motion.div 
                            animate={{ rotate: [-3, 3, -3] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute -top-16 text-6xl"
                          >
                            🌻
                          </motion.div>
                        </div>
                        <p className="text-xs font-black text-green-300 uppercase">
                          {lang === 'en' ? 'Photosynthesis: Leaves cook food from Sunshine!' : 'प्रकाश संश्लेषण: सूर्य की रोशनी से पत्तियां बनाती हैं भोजन!'}
                        </p>
                      </div>
                    )}

                    {/* 4. HUMAN BODY ANIMATION */}
                    {selectedTopic.id === 'human_body' && (
                      <div className="flex flex-col items-center gap-4 w-full h-64 justify-center">
                        <div className="flex gap-12 items-center">
                          {/* Expandable lungs */}
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20 text-4xl"
                          >
                            🫁
                          </motion.div>

                          {/* Pulsing heart */}
                          <motion.div 
                            animate={{ scale: [1, 1.15, 0.95, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                          >
                            🫀
                          </motion.div>
                        </div>

                        {/* Blood cell stream particles */}
                        <div className="w-full max-w-sm h-12 bg-white/5 border border-white/10 rounded-full relative overflow-hidden flex items-center">
                          <span className="text-[9px] font-bold text-slate-400 absolute left-4 uppercase">Artery Flow</span>
                          <motion.div 
                            animate={{ x: [-20, 380] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="flex gap-4 text-xs"
                          >
                            <span>🔴</span>
                            <span>🔵</span>
                            <span>🔴</span>
                            <span>🔴</span>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* 5. ELECTRICITY ANIMATION */}
                    {selectedTopic.id === 'electricity' && (
                      <div className="flex flex-col items-center justify-around h-64 w-full">
                        {/* Switch and Bulb loop */}
                        <div className="flex items-center gap-12">
                          <div className="p-4 bg-white/5 border-2 border-white/10 rounded-2xl text-center">
                            <span className="text-xs font-black block text-slate-400 uppercase">Loop switch</span>
                            <span className="text-3xl">🔌</span>
                          </div>

                          <div className="relative">
                            <motion.span 
                              animate={{ opacity: [0.6, 1, 0.6] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="text-6xl block drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]"
                            >
                              💡
                            </motion.span>
                          </div>
                        </div>

                        {/* Running electron sparks */}
                        <div className="w-full max-w-md h-10 border-2 border-yellow-500 border-dashed rounded-xl flex items-center overflow-hidden">
                          <motion.div 
                            animate={{ x: [-10, 420] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="flex gap-8 text-yellow-300 text-lg font-black"
                          >
                            <span>⚡</span>
                            <span>⚡</span>
                            <span>⚡</span>
                            <span>⚡</span>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* 6. MAGNETS ANIMATION */}
                    {selectedTopic.id === 'magnets' && (
                      <div className="flex flex-col items-center justify-around h-64 w-full">
                        <div className="flex gap-16 items-center relative">
                          {/* Magnet left */}
                          <div className="text-5xl font-black bg-blue-600 border-2 border-white px-3 py-1.5 rounded-l-xl">
                            N
                          </div>

                          {/* Swirling field loops */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.span 
                              animate={{ scaleX: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="w-16 h-12 border-2 border-pink-500 rounded-full block"
                            />
                          </div>

                          {/* Magnet right */}
                          <div className="text-5xl font-black bg-red-600 border-2 border-white px-3 py-1.5 rounded-r-xl">
                            S
                          </div>
                        </div>

                        <p className="text-xs text-pink-300 font-extrabold tracking-widest uppercase">
                          {lang === 'en' ? 'Swirling Invisible Magnetic Energy Fields!' : 'चक्करदार अदृश्य चुंबकीय ऊर्जा क्षेत्र!'}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Flow buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-slate-150">
                    <button
                      onClick={() => setActiveStep(0)}
                      className="px-4 py-2 border border-slate-300 text-xs font-black text-slate-500 hover:text-slate-800 rounded-xl"
                    >
                      ⬅ {lang === 'en' ? 'Back: Story' : 'पीछे: कहानी'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveStep(2);
                        onAddXp(5);
                        playSuccessSound();
                      }}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl border-b-4 border-indigo-900 flex items-center gap-1.5 btn-bouncy shadow-md"
                    >
                      <span>{lang === 'en' ? 'Next: Lab Experiment 🧪' : 'आगे: प्रयोगशाला प्रयोग 🧪'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: EXPERIMENT LAB (The original hands-on interaction) */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="bg-amber-100 text-amber-800 border-2 border-amber-300 font-black text-xs px-3 py-1 rounded-full">
                      {lang === 'en' ? 'STAGE 3: HANDS-ON LAB' : 'अध्याय ३: व्यावहारिक विज्ञान प्रयोग'}
                    </span>
                    <h4 className="text-xl md:text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
                      <span>🧪</span> {lang === 'en' ? 'Hands-On Science Lab' : 'वर्चुअल विज्ञान प्रयोगशाला'}
                    </h4>
                  </div>

                  {/* INLINE MINI SIMULATOR BLOCK */}
                  <div className="bg-slate-50 border-3 border-slate-900 rounded-[28px] p-6 min-h-[260px] flex flex-col md:flex-row items-center justify-around gap-6 shadow-md">
                    
                    {/* Solar System Interaction */}
                    {selectedTopic.id === 'solar_system' && (
                      <div className="flex-1 w-full flex flex-col items-center gap-4">
                        <div className="relative w-48 h-48 border border-dashed border-indigo-200 rounded-full flex items-center justify-center bg-indigo-950/5">
                          <div className="w-12 h-12 rounded-full bg-amber-400 border-2 border-slate-950 flex items-center justify-center text-lg z-10 animate-pulse">☀️</div>
                          
                          {[
                            { nameEn: 'Mercury', nameHi: 'बुध', icon: '🪨', style: { transform: 'rotate(45deg) translate(50px) rotate(-45deg)' }, fact: 'Closest planet to Sun!' },
                            { nameEn: 'Earth', nameHi: 'पृथ्वी', icon: '🌍', style: { transform: 'rotate(180deg) translate(80px) rotate(-180deg)' }, fact: 'Our beautiful blue home!' },
                          ].map((p, i) => (
                            <button
                              key={i}
                              style={p.style}
                              onClick={() => {
                                setSolarClickedPlanet(p);
                                onAddXp(2);
                                celebrate();
                              }}
                              className="absolute w-10 h-10 rounded-full bg-white border border-slate-900 flex items-center justify-center text-xl hover:scale-120 transition-transform cursor-pointer shadow-md"
                            >
                              {p.icon}
                            </button>
                          ))}
                        </div>

                        {solarClickedPlanet && (
                          <div className="bg-indigo-50 border-2 border-indigo-200 text-indigo-900 rounded-xl p-3 text-xs text-center font-extrabold animate-bounce">
                            🚀 {solarClickedPlanet.icon} {lang === 'en' ? solarClickedPlanet.nameEn : solarClickedPlanet.nameHi}: {solarClickedPlanet.fact}
                          </div>
                        )}
                        <span className="text-xs font-bold text-slate-500">{lang === 'en' ? 'Click planets to explore fun metrics!' : 'ग्रहों के बारे में जानने के लिए उनपर क्लिक करें!'}</span>
                      </div>
                    )}

                    {/* Water Cycle Interaction */}
                    {selectedTopic.id === 'water_cycle' && (
                      <div className="flex-1 w-full flex flex-col items-center gap-4">
                        <div className="w-full max-w-sm h-40 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 rounded-2xl border-3 border-slate-900 p-3 relative flex items-center justify-between overflow-hidden">
                          <span className="text-4xl animate-pulse">☀️</span>
                          
                          <motion.span 
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 85 }}
                            onDrag={(e, info) => {
                              setWaterCloudHeight(info.point ? info.point.y : 50);
                            }}
                            className="text-5xl cursor-grab active:cursor-grabbing select-none"
                          >
                            ☁️
                          </motion.span>
                        </div>
                        <span className="text-xs text-slate-500 font-extrabold bg-white px-3 py-1.5 border border-slate-200 rounded-lg">
                          {lang === 'en' ? '💡 GRAB and drag the Cloud to vaporize/rain!' : '💡 बादल को ऊपर-नीचे खींचे और बारिश/वाष्पीकरण देखें!'}
                        </span>
                      </div>
                    )}

                    {/* Plant Growth Interaction */}
                    {selectedTopic.id === 'plant_growth' && (
                      <div className="flex-1 w-full flex flex-col items-center gap-4">
                        <div className="w-24 h-24 border-3 border-slate-900 rounded-3xl bg-white flex items-center justify-center text-6xl shadow-inner">
                          {plantGrowthStage === 0 ? '🫘' : plantGrowthStage === 1 ? '🌱' : '🌻'}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setPlantGrowthStage(prev => Math.min(2, prev + 1));
                              onAddXp(3);
                              celebrate();
                            }}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black border-2 border-slate-950 text-xs btn-bouncy"
                          >
                            💦 {lang === 'en' ? 'Water Plant' : 'पौधे को पानी दें'}
                          </button>
                          <button
                            onClick={() => setPlantGrowthStage(0)}
                            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-black border-2 border-slate-950 text-xs btn-bouncy"
                          >
                            🔄 {lang === 'en' ? 'Reset seed' : 'रीसेट'}
                          </button>
                        </div>
                        <span className="text-xs text-slate-500 font-black">
                          {plantGrowthStage === 0 ? 'Sleeping Seed 🫘' : plantGrowthStage === 1 ? 'Sprouting Sprout 🌱' : 'Blooming Sunflower 🌻'}
                        </span>
                      </div>
                    )}

                    {/* Human Body Interaction */}
                    {selectedTopic.id === 'human_body' && (
                      <div className="flex-1 w-full flex flex-col items-center gap-4">
                        <button
                          onClick={() => {
                            setHumanBeats(!humanBeats);
                            onAddXp(2);
                            celebrate();
                          }}
                          className="w-24 h-24 bg-white border-3 border-slate-950 rounded-full flex items-center justify-center shadow-md btn-bouncy"
                        >
                          <span className={`text-6xl select-none ${humanBeats ? 'animate-heartbeat text-rose-500' : 'text-slate-300'}`}>
                            🫀
                          </span>
                        </button>
                        <span className="text-xs text-slate-500 font-black bg-white px-3 py-1 border border-slate-200 rounded-full">
                          {lang === 'en' ? 'Tap heart to trigger heartbeats!' : 'धड़कन शुरू करने के लिए दिल पर टैप करें!'}
                        </span>
                      </div>
                    )}

                    {/* Electricity Interaction */}
                    {selectedTopic.id === 'electricity' && (
                      <div className="flex-1 w-full flex flex-col items-center gap-4">
                        <button
                          onClick={() => {
                            setElectricityConnected(!electricityConnected);
                            onAddXp(3);
                            if (!electricityConnected) celebrate();
                          }}
                          className={`w-16 h-16 rounded-full border-3 border-slate-950 flex items-center justify-center text-4xl shadow-md btn-bouncy ${
                            electricityConnected ? 'bg-amber-400' : 'bg-slate-200'
                          }`}
                        >
                          {electricityConnected ? '💡' : '🔌'}
                        </button>
                        <span className="text-xs text-slate-500 font-black">
                          {electricityConnected ? '🟢 CIRCUIT CLOSED: BULB GLOWS!' : '🔴 CIRCUIT OPEN: LIGHT IS OFF'}
                        </span>
                      </div>
                    )}

                    {/* Magnets Interaction */}
                    {selectedTopic.id === 'magnets' && (
                      <div className="flex-1 w-full flex flex-col items-center gap-4">
                        <div className="flex gap-8 items-center justify-center min-h-[60px]">
                          <span className="text-5xl">🧲</span>
                          <span className={`text-5xl transition-transform duration-300 ${magnetPolarity === 'attract' ? 'translate-x-0 scale-105' : 'translate-x-12 opacity-60'}`}>
                            🧲
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setMagnetPolarity(prev => prev === 'attract' ? 'repel' : 'attract');
                            onAddXp(2);
                            celebrate();
                          }}
                          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white border-2 border-slate-950 font-black text-xs rounded-xl btn-bouncy"
                        >
                          🔄 {lang === 'en' ? `Flip Magnet Pole` : `ध्रुव बदलें`}
                        </button>
                        <span className="text-xs text-slate-500 font-black">
                          {magnetPolarity === 'attract' ? 'Opposite poles attract! 🧲🤝' : 'Similar poles repel! 🧲❌'}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* Flow controls */}
                  <div className="flex justify-between items-center pt-6 border-t border-slate-150">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-4 py-2 border border-slate-300 text-xs font-black text-slate-500 hover:text-slate-800 rounded-xl"
                    >
                      ⬅ {lang === 'en' ? 'Back: Animation' : 'पीछे: एनीमेशन'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveStep(3);
                        onAddXp(5);
                        playSuccessSound();
                      }}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl border-b-4 border-indigo-900 flex items-center gap-1.5 btn-bouncy shadow-md"
                      id="next_step_mini_game_btn"
                    >
                      <span>{lang === 'en' ? 'Next: Mini Game Challenge 🎮' : 'आगे: मिनी गेम चुनौती 🎮'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: MINI GAME CHALLENGE */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                    <div>
                      <span className="bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-black text-xs px-3 py-1 rounded-full">
                        {lang === 'en' ? 'STAGE 4: MINI GAME' : 'अध्याय ४: रोमांचक मिनी खेल'}
                      </span>
                      <h4 className="text-xl md:text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
                        <span>🎮</span> {lang === 'en' ? 'Expedition Mini Game Challenge!' : 'अभियान मिनी गेम चुनौती!'}
                      </h4>
                    </div>
                    {gameWon && (
                      <span className="bg-emerald-500 text-white font-black text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1 animate-bounce">
                        🏆 CHALLENGE WON! (+15 XP)
                      </span>
                    )}
                  </div>

                  {/* GAME SCENE BOX */}
                  <div className="bg-white border-3 border-slate-900 rounded-[28px] p-6 min-h-[250px] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                    
                    {/* A. SOLAR SYSTEM MINI GAME: Planet ordering closest to Sun */}
                    {selectedTopic.id === 'solar_system' && (
                      <div className="space-y-4 w-full text-center">
                        <p className="font-extrabold text-sm text-indigo-950">
                          {lang === 'en' 
                            ? 'Mercury (🪨), Earth (🌍), Jupiter (🪐). Click planets in order of CLOSEST to FARTHEST from the Sun!' 
                            : 'बुध (🪨), पृथ्वी (🌍), बृहस्पति (🪐)। सूर्य के सबसे पास से दूर के क्रम में ग्रहों पर क्लिक करें!'}
                        </p>
                        
                        <div className="flex gap-4 justify-center">
                          {[
                            { id: 'jupiter', icon: '🪐', label: 'Jupiter' },
                            { id: 'mercury', icon: '🪨', label: 'Mercury' },
                            { id: 'earth', icon: '🌍', label: 'Earth' }
                          ].map((planet) => {
                            const isAdded = solarOrder.includes(planet.id);
                            return (
                              <button
                                key={planet.id}
                                disabled={isAdded || gameWon}
                                onClick={() => {
                                  const newOrder = [...solarOrder, planet.id];
                                  setSolarOrder(newOrder);
                                  
                                  // Verify sequence
                                  if (newOrder.length === 3) {
                                    if (newOrder[0] === 'mercury' && newOrder[1] === 'earth' && newOrder[2] === 'jupiter') {
                                      setGameWon(true);
                                      setGameFeedback(lang === 'en' ? '🌟 Incredible! Mercury -> Earth -> Jupiter is 100% correct!' : '🌟 अद्भुत! बुध -> पृथ्वी -> बृहस्पति बिल्कुल सही क्रम है!');
                                      onAddXp(15);
                                      celebrate();
                                    } else {
                                      setSolarOrder([]);
                                      setGameFeedback(lang === 'en' ? '❌ Uh oh! Wrong order. Try again!' : '❌ अरे! गलत क्रम। दोबारा प्रयास करें!');
                                    }
                                  }
                                }}
                                className={`w-18 h-18 text-3xl flex flex-col items-center justify-center bg-indigo-50 hover:bg-indigo-100 border-2 border-slate-900 rounded-2xl btn-bouncy shadow-md relative ${
                                  isAdded ? 'opacity-30 scale-90' : ''
                                }`}
                              >
                                <span>{planet.icon}</span>
                                <span className="text-[9px] font-black uppercase mt-1 text-indigo-900">{planet.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Order Queue */}
                        <div className="flex gap-2 justify-center items-center min-h-[40px]">
                          <span className="text-xs font-black text-slate-400 uppercase">Your order:</span>
                          {solarOrder.map((id, index) => (
                            <span key={index} className="px-3 py-1 bg-yellow-300 text-slate-900 font-extrabold border border-slate-950 text-xs rounded-full">
                              {id.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* B. WATER CYCLE MINI GAME: Shapeshifter Matching */}
                    {selectedTopic.id === 'water_cycle' && (
                      <div className="space-y-4 w-full text-center">
                        <p className="font-extrabold text-sm text-indigo-950">
                          {lang === 'en' 
                            ? 'Match the magical stage with its description!' 
                            : 'जादुई जल चक्र अवस्था को उसके सही विवरण से मिलाएं!'}
                        </p>

                        <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto">
                          {['Evaporation', 'Condensation', 'Precipitation'].map((stage) => (
                            <button
                              key={stage}
                              disabled={gameWon}
                              onClick={() => {
                                setWaterMatchSelection(stage);
                              }}
                              className={`p-3 text-xs font-black rounded-xl border-2 border-slate-950 btn-bouncy ${
                                waterMatchSelection === stage ? 'bg-yellow-400 text-slate-950' : 'bg-sky-50 text-sky-900'
                              }`}
                            >
                              {stage}
                            </button>
                          ))}
                        </div>

                        {/* Descriptions list */}
                        <div className="space-y-2 max-w-md mx-auto pt-2">
                          {[
                            { term: 'Evaporation', text: 'Water heating up and rising as vapor/gas 💨' },
                            { term: 'Condensation', text: 'Vapor cooling down to form fluffy clouds ☁️' },
                            { term: 'Precipitation', text: 'Water droplets falling as fresh rain/snow 🌧️' }
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              disabled={!waterMatchSelection || gameWon}
                              onClick={() => {
                                if (waterMatchSelection === item.term) {
                                  setWaterMatchedCount(prev => {
                                    const next = prev + 1;
                                    if (next === 3) {
                                      setGameWon(true);
                                      setGameFeedback(lang === 'en' ? '🏆 Fantastic! You matched all water cycle stages!' : '🏆 शानदार! आपने जल चक्र की सभी अवस्थाओं का मिलान किया!');
                                      onAddXp(15);
                                      celebrate();
                                    }
                                    return next;
                                  });
                                  setGameFeedback(lang === 'en' ? '✅ Correct Match!' : '✅ सही मिलान!');
                                  setWaterMatchSelection(null);
                                  playSuccessSound();
                                } else {
                                  setGameFeedback(lang === 'en' ? '❌ Wrong match! Try another combination.' : '❌ गलत मिलान! दूसरी कोशिश करें।');
                                }
                              }}
                              className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-900 rounded-xl text-left text-xs font-extrabold flex justify-between"
                            >
                              <span>{item.text}</span>
                              <span className="text-[10px] text-indigo-600 uppercase font-black tracking-wider">Click to Match</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* C. PLANT GROWTH MINI GAME: Catching Photosynthesis elements */}
                    {selectedTopic.id === 'plant_growth' && (
                      <div className="space-y-4 w-full text-center">
                        <p className="font-extrabold text-sm text-indigo-950">
                          {lang === 'en' 
                            ? 'Harvest 3 correct ingredients leaves need to cook food!' 
                            : 'पत्तियों को भोजन बनाने के लिए आवश्यक ३ सही सामग्री चुनें!'}
                        </p>

                        <div className="flex flex-wrap gap-2 justify-center">
                          {[
                            { id: 'sunlight', label: 'Sunlight ☀️', isCorrect: true },
                            { id: 'co2', label: 'Carbon Dioxide 💨', isCorrect: true },
                            { id: 'water', label: 'Water 💦', isCorrect: true },
                            { id: 'plastic', label: 'Plastic Bottles 🗑️', isCorrect: false },
                            { id: 'soda', label: 'Soda Drink 🥤', isCorrect: false }
                          ].map((item) => {
                            const isCaught = photosynthesisCaught.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                disabled={isCaught || gameWon}
                                onClick={() => {
                                  if (item.isCorrect) {
                                    const newCaught = [...photosynthesisCaught, item.id];
                                    setPhotosynthesisCaught(newCaught);
                                    playSuccessSound();
                                    
                                    if (newCaught.length === 3) {
                                      setGameWon(true);
                                      setGameFeedback(lang === 'en' ? '🌱 Perfect! Sunlight, CO2, and Water are the primary ingredients for Photosynthesis!' : '🌱 बेहतरीन! प्रकाश संश्लेषण के लिए धूप, CO2 और पानी प्राथमिक सामग्रियां हैं!');
                                      onAddXp(15);
                                      celebrate();
                                    }
                                  } else {
                                    setGameFeedback(lang === 'en' ? '❌ Trash cannot help plants grow! Pick science ingredients!' : '❌ कचरा पौधों को बढ़ने में मदद नहीं करता! वैज्ञानिक सामग्रियां चुनें!');
                                  }
                                }}
                                className={`px-4 py-2.5 rounded-2xl border-2 border-slate-950 font-black text-xs btn-bouncy ${
                                  isCaught ? 'bg-green-500 text-white line-through opacity-50' : 'bg-emerald-50 text-emerald-900'
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* D. HUMAN BODY MINI GAME: Match Organ with Function */}
                    {selectedTopic.id === 'human_body' && (
                      <div className="space-y-4 w-full text-center">
                        <p className="font-extrabold text-sm text-indigo-950">
                          {lang === 'en' 
                            ? 'Match the organ with its vital superpower role!' 
                            : 'अंग को उसके जैविक महाशक्ति कार्य से मिलाएं!'}
                        </p>

                        <div className="flex gap-3 justify-center">
                          {['Brain', 'Heart', 'Lungs'].map((organ) => (
                            <button
                              key={organ}
                              disabled={gameWon}
                              onClick={() => setHumanSelectedOrgan(organ)}
                              className={`px-4 py-2 border-2 border-slate-950 rounded-xl font-black text-xs btn-bouncy ${
                                humanSelectedOrgan === organ ? 'bg-pink-400 text-slate-950' : 'bg-pink-50 text-pink-900'
                              }`}
                            >
                              {organ}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-2 max-w-sm mx-auto pt-2">
                          {[
                            { organ: 'Brain', text: 'Sends electrical instruction commands to hands 🧠' },
                            { organ: 'Heart', text: 'Pumps red oxygen blood to fingers and toes 🫀' },
                            { organ: 'Lungs', text: 'Expands like balloons to absorb fresh oxygen 🫁' }
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              disabled={!humanSelectedOrgan || gameWon}
                              onClick={() => {
                                if (humanSelectedOrgan === item.organ) {
                                  setGameWon(true);
                                  setGameFeedback(lang === 'en' ? `🎉 Correct match! The ${item.organ} does exactly that!` : `🎉 सही मिलान! ${item.organ} का यही काम है!`);
                                  onAddXp(15);
                                  celebrate();
                                } else {
                                  setGameFeedback(lang === 'en' ? '❌ Wrong match! Try again.' : '❌ गलत मिलान! दोबारा कोशिश करें।');
                                }
                              }}
                              className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-900 rounded-xl text-left text-xs font-bold flex justify-between"
                            >
                              <span>{item.text}</span>
                              <span className="text-pink-600 font-extrabold text-[9px] uppercase">Verify</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* E. ELECTRICITY MINI GAME: Conductor classification */}
                    {selectedTopic.id === 'electricity' && (
                      <div className="space-y-4 w-full text-center">
                        <p className="font-extrabold text-sm text-indigo-950">
                          {lang === 'en' 
                            ? 'Sort Copper Wire & Plastic Cup into Conductor vs Insulator!' 
                            : 'तांबे का तार और प्लास्टिक कप को चालक (Conductor) और कुचालक (Insulator) में छाँटें!'}
                        </p>

                        <div className="flex gap-4 justify-center">
                          {[
                            { id: 'copper', label: 'Copper Wire 🔌' },
                            { id: 'plastic', label: 'Plastic Cup 🥛' }
                          ].map((item) => (
                            <div key={item.id} className="p-3 bg-slate-50 border border-slate-900 rounded-xl space-y-2">
                              <span className="font-extrabold text-xs block">{item.label}</span>
                              
                              <div className="flex gap-1.5 justify-center">
                                <button
                                  disabled={gameWon}
                                  onClick={() => {
                                    setElectricityConductSorted(prev => {
                                      const next = { ...prev, [item.id]: 'conductor' };
                                      if (next['copper'] === 'conductor' && next['plastic'] === 'insulator') {
                                        setGameWon(true);
                                        setGameFeedback(lang === 'en' ? '⚡ Awesome! Metal copper conducts electricity, plastic blocks it!' : '⚡ बढ़िया! धातु तांबा बिजली का संवाहक है, प्लास्टिक इसे रोकता है!');
                                        onAddXp(15);
                                        celebrate();
                                      }
                                      return next;
                                    });
                                  }}
                                  className={`px-2 py-1 text-[10px] font-black border border-slate-950 rounded-lg ${
                                    electricityConductSorted[item.id] === 'conductor' ? 'bg-amber-400' : 'bg-white'
                                  }`}
                                >
                                  Conductor
                                </button>
                                <button
                                  disabled={gameWon}
                                  onClick={() => {
                                    setElectricityConductSorted(prev => {
                                      const next = { ...prev, [item.id]: 'insulator' };
                                      if (next['copper'] === 'conductor' && next['plastic'] === 'insulator') {
                                        setGameWon(true);
                                        setGameFeedback(lang === 'en' ? '⚡ Awesome! Metal copper conducts, plastic blocks!' : '⚡ बढ़िया! धातु तांबा बिजली का संवाहक है, प्लास्टिक इसे रोकता है!');
                                        onAddXp(15);
                                        celebrate();
                                      }
                                      return next;
                                    });
                                  }}
                                  className={`px-2 py-1 text-[10px] font-black border border-slate-950 rounded-lg ${
                                    electricityConductSorted[item.id] === 'insulator' ? 'bg-indigo-400 text-white' : 'bg-white'
                                  }`}
                                >
                                  Insulator
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* F. MAGNETS MINI GAME: Magnet stick challenge */}
                    {selectedTopic.id === 'magnets' && (
                      <div className="space-y-4 w-full text-center">
                        <p className="font-extrabold text-sm text-indigo-950">
                          {lang === 'en' 
                            ? 'Click only the items that get strongly attracted to magnets!' 
                            : 'केवल उन वस्तुओं पर क्लिक करें जो चुंबक से चिपकती हैं!'}
                        </p>

                        <div className="flex gap-2 justify-center">
                          {[
                            { id: 'nail', label: 'Iron Nail 📌', isMagnetic: true },
                            { id: 'clip', label: 'Paper Clip 🖇️', isMagnetic: true },
                            { id: 'wood', label: 'Wooden Door 🪵', isMagnetic: false },
                            { id: 'toy', label: 'Plastic Toy 🧸', isMagnetic: false }
                          ].map((item) => {
                            const isStuck = magnetStuckMaterials.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                disabled={isStuck || gameWon}
                                onClick={() => {
                                  if (item.isMagnetic) {
                                    const next = [...magnetStuckMaterials, item.id];
                                    setMagnetStuckMaterials(next);
                                    playSuccessSound();
                                    
                                    if (next.length === 2) {
                                      setGameWon(true);
                                      setGameFeedback(lang === 'en' ? '🧲 Correct! Iron and steel are strongly attracted to magnet fields!' : '🧲 बिल्कुल सही! लोहा और स्टील चुंबकीय क्षेत्र की ओर मजबूती से खिंचे चले आते हैं!');
                                      onAddXp(15);
                                      celebrate();
                                    }
                                  } else {
                                    setGameFeedback(lang === 'en' ? '❌ Wood and plastic do not stick to magnets!' : '❌ लकड़ी और प्लास्टिक चुंबक से नहीं चिपकते हैं!');
                                  }
                                }}
                                className={`px-4 py-2.5 rounded-2xl border-2 border-slate-950 font-black text-xs btn-bouncy ${
                                  isStuck ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-950'
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Feedback notification box */}
                    {gameFeedback && (
                      <div className="bg-slate-950 text-yellow-300 font-extrabold text-xs px-4 py-2 border-2 border-slate-900 rounded-full animate-bounce">
                        {gameFeedback}
                      </div>
                    )}

                  </div>

                  {/* Flow controls */}
                  <div className="flex justify-between items-center pt-6 border-t border-slate-150">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-4 py-2 border border-slate-300 text-xs font-black text-slate-500 hover:text-slate-800 rounded-xl"
                    >
                      ⬅ {lang === 'en' ? 'Back: Lab' : 'पीछे: प्रयोग'}
                    </button>
                    
                    <button
                      disabled={!gameWon}
                      onClick={() => {
                        setActiveStep(4);
                        onAddXp(5);
                        playSuccessSound();
                      }}
                      className={`px-6 py-3.5 font-black text-sm rounded-2xl border-b-4 flex items-center gap-1.5 btn-bouncy shadow-md ${
                        gameWon 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-900' 
                          : 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed'
                      }`}
                      id="next_step_quiz_btn"
                    >
                      <span>{lang === 'en' ? 'Next: Brain Teaser Quiz 🧠' : 'आगे: दिमाग की कसरत क्विज़ 🧠'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 4: BRAIN TEASER QUIZ (High-fidelity responsive questions) */}
              {activeStep === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <span className="bg-rose-100 text-rose-800 border-2 border-rose-300 font-black text-xs px-3 py-1 rounded-full">
                        {lang === 'en' ? 'STAGE 5: SCIENCE QUIZ' : 'अध्याय ५: वैज्ञानिक परीक्षण क्विज़'}
                      </span>
                      <h4 className="text-xl md:text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-indigo-500" />
                        <span>{t.quizTitle} ({currentQuizIndex + 1} / 2)</span>
                      </h4>
                    </div>
                    <span className="text-xs bg-slate-100 border border-slate-300 text-slate-600 font-black px-2.5 py-1 rounded-full uppercase">
                      No time limits
                    </span>
                  </div>

                  {/* Question card */}
                  <div className="p-5 bg-indigo-50/50 border-2 border-slate-900 rounded-2xl text-slate-800 font-black text-base md:text-lg">
                    {lang === 'en' 
                      ? selectedTopic.lesson.quiz[currentQuizIndex].questionEn 
                      : selectedTopic.lesson.quiz[currentQuizIndex].questionHi}
                  </div>

                  {/* Options buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(lang === 'en' 
                      ? selectedTopic.lesson.quiz[currentQuizIndex].optionsEn 
                      : selectedTopic.lesson.quiz[currentQuizIndex].optionsHi
                    ).map((opt, i) => {
                      const isSelected = selectedAnswerIdx === i;
                      const correctIdx = selectedTopic.lesson.quiz[currentQuizIndex].correctIndex;
                      
                      let btnStyle = "bg-white hover:bg-slate-50 text-slate-800 border-slate-900";
                      if (isSelected) {
                        btnStyle = "bg-indigo-500 text-white ring-4 ring-indigo-300 border-slate-950";
                      }
                      if (showExplanation) {
                        if (i === correctIdx) {
                          btnStyle = "bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300";
                        } else if (isSelected && i !== correctIdx) {
                          btnStyle = "bg-red-500 text-white border-red-600 ring-4 ring-red-300";
                        }
                      }

                      return (
                        <button
                          key={i}
                          disabled={showExplanation}
                          onClick={() => {
                            setSelectedAnswerIdx(i);
                            if (soundEnabled) {
                              try {
                                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
                                audio.volume = 0.15;
                                audio.play().catch(() => {});
                              } catch (e) {}
                            }
                          }}
                          className={`w-full p-4 rounded-2xl border-3 text-left font-black text-sm md:text-base transition-all btn-bouncy ${btnStyle}`}
                        >
                          <span className="mr-2 font-mono font-black">{['A', 'B', 'C', 'D'][i]}.</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation details card */}
                  {showExplanation && (
                    <div className={`p-5 rounded-2xl border-2 ${
                      selectedAnswerIdx === selectedTopic.lesson.quiz[currentQuizIndex].correctIndex
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    } text-xs md:text-sm font-bold leading-relaxed space-y-1 animate-pulse`}>
                      <p className="font-black text-sm uppercase">
                        {selectedAnswerIdx === selectedTopic.lesson.quiz[currentQuizIndex].correctIndex
                          ? `🌟 ${t.correctAnswer}`
                          : `💡 ${t.wrongAnswer}`
                        }
                      </p>
                      <p>
                        {lang === 'en'
                          ? selectedTopic.lesson.quiz[currentQuizIndex].explanationEn
                          : selectedTopic.lesson.quiz[currentQuizIndex].explanationHi}
                      </p>
                    </div>
                  )}

                  {/* Submit / Next trigger */}
                  <div className="flex justify-between items-center pt-6 border-t border-slate-150">
                    <button
                      onClick={() => setActiveStep(3)}
                      className="px-4 py-2 border border-slate-300 text-xs font-black text-slate-500 hover:text-slate-800 rounded-xl"
                    >
                      ⬅ {lang === 'en' ? 'Back: Mini Game' : 'पीछे: मिनी गेम'}
                    </button>

                    {!showExplanation ? (
                      <button
                        disabled={selectedAnswerIdx === null}
                        onClick={() => {
                          setShowExplanation(true);
                          const correctIdx = selectedTopic.lesson.quiz[currentQuizIndex].correctIndex;
                          if (selectedAnswerIdx === correctIdx) {
                            setCorrectAnswersCount(prev => prev + 1);
                            celebrate();
                          } else {
                            if (soundEnabled) {
                              try {
                                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
                                audio.volume = 0.2;
                                audio.play().catch(() => {});
                              } catch (e) {}
                            }
                          }
                        }}
                        className={`px-6 py-3.5 rounded-2xl border-2 border-slate-900 font-black text-sm btn-bouncy ${
                          selectedAnswerIdx !== null
                            ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                            : 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed'
                        }`}
                        id="submit_quiz_answer_btn"
                      >
                        <span>{t.submit}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (currentQuizIndex === 0) {
                            setCurrentQuizIndex(1);
                            setSelectedAnswerIdx(null);
                            setShowExplanation(false);
                          } else {
                            // Finish quiz and jump directly to Stage 5: REWARD VAULT!
                            setActiveStep(5);
                            celebrate();
                          }
                        }}
                        className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl border-2 border-slate-900 btn-bouncy flex items-center gap-1"
                        id="continue_quiz_btn"
                      >
                        <span>{lang === 'en' ? 'Continue' : 'जारी रखें'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STAGE 5: THE REWARD VAULT (CLAIM XP/COINS/BADGES!) */}
              {activeStep === 5 && (
                <div className="text-center py-8 space-y-6" id="lesson_reward_vault_screen">
                  <div className="relative inline-block">
                    <span className="text-7xl animate-bounce block">🏆🎖️✨</span>
                    <span className="absolute -top-2 -right-2 text-2xl animate-spin">🌟</span>
                  </div>

                  <h4 className="text-3xl md:text-4xl font-black text-emerald-600 leading-tight">
                    {lang === 'en' ? 'Science Mission Complete!' : 'वैज्ञानिक अभियान शानदार ढंग से पूरा हुआ!'}
                  </h4>

                  <p className="text-slate-600 font-bold max-w-md mx-auto text-sm md:text-base leading-relaxed bg-emerald-50/50 p-5 rounded-2xl border-2 border-dashed border-emerald-300">
                    {lang === 'en'
                      ? `Excellent job explorer! You answered ${correctAnswersCount} / 2 questions correctly, cracked the mini games, and successfully concluded the adventure!`
                      : `शानदार काम, नन्हें वैज्ञानिक! आपने ${correctAnswersCount} / 2 प्रश्नों का सही उत्तर दिया, मिनी खेलों को हल किया और विज्ञान साहसिक कार्य सफलतापूर्वक समाप्त किया!`}
                  </p>

                  {/* Loot Rewards metrics cards */}
                  <div className="flex gap-4 justify-center items-center flex-wrap pt-2">
                    <div className="p-4 bg-yellow-100 text-yellow-800 border-3 border-yellow-300 rounded-2xl text-center min-w-[120px] shadow-sm transform hover:scale-105 transition-transform">
                      <span className="text-2xl block">🌟</span>
                      <span className="text-lg font-black block mt-1">+35 XP</span>
                      <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">Level Progress</span>
                    </div>

                    <div className="p-4 bg-amber-100 text-amber-800 border-3 border-amber-300 rounded-2xl text-center min-w-[120px] shadow-sm transform hover:scale-105 transition-transform">
                      <span className="text-2xl block">🪙</span>
                      <span className="text-lg font-black block mt-1">+10 Coins</span>
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">SciShop Gold</span>
                    </div>

                    <div className="p-4 bg-purple-100 text-purple-800 border-3 border-purple-300 rounded-2xl text-center min-w-[120px] shadow-sm transform hover:scale-105 transition-transform">
                      <span className="text-2xl block">🥇</span>
                      <span className="text-xs font-black block mt-2 text-purple-950 uppercase">{selectedTopic.id.replace('_', ' ').toUpperCase()}</span>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mt-0.5 block">Earned Medal</span>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center pt-6">
                    <button
                      onClick={() => {
                        // Persist progress and add XP/coins
                        onLessonComplete(selectedTopic.id, Math.round((correctAnswersCount / 2) * 100));
                        onAddXp(35);
                        onAddCoins(10);
                        setSelectedTopic(null);
                      }}
                      className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-[24px] border-b-6 border-emerald-700 hover:border-b-4 shadow-lg transition-all active:translate-y-1 active:border-b-2 flex items-center gap-2 btn-bouncy"
                      id="claim_rewards_dismiss_btn"
                    >
                      <span>📜 {lang === 'en' ? 'Claim Rewards & Return' : 'पुरस्कार प्राप्त करें और लौटें'}</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
