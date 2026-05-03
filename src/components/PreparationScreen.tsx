import { motion } from 'motion/react';
import { YCTWord } from '../types';
import { Play } from 'lucide-react';

interface PreparationScreenProps {
  words: YCTWord[];
  onStart: () => void;
  level: string;
  lesson: string;
}

export const PreparationScreen = ({ words, onStart, level, lesson }: PreparationScreenProps) => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 pt-10 pb-40 flex flex-col gap-8 min-h-screen relative overflow-y-auto">
      <div className="text-center bg-white py-8 rounded-[3rem] shadow-sm border border-zinc-100">
        <h1 className="text-4xl font-black text-zinc-800 uppercase italic tracking-tighter">
          准备 / PREPARATION
        </h1>
        <p className="text-zinc-500 font-bold tracking-widest">{level} • {lesson}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-6">
        {words.map((word, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-zinc-50 py-4 sm:py-6 px-4 sm:px-6 rounded-3xl border border-zinc-200 flex flex-col items-center gap-1 sm:gap-2 group hover:bg-white hover:shadow-lg hover:border-orange-200 transition-all cursor-default"
          >
            <span className="text-sm sm:text-lg font-mono font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{word.pinyin}</span>
            <span className="text-4xl sm:text-6xl font-black text-zinc-800 tracking-tight">{word.chinese}</span>
            <span className="text-xs sm:text-base text-zinc-400 font-bold uppercase text-center mt-1 group-hover:text-zinc-600 leading-tight">
              {word.english}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-[2.5rem] font-black text-3xl shadow-2xl border-b-8 border-orange-700 flex items-center justify-center gap-4 group"
        >
          <Play className="w-10 h-10 fill-white" />
          开始 / START
        </motion.button>
      </div>
    </div>
  );
};
