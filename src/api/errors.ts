export class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`HTTP error ${status}`);
    this.name = 'HttpError';
  }
}

export class QuizApiError extends Error {
  constructor(public readonly code: number) {
    super(`Trivia API error, response_code ${code}`);
    this.name = 'QuizApiError';
  }
}
