import { useState, useCallback } from 'react';
import { YCT_WORDS } from './data/yctContent';
import { GameMode, GameState, YCTWord, PlayerScore } from './types';
import { StartScreen } from './components/StartScreen';
import { LevelSelect } from './components/LevelSelect';
import { IntroScreen } from './components/IntroScreen';
import { PreparationScreen } from './components/PreparationScreen';
import { GameScreen } from './components/GameScreen';
import { PKGameScreen } from './components/PKGameScreen';
import { PenaltyScreen } from './components/PenaltyScreen';
import { ResultPage } from './components/ResultPage';
import { BackgroundDecor } from './components/BackgroundDecor';

import { PKResultPage } from './components/PKResultPage';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [gameMode, setGameMode] = useState<GameMode>('SOLO');
  const [selectedLevel, setSelectedLevel] = useState('YCT1');
  const [selectedLesson, setSelectedLesson] = useState('Lesson 1');
  const [gameWords, setGameWords] = useState<YCTWord[]>([]);
  const [playerScore, setPlayerScore] = useState<PlayerScore>({ score: 0, correctCount: 0, wordsHistory: [] });
  const [p2Score, setP2Score] = useState<PlayerScore>({ score: 0, correctCount: 0, wordsHistory: [] });

  const handleStartGame = useCallback((level: string, lesson: string) => {
    setSelectedLevel(level);
    setSelectedLesson(lesson);
    
    let wordsToUse: YCTWord[] = [];
    
    // Check if it's Lesson 12 Review for YCT 1-4 or Lesson 15 Review for YCT 5-6
    const isYCT1to4 = ['YCT1', 'YCT2', 'YCT3', 'YCT4'].includes(level);
    const isYCT5to6 = ['YCT5', 'YCT6'].includes(level);
    const isReview = (isYCT1to4 && lesson === 'Lesson 12') || (isYCT5to6 && lesson === 'Lesson 15');
    
    if (isReview) {
      // Pull all words from lower lessons for this level
      wordsToUse = YCT_WORDS.filter(w => w.level === level && w.lesson !== lesson);
    } else {
      // Standard lesson
      wordsToUse = YCT_WORDS.filter(w => w.level === level && w.lesson === lesson);
    }

    // Safety fallback: if no words found, get any words from that level
    if (wordsToUse.length === 0) {
      wordsToUse = YCT_WORDS.filter(w => w.level === level).slice(0, 10);
    }
    
    setGameWords([...wordsToUse].sort(() => 0.5 - Math.random()));
    setGameState('PREPARATION');
  }, []);

  const handleFinishGame = (score: PlayerScore, score2?: PlayerScore) => {
    setPlayerScore(score);
    if (score2) setP2Score(score2);
    setGameState('PENALTY');
  };

  const handlePENALTYFinish = () => {
    setGameState('RESULT');
  };

  return (
    <div className="min-h-screen bg-[#FDF9F3] selection:bg-orange-200 relative overflow-x-hidden">
      <BackgroundDecor />
      {gameState === 'START' && (
        <StartScreen onSelectMode={(mode) => {
          if (mode === 'INTRO') {
            setGameMode('INTRO');
          } else {
            setGameMode(mode);
            setGameState('LEVEL_SELECT');
          }
        }} />
      )}

      {gameMode === 'INTRO' && (
        <IntroScreen onBack={() => {
          setGameMode('SOLO');
        }} />
      )}

      {gameState === 'LEVEL_SELECT' && (
        <LevelSelect 
          onBack={() => setGameState('START')} 
          onConfirm={handleStartGame} 
        />
      )}

      {gameState === 'PREPARATION' && (
        <PreparationScreen 
          level={selectedLevel}
          lesson={selectedLesson}
          words={gameWords}
          onStart={() => setGameState('PLAYING')}
        />
      )}

      {gameState === 'PLAYING' && (
        gameMode === 'SOLO' ? (
          <GameScreen 
            mode={gameMode}
            words={gameWords}
            onFinish={handleFinishGame}
            onHome={() => setGameState('START')}
            onRestart={() => handleStartGame(selectedLevel, selectedLesson)}
          />
        ) : (
          <PKGameScreen 
            words={gameWords}
            onHome={() => setGameState('START')}
            onRestart={() => handleStartGame(selectedLevel, selectedLesson)}
            onFinish={(winScore, loseScore) => {
              handleFinishGame(winScore, loseScore);
            }}
          />
        )
      )}

      {gameState === 'PENALTY' && (
        <PenaltyScreen onFinish={handlePENALTYFinish} />
      )}

      {gameState === 'RESULT' && (
        gameMode === 'PK' ? (
          <PKResultPage
            p1Score={playerScore}
            p2Score={p2Score}
            allWords={gameWords}
            onRestart={() => handleStartGame(selectedLevel, selectedLesson)}
            onHome={() => setGameState('START')}
            onNext={() => {
              const currentIdx = parseInt(selectedLesson.split(' ')[1]);
              const isYCT5to6 = ['YCT5', 'YCT6'].includes(selectedLevel);
              const isYCT1to4 = ['YCT1', 'YCT2', 'YCT3', 'YCT4'].includes(selectedLevel);
              const maxLessons = isYCT5to6 ? 15 : isYCT1to4 ? 12 : 11;
              
              if (currentIdx < maxLessons) {
                handleStartGame(selectedLevel, `Lesson ${currentIdx + 1}`);
              } else {
                setGameState('START');
              }
            }}
          />
        ) : (
          <ResultPage 
            score={playerScore} 
            allWords={gameWords}
            onRestart={() => handleStartGame(selectedLevel, selectedLesson)}
            onHome={() => setGameState('START')}
            onNext={() => {
              const currentIdx = parseInt(selectedLesson.split(' ')[1]);
              const isYCT5to6 = ['YCT5', 'YCT6'].includes(selectedLevel);
              const isYCT1to4 = ['YCT1', 'YCT2', 'YCT3', 'YCT4'].includes(selectedLevel);
              const maxLessons = isYCT5to6 ? 15 : isYCT1to4 ? 12 : 11;
              
              if (currentIdx < maxLessons) {
                handleStartGame(selectedLevel, `Lesson ${currentIdx + 1}`);
              } else {
                setGameState('START');
              }
            }}
          />
        )
      )}
    </div>
  );
}
