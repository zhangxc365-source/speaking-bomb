import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { YCTWord, PlayerScore, GameMode } from '../types';
import { Bomb } from './Bomb';
import { BackgroundDecor } from './BackgroundDecor';
import { Pause, RotateCcw, Home, SkipForward, FlameKindling, Info, Play, AlertTriangle } from 'lucide-react';
import { VoiceHandler } from '../lib/voice';
import { Howl } from 'howler';
import { calculateMatchScore } from '../lib/matchUtils';

interface GameScreenProps {
  mode: GameMode;
  words: YCTWord[];
  onFinish: (score: PlayerScore) => void;
  onHome: () => void;
  onRestart: () => void;
}

export const GameScreen = ({ mode, words, onFinish, onHome, onRestart }: GameScreenProps) => {
  const [timeLeft, setTimeLeft] = useState(60 + Math.random() * 30);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [status, setStatus] = useState<'idle' | 'listening' | 'recognizing' | 'success' | 'failure'>('listening');
  const [score, setScore] = useState<PlayerScore>({ score: 0, correctCount: 0, wordsHistory: [] });
  const [isPaused, setIsPaused] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [hints, setHints] = useState(3);
  const [extinguishers, setExtinguishers] = useState(0);
  const [skips, setSkips] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [isVoiceSupported, setIsVoiceSupported] = useState(VoiceHandler.isSupported());
  const [showVoiceWarning, setShowVoiceWarning] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [micTroubleDetected, setMicTroubleDetected] = useState(false);
  const consecutiveSilence = useRef(0);
  const wordQueue = useRef<number[]>([]);
  const lastScoredIdx = useRef<number | null>(null);

  // Shuffle logic: ensure all words are shown before repeating
  const getNextIdx = useCallback(() => {
    if (wordQueue.current.length === 0) {
      // Create new pool and shuffle
      const pool = Array.from({ length: words.length }, (_, i) => i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      wordQueue.current = pool;
    }
    return wordQueue.current.pop() || 0;
  }, [words.length]);

  const currentWord = words[currentWordIdx];

  const handleNextWord = useCallback(() => {
    const nextIdx = getNextIdx();
    setCurrentWordIdx(nextIdx);
    setStatus('listening');
    setShowPinyin(false);
  }, [getNextIdx]);

  const handleCorrect = useCallback(() => {
    if (status === 'success' || lastScoredIdx.current === currentWordIdx) return;
    lastScoredIdx.current = currentWordIdx;
    setStatus('success');
    
    new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'], volume: 0.5 }).play();

    setScore(prev => ({
      ...prev,
      score: prev.score + 10,
      correctCount: prev.correctCount + 1,
      wordsHistory: [...prev.wordsHistory, { word: currentWord, correct: true, timestamp: Date.now() }]
    }));

// 1. 先声明一个变量计算出“下一次”的数值
const nextConsecutive = consecutiveCorrect + 1;
// 2. 更新连对次数
setConsecutiveCorrect(nextConsecutive);
// 3. 方案 B：直接在这里判断并奖励灭火器
if (nextConsecutive > 0 && nextConsecutive % 3 === 0) {
  setExtinguishers(prev => prev + 1);
}

    setTimeout(() => {
      handleNextWord();
    }, 200);
  }, [currentWord, handleNextWord, status]);

  const voiceRef = useRef<VoiceHandler | null>(null);
  const [lastHeard, setLastHeard] = useState('');
  const logicRef = useRef({ currentWord, handleCorrect, isPaused });

  useEffect(() => {
    logicRef.current = { currentWord, handleCorrect, isPaused };
  }, [currentWord, handleCorrect, isPaused]);

  useEffect(() => {
    // Initial shuffle and pick first word
    const firstIdx = getNextIdx();
    setCurrentWordIdx(firstIdx);
  }, []); // Initial load only

  useEffect(() => {
    if (!isVoiceSupported) {
      setShowVoiceWarning(true);
      return;
    }

    const voice = new VoiceHandler('zh-CN');
    voiceRef.current = voice;

    voice.listen((text) => {
      setLastHeard(text);
      consecutiveSilence.current = 0; // Reset silence counter
      setMicTroubleDetected(false);
      
      const { currentWord, handleCorrect, isPaused } = logicRef.current;
      if (isPaused) return;

      const matchPercent = calculateMatchScore(currentWord.chinese, text);
      if (matchPercent >= 15) { 
        // 答对奖励 2 秒，不再重置，也不设置 15s 的低上限
        setTimeLeft(prev => prev + 2);
        handleCorrect();
        setLastHeard('');
      }
    }, () => {
      setStatus(prev => prev === 'listening' ? 'recognizing' : prev);
      setTimeout(() => setStatus(prev => prev === 'recognizing' ? 'listening' : prev), 1500);
    });

    // Check for "silence" - if no input for a long time despite being in play
    const silenceCheck = setInterval(() => {
      if (!isPaused && status === 'listening') {
        consecutiveSilence.current += 1;
        if (consecutiveSilence.current >= 10) { // 10 seconds of silence
          setMicTroubleDetected(true);
        }
      }
    }, 1000);

    return () => {
      voice.stop();
      clearInterval(silenceCheck);
    };
  }, [isVoiceSupported]);

  useEffect(() => {
    if (isPaused || (status !== 'listening' && status !== 'recognizing')) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        
        if (next <= 0) {
          clearInterval(timer);
          setStatus('failure');
          // Explosion sound (short)
          new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/1671/1671-preview.mp3'], volume: 1.0 }).play();
          setTimeout(() => onFinish(score), 2000);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isPaused, score, onFinish]);

  const useHint = () => {
    if (hints > 0) {
      setHints(h => h - 1);
      setShowPinyin(true);
    }
  };

  const useExtinguisher = () => {
    if (extinguishers > 0) {
      setExtinguishers(e => e - 1);
      setTimeLeft(t => t + 5);
    }
  };

  const useSkip = () => {
    if (skips > 0) {
      setSkips(s => s - 1);
      handleNextWord();
      new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'], volume: 0.3 }).play();
    } else {
      setIsPaused(true);
      setShowChallenge(true);
    }
  };

  const handleChallengeSuccess = () => {
    setSkips(s => s + 1);
    setConsecutiveCorrect(0);
    setShowChallenge(false);
    setIsPaused(false);
    handleNextWord();
    new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'], volume: 0.5 }).play();
  };

  const handleChallengeFailure = () => {
    setConsecutiveCorrect(0);
    setShowChallenge(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-transparent text-zinc-800 relative">
      <BackgroundDecor />

      {/* Header - Added shrink-0 */}
      <div className="p-4 flex items-center justify-between z-10 shrink-0">
        <div className="bg-white/80 backdrop-blur px-4 sm:px-6 py-2 rounded-2xl border border-zinc-200 shadow-xl">
          <span className="text-zinc-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest block text-center">分数 SCORE</span>
          <span className="text-xl sm:text-2xl font-black text-orange-500 block text-center">{score.score}</span>
        </div>
        
        <div className="flex gap-2">
          <IconButton icon={<Pause />} onClick={() => setIsPaused(p => !p)} />
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 sm:gap-6 p-4 sm:p-6 z-10 overflow-y-auto scrollbar-hide py-8">
          <div className="relative cursor-pointer" onClick={() => {
            if (micTroubleDetected || !isVoiceSupported) {
              handleCorrect();
            }
          }}>
            {(status === 'recognizing' || status === 'listening') && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: status === 'recognizing' ? 0.4 : 0.15 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute inset-0 bg-white/40 rounded-full blur-2xl pointer-events-none"
              />
            )}
            <Bomb 
              status={status} 
              timeLeft={timeLeft} 
              word={currentWord.chinese}
              isLarge={true}
            />
            
            {/* Fallback indicator */}
            {(micTroubleDetected || !isVoiceSupported) && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-full z-20"
              >
                <div className="bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg animate-bounce whitespace-nowrap">
                  检测到语音故障：点击炸弹跳过
                </div>
              </motion.div>
            )}
          </div>
        
        <AnimatePresence>
          {(status === 'recognizing' || status === 'listening') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-3 py-1 bg-black/5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-4"
            >
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${status === 'recognizing' ? 'bg-red-500 scale-125' : 'bg-green-500'} rounded-full animate-pulse transition-all`} />
              {status === 'recognizing' ? '正在识别 RECOGNIZING' : '正在聆听 LISTENING'}
            </motion.div>
          )}

          {showPinyin && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white/80 backdrop-blur-md px-6 py-2 sm:px-10 sm:py-4 rounded-2xl border border-zinc-200 shadow-lg text-3xl sm:text-5xl font-mono text-orange-600 font-bold mt-2"
            >
              {currentWord.pinyin}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-zinc-400 text-[clamp(1rem,4vw,1.75rem)] font-bold uppercase tracking-widest text-center max-w-xs mt-1">
          {currentWord.english}
        </div>

        {/* Real-time Recognition Feedback */}
        <AnimatePresence>
          {lastHeard && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-orange-400/60 font-mono text-[10px] sm:text-xs text-center line-clamp-1 italic max-w-sm px-4 mt-2"
            >
              " {lastHeard} "
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Items Bar - Redesigned for better space usage */}
      <div className="p-3 sm:p-6 bg-white/70 backdrop-blur-xl border-t border-zinc-200 grid grid-cols-3 gap-2 sm:gap-4 z-10 shrink-0">
        <ItemButton 
          icon={<Info className="w-4 h-4 sm:w-5 sm:h-5" />} 
          title="Pinyin" 
          subtitle="拼音卡" 
          count={hints} 
          onClick={useHint} 
          disabled={hints === 0 || showPinyin} 
          color="bg-blue-600"
        />
        <ItemButton 
          icon={<FlameKindling className="w-4 h-4 sm:w-5 sm:h-5" />} 
          title="Extinguish" 
          subtitle="灭火器" 
          count={extinguishers} 
          onClick={useExtinguisher} 
          disabled={extinguishers === 0} 
          color="bg-red-600"
        />
        <ItemButton 
          icon={<SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />} 
          title="Skip" 
          subtitle="跳过卡" 
          count={skips} 
          onClick={useSkip} 
          disabled={false} 
          color="bg-zinc-600"
        />
      </div>

      {/* Voice Warning Modal */}
      <AnimatePresence>
        {showVoiceWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6 sm:p-10 gap-6 sm:gap-8 overflow-y-auto"
          >
            <div className="bg-orange-100 p-6 sm:p-8 rounded-full shrink-0">
              <AlertTriangle className="w-10 h-10 sm:w-16 sm:h-16 text-orange-600" />
            </div>
            <div className="text-center space-y-4 max-w-sm">
              <h3 className="text-[clamp(1.5rem,5vw,2.5rem)] font-black text-zinc-900 uppercase">浏览器不兼容<br/>BROWSER NOT SUPPORTED</h3>
              <p className="text-zinc-500 font-medium text-xs sm:text-sm leading-relaxed">
                您的浏览器未开放语音识别权限或不支持该功能。 Edge 浏览器最近可能存在兼容问题。<br/>
                <span className="text-zinc-800 font-bold">【建议方案】</span>：请尝试使用 <span className="text-blue-600">Google Chrome</span> 或手机端的 <span className="text-blue-600">Safari</span>。
              </p>
              <div className="pt-2 sm:pt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsVoiceSupported(true); // 假装支持，进入“点击模式”
                    setShowVoiceWarning(false);
                  }}
                  className="bg-zinc-800 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl font-black text-base sm:text-lg shadow-xl active:scale-95 transition-all"
                >
                  使用手动点击模式 (CLICKS)
                </button>
                <button
                  onClick={onHome}
                  className="text-zinc-400 font-bold hover:text-zinc-600 transition-colors text-xs sm:text-sm"
                >
                  返回主页 BACK TO HOME
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Modal */}
      <AnimatePresence>
        {showChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-xl z-[60] flex flex-col items-center justify-center p-6 sm:p-8 gap-6 sm:gap-10 overflow-y-auto"
          >
            <div className="text-center">
              <h3 className="text-[clamp(1.5rem,5vw,3rem)] font-black text-zinc-300 italic uppercase mb-2">句子练习 SENTENCE PRACTICE</h3>
              <p className="text-zinc-500 font-bold text-sm sm:text-lg mt-2">完成后按“成功”跳过并获得奖励</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-sm mt-4 sm:mt-10">
              <button
                onClick={handleChallengeSuccess}
                className="bg-green-500 text-white py-4 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black text-lg sm:text-2xl shadow-xl border-b-4 sm:border-b-8 border-green-700 active:translate-y-1 transition-all"
              >
                成功 / SUCCESS
              </button>
              <button
                onClick={handleChallengeFailure}
                className="bg-zinc-400 text-white py-4 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black text-lg sm:text-2xl shadow-xl border-b-4 sm:border-b-8 border-zinc-600 active:translate-y-1 transition-all"
              >
                失败 / FAIL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Menu */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#FDF9F3]/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 sm:gap-8 z-50 p-6 overflow-y-auto"
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
    </div>
  );
};

const IconButton = ({ icon, onClick }: { icon: any; onClick: () => void }) => (
  <button onClick={onClick} className="p-2 sm:p-3 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 active:scale-95 transition-all text-zinc-500 shadow-sm">
    <div className="scale-90 sm:scale-100">{icon}</div>
  </button>
);

const ItemButton = ({ icon, title, subtitle, count, onClick, disabled, color }: { icon: any; title: string; subtitle: string; count: number; onClick: () => void; disabled: boolean; color: string }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${color} ${disabled ? 'opacity-30' : 'active:translate-y-1 shadow-lg'} px-2 py-3 sm:px-4 sm:py-4 rounded-xl sm:rounded-[1.5rem] flex flex-col items-center gap-1 transition-all relative overflow-hidden group text-white border-b-2 sm:border-b-4 border-black/20`}
  >
    <div className="scale-90 sm:scale-110 mb-0.5">{icon}</div>
    <span className="text-sm sm:text-xl font-black uppercase tracking-tight leading-none whitespace-nowrap">{title}</span>
    <span className="text-[8px] sm:text-[10px] opacity-70 font-bold uppercase tracking-widest leading-none mt-1 whitespace-nowrap">{subtitle}</span>
    <div className="absolute top-1 right-1 bg-white text-zinc-800 text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 rounded-full min-w-[16px] sm:min-w-[20px] text-center shadow-sm">
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
