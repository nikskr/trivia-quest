import type { RawQuestion, Question } from '../types.js';

export function mapApiQuestion(_raw: RawQuestion, _id: string, _random: () => number = Math.random): Question {
  throw new Error('Not implemented!');
}
