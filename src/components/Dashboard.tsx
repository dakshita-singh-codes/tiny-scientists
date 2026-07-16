import React, { useState } from 'react';
import { UserProgress } from '../types';
import { translations } from '../data/translations';
import { motion } from 'motion/react';
import { Users, BookOpen, Clock, Trash2, Trophy, Award, TrendingUp, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardProps {
  progress: UserProgress;
  lang: 'en' | 'hi';
  onResetProgress: () => void;
}

interface StudentRecord {
  name: string;
  grade: string;
  xp: number;
  completedLessonsCount: number;
  averageScore: number;
  timeSpent: number;
  streak: number;
}

export default function Dashboard({ progress, lang, onResetProgress }: DashboardProps) {
  const t = translations[lang];

  // Fictitious classmates for demonstration in Indian government classrooms
  const [students, setStudents] = useState<StudentRecord[]>([
    { name: progress.name || 'Pranav Kumar', grade: `Class ${progress.grade || '5'}`, xp: progress.xp, completedLessonsCount: progress.completedLessons.length, averageScore: calculateAverageScore(), timeSpent: progress.timeSpent, streak: progress.streak },
    { name: 'Anjali Sharma', grade: 'Class 5', xp: 280, completedLessonsCount: 4, averageScore: 90, timeSpent: 45, streak: 5 },
    { name: 'Aarav Gupta', grade: 'Class 6', xp: 410, completedLessonsCount: 5, averageScore: 95, timeSpent: 60, streak: 8 },
    { name: 'Sneha Reddy', grade: 'Class 4', xp: 120, completedLessonsCount: 2, averageScore: 80, timeSpent: 20, streak: 2 }
  ]);

  const [activeStudentName, setActiveStudentName] = useState<string>(students[0].name);

  function calculateAverageScore() {
    const scores = Object.values(progress.quizScores);
    if (scores.length === 0) return 0;
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / scores.length);
  }

  const selectedStudent = students.find(s => s.name === activeStudentName) || students[0];

  // Topics for chart data representation
  const topicChartData = [
    { labelEn: 'Solar System', labelHi: 'सौर मंडल', score: progress.quizScores['solar_system'] ?? 0 },
    { labelEn: 'Water Cycle', labelHi: 'जल चक्र', score: progress.quizScores['water_cycle'] ?? 0 },
    { labelEn: 'Plant Growth', labelHi: 'पौधों का विकास', score: progress.quizScores['plant_growth'] ?? 0 },
    { labelEn: 'Human Body', labelHi: 'मानव शरीर', score: progress.quizScores['human_body'] ?? 0 },
    { labelEn: 'Electricity', labelHi: 'विद्युत', score: progress.quizScores['electricity'] ?? 0 },
    { labelEn: 'Magnets', labelHi: 'चुंबक', score: progress.quizScores['magnets'] ?? 0 },
  ];

  const handleReset = () => {
    if (confirm(lang === 'en' ? 'Are you sure you want to reset all progress for this journey?' : 'क्या आप वास्तव में इस यात्रा की सभी प्रगति को हटाना चाहते हैं?')) {
      onResetProgress();
      confetti({
        particleCount: 50,
        colors: ['#ef4444', '#f59e0b']
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl border-4 border-slate-950 p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <span className="text-sm uppercase tracking-widest text-indigo-400 font-extrabold flex items-center justify-center md:justify-start gap-1">
            <Users className="w-4 h-4" />
            <span>{lang === 'en' ? 'Educator Insights' : 'शिक्षक विश्लेषण'}</span>
          </span>
          <h2 className="text-2xl md:text-3xl font-black">
            {t.teacherTitle}
          </h2>
          <p className="text-xs text-slate-300 font-bold max-w-lg">
            {lang === 'en'
              ? 'Monitor quiz analytics, track student focus sessions, download certs, and guide learning targets for Class 4-8 government school curricula.'
              : 'क्विज़ एनालिटिक्स, अध्ययन के समय की प्रगति की निगरानी करें और छात्रों की विज्ञान यात्रा का मार्गदर्शन करें।'}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleReset}
          className="px-5 py-3.5 bg-red-500 hover:bg-red-600 border-2 border-white text-white font-black rounded-2xl text-xs md:text-sm shadow-md btn-bouncy shrink-0 flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t.resetProgress}</span>
        </button>
      </div>

      {/* Stats Blocks Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.averageScore, val: `${selectedStudent.averageScore}%`, desc: lang === 'en' ? 'Mastery targets' : 'क्विज़ पूर्णता', icon: <Trophy className="w-6 h-6 text-yellow-500" />, bg: 'bg-yellow-50 text-yellow-800' },
          { label: lang === 'en' ? 'Topics Completed' : 'पूरे किए गए विषय', val: `${selectedStudent.completedLessonsCount} / 6`, desc: lang === 'en' ? 'Science modules' : 'विज्ञान इकाइयाँ', icon: <BookOpen className="w-6 h-6 text-indigo-500" />, bg: 'bg-indigo-50 text-indigo-800' },
          { label: t.totalTime, val: `${selectedStudent.timeSpent} mins`, desc: lang === 'en' ? 'Active discovery' : 'खोज समय', icon: <Clock className="w-6 h-6 text-sky-500" />, bg: 'bg-sky-50 text-sky-800' },
          { label: t.streak, val: `${selectedStudent.streak} days`, desc: lang === 'en' ? 'Daily streak' : 'दैनिक श्रृंखला', icon: <Calendar className="w-6 h-6 text-rose-500" />, bg: 'bg-rose-50 text-rose-800' },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl border-3 border-slate-900 flex items-center gap-4 ${stat.bg}`}>
            <div className="w-12 h-12 bg-white rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-sm">
              {stat.icon}
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-slate-500 block leading-tight">{stat.label}</span>
              <span className="text-xl md:text-2xl font-black block mt-0.5">{stat.val}</span>
              <span className="text-[9px] font-bold text-slate-500 block">{stat.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Panel split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class student list roster */}
        <div className="bg-white rounded-3xl border-4 border-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <span>📋</span> {lang === 'en' ? 'Classroom Roster' : 'कक्षा की छात्र सूची'}
          </h3>

          <div className="space-y-2">
            {students.map((stud) => {
              const isActive = stud.name === activeStudentName;
              return (
                <button
                  key={stud.name}
                  onClick={() => setActiveStudentName(stud.name)}
                  className={`w-full p-3 rounded-2xl border-2 border-slate-900 text-left flex items-center justify-between transition-all btn-bouncy ${
                    isActive 
                      ? 'bg-indigo-50 border-indigo-500 shadow-sm' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">{stud.name}</h4>
                    <span className="text-[10px] text-slate-500 font-bold block">{stud.grade}</span>
                  </div>
                  <span className="text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-900 font-black">
                    ⭐ {stud.xp} XP
                  </span>
                </button>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs font-bold text-blue-800 space-y-1">
            <h5 className="font-black flex items-center gap-1">
              <span>👨‍🏫</span> {lang === 'en' ? 'Teacher Recommendation' : 'शिक्षक के लिए सुझाव'}
            </h5>
            <p>
              {lang === 'en'
                ? `${selectedStudent.name} is performing excellent! Encourage them to take the printable Master Diploma Certificate once they earn 200 XP!`
                : `${selectedStudent.name} शानदार प्रदर्शन कर रहे हैं! 200 XP पूरे होने पर उन्हें प्रमाणपत्र डाउनलोड करने के लिए कहें!`}
            </p>
          </div>
        </div>

        {/* Charts and details */}
        <div className="lg:col-span-2 bg-white rounded-3xl border-4 border-slate-900 p-6 flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <span>{lang === 'en' ? 'Quiz Topic Analysis' : 'विषय-वार क्विज़ विश्लेषण'}</span>
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                {lang === 'en' ? `Comparing percentage scores for ${selectedStudent.name}` : `${selectedStudent.name} के अंक प्रतिशत`}
              </p>
            </div>
            <span className="text-xs font-black bg-indigo-50 border border-indigo-200 text-indigo-800 px-3 py-1 rounded-xl uppercase">
              Target: 80% passing score
            </span>
          </div>

          {/* Interactive Custom SVG Column Chart */}
          <div className="w-full bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 h-64 flex flex-col justify-between">
            {/* Chart grid lines and bars */}
            <div className="flex-1 w-full flex items-end justify-around gap-2 px-2 relative border-b-2 border-slate-900">
              {/* Y-axis markings */}
              <div className="absolute left-2 inset-y-0 flex flex-col justify-between text-[8px] font-mono font-black text-slate-400 pointer-events-none select-none">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {topicChartData.map((data, idx) => {
                const heightPercent = Math.max(5, data.score); // minimum bar height to look nice
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-900 text-white font-mono text-[9px] px-2 py-1 rounded border border-amber-400 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                      {data.score}% Score
                    </div>

                    {/* Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`w-full max-w-[28px] rounded-t-lg border-2 border-slate-900 shadow-inner ${
                        data.score >= 100 
                          ? 'bg-amber-400' 
                          : data.score >= 80 
                          ? 'bg-emerald-500' 
                          : data.score > 0 
                          ? 'bg-rose-400' 
                          : 'bg-slate-200 border-dashed border-slate-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-axis Labels */}
            <div className="flex justify-around mt-2.5 text-[9px] font-black text-slate-500 select-none px-2 uppercase leading-tight text-center">
              {topicChartData.map((data, idx) => (
                <span key={idx} className="flex-1 truncate">
                  {lang === 'en' ? data.labelEn : data.labelHi}
                </span>
              ))}
            </div>
          </div>

          {/* Legends */}
          <div className="flex justify-center gap-4 flex-wrap text-[10px] font-black text-slate-500 uppercase select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-amber-400 rounded border border-slate-950 block" />
              <span>Perfect (100%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-emerald-500 rounded border border-slate-950 block" />
              <span>Passing (80-99%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-rose-400 rounded border border-slate-950 block" />
              <span>Needs Review</span>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
