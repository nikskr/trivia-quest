import type { QuizSettings, RawQuestion } from '../types.js';

export const REQUEST_TIMEOUT_MS = 8000;

export async function fetchQuestions(_settings: QuizSettings, _signal?: AbortSignal): Promise<RawQuestion[]> {
  throw new Error('Not implemented!');
}
