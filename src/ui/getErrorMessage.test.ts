import { describe, expect, it } from 'vitest';
import { getErrorMessage } from './getErrorMessage';
import { HttpError, QuizApiError } from '../api/errors';

const RATE_LIMIT = 'Too many requests. Wait 5 seconds and try again.';

describe('getErrorMessage', () => {
  it.each([
    {
      label: 'QuizApiError 1',
      error: new QuizApiError(1),
      expected: 'Not enough questions for these settings. Try fewer questions or another category.',
    },
    { label: 'QuizApiError 5', error: new QuizApiError(5), expected: RATE_LIMIT },
    { label: 'QuizApiError 2', error: new QuizApiError(2), expected: 'Quiz service error. Try again.' },
    { label: 'HttpError 429', error: new HttpError(429), expected: RATE_LIMIT },
    { label: 'HttpError 500', error: new HttpError(500), expected: 'Server error (500). Try again later.' },
    {
      label: 'TimeoutError',
      error: new DOMException('Request timed out', 'TimeoutError'),
      expected: 'Server is not responding. Try again.',
    },
    {
      label: 'network TypeError',
      error: new TypeError('Failed to fetch'),
      expected: 'No connection. Check your internet and try again.',
    },
    { label: 'plain Error', error: new Error('boom'), expected: 'Something went wrong. Try again.' },
    { label: 'string', error: 'boom', expected: 'Something went wrong. Try again.' },
    { label: 'null', error: null, expected: 'Something went wrong. Try again.' },
  ])('returns message for $label', ({ error, expected }) => {
    expect(getErrorMessage(error)).toBe(expected);
  });
});
