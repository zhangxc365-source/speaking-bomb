import { motion } from 'motion/react';
import { PlayerScore, YCTWord } from '../types';
import { Award, RefreshCw, Home, Trophy, Skull, ArrowRight } from 'lucide-react';

interface PKResultPageProps {
  p1Score: PlayerScore;
  p2Score: PlayerScore;
  allWords?: YCTWord[];
  onRestart: () => void;
  onHome: () => void;
  onNext: () => void;
}

export const PKResultPage = ({ p1Score, p2Score, allWords = [], onRestart, onHome, onNext }: PKResultPageProps) => {
  const p1Winner = p1Score.score > p2Score.score;
  const p2Winner = p2Score.score > p1Score.score;
  const draw = p1Score.score === p2Score.score;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-transparent">
      {/* Scrollable Comparison Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 max-w-6xl mx-auto w-full">
        <div className="text-center shrink-0">
          <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-black text-zinc-800 italic uppercase tracking-tighter">对抗总结 PK SUMMARY</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-stretch">
          {/* Player 1 Card */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`relative p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-xl overflow-hidden border-4 sm:border-8 ${
              p1Winner ? 'bg-orange-500 border-yellow-400' : 'bg-white border-zinc-100'
            }`}
          >
            {p1Winner && (
              <div className="absolute top-2 right-4 sm:top-4 sm:right-8 bg-yellow-400 text-black px-3 sm:px-6 py-0.5 sm:py-1 rounded-full font-black text-lg sm:text-2xl z-20 shadow-lg">
                WIN!
              </div>
            )}
            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl ${p1Winner ? 'bg-white/20' : 'bg-orange-500'}`}>
                {p1Winner ? <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-white" /> : <Skull className="w-6 h-6 sm:w-10 sm:h-10 text-white" />}
              </div>
              <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-widest mb-0.5 sm:mb-1 ${p1Winner ? 'text-white' : 'text-orange-600'}`}>玩家 1</h2>
              <p className={`text-[8px] sm:text-[10px] uppercase font-bold mb-4 sm:mb-6 tracking-[0.3em] ${p1Winner ? 'text-white/60' : 'text-zinc-400'}`}>Player 1</p>
              
              <div className={`text-6xl sm:text-8xl font-black mb-6 sm:mb-8 ${p1Winner ? 'text-white' : 'text-zinc-800'}`}>{p1Score.score}</div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${p1Winner ? 'bg-white/10' : 'bg-zinc-50'}`}>
                  <div className={`text-2xl sm:text-3xl font-black ${p1Winner ? 'text-white' : 'text-green-500'}`}>{p1Score.correctCount}</div>
                  <div className={`text-[8px] sm:text-[10px] font-black uppercase ${p1Winner ? 'text-white/50' : 'text-zinc-400'}`}>答对</div>
                </div>
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${p1Winner ? 'bg-white/10' : 'bg-zinc-50'}`}>
                  <div className={`text-2xl sm:text-3xl font-black ${p1Winner ? 'text-white' : 'text-blue-500'}`}>{p1Score.wordsHistory.length}</div>
                  <div className={`text-[8px] sm:text-[10px] font-black uppercase ${p1Winner ? 'text-white/50' : 'text-zinc-400'}`}>总量</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Player 2 Card */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`relative p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-xl overflow-hidden border-4 sm:border-8 ${
              p2Winner ? 'bg-blue-600 border-yellow-400' : 'bg-white border-zinc-100'
            }`}
          >
            {p2Winner && (
              <div className="absolute top-2 right-4 sm:top-4 sm:right-8 bg-yellow-400 text-black px-3 sm:px-6 py-0.5 sm:py-1 rounded-full font-black text-lg sm:text-2xl z-20 shadow-lg">
                WIN!
              </div>
            )}
            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl ${p2Winner ? 'bg-white/20' : 'bg-blue-600'}`}>
                {p2Winner ? <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-white" /> : <Skull className="w-6 h-6 sm:w-10 sm:h-10 text-white" />}
              </div>
              <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-widest mb-0.5 sm:mb-1 ${p2Winner ? 'text-white' : 'text-blue-600'}`}>玩家 2</h2>
              <p className={`text-[8px] sm:text-[10px] uppercase font-bold mb-4 sm:mb-6 tracking-[0.3em] ${p2Winner ? 'text-white/60' : 'text-zinc-400'}`}>Player 2</p>
              
              <div className={`text-6xl sm:text-8xl font-black mb-6 sm:mb-8 ${p2Winner ? 'text-white' : 'text-zinc-800'}`}>{p2Score.score}</div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${p2Winner ? 'bg-white/10' : 'bg-zinc-50'}`}>
                  <div className={`text-2xl sm:text-3xl font-black ${p2Winner ? 'text-white' : 'text-green-500'}`}>{p2Score.correctCount}</div>
                  <div className={`text-[8px] sm:text-[10px] font-black uppercase ${p2Winner ? 'text-white/50' : 'text-zinc-400'}`}>答对</div>
                </div>
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${p2Winner ? 'bg-white/10' : 'bg-zinc-50'}`}>
                  <div className={`text-2xl sm:text-3xl font-black ${p2Winner ? 'text-white' : 'text-blue-500'}`}>{p2Score.wordsHistory.length}</div>
                  <div className={`text-[8px] sm:text-[10px] font-black uppercase ${p2Winner ? 'text-white/50' : 'text-zinc-400'}`}>总量</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {draw && (
          <div className="text-center bg-zinc-800 text-white p-4 sm:p-6 rounded-2xl shadow-xl shrink-0">
            <span className="text-xl sm:text-3xl font-black italic uppercase">平局 IT'S A DRAW!</span>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 w-full p-4 sm:p-8 bg-white/60 backdrop-blur-xl border-t border-zinc-200/50 z-30 flex flex-col items-center">
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
    className={`${color} text-white p-3 sm:p-6 rounded-xl sm:rounded-[2rem] shadow-xl border-b-4 sm:border-b-8 border-black/20 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-2 transition-all active:translate-y-1 active:border-b-0 w-full`}
  >
    <div className="sm:scale-150 shrink-0">{icon}</div>
    <div className="flex flex-col items-start sm:items-center">
      <span className="text-lg sm:text-2xl font-black uppercase tracking-tight leading-none mb-1">{sub}</span>
      <span className="text-[10px] sm:text-xs opacity-70 font-bold uppercase tracking-widest">{label}</span>
    </div>
  </button>
);
