import type { GameState } from '../types.js';

export interface QuestionPageOptions {
  state: GameState;
  onAnswer: (answer: string) => void;
  onNext: () => void;
}

export function createQuestionPage({ state, onAnswer, onNext }: QuestionPageOptions): HTMLElement {
  const page = document.createElement('main');
  page.className = 'game-page';

  const question = state.questions[state.index];

  if (!question) {
    const message = document.createElement('h1');
    message.textContent = 'No questions available';

    const back = document.createElement('a');
    back.href = '#/settings';
    back.textContent = 'Back to Settings';

    page.append(message, back);
    return page;
  }

  const header = document.createElement('header');
  header.className = 'game-header';

  const progress = document.createElement('p');
  progress.textContent = `Question ${state.index + 1} of ${state.questions.length}`;

  const score = document.createElement('p');
  score.textContent = `Score: ${state.score} XP`;

  const streak = document.createElement('p');
  streak.textContent = `Streak: ${state.streak}`;

  header.append(progress, score, streak);

  const progressBar = document.createElement('progress');
  progressBar.max = state.questions.length;
  progressBar.value = state.index + 1;
  progressBar.className = 'game-progress';

  const title = document.createElement('h1');
  title.className = 'game-question';
  title.textContent = question.text;

  const category = document.createElement('p');
  category.className = 'game-category';
  category.textContent = `${question.category} · ${question.difficulty}`;

  const answers = document.createElement('div');
  answers.className = 'game-answers';

  for (const answer of question.answers) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-button';
    button.textContent = answer;

    if (state.status === 'answered') {
      button.disabled = true;

      if (answer === question.correctAnswer) {
        button.classList.add('correct');
      }
    } else {
      button.addEventListener('click', () => {
        onAnswer(answer);
      });
    }

    answers.append(button);
  }

  page.append(header, progressBar, category, title, answers);

  if (state.status === 'answered') {
    const feedback = document.createElement('p');
    feedback.className = 'game-feedback';
    feedback.textContent = `Correct answer: ${question.correctAnswer}`;

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'next-button';

    next.textContent = state.index === state.questions.length - 1 ? 'See Results' : 'Next Question';

    next.addEventListener('click', onNext);

    page.append(feedback, next);
  }

  return page;
}
