export interface UserProgress {
  name: string;
  grade: string;
  xp: number;
  coins: number;
  level: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedLessons: string[];
  quizScores: Record<string, number>; // topicId -> score percentage (0-100)
  badges: string[]; // list of badge ids
  timeSpent: number; // minutes spent
  unlockedItems: string[]; // ids of custom elements unlocked in shop
}

export interface Badge {
  id: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  icon: string; // lucide or emoji
  color: string; // tailwind color class
  xpRequired: number;
}

export interface VocabularyItem {
  wordEn: string;
  wordHi: string;
  defEn: string;
  defHi: string;
}

export interface QuizQuestion {
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
}

export interface LessonContent {
  storyEn: string;
  storyHi: string;
  factsEn: string[];
  factsHi: string[];
  vocab: VocabularyItem[];
  examplesEn: string[];
  examplesHi: string[];
  miniChallengeEn: string;
  miniChallengeHi: string;
  quiz: QuizQuestion[];
}

export interface ScienceTopic {
  id: string;
  category: 'earth' | 'life' | 'physics' | 'chemistry';
  icon: string;
  color: string; // e.g. 'indigo'
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  lesson: LessonContent;
}

export interface ShopItem {
  id: string;
  nameEn: string;
  nameHi: string;
  price: number;
  icon: string;
  descEn: string;
  descHi: string;
}
