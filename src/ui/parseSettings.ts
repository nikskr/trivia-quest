import type { Difficulty, QuizSettings } from '../types.js';

export const MIN_AMOUNT = 5;
export const MAX_AMOUNT = 20;
export const DEFAULT_AMOUNT = 10;

const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

export interface SettingsFormValues {
  amount: string;
  category: string;
  difficulty: string;
}

function isDifficulty(value: string): value is Difficulty {
  return (DIFFICULTIES as readonly string[]).includes(value);
}

function toNumber(value: string): number {
  return value.trim() === '' ? NaN : Number(value);
}

function parseAmount(value: string): number {
  const amount = toNumber(value);

  if (!Number.isFinite(amount)) {
    return DEFAULT_AMOUNT;
  }

  return Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, Math.round(amount)));
}

export function parseSettings(values: SettingsFormValues): QuizSettings {
  const settings: QuizSettings = { amount: parseAmount(values.amount) };

  const category = toNumber(values.category);
  if (Number.isInteger(category)) {
    settings.category = category;
  }

  if (isDifficulty(values.difficulty)) {
    settings.difficulty = values.difficulty;
  }

  return settings;
}
