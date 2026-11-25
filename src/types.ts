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

export interface RawQuestion {
  type: 'multiple' | 'boolean';
  difficulty: Difficulty;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface ApiResponse {
  response_code: number;
  results: RawQuestion[];
}

export interface Category {
  id: number;
  name: string;
}

export interface CategoriesResponse {
  trivia_categories: Category[];
}
