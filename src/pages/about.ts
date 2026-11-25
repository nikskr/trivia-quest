export function createAboutPage(): HTMLElement {
  const page = document.createElement('main');
  page.className = 'about-page';

  const title = document.createElement('h1');
  title.textContent = 'Trivia Quest';

  const subtitle = document.createElement('h2');
  subtitle.textContent = 'About Us';

  const description = document.createElement('p');
  description.textContent =
    'Welcome to Trivia Quest! Test your knowledge ' +
    'with questions from different categories ' +
    'and difficulty levels.';

  const teamTitle = document.createElement('h2');
  teamTitle.textContent = 'Our Team';

  const teamList = document.createElement('ul');

  const memberA = document.createElement('li');
  memberA.textContent = 'nikskr (Participant A) - API integration, ' + 'question processing, categories, and settings.';

  const memberB = document.createElement('li');
  memberB.textContent =
    'sanat135 (Participant B) - Game logic, scoring, ' + 'records, question and result screens, and About Us.';

  teamList.append(memberA, memberB);

  const featuresTitle = document.createElement('h2');
  featuresTitle.textContent = 'Features';

  const features = document.createElement('ul');

  const featureItems = [
    'Multiple quiz categories',
    'Three difficulty levels',
    'Score and streak system',
    'Leaderboard with saved records',
  ];

  for (const feature of featureItems) {
    const item = document.createElement('li');
    item.textContent = feature;
    features.append(item);
  }

  const playButton = document.createElement('a');
  playButton.textContent = 'Play Now';
  playButton.href = '#/settings';
  playButton.className = 'play-button';

  page.append(title, subtitle, description, teamTitle, teamList, featuresTitle, features, playButton);

  return page;
}
