import { startRouter } from './router.js';
import { createAboutPage } from './pages/about.js';

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
    return createPlaceholder('Settings — Coming Soon');
  },

  '/game': () => {
    return createPlaceholder('Game — Coming Soon');
  },

  '/result': () => {
    return createPlaceholder('Results — Coming Soon');
  },
});

console.log('Trivia Quest started');
