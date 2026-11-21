
export interface GameRecord {
  name: string;
  score: number;
  date: string;
}

export function addRecord(
  record: GameRecord,
): void {
  void record;
}

export function getTopRecords(
  n = 10,
): GameRecord[] {
  void n;
  return [];
}
