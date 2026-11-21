export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizSettings {
  amount: number;
  category?: number;
  difficulty?: Difficulty;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: Difficulty;
  answers: string[];
  correctAnswer: string;
}

export interface GameState {
  questions: Question[];
  index: number;
  score: number;
  streak: number;
  status: 'playing' | 'answered' | 'finished';
}
