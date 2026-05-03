import { motion } from 'motion/react';
import { ArrowLeft, Languages, X } from 'lucide-react';

interface IntroScreenProps {
  onBack: () => void;
}

export const IntroScreen = ({ onBack }: IntroScreenProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onBack}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-4xl max-h-[90vh] p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-orange-100 flex flex-col gap-4 sm:gap-6 overflow-hidden"
      >
        <button
          onClick={onBack}
          className="absolute top-4 right-6 sm:top-6 sm:right-8 text-zinc-400 hover:text-orange-500 transition-colors z-30"
        >
          <X className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <div className="flex items-center gap-4 border-b-2 border-zinc-100 pb-4 sm:pb-6 shrink-0">
          <div className="bg-orange-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
            <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
          </div>
          <h1 className="text-[clamp(1.25rem,4vw,1.875rem)] font-black text-zinc-800 tracking-tight">游戏说明 / Introduction</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 text-zinc-700">
            <section className="space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg font-black text-orange-600 uppercase tracking-wider">Монгол хэл / Mongolian</h2>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm font-bold leading-relaxed">
                <li className="flex gap-2"><span className="text-orange-400">•</span> Тэсрэх бөмбөг дэлбэрэхээс өмнө үгийг зөв хэлээрэй.</li>
                <li className="flex gap-2"><span className="text-orange-400">•</span> Зөв уншвал <span className="text-green-600">+10 оноо</span>.</li>
                <li className="flex gap-2"><span className="text-orange-400">•</span> Алдааг засаж дахин уншиж болно.</li>
                <li className="flex gap-2"><span className="text-orange-400">•</span> 3 дараалан зөв уншвал гал унтраагч (5 сек) авна.</li>
                <li className="flex gap-2"><span className="text-orange-400">•</span> "Алгасах карт"-ыг "Өгүүлбэрийн дасгал" амжилттай хийж авна.</li>
              </ul>
            </section>

            <section className="space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg font-black text-blue-600 uppercase tracking-wider">Instructions / English</h2>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm font-medium leading-relaxed">
                <li className="flex gap-2"><span className="text-blue-400">•</span> Speak the words correctly before the bomb explodes.</li>
                <li className="flex gap-2"><span className="text-blue-400">•</span> Earn <span className="text-green-600 font-bold">+10 pts</span> for each correct answer.</li>
                <li className="flex gap-2"><span className="text-blue-400">•</span> 3 consecutive correct answers earn an Extinguisher (+5s).</li>
                <li className="flex gap-2"><span className="text-blue-400">•</span> Start with 3 Pinyin Hints. Skips are earned via challenges.</li>
                <li className="flex gap-2"><span className="text-blue-400">•</span> Complete "Sentence Practice" to earn powerful Skip Cards.</li>
              </ul>
            </section>
          </div>

          <div className="bg-zinc-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-dashed border-zinc-200 mt-6 mb-2">
            <h3 className="font-black text-center text-[10px] sm:text-xs mb-3 sm:mb-4 text-zinc-400 uppercase tracking-widest">道具介绍 / Item Introduction</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <ItemPreview name="拼音卡" en="Pinyin Card" color="bg-blue-500" />
              <ItemPreview name="灭火器" en="Extinguisher" color="bg-red-500" />
              <ItemPreview name="跳过卡" en="Skip Card" color="bg-zinc-700" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ItemPreview = ({ name, en, color }: { name: string; en: string; color: string }) => (
  <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm border border-zinc-100">
    <div className={`w-10 h-10 ${color} rounded-xl shadow-md`} />
    <span className="text-xs font-black text-zinc-800 text-center uppercase">{name}</span>
    <span className="text-[9px] text-zinc-500 text-center font-bold">{en}</span>
  </div>
);
