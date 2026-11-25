import { startRouter } from './router.js';
import { createAboutPage } from './pages/about.js';
import { createQuestionPage } from './pages/question.js';
import { createResultPage } from './pages/result.js';

import { gameReducer } from './game/gameReducer.js';
import { addRecord } from './game/records.js';

import type { GameState, Question } from './types.js';

function getApp(): HTMLElement {
  const element = document.querySelector<HTMLElement>('#app');

  if (!element) {
    throw new Error('App container not found');
  }

  return element;
}

const app = getApp();

// Temporary demo questions.
// These will be replaced with API data.

const demoQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the largest planet in our Solar System?',
    category: 'Science',
    difficulty: 'easy',
    answers: ['Earth', 'Jupiter', 'Mars', 'Saturn'],
    correctAnswer: 'Jupiter',
  },
  {
    id: '2',
    text: 'What is the capital of France?',
    category: 'Geography',
    difficulty: 'medium',
    answers: ['London', 'Paris', 'Berlin', 'Madrid'],
    correctAnswer: 'Paris',
  },
  {
    id: '3',
    text: 'Which language runs in a web browser?',
    category: 'Technology',
    difficulty: 'easy',
    answers: ['Python', 'C++', 'JavaScript', 'Java'],
    correctAnswer: 'JavaScript',
  },
];

let state: GameState = {
  questions: [],
  index: 0,
  score: 0,
  streak: 0,
  status: 'finished',
};

let correctCount = 0;
let recordSaved = false;

function createPlaceholder(title: string): HTMLElement {
  const page = document.createElement('main');
  page.className = 'game-page';

  const heading = document.createElement('h1');
  heading.textContent = title;

  const back = document.createElement('a');
  back.href = '#/';
  back.textContent = 'Back to About Us';

  page.append(heading, back);

  return page;
}

// Start a new demo game

function startGame(): void {
  state = gameReducer(state, {
    type: 'start',
    questions: demoQuestions,
  });

  correctCount = 0;
  recordSaved = false;

  if (window.location.hash === '#/game') {
    app.replaceChildren(renderQuestion());
  } else {
    window.location.hash = '#/game';
  }
}

// Handle player answer

function handleAnswer(answer: string): void {
  if (state.status !== 'playing') {
    return;
  }

  const question = state.questions[state.index];

  if (!question) {
    return;
  }

  if (answer === question.correctAnswer) {
    correctCount += 1;
  }

  state = gameReducer(state, {
    type: 'answer',
    answer,
  });

  app.replaceChildren(renderQuestion());
}

// Save final score only once

function saveResult(): void {
  if (recordSaved || state.status !== 'finished') {
    return;
  }

  addRecord({
    name: 'Player',
    score: state.score,
    date: new Date().toISOString(),
  });

  recordSaved = true;
}

// Move to next question

function handleNext(): void {
  if (state.status !== 'answered') {
    return;
  }

  state = gameReducer(state, {
    type: 'next',
  });

  if (state.status === 'finished') {
    saveResult();
    window.location.hash = '#/result';
  } else {
    app.replaceChildren(renderQuestion());
  }
}

// Render question screen

function renderQuestion(): HTMLElement {
  return createQuestionPage({
    state,
    onAnswer: handleAnswer,
    onNext: handleNext,
  });
}

// Temporary settings screen

function renderSettings(): HTMLElement {
  const page = createPlaceholder('Demo Quiz Settings');

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'next-button';
  button.textContent = 'Start Demo Quiz';

  button.addEventListener('click', startGame);

  page.append(button);

  return page;
}

// Render results screen

function renderResult(): HTMLElement {
  if (state.status !== 'finished' || state.questions.length === 0) {
    return createPlaceholder('Finish the quiz first');
  }

  return createResultPage({
    state,
    correctCount,
  });
}

// Hash router

startRouter(app, {
  '/': createAboutPage,
  '/settings': renderSettings,
  '/game': renderQuestion,
  '/result': renderResult,
});

console.log('Trivia Quest started');
