import type { GameState } from '../types.js';
import { getTopRecords } from '../game/records.js';

export interface ResultPageOptions {
  state: GameState;
  correctCount: number;
}

export function createResultPage({ state, correctCount }: ResultPageOptions): HTMLElement {
  const page = document.createElement('main');
  page.className = 'result-page';

  const total = state.questions.length;
  const correct = Math.min(total, Math.max(0, correctCount));
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const header = document.createElement('section');
  header.className = 'result-header';

  const trophy = document.createElement('div');
  trophy.className = 'result-trophy';
  trophy.textContent = '🏆';

  const title = document.createElement('h1');
  title.textContent = 'Quiz Completed!';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Great job! Here are your results.';

  const score = document.createElement('h2');
  score.className = 'result-score';
  score.textContent = `${state.score} XP`;

  const stats = document.createElement('div');
  stats.className = 'result-stats';

  const accuracyElement = document.createElement('p');
  accuracyElement.textContent = `Accuracy: ${accuracy}%`;

  const correctElement = document.createElement('p');
  correctElement.textContent = `Correct Answers: ${correct}/${total}`;

  stats.append(accuracyElement, correctElement);
  header.append(trophy, title, subtitle, score, stats);

  const leaderboard = document.createElement('section');
  leaderboard.className = 'leaderboard';

  const leaderboardTitle = document.createElement('h2');
  leaderboardTitle.textContent = '🏆 Leaderboard';

  const list = document.createElement('ol');
  list.className = 'leaderboard-list';

  const records = getTopRecords(10);

  if (records.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No records yet.';
    leaderboard.append(leaderboardTitle, empty);
  } else {
    records.forEach((record, index) => {
      const item = document.createElement('li');
      item.className = 'leaderboard-item';

      const name = document.createElement('span');
      name.textContent = `#${index + 1} ${record.name}`;

      const points = document.createElement('strong');
      points.textContent = `${record.score} XP`;

      item.append(name, points);
      list.append(item);
    });

    leaderboard.append(leaderboardTitle, list);
  }

  const actions = document.createElement('div');
  actions.className = 'result-actions';

  const playAgain = document.createElement('a');
  playAgain.href = '#/settings';
  playAgain.className = 'play-again-button';
  playAgain.textContent = 'Play Again →';

  const home = document.createElement('a');
  home.href = '#/';
  home.className = 'home-button';
  home.textContent = 'Back to Home';

  actions.append(playAgain, home);

  page.append(header, leaderboard, actions);

  return page;
}
