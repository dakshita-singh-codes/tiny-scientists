export interface TranslationDict {
  appName: string;
  tagline: string;
  taglineHi: string;
  startLearning: string;
  letsDiscover: string;
  home: string;
  lessons: string;
  lab: string;
  games: string;
  aiTutor: string;
  rewards: string;
  dashboard: string;
  settings: string;
  english: string;
  hindi: string;
  dyslexiaMode: string;
  highContrast: string;
  textToSpeech: string;
  xpPoints: string;
  level: string;
  streak: string;
  coins: string;
  dailyFact: string;
  questionOfDay: string;
  featuredTopics: string;
  achievements: string;
  testimonials: string;
  badgesTitle: string;
  leaderboard: string;
  certificate: string;
  teacherTitle: string;
  viewProgress: string;
  downloadCert: string;
  averageScore: string;
  totalTime: string;
  resetProgress: string;
  saveProgress: string;
  congrats: string;
  correctAnswer: string;
  wrongAnswer: string;
  hint: string;
  next: string;
  previous: string;
  submit: string;
  retry: string;
  playStory: string;
  pauseStory: string;
  readAloud: string;
  interactiveLab: string;
  funFacts: string;
  vocabulary: string;
  miniChallenge: string;
  quizTitle: string;
  trySimulation: string;
  scibuddyWelcome: string;
  askSomething: string;
  send: string;
  streakDays: string;
  levelBadge: string;
  welcomeBack: string;
}

