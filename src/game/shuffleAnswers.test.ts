import { describe, it, expect } from 'vitest';
import { shuffleAnswers } from './shuffleAnswers';

describe('shuffleAnswers', () => {
  it('returns a new array', () => {
    const answers = ['A', 'B', 'C'];

    const result = shuffleAnswers(answers);

    expect(result).not.toBe(answers);
  });

  it('does not mutate original array', () => {
    const answers = ['A', 'B', 'C'];

    shuffleAnswers(answers, () => 0);

    expect(answers).toEqual(['A', 'B', 'C']);
  });

  it('shuffles answers using provided random', () => {
    const answers = ['A', 'B', 'C'];

    const result = shuffleAnswers(answers, () => 0);

    expect(result).toEqual(['B', 'C', 'A']);
  });
});
