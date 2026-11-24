export type PageRenderer = () => HTMLElement;

export type Routes = Record<string, PageRenderer>;

export function startRouter(root: HTMLElement, routes: Routes): () => void {
  function render(): void {
    const path = window.location.hash.slice(1) || '/';

    const page = routes[path];

    if (!page) {
      const notFound = document.createElement('main');
      const title = document.createElement('h1');
      const backLink = document.createElement('a');

      title.textContent = '404 — Page not found';

      backLink.href = '#/';
      backLink.textContent = 'Back to home';

      notFound.append(title, backLink);
      root.replaceChildren(notFound);
      return;
    }

    root.replaceChildren(page());
  }

  window.addEventListener('hashchange', render);

  render();

  return () => {
    window.removeEventListener('hashchange', render);
  };
}
