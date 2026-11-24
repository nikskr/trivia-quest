export interface GameRecord {
  name: string;
  score: number;
  date: string;
}

const STORAGE_KEY = 'trivia-records';

function readRecords(): GameRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const parsed: unknown = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item: unknown): item is GameRecord => {
      if (typeof item !== 'object' || item === null) {
        return false;
      }

      const record = item as Partial<GameRecord>;

      return (
        typeof record.name === 'string' &&
        typeof record.score === 'number' &&
        Number.isFinite(record.score) &&
        typeof record.date === 'string'
      );
    });
  } catch {
    return [];
  }
}

export function addRecord(record: GameRecord): void {
  const records = readRecords();

  records.push(record);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Storage may be unavailable or full.
  }
}

export function getTopRecords(n = 10): GameRecord[] {
  const records = readRecords();

  return records.sort((a, b) => b.score - a.score).slice(0, Math.max(0, Math.trunc(n)));
}
