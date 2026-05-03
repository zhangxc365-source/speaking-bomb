import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface BombProps {
  status: 'idle' | 'listening' | 'recognizing' | 'success' | 'failure';
  timeLeft: number;
  word: string;
  isLarge?: boolean;
}

export const Bomb = ({ status, timeLeft, word, isLarge }: BombProps) => {
  const [vibrate, setVibrate] = useState(false);

  useEffect(() => {
    if (status === 'recognizing') {
      const interval = setInterval(() => setVibrate(v => !v), 80);
      return () => clearInterval(interval);
    }
    setVibrate(false);
  }, [status]);

  return (
    <div className="relative flex flex-col items-center justify-center p-8 pt-20">
      <motion.div
        animate={vibrate ? { 
          x: [-4, 4, -4, 4, 0], 
          scale: [1, 1.02, 1] 
        } : status === 'success' ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{ duration: 0.1, repeat: Infinity }}
        className="relative"
      >
        {/* Glow Effect for active bomb */}
        <AnimatePresence>
          {status === 'recognizing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-orange-500/30 rounded-full blur-3xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Fuse Spark */}
        {timeLeft > 0 && status !== 'success' && (
          <motion.div
            className={`absolute ${isLarge ? '-top-24 scale-150' : '-top-20 scale-125'} left-1/2 -translate-x-1/2 z-20`}
            animate={{ scale: [1, 2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 0.2 }}
          >
            <div className="w-8 h-8 rounded-full bg-yellow-400 blur-md animate-pulse shadow-[0_0_25px_rgba(250,204,21,1)]" />
          </motion.div>
        )}

        {/* Bomb Body - Responsive */}
        <div className={`relative ${isLarge ? 'w-[320px] h-[320px]' : 'w-[240px] h-[240px]'} rounded-full border-[10px] transition-all duration-300 ${status === 'success' ? 'bg-green-100 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.5)]' : status === 'failure' ? 'bg-red-200 border-red-700' : 'bg-zinc-900 border-zinc-800 shadow-2xl'}`}>
          {/* Fuse Stem */}
          <div className={`absolute ${isLarge ? '-top-14 w-7 h-16' : '-top-10 w-5 h-12'} left-1/2 -translate-x-1/2 bg-zinc-700 rounded-t-xl`} />

          {/* Word Display Area */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isLarge ? 'w-48 h-48' : 'w-36 h-36'} bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)] border-4 border-zinc-200`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={word}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-center"
              >
                <div className={`${isLarge ? 'text-7xl' : 'text-5xl'} font-black text-zinc-800 font-sans tracking-tight`}>
                  {word}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Success / Failure Overlays */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.3 }}
            className="absolute inset-0 bg-green-500/20 rounded-full pointer-events-none border-8 border-green-400"
          />
        )}
      </motion.div>

      {/* Invisible spacer to maintain layout */}
      <div className="mt-8 h-4 select-none opacity-0" aria-hidden="true">
        {timeLeft}
      </div>
    </div>
  );
};
