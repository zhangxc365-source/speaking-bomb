import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface LevelSelectProps {
  onBack: () => void;
  onConfirm: (level: string, lesson: string) => void;
}

export const LevelSelect = ({ onBack, onConfirm }: LevelSelectProps) => {
  const levels = ['YCT1', 'YCT2', 'YCT3', 'YCT4', 'YCT5', 'YCT6'];
  
  const [selectedLevel, setSelectedLevel] = React.useState('YCT1');
  const [selectedLesson, setSelectedLesson] = React.useState('Lesson 1');

  const getLessonCount = (level: string) => {
    if (['YCT5', 'YCT6'].includes(level)) return 15; // 14 lessons + 1 review
    return 12; // 11 lessons + 1 review
  };

  const currentLessonCount = getLessonCount(selectedLevel);
  const lessons = Array.from({ length: currentLessonCount }, (_, i) => `Lesson ${i + 1}`);

  // Auto-reset lesson if it exceeds current count
  React.useEffect(() => {
    const lessonIdx = parseInt(selectedLesson.split(' ')[1]);
    if (lessonIdx > currentLessonCount) {
      setSelectedLesson('Lesson 1');
    }
  }, [selectedLevel, currentLessonCount]);

  return (
    <div className="h-screen flex flex-col pt-12 sm:pt-20 overflow-hidden bg-transparent">
      {/* Header */}
      <div className="p-4 sm:p-6 shrink-0 z-20">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-600 hover:text-black font-bold">
          <ArrowLeft /> Back
        </button>
      </div>

      {/* Scrollable Grid Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-32 flex flex-col gap-6 sm:gap-10">
        <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] shadow-xl border-4 border-zinc-100 flex flex-col gap-6 sm:gap-10 w-full max-w-5xl mx-auto">
          <div>
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-black text-center mb-4 sm:mb-6 text-zinc-800 tracking-tighter uppercase italic">级别 / LEVEL</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl font-black text-xl sm:text-2xl transition-all border-b-4 sm:border-b-8 ${selectedLevel === lvl ? 'bg-orange-500 text-white border-orange-700 -translate-y-1' : 'bg-zinc-100 text-zinc-400 border-zinc-300 hover:bg-zinc-200'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-black text-center mb-4 sm:mb-6 text-zinc-800 tracking-tighter uppercase italic">课目 / LESSON</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
              {lessons.map((lesson) => {
                const isReview = (lesson === 'Lesson 12' && !['YCT5', 'YCT6'].includes(selectedLevel)) ||
                                 (lesson === 'Lesson 15' && ['YCT5', 'YCT6'].includes(selectedLevel));
                return (
                  <button
                    key={lesson}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all border-b-4 ${selectedLesson === lesson ? 'bg-blue-600 text-white border-blue-800 -translate-y-1 shadow-lg' : 'bg-zinc-100 text-zinc-400 border-zinc-300 hover:bg-zinc-200'}`}
                  >
                    <div className="flex flex-col items-center justify-center whitespace-nowrap overflow-hidden">
                      {isReview ? (
                        <span className="text-[12px] sm:text-sm opacity-70 uppercase leading-none font-black">Review</span>
                      ) : (
                        <span className="truncate">{lesson}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 w-full p-4 sm:p-8 bg-white/60 backdrop-blur-xl border-t border-zinc-200/50 z-30">
        <div className="max-w-4xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onConfirm(selectedLevel, selectedLesson)}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-xl sm:text-2xl shadow-xl border-b-4 sm:border-b-8 border-green-700 transition-all flex flex-col items-center"
          >
            <span className="text-xl sm:text-3xl leading-none mb-1 uppercase tracking-tight">Confirm</span>
            <span className="text-sm sm:text-lg opacity-80">确认</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Add React import for the above file to ensure it works
import React from 'react';
