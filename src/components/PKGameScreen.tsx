import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { YCTWord, PlayerScore } from '../types';
import { Bomb } from './Bomb';
import { BackgroundDecor } from './BackgroundDecor';
import { VoiceHandler } from '../lib/voice';
import { Howl } from 'howler';
import { calculateMatchScore } from '../lib/matchUtils';
import { ArrowLeftRight, ArrowUpDown, Home, RotateCcw, Info, FlameKindling, SkipForward, Pause, Play } from 'lucide-react';

interface PKGameScreenProps {
  words: YCTWord[];
  onFinish: (winnerScore: PlayerScore, loserScore: PlayerScore) => void;
  onHome: () => void;
  onRestart: () => void;
}

export const PKGameScreen = ({ words, onFinish, onHome, onRestart }: PKGameScreenProps) => {
  const [timeLeft, setTimeLeft] = useState(60 + Math.random() * 30);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [p1WordIdx, setP1WordIdx] = useState(0);
  const [p2WordIdx, setP2WordIdx] = useState(Math.floor(words.length / 2));
  const [status, setStatus] = useState<'idle' | 'recognizing' | 'success' | 'failure'>('idle');
  const [isPaused, setIsPaused] = useState(false);
  
  const [p1Score, setP1Score] = useState<PlayerScore>({ score: 0, correctCount: 0, wordsHistory: [] });
  const [p2Score, setP2Score] = useState<PlayerScore>({ score: 0, correctCount: 0, wordsHistory: [] });
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [isVoiceSupported] = useState(VoiceHandler.isSupported());
  const [showVoiceWarning, setShowVoiceWarning] = useState(false);
  const [micTroubleDetected, setMicTroubleDetected] = useState(false);
  const consecutiveSilence = useRef(0);
  const [showPinyin, setShowPinyin] = useState(false);
  const [p1Items, setP1Items] = useState({ hints: 1, extinguishers: 1, skips: 1 });
  const [p2Items, setP2Items] = useState({ hints: 1, extinguishers: 1, skips: 1 });
  const lastScoredInfo = useRef<{ turn: number; idx: number } | null>(null);
  const p1Queue = useRef<number[]>([]);
  const p2Queue = useRef<number[]>([]);

  const getNextIdx = (playerNum: 1 | 2, excludeIdx?: number) => {
    const queue = playerNum === 1 ? p1Queue : p2Queue;
    if (queue.current.length === 0) {
      const pool = Array.from({ length: words.length }, (_, i) => i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      queue.current = pool;
    }
    
    let next = queue.current.pop() ?? 0;
    return next;
  };

  const handleCorrect = useCallback(() => {
    const currentIdx = turn === 1 ? p1WordIdx : p2WordIdx;
    if (isPaused || winner || status === 'success' || (lastScoredInfo.current?.turn === turn && lastScoredInfo.current?.idx === currentIdx)) return;
    lastScoredInfo.current = { turn, idx: currentIdx };
    
    setStatus('success');
    setShowPinyin(false);
    new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'], volume: 0.5 }).play();

    if (turn === 1) {
      setP1Score(prev => ({ 
        ...prev, 
        score: prev.score + 10, 
        correctCount: prev.correctCount + 1,
        wordsHistory: [...prev.wordsHistory, { word: words[p1WordIdx], correct: true, timestamp: Date.now() }]
      }));
      setP1WordIdx(getNextIdx(1, p2WordIdx));
      setTurn(2);
    } else {
      setP2Score(prev => ({ 
        ...prev, 
        score: prev.score + 10, 
        correctCount: prev.correctCount + 1,
        wordsHistory: [...prev.wordsHistory, { word: words[p2WordIdx], correct: true, timestamp: Date.now() }]
      }));
      setP2WordIdx(getNextIdx(2, p1WordIdx));
      setTurn(1);
    }

    setTimeout(() => {
      setStatus('listening');
    }, 500);
  }, [turn, words, winner, status, isPaused]);


  const useHint = (player: 1 | 2) => {
    if (isPaused || turn !== player) return;
    const items = player === 1 ? p1Items : p2Items;
    const setItems = player === 1 ? setP1Items : setP2Items;
    if (items.hints > 0) {
      setItems(prev => ({ ...prev, hints: prev.hints - 1 }));
      setShowPinyin(true);
    }
  };

  const useExtinguisher = (player: 1 | 2) => {
    if (isPaused || turn !== player) return;
    const items = player === 1 ? p1Items : p2Items;
    const setItems = player === 1 ? setP1Items : setP2Items;
    if (items.extinguishers > 0) {
      setItems(prev => ({ ...prev, extinguishers: prev.extinguishers - 1 }));
      setTimeLeft(t => t + 5);
    }
  };

  const useSkip = (player: 1 | 2) => {
    if (isPaused || turn !== player) return;
    const items = player === 1 ? p1Items : p2Items;
    const setItems = player === 1 ? setP1Items : setP2Items;
    if (items.skips > 0) {
      setItems(prev => ({ ...prev, skips: prev.skips - 1 }));
      handleCorrect();
    }
  };

  const voiceRef = useRef<VoiceHandler | null>(null);
  const logicRef = useRef({ turn, p1WordIdx, p2WordIdx, words, winner, status, p1Score, p2Score, handleCorrect, isPaused });

  useEffect(() => {
    const idx1 = getNextIdx(1);
    const idx2 = getNextIdx(2, idx1);
    setP1WordIdx(idx1);
    setP2WordIdx(idx2);
  }, []);

  useEffect(() => {
    logicRef.current = { turn, p1WordIdx, p2WordIdx, words, winner, status, p1Score, p2Score, handleCorrect, isPaused };
  }, [turn, p1WordIdx, p2WordIdx, words, winner, status, p1Score, p2Score, handleCorrect, isPaused]);

  useEffect(() => {
    if (!isVoiceSupported) {
      setShowVoiceWarning(true);
      return;
    }

    const voice = new VoiceHandler('zh-CN');
    voiceRef.current = voice;

    voice.listen((text) => {
      const { isPaused } = logicRef.current;
      if (isPaused) return;

      consecutiveSilence.current = 0;
      setMicTroubleDetected(false);
      
      const { turn, p1WordIdx, p2WordIdx, words, winner, status, handleCorrect } = logicRef.current;
      if (winner || status === 'success') return;

      const currentWord = turn === 1 ? words[p1WordIdx] : words[p2WordIdx];
      
      const matchPercent = calculateMatchScore(currentWord.chinese, text);
      if (matchPercent >= 15) {
        setTimeLeft(prev => prev + 1.5);
        handleCorrect();
      }
    }, () => {
      const { isPaused } = logicRef.current;
      if (isPaused) return;

      if (status === 'listening' || status === 'idle') {
        setStatus('recognizing');
        setTimeout(() => setStatus(prev => (prev === 'recognizing' ? 'listening' : prev)), 1500);
      }
    });

    const silenceCheck = setInterval(() => {
      const { isPaused } = logicRef.current;
      if (!isPaused && !winner && status === 'listening') {
        consecutiveSilence.current += 1;
        if (consecutiveSilence.current >= 10) {
          setMicTroubleDetected(true);
        }
      }
    }, 1000);

    setStatus('listening');

    return () => {
      voice.stop();
      clearInterval(silenceCheck);
    };
  }, [isVoiceSupported]);

  useEffect(() => {
    if (winner || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          setStatus('failure');
          const winPlayer = turn === 1 ? 2 : 1;
          setWinner(winPlayer);
          
          new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/1671/1671-preview.mp3'], volume: 1.0 }).play();
          
          setTimeout(() => {
            onFinish(winPlayer === 1 ? p1Score : p2Score, winPlayer === 1 ? p2Score : p1Score);
          }, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [turn, onFinish, winner, isPaused]);


  return (
    <div className="flex flex-col h-screen bg-transparent md:flex-row overflow-hidden relative text-zinc-800">
      <BackgroundDecor />
      
      {/* Player 1 Area */}
      <div className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-500 overflow-y-auto scrollbar-hide py-12 ${turn === 1 ? 'bg-orange-500/5' : 'opacity-40 grayscale pointer-events-none'}`}>
        <div className="text-[clamp(1rem,3vw,1.25rem)] font-black mb-1 flex flex-col items-center gap-0.5 shrink-0">
          <span className="text-zinc-600 uppercase tracking-widest text-[8px] sm:text-[10px]">Player 1</span>
          <span className="text-orange-600 text-xs sm:text-sm">玩家 1</span>
          {turn === 1 && !winner && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="w-1 h-1 bg-red-500 rounded-full mt-0.5" />}
        </div>
        <div className="text-[clamp(2.5rem,8vw,4rem)] font-black text-orange-500 mb-2 drop-shadow-sm shrink-0">{p1Score.score}</div>
        
        <div className="relative">
          {winner === 1 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} className="absolute -top-16 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-1 rounded-full font-black text-xl sm:text-3xl shadow-2xl z-50 whitespace-nowrap">
              WIN!
            </motion.div>
          )}
          {turn === 1 && (
            <div className="flex flex-col items-center gap-1 sm:gap-2 translate-y-[5px] sm:translate-y-[10px] cursor-pointer" onClick={() => {
              if (turn === 1 && (micTroubleDetected || !isVoiceSupported)) handleCorrect();
            }}>
              <Bomb 
                status={status} 
                timeLeft={timeLeft} 
                word={words[p1WordIdx].chinese}
                isLarge={false} 
              />
              {turn === 1 && (micTroubleDetected || !isVoiceSupported) && (
                <div className="bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-bounce z-20">
                  点击强行通过
                </div>
              )}
              <div className="text-zinc-500 text-sm sm:text-lg font-black uppercase tracking-widest text-center italic opacity-60 mt-2">
                {words[p1WordIdx].english}
              </div>
              <AnimatePresence>
                {(status === 'recognizing' || status === 'listening') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="px-3 py-0.5 bg-black/5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-2"
                  >
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${status === 'recognizing' ? 'bg-red-500 scale-125' : 'bg-green-500'} rounded-full animate-pulse transition-all`} />
                    {status === 'recognizing' ? '正在识别' : '正在聆听'}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showPinyin && turn === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mt-2 bg-white/80 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-xl border border-zinc-200 shadow-lg text-xl sm:text-3xl font-mono text-orange-600 font-bold"
                  >
                    {words[p1WordIdx].pinyin}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* P1 Items */}
        <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 shrink-0">
          <SmallItemButton icon={<Info className="w-3 h-3 sm:w-4 sm:h-4" />} title="Hint" subtitle="提示" count={p1Items.hints} onClick={() => useHint(1)} disabled={turn !== 1 || p1Items.hints === 0} color="bg-blue-600" />
          <SmallItemButton icon={<FlameKindling className="w-3 h-3 sm:w-4 sm:h-4" />} title="Safe" subtitle="灭火器" count={p1Items.extinguishers} onClick={() => useExtinguisher(1)} disabled={turn !== 1 || p1Items.extinguishers === 0} color="bg-red-600" />
          <SmallItemButton icon={<SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />} title="Skip" subtitle="跳过" count={p1Items.skips} onClick={() => useSkip(1)} disabled={turn !== 1 || p1Items.skips === 0} color="bg-zinc-600" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-1.5 w-full bg-zinc-100 md:h-full md:w-2 flex items-center justify-center shrink-0 z-20">
        <div className="bg-white border-2 border-zinc-100 p-1.5 sm:p-2 rounded-full hidden md:block shadow-sm">
          <ArrowLeftRight className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400" />
        </div>
        <div className="bg-white border-2 border-zinc-100 p-1.5 sm:p-2 rounded-full md:hidden shadow-sm">
          <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400" />
        </div>
      </div>

      {/* Player 2 Area */}
      <div className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-500 overflow-y-auto scrollbar-hide py-12 ${turn === 2 ? 'bg-blue-500/5' : 'opacity-40 grayscale pointer-events-none'}`}>
        <div className="text-[clamp(1rem,3vw,1.25rem)] font-black mb-1 flex flex-col items-center gap-0.5 shrink-0">
          <span className="text-zinc-600 uppercase tracking-widest text-[8px] sm:text-[10px]">Player 2</span>
          <span className="text-blue-600 text-xs sm:text-sm">玩家 2</span>
          {turn === 2 && !winner && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="w-1 h-1 bg-red-500 rounded-full mt-0.5" />}
        </div>
        <div className="text-[clamp(2.5rem,8vw,4rem)] font-black text-blue-500 mb-2 drop-shadow-sm shrink-0">{p2Score.score}</div>
        
        <div className="relative">
          {winner === 2 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} className="absolute -top-16 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-1 rounded-full font-black text-xl sm:text-3xl shadow-2xl z-50 whitespace-nowrap">
              WIN!
            </motion.div>
          )}
          {turn === 2 && (
            <div className="flex flex-col items-center gap-1 sm:gap-2 translate-y-[5px] sm:translate-y-[10px] cursor-pointer" onClick={() => {
              if (turn === 2 && (micTroubleDetected || !isVoiceSupported)) handleCorrect();
            }}>
              <Bomb 
                status={status} 
                timeLeft={timeLeft} 
                word={words[p2WordIdx].chinese}
                isLarge={false} 
              />
              {turn === 2 && (micTroubleDetected || !isVoiceSupported) && (
                <div className="bg-blue-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-bounce z-20">
                  点击强行通过
                </div>
              )}
              <div className="text-zinc-500 text-sm sm:text-lg font-black uppercase tracking-widest text-center italic opacity-60 mt-2">
                {words[p2WordIdx].english}
              </div>
              <AnimatePresence>
                {(status === 'recognizing' || status === 'listening') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="px-3 py-0.5 bg-black/5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-2"
                  >
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${status === 'recognizing' ? 'bg-red-500 scale-125' : 'bg-green-500'} rounded-full animate-pulse transition-all`} />
                    {status === 'recognizing' ? '正在识别' : '正在聆听'}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showPinyin && turn === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mt-2 bg-white/80 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-xl border border-zinc-200 shadow-lg text-xl sm:text-3xl font-mono text-blue-600 font-bold"
                  >
                    {words[p2WordIdx].pinyin}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* P2 Items */}
        <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 shrink-0">
          <SmallItemButton icon={<Info className="w-3 h-3 sm:w-4 sm:h-4" />} title="Hint" subtitle="提示" count={p2Items.hints} onClick={() => useHint(2)} disabled={turn !== 2 || p2Items.hints === 0} color="bg-blue-600" />
          <SmallItemButton icon={<FlameKindling className="w-3 h-3 sm:w-4 sm:h-4" />} title="Safe" subtitle="灭火器" count={p2Items.extinguishers} onClick={() => useExtinguisher(2)} disabled={turn !== 2 || p2Items.extinguishers === 0} color="bg-red-600" />
          <SmallItemButton icon={<SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />} title="Skip" subtitle="跳过" count={p2Items.skips} onClick={() => useSkip(2)} disabled={turn !== 2 || p2Items.skips === 0} color="bg-zinc-600" />
        </div>
      </div>

      {/* Control Buttons Overlay */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex gap-2 z-50">
        <button onClick={() => setIsPaused(true)} className="p-2 sm:p-3 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl shadow-md text-zinc-500">
          <Pause className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Pause Menu */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#FDF9F3]/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 sm:gap-8 z-[100] p-6 overflow-y-auto"
          >
            <h2 className="text-[clamp(2rem,8vw,4rem)] font-black italic text-zinc-300 mb-4 sm:mb-8 tracking-tighter uppercase">暂停 PAUSED</h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 w-full max-w-xs">
              <LargeMenuButton icon={<Play className="fill-white w-5 h-5 sm:w-6 sm:h-6" />} title="Resume" subtitle="继续游戏" color="bg-orange-500" onClick={() => setIsPaused(false)} />
              <LargeMenuButton icon={<RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />} title="Restart" subtitle="重新开始" color="bg-zinc-700" onClick={onRestart} />
              <LargeMenuButton icon={<Home className="w-5 h-5 sm:w-6 sm:h-6" />} title="Home Menu" subtitle="返回主页" color="bg-zinc-700" onClick={onHome} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Warning Mode */}
      <AnimatePresence>
        {showVoiceWarning && (
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6 sm:p-10 gap-6 sm:gap-8 overflow-y-auto"
          >
            <div className="bg-orange-100 p-6 sm:p-8 rounded-full shrink-0">
              <RotateCcw className="w-10 h-10 sm:w-16 sm:h-16 text-orange-600" />
            </div>
            <div className="text-center space-y-4 max-w-sm">
              <h3 className="text-[clamp(1.5rem,5vw,2.5rem)] font-black text-zinc-900 uppercase">语音异常 DETECTION ERROR</h3>
              <p className="text-zinc-500 font-medium text-xs sm:text-sm leading-relaxed">
                您的浏览器可能有兼容性问题（尤其是 Edge）。<br/>
                建议更换为 <span className="text-blue-600">Chrome</span>。
              </p>
              <button
                onClick={() => {
                  setShowVoiceWarning(false);
                }}
                className="bg-zinc-800 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl font-black text-base sm:text-lg shadow-xl active:scale-95 transition-all w-full"
              >
                我知道了，进入备选点击模式
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinyin Hint Overlay */}
      <AnimatePresence>
        {showPinyin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-10 py-6 sm:px-20 sm:py-12 rounded-3xl border border-zinc-200 shadow-xl text-3xl sm:text-[10rem] font-mono text-orange-600 font-bold z-50 whitespace-nowrap"
          >
            {turn === 1 ? words[p1WordIdx].pinyin : words[p2WordIdx].pinyin}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SmallItemButton = ({ icon, count, onClick, disabled, color, title, subtitle }: { icon: any; count: number; onClick: () => void; disabled: boolean; color: string; title: string; subtitle: string }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${color} ${disabled ? 'opacity-20' : 'active:translate-y-0.5 shadow-lg'} p-2 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col items-center gap-0.5 sm:gap-1 transition-all relative text-white border-b-2 sm:border-b-4 border-black/20`}
  >
    <div className="scale-75 sm:scale-90">{icon}</div>
    <div className="text-[10px] sm:text-xs font-black uppercase leading-none mt-1">{title}</div>
    <div className="text-[6px] sm:text-[8px] font-bold opacity-60 uppercase leading-none mb-1">{subtitle}</div>
    <div className="absolute top-0.5 right-0.5 bg-white text-zinc-800 text-[6px] sm:text-[8px] font-black px-1 sm:px-1.5 rounded-full min-w-[12px] sm:min-w-[16px] text-center shadow-sm">
      {count}
    </div>
  </button>
);

const LargeMenuButton = ({ icon, title, subtitle, color, onClick }: { icon: any; title: string; subtitle: string; color: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`${color} text-white flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all w-full`}
  >
    <div className="bg-black/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl shrink-0">{icon}</div>
    <div className="text-left">
      <div className="text-lg sm:text-2xl font-black uppercase tracking-tight leading-none">{title}</div>
      <div className="text-[10px] sm:text-xs font-bold opacity-60 uppercase tracking-widest mt-1">{subtitle}</div>
    </div>
  </button>
);
