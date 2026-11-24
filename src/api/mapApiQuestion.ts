import { shuffleAnswers } from '../game/shuffleAnswers.js';
import type { RawQuestion, Question } from '../types.js';
import { decodeHtml } from './decodeHtml.js';

const BOOLEAN_ANSWERS = ['True', 'False'];

export function mapApiQuestion(raw: RawQuestion, id: string, random: () => number = Math.random): Question {
  const correctAnswer = decodeHtml(raw.correct_answer);
  const incorrectAnswers = raw.incorrect_answers.map((answer) => decodeHtml(answer));

  const answers =
    raw.type === 'boolean' ? [...BOOLEAN_ANSWERS] : shuffleAnswers([correctAnswer, ...incorrectAnswers], random);

  return {
    id,
    text: decodeHtml(raw.question),
    category: decodeHtml(raw.category),
    difficulty: raw.difficulty,
    answers,
    correctAnswer,
  };
}
