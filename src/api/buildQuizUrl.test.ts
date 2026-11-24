import { describe, it, expect } from 'vitest';
import { buildQuizUrl } from './buildQuizUrl';
import { API_BASE_URL } from '../consts';
import type { QuizSettings } from '../types';

describe('buildQuizUrl', () => {
  it('returns url string with passed amount', () => {
    const parameters: QuizSettings = { amount: 10 };
    const expected = API_BASE_URL + '?amount=10';
    expect(buildQuizUrl(parameters)).toEqual(expected);
  });

  it('returns url string with passed category', () => {
    const parameters: QuizSettings = { amount: 10, category: 22 };
    const expected = API_BASE_URL + '?amount=10&category=22';
    expect(buildQuizUrl(parameters)).toEqual(expected);
  });

  it('returns url string with passed difficulty', () => {
    const parameters: QuizSettings = { amount: 10, difficulty: 'medium' };
    const expected = API_BASE_URL + '?amount=10&difficulty=medium';
    expect(buildQuizUrl(parameters)).toEqual(expected);
  });

  it('returns url string with all parameters', () => {
    const parameters: QuizSettings = { amount: 10, category: 22, difficulty: 'medium' };
    const expected = API_BASE_URL + '?amount=10&category=22&difficulty=medium';
    expect(buildQuizUrl(parameters)).toEqual(expected);
  });

  it.each([1, 50])('accepts boundary amount %s', (amount) => {
    const parameters: QuizSettings = { amount };
    expect(() => buildQuizUrl(parameters)).not.toThrow();
  });

  it.each([0, -5, 51, 100, 2.5, NaN, Infinity])('throws for invalid amount %s', (amount) => {
    const parameters: QuizSettings = { amount };
    expect(() => buildQuizUrl(parameters)).toThrow();
  });
});
