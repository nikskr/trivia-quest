import { HttpError, QuizApiError } from '../api/errors.js';

const RATE_LIMIT = 'Too many requests. Wait 5 seconds and try again.';
const NOT_ENOUGH_QUESTIONS = 'Not enough questions for these settings. Try fewer questions or another category.';
const QUIZ_SERVICE_ERROR = 'Quiz service error. Try again.';
const TIMEOUT = 'Server is not responding. Try again.';
const NO_CONNECTION = 'No connection. Check your internet and try again.';
const UNKNOWN = 'Something went wrong. Try again.';

const QUIZ_API_MESSAGES = new Map<number, string>([
  [1, NOT_ENOUGH_QUESTIONS],
  [5, RATE_LIMIT],
]);

export function getErrorMessage(error: unknown): string {
  if (error instanceof QuizApiError) {
    return QUIZ_API_MESSAGES.get(error.code) ?? QUIZ_SERVICE_ERROR;
  }

  if (error instanceof HttpError) {
    return error.status === 429 ? RATE_LIMIT : `Server error (${error.status}). Try again later.`;
  }

  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return TIMEOUT;
  }

  if (error instanceof TypeError) {
    return NO_CONNECTION;
  }

  return UNKNOWN;
}
