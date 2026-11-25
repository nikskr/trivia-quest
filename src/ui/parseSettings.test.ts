import { describe, expect, it } from 'vitest';
import { parseSettings, type SettingsFormValues } from './parseSettings';

const empty: SettingsFormValues = { amount: '', category: '', difficulty: '' };

describe('parseSettings', () => {
  it('parses all filled values', () => {
    expect(parseSettings({ amount: '12', category: '9', difficulty: 'hard' })).toEqual({
      amount: 12,
      category: 9,
      difficulty: 'hard',
    });
  });

  describe('amount', () => {
    it.each([
      { input: '12', expected: 12 },
      { input: '5', expected: 5 },
      { input: '20', expected: 20 },
      { input: '3', expected: 5 },
      { input: '25', expected: 20 },
      { input: '-7', expected: 5 },
      { input: '12.6', expected: 13 },
      { input: '', expected: 10 },
      { input: '   ', expected: 10 },
      { input: 'abc', expected: 10 },
    ])('"$input" -> $expected', ({ input, expected }) => {
      expect(parseSettings({ ...empty, amount: input }).amount).toBe(expected);
    });
  });

  describe('category', () => {
    it('converts category to number', () => {
      expect(parseSettings({ ...empty, category: '22' }).category).toBe(22);
    });

    it.each(['', 'abc', '9.5'])('omits category for "%s"', (category) => {
      expect(parseSettings({ ...empty, category })).not.toHaveProperty('category');
    });
  });

  describe('difficulty', () => {
    it.each(['easy', 'medium', 'hard'] as const)('keeps "%s"', (difficulty) => {
      expect(parseSettings({ ...empty, difficulty }).difficulty).toBe(difficulty);
    });

    it.each(['', 'extreme', 'EASY'])('omits difficulty for "%s"', (difficulty) => {
      expect(parseSettings({ ...empty, difficulty })).not.toHaveProperty('difficulty');
    });
  });
});
