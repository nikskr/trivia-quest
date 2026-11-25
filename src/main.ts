import { startRouter } from './router.js';
import { createAboutPage } from './pages/about.js';
import { createSettingsPage } from './pages/settings.js';
import { fetchCategories } from './api/fetchCategories.js';
import { fetchQuestions } from './api/fetchQuestions.js';
import { mapApiQuestion } from './api/mapApiQuestion.js';
import { setQuestions } from './session.js';

const app = document.querySelector<HTMLElement>('#app');

if (!app) {
  throw new Error('App container not found');
}

function createPlaceholder(title: string): HTMLElement {
  const page = document.createElement('main');

  const heading = document.createElement('h1');
  heading.textContent = title;

  const backLink = document.createElement('a');
  backLink.href = '#/';
  backLink.textContent = 'Back to About Us';

  page.append(heading, backLink);

  return page;
}

startRouter(app, {
  '/': createAboutPage,

  '/settings': () => {
    return createSettingsPage({
      loadCategories: fetchCategories,
      loadQuestions: async (settings, signal) => {
        const raw = await fetchQuestions(settings, signal);
        return raw.map((q, i) => mapApiQuestion(q, String(i)));
      },
      onStart: (questions) => {
        setQuestions(questions);
        window.location.hash = '#/game';
      },
    });
  },

  '/game': () => {
    return createPlaceholder('Game — Coming Soon');
  },

  '/result': () => {
    return createPlaceholder('Results — Coming Soon');
  },
});

console.log('Trivia Quest started');
