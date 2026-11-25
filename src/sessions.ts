import type { Question } from './types.js';

let pendingQuestions: Question[] = [];

export function setQuestions(questions: Question[]): void {
  pendingQuestions = questions;
}

export function takeQuestions(): Question[] {
  const questions = pendingQuestions;
  pendingQuestions = [];
  return questions;
}
