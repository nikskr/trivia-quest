import type { ApiResponse, QuizSettings, RawQuestion } from '../types.js';
import { buildQuizUrl } from './buildQuizUrl.js';
import { HttpError, QuizApiError } from './errors.js';

export const REQUEST_TIMEOUT_MS = 8000;

export async function fetchQuestions(settings: QuizSettings, signal?: AbortSignal): Promise<RawQuestion[]> {
  const url = buildQuizUrl(settings);

  const timeoutController = new AbortController();
  const timerId = setTimeout(() => {
    timeoutController.abort(new DOMException('Request timed out', 'TimeoutError'));
  }, REQUEST_TIMEOUT_MS);

  const combinedSignal = signal ? AbortSignal.any([signal, timeoutController.signal]) : timeoutController.signal;

  try {
    const response = await fetch(url, { signal: combinedSignal });

    if (!response.ok) {
      throw new HttpError(response.status);
    }

    const data = (await response.json()) as ApiResponse;

    if (data.response_code !== 0) {
      throw new QuizApiError(data.response_code);
    }

    return data.results;
  } finally {
    clearTimeout(timerId);
  }
}
