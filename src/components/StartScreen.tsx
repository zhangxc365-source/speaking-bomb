import { motion } from 'motion/react';
import React from 'react';
import { GameMode } from '../types';
import { Bomb as BombIcon, Users, FileText } from 'lucide-react';

interface StartScreenProps {
  onSelectMode: (mode: GameMode) => void;
}

export const StartScreen = ({ onSelectMode }: StartScreenProps) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-transparent">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 flex flex-col items-center justify-center py-12 sm:py-20 pb-24 sm:pb-32">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 leading-tight drop-shadow-xl">
            口语炸弹
          </h1>
          <p className="text-[clamp(1.25rem,4vw,2.5rem)] font-bold text-zinc-700 tracking-[0.2em] font-sans uppercase">
            Speaking Bomb
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 w-full max-w-5xl mx-auto">
          <ModeButton
            icon={<BombIcon className="w-6 h-6 sm:w-10 sm:h-10" />}
            title="单人模式"
            subtitle="Solo Mode"
            color="bg-orange-500"
            hoverColor="hover:bg-orange-600"
            onClick={() => onSelectMode('SOLO')}
            delay={0.1}
          />
          <ModeButton
            icon={<Users className="w-6 h-6 sm:w-10 sm:h-10" />}
            title="对战模式"
            subtitle="PK Mode"
            color="bg-red-500"
            hoverColor="hover:bg-red-600"
            onClick={() => onSelectMode('PK')}
            delay={0.2}
          />
          <ModeButton
            icon={<FileText className="w-6 h-6 sm:w-10 sm:h-10" />}
            title="游戏说明"
            subtitle="Introduction"
            color="bg-zinc-700"
            hoverColor="hover:bg-zinc-800"
            onClick={() => onSelectMode('INTRO')}
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
};

interface ModeButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  hoverColor: string;
  onClick: () => void;
  delay: number;
}

const ModeButton = ({ icon, title, subtitle, color, hoverColor, onClick, delay }: ModeButtonProps) => (
  <motion.button
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ delay }}
    onClick={onClick}
    className={`${color} ${hoverColor} text-white p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-xl flex items-center md:flex-col gap-3 sm:gap-4 transition-all duration-300 border-b-4 sm:border-b-8 border-black/20 w-full group`}
  >
    <div className="bg-white/20 p-2 sm:p-4 rounded-xl sm:rounded-2xl shrink-0">
      {icon}
    </div>
    <div className="flex flex-col items-start md:items-center">
      <h2 className="text-[clamp(1.25rem,3vw,1.875rem)] font-black font-sans leading-tight">{subtitle}</h2>
      <p className="text-[clamp(0.8rem,1.5vw,1rem)] opacity-80 font-bold tracking-widest">{title}</p>
    </div>
  </motion.button>
);
