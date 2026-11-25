import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Category } from '../types';
import { clearCategoriesCache, fetchCategories } from './fetchCategories';
import { CATEGORIES_URL } from '../consts';
import { HttpError } from './errors';

const categories: Category[] = [
  {
    id: 9,
    name: 'General Knowledge',
  },
  {
    id: 10,
    name: 'Entertainment: Books',
  },
];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

const okResponse = async () => jsonResponse({ trivia_categories: categories });

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  clearCategoriesCache();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchCategories', () => {
  it('returns trivia_categories from response', async () => {
    fetchMock.mockImplementation(okResponse);

    await expect(fetchCategories()).resolves.toEqual(categories);
  });

  it('requests categories url', async () => {
    fetchMock.mockImplementation(okResponse);

    await fetchCategories();

    expect(fetchMock).toHaveBeenCalledWith(CATEGORIES_URL);
  });

  it('throws HttpError when response is not ok', async () => {
    fetchMock.mockImplementation(async () => jsonResponse({}, 500));

    await expect(fetchCategories()).rejects.toBeInstanceOf(HttpError);
  });

  describe('cache', () => {
    it('does not call fetch again on second call', async () => {
      fetchMock.mockImplementation(okResponse);

      await fetchCategories();
      const second = await fetchCategories();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(second).toEqual(categories);
    });

    it('makes one request for concurrent calls', async () => {
      fetchMock.mockImplementation(okResponse);

      await Promise.all([fetchCategories(), fetchCategories()]);

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('retries after a failed request', async () => {
      fetchMock.mockImplementationOnce(async () => jsonResponse({}, 500)).mockImplementation(okResponse);

      await expect(fetchCategories()).rejects.toBeInstanceOf(HttpError);
      await expect(fetchCategories()).resolves.toEqual(categories);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('fetches again after clearCategoriesCache', async () => {
      fetchMock.mockImplementation(okResponse);

      await fetchCategories();

      clearCategoriesCache();

      await fetchCategories();

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});
