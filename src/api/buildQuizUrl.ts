import { API_BASE_URL } from '../consts.js';
import type { QuizSettings } from '../types.js';

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 50;

export function buildQuizUrl(settings: QuizSettings) {
  const { amount, category, difficulty } = settings;

  if (!Number.isInteger(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
    throw new RangeError(`amount must be an integer from ${MIN_AMOUNT} to ${MAX_AMOUNT}, got amount ${amount}`);
  }

  const params = new URLSearchParams({ amount: String(amount) });
  if (category !== undefined) params.append('category', String(category));
  if (difficulty !== undefined) params.append('difficulty', difficulty);

  return `${API_BASE_URL}?${params.toString()}`;
}
