import { startRouter } from './router.js';
import { createAboutPage } from './pages/about.js';
import { createSettingsPage } from './pages/settings.js';
import { createQuestionPage } from './pages/question.js';
import { createResultPage } from './pages/result.js';

import { fetchCategories } from './api/fetchCategories.js';
import { fetchQuestions } from './api/fetchQuestions.js';
import { mapApiQuestion } from './api/mapApiQuestion.js';
import { setQuestions } from './session.js';

import { gameReducer } from './game/gameReducer.js';
import { addRecord } from './game/records.js';

import type { GameState } from './types.js';

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

  '/settings': () =>
    createSettingsPage({
      loadCategories: fetchCategories,

      loadQuestions: async (settings, signal) => {
        const raw = await fetchQuestions(settings, signal);

        return raw.map((question, index) => mapApiQuestion(question, String(index)));
      },

      onStart: (questions) => {
        setQuestions(questions);

        state = gameReducer(state, {
          type: 'start',
          questions,
        });

        correctCount = 0;
        recordSaved = false;

        if (window.location.hash === '#/game') {
          app.replaceChildren(renderQuestion());
        } else {
          window.location.hash = '#/game';
        }
      },
    }),

  '/game': () => {
    if (state.questions.length === 0) {
      return createPlaceholder('Start a quiz first');
    }

    return renderQuestion();
  },

  '/result': renderResult,
});

console.log('Trivia Quest started');
