import type { Difficulty } from '../types.js';

export function calculateScore(isCorrect: boolean, difficulty: Difficulty, streak: number): number {
  if (!isCorrect) {
    return 0;
  }

  const points: Record<Difficulty, number> = {
    easy: 10,
    medium: 20,
    hard: 30,
  };

  const baseScore = points[difficulty] ?? 0;
  const streakBonus = streak >= 3 ? 5 : 0;

  return baseScore + streakBonus;
}
