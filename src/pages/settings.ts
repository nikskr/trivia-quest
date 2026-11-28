import type { Category, Question, QuizSettings } from '../types.js';
import { getErrorMessage } from '../ui/getErrorMessage.js';
import { DEFAULT_AMOUNT, MAX_AMOUNT, MIN_AMOUNT, parseSettings } from '../ui/parseSettings.js';

export interface SettingsPageDeps {
  loadCategories: () => Promise<Category[]>;
  loadQuestions: (settings: QuizSettings, signal: AbortSignal) => Promise<Question[]>;
  onStart: (questions: Question[]) => void;
}

const DIFFICULTY_OPTIONS: [value: string, label: string][] = [
  ['', 'Any difficulty'],
  ['easy', 'Easy'],
  ['medium', 'Medium'],
  ['hard', 'Hard'],
];

function createField(labelText: string, control: HTMLSelectElement | HTMLInputElement): HTMLElement {
  const field = document.createElement('div');
  field.className = 'settings-field';

  const label = document.createElement('label');
  label.htmlFor = control.id;
  label.textContent = labelText;

  field.append(label, control);
  return field;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function createSettingsPage(deps: SettingsPageDeps): HTMLElement {
  const page = document.createElement('main');
  page.className = 'settings-page';

  const title = document.createElement('h1');
  title.textContent = 'Settings';

  const categorySelect = document.createElement('select');
  categorySelect.id = 'category';
  categorySelect.name = 'category';

  const difficultySelect = document.createElement('select');
  difficultySelect.id = 'difficulty';
  difficultySelect.name = 'difficulty';
  for (const [value, label] of DIFFICULTY_OPTIONS) {
    difficultySelect.add(new Option(label, value));
  }

  const amountInput = document.createElement('input');
  amountInput.id = 'amount';
  amountInput.name = 'amount';
  amountInput.type = 'number';
  amountInput.min = String(MIN_AMOUNT);
  amountInput.max = String(MAX_AMOUNT);
  amountInput.step = '1';
  amountInput.value = String(DEFAULT_AMOUNT);

  const startButton = document.createElement('button');
  startButton.type = 'submit';
  startButton.textContent = 'Start';

  const form = document.createElement('form');
  form.className = 'settings-form';
  form.append(
    createField('Category', categorySelect),
    createField('Difficulty', difficultySelect),
    createField(`Questions (${MIN_AMOUNT}-${MAX_AMOUNT})`, amountInput),
    startButton,
  );

  const status = document.createElement('p');
  status.className = 'status';
  status.setAttribute('role', 'status');

  const retryButton = document.createElement('button');
  retryButton.type = 'button';
  retryButton.textContent = 'Retry';
  retryButton.hidden = true;

  const backLink = document.createElement('a');
  backLink.href = '#/';
  backLink.textContent = 'Back to Home';
  backLink.className = 'home-button';

  page.append(title, form, status, retryButton, backLink);

  function setStatus(text: string, isError = false): void {
    status.textContent = text;
    status.classList.toggle('status--error', isError);
  }

  function loadCategories(): void {
    categorySelect.replaceChildren(new Option('Any category', ''));
    categorySelect.disabled = true;
    startButton.disabled = true;
    retryButton.hidden = true;
    setStatus('Loading categories...');

    deps
      .loadCategories()
      .then((categories) => {
        if (!page.isConnected) return;

        categorySelect.append(...categories.map((c) => new Option(c.name, String(c.id))));
        categorySelect.disabled = false;
        startButton.disabled = false;
        setStatus('');
      })
      .catch((error: unknown) => {
        if (!page.isConnected) return;

        categorySelect.disabled = false;
        startButton.disabled = false;
        retryButton.hidden = false;
        setStatus(getErrorMessage(error), true);
      });
  }

  async function startGame(): Promise<void> {
    const data = new FormData(form);
    const settings = parseSettings({
      amount: String(data.get('amount') ?? ''),
      category: String(data.get('category') ?? ''),
      difficulty: String(data.get('difficulty') ?? ''),
    });

    const controller = new AbortController();
    window.addEventListener('hashchange', () => controller.abort(), { once: true });

    startButton.disabled = true;
    retryButton.hidden = true;
    setStatus('Loading questions...');

    try {
      const questions = await deps.loadQuestions(settings, controller.signal);
      if (!page.isConnected) return;
      deps.onStart(questions);
    } catch (error) {
      if (isAbortError(error) || !page.isConnected) return;
      setStatus(getErrorMessage(error), true);
      startButton.disabled = false;
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (startButton.disabled) return;
    void startGame();
  });

  retryButton.addEventListener('click', loadCategories);

  loadCategories();

  return page;
}
