import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { QuizSettings, RawQuestion } from '../types';
import { fetchQuestions, REQUEST_TIMEOUT_MS } from './fetchQuestions';
import { buildQuizUrl } from './buildQuizUrl';
import { HttpError, QuizApiError } from './errors';

const settings: QuizSettings = { amount: 5, difficulty: 'easy' };

const rawQuestion: RawQuestion = {
  type: 'multiple',
  difficulty: 'easy',
  category: 'Entertainment: Video Games',
  question: 'In &quot;Xenoblade Chronicles 2&quot;, Which party member cannot use normal blades?',
  correct_answer: 'Tora',
  incorrect_answers: ['Rex', 'Zeke', 'Nia'],
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

function hangingFetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
  return new Promise((_, reject) => {
    init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
  });
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('fetchQuestions', () => {
  it('returns results when response_code is 0', async () => {
    fetchMock.mockImplementation(async () => jsonResponse({ response_code: 0, results: [rawQuestion] }));
    await expect(fetchQuestions(settings)).resolves.toEqual([rawQuestion]);
  });

  it('calls fetch with url from buildQuizUrl and a signal', async () => {
    fetchMock.mockImplementation(async () => jsonResponse({ response_code: 0, results: [rawQuestion] }));

    await fetchQuestions(settings);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      buildQuizUrl(settings),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('throws RangeError for invalid settings and does not call fetch', async () => {
    await expect(fetchQuestions({ amount: 0 })).rejects.toThrow(RangeError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([500, 429])('throws HttpError with status %s when response is not ok', async (status) => {
    fetchMock.mockImplementation(async () => jsonResponse({}, status));

    const promise = fetchQuestions(settings);
    await expect(promise).rejects.toBeInstanceOf(HttpError);
    await expect(promise).rejects.toMatchObject({ status });
  });

  it.each([1, 2, 5])('throws QuizApiError with code %s', async (code) => {
    fetchMock.mockImplementation(async () => jsonResponse({ response_code: code, results: [] }));

    const promise = fetchQuestions(settings);

    await expect(promise).rejects.toBeInstanceOf(QuizApiError);
    await expect(promise).rejects.toMatchObject({ code });
  });

  it('rejects with TimeoutError when request takes too long', async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(hangingFetch);

    const promise = fetchQuestions(settings);
    vi.advanceTimersByTime(REQUEST_TIMEOUT_MS);

    await expect(promise).rejects.toMatchObject({ name: 'TimeoutError' });
  });

  it('clears the timeout timer after request finishes', async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(async () => jsonResponse({ response_code: 0, results: [] }));

    await fetchQuestions(settings);

    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects with AbortError when external signal is aborted', async () => {
    fetchMock.mockImplementation(hangingFetch);
    const controller = new AbortController();

    const promise = fetchQuestions(settings, controller.signal);
    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('rethrows network errors', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(fetchQuestions(settings)).rejects.toThrow('Failed to fetch');
  });
});
