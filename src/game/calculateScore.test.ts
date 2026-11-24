import { describe, it, expect } from 'vitest';
import { calculateScore } from './calculateScore';

describe('calculateScore', () => {
  it('returns 0 for incorrect answer', () => {
    expect(calculateScore(false, 'easy', 0)).toBe(0);
  });

  it('returns 10 points for easy', () => {
    expect(calculateScore(true, 'easy', 1)).toBe(10);
  });

  it('returns 20 points for medium', () => {
    expect(calculateScore(true, 'medium', 1)).toBe(20);
  });

  it('returns 30 points for hard', () => {
    expect(calculateScore(true, 'hard', 1)).toBe(30);
  });

  it('adds 5 bonus points from third correct answer', () => {
    expect(calculateScore(true, 'easy', 3)).toBe(15);
  });

  it('does not add bonus before third correct answer', () => {
    expect(calculateScore(true, 'easy', 2)).toBe(10);
  });

  it('returns 0 for incorrect answer even with streak', () => {
    expect(calculateScore(false, 'hard', 5)).toBe(0);
  });
});
