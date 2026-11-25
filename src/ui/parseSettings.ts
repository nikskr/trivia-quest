import type { QuizSettings } from '../types.js';

export const MIN_AMOUNT = 5;
export const MAX_AMOUNT = 20;
export const DEFAULT_AMOUNT = 10;

export interface SettingsFormValues {
  amount: string;
  category: string;
  difficulty: string;
}

export function parseSettings(_values: SettingsFormValues): QuizSettings {
  throw new Error('Not implemented!');
}
