# Contributing Guide

## Branches

- main: final production branch
- dev: shared development branch
- feat/TS-XX-name: feature development

All feature branches must be created from dev.

## Commits

Use conventional commits:

- feat: new feature
- fix: bug fix
- test: tests
- docs: documentation
- refactor: code improvements
- chore: configuration changes

## Pull Requests

1. Create a feature branch from dev.
2. Make changes and commit.
3. Push the branch to GitHub.
4. Create a Pull Request targeting dev.
5. Request a review from your teammate.
6. Merge after approval.

## Code Quality

- Write unit tests before game logic.
- Avoid mutating input arrays or state.
- Do not use innerHTML.
- Keep game logic independent from DOM.
- Run tests and lint checks before merging.

## Definition of Done

- Code is reviewed and approved.
- Tests pass.
- Pull Request is merged into dev.
- Jira task is moved to Done.
