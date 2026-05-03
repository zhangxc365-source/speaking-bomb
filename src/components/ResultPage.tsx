import { motion } from 'motion/react';
import { PlayerScore, YCTWord } from '../types';
import { Check, X, RefreshCw, Home, ArrowRight, Award } from 'lucide-react';

interface ResultPageProps {
  score: PlayerScore;
  allWords?: YCTWord[];
  onRestart: () => void;
  onHome: () => void;
  onNext: () => void;
}

export const ResultPage = ({ score, allWords = [], onRestart, onHome, onNext }: ResultPageProps) => {
  // Simple "tone accuracy" calculation based on wrong counts (mocked)
  const toneErrors = score.wordsHistory.filter(h => !h.correct).length;
  const accuracy = score.wordsHistory.length > 0 
    ? Math.round((score.correctCount / score.wordsHistory.length) * 100) 
    : 0;

  // Words to display in the table
  const displayHistory = (() => {
    if (score.wordsHistory.length > 0) {
      const uniqueWords: { [key: string]: typeof score.wordsHistory[0] } = {};
      score.wordsHistory.forEach(h => {
        uniqueWords[h.word.chinese] = h;
      });
      return Object.values(uniqueWords).sort((a, b) => a.timestamp - b.timestamp);
    } else {
      // If no words were even attempted, show all words for the lesson as failed
      return allWords.map(word => ({
        word,
        correct: false,
        timestamp: 0
      }));
    }
  })();
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-transparent">
      {/* Scrollable Summary Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-800 text-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden text-center shrink-0"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500" />
          
          <Award className="w-10 h-10 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-2 sm:mb-4" />
          <h1 className="text-[clamp(3rem,10vw,6rem)] font-black leading-none mb-1 tracking-tighter">{score.score}</h1>
          <p className="text-[clamp(1rem,3vw,1.5rem)] font-bold text-zinc-400 uppercase tracking-widest">Total Score</p>
          
          <div className="flex justify-center gap-8 sm:gap-12 mt-6 sm:mt-8">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-green-400">{score.correctCount}</div>
              <div className="text-[10px] uppercase font-bold text-zinc-500">Correct</div>
            </div>
            <div className="border-r border-zinc-700" />
            <div>
              <div className="text-2xl sm:text-3xl font-black text-blue-400">{accuracy}%</div>
              <div className="text-[10px] uppercase font-bold text-zinc-500">Accuracy</div>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl border-4 border-zinc-100 overflow-hidden flex flex-col min-h-[300px]">
          <div className="p-4 sm:p-6 bg-zinc-50 border-b-2 border-zinc-100 shrink-0">
            <h2 className="text-lg sm:text-xl font-black text-zinc-800 uppercase italic">Detailed Report</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 text-zinc-400 text-[10px] uppercase font-black sticky top-0">
                <tr>
                  <th className="px-4 sm:px-6 py-4">Status</th>
                  <th className="px-4 sm:px-6 py-4">Word</th>
                  <th className="px-4 sm:px-6 py-4">Pinyin</th>
                  <th className="hidden sm:table-cell px-6 py-4">English</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {displayHistory.map((history, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      {history.correct ? (
                        <div className="bg-green-100 text-green-600 p-1 rounded-lg w-fit">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                      ) : (
                        <div className="bg-red-100 text-red-600 p-1 rounded-lg w-fit">
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-black text-lg sm:text-xl text-zinc-800">{history.word.chinese}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-zinc-500 font-mono text-[10px] sm:text-xs">{history.word.pinyin}</td>
                    <td className="hidden sm:table-cell px-6 py-4 text-zinc-400 text-sm italic">{history.word.english}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {toneErrors > 0 && (
          <div className="bg-orange-50 border-2 border-orange-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shrink-0 mb-4">
            <h3 className="font-black text-orange-800 uppercase text-[10px] mb-1">声调精准度报告 / Tone Report</h3>
            <p className="text-xs sm:text-sm text-orange-700 font-medium">
              You missed some tones! Focus more on <span className="font-bold underline">Rising Tones</span> and <span className="font-bold underline">Falling-Rising Tones</span> next time.
            </p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 w-full p-4 sm:p-8 bg-white/60 backdrop-blur-xl border-t border-zinc-200/50 z-30">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto w-full">
          <ActionButton icon={<RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />} label="重新开始" sub="Restart" color="bg-orange-500" onClick={onRestart} />
          <ActionButton icon={<Home className="w-5 h-5 sm:w-6 sm:h-6" />} label="返回主页" sub="Home Menu" color="bg-blue-600" onClick={onHome} />
          <ActionButton icon={<ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />} label="下一课" sub="Next Lesson" color="bg-green-600" onClick={onNext} />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, sub, color, onClick }: { icon: any; label: string; sub: string; color: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`${color} text-white p-3 sm:p-6 rounded-xl sm:rounded-[2rem] shadow-xl border-b-4 sm:border-b-8 border-black/20 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-2 transition-all active:translate-y-1 active:border-b-0`}
  >
    <div className="sm:scale-150 shrink-0">{icon}</div>
    <div className="flex flex-col items-start sm:items-center">
      <span className="text-lg sm:text-2xl font-black uppercase tracking-tight leading-none mb-1">{sub}</span>
      <span className="text-[10px] sm:text-xs opacity-70 font-bold uppercase tracking-widest">{label}</span>
    </div>
  </button>
);
