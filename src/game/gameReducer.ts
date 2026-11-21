import type { Difficulty, GameState, Question } from '../types.js';

export type GameAction =
  { type: 'start'; questions: Question[] } | { type: 'answer'; answer: string } | { type: 'next' } | { type: 'finish' };

// Temporary scoring logic until TS-16 is merged into dev.
function getAnswerScore(isCorrect: boolean, difficulty: Difficulty, streak: number): number {
  if (!isCorrect) {
    return 0;
  }

  const points: Record<Difficulty, number> = {
    easy: 10,
    medium: 20,
    hard: 30,
  };

  return points[difficulty] + (streak >= 3 ? 5 : 0);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'start': {
      return {
        questions: [...action.questions],
        index: 0,
        score: 0,
        streak: 0,
        status: action.questions.length > 0 ? 'playing' : 'finished',
      };
    }

    case 'answer': {
      if (state.status !== 'playing') {
        return state;
      }

      const question = state.questions[state.index];

      if (!question) {
        return state;
      }

      const isCorrect = action.answer === question.correctAnswer;

      const newStreak = isCorrect ? state.streak + 1 : 0;

      const points = getAnswerScore(isCorrect, question.difficulty, newStreak);

      return {
        ...state,
        score: state.score + points,
        streak: newStreak,
        status: 'answered',
      };
    }

    case 'next': {
      if (state.status !== 'answered') {
        return state;
      }

      const nextIndex = state.index + 1;

      if (nextIndex >= state.questions.length) {
        return {
          ...state,
          status: 'finished',
        };
      }

      return {
        ...state,
        index: nextIndex,
        status: 'playing',
      };
    }

    case 'finish': {
      return {
        ...state,
        status: 'finished',
      };
    }

    default: {
      return state;
    }
  }
}
