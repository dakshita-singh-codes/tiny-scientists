import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, Compass, CheckCircle, RotateCcw, 
  ZoomIn, ZoomOut, Shield, Cloud, Snowflake, 
  Sparkles, Award, Play, Volume2, VolumeX, Eye, HelpCircle, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProgress } from '../types';

interface SpaceMissionProps {
  progress: UserProgress;
  lang: 'en' | 'hi';
  onAddXp: (xp: number) => void;
  onAddCoins: (coins: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

interface Planet {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  color: string;
  distance: number; // orbital radius
  speed: number;    // angular speed multiplier
  size: string;
  introEn: string;
  introHi: string;
  factsEn: string[];
  factsHi: string[];
  missionTitleEn: string;
  missionTitleHi: string;
}

export default function SpaceMission({
  progress,
  lang,
  onAddXp,
  onAddCoins,
  onUnlockBadge
}: SpaceMissionProps) {
  // Game states
  const [hasStarted, setHasStarted] = useState(false);
  const [astronautName, setAstronautName] = useState(progress.name || 'Pranav');
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchCountdown, setLaunchCountdown] = useState(3);
  
  // Interactive Cosmos states
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isOrbiting, setIsOrbiting] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [activeMission, setActiveMission] = useState<string | null>(null); // 'mercury', 'venus', 'mars', 'saturn', 'neptune'
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Completed missions state (persisted locally during session or progress)
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  
  // Mission-specific game states
  // Mercury: Cooling game
  const [mercuryTemp, setMercuryTemp] = useState(430); // in °C
  const [mercurySecsLeft, setMercurySecsLeft] = useState(15);
  const [mercuryShieldStatus, setMercuryShieldStatus] = useState<'playing' | 'win' | 'lose'>('playing');

  // Venus: Cloud Sweeper
  const [cloudsSwept, setCloudsSwept] = useState<number[]>([]); // indexes of swept cloud blocks
  const cloudCount = 12;

  // Mars: Dust storm rover recovery
  const [dustLayers, setDustLayers] = useState<Record<number, number>>({
    0: 100, 1: 100, 2: 100, 3: 100 // four solar panels with 100% dust
  });
  const [marsRoverState, setMarsRoverState] = useState<'dusty' | 'ready' | 'exploring'>('dusty');

  // Saturn: Ice rock counter
  const [ringsRotated, setRingsRotated] = useState(0);
  const [collectedIce, setCollectedIce] = useState<number>(0);
  const [iceLocations, setIceLocations] = useState<{ id: number; x: number; y: number; clicked: boolean }[]>([]);

  // Neptune: Storm finder (Spotlight search)
  const [spotlightPos, setSpotlightPos] = useState({ x: 120, y: 120 });
  const [stormFound, setStormFound] = useState(false);
  
