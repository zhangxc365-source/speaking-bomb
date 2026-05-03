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
    <div className="min-h-[100dvh] max-w-6xl mx-auto w-full flex flex-col relative z-10">
      {/* 顶部标题：不滚动 */}
      <div className="shrink-0 px-4 sm:px-6 pt-8 pb-4">
        <div className="text-center bg-white py-8 rounded-[3rem] shadow-sm border border-zinc-100">
          <h1 className="text-4xl font-black text-zinc-800 uppercase italic tracking-tighter">
            准备 / PREPARATION
          </h1>
          <p className="text-zinc-500 font-bold tracking-widest">{level} • {lesson}</p>
        </div>
      </div>

      {/* 词条区：仅此区域纵向滑动，不会被底部按钮盖住 */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 pb-2 [scrollbar-gutter:stable]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-6 pb-4">
          {words.map((word, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-zinc-50 py-4 sm:py-6 px-4 sm:px-6 rounded-3xl border border-zinc-200 flex flex-col items-center gap-1 sm:gap-2 group hover:bg-white hover:shadow-lg hover:border-orange-200 transition-all cursor-default"
            >
              <span className="text-sm sm:text-lg font-mono font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                {word.pinyin}
              </span>
              <span className="text-4xl sm:text-6xl font-black text-zinc-800 tracking-tight">{word.chinese}</span>
              <span className="text-xs sm:text-base text-zinc-400 font-bold uppercase text-center mt-1 group-hover:text-zinc-600 leading-tight">
                {word.english}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 开始按钮：贴底一栏，不参与滚动 */}
      <div className="shrink-0 border-t border-zinc-200/80 bg-[#FDF9F3]/95 backdrop-blur-md px-4 sm:px-6 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="max-w-sm mx-auto w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 sm:py-6 rounded-[2.5rem] font-black text-2xl sm:text-3xl shadow-2xl border-b-8 border-orange-700 flex items-center justify-center gap-4 group"
          >
            <Play className="w-9 h-9 sm:w-10 sm:h-10 fill-white shrink-0" />
            开始 / START
          </motion.button>
        </div>
      </div>
    </div>
  );
};
