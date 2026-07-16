import React, { useState } from 'react';
import { translations } from '../data/translations';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, RotateCcw, Award, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GamesZoneProps {
  lang: 'en' | 'hi';
  onAddXp: (xp: number) => void;
  onAddCoins: (coins: number) => void;
}

export default function GamesZone({ lang, onAddXp, onAddCoins }: GamesZoneProps) {
  const t = translations[lang];
  const [activeGame, setActiveGame] = useState<'planets' | 'foodchain' | 'habitat' | 'memory'>('planets');

  // States: Planet Sorter
  const planetMasterList = [
    { id: 'mercury', nameEn: 'Mercury', nameHi: 'बुध', icon: '🪨', index: 0 },
    { id: 'venus', nameEn: 'Venus', nameHi: 'शुक्र', icon: '🌫️', index: 1 },
    { id: 'earth', nameEn: 'Earth', nameHi: 'पृथ्वी', icon: '🌍', index: 2 },
    { id: 'mars', nameEn: 'Mars', nameHi: 'मंगल', icon: '🔴', index: 3 },
    { id: 'jupiter', nameEn: 'Jupiter', nameHi: 'बृहस्पति', icon: '🪐', index: 4 },
    { id: 'saturn', nameEn: 'Saturn', nameHi: 'शनि', icon: '🪐', index: 5 },
    { id: 'uranus', nameEn: 'Uranus', nameHi: 'अरुण', icon: '🔵', index: 6 },
    { id: 'neptune', nameEn: 'Neptune', nameHi: 'वरुण', icon: '🔵', index: 7 },
  ];

  const [planetPool, setPlanetPool] = useState([...planetMasterList].sort(() => Math.random() - 0.5));
  const [planetUserOrder, setPlanetUserOrder] = useState<any[]>([]);
  const [planetGameSuccess, setPlanetGameSuccess] = useState(false);

  // States: Food Chain
  const foodChainMaster = [
    { id: 'sun', nameEn: 'Sun Energy', nameHi: 'सूर्य ऊर्जा', icon: '☀️', step: 0 },
    { id: 'grass', nameEn: 'Green Grass', nameHi: 'हरी घास', icon: '🌾', step: 1 },
    { id: 'bug', nameEn: 'Grasshopper', nameHi: 'टिड्डा', icon: '🦗', step: 2 },
    { id: 'frog', nameEn: 'Frog', nameHi: 'मेढक', icon: '🐸', step: 3 },
    { id: 'eagle', nameEn: 'Forest Eagle', nameHi: 'बाज', icon: '🦅', step: 4 }
  ];

  const [foodChainPool, setFoodChainPool] = useState([...foodChainMaster].sort(() => Math.random() - 0.5));
  const [foodChainUser, setFoodChainUser] = useState<any[]>([]);
  const [foodChainSuccess, setFoodChainSuccess] = useState(false);

  // States: Habitat match
  const [selectedAnimal, setSelectedAnimal] = useState<any | null>(null);
  const [habitatMatches, setHabitatMatches] = useState<Record<string, string>>({});
  const [habitatScore, setHabitatScore] = useState<number>(0);

  // States: Memory Match
  const memoryIcons = [
    { id: 'leaf', icon: '🌱' },
    { id: 'magnet', icon: '🧲' },
    { id: 'lightbulb', icon: '💡' },
    { id: 'atom', icon: '⚛️' },
    { id: 'water', icon: '💧' },
    { id: 'rocket', icon: '🚀' }
  ];

  function shuffleMemoryCards() {
    const list = [...memoryIcons, ...memoryIcons].map((item, index) => ({
      ...item,
      index
    }));
    return list.sort(() => Math.random() - 0.5);
  }

  const [memoryCards, setMemoryCards] = useState<any[]>(shuffleMemoryCards());
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);

  const celebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-4xl">🎮</span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-2">
          {lang === 'en' ? 'Science Games Zone' : 'विज्ञान खेल क्षेत्र'}
        </h2>
        <p className="text-slate-600 font-bold mt-1 max-w-xl mx-auto">
          {lang === 'en'
            ? 'Play mini-games to test your scientific superpower! Earn bonus coins and explorer ranks!'
            : 'अपने वैज्ञानिक महाशक्ति का परीक्षण करने के लिए मजेदार मिनी-गेम खेलें!'}
        </p>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { id: 'planets', titleEn: 'Planet Sorter', titleHi: 'ग्रहों का क्रम', icon: '🪐', descEn: 'Order planets from Sun', descHi: 'सूर्य से दूरी के क्रम में लगाएं' },
          { id: 'foodchain', titleEn: 'Food Chain Link', titleHi: 'खाद्य श्रृंखला', icon: '🐝', descEn: 'Build nature\'s food link', descHi: 'जीवों की श्रृंखला बनाएं' },
          { id: 'habitat', titleEn: 'Habitat Matcher', titleHi: 'आवास मिलान', icon: '🐾', descEn: 'Match animals to homes', descHi: 'जानवरों को उनके घर से मिलाएं' },
          { id: 'memory', titleEn: 'Memory Match', titleHi: 'याददाश्त का खेल', icon: '🧠', descEn: 'Match science pairs', descHi: 'विज्ञान के जोड़े खोजें' },
        ].map((g) => {
          const isSelected = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id as any)}
              className={`p-4 rounded-[24px] border-b-4 border-r transition-all duration-200 text-left flex items-start gap-3 btn-bouncy ${
                isSelected 
                  ? 'bg-blue-600 text-white border-blue-800 shadow-md' 
                  : 'bg-white hover:bg-blue-50/50 border-slate-200 text-slate-800 border-b-2'
              }`}
            >
              <span className="text-3xl">{g.icon}</span>
              <div>
                <h4 className="font-extrabold text-sm md:text-base">{lang === 'en' ? g.titleEn : g.titleHi}</h4>
                <p className={`text-[10px] leading-tight mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500 font-bold'}`}>
                  {lang === 'en' ? g.descEn : g.descHi}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE GAME CANVAS */}
      <div className="bg-white rounded-[32px] border-4 border-blue-100/80 p-6 md:p-8 min-h-[400px] relative shadow-xl">
        <AnimatePresence mode="wait">
          
          {/* GAME 1: PLANETS SORTER */}
          {activeGame === 'planets' && (
            <motion.div
              key="planets"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <span>🪐</span> {lang === 'en' ? 'Cosmic Planet Sorter' : 'ब्रह्मांडीय ग्रह सॉर्टर'}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {lang === 'en'
                    ? 'Click the planets in the correct order, starting from the closest to the Sun (Mercury) out to the furthest (Neptune)!'
                    : 'सूर्य के सबसे निकट (बुध) से शुरू करके सबसे दूर (नेपच्यून) तक के ग्रहों को सही क्रम में व्यवस्थित करें!'}
                </p>
              </div>

              {/* Game board */}
              {planetGameSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <span className="text-6xl animate-bounce block">✨🪐🚀</span>
                  <h4 className="text-2xl font-black text-emerald-600">
                    {lang === 'en' ? 'Superstellar Job!' : 'अद्भुत काम!'}
                  </h4>
                  <p className="text-slate-600 font-bold max-w-sm mx-auto">
                    {lang === 'en' 
                      ? 'You successfully sorted the Solar System! You earned +15 XP & 5 Coins!' 
                      : 'आपने सौर मंडल को सही क्रम में व्यवस्थित किया! आपको +15 अनुभव अंक और 5 सिक्के मिले!'}
                  </p>
                  <button
                    onClick={() => {
                      setPlanetUserOrder([]);
                      setPlanetGameSuccess(false);
                      // Shuffle
                      setPlanetPool([...planetMasterList].sort(() => Math.random() - 0.5));
                    }}
                    className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-sm rounded-xl border-2 border-slate-900 shadow-md btn-bouncy"
                  >
                    🔄 {lang === 'en' ? 'Play Again' : 'फिर से खेलें'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Sun and Orbit slots */}
                  <div className="bg-slate-900 rounded-2xl p-4 min-h-[140px] flex flex-col md:flex-row items-center gap-3 overflow-x-auto border-2 border-slate-950">
                    {/* The Sun */}
                    <div className="w-16 h-16 rounded-full bg-amber-400 border-4 border-orange-500 animate-pulse flex items-center justify-center font-black text-slate-900 text-xs shrink-0 shadow-lg">
                      ☀️ SUN
                    </div>

                    {/* Orbit lines / Slots */}
                    <div className="flex items-center gap-3 w-full justify-around">
                      {Array.from({ length: 8 }).map((_, idx) => {
                        const filledPlanet = planetUserOrder[idx];
                        return (
                          <div 
                            key={idx} 
                            className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex flex-col items-center justify-center relative shrink-0"
                          >
                            <span className="absolute top-0.5 text-[8px] font-mono text-slate-600 font-black">ORBIT {idx + 1}</span>
                            {filledPlanet ? (
                              <motion.div 
                                initial={{ scale: 0.7 }} 
                                animate={{ scale: 1 }}
                                className="flex flex-col items-center justify-center cursor-pointer"
                                onClick={() => {
                                  // Remove planet
                                  setPlanetUserOrder(prev => prev.filter(p => p.id !== filledPlanet.id));
                                  setPlanetPool(prev => [...prev, filledPlanet]);
                                }}
                              >
                                <span className="text-xl">{filledPlanet.icon}</span>
                                <span className="text-[8px] font-black text-white uppercase">{lang === 'en' ? filledPlanet.nameEn : filledPlanet.nameHi}</span>
                              </motion.div>
                            ) : (
                              <span className="text-xs text-slate-700 font-mono">?</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pool of planets to click */}
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-slate-400 block">{lang === 'en' ? 'Tap planets to place in orbit:' : 'कक्षा में स्थापित करने के लिए ग्रहों को स्पर्श करें:'}</span>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {planetPool.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            if (planetUserOrder.length < 8) {
                              const newOrder = [...planetUserOrder, p];
                              setPlanetUserOrder(newOrder);
                              setPlanetPool(prev => prev.filter(item => item.id !== p.id));
                              
                              // Check if completed 8
                              if (newOrder.length === 8) {
                                // Check if order matches
                                const correct = newOrder.every((item, idx) => item.index === idx);
                                if (correct) {
                                  setPlanetGameSuccess(true);
                                  onAddXp(15);
                                  onAddCoins(5);
                                  celebrate();
                                } else {
                                  // Fail reset
                                  alert(lang === 'en' ? 'Oh, orbits are mixed up! Let us try again!' : 'ओह, ग्रहों का क्रम गड़बड़ हो गया है! फिर से प्रयास करें!');
                                  setPlanetPool([...planetMasterList].sort(() => Math.random() - 0.5));
                                  setPlanetUserOrder([]);
                                }
                              }
                            }
                          }}
                          className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-2 border-slate-900 rounded-xl font-bold text-xs flex items-center gap-1.5 btn-bouncy"
                        >
                          <span className="text-lg">{p.icon}</span>
                          <span>{lang === 'en' ? p.nameEn : p.nameHi}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* GAME 2: FOOD CHAIN */}
          {activeGame === 'foodchain' && (
            <motion.div
              key="foodchain"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <span>🐝</span> {lang === 'en' ? 'Ecosystem Food Chain Connector' : 'पारिस्थितिकी खाद्य श्रृंखला'}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {lang === 'en'
                    ? 'Connect the creatures in order of who eats whom! Start with the primary solar source and end with the top forest predator!'
                    : 'जीवों को उनके भक्षण क्रम में जोड़ें! सौर ऊर्जा से शुरू करें और सर्वोच्च शिकारी पर समाप्त करें!'}
                </p>
              </div>

              {foodChainSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <span className="text-6xl animate-bounce block">🦅🌾🐸</span>
                  <h4 className="text-2xl font-black text-emerald-600">
                    {lang === 'en' ? 'Perfect Energy Balance!' : 'अद्भुत ऊर्जा संतुलन!'}
                  </h4>
                  <p className="text-slate-600 font-bold max-w-sm mx-auto">
                    {lang === 'en'
                      ? 'You completed the ecosystem flow perfectly! You earned +10 XP & 3 Coins!'
                      : 'आपने पारिस्थितिकी तंत्र के प्रवाह को पूरी तरह से समझा! आपको +10 अनुभव अंक और 3 सिक्के मिले!'}
                  </p>
                  <button
                    onClick={() => {
                      setFoodChainUser([]);
                      setFoodChainSuccess(false);
                      setFoodChainPool([...foodChainMaster].sort(() => Math.random() - 0.5));
                    }}
                    className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl border-2 border-slate-900 shadow-md btn-bouncy"
                  >
                    🔄 {lang === 'en' ? 'Play Again' : 'फिर से खेलें'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Energy Chain slots */}
                  <div className="flex flex-col md:flex-row justify-center items-center gap-3 bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-200">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const filledItem = foodChainUser[idx];
                      return (
                        <React.Fragment key={idx}>
                          <div className="w-20 h-24 rounded-2xl border-2 border-dashed border-emerald-300 bg-white flex flex-col items-center justify-center relative p-1.5 shrink-0 shadow-sm">
                            <span className="text-[8px] font-mono text-slate-400 absolute top-1 font-black">STEP {idx + 1}</span>
                            {filledItem ? (
                              <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="flex flex-col items-center justify-center cursor-pointer text-center"
                                onClick={() => {
                                  setFoodChainUser(prev => prev.filter(x => x.id !== filledItem.id));
                                  setFoodChainPool(prev => [...prev, filledItem]);
                                }}
                              >
                                <span className="text-2xl">{filledItem.icon}</span>
                                <span className="text-[9px] font-black leading-tight text-slate-800 mt-1">
                                  {lang === 'en' ? filledItem.nameEn : filledItem.nameHi}
                                </span>
                              </motion.div>
                            ) : (
                              <span className="text-lg text-slate-300 font-black">?</span>
                            )}
                          </div>
                          {idx < 4 && (
                            <ArrowRight className="w-5 h-5 text-emerald-400 shrink-0 rotate-90 md:rotate-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Option pool */}
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-slate-400 block">{lang === 'en' ? 'Tap organisms to link the chain:' : 'श्रृंखला जोड़ने के लिए जीवों को स्पर्श करें:'}</span>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {foodChainPool.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (foodChainUser.length < 5) {
                              const newChain = [...foodChainUser, item];
                              setFoodChainUser(newChain);
                              setFoodChainPool(prev => prev.filter(x => x.id !== item.id));

                              if (newChain.length === 5) {
                                const correct = newChain.every((x, idx) => x.step === idx);
                                if (correct) {
                                  setFoodChainSuccess(true);
                                  onAddXp(12);
                                  onAddCoins(4);
                                  celebrate();
                                } else {
                                  alert(lang === 'en' ? 'Whoops, nature does not feed this way! Try again!' : 'ओह, जीव इस प्रकार ऊर्जा नहीं पाते! फिर से प्रयास करें!');
                                  setFoodChainPool([...foodChainMaster].sort(() => Math.random() - 0.5));
                                  setFoodChainUser([]);
                                }
                              }
                            }
                          }}
                          className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-slate-900 rounded-xl font-bold text-xs flex items-center gap-1.5 btn-bouncy"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{lang === 'en' ? item.nameEn : item.nameHi}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* GAME 3: HABITAT MATCH */}
          {activeGame === 'habitat' && (
            <motion.div
              key="habitat"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <span>🐾</span> {lang === 'en' ? 'Animal Habitat Matcher' : 'प्राकृतिक आवास मिलान'}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {lang === 'en'
                    ? 'Match each amazing wild animal to the correct biome or environment where they live!'
                    : 'प्रत्येक अद्भुत जानवर का उसके सही पर्यावरण या प्राकृतिक आवास से मिलान करें!'}
                </p>
              </div>

              {habitatScore === 4 ? (
                <div className="text-center py-8 space-y-4">
                  <span className="text-6xl animate-bounce block">🐫🐻🐠</span>
                  <h4 className="text-2xl font-black text-emerald-600">
                    {lang === 'en' ? 'Habitat Warden!' : 'शानदार काम!'}
                  </h4>
                  <p className="text-slate-600 font-bold max-w-sm mx-auto">
                    {lang === 'en'
                      ? 'You successfully returned all animals to their cozy homes! You earned +10 XP & 3 Coins!'
                      : 'आपने सभी जानवरों को उनके घरों में पहुंचाया! आपको +10 अनुभव अंक और 3 सिक्के मिले!'}
                  </p>
                  <button
                    onClick={() => {
                      setHabitatScore(0);
                      setHabitatMatches({});
                    }}
                    className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-xl border-2 border-slate-900 shadow-md btn-bouncy"
                  >
                    🔄 {lang === 'en' ? 'Play Again' : 'फिर से खेलें'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Animals */}
                  <div className="space-y-3">
                    <span className="text-xs font-black uppercase text-slate-400 block">{lang === 'en' ? 'Step 1: Choose Animal' : 'चरण १: जानवर चुनें'}</span>
                    <div className="space-y-2">
                      {[
                        { id: 'camel', nameEn: 'Camel', nameHi: 'ऊँट', icon: '🐫', habitatId: 'desert' },
                        { id: 'fish', nameEn: 'Clownfish', nameHi: 'मछली', icon: '🐠', habitatId: 'ocean' },
                        { id: 'polar', nameEn: 'Polar Bear', nameHi: 'ध्रुवीय भालू', icon: '🐻', habitatId: 'arctic' },
                        { id: 'monkey', nameEn: 'Monkey', nameHi: 'बंदर', icon: '🐒', habitatId: 'jungle' },
                      ].map((animal) => {
                        const isMatched = !!habitatMatches[animal.id];
                        const isSelected = selectedAnimal?.id === animal.id;
                        return (
                          <button
                            key={animal.id}
                            disabled={isMatched}
                            onClick={() => setSelectedAnimal(animal)}
                            className={`w-full p-3 rounded-2xl border-2 border-slate-900 text-left flex items-center justify-between transition-all btn-bouncy ${
                              isMatched 
                                ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed' 
                                : isSelected 
                                ? 'bg-amber-400 text-slate-900' 
                                : 'bg-white hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{animal.icon}</span>
                              <span className="font-extrabold">{lang === 'en' ? animal.nameEn : animal.nameHi}</span>
                            </div>
                            {isMatched ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <span className="text-xs text-slate-400 font-bold">➔ MATCH</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Habitats */}
                  <div className="space-y-3">
                    <span className="text-xs font-black uppercase text-slate-400 block">{lang === 'en' ? 'Step 2: Choose Correct Home' : 'चरण २: सही घर चुनें'}</span>
                    <div className="space-y-2">
                      {[
                        { id: 'desert', nameEn: 'Sandy Desert', nameHi: 'रेतीला मरुस्थल', icon: '🌵' },
                        { id: 'ocean', nameEn: 'Deep Blue Ocean', nameHi: 'गहरा समुद्र', icon: '🌊' },
                        { id: 'arctic', nameEn: 'Icy Arctic', nameHi: 'ध्रुवीय बर्फ़ीला इलाका', icon: '❄️' },
                        { id: 'jungle', nameEn: 'Green Jungle Canopy', nameHi: 'हरा-भरा जंगल', icon: '🌳' },
                      ].map((hab) => {
                        const isUsed = Object.values(habitatMatches).includes(hab.id);
                        return (
                          <button
                            key={hab.id}
                            disabled={isUsed || !selectedAnimal}
                            onClick={() => {
                              if (selectedAnimal) {
                                if (selectedAnimal.habitatId === hab.id) {
                                  // Correct
                                  setHabitatMatches(prev => ({ ...prev, [selectedAnimal.id]: hab.id }));
                                  setHabitatScore(prev => prev + 1);
                                  setSelectedAnimal(null);
                                  onAddXp(3);
                                  if (habitatScore + 1 === 4) {
                                    onAddCoins(3);
                                    celebrate();
                                  }
                                } else {
                                  alert(lang === 'en' ? 'Oh! That is not where this animal thrives! Try again!' : 'ओह! यह जानवर यहाँ जीवित नहीं रह सकता! फिर से प्रयास करें!');
                                }
                              }
                            }}
                            className={`w-full p-3 rounded-2xl border-2 border-slate-900 text-left flex items-center justify-between transition-all btn-bouncy ${
                              isUsed 
                                ? 'bg-slate-100 text-slate-400 border-slate-300' 
                                : !selectedAnimal
                                ? 'bg-white opacity-60 text-slate-400 cursor-not-allowed'
                                : 'bg-white hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{hab.icon}</span>
                              <span className="font-extrabold">{lang === 'en' ? hab.nameEn : hab.nameHi}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-400">HOME</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* GAME 4: SCIENCE MEMORY */}
          {activeGame === 'memory' && (
            <motion.div
              key="memory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <span>🧠</span> {lang === 'en' ? 'Science Explorer Memory Match' : 'विज्ञान मेमोरी कार्ड खेल'}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {lang === 'en'
                    ? 'Flip cards and find pairs of essential science symbols! Train your brain focus!'
                    : 'कार्डों को पलटें और समान विज्ञान प्रतीकों के जोड़े खोजें!'}
                </p>
              </div>

              {memoryMatched.length === 12 ? (
                <div className="text-center py-8 space-y-4">
                  <span className="text-6xl animate-bounce block">🧠💡🎓</span>
                  <h4 className="text-2xl font-black text-emerald-600">
                    {lang === 'en' ? 'Brilliant Memory!' : 'तेज़ दिमाग!'}
                  </h4>
                  <p className="text-slate-600 font-bold max-w-sm mx-auto">
                    {lang === 'en'
                      ? 'You successfully found all pairs! You earned +15 XP & 4 Coins!'
                      : 'आपने सभी जोड़ियों को खोज निकाला! आपको +15 अनुभव अंक और 4 सिक्के मिले!'}
                  </p>
                  <button
                    onClick={() => {
                      setMemoryMatched([]);
                      setMemoryFlipped([]);
                      // Reshuffle cards
                      setMemoryCards(shuffleMemoryCards());
                    }}
                    className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-sm rounded-xl border-2 border-slate-900 shadow-md btn-bouncy"
                  >
                    🔄 {lang === 'en' ? 'Play Again' : 'फिर से खेलें'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                  {memoryCards.map((card, idx) => {
                    const isFlipped = memoryFlipped.includes(idx) || memoryMatched.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (memoryFlipped.length === 0) {
                            setMemoryFlipped([idx]);
                          } else if (memoryFlipped.length === 1 && memoryFlipped[0] !== idx) {
                            const firstIdx = memoryFlipped[0];
                            const firstCard = memoryCards[firstIdx];
                            
                            setMemoryFlipped([firstIdx, idx]);
                            
                            if (firstCard.id === card.id) {
                              // Match found
                              setTimeout(() => {
                                setMemoryMatched(prev => [...prev, firstIdx, idx]);
                                setMemoryFlipped([]);
                                onAddXp(3);
                                if (memoryMatched.length + 2 === 12) {
                                  onAddCoins(4);
                                  celebrate();
                                }
                              }, 600);
                            } else {
                              // No match
                              setTimeout(() => {
                                setMemoryFlipped([]);
                              }, 1000);
                            }
                          }
                        }}
                        className={`aspect-square rounded-2xl border-3 border-slate-900 flex items-center justify-center text-3xl font-bold transition-all duration-300 btn-bouncy ${
                          isFlipped ? 'bg-amber-100 rotate-180' : 'bg-slate-900 text-white'
                        }`}
                      >
                        <div className="rotate-180">
                          {isFlipped ? card.icon : '❓'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
