
import type { GameState, Question } from '../types.js';

export type GameAction =
  | { type: 'start'; questions: Question[] }
  | { type: 'answer'; answer: string }
  | { type: 'next' }
  | { type: 'finish' };

export function gameReducer(
  state: GameState,
  action: GameAction,
): GameState {
  void action;
  return state;
}