  // Planet positions (derived using orbital mechanics & requestAnimationFrame)
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Twinkling stars list
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);
  // Random shooting comets
  const [comet, setComet] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // References for drag-drop
  const spaceAreaRef = useRef<HTMLDivElement>(null);

  // Initialize stars once
  useEffect(() => {
    const starList = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3
    }));
    setStars(starList);
  }, []);

  // Planetary orbit loop
  useEffect(() => {
    if (!isOrbiting) return;
    let animationId: number;
    const updateAngle = () => {
      setOrbitAngle(prev => (prev + 0.15) % 360);
      animationId = requestAnimationFrame(updateAngle);
    };
    animationId = requestAnimationFrame(updateAngle);
    return () => cancelAnimationFrame(animationId);
  }, [isOrbiting]);

  // Shooting comet trigger
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setComet({ x: Math.random() * 40, y: Math.random() * 30, active: true });
        setTimeout(() => {
          setComet(prev => ({ ...prev, active: false }));
        }, 1200);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Mercury countdown
  useEffect(() => {
    if (activeMission !== 'mercury' || mercuryShieldStatus !== 'playing') return;
    if (mercurySecsLeft <= 0) {
      if (mercuryTemp <= 80) {
        setMercuryShieldStatus('win');
        celebrateMission('mercury');
      } else {
        setMercuryShieldStatus('lose');
      }
      return;
    }
    const timer = setTimeout(() => {
      setMercurySecsLeft(prev => prev - 1);
      // Gradually heat up again if they are slow
      setMercuryTemp(prev => Math.min(430, prev + 15));
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeMission, mercurySecsLeft, mercuryShieldStatus, mercuryTemp]);

  // Planet definitions
  const planets: Planet[] = [
    {
      id: 'mercury',
      nameEn: 'Mercury',
      nameHi: 'बुध',
      icon: '🪨',
      color: 'bg-zinc-400 border-zinc-500 text-zinc-950',
      distance: 65,
      speed: 1.6,
      size: 'w-8 h-8 md:w-9 md:h-9',
      introEn: "I am Mercury, the closest planet to the Sun! I have no atmosphere, which means I bake in blistering heat at day (430°C) and freeze in icy dark at night (-180°C)!",
      introHi: "मैं बुध हूँ, सूर्य का सबसे करीबी ग्रह! मेरा कोई वायुमंडल नहीं है, जिसका अर्थ है कि मैं दिन में भीषण गर्मी (430°C) में तपता हूँ और रात में बर्फीले अंधेरे (-180°C) में जम जाता हूँ!",
      factsEn: [
        "A year on Mercury is only 88 Earth days long!",
        "It is the smallest planet in our Solar System.",
        "It has zero moons to keep it company."
      ],
      factsHi: [
        "बुध पर एक वर्ष पृथ्वी के केवल 88 दिनों का होता है!",
        "यह हमारे सौर मंडल का सबसे छोटा ग्रह है।",
        "इसका साथ देने के लिए इसके पास कोई चंद्रमा नहीं है।"
      ],
      missionTitleEn: "Mercury Thermal Shield Defense",
      missionTitleHi: "बुध थर्मल शील्ड रक्षा"
    },
    {
      id: 'venus',
      nameEn: 'Venus',
      nameHi: 'शुक्र',
      icon: '🌫️',
      color: 'bg-amber-300 border-amber-500 text-amber-950',
      distance: 95,
      speed: 1.2,
      size: 'w-10 h-10 md:w-12 md:h-12',
      introEn: "I am Venus, Earth's volcanic twin! My thick atmosphere of Carbon Dioxide acts like a heavy blanket, trapping heat and making me the HOTTEST planet in the solar system (460°C)!",
      introHi: "मैं शुक्र हूँ, पृथ्वी का जुड़वां ज्वालामुखी ग्रह! कार्बन डाइऑक्साइड का मेरा गाढ़ा वायुमंडल एक भारी कंबल की तरह काम करता है, जो गर्मी को सोख लेता है और मुझे सौर मंडल का सबसे गर्म ग्रह (460°C) बनाता है!",
      factsEn: [
        "Venus spins backward on its axis compared to most other planets!",
        "Its thick yellow sulfurous clouds reflect sunlight brilliantly, making it the brightest 'star' in our evening sky.",
        "A single day on Venus is longer than its whole year!"
      ],
      factsHi: [
        "शुक्र अन्य सभी ग्रहों की तुलना में अपनी धुरी पर विपरीत दिशा में घूमता है!",
        "इसके पीले सल्फर के बादल सूर्य की रोशनी को चमकाते हैं, जिससे यह शाम का सबसे चमकदार तारा दिखता है।",
        "शुक्र पर एक दिन उसके एक पूरे वर्ष से भी बड़ा होता है!"
      ],
      missionTitleEn: "Venus Atmosphere Sweeper",
      missionTitleHi: "शुक्र वायुमंडल क्लीनर"
    },
    {
      id: 'earth',
      nameEn: 'Earth',
      nameHi: 'पृथ्वी',
      icon: '🌍',
      color: 'bg-blue-500 border-blue-700 text-blue-100',
      distance: 130,
      speed: 1.0,
      size: 'w-11 h-11 md:w-13 md:h-13',
      introEn: "I am Earth, your beautiful home! I am the only planet known to host liquid water oceans and oxygen-breathing life. My perfect distance from the Sun is called the 'Goldilocks Zone'!",
      introHi: "मैं पृथ्वी हूँ, आपका खूबसूरत घर! मैं एकमात्र ऐसा ग्रह हूँ जहाँ पानी के महासागर और ऑक्सीजन से सांस लेने वाला जीवन मौजूद है। सूर्य से मेरी आदर्श दूरी को 'गोल्डीलॉक्स ज़ोन' कहा जाता है!",
      factsEn: [
        "Over 70% of Earth is covered in sparkling water oceans.",
        "Earth is protected by a strong magnetic shield that blocks harmful solar storms.",
        "We have one beautiful white Moon that creates ocean tides."
      ],
      factsHi: [
        "पृथ्वी का ७०% से अधिक हिस्सा चमकीले महासागरों से ढका हुआ है।",
        "पृथ्वी एक मजबूत चुंबकीय ढाल द्वारा सौर तूफानों से सुरक्षित है।",
        "हमारा एक सुंदर सफेद चंद्रमा है जो समुद्र में ज्वार-भाटा पैदा करता है।"
      ],
      missionTitleEn: "Earth Science Beacon",
      missionTitleHi: "पृथ्वी विज्ञान बीकन"
    },
    {
      id: 'mars',
      nameEn: 'Mars',
      nameHi: 'मंगल',
      icon: '🔴',
      color: 'bg-red-500 border-red-700 text-red-100',
      distance: 165,
      speed: 0.8,
      size: 'w-9 h-9 md:w-10 md:h-10',
      introEn: "I am Mars, the rusty Red Planet! My soil is rich in iron oxide (rust), which gives me my signature crimson glow. Liquid water used to flow here, and NASA's rovers are searching for ancient alien fossil footprints right now!",
      introHi: "मैं मंगल हूँ, लाल ग्रह! मेरी मिट्टी आयरन ऑक्साइड (जंग) से भरपूर है, जो मुझे लाल रंग देती है। यहाँ कभी पानी बहता था, और नासा के रोवर अभी वहां प्राचीन सूक्ष्म जीवों के जीवाश्म खोज रहे हैं!",
      factsEn: [
        "Mars is home to Olympus Mons, the tallest volcano in the solar system, three times higher than Mount Everest!",
        "It has two tiny potato-shaped moons named Phobos and Deimos.",
        "Mars has giant polar ice caps made of frozen water and dry ice (CO₂)."
      ],
      factsHi: [
        "मंगल पर ओलंपस मॉन्स है, जो सौर मंडल का सबसे ऊंचा ज्वालामुखी है, यह माउंट एवरेस्ट से तीन गुना ऊंचा है!",
        "इसके फोबोस और डीमोस नाम के दो छोटे आलू के आकार के चंद्रमा हैं।",
        "मंगल पर जमी हुई बर्फ और सूखी बर्फ से बने विशाल ध्रुवीय बर्फ के टुकड़े मौजूद हैं।"
      ],
      missionTitleEn: "Mars Rover Dust Sweeper",
      missionTitleHi: "मंगल रोवर डस्ट क्लीनर"
    },
    {
      id: 'jupiter',
      nameEn: 'Jupiter',
      nameHi: 'बृहस्पति',
      icon: '🪐',
      color: 'bg-orange-400 border-orange-600 text-orange-950',
      distance: 210,
      speed: 0.5,
      size: 'w-16 h-16 md:w-20 md:h-20',
      introEn: "I am Jupiter, the undisputed King of the Planets! I am a giant ball of gas, so heavy that more than 1,300 Earths could pack inside me. I have a giant spinning hurricane storm called the Great Red Spot!",
      introHi: "मैं बृहस्पति हूँ, सभी ग्रहों का राजा! मैं गैस का एक विशाल गोला हूँ, इतना भारी कि मेरे अंदर १३०० से अधिक पृथ्वियां समा सकती हैं। मेरे ऊपर 'ग्रेट रेड स्पॉट' नाम का एक विशाल घूमता हुआ तूफान है!",
      factsEn: [
        "Jupiter has over 95 moons! The biggest, Ganymede, is larger than the planet Mercury.",
        "It spins incredibly fast, completing a full day in just 10 hours!",
        "Its powerful gravity acts like a space shield, sucking in dangerous comets and protecting Earth."
      ],
      factsHi: [
        "बृहस्पति के पास ९५ से अधिक चंद्रमा हैं! सबसे बड़ा चंद्रमा, गेनीमेड, बुध ग्रह से भी बड़ा है।",
        "यह बहुत तेजी से घूमता है, केवल १० घंटों में अपना एक दिन पूरा कर लेता है!",
        "इसका शक्तिशाली गुरुत्वाकर्षण बल खतरनाक धूमकेतुओं को खींचकर पृथ्वी की रक्षा करता है।"
      ],
      missionTitleEn: "Jupiter Gravity Shield Pioneer",
      missionTitleHi: "बृहस्पति गुरुत्वाकर्षण ढाल"
    },
    {
      id: 'saturn',
      nameEn: 'Saturn',
      nameHi: 'शनि',
      icon: '🪐',
      color: 'bg-yellow-200 border-yellow-400 text-yellow-950',
      distance: 260,
      speed: 0.35,
      size: 'w-14 h-14 md:w-18 md:h-18',
      introEn: "I am Saturn, the solar system's jewel! I am famous for my spectacular, wide rings made of billions of chunks of glittering ice, cosmic dust, and rocky debris!",
      introHi: "मैं शनि हूँ, सौर मंडल का आभूषण! मैं बर्फ के अरबों टुकड़ों, अंतरिक्ष धूल और चट्टानों से बने अपने शानदार चमकीले छल्लों (rings) के लिए प्रसिद्ध हूँ!",
      factsEn: [
        "Saturn is the least dense planet—it is so light that if you could find a bathtub big enough, Saturn would float on water like a toy duck!",
        "Its rings are extremely wide but very thin, only about 10 meters thick in most places.",
        "Its largest moon, Titan, has its own thick atmosphere and lakes of liquid methane!"
      ],
      factsHi: [
        "शनि पानी से भी कम घना है—यह इतना हल्का है कि यदि कोई विशाल टब मिले, तो यह पानी पर तैरने लगेगा!",
        "इसके छल्ले बेहद चौड़े हैं लेकिन बहुत पतले हैं, अधिकांश स्थानों पर केवल १० मीटर मोटे।",
        "इसके सबसे बड़े चंद्रमा टाइटन के पास अपना घना वायुमंडल और तरल मीथेन की झीलें हैं!"
      ],
      missionTitleEn: "Saturn Ring Ice Counter",
      missionTitleHi: "शनि वलय बर्फ काउंटर"
    },
    {
      id: 'uranus',
      nameEn: 'Uranus',
      nameHi: 'अरुण',
      icon: '🔵',
      color: 'bg-teal-300 border-teal-500 text-teal-950',
      distance: 310,
      speed: 0.2,
      size: 'w-12 h-12 md:w-14 md:h-14',
      introEn: "I am Uranus, the lazy, icy giant! Unlike any other planet, I roll completely on my side like a bowling ball as I orbit. I am filled with icy methane and water clouds, making me extremely cold (-220°C)!",
      introHi: "मैं अरुण हूँ, आलसी बर्फीला दानव! अन्य ग्रहों के विपरीत, मैं अपनी धुरी पर ९८ डिग्री झुका हुआ हूँ और गेंद की तरह लुढ़कते हुए चक्कर लगाता हूँ! मैं मीथेन गैस के कारण हल्के नीले रंग का दिखता हूँ।",
      factsEn: [
        "Uranus was the very first planet discovered using a modern telescope!",
        "It has 13 faint rings of its own.",
        "Methane gas in its atmosphere absorbs red light and reflects lovely pale blue light."
      ],
      factsHi: [
        "अरुण आधुनिक दूरबीन का उपयोग करके खोजा गया सबसे पहला ग्रह था!",
        "इसके अपने १३ धुंधले छल्ले भी हैं।",
        "इसके वायुमंडल में मीथेन गैस लाल प्रकाश को अवशोषित करती है और हल्के नीले रंग को बिखेरती है।"
      ],
      missionTitleEn: "Uranus Sideways Spin Analysis",
      missionTitleHi: "अरुण घूर्णन विश्लेषण"
    },
    {
      id: 'neptune',
      nameEn: 'Neptune',
      nameHi: 'वरुण',
      icon: '🔵',
      color: 'bg-blue-600 border-blue-800 text-blue-100',
      distance: 360,
      speed: 0.12,
      size: 'w-11 h-11 md:w-13 md:h-13',
      introEn: "I am Neptune, the windy deep-blue giant! I am the most distant planet from the Sun. I have supersonic winds blasting up to 2,100 km/h—fast enough to fly a jet airplane backwards!",
      introHi: "मैं वरुण हूँ, गहरा नीला तूफानी ग्रह! मैं सूर्य से सबसे दूर हूँ। मेरे ऊपर २१०० किमी/घंटा की गति से चलने वाली सुपरसोनिक हवाएं चलती हैं, जो किसी हवाई जहाज को भी उड़ा दें!",
      factsEn: [
        "Neptune takes 165 Earth years to complete just one single orbit around the Sun!",
        "It has a beautiful moon called Triton which orbits backward, and active geysers shooting freezing liquid nitrogen!",
        "It was discovered using mathematical calculations before anyone actually saw it in a telescope."
      ],
      factsHi: [
        "वरुण को सूर्य की एक परिक्रमा पूरी करने में १६५ पृथ्वी वर्ष लगते हैं!",
        "इसके पास ट्राइटन नाम का एक अनोखा चंद्रमा है जो उल्टा चक्कर लगाता है और वहां ठंडी तरल नाइट्रोजन के फव्वारे फूटते हैं!",
        "इसकी खोज दूरबीन से देखने से पहले गणितीय गणनाओं द्वारा की गई थी।"
      ],
      missionTitleEn: "Neptune Storm Searcher",
      missionTitleHi: "वरुण तूफान खोज अभियान"
    }
  ];

  // TTS function
  const speakPlanetIntro = (planet: Planet) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const introText = lang === 'en' ? planet.introEn : planet.introHi;
      const utterance = new SpeechSynthesisUtterance(introText);
      const voiceLang = lang === 'en' ? 'en-IN' : 'hi-IN';
      
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.includes(voiceLang) || v.lang.startsWith(lang));
      if (matchingVoice) utterance.voice = matchingVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleLaunchClick = () => {
    if (!astronautName.trim()) return;
    setIsLaunching(true);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(interval);
        setHasStarted(true);
        setIsLaunching(false);
        onAddXp(10);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        setLaunchCountdown(count);
      }
    }, 1000);
  };

  // Triggering custom sub-missions
  const startMission = (planetId: string) => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveMission(planetId);
    
    // Setup specific game variables
    if (planetId === 'mercury') {
      setMercuryTemp(430);
      setMercurySecsLeft(15);
      setMercuryShieldStatus('playing');
    } else if (planetId === 'venus') {
      setCloudsSwept([]);
    } else if (planetId === 'mars') {
      setDustLayers({ 0: 100, 1: 100, 2: 100, 3: 100 });
      setMarsRoverState('dusty');
    } else if (planetId === 'saturn') {
      setCollectedIce(0);
      // Spawn random ice crystal locations
      const list = Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        x: Math.random() * 70 + 15,
        y: Math.random() * 50 + 20,
        clicked: false
      }));
      setIceLocations(list);
    } else if (planetId === 'neptune') {
      setStormFound(false);
      setSpotlightPos({ x: 50, y: 50 });
    }
  };

  const closeMission = () => {
    setActiveMission(null);
  };

  const celebrateMission = (planetId: string) => {
    if (completedMissions.includes(planetId)) return;
    
    const updated = [...completedMissions, planetId];
    setCompletedMissions(updated);
    onAddXp(25);
    onAddCoins(10);

    // Badge triggers
    if (planetId === 'mercury') onUnlockBadge('space_mercury');
    if (planetId === 'venus') onUnlockBadge('space_venus');
    if (planetId === 'mars') onUnlockBadge('space_mars');
    if (planetId === 'saturn') onUnlockBadge('space_saturn');
    if (planetId === 'neptune') onUnlockBadge('space_neptune');

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Check if all 5 space missions are completed to trigger ultimate astronaut celebration
    const targetMissions = ['mercury', 'venus', 'mars', 'saturn', 'neptune'];
    const allDone = targetMissions.every(m => updated.includes(m));
    if (allDone) {
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.5 }
        });
        onUnlockBadge('streak_explorer'); // Award double master badge or equivalent
      }, 1000);
    }
  };

  // Mini-game actions
  // Mercury Cooling click
  const coolMercury = () => {
    setMercuryTemp(prev => {
      const newVal = Math.max(70, prev - 30);
      if (newVal <= 80 && mercuryShieldStatus === 'playing') {
        setMercuryShieldStatus('win');
        celebrateMission('mercury');
      }
      return newVal;
    });
  };

  // Venus swipe sweeping
  const sweepCloud = (idx: number) => {
    if (cloudsSwept.includes(idx)) return;
    const newList = [...cloudsSwept, idx];
    setCloudsSwept(newList);
    if (newList.length >= cloudCount) {
      celebrateMission('venus');
    }
  };

  // Mars sweep dust
  const clearDustPanel = (id: number) => {
    setDustLayers(prev => {
      const newD = { ...prev, [id]: Math.max(0, prev[id] - 25) };
      // Check if all dust is cleared (all sum is 0)
      const totalDust = (Object.values(newD) as number[]).reduce((a, b) => a + b, 0);
      if (totalDust === 0 && marsRoverState === 'dusty') {
        setMarsRoverState('ready');
      }
      return newD;
    });
  };

  const launchMarsExploration = () => {
    setMarsRoverState('exploring');
    setTimeout(() => {
      celebrateMission('mars');
    }, 2500);
  };

  // Saturn crystal clicking
  const clickIceCrystal = (id: number) => {
    setIceLocations(prev => {
      const updated = prev.map(ice => ice.id === id ? { ...ice, clicked: true } : ice);
      const clickedCount = updated.filter(ice => ice.clicked).length;
      setCollectedIce(clickedCount);
      if (clickedCount >= 5) {
        celebrateMission('saturn');
      }
      return updated;
    });
  };

  // Neptune spotlight tracking
  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlightPos({ x, y });

    // Storm is locked at around x: 180, y: 140 (center-right)
    const distToStorm = Math.sqrt(Math.pow(x - 210, 2) + Math.pow(y - 130, 2));
    if (distToStorm < 40 && !stormFound) {
      setStormFound(true);
      celebrateMission('neptune');
    }
  };

  // Handle mobile touch spotlight tracking
  const handleSpotlightTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    setSpotlightPos({ x, y });

    const distToStorm = Math.sqrt(Math.pow(x - 210, 2) + Math.pow(y - 130, 2));
    if (distToStorm < 40 && !stormFound) {
      setStormFound(true);
      celebrateMission('neptune');
    }
  };

  const getPlanetPosition = (distance: number, speed: number) => {
    // scale coordinates to make sure they fit nicely inside our space center
    const radius = distance * 0.65 * zoomLevel;
    const rad = (orbitAngle * speed * Math.PI) / 180;
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;
    return { x, y };
  };

  // Print function for space certificate
  const handlePrintCertificate = () => {
    window.print();
  };

  const hasUnlockedAllMissions = ['mercury', 'venus', 'mars', 'saturn', 'neptune'].every(m => completedMissions.includes(m));

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 text-white space-y-8 select-none">
      
      {/* 1. INITIAL ASTRONAUT SELECTION & LAUNCH BOARD */}
      {!hasStarted ? (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-[40px] border-4 border-purple-500/50 p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          
          {/* Sparkles background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-purple-600 to-transparent"></div>
          
          {/* Animated floating items */}
          <div className="absolute top-10 left-10 text-5xl animate-float">🛰️</div>
          <div className="absolute bottom-10 right-10 text-5xl animate-float-slow">📡</div>
          <div className="absolute top-12 right-20 text-4xl animate-bounce">☄️</div>
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">
              <Rocket className="w-4 h-4 animate-pulse text-yellow-300" />
              <span>NASA Transmission Received! 📲</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              {lang === 'en' ? 'COSMIC ASTRO-ADVENTURE!' : 'ब्रह्मांडीय अंतरिक्ष साहसिक!'}
            </h2>

            {/* Mascot Invitation message */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border-2 border-white/20 flex flex-col md:flex-row items-center gap-6 text-left">
              <div className="text-6xl md:text-7xl shrink-0 animate-float">🤖</div>
              <div className="space-y-2">
                <h4 className="font-black text-yellow-300 text-lg">SciBuddy Alert!</h4>
                <p className="text-sm md:text-base text-purple-100 font-extrabold leading-relaxed">
                  {lang === 'en' 
                    ? "Junior Astronauts! NASA just invited us on a high-stakes scientific mission to explore our Solar System! We must travel to wild worlds, clear toxic atmospheres, save stuck rovers, and find supersonic storms! Are you ready?"
                    : "जूनियर अंतरिक्ष यात्रियों! नासा ने हमें हमारे सौर मंडल का पता लगाने के लिए एक महत्वपूर्ण वैज्ञानिक मिशन पर आमंत्रित किया है! क्या आप ब्रह्मांडीय साहसिक कार्य के लिए तैयार हैं?"}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/10 max-w-md mx-auto space-y-4">
              <label className="block text-left text-xs font-black text-purple-300 uppercase tracking-widest">
                🚀 {lang === 'en' ? "Enter Astronaut Name" : "अंतरिक्ष यात्री का नाम दर्ज करें"}
              </label>
              <input
                type="text"
                value={astronautName}
                onChange={(e) => setAstronautName(e.target.value)}
                placeholder="Astro Explorer..."
                className="w-full px-5 py-4 rounded-2xl bg-slate-950/90 border-2 border-purple-400 text-white font-black text-base placeholder-purple-300/40 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                maxLength={20}
                disabled={isLaunching}
              />

              <button
                onClick={handleLaunchClick}
                disabled={isLaunching || !astronautName.trim()}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-lg rounded-2xl border-b-6 border-orange-700 transition-all active:translate-y-1 active:border-b-2 btn-bouncy shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLaunching ? (
                  <span className="text-2xl animate-spin">🌀</span>
                ) : (
                  <>
                    <span>🚀 {lang === 'en' ? "LAUNCH SPACE MISSION" : "मिशन लॉन्च करें"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Launcher Countdown screen */}
            {isLaunching && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center space-y-6"
              >
                <div className="text-slate-400 text-sm font-black tracking-widest uppercase animate-pulse">
                  PREPARING ROCKET BOOSTERS...
                </div>
                <motion.div 
                  key={launchCountdown}
                  initial={{ scale: 0.2, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="text-9xl font-black text-yellow-400 drop-shadow-[0_10px_20px_rgba(234,179,8,0.4)]"
                >
                  {launchCountdown}
                </motion.div>
                <div className="text-5xl animate-bounce pt-8">🚀💥🔥</div>
                <div className="font-mono text-purple-300 text-xs">T-MINUS COUNTDOWN ACTIVE</div>
              </motion.div>
            )}

          </div>
        </div>
      ) : (
        
        /* 2. THE MAIN COSMIC SPACE MISSION CONTROL INTERFACE */
        <div className="space-y-6">
          
          {/* TOP MISSION HUB STATUS */}
          <div className="bg-slate-900/80 rounded-[32px] border-4 border-indigo-900 p-5 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center border-2 border-purple-400 animate-pulse text-4xl shrink-0">
                👨‍🚀
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-yellow-300">
                    Astro-Captain: {astronautName}
                  </h3>
                  <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-black px-2.5 py-1 rounded-full border border-indigo-400/40">
                    STATUS: ACTIVE 📡
                  </span>
                </div>
                <p className="text-xs text-indigo-200 font-bold mt-1">
                  {lang === 'en' 
                    ? `Completed Missions: ${completedMissions.length}/5 | Earn up to +125 XP & 50 Coins!` 
                    : `पूरे किए गए मिशन: ${completedMissions.length}/५ | +१२५ अनुभव अंक तक कमाएं!`}
                </p>
              </div>
            </div>

            {/* Mission Checklist Panel */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['mercury', 'venus', 'mars', 'saturn', 'neptune'].map((pId) => {
                const isDone = completedMissions.includes(pId);
                const plData = planets.find(p => p.id === pId);
                return (
                  <button
                    key={pId}
                    onClick={() => startMission(pId)}
                    className={`px-3 py-1.5 rounded-xl border-2 text-[10px] font-black flex items-center gap-1.5 transition-all btn-bouncy ${
                      isDone 
                        ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200' 
                        : 'bg-slate-950/70 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-xs">{plData?.icon}</span>
                    <span className="capitalize">{pId}</span>
                    <span>{isDone ? '✅' : '🔒'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* LEFT COLUMN: INTERACTIVE GALAXY VIEWPORT (3 COLS) */}
            <div className="lg:col-span-3 space-y-4">
              
              <div 
                ref={spaceAreaRef}
                className="relative w-full h-[520px] md:h-[600px] bg-[#020210] rounded-[40px] border-4 border-indigo-950 overflow-hidden shadow-inner flex items-center justify-center"
              >
                
                {/* 1. Deep Space background graphics */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-950 to-[#020210]"></div>
                
                {/* 2. Twinkling Stars */}
                {stars.map((star) => (
                  <div
                    key={star.id}
                    className="absolute bg-white rounded-full opacity-60"
                    style={{
                      left: `${star.x}%`,
                      top: `${star.y}%`,
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      animation: `pulse 2s infinite alternate`,
                      animationDelay: `${star.delay}s`
                    }}
                  />
                ))}

                {/* 3. Flying Comet effect */}
                {comet.active && (
                  <motion.div
                    initial={{ x: `${comet.x}%`, y: `${comet.y}%`, opacity: 0 }}
                    animate={{ x: `${comet.x + 30}%`, y: `${comet.y + 20}%`, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute w-12 h-0.5 bg-gradient-to-r from-white to-transparent transform rotate-12 z-10 pointer-events-none"
                  />
                )}

                {/* 4. Controls overlays */}
                <div className="absolute top-6 left-6 z-20 flex gap-2">
                  <button 
                    onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))} 
                    className="p-2.5 bg-indigo-950/90 border-2 border-indigo-500 rounded-xl hover:bg-indigo-900 text-white shadow-md btn-bouncy"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))} 
                    className="p-2.5 bg-indigo-950/90 border-2 border-indigo-500 rounded-xl hover:bg-indigo-900 text-white shadow-md btn-bouncy"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setIsOrbiting(!isOrbiting)} 
                    className={`p-2.5 bg-indigo-950/90 border-2 rounded-xl text-white shadow-md btn-bouncy ${isOrbiting ? 'border-indigo-500 hover:bg-indigo-900' : 'border-rose-500 bg-rose-950/40'}`}
                    title={isOrbiting ? "Pause Orbit Rotation" : "Resume Orbit Rotation"}
                  >
                    <RotateCcw className={`w-5 h-5 ${isOrbiting ? 'animate-spin-slow' : ''}`} />
                  </button>
                </div>

                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-indigo-950/80 border-2 border-indigo-500 px-4 py-2 rounded-2xl text-xs font-black shadow-md flex items-center gap-1.5 uppercase tracking-wider text-indigo-200">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
                    <span>{lang === 'en' ? "Drag planets to adjust orbits" : "कक्षा समायोजित करने के लिए खींचें"}</span>
                  </div>
                </div>

                {/* 5. GALAXY SYSTEM CANVAS */}
                <div className="absolute transition-transform duration-500 ease-out" style={{ transform: `scale(${zoomLevel})` }}>
                  
                  {/* Central glowing Sun */}
                  <div className="relative w-20 h-20 bg-amber-400 rounded-full border-4 border-orange-500 shadow-[0_0_50px_#f59e0b] flex items-center justify-center z-10">
                    <span className="text-4xl animate-pulse">☀️</span>
                    
                    {/* Pulsating solar flare rings */}
                    <div className="absolute inset-0 bg-orange-400/20 rounded-full animate-ping pointer-events-none scale-150"></div>
                  </div>

                  {/* Concentric planetary orbits & orbiting Planet nodes */}
                  {planets.map((planet) => {
                    const radius = planet.distance * 0.65 * zoomLevel;
                    const pos = getPlanetPosition(planet.distance, planet.speed);
                    const isCompleted = completedMissions.includes(planet.id);

                    return (
                      <div key={planet.id} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        
                        {/* Orbit line ring */}
                        <div 
                          className="absolute border border-dashed border-indigo-900/30 rounded-full"
                          style={{
                            width: `${radius * 2}px`,
                            height: `${radius * 2}px`,
                          }}
                        />

                        {/* Planet Node wrapper */}
                        <motion.div
                          drag
                          dragConstraints={spaceAreaRef}
                          dragElastic={0.1}
                          className="absolute pointer-events-auto cursor-grab active:cursor-grabbing z-20 group"
                          style={{
                            transform: `translate(${pos.x}px, ${pos.y}px)`,
                          }}
                          onClick={() => {
                            setSelectedPlanet(planet);
                          }}
                        >
                          <div className="relative flex flex-col items-center">
                            
                            {/* Orbit completeness notification halo */}
                            {isCompleted && (
                              <div className="absolute -inset-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full animate-pulse scale-125" />
                            )}

                            {/* Planet Sphere icon */}
                            <div className={`rounded-full border-2 shadow-lg flex items-center justify-center relative transform group-hover:scale-125 transition-all duration-300 ${planet.color} ${planet.size}`}>
                              <span className="text-lg md:text-xl">{planet.icon}</span>
                              
                              {/* Mission locked/unlocked mini indicators */}
                              <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-indigo-950 border border-white/20 rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                                {isCompleted ? '✅' : '🎯'}
                              </span>
                            </div>

                            {/* Label */}
                            <span className="mt-1.5 text-[9px] md:text-[10px] font-black tracking-wide bg-indigo-950/90 border border-indigo-800 px-1.5 py-0.5 rounded-md shadow text-slate-200">
                              {lang === 'en' ? planet.nameEn : planet.nameHi}
                            </span>
                          </div>
                        </motion.div>

                      </div>
                    );
                  })}

                </div>

                {/* Giant spaceship indicator hovering in orbit */}
                <motion.div
                  animate={{
                    y: [120, 100, 120],
                    x: [-120, -110, -120],
                    rotate: [20, 15, 20]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute bottom-16 left-24 text-4xl pointer-events-none drop-shadow-md rotate-12"
                >
                  🚀
                </motion.div>

              </div>

            </div>

            {/* RIGHT COLUMN: EXPEDITION CHECKLIST & CERTIFICATE STATUS */}
            <div className="space-y-6">
              
              {/* Space Missions Checklist */}
              <div className="bg-gradient-to-b from-indigo-950 to-slate-950 rounded-3xl border-3 border-indigo-900 p-6 space-y-4 shadow-lg">
                <h3 className="text-base font-black text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  <span>{lang === 'en' ? "Astronaut Missions" : "अंतरिक्ष मिशन"}</span>
                </h3>

                <p className="text-[10px] text-indigo-200/80 font-bold leading-normal">
                  {lang === 'en' 
                    ? "Click on planets in the cosmos or select an active expedition from NASA down below!"
                    : "ग्रहों पर क्लिक करें या नीचे नासा से एक सक्रिय खोज अभियान चुनें!"}
                </p>

                <div className="space-y-2.5 pt-2">
                  {planets.filter(p => ['mercury', 'venus', 'mars', 'saturn', 'neptune'].includes(p.id)).map((planet) => {
                    const isDone = completedMissions.includes(planet.id);
                    return (
                      <div
                        key={planet.id}
                        onClick={() => startMission(planet.id)}
                        className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-white/5 ${
                          isDone 
                            ? 'bg-emerald-950/20 border-emerald-800' 
                            : 'bg-slate-900/60 border-slate-800/80 hover:border-indigo-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{planet.icon}</span>
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-100">
                              {lang === 'en' ? planet.nameEn : planet.nameHi}
                            </h4>
                            <p className="text-[9px] text-indigo-300 font-bold">
                              {lang === 'en' ? "Launch expedition ➔" : "अभियान शुरू करें ➔"}
                            </p>
                          </div>
                        </div>

                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                          isDone 
                            ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300' 
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}>
                          {isDone ? '✓' : '🚀'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Certificate Access Card */}
              <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-3xl border-3 border-purple-500/30 p-5 text-center space-y-4 shadow-lg relative overflow-hidden">
                <span className="absolute -top-3 -right-3 text-5xl opacity-10">📜</span>
                <div className="w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto border-b-2 border-yellow-600 shadow-sm">
                  <Award className="w-5 h-5 text-slate-950" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-yellow-300">
                    {lang === 'en' ? "Astronaut Diploma" : "अंतरिक्ष वैज्ञानिक डिप्लोमा"}
                  </h4>
                  <p className="text-[10px] text-purple-200 leading-normal">
                    {lang === 'en'
                      ? "Complete all 5 space missions to unlock your official NASA-style science certificate!"
                      : "अपना आधिकारिक नासा वैज्ञानिक प्रमाण पत्र खोलने के लिए सभी ५ मिशन पूरे करें!"}
                  </p>
                </div>

                <div className="pt-2">
                  {hasUnlockedAllMissions ? (
                    <button
                      onClick={() => {
                        setSelectedPlanet(null);
                        setActiveMission('certificate_diploma');
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md border-b-4 border-amber-700 btn-bouncy"
                    >
                      📜 VIEW CERTIFICATE!
                    </button>
                  ) : (
                    <div className="py-2 px-3 bg-slate-950/40 rounded-xl border border-white/5 text-[10px] text-purple-300/70 font-bold">
                      🔒 Completed {completedMissions.length}/5 to Unlock
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* 3. PLANET DETAILS OVERLAY WINDOW (ON SELECT) */}
          <AnimatePresence>
            {selectedPlanet && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="bg-slate-900 border-4 border-indigo-500 rounded-[36px] p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden"
              >
                
                {/* Floating galaxy sparkles */}
                <div className="absolute top-4 right-4 text-3xl opacity-15">🪐</div>
                
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                  
                  {/* Planet Visual & Audio button */}
                  <div className="flex flex-col items-center space-y-4 shrink-0 text-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                      className={`w-32 h-32 rounded-full border-4 shadow-2xl flex items-center justify-center text-7xl ${selectedPlanet.color}`}
                    >
                      {selectedPlanet.icon}
                    </motion.div>

                    <div className="space-y-1">
                      <h3 className="text-3xl font-black text-white">
                        {lang === 'en' ? selectedPlanet.nameEn : selectedPlanet.nameHi}
                      </h3>
                      <span className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-widest bg-indigo-950 border border-indigo-800 px-3 py-1 rounded-full">
                        {lang === 'en' ? 'Expedition Target' : 'मिशन लक्ष्य'}
                      </span>
                    </div>

                    <button
                      onClick={() => speakPlanetIntro(selectedPlanet)}
                      className={`px-4 py-2 rounded-xl font-black text-xs border-b-4 flex items-center gap-1.5 btn-bouncy transition-all shadow-md ${
                        isSpeaking ? 'bg-red-500 text-white border-red-700' : 'bg-yellow-400 text-slate-950 border-yellow-600 hover:bg-yellow-500'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      <span>{isSpeaking ? (lang === 'en' ? 'Stop Voice' : 'आवाज रोकें') : (lang === 'en' ? 'Listen Aloud' : 'सुनें')}</span>
                    </button>
                  </div>

                  {/* Planet Information Text & facts list */}
                  <div className="flex-1 space-y-4 text-left">
                    <div className="bg-slate-950/50 p-5 rounded-2xl border border-white/10 space-y-2">
                      <h4 className="font-extrabold text-xs text-indigo-400 uppercase tracking-widest">
                        🤖 {lang === 'en' ? "Introduction by SciBuddy" : "साई-बडी का परिचय"}
                      </h4>
                      <p className="text-sm md:text-base font-extrabold text-slate-100 leading-relaxed">
                        {lang === 'en' ? selectedPlanet.introEn : selectedPlanet.introHi}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-black text-xs text-yellow-300 uppercase tracking-widest">
                        ⭐ {lang === 'en' ? "Astonishing Fun Facts!" : "आश्चर्यजनक तथ्य!"}
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(lang === 'en' ? selectedPlanet.factsEn : selectedPlanet.factsHi).map((fact, i) => (
                          <li key={i} className="bg-slate-950/30 p-3 rounded-xl border border-indigo-900/40 text-xs font-bold leading-normal text-slate-200 flex gap-2">
                            <span className="text-yellow-400">✦</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 flex-wrap">
                      <button
                        onClick={() => setSelectedPlanet(null)}
                        className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs rounded-xl"
                      >
                        {lang === 'en' ? "Back to Orbit" : "वापस जाएँ"}
                      </button>

                      {['mercury', 'venus', 'mars', 'saturn', 'neptune'].includes(selectedPlanet.id) && (
                        <button
                          onClick={() => {
                            startMission(selectedPlanet.id);
                            setSelectedPlanet(null);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white border-b-4 border-indigo-800 font-black text-xs rounded-xl flex items-center gap-1.5 btn-bouncy"
                        >
                          <span>🚀 {lang === 'en' ? "LAUNCH MISSION!" : "मिशन शुरू करें!"}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. ACTIVE PLANETARY EXPEDITIONS WINDOW */}
          <AnimatePresence>
            {activeMission && activeMission !== 'certificate_diploma' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 bg-slate-950/90 overflow-y-auto p-4 md:p-8 flex items-center justify-center backdrop-blur-sm"
              >
                <div className="bg-slate-900 rounded-[36px] border-4 border-indigo-500 p-6 md:p-8 max-w-2xl w-full space-y-6 text-left relative shadow-2xl">
                  
                  {/* Close button */}
                  <button 
                    onClick={closeMission}
                    className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs"
                  >
                    ✕
                  </button>

                  <div className="border-b border-indigo-950 pb-4 flex items-center gap-3">
                    <span className="text-4xl">
                      {activeMission === 'mercury' && '🪨'}
                      {activeMission === 'venus' && '🌫️'}
                      {activeMission === 'mars' && '🔴'}
                      {activeMission === 'saturn' && '🪐'}
                      {activeMission === 'neptune' && '🔵'}
                    </span>
                    <div>
                      <span className="bg-yellow-400 text-slate-950 font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        MISSION ACTIVE 🚀
                      </span>
                      <h3 className="text-2xl font-black text-white mt-1">
                        {activeMission === 'mercury' && (lang === 'en' ? 'Mercury Heat Shield Cooling' : 'बुध थर्मल शील्ड रक्षा')}
                        {activeMission === 'venus' && (lang === 'en' ? 'Venus Acidic Cloud Sweeper' : 'शुक्र वायुमंडल क्लीनर')}
                        {activeMission === 'mars' && (lang === 'en' ? 'Mars Rover Dust Recovery' : 'मंगल रोवर डस्ट क्लीनर')}
                        {activeMission === 'saturn' && (lang === 'en' ? 'Saturn Ring Ice Rock Collector' : 'शनि वलय बर्फ काउंटर')}
                        {activeMission === 'neptune' && (lang === 'en' ? 'Neptune supersonic Storm Spotter' : 'वरुण तूफान खोज अभियान')}
                      </h3>
                    </div>
                  </div>

                  {/* GAME CHANNELS */}
                  
                  {/* MERCURY MISSION */}
                  {activeMission === 'mercury' && (
                    <div className="space-y-6 text-center">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-2">
                        <p className="text-xs text-indigo-300 font-extrabold uppercase tracking-wider">
                          🚨 THERMAL DANGER DETECTED!
                        </p>
                        <p className="text-xs md:text-sm font-bold text-slate-300 leading-relaxed">
                          {lang === 'en'
                            ? "Mercury is cooking at 430°C! Quick, click the ICE BLOCKS (❄️) to blast cold nitrogen and drop the temperature below 80°C before the shield fails!"
                            : "बुध ४३० डिग्री सेल्सियस पर तप रहा है! तापमान को ८० डिग्री सेल्सियस से नीचे लाने के लिए बर्फीली ठंड (❄️) पर क्लिक करें!"}
                        </p>
                      </div>

                      <div className="flex justify-around items-center bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                        <div>
                          <span className="block text-[10px] text-slate-400 font-black uppercase">TEMPERATURE</span>
                          <span className={`text-4xl font-black ${mercuryTemp > 180 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                            🌡️ {mercuryTemp}°C
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 font-black uppercase">TIME REMAINING</span>
                          <span className={`text-3xl font-mono font-black ${mercurySecsLeft < 5 ? 'text-red-400 animate-bounce' : 'text-yellow-400'}`}>
                            ⏱️ 0:{mercurySecsLeft < 10 ? `0${mercurySecsLeft}` : mercurySecsLeft}
                          </span>
                        </div>
                      </div>

                      {mercuryShieldStatus === 'playing' ? (
                        <div className="py-8 flex flex-col items-center space-y-4">
                          <button
                            onClick={coolMercury}
                            className="px-8 py-5 bg-gradient-to-r from-blue-400 to-sky-500 hover:from-blue-300 hover:to-sky-400 text-slate-950 font-black text-lg rounded-2xl border-b-6 border-blue-700 btn-bouncy shadow-lg flex items-center gap-2"
                          >
                            <Snowflake className="w-6 h-6 animate-spin-slow text-white" />
                            <span>LAUNCH ICE NITROGEN BLAST!</span>
                          </button>
                        </div>
                      ) : mercuryShieldStatus === 'win' ? (
                        <div className="py-8 space-y-4 text-center">
                          <span className="text-5xl">✨❄️🛡️</span>
                          <h4 className="text-xl font-black text-emerald-400">Thermal Shield Stabilized!</h4>
                          <p className="text-xs text-slate-300 font-bold max-w-sm mx-auto">
                            Mercury has successfully cooled to safe scientific research levels! You earned +25 XP & 10 Coins.
                          </p>
                          <button onClick={closeMission} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl border-b-4 border-emerald-800 btn-bouncy">
                            Claim Rewards & Close
                          </button>
                        </div>
                      ) : (
                        <div className="py-8 space-y-4 text-center">
                          <span className="text-5xl">💥🥵🚨</span>
                          <h4 className="text-xl font-black text-red-400">Shield Defeated!</h4>
                          <p className="text-xs text-slate-300 font-bold max-w-sm mx-auto">
                            The thermal blast was too slow and Mercury overheated. Don't worry, cadet! Recycle your boosters and try again!
                          </p>
                          <button onClick={() => startMission('mercury')} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl border-b-4 border-indigo-800 btn-bouncy">
                            Try Again
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* VENUS MISSION */}
                  {activeMission === 'venus' && (
                    <div className="space-y-6">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-1">
                        <p className="text-xs text-yellow-400 font-extrabold uppercase tracking-wider">
                          🌫️ ACIDIC ATMOSPHERE DECONTAMINATION
                        </p>
                        <p className="text-xs md:text-sm font-bold text-slate-300 leading-normal">
                          {lang === 'en'
                            ? "Swipe or CLICK on all the toxic carbon dioxide yellow clouds below to sweep them away and reveal Venus's extreme lava surface!"
                            : "नीचे दिए गए सभी जहरीले पीले बादलों पर क्लिक करके उन्हें हटाएं और शुक्र की सतह को देखें!"}
                        </p>
                      </div>

                      {completedMissions.includes('venus') ? (
                        <div className="text-center py-12 space-y-4 bg-slate-950/40 rounded-3xl border border-slate-800">
                          <span className="text-5xl">🌅🌋✨</span>
                          <h4 className="text-xl font-black text-emerald-400">Atmosphere cleared!</h4>
                          <p className="text-xs text-slate-300 font-bold">
                            You uncovered the molten rocks and sulfuric volcanoes on Venus! Science reports submitted!
                          </p>
                          <button onClick={closeMission} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl border-b-4 border-emerald-800 btn-bouncy">
                            Claim Rewards & Close
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs font-bold text-slate-400">
                            <span>Clouds Cleared: {cloudsSwept.length} / {cloudCount}</span>
                            <span className="text-yellow-400 font-black">{Math.floor((cloudsSwept.length / cloudCount) * 100)}% Swept</span>
                          </div>

                          {/* Cloud Canvas grid */}
                          <div className="relative h-64 bg-gradient-to-b from-orange-900 to-amber-950 rounded-2xl border-2 border-slate-950 overflow-hidden grid grid-cols-4 grid-rows-3 gap-1.5 p-1.5">
                            
                            {/* Underground Venus drawing underneath */}
                            <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-yellow-400/25 select-none pointer-events-none uppercase tracking-widest flex-col">
                              <span>🌋 VENUS LAVA 🌋</span>
                              <span className="text-xs mt-1 text-orange-400/20">SULFUR CRUST</span>
                            </div>

                            {Array.from({ length: cloudCount }).map((_, i) => {
                              const isSwept = cloudsSwept.includes(i);
                              return (
                                <motion.div
                                  key={i}
                                  onClick={() => sweepCloud(i)}
                                  whileHover={{ scale: isSwept ? 1 : 0.95 }}
                                  className={`rounded-xl border border-yellow-800/20 flex items-center justify-center cursor-pointer font-black text-2xl transition-all shadow-inner ${
                                    isSwept 
                                      ? 'opacity-0 scale-75 bg-transparent pointer-events-none' 
                                      : 'bg-gradient-to-br from-yellow-300/80 to-amber-500/95 text-yellow-950/80 animate-pulse'
                                  }`}
                                  style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                  {isSwept ? '' : '☁️'}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MARS MISSION */}
                  {activeMission === 'mars' && (
                    <div className="space-y-6">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-1">
                        <p className="text-xs text-red-400 font-extrabold uppercase tracking-wider">
                          🛰️ PERSEVERANCE ROVER DUST CRISIS
                        </p>
                        <p className="text-xs md:text-sm font-bold text-slate-300 leading-normal">
                          {lang === 'en'
                            ? "A Martian rust storm covered the rover's solar panel batteries with 100% dust! Click each solar panel multiple times to clean the dust, then hit 'Launch Exploration'!"
                            : "मंगल के धूल भरे तूफान ने रोवर के सौर पैनलों को ढक दिया है! डस्ट साफ करने के लिए पैनलों पर क्लिक करें!"}
                        </p>
                      </div>

                      {completedMissions.includes('mars') ? (
                        <div className="text-center py-12 space-y-4 bg-slate-950/40 rounded-3xl border border-slate-800">
                          <span className="text-5xl">🛰️💦🔴</span>
                          <h4 className="text-xl font-black text-emerald-400">Rover Active & Discovering Water Ice!</h4>
                          <p className="text-xs text-slate-300 font-bold">
                            Perseverance is rolling across Jezero Crater finding ancient liquid water-ice structures! Great Job!
                          </p>
                          <button onClick={closeMission} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl border-b-4 border-emerald-800 btn-bouncy">
                            Claim Rewards & Close
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          
                          {/* Solar panels display */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[0, 1, 2, 3].map((panelId) => {
                              const dust = dustLayers[panelId] || 0;
                              return (
                                <div
                                  key={panelId}
                                  onClick={() => clearDustPanel(panelId)}
                                  className="bg-slate-950 p-4 rounded-2xl border-2 border-slate-800 text-center space-y-3 cursor-pointer select-none hover:border-red-500 transition-all active:scale-95"
                                >
                                  <span className="block text-xs font-black text-slate-400 uppercase">PANEL {panelId + 1}</span>
                                  <div className="relative h-16 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                                    <span className="text-3xl relative z-10">☀️</span>
                                    {/* Dust brown overlay */}
                                    <div 
                                      className="absolute inset-0 bg-amber-800/80 transition-all duration-300"
                                      style={{ opacity: dust / 100 }}
                                    />
                                  </div>
                                  <div>
                                    <span className={`text-xs font-black px-2 py-1 rounded-full ${
                                      dust === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                      {dust === 0 ? 'CLEAN ✨' : `Dust: ${dust}%`}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Action button */}
                          <div className="text-center pt-4 border-t border-slate-800">
                            {marsRoverState === 'dusty' ? (
                              <button disabled className="px-6 py-3 bg-slate-800 text-slate-500 font-black text-xs rounded-xl opacity-50 cursor-not-allowed">
                                Panel Power: Low (Clear all panel dust first!)
                              </button>
                            ) : marsRoverState === 'ready' ? (
                              <button
                                onClick={launchMarsExploration}
                                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-black text-sm rounded-xl border-b-4 border-red-700 btn-bouncy animate-bounce shadow"
                              >
                                🚀 POWER FULL! LAUNCH MARS EXPLORATION
                              </button>
                            ) : (
                              <div className="space-y-2 text-center">
                                <span className="text-3xl animate-spin block">🚜</span>
                                <p className="text-xs text-red-300 font-extrabold animate-pulse">Rover drilling Mars soil core sample... Finding water ice...</p>
                              </div>
                            )}
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                  {/* SATURN MISSION */}
                  {activeMission === 'saturn' && (
                    <div className="space-y-6">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-1">
                        <p className="text-xs text-yellow-300 font-extrabold uppercase tracking-wider">
                          💎 SATURN RING ICE DEBRIS COUNTER
                        </p>
                        <p className="text-xs md:text-sm font-bold text-slate-300 leading-normal">
                          {lang === 'en'
                            ? "Saturn's beautiful rings are made of dusty ice. Tap and COLLECT 5 glittering freezing ice crystals while avoid falling space boulders to compile NASA's ring composition report!"
                            : "शनि के छल्ले बर्फीले पत्थरों से बने हैं। रिपोर्ट तैयार करने के लिए ५ चमकीले बर्फ के क्रिस्टल पर क्लिक करके इकट्ठा करें!"}
                        </p>
                      </div>

                      {completedMissions.includes('saturn') ? (
                        <div className="text-center py-12 space-y-4 bg-slate-950/40 rounded-3xl border border-slate-800">
                          <span className="text-5xl">🪐💎✨</span>
                          <h4 className="text-xl font-black text-emerald-400">Ring ice rocks compiled!</h4>
                          <p className="text-xs text-slate-300 font-bold">
                            Freezing ice clusters collected successfully! Saturn's rings are confirmed to be water-ice crystals!
                          </p>
                          <button onClick={closeMission} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl border-b-4 border-emerald-800 btn-bouncy">
                            Claim Rewards & Close
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs font-black text-slate-400">
                            <span>Glittering Crystals Collected: {collectedIce} / 5</span>
                            <span className="bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full border border-blue-800">RING RADAR: ONLINE</span>
                          </div>

                          {/* Interactive ring crystal clicker container */}
                          <div className="relative h-64 bg-slate-950 border-2 border-indigo-950 rounded-2xl overflow-hidden p-4">
                            
                            {/* Concentric rings lines background */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                              <div className="w-80 h-80 rounded-full border border-slate-800" />
                              <div className="w-60 h-60 rounded-full border border-slate-700" />
                              <div className="w-40 h-40 rounded-full border border-slate-600" />
                            </div>

                            {/* Floating Crystals */}
                            {iceLocations.map((ice) => {
                              if (ice.clicked) return null;
                              return (
                                <motion.div
                                  key={ice.id}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                                  transition={{ repeat: Infinity, duration: 3, delay: ice.id * 0.4 }}
                                  onClick={() => clickIceCrystal(ice.id)}
                                  className="absolute bg-sky-400 text-white w-10 h-10 border-2 border-white rounded-full flex items-center justify-center text-xl cursor-pointer select-none shadow-[0_0_10px_#38bdf8] hover:scale-125 transition-transform"
                                  style={{
                                    left: `${ice.x}%`,
                                    top: `${ice.y}%`
                                  }}
                                >
                                  💎
                                </motion.div>
                              );
                            })}

                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* NEPTUNE MISSION */}
                  {activeMission === 'neptune' && (
                    <div className="space-y-6">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-1">
                        <p className="text-xs text-blue-400 font-extrabold uppercase tracking-wider">
                          🌀 NEPTUNE SUPERSONIC STORM HUNTER
                        </p>
                        <p className="text-xs md:text-sm font-bold text-slate-300 leading-normal">
                          {lang === 'en'
                            ? "Supersonic storms rage across Neptune at 2,100 km/h! Hover your spotlight or tap across the deep-blue canvas below to spot the swirling Great Dark Spot Cyclone storm!"
                            : "वरुण ग्रह पर तूफान खोजने के लिए डार्क-ब्लू कैनवास पर अपनी उंगली फिराएं और चक्रवात ढूंढें!"}
                        </p>
                      </div>

                      {completedMissions.includes('neptune') ? (
                        <div className="text-center py-12 space-y-4 bg-slate-950/40 rounded-3xl border border-slate-800">
                          <span className="text-5xl">🌀🛰️🤖</span>
                          <h4 className="text-xl font-black text-emerald-400">Great Dark Spot Cyclone Identified!</h4>
                          <p className="text-xs text-slate-300 font-bold">
                            Supersonic cyclone coordinates locked! Weather probe successfully deployed to measure methane wind speed!
                          </p>
                          <button onClick={closeMission} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl border-b-4 border-emerald-800 btn-bouncy">
                            Claim Rewards & Close
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs font-bold text-slate-400">
                            <span>Status: {stormFound ? '🎯 STORM FOUND!' : '🕵️ Scanning atmosphere...'}</span>
                            <span className="text-blue-400 font-black">Neptune Winds: 2,100 km/h</span>
                          </div>

                          {/* Scanner canvas container */}
                          <div 
                            onMouseMove={handleSpotlightMouseMove}
                            onTouchMove={handleSpotlightTouchMove}
                            className="relative h-64 bg-slate-950 border-2 border-indigo-950 rounded-2xl overflow-hidden cursor-crosshair"
                          >
                            {/* Storm drawing (Hidden in deep dark blue unless spotlight is near) */}
                            <div 
                              className="absolute w-16 h-16 rounded-full border-4 border-blue-400/30 bg-blue-900/40 animate-spin-slow flex items-center justify-center font-black text-xs"
                              style={{ left: '210px', top: '130px' }}
                            >
                              🌀 Storm
                            </div>

                            {/* Mask overlay which is fully black except where spotlightPos is */}
                            <div 
                              className="absolute inset-0 pointer-events-none mix-blend-multiply"
                              style={{
                                background: `radial-gradient(circle 60px at ${spotlightPos.x}px ${spotlightPos.y}px, transparent 100%, #030712 100%)`
                              }}
                            />

                            {/* Flashlight/Spotlight indicator */}
                            <div 
                              className="absolute border border-yellow-400/40 rounded-full w-24 h-24 pointer-events-none shadow-[0_0_20px_rgba(234,179,8,0.25)]"
                              style={{
                                left: `${spotlightPos.x - 48}px`,
                                top: `${spotlightPos.y - 48}px`,
                              }}
                            />

                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. MASTER ASTRONAUT CERTIFICATE / DIPLOMA SCREEN */}
          <AnimatePresence>
            {activeMission === 'certificate_diploma' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-slate-950/95 overflow-y-auto p-4 md:p-8 flex items-center justify-center print:bg-white print:p-0"
              >
                <div className="bg-amber-50 rounded-[40px] border-8 border-yellow-400 p-8 md:p-12 max-w-3xl w-full text-slate-900 space-y-8 text-center relative shadow-2xl print:border-none print:shadow-none print:rounded-none">
                  
                  {/* Decorative stamp banner */}
                  <div className="absolute top-6 left-6 text-7xl select-none opacity-25 animate-float print:hidden">🎖️</div>
                  <div className="absolute top-6 right-6 text-7xl select-none opacity-25 animate-float-slow print:hidden">🪐</div>
                  
                  {/* Certificate Content Frame */}
                  <div className="border-4 border-double border-amber-900/60 p-6 md:p-8 space-y-6">
                    
                    {/* Header */}
                    <div className="space-y-2">
                      <span className="text-5xl font-bold">🚀</span>
                      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-amber-950">
                        Tiny Scientists Space Academy
                      </h1>
                      <div className="h-1 w-32 bg-amber-800 mx-auto rounded-full" />
                      <p className="text-xs uppercase font-black tracking-widest text-amber-900">
                        In Collaboration with the Indian Junior Astronomy Alliance
                      </p>
                    </div>

                    <p className="text-xs italic font-bold text-slate-700 md:text-sm">
                      This official space diploma is proudly presented to:
                    </p>

                    {/* Astronaut Name */}
                    <div className="py-2 border-b-2 border-dashed border-amber-950/40 max-w-md mx-auto">
                      <h2 className="text-3xl md:text-4xl font-black tracking-wide text-indigo-950 capitalize font-serif">
                        {astronautName}
                      </h2>
                    </div>

                    <div className="space-y-3 max-w-lg mx-auto">
                      <p className="text-sm font-extrabold text-slate-800 leading-relaxed">
                        {lang === 'en'
                          ? "For demonstrating outstanding cosmic scientific intelligence, brave navigation, and successfully completing all 5 Solar System Planetary expeditions."
                          : "असाधारण वैज्ञानिक प्रतिभा, ब्रह्मांडीय नेविगेशन का प्रदर्शन करने और सौर मंडल के सभी ५ अभियानों को सफलतापूर्वक पूरा करने के लिए।"}
                      </p>
                      
                      <p className="text-xs text-slate-600 font-extrabold">
                        Conferred with the prestigious title of:
                      </p>
                      
                      <div className="inline-block bg-yellow-400 text-slate-900 border-2 border-slate-900 font-black text-sm px-5 py-2 rounded-xl shadow-md uppercase tracking-wider">
                        ⭐ Master Astronaut of the Cosmos 🪐
                      </div>
                    </div>

                    {/* Footers */}
                    <div className="grid grid-cols-2 gap-8 pt-6 max-w-md mx-auto text-center border-t border-slate-300">
                      <div>
                        <div className="text-lg font-black text-slate-900 font-serif">SciBuddy 🤖</div>
                        <div className="h-0.5 w-16 bg-slate-400 mx-auto mt-1" />
                        <span className="text-[10px] text-slate-500 uppercase font-black">AI Robot Mascot</span>
                      </div>
                      <div>
                        <div className="text-lg font-black text-slate-900 font-serif">NASA Alliance 🪐</div>
                        <div className="h-0.5 w-16 bg-slate-400 mx-auto mt-1" />
                        <span className="text-[10px] text-slate-500 uppercase font-black">Expedition Chief</span>
                      </div>
                    </div>

                  </div>

                  {/* Actions (Not printed) */}
                  <div className="flex justify-center gap-4 flex-wrap print:hidden">
                    <button
                      onClick={handlePrintCertificate}
                      className="px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 font-black text-sm rounded-xl border-b-4 border-slate-950 btn-bouncy flex items-center gap-2"
                    >
                      <span>📜 Print / Download PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveMission(null);
                        confetti({
                          particleCount: 80,
                          spread: 60,
                          origin: { y: 0.6 }
                        });
                      }}
                      className="px-6 py-3 bg-yellow-400 text-slate-950 hover:bg-yellow-500 font-black text-sm rounded-xl border-b-4 border-yellow-600 btn-bouncy flex items-center gap-1.5"
                    >
                      <span>Done & Back to Mission</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}
