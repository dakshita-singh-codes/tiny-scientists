import React, { useState } from 'react';
import { UserProgress } from '../types';
import { translations } from '../data/translations';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Star, Flame, Sparkles, CheckCircle2, ShoppingBag, Download, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RewardsZoneProps {
  progress: UserProgress;
  lang: 'en' | 'hi';
  onAddCoins: (coins: number) => void;
  onUnlockItem: (itemId: string, price: number) => void;
}

export default function RewardsZone({ progress, lang, onAddCoins, onUnlockItem }: RewardsZoneProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'badges' | 'shop' | 'certificate'>('badges');
  
  // Custom Cert Input states
  const [certName, setCertName] = useState<string>(progress.name || 'Pranav Kumar');
  const [certTitle, setCertTitle] = useState<string>('Master Astronomer 🪐');

  const celebrate = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  // Badges lists
  const availableBadges = [
    { id: 'solar_expert', titleEn: 'Cosmic Captain', titleHi: 'अंतरिक्ष कप्तान', descEn: 'Score 100% on the Solar System Quiz', descHi: 'सौर मंडल प्रश्नोत्तरी में १००% अंक लाएं', icon: '🪐', xp: 50 },
    { id: 'water_cycle_expert', titleEn: 'Rainmaker', titleHi: 'वर्षा निर्माता', descEn: 'Score 100% on the Water Cycle Quiz', descHi: 'जल चक्र प्रश्नोत्तरी में १००% अंक लाएं', icon: '🌦', xp: 50 },
    { id: 'plant_expert', titleEn: 'Botanist Chief', titleHi: 'मुख्य वनस्पति वैज्ञानिक', descEn: 'Score 100% on the Plant Growth Quiz', descHi: 'पौधों की वृद्धि प्रश्नोत्तरी में १००% अंक लाएं', icon: '🌱', xp: 50 },
    { id: 'human_expert', titleEn: 'Bio Specialist', titleHi: 'जीवविज्ञान विशेषज्ञ', descEn: 'Score 100% on the Human Body Quiz', descHi: 'मानव शरीर प्रश्नोत्तरी में १००% अंक लाएं', icon: '🫀', xp: 50 },
    { id: 'circuit_expert', titleEn: 'Volt Sparker', titleHi: 'वोल्ट स्पार्कर', descEn: 'Score 100% on the Electricity Quiz', descHi: 'बिजली प्रश्नोत्तरी में १००% अंक लाएं', icon: '⚡', xp: 50 },
    { id: 'streak_explorer', titleEn: 'Infinite Scholar', titleHi: 'अथक छात्र', descEn: 'Earn a 3-day active science streak', descHi: '३ दिन तक लगातार सीखने का सफर पूरा करें', icon: '🔥', xp: 100 }
  ];

  // Shop items
  const shopItems = [
    { id: 'goggles', nameEn: 'Safety Goggles', nameHi: 'सुरक्षा चश्मा', icon: '🥽', price: 10, descEn: 'Protects SciBuddy during lab explosions!', descHi: 'साई-बडी को प्रयोगों के धमाकों से बचाएं!' },
    { id: 'backpack', nameEn: 'Antigravity Jetpack', nameHi: 'एंटी-ग्रेविटी जेटपैक', icon: '🎒', price: 25, descEn: 'SciBuddy can hover around orbits!', descHi: 'साई-बडी को अंतरिक्ष में उड़ने में मदद करें!' },
    { id: 'lab_coat', nameEn: 'Doctor Lab Coat', nameHi: 'डॉक्टर लैब कोट', icon: '🥼', price: 15, descEn: 'Gives SciBuddy a pro researcher vibe!', descHi: 'साई-बडी को एक प्रोफेशनल वैज्ञानिक रूप दें!' },
    { id: 'wig', nameEn: 'Einstein Haircut', nameHi: 'आइंस्टीन हेयरकट', icon: '💇', price: 20, descEn: 'Unlocks ultimate genius thoughts!', descHi: 'साई-बडी को बनाएं अल्टीमेट जीनियस!' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      
      {/* Rewards Header */}
      <div className="text-center mb-8">
        <span className="text-4xl">🏆</span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-2">
          {lang === 'en' ? 'My Science Vault & Rewards' : 'मेरे पुरस्कार और संग्रह'}
        </h2>
        <p className="text-slate-600 font-bold mt-1 max-w-xl mx-auto">
          {lang === 'en'
            ? 'Earn badges, customize your SciBuddy mascot, and generate printable scientist diplomas!'
            : 'बैज अर्जित करें, साई-बडी का श्रृंगार करें और वैज्ञानिक डिप्लोमा बनाएं!'}
        </p>
      </div>

      {/* Rewards sub-tabs */}
      <div className="flex border-b-4 border-slate-900 justify-center mb-8 gap-4 overflow-x-auto pb-0.5">
        {[
          { id: 'badges', labelEn: '🏆 Badges Earned', labelHi: '🏆 मेरे बैज' },
          { id: 'shop', labelEn: '🛒 SciBuddy Shop', labelHi: '🛒 साई-बडी शॉप' },
          { id: 'certificate', labelEn: '📜 Master Diploma', labelHi: '📜 मास्टर प्रमाण पत्र' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 font-extrabold text-sm md:text-base border-t-4 border-x-4 border-transparent rounded-t-2xl transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white border-slate-900 border-b-0'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {lang === 'en' ? tab.labelEn : tab.labelHi}
          </button>
        ))}
      </div>

      {/* REWARDS VAULT PANELS */}
      <div className="bg-white rounded-3xl border-4 border-slate-900 border-b-8 p-6 md:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: BADGES SHOWCASE */}
          {activeTab === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-1.5">
                    <Award className="w-6 h-6 text-indigo-500" />
                    <span>{t.badgesTitle}</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    {lang === 'en' ? 'Complete lessons with 100% quiz scores to unlock all legendary achievements!' : 'सभी पुरस्कार बैज खोलने के लिए प्रश्नोत्तरी में पूरे अंक लाएं!'}
                  </p>
                </div>
                <span className="text-sm bg-indigo-50 border border-indigo-200 text-indigo-800 px-3 py-1 rounded-xl font-black">
                  🛡️ {progress.badges.length} / {availableBadges.length} Unlocked
                </span>
              </div>

              {/* Grid of badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {availableBadges.map((badge) => {
                  // Simulate unlocking by check score or badges list
                  const isUnlocked = progress.badges.includes(badge.id) || progress.xp >= badge.xp;
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-2xl border-3 border-slate-900 flex items-center gap-4 transition-all relative ${
                        isUnlocked 
                          ? 'bg-amber-50/50 border-amber-400' 
                          : 'bg-slate-50 border-slate-300 opacity-60'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-full border-2 border-slate-900 flex items-center justify-center text-3xl shadow-sm shrink-0 select-none ${
                        isUnlocked ? 'bg-amber-400 animate-float' : 'bg-slate-200'
                      }`}>
                        {badge.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-slate-800 text-sm truncate">
                            {lang === 'en' ? badge.titleEn : badge.titleHi}
                          </h4>
                          {isUnlocked && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold leading-tight mt-0.5">
                          {lang === 'en' ? badge.descEn : badge.descHi}
                        </p>
                        <div className="mt-2.5">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                            isUnlocked 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            {isUnlocked ? '✦ UNLOCKED' : '🔒 LOCKED'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 2: MASCOT ITEM SHOP */}
          {activeTab === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-emerald-500" />
                    <span>{lang === 'en' ? 'SciBuddy Mascot Dressing Room' : 'साई-बडी का ड्रेसिंग रूम और दुकान'}</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    {lang === 'en' ? 'Spend your scientific coins to buy cool cosmetic accessories for SciBuddy! Show off your creations!' : 'अर्जित सिक्कों से साई-बडी के लिए मजेदार एसेसरीज खरीदें!'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3.5 py-1.5 rounded-xl font-black">
                  <span className="text-lg">🪙</span>
                  <span>{progress.coins} {lang === 'en' ? 'Coins Left' : 'सिक्के'}</span>
                </div>
              </div>

              {/* Shop item list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {shopItems.map((item) => {
                  const isBought = progress.unlockedItems.includes(item.id);
                  const canAfford = progress.coins >= item.price;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border-3 border-slate-900 flex flex-col justify-between transition-all relative text-center bg-slate-50/50 ${
                        isBought ? 'bg-emerald-50/30 border-emerald-400' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Costume visual */}
                        <div className={`w-16 h-16 rounded-2xl border-2 border-slate-900 mx-auto flex items-center justify-center text-4xl shadow-sm ${
                          isBought ? 'bg-emerald-100' : 'bg-white'
                        }`}>
                          {item.icon}
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-800 text-sm">
                            {lang === 'en' ? item.nameEn : item.nameHi}
                          </h4>
                          <p className="text-[10px] text-slate-500 leading-tight mt-1 font-medium">
                            {lang === 'en' ? item.descEn : item.descHi}
                          </p>
                        </div>
                      </div>

                      {/* Buy trigger */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        {isBought ? (
                          <span className="w-full py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{lang === 'en' ? 'Purchased' : 'खरीदा गया'}</span>
                          </span>
                        ) : (
                          <button
                            disabled={!canAfford}
                            onClick={() => {
                              onUnlockItem(item.id, item.price);
                              celebrate();
                            }}
                            className={`w-full py-2 rounded-xl font-black text-xs border-2 border-slate-900 shadow-sm transition-all btn-bouncy flex items-center justify-center gap-1 ${
                              canAfford
                                ? 'bg-yellow-400 hover:bg-yellow-500 text-slate-900'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300'
                            }`}
                          >
                            <span>🪙 {item.price}</span>
                            <span>{lang === 'en' ? 'Unlock Item' : 'अनलॉक करें'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: MASTER CERTIFICATE CREATOR */}
          {activeTab === 'certificate' && (
            <motion.div
              key="certificate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <span>📜</span> {lang === 'en' ? 'Science Academy Graduation Diploma' : 'नन्हें वैज्ञानिक प्रमाण पत्र'}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {lang === 'en' ? 'Create, view, and print your customized Scientific Expedition Certificate! Type your name and claim your rank!' : 'अपना नाम टाइप करें और अपनी सफलता का प्रमाण पत्र प्राप्त करें!'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Form fields */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-900 space-y-4">
                  <h4 className="font-extrabold text-slate-800 text-sm">✍️ {lang === 'en' ? 'Certificate Details' : 'प्रमाण पत्र विवरण'}</h4>
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">{lang === 'en' ? 'Enter Scientist Full Name:' : 'वैज्ञानिक का पूरा नाम लिखें:'}</label>
                    <input
                      type="text"
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-900 rounded-xl bg-white text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. Pranav Kumar"
                    />
                  </div>

                  {/* Scientific Title drop-select */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">{lang === 'en' ? 'Choose Scientific Title:' : 'वैज्ञानिक पद चुनें:'}</label>
                    <select
                      value={certTitle}
                      onChange={(e) => setCertTitle(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-900 rounded-xl bg-white text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 text-xs"
                    >
                      <option value="Master Astronomer 🪐">{lang === 'en' ? 'Master Astronomer 🪐' : 'मास्टर खगोलशास्त्री 🪐'}</option>
                      <option value="Eco-Saviour & Botanist 🌱">{lang === 'en' ? 'Eco-Saviour & Botanist 🌱' : 'वनस्पति वैज्ञानिक 🌱'}</option>
                      <option value="Quantum Circuit Designer ⚡">{lang === 'en' ? 'Quantum Circuit Designer ⚡' : 'सर्किट डिजाइनर ⚡'}</option>
                      <option value="Volcanologist Supreme 🌋">{lang === 'en' ? 'Volcanologist Supreme 🌋' : 'ज्वालामुखी विशेषज्ञ 🌋'}</option>
                      <option value="Mascot Chief Bio Scientist 🫀">{lang === 'en' ? 'Mascot Chief Bio Scientist 🫀' : 'जीवविज्ञानी प्रमुख 🫀'}</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      celebrate();
                      alert(lang === 'en' ? 'Diploma generation complete! You can take a screenshot or print this page!' : 'डिप्लोमा तैयार है! आप स्क्रीनशॉट ले सकते हैं या इसे प्रिंट कर सकते हैं!');
                    }}
                    className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-sm rounded-xl border-2 border-slate-900 shadow-sm flex items-center justify-center gap-2 btn-bouncy"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Generate & Claim Certificate' : 'प्रमाण पत्र तैयार करें'}</span>
                  </button>
                </div>

                {/* CERTIFICATE DISPLAY CANVAS TEMPLATE */}
                <div className="lg:col-span-2 bg-gradient-to-r from-amber-50 to-orange-50 border-8 border-double border-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between text-center shadow-lg min-h-[300px]">
                  
                  {/* Decorative background vectors */}
                  <div className="absolute top-2 left-2 text-3xl opacity-15">🪐</div>
                  <div className="absolute bottom-2 right-2 text-3xl opacity-15">🔬</div>
                  <div className="absolute top-4 right-6 text-3xl opacity-15">⚡</div>
                  <div className="absolute bottom-6 left-6 text-3xl opacity-15">🌱</div>

                  {/* Seal circle */}
                  <div className="absolute right-4 bottom-4 w-16 h-16 rounded-full bg-yellow-400 border-4 border-b-6 border-slate-900 flex items-center justify-center text-xl font-bold rotate-12 shadow-sm">
                    ⭐ SEAL
                  </div>

                  {/* Cert content */}
                  <div className="space-y-4">
                    <span className="text-2xl tracking-widest text-indigo-600 font-black block">TINY SCIENTISTS ACADEMY</span>
                    
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">{lang === 'en' ? 'Graduation Diploma' : 'सफलता का प्रमाण पत्र'}</h4>
                      <p className="text-xs text-slate-500 font-bold italic">{lang === 'en' ? 'This certifies that' : 'यह प्रमाणित किया जाता है कि'}</p>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 underline decoration-indigo-500 decoration-wavy py-1.5 font-serif">
                      {certName || 'Pranav Kumar'}
                    </h3>

                    <p className="text-xs text-slate-600 font-extrabold max-w-md mx-auto leading-relaxed">
                      {lang === 'en'
                        ? 'has successfully completed advanced virtual simulations, educational games, and lessons, qualifying with honor for the rank of'
                        : 'ने सफलतापूर्वक विज्ञान की वर्चुअल प्रयोगशाला, ज्ञानवर्धक खेलों और पाठों को पूरा कर सम्मान के साथ यह उपाधि प्राप्त की है:'}
                    </p>

                    <div className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-sm md:text-base border-2 border-amber-400 animate-pulse uppercase tracking-wider">
                      ★ {certTitle} ★
                    </div>
                  </div>

                  {/* Cert Footer */}
                  <div className="border-t border-slate-900/10 pt-4 mt-6 flex justify-between items-center text-[9px] text-slate-500 font-black font-mono">
                    <span>DATE: {new Date().toLocaleDateString()}</span>
                    <span>ISSUED BY: SCIBUDDY 🤖</span>
                    <span>STUDENT LEVEL: {progress.level}</span>
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
