import { CATEGORIES_URL } from '../consts.js';
import type { CategoriesResponse, Category } from '../types.js';
import { HttpError } from './errors.js';

let cache: Promise<Category[]> | null = null;

async function loadCategories(): Promise<Category[]> {
  const response = await fetch(CATEGORIES_URL);

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  const data = (await response.json()) as CategoriesResponse;
  return data.trivia_categories;
}

export function fetchCategories(): Promise<Category[]> {
  if (!cache) {
    cache = loadCategories().catch((error: unknown) => {
      cache = null;
      throw error;
    });
  }
  return cache;
}

export function clearCategoriesCache(): void {
  cache = null;
}