export const translations: Record<'en' | 'hi', TranslationDict> = {
  en: {
    appName: "Tiny Scientists",
    tagline: "Little Minds. Big Discoveries.",
    taglineHi: "छोटे दिमाग। बड़ी खोजें।",
    startLearning: "🚀 Start Learning!",
    letsDiscover: "Let's Discover Together!",
    home: "🏠 Home",
    lessons: "📚 Learn Topics",
    lab: "🧪 Virtual Lab",
    games: "🎮 Play Games",
    aiTutor: "🤖 SciBuddy AI",
    rewards: "⭐ My Rewards",
    dashboard: "📊 Teacher & Parent Hub",
    settings: "⚙️ Accessibility",
    english: "English",
    hindi: "हिन्दी",
    dyslexiaMode: "Dyslexia Friendly Font",
    highContrast: "High Contrast Theme",
    textToSpeech: "🔊 Audio Read Aloud",
    xpPoints: "XP Points",
    level: "Level",
    streak: "Streak",
    coins: "Coins",
    dailyFact: "💡 Daily Science Spark!",
    questionOfDay: "❓ Daily Quiz Quest",
    featuredTopics: "✨ Top Science Expeditions",
    achievements: "🏅 Space Hall of Fame",
    testimonials: "💬 What Young Scientists Say",
    badgesTitle: "🏅 Science Explorer Badges",
    leaderboard: "🏆 Star Leaderboard",
    certificate: "📜 Master Certificate",
    teacherTitle: "📊 Teacher & Parent Dashboard",
    viewProgress: "View Student Progress",
    downloadCert: "Download Science Certificate",
    averageScore: "Average Quiz Score",
    totalTime: "Total Explorer Time",
    resetProgress: "Reset Journey State",
    saveProgress: "Save Progress Securely",
    congrats: "🎉 Incredible Job, Tiny Scientist!",
    correctAnswer: "🌟 That's Correct! You nailed it!",
    wrongAnswer: "💡 Keep trying! Every mistake is a discovery!",
    hint: "🔍 SciBuddy Hint",
    next: "Next ➔",
    previous: "Previous ⬅",
    submit: "Check Answer ✔",
    retry: "Try Again 🔄",
    playStory: "🔊 Play Voice",
    pauseStory: "⏸ Pause",
    readAloud: "🔊 Read Aloud",
    interactiveLab: "🧪 Mini Interactive Lab",
    funFacts: "💡 Fun Science Facts!",
    vocabulary: "📖 Science Word Power",
    miniChallenge: "🎯 Hands-on Mini Challenge",
    quizTitle: "🧠 Brain Teaser Quiz",
    trySimulation: "🧪 Launch Virtual Simulator",
    scibuddyWelcome: "Hi! I am SciBuddy. Ask me any science questions, and I will explain them with fun examples! I speak English and हिन्दी!",
    askSomething: "Ask SciBuddy (e.g. why is sky blue?)...",
    send: "Ask 🚀",
    streakDays: "day streak! Keep going!",
    levelBadge: "Level Explorer",
    welcomeBack: "Welcome Back, Chief Scientist!"
  },
  hi: {
    appName: "नन्हें वैज्ञानिक",
    tagline: "छोटे दिमाग। बड़ी खोजें।",
    taglineHi: "छोटे दिमाग। बड़ी खोजें।",
    startLearning: "🚀 पढ़ना शुरू करें!",
    letsDiscover: "आओ मिलकर खोजें!",
    home: "🏠 मुख्य पृष्ठ",
    lessons: "📚 विज्ञान पाठ",
    lab: "🧪 वर्चुअल लैब",
    games: "🎮 ज्ञानवर्धक खेल",
    aiTutor: "🤖 साई-बडी एआई",
    rewards: "⭐ मेरे पुरस्कार",
    dashboard: "📊 शिक्षक और अभिभावक हब",
    settings: "⚙️ सुगमता विकल्प",
    english: "English",
    hindi: "हिन्दी",
    dyslexiaMode: "डिस्लेक्सिया अनुकूल फ़ॉन्ट",
    highContrast: "हाई कंट्रास्ट थीम",
    textToSpeech: "🔊 बोलकर सुनाएं",
    xpPoints: "अनुभव अंक (XP)",
    level: "स्तर (Level)",
    streak: "लगातार दिन (Streak)",
    coins: "सिक्के (Coins)",
    dailyFact: "💡 दैनिक विज्ञान चमक!",
    questionOfDay: "❓ आज का सवाल",
    featuredTopics: "✨ प्रमुख विज्ञान विषय",
    achievements: "🏅 हॉल ऑफ फेम",
    testimonials: "💬 हमारे बाल वैज्ञानिकों के विचार",
    badgesTitle: "🏅 विज्ञान एक्सप्लोरर बैज",
    leaderboard: "🏆 लीडरबोर्ड",
    certificate: "📜 मास्टर प्रमाण पत्र",
    teacherTitle: "📊 शिक्षक और अभिभावक डैशबोर्ड",
    viewProgress: "छात्र की प्रगति देखें",
    downloadCert: "प्रमाण पत्र डाउनलोड करें",
    averageScore: "औसत क्विज़ स्कोर",
    totalTime: "कुल खर्च समय",
    resetProgress: "प्रगति रीसेट करें",
    saveProgress: "प्रगति सुरक्षित करें",
    congrats: "🎉 अद्भुत काम, नन्हें वैज्ञानिक!",
    correctAnswer: "🌟 बिल्कुल सही उत्तर! बहुत बढ़िया!",
    wrongAnswer: "💡 प्रयास करते रहें! हर गलती एक नई सीख है!",
    hint: "🔍 साई-बडी संकेत",
    next: "आगे बढ़ें ➔",
    previous: "पीछे जाएं ⬅",
    submit: "उत्तर जांचें ✔",
    retry: "फिर से प्रयास करें 🔄",
    playStory: "🔊 कहानी सुनें",
    pauseStory: "⏸ रोकें",
    readAloud: "🔊 बोलकर सुनाएं",
    interactiveLab: "🧪 मिनी प्रयोगात्मक लैब",
    funFacts: "💡 मजेदार विज्ञान तथ्य!",
    vocabulary: "📖 विज्ञान शब्द भंडार",
    miniChallenge: "🎯 व्यावहारिक चुनौती",
    quizTitle: "🧠 दिमाग की कसरत क्विज़",
    trySimulation: "🧪 वर्चुअल सिम्युलेटर शुरू करें",
    scibuddyWelcome: "नमस्ते! मैं हूँ साई-बडी। मुझसे विज्ञान का कोई भी सवाल पूछें, और मैं उसे मजेदार उदाहरणों के साथ समझाऊंगा! मैं हिंदी और अंग्रेजी दोनों बोल सकता हूँ!",
    askSomething: "साई-बडी से पूछें (जैसे: आसमान नीला क्यों है?)...",
    send: "पूछें 🚀",
    streakDays: "दिन का सफर! बढ़ते रहो!",
    levelBadge: "स्तर खोजकर्ता",
    welcomeBack: "आपका स्वागत है, मुख्य वैज्ञानिक!"
  }
};
