import { describe, it, expect } from 'vitest';
import type { GameState, Question } from '../types.js';
import { gameReducer } from './gameReducer.js';

const questions: Question[] = [
  {
    id: '1',
    text: 'What is 2 + 2?',
    category: 'Math',
    difficulty: 'easy',
    answers: ['3', '4', '5', '6'],
    correctAnswer: '4',
  },
  {
    id: '2',
    text: 'What is the capital of France?',
    category: 'Geography',
    difficulty: 'medium',
    answers: ['London', 'Paris', 'Berlin', 'Rome'],
    correctAnswer: 'Paris',
  },
];

const initialState: GameState = {
  questions: [],
  index: 0,
  score: 0,
  streak: 0,
  status: 'finished',
};

const playingState: GameState = {
  questions,
  index: 0,
  score: 0,
  streak: 0,
  status: 'playing',
};

describe('gameReducer', () => {
  it('starts a new game', () => {
    const result = gameReducer(initialState, {
      type: 'start',
      questions,
    });

    expect(result).toEqual(playingState);
  });

  it('adds points for a correct answer', () => {
    const result = gameReducer(playingState, {
      type: 'answer',
      answer: '4',
    });

    expect(result.score).toBe(10);
    expect(result.streak).toBe(1);
    expect(result.status).toBe('answered');
  });

  it('does not add points for an incorrect answer', () => {
    const result = gameReducer(playingState, {
      type: 'answer',
      answer: '3',
    });

    expect(result.score).toBe(0);
    expect(result.streak).toBe(0);
    expect(result.status).toBe('answered');
  });

  it('adds a streak bonus from the third correct answer', () => {
    const state: GameState = {
      ...playingState,
      streak: 2,
      score: 30,
    };

    const result = gameReducer(state, {
      type: 'answer',
      answer: '4',
    });

    expect(result.score).toBe(45);
    expect(result.streak).toBe(3);
  });

  it('resets streak after a wrong answer', () => {
    const state: GameState = {
      ...playingState,
      streak: 3,
    };

    const result = gameReducer(state, {
      type: 'answer',
      answer: '3',
    });

    expect(result.streak).toBe(0);
  });

  it('does not count the same answer twice', () => {
    const state: GameState = {
      ...playingState,
      status: 'answered',
      score: 10,
      streak: 1,
    };

    const result = gameReducer(state, {
      type: 'answer',
      answer: '4',
    });

    expect(result).toEqual(state);
  });

  it('moves to the next question', () => {
    const state: GameState = {
      ...playingState,
      status: 'answered',
    };

    const result = gameReducer(state, {
      type: 'next',
    });

    expect(result.index).toBe(1);
    expect(result.status).toBe('playing');
  });

  it('finishes after the last question', () => {
    const state: GameState = {
      ...playingState,
      index: 1,
      status: 'answered',
    };

    const result = gameReducer(state, {
      type: 'next',
    });

    expect(result.status).toBe('finished');
  });

  it('finishes the game manually', () => {
    const result = gameReducer(playingState, {
      type: 'finish',
    });

    expect(result.status).toBe('finished');
  });

  it('does not mutate the original state', () => {
    const state: GameState = {
      ...playingState,
    };

    gameReducer(state, {
      type: 'answer',
      answer: '4',
    });

    expect(state.score).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.status).toBe('playing');
  });
});
