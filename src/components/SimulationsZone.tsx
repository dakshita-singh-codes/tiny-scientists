import React, { useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { motion, AnimatePresence } from 'motion/react';
import { Thermometer, Zap, Activity, Sun, RefreshCw, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SimulationsZoneProps {
  lang: 'en' | 'hi';
  onAddXp: (xp: number) => void;
  onAddCoins: (coins: number) => void;
}

export default function SimulationsZone({ lang, onAddXp, onAddCoins }: SimulationsZoneProps) {
  const t = translations[lang];
  const [activeSim, setActiveSim] = useState<'volcano' | 'rainbow' | 'circuits' | 'gravity' | 'colors' | 'states'>('states');

  // States of Matter states
  const [temperature, setTemperature] = useState<number>(25);

  // Volcano states
  const [bakingSoda, setBakingSoda] = useState<number>(50);
  const [isErupting, setIsErupting] = useState<boolean>(false);

  // Gravity states
  const [gravityPlanet, setGravityPlanet] = useState<{ id: string, gravity: number, icon: string }>({
    id: 'earth',
    gravity: 9.8,
    icon: '🌍'
  });
  const [dropTrigger, setDropTrigger] = useState<number>(0);

  // Circuit states
  const [circuitSwitch, setCircuitSwitch] = useState<boolean>(false);
  const [circuitGapItem, setCircuitGapItem] = useState<{ id: string, nameEn: string, isConductor: boolean, icon: string }>({
    id: 'copper_key',
    nameEn: 'Steel Key',
    isConductor: true,
    icon: '🔑'
  });

  // Rainbow states
  const [prismAngle, setPrismAngle] = useState<number>(45);

  // Paint Mixer states
  const [mixColor1, setMixColor1] = useState<'Red' | 'None'>('None');
  const [mixColor2, setMixColor2] = useState<'Blue' | 'None'>('None');
  const [mixColor3, setMixColor3] = useState<'Yellow' | 'None'>('None');

  function calculateMix() {
    if (mixColor1 === 'Red' && mixColor2 === 'Blue' && mixColor3 === 'Yellow') return '#78350f'; // brown
    if (mixColor1 === 'Red' && mixColor2 === 'Blue') return '#8b5cf6'; // purple
    if (mixColor1 === 'Red' && mixColor3 === 'Yellow') return '#f97316'; // orange
    if (mixColor2 === 'Blue' && mixColor3 === 'Yellow') return '#22c55e'; // green
    if (mixColor1 === 'Red') return '#ef4444';
    if (mixColor2 === 'Blue') return '#3b82f6';
    if (mixColor3 === 'Yellow') return '#facc15';
    return '#f1f5f9'; // off-white
  }

  function calculateMixName() {
    if (mixColor1 === 'Red' && mixColor2 === 'Blue' && mixColor3 === 'Yellow') {
      return lang === 'en' ? '🤎 Brown' : '🤎 भूरा';
    }
    if (mixColor1 === 'Red' && mixColor2 === 'Blue') {
      return lang === 'en' ? '💜 Purple' : '💜 बैंगनी';
    }
    if (mixColor1 === 'Red' && mixColor3 === 'Yellow') {
      return lang === 'en' ? '🧡 Orange' : '🧡 नारंगी';
    }
    if (mixColor2 === 'Blue' && mixColor3 === 'Yellow') {
      return lang === 'en' ? '💚 Green' : '💚 हरा';
    }
    if (mixColor1 === 'Red') return lang === 'en' ? '❤️ Red' : '❤️ लाल';
    if (mixColor2 === 'Blue') return lang === 'en' ? '💙 Blue' : '💙 नीला';
    if (mixColor3 === 'Yellow') return lang === 'en' ? '💛 Yellow' : '💛 पीला';
    return lang === 'en' ? 'Empty Palette' : 'खाली पैलेट';
  }

  // Helper to trigger confetti
  const celebrate = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      
      {/* Simulation Header */}
      <div className="text-center mb-8">
        <span className="text-4xl">🧪</span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-2">
          {lang === 'en' ? 'Virtual Science Lab' : 'वर्चुअल विज्ञान प्रयोगशाला'}
        </h2>
        <p className="text-slate-600 font-bold mt-1 max-w-xl mx-auto">
          {lang === 'en' 
            ? 'Touch, slide, and mix things to see how nature works! It is completely safe and super fun!' 
            : 'स्पर्श करें, स्लाइड करें और चीजों को मिलाकर देखें कि प्रकृति कैसे काम करती है!'}
        </p>
      </div>

      {/* Simulator Select Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {[
          { id: 'states', nameEn: 'Matter States', nameHi: 'पदार्थ की अवस्था', icon: '🥛', color: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-400' },
          { id: 'volcano', nameEn: 'Volcano Erupt', nameHi: 'ज्वालामुखी विस्फोट', icon: '🌋', color: 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-400' },
          { id: 'gravity', nameEn: 'Gravity Drop', nameHi: 'गुरुत्वाकर्षण बल', icon: '🍎', color: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-400' },
          { id: 'circuits', nameEn: 'Sparky Circuit', nameHi: 'विद्युत सर्किट', icon: '⚡', color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-400' },
          { id: 'rainbow', nameEn: 'Rainbow Maker', nameHi: 'इंद्रधनुष निर्माता', icon: '🌈', color: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-indigo-400' },
          { id: 'colors', nameEn: 'Color Mixer', nameHi: 'रंगों का मिश्रण', icon: '🎨', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-400' },
        ].map((sim) => {
          const isActive = activeSim === sim.id;
          return (
            <button
              key={sim.id}
              onClick={() => setActiveSim(sim.id as any)}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-b-4 border-r transition-all duration-200 btn-bouncy ${
                isActive 
                  ? `${sim.color.split(' ')[0]} scale-105 border-b-4 border-blue-300 font-black shadow-md` 
                  : 'bg-white hover:bg-blue-50/50 border-slate-200 text-slate-700 font-bold border-b-2'
              }`}
            >
              <span className="text-2xl mb-1">{sim.icon}</span>
              <span className="text-xs text-center leading-tight">
                {lang === 'en' ? sim.nameEn : sim.nameHi}
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE SIMULATOR PANEL */}
      <div className="bg-white rounded-[32px] border-4 border-blue-100/80 p-6 md:p-8 min-h-[450px] relative shadow-xl">
        <AnimatePresence mode="wait">
          {activeSim === 'states' && (
            <motion.div
              key="states"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* States of matter simulation */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                    <span>🥛</span> {lang === 'en' ? 'States of Matter Simulator' : 'पदार्थ की अवस्था सिम्युलेटर'}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {lang === 'en' 
                      ? 'Water exists as solid ice, liquid water, or gas vapor. Heat up the beaker to watch the atoms break free and bounce rapidly! Cool it down to freeze them into a solid block!'
                      : 'पानी ठोस बर्फ, तरल पानी या गैस भाप के रूप में मौजूद है। बीकर को गर्म करके देखें कि कैसे परमाणु स्वतंत्र होकर तेजी से उछलते हैं!'}
                  </p>
                  
                  {/* Controls */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setTemperature(prev => Math.min(150, prev + 25));
                        onAddXp(2);
                      }}
                      className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl border-2 border-slate-900 btn-bouncy text-sm flex items-center gap-1.5 shadow-sm"
                    >
                      <span>🔥</span> {lang === 'en' ? 'Heat (+25°C)' : 'गर्म करें (+25°C)'}
                    </button>
                    <button
                      onClick={() => {
                        setTemperature(prev => Math.max(-50, prev - 25));
                        onAddXp(2);
                      }}
                      className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl border-2 border-slate-900 btn-bouncy text-sm flex items-center gap-1.5 shadow-sm"
                    >
                      <span>❄️</span> {lang === 'en' ? 'Cool (-25°C)' : 'ठंडा करें (-25°C)'}
                    </button>
                    <button
                      onClick={() => setTemperature(25)}
                      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl border-2 border-slate-900 btn-bouncy"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Temp indicator */}
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-900 max-w-xs">
                    <Thermometer className={`w-8 h-8 ${temperature > 80 ? 'text-red-500' : temperature < 0 ? 'text-blue-500' : 'text-amber-500'}`} />
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">{lang === 'en' ? 'Thermometer' : 'तापमान'}</span>
                      <span className="text-2xl font-black text-slate-800">{temperature}°C</span>
                    </div>
                    <span className="ml-auto text-xl">
                      {temperature >= 100 ? '💨 Gas' : temperature <= 0 ? '❄️ Solid' : '💧 Liquid'}
                    </span>
                  </div>
                </div>

                {/* VISUAL PANEL */}
                <div className="w-full max-w-xs h-64 bg-indigo-50 rounded-2xl border-4 border-slate-900 flex items-end justify-center p-3 relative overflow-hidden">
                  {/* Beaker back */}
                  <div className="absolute inset-x-8 bottom-3 top-10 border-4 border-t-0 border-slate-900 rounded-b-2xl bg-white/70 flex items-end justify-center overflow-hidden">
                    {/* Beaker fluid level background */}
                    {temperature > 0 && temperature < 100 && (
                      <motion.div 
                        animate={{ height: `${60 - (temperature * 0.2)}%` }}
                        className="absolute inset-x-0 bottom-0 bg-blue-300/40 border-t-2 border-blue-400"
                      />
                    )}

                    {/* Atoms */}
                    <div className="w-full h-full relative">
                      {Array.from({ length: 30 }).map((_, i) => {
                        const speed = Math.max(0.1, (temperature + 60) / 40);
                        const delay = i * 0.1;
                        return (
                          <motion.div
                            key={i}
                            animate={
                              temperature <= 0 
                                ? { // Solid structure - vibrating close together
                                    x: [((i % 5) * 20) + 15, ((i % 5) * 20) + 16, ((i % 5) * 20) + 15],
                                    y: [-(Math.floor(i / 5) * 20) - 20, -(Math.floor(i / 5) * 20) - 19, -(Math.floor(i / 5) * 20) - 20],
                                  }
                                : temperature >= 100
                                ? { // Gas - bouncing violently and flying out
                                    x: [Math.random() * 120 + 10, Math.random() * 120 + 10, Math.random() * 120 + 10],
                                    y: [-(Math.random() * 160 + 20), -(Math.random() * 160 + 20), -(Math.random() * 160 + 20)],
                                  }
                                : { // Liquid - sliding around lower half
                                    x: [((i % 5) * 22) + 10, ((i % 5) * 22) + Math.sin(i) * 12 + 10, ((i % 5) * 22) + 10],
                                    y: [-(Math.floor(i / 6) * 16) - 15, -(Math.floor(i / 6) * 16) - Math.cos(i) * 8 - 15, -(Math.floor(i / 6) * 16) - 15],
                                  }
                            }
                            transition={{
                              duration: temperature <= 0 ? 0.15 : temperature >= 100 ? 1 / speed : 2 / speed,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: delay,
                            }}
                            className={`absolute w-3.5 h-3.5 rounded-full border border-slate-900 shadow-inner ${
                              temperature <= 0 ? 'bg-blue-400' : temperature >= 100 ? 'bg-orange-400' : 'bg-sky-400'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Heat coils at bottom */}
                  <div className="absolute inset-x-4 bottom-0 h-3 flex justify-around">
                    {temperature > 25 && (
                      <motion.div 
                        animate={{ scaleY: [1, 1.4, 1] }} 
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="w-12 h-2 bg-red-500 rounded-t-full" 
                      />
                    )}
                    {temperature > 75 && (
                      <motion.div 
                        animate={{ scaleY: [1, 1.6, 1] }} 
                        transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }}
                        className="w-12 h-2 bg-orange-500 rounded-t-full" 
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSim === 'volcano' && (
            <motion.div
              key="volcano"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                    <span>🌋</span> {lang === 'en' ? 'Volcano Eruption Builder' : 'ज्वालामुखी विस्फोट सिम्युलेटर'}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {lang === 'en'
                      ? 'Mix Baking Soda and Vinegar inside SciBuddy\'s chemical volcano model. Adjust the slider to increase baking soda (the base) and watch the chemical reaction release massive CO2 gas bubbles and hot red foam!'
                      : 'साई-बडी के रासायनिक ज्वालामुखी मॉडल में बेकिंग सोडा और सिरका मिलाएं। बेकिंग सोडा बढ़ाने के लिए स्लाइडर को समायोजित करें और कार्बन डाइऑक्साइड गैस के साथ झाग का विस्फोट देखें!'}
                  </p>

                  {/* Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-xs text-slate-500">
                      <span>🧪 {lang === 'en' ? 'Baking Soda Amount' : 'बेकिंग सोडा मात्रा'}</span>
                      <span className="text-indigo-600 font-black">{bakingSoda}g</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={bakingSoda}
                      onChange={(e) => setBakingSoda(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-slate-900"
                    />
                  </div>

                  {/* Trigger */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setIsErupting(true);
                        onAddXp(10);
                        onAddCoins(3);
                        celebrate();
                        setTimeout(() => setIsErupting(false), 5000);
                      }}
                      className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-base rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_#000] btn-bouncy"
                    >
                      💥 {lang === 'en' ? 'Pour Vinegar & Erupt!' : 'सिरका डालें और विस्फोट करें!'}
                    </button>
                    {isErupting && (
                      <span className="text-rose-600 font-black animate-pulse self-center">
                        🔥 Erupting with {bakingSoda * 2.5}x force!
                      </span>
                    )}
                  </div>
                </div>

                {/* VOLCANO DISPLAY */}
                <div className="w-full max-w-xs h-72 bg-gradient-to-b from-sky-200 to-indigo-100 rounded-2xl border-4 border-slate-900 relative overflow-hidden flex items-end justify-center p-4">
                  {/* Flying sparks during eruption */}
                  {isErupting && Array.from({ length: 15 }).map((_, i) => {
                    const angle = Math.random() * 60 - 30; // degrees
                    const height = Math.random() * 120 + 80 + (bakingSoda * 0.8);
                    return (
                      <motion.div
                        key={i}
                        initial={{ bottom: 80, x: 0, scale: 0.5, opacity: 1 }}
                        animate={{ 
                          bottom: height,
                          x: angle,
                          scale: [0.5, 1.2, 0.2],
                          opacity: [1, 1, 0]
                        }}
                        transition={{
                          duration: Math.random() * 0.8 + 0.4,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                        className="absolute w-4 h-4 bg-orange-500 rounded-full border border-red-700 z-20"
                      />
                    );
                  })}

                  {/* Liquid flowing down */}
                  {isErupting && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: [0, 100, 100] }}
                      className="absolute w-24 bg-red-600 border-x-4 border-slate-900 bottom-10 z-10 flex flex-col items-center justify-start pt-2 rounded-t-3xl shadow-inner"
                    >
                      <div className="w-16 h-4 bg-yellow-400 rounded-full animate-pulse" />
                    </motion.div>
                  )}

                  {/* Volcano cone */}
                  <svg className={`w-64 h-36 z-10 ${isErupting ? 'animate-rumble' : ''}`} viewBox="0 0 100 50">
                    <polygon points="20,50 80,50 55,20 45,20" fill="#78350f" stroke="#000" strokeWidth="1.5" />
                    <polygon points="45,20 55,20 50,25" fill="#f97316" stroke="#000" strokeWidth="1.5" />
                    <ellipse cx="50" cy="20" rx="6" ry="2" fill="#ef4444" stroke="#000" strokeWidth="1" />
                  </svg>

                  {/* Grass bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-emerald-500 border-t-2 border-slate-900 z-15" />
                </div>
              </div>
            </motion.div>
          )}

          {activeSim === 'gravity' && (
            <motion.div
              key="gravity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                    <span>🍏</span> {lang === 'en' ? 'Gravity Dropper' : 'गुरुत्वाकर्षण ड्रॉप सिम्युलेटर'}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {lang === 'en'
                      ? 'Drop an apple and a feather in vacuum under different planetary gravities! Galileo discovered that without air friction, gravity pulls all items down at the same rate. See how fast things drop on giant Jupiter versus the tiny Moon!'
                      : 'विभिन्न ग्रहों के गुरुत्वाकर्षण के तहत एक सेब और पंख को निर्वात (vacuum) में गिराएं! देखें कि बृहस्पति की तुलना में चंद्रमा पर चीजें कितनी धीरे गिरती हैं!'}
                  </p>

                  {/* Planet selectors */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'earth', nameEn: 'Earth (9.8m/s²)', nameHi: 'पृथ्वी', gravity: 9.8, icon: '🌍' },
                      { id: 'moon', nameEn: 'Moon (1.6m/s²)', nameHi: 'चंद्रमा', gravity: 1.6, icon: '🌙' },
                      { id: 'jupiter', nameEn: 'Jupiter (24.8m/s²)', nameHi: 'बृहस्पति', gravity: 24.8, icon: '🪐' },
                      { id: 'space', nameEn: 'Zero Gravity', nameHi: 'शून्य गुरुत्वाकर्षण', gravity: 0.1, icon: '🛰️' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setGravityPlanet(p as any);
                          setDropTrigger(prev => prev + 1);
                          onAddXp(4);
                        }}
                        className={`px-3 py-2 rounded-xl border-2 border-slate-900 font-bold text-xs flex items-center gap-1.5 btn-bouncy ${
                          gravityPlanet.id === p.id ? 'bg-amber-400 text-slate-900 shadow-sm' : 'bg-white text-slate-700'
                        }`}
                      >
                        <span>{p.icon}</span>
                        <span>{lang === 'en' ? p.nameEn : p.nameHi}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setDropTrigger(prev => prev + 1);
                        onAddXp(2);
                      }}
                      className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl border-2 border-slate-900 btn-bouncy"
                    >
                      🚀 {lang === 'en' ? 'Drop Objects Again' : 'चीजें फिर से गिराएं'}
                    </button>
                  </div>
                </div>

                {/* DROP STAGE */}
                <div className="w-full max-w-xs h-72 bg-slate-900 rounded-2xl border-4 border-slate-900 relative overflow-hidden flex flex-col justify-between p-4">
                  {/* Vacuum Chamber indicator */}
                  <div className="text-[10px] text-amber-400 font-mono flex items-center justify-between uppercase border-b border-amber-400/30 pb-1">
                    <span>🌌 Chamber</span>
                    <span>Gravity: {gravityPlanet.gravity} m/s²</span>
                  </div>

                  <div className="w-full flex-1 relative mt-3">
                    {/* Object 1: Apple */}
                    <motion.div
                      key={`apple-${dropTrigger}`}
                      initial={{ top: 0 }}
                      animate={{ top: gravityPlanet.id === 'space' ? [0, 40, 20, 30] : 180 }}
                      transition={{ 
                        duration: gravityPlanet.id === 'space' ? 6 : Math.max(0.4, 2.5 / Math.sqrt(gravityPlanet.gravity)),
                        ease: gravityPlanet.id === 'space' ? "easeInOut" : "easeIn" 
                      }}
                      className="absolute left-1/4 -translate-x-1/2 flex flex-col items-center"
                    >
                      <span className="text-3xl filter drop-shadow">🍎</span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{lang === 'en' ? 'Apple' : 'सेब'}</span>
                    </motion.div>

                    {/* Object 2: Feather */}
                    <motion.div
                      key={`feather-${dropTrigger}`}
                      initial={{ top: 0 }}
                      animate={{ top: gravityPlanet.id === 'space' ? [0, 30, 45, 15] : 180 }}
                      transition={{ 
                        duration: gravityPlanet.id === 'space' ? 7 : Math.max(0.4, 2.5 / Math.sqrt(gravityPlanet.gravity)),
                        ease: gravityPlanet.id === 'space' ? "easeInOut" : "easeIn" 
                      }}
                      className="absolute right-1/4 translate-x-1/2 flex flex-col items-center"
                    >
                      <span className="text-3xl filter drop-shadow">🪶</span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{lang === 'en' ? 'Feather' : 'पंख'}</span>
                    </motion.div>

                    {/* Ground line */}
                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-slate-700 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSim === 'circuits' && (
            <motion.div
              key="circuits"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                    <span>⚡</span> {lang === 'en' ? 'Sparky Circuit Builder' : 'सर्किट बिल्डर प्रयोगशाला'}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {lang === 'en'
                      ? 'Help SciBuddy light up the glowing bulb! Toggle the switch and try placing different testing items in the gap. Conductors (copper key, spoon) let electrons flow to light the bulb. Insulators (wood stick, rubber eraser) block electrons, so the bulb stays dark!'
                      : 'बल्ब को जलाने में मदद करें! स्विच दबाएं और खाली जगह में अलग-अलग चीजें रखकर देखें कि कौन सुचालक (conductor) है और कौन कुचालक (insulator) है!'}
                  </p>

                  {/* Switch */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setCircuitSwitch(!circuitSwitch);
                        onAddXp(2);
                      }}
                      className={`px-5 py-3 rounded-2xl border-3 border-slate-900 font-black text-sm btn-bouncy ${
                        circuitSwitch ? 'bg-emerald-500 text-white shadow-inner' : 'bg-red-500 text-white shadow-sm'
                      }`}
                    >
                      🔌 {lang === 'en' ? `Toggle Switch: ${circuitSwitch ? 'CLOSED' : 'OPEN'}` : `स्विच: ${circuitSwitch ? 'चालू' : 'बंद'}`}
                    </button>
                  </div>

                  {/* Test items */}
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-slate-400 block">{lang === 'en' ? 'Place Material in the Circuit Gap' : 'सर्किट गैप में सामग्री रखें'}</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'copper_key', nameEn: 'Steel Key', nameHi: 'स्टील की चाबी', isConductor: true, icon: '🔑' },
                        { id: 'rubber', nameEn: 'Rubber Eraser', nameHi: 'रबर इरेज़र', isConductor: false, icon: '🧽' },
                        { id: 'coin', nameEn: 'Bronze Coin', nameHi: 'सिक्का', isConductor: true, icon: '🪙' },
                        { id: 'wood', nameEn: 'Wooden Ruler', nameHi: 'लकड़ी की पटरी', isConductor: false, icon: '📏' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCircuitGapItem(item);
                            onAddXp(3);
                            if (item.isConductor && circuitSwitch) celebrate();
                          }}
                          className={`px-3 py-2 rounded-xl border-2 border-slate-900 font-bold text-xs flex items-center gap-1.5 btn-bouncy ${
                            circuitGapItem.id === item.id ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{lang === 'en' ? item.nameEn : item.nameHi}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CIRCUIT VISUALBOARD */}
                <div className="w-full max-w-xs h-72 bg-amber-50 rounded-2xl border-4 border-slate-900 relative p-4 flex flex-col justify-between">
                  <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase text-center border-b border-slate-200 pb-1">
                    🔋 1.5V DC circuit board
                  </div>

                  <div className="w-full flex-1 relative mt-3">
                    {/* Visualizing simple circuit diagram using pure Tailwind and icons */}
                    
                    {/* Wires */}
                    <div className="absolute inset-x-12 top-10 bottom-12 border-4 border-dashed border-slate-400 rounded-xl pointer-events-none" />

                    {/* Switch component */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-7 z-10 flex flex-col items-center">
                      <span className="text-xl">🎛️</span>
                      <span className="text-[8px] bg-slate-900 text-white px-1.5 py-0.5 rounded-full font-black uppercase">
                        {circuitSwitch ? 'CLOSED' : 'OPEN'}
                      </span>
                    </div>

                    {/* Gap test item */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center bg-white p-2 rounded-xl border-2 border-slate-900 min-w-[70px]">
                      <span className="text-2xl">{circuitGapItem.icon}</span>
                      <span className="text-[8px] font-black text-center mt-1">
                        {circuitGapItem.isConductor ? 'Conductor' : 'Insulator'}
                      </span>
                    </div>

                    {/* Battery */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center bg-indigo-200 border-2 border-slate-900 p-1.5 rounded-xl">
                      <span className="text-xl">🔋</span>
                      <span className="text-[8px] font-black uppercase text-slate-700">1.5V Cell</span>
                    </div>

                    {/* Light bulb */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-5 z-10 flex flex-col items-center">
                      <span className={`text-4xl filter ${
                        circuitSwitch && circuitGapItem.isConductor 
                          ? 'text-yellow-400 drop-shadow-[0_0_12px_#fbbf24] animate-glow-circuit' 
                          : 'text-slate-300'
                      }`}>💡</span>
                      <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase mt-1">
                        {circuitSwitch && circuitGapItem.isConductor ? 'BULB GLOWS!' : 'DARK'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSim === 'rainbow' && (
            <motion.div
              key="rainbow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                    <span>🌈</span> {lang === 'en' ? 'Spectrum Rainbow Maker' : 'इंद्रधनुष निर्माता प्रयोगशाला'}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {lang === 'en'
                      ? 'Bend pure white sunlight into seven spectacular rainbow colors (VIBGYOR)! Slide the glass prism dial to change the refraction angle and watch the light disperse into red, orange, yellow, green, blue, indigo, and violet!'
                      : 'सफेद सूर्य के प्रकाश को सात रंगों (बैंगनी, जामुनी, नीला, हरा, पीला, नारंगी, लाल) में विभाजित करें! प्रिज्म एंगल स्लाइडर को घुमाएं और स्पेक्ट्रम को देखें।'}
                  </p>

                  {/* Angle slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-xs text-slate-500">
                      <span>💎 {lang === 'en' ? 'Glass Prism Angle' : 'प्रिज्म झुकाव कोण'}</span>
                      <span className="text-indigo-600 font-black">{prismAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="75"
                      value={prismAngle}
                      onChange={(e) => {
                        setPrismAngle(Number(e.target.value));
                        onAddXp(2);
                      }}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-slate-900"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-900 text-xs text-slate-700 font-bold space-y-1">
                    <p className="text-slate-800 font-extrabold text-sm flex items-center gap-1">
                      <span>💡</span> {lang === 'en' ? 'What is happening?' : 'क्या हो रहा है?'}
                    </p>
                    <p>
                      {lang === 'en'
                        ? 'White light is actually a team of seven colors! When they pass through glass, each color bends (refracts) at a slightly different angle because of their different speeds. Violet bends the most, and Red bends the least!'
                        : 'सफेद प्रकाश वास्तव में सात रंगों की टीम है! जब यह कांच से गुजरता है, तो प्रत्येक रंग अलग-अलग गति के कारण अलग-अलग कोण पर मुड़ता है (refract होता है)।'}
                    </p>
                  </div>
                </div>

                {/* RAINBOW VISUALSTAGE */}
                <div className="w-full max-w-xs h-72 bg-slate-950 rounded-2xl border-4 border-slate-900 relative p-4 overflow-hidden flex flex-col justify-between">
                  <div className="text-[9px] text-slate-400 font-mono flex items-center justify-between uppercase">
                    <span>🔬 Optical Lab</span>
                    <span className="text-indigo-400 animate-pulse">Dispersing Light</span>
                  </div>

                  {/* Interactive SVG Prism representation */}
                  <div className="w-full flex-1 relative mt-2">
                    <svg className="w-full h-full" viewBox="0 0 100 80">
                      {/* Sun ray (White) */}
                      <line x1="5" y1="50" x2="45" y2="40" stroke="#ffffff" strokeWidth="2.5" />
                      <text x="5" y="44" fill="#ffffff" fontSize="5" fontWeight="bold">SUNLIGHT</text>

                      {/* Glass Prism triangle */}
                      <polygon points="35,60 65,60 50,25" fill="rgba(255,255,255,0.15)" stroke="#67e8f9" strokeWidth="1.5" />
                      <text x="44" y="55" fill="#67e8f9" fontSize="6" fontWeight="extrabold">PRISM</text>

                      {/* Dispersed Colors (Spectrum) */}
                      {/* We dynamically bend them based on prismAngle */}
                      {[
                        { color: '#ef4444', deltaY: 0, label: 'R' },
                        { color: '#f97316', deltaY: 2, label: 'O' },
                        { color: '#facc15', deltaY: 4, label: 'Y' },
                        { color: '#22c55e', deltaY: 6, label: 'G' },
                        { color: '#3b82f6', deltaY: 8, label: 'B' },
                        { color: '#4f46e5', deltaY: 10, label: 'I' },
                        { color: '#a855f7', deltaY: 12, label: 'V' }
                      ].map((col, idx) => {
                        const targetY = 30 + col.deltaY + (prismAngle * 0.25);
                        return (
                          <g key={idx}>
                            {/* Inside prism bending ray */}
                            <line 
                              x1="45" 
                              y1="40" 
                              x2="53" 
                              y2={40 + (col.deltaY * 0.4)} 
                              stroke={col.color} 
                              strokeWidth="1.2" 
                              opacity="0.8" 
                            />
                            {/* Outside prism dispersing ray */}
                            <line 
                              x1="53" 
                              y1={40 + (col.deltaY * 0.4)} 
                              x2="95" 
                              y2={targetY} 
                              stroke={col.color} 
                              strokeWidth="1.8" 
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSim === 'colors' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                    <span>🎨</span> {lang === 'en' ? 'Mascot Paint Color Mixer' : 'रंग मिश्रण प्रयोगात्मक प्रयोगशाला'}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {lang === 'en'
                      ? 'Mix primary colors (Red, Blue, Yellow) in SciBuddy\'s virtual paint tubes to discover secondary and tertiary colors! Tap paint blobs to mix them!'
                      : 'लाल, नीले और पीले रंगों को मिलाकर नए-नए रंग बनाएं! पेंट की बूंदों को स्पर्श करें और नए रंगों की जादुई उत्पत्ति देखें।'}
                  </p>

                  {/* Tube triggers */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setMixColor1(prev => prev === 'Red' ? 'None' : 'Red');
                        onAddXp(2);
                      }}
                      className={`px-4 py-3 rounded-2xl border-2 border-slate-900 font-black btn-bouncy ${
                        mixColor1 === 'Red' ? 'bg-red-500 text-white shadow-inner' : 'bg-white hover:bg-slate-100 text-red-500'
                      }`}
                    >
                      🔴 {lang === 'en' ? 'Red Paint' : 'लाल रंग'}
                    </button>
                    <button
                      onClick={() => {
                        setMixColor2(prev => prev === 'Blue' ? 'None' : 'Blue');
                        onAddXp(2);
                      }}
                      className={`px-4 py-3 rounded-2xl border-2 border-slate-900 font-black btn-bouncy ${
                        mixColor2 === 'Blue' ? 'bg-blue-500 text-white shadow-inner' : 'bg-white hover:bg-slate-100 text-blue-500'
                      }`}
                    >
                      🔵 {lang === 'en' ? 'Blue Paint' : 'नीला रंग'}
                    </button>
                    <button
                      onClick={() => {
                        setMixColor3(prev => prev === 'Yellow' ? 'None' : 'Yellow');
                        onAddXp(2);
                      }}
                      className={`px-4 py-3 rounded-2xl border-2 border-slate-900 font-black btn-bouncy ${
                        mixColor3 === 'Yellow' ? 'bg-yellow-400 text-slate-800 shadow-inner' : 'bg-white hover:bg-slate-100 text-yellow-500'
                      }`}
                    >
                      🟡 {lang === 'en' ? 'Yellow Paint' : 'पीला रंग'}
                    </button>
                  </div>

                  {/* Reset mixing */}
                  <button
                    onClick={() => {
                      setMixColor1('None');
                      setMixColor2('None');
                      setMixColor3('None');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-black uppercase tracking-wider block"
                  >
                    🔄 Clear Palette
                  </button>
                </div>

                {/* MIX STAGE */}
                <div className="w-full max-w-xs h-72 bg-indigo-50 rounded-2xl border-4 border-slate-900 relative p-4 flex flex-col justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    🎨 Mixed Color Result
                  </span>

                  {/* Painter Palette representation */}
                  <div className="w-48 h-48 bg-white rounded-full border-4 border-slate-900 relative shadow-inner flex items-center justify-center">
                    {/* Secondary/Mixed Color circle */}
                    <div 
                      className="w-32 h-32 rounded-full border-4 border-slate-900 transition-all duration-500 flex flex-col items-center justify-center p-3 text-center"
                      style={{ backgroundColor: calculateMix() }}
                    >
                      <span className="text-slate-900 font-black text-sm uppercase px-2 py-1 bg-white/85 rounded-full border border-slate-950">
                        {calculateMixName()}
                      </span>
                    </div>

                    {/* Paint blobs */}
                    {mixColor1 === 'Red' && (
                      <div className="absolute top-2 left-6 w-8 h-8 rounded-full bg-red-500 border-2 border-slate-900 animate-pulse" />
                    )}
                    {mixColor2 === 'Blue' && (
                      <div className="absolute bottom-2 right-6 w-8 h-8 rounded-full bg-blue-500 border-2 border-slate-900 animate-pulse" />
                    )}
                    {mixColor3 === 'Yellow' && (
                      <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-8 h-8 rounded-full bg-yellow-400 border-2 border-slate-900 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
