export interface YCTWord {
  chinese: string;
  pinyin: string;
  english: string;
  mongolian?: string;
  level: string; // 'YCT1', 'YCT2', etc.
  lesson: string; // 'Lesson 1', etc.
}

export type GameMode = 'SOLO' | 'PK' | 'INTRO';

export type GameState = 'START' | 'LEVEL_SELECT' | 'PREPARATION' | 'PLAYING' | 'PENALTY' | 'RESULT';

export interface PlayerScore {
  score: number;
  correctCount: number;
  wordsHistory: {
    word: YCTWord;
    correct: boolean;
    timestamp: number;
  }[];
}
