import { describe, it, expect, vi } from 'vitest';
import { mapApiQuestion } from './mapApiQuestion';
import { RawQuestion } from '../types';

const rawMultiple: RawQuestion = {
  type: 'multiple',
  difficulty: 'hard',
  category: 'Science &amp; Nature',
  question: 'What is the unit of electrical inductance?',
  correct_answer: 'Henry',
  incorrect_answers: ['Weber', 'Coulomb', 'Mho'],
};

const rawBoolean: RawQuestion = {
  type: 'boolean',
  difficulty: 'easy',
  category: 'History',
  question:
    'United States President John F. Kennedy was assassinated during his presidential motorcade in Atlanta, Georgia on November 22nd, 1963.',
  correct_answer: 'False',
  incorrect_answers: ['True'],
};

describe('mapApiQuestion', () => {
  it('passes id and difficulty as is', () => {
    const question = mapApiQuestion(rawMultiple, 'q-1');

    expect(question.id).toBe('q-1');
    expect(question.difficulty).toBe('hard');
  });

  it('decodes text, category and correct answer', () => {
    const question = mapApiQuestion(rawMultiple, 'q-1');

    expect(question.text).toBe('What is the unit of electrical inductance?');
    expect(question.category).toBe('Science & Nature');
    expect(question.correctAnswer).toBe('Henry');
  });

  it('returns all decoded answers including the correct one', () => {
    const question = mapApiQuestion(rawMultiple, 'q-1');

    expect([...question.answers].sort()).toEqual(['Henry', 'Weber', 'Coulomb', 'Mho'].sort());
    expect(question.answers).toContain(question.correctAnswer);
  });

  it('shuffles answers with the passed random', () => {
    const random = vi.fn(() => 0);

    const first = mapApiQuestion(rawMultiple, 'q-1', random);
    const second = mapApiQuestion(rawMultiple, 'q-1', () => 0);

    expect(random).toHaveBeenCalled();
    expect(first.answers).toEqual(second.answers);
  });

  it('does not mutate raw question', () => {
    const snapshot = structuredClone(rawMultiple);

    mapApiQuestion(rawMultiple, 'q-1');

    expect(rawMultiple).toEqual(snapshot);
  });

  it('keeps True / False order for boolean questions', () => {
    const random = vi.fn(() => 0);

    const question = mapApiQuestion(rawBoolean, 'q-2', random);

    expect(question.answers).toEqual(['True', 'False']);
    expect(random).not.toHaveBeenCalled();
  });
});
