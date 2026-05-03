import { motion } from 'motion/react';
import { useState } from 'react';
import { HelpCircle, Star, Music, Ghost, PenTool } from 'lucide-react';

interface PenaltyScreenProps {
  onFinish: () => void;
}

export const PenaltyScreen = ({ onFinish }: PenaltyScreenProps) => {
  const penalties = [
    { text: 'MAKE A FACE', icon: <Ghost />, sub: 'Make a face', color: '#FF6B6B' },
    { text: 'ANIMAL SOUND', icon: <HelpCircle />, sub: 'Animal sound', color: '#4ECDC4' },
    { text: 'SING A SENTENCE', icon: <Music />, sub: 'Sing a sentence', color: '#FFE66D' },
    { text: 'LUCKY WIN', icon: <Star />, sub: 'Lucky (No penalty)', color: '#FF9F43' },
    { text: 'WRITE A WORD', icon: <PenTool />, sub: 'Write a word', color: '#1A535C' },
  ];

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const randomIdx = Math.floor(Math.random() * penalties.length);
    // Number of rotations + target index
    const totalRotation = 1800 + (randomIdx * (360 / penalties.length));
    
    setTimeout(() => {
      setResult(randomIdx);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-transparent">
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 sm:py-8 flex flex-col items-center justify-center gap-6 sm:gap-10">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center z-10 shrink-0">
          <h1 className="text-[clamp(2rem,8vw,3rem)] font-black text-red-600 italic tracking-tighter uppercase mb-1">
            惩罚转盘
          </h1>
          <p className="text-[clamp(0.75rem,2vw,1rem)] font-bold text-zinc-400 uppercase tracking-widest">Penalty Wheel</p>
        </motion.div>

        <div className="relative w-full max-w-[280px] sm:max-w-[360px] aspect-square z-10 shrink-0">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-10 h-14 bg-zinc-900 clip-triangle z-30 shadow-xl" 
               style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}>
            <div className="w-full h-1/2 bg-red-500" />
          </div>

          <motion.div
            animate={{ rotate: spinning ? 1800 + (result || 0) * (360 / penalties.length) : (result || 0) * (360 / penalties.length) }}
            transition={{ duration: spinning ? 3 : 0, ease: [0.12, 0, 0.39, 0] }}
            className="w-full h-full rounded-full border-[10px] border-zinc-900 bg-white shadow-[0_0_60px_rgba(0,0,0,0.15)] overflow-hidden relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {penalties.map((p, idx) => {
                const startAngle = (idx * 360) / penalties.length;
                const endAngle = ((idx + 1) * 360) / penalties.length;
                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                
                return (
                  <path
                    key={idx}
                    d={pathData}
                    fill={p.color}
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="0.5"
                  />
                );
              })}
            </svg>

            {/* Labels on Wheel */}
            {penalties.map((p, idx) => {
              const angle = (idx * 360 / penalties.length) + (360 / penalties.length / 2);
              return (
             <div
                key={idx}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div className="flex flex-col items-center gap-1 translate-x-[85px] sm:translate-x-[115px] translate-y-[-15px] sm:translate-y-[-25px] -rotate-100">
                  <div className="text-zinc-900 scale-[0.8] sm:scale-[1] drop-shadow-sm flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8">
                    {p.icon}
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-black text-black leading-tight max-w-[50px] sm:max-w-[70px] text-center uppercase tracking-tighter">
                    {p.text}
                  </span>
                </div>
              </div>
              );
            })}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white rounded-full border-4 sm:border-8 border-zinc-900 z-10 shadow-inner" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Result Backdrop or Control */}
      {result !== null && !spinning ? (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="text-center bg-white p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-red-100 max-w-sm w-full relative z-20"
          >
            <div 
              className="p-5 sm:p-7 rounded-[1.5rem] sm:rounded-[2rem] w-fit mx-auto mb-4 sm:mb-6 text-white shadow-lg"
              style={{ backgroundColor: penalties[result].color }}
            >
              <div className="scale-[1.8] sm:scale-[2.5]">{penalties[result].icon}</div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-800 mb-1 sm:mb-2">{penalties[result].text}</h2>
            <p className="text-sm sm:text-lg font-bold text-zinc-500 uppercase tracking-widest mb-6 sm:mb-8">{penalties[result].sub}</p>
            
            <button
              onClick={onFinish}
              className="w-full bg-orange-500 text-white py-4 sm:py-6 rounded-2xl sm:rounded-[1.8rem] font-black text-xl sm:text-2xl shadow-xl hover:bg-orange-600 active:scale-95 transition-all border-b-4 sm:border-b-8 border-orange-700"
            >
              确认 / CONFIRM
            </button>
          </motion.div>
        </div>
      ) : (
        /* Sticky Bottom for Spin Button */
        <div className="sticky bottom-0 w-full p-4 sm:p-8 bg-white/40 backdrop-blur-xl border-t border-zinc-200/50 z-30">
          <div className="max-w-md mx-auto">
            <button
              onClick={spin}
              disabled={spinning}
              className={`w-full ${spinning ? 'bg-zinc-300 border-zinc-400' : 'bg-red-500 hover:bg-red-600 active:translate-y-2 border-red-700'} text-white py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] font-black text-xl sm:text-2xl shadow-xl transition-all border-b-4 sm:border-b-8`}
            >
              {spinning ? '正在转动...' : '开始转动 / SPIN'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
