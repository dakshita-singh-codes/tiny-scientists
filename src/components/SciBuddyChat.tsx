import React, { useState, useEffect, useRef } from 'react';
import { UserProgress } from '../types';
import { translations } from '../data/translations';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Volume2, VolumeX, Mic, RotateCcw, AlertCircle } from 'lucide-react';

interface SciBuddyChatProps {
  progress: UserProgress;
  lang: 'en' | 'hi';
  soundEnabled: boolean;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function SciBuddyChat({ progress, lang, soundEnabled }: SciBuddyChatProps) {
  const t = translations[lang];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: t.scibuddyWelcome }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested questions based on grade/topics
  const promptSuggestions = [
    { en: "Why is the sky blue?", hi: "आसमान नीला क्यों होता है?" },
    { en: "How do plants eat?", hi: "पौधे भोजन कैसे बनाते हैं?" },
    { en: "How does gravity work?", hi: "गुरुत्वाकर्षण कैसे काम करता है?" },
    { en: "Why do magnets push?", hi: "चुंबक एक-दूसरे को क्यों ढकेलते हैं?" }
  ];

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle send message
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error('Brain disconnect!');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);

      // Trigger automatic Speech Synthesis if enabled
      if (soundEnabled) {
        speakText(data.text);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { role: 'model', text: lang === 'en' 
          ? "Whoops! SciBuddy's satellite link is dusty. Try asking again, Tiny Scientist!" 
          : "ओह! विज्ञान उपग्रह संपर्क टूट गया है। कृपया फिर से पूछें!" 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Browser Speech Synthesis
  const speakText = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speaking
      window.speechSynthesis.cancel();

      // Clean text of emojis for cleaner audio speech
      const cleaned = textToSpeak.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");

      const utterance = new SpeechSynthesisUtterance(cleaned);
      
      // Select appropriate voice based on language
      const voices = window.speechSynthesis.getVoices();
      const voiceLang = lang === 'en' ? 'en-IN' : 'hi-IN';
      
      const matchingVoice = voices.find(v => v.lang.includes(voiceLang) || v.lang.startsWith(lang));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* SciBuddy Interactive Avatar / Costume showcase */}
      <div className="bg-gradient-to-b from-indigo-50 to-indigo-100/50 rounded-3xl border-4 border-slate-900 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-md">
        
        {/* Floating science vectors */}
        <div className="absolute top-4 left-4 text-2xl opacity-20 animate-float">⚛️</div>
        <div className="absolute bottom-4 right-4 text-2xl opacity-20 animate-float-slow">🚀</div>

        {/* SciBuddy Mascot with accessories */}
        <div className="relative w-44 h-44 flex items-center justify-center bg-white rounded-full border-4 border-slate-900 shadow-inner mb-4">
          
          {/* Base Mascot robot emoji/icon */}
          <span className="text-7xl select-none animate-float">🤖</span>

          {/* ACCESSORIES LAYER FROM SHOP */}
          {progress.unlockedItems.includes('wig') && (
            <span className="absolute -top-4 text-5xl select-none z-10 animate-bounce">💇</span>
          )}
          {progress.unlockedItems.includes('goggles') && (
            <span className="absolute top-14 text-4xl select-none z-10">🥽</span>
          )}
          {progress.unlockedItems.includes('lab_coat') && (
            <span className="absolute -bottom-1 text-5xl select-none z-5">🥼</span>
          )}
          {progress.unlockedItems.includes('backpack') && (
            <span className="absolute -left-2 top-10 text-4xl select-none z-0">🎒</span>
          )}
        </div>

        <h3 className="text-xl font-black text-slate-800">🤖 SciBuddy AI Tutor</h3>
        <p className="text-xs font-bold text-slate-500 mt-1 max-w-xs">
          {lang === 'en'
            ? 'Your dynamic AI companion, answering questions instantly and supporting your scientific adventures!'
            : 'आपका रोबोट साथी, जो वैज्ञानिक सवालों के चुटकियों में जवाब देता है!'}
        </p>

        {/* Costume status indicator */}
        <div className="mt-4 bg-white/70 border-2 border-slate-900 rounded-xl px-3 py-1.5 text-[10px] font-black text-indigo-700">
          👗 {progress.unlockedItems.length} Accessories Unlocked
        </div>

        {/* Stop audio button */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-extrabold border-2 border-slate-900 btn-bouncy flex items-center gap-1.5"
          >
            <VolumeX className="w-4 h-4" />
            <span>{lang === 'en' ? 'Stop Speaking' : 'आवाज बंद करें'}</span>
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2 bg-white rounded-3xl border-4 border-slate-900 border-b-8 flex flex-col h-[500px] shadow-lg overflow-hidden">
        
        {/* Chat header status bar */}
        <div className="bg-slate-50 border-b-2 border-slate-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
              {lang === 'en' ? 'SciBuddy Satellite Link: ACTIVE' : 'साई-बडी लिंक: सक्रिय'}
            </span>
          </div>
          <button
            onClick={() => setMessages([{ role: 'model', text: t.scibuddyWelcome }])}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            title={lang === 'en' ? 'Reset Chat' : 'चैट रीसेट करें'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Message body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m, idx) => {
              const isUser = m.role === 'user';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: isUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl border-2 border-slate-900 shadow-sm relative ${
                      isUser
                        ? 'bg-indigo-500 text-white border-slate-900 rounded-tr-none'
                        : 'bg-slate-50 text-slate-800 border-slate-900 rounded-tl-none'
                    }`}
                  >
                    <p className="text-xs md:text-sm font-bold whitespace-pre-line leading-relaxed">
                      {m.text}
                    </p>

                    {/* Audio read-aloud button for SciBuddy responses */}
                    {!isUser && (
                      <button
                        onClick={() => speakText(m.text)}
                        className="absolute right-2 -bottom-3 p-1 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-lg border border-slate-900 shadow-sm transition-transform hover:scale-105"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-slate-100 border-2 border-slate-900 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <span className="text-lg animate-bounce">⚡</span>
                  <span className="text-xs font-black text-slate-500 tracking-wider animate-pulse">
                    {lang === 'en' ? "SCIBUDDY IS DISCOVERING..." : "साई-बडी सोच रहा है..."}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        {/* Suggestion prompt chips */}
        <div className="px-4 py-2 bg-slate-50 border-t-2 border-slate-100 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          {promptSuggestions.map((s, idx) => {
            const promptText = lang === 'en' ? s.en : s.hi;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(promptText)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-900 hover:bg-indigo-50 text-slate-700 hover:text-indigo-950 font-bold text-xs rounded-full transition-all select-none btn-bouncy"
              >
                🔍 {promptText}
              </button>
            );
          })}
        </div>

        {/* Input box */}
        <div className="p-3 border-t-2 border-slate-900 bg-white flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(input);
            }}
            className="flex-1 px-4 py-3 border-2 border-slate-900 rounded-xl bg-slate-50 text-sm font-bold focus:bg-white focus:outline-none"
            placeholder={t.askSomething}
            disabled={loading}
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || loading}
            className={`px-4 py-3 rounded-xl border-2 border-slate-900 font-black text-sm flex items-center gap-1.5 btn-bouncy ${
              input.trim() && !loading
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : 'bg-slate-100 text-slate-400 border-slate-300'
            }`}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t.send}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
