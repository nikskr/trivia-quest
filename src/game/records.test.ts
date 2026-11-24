import { beforeEach, describe, expect, it, vi } from 'vitest';

import { addRecord, getTopRecords } from './records.js';

describe('Records and localStorage', () => {
  const data = new Map<string, string>();

  beforeEach(() => {
    data.clear();

    const storage = {
      getItem: vi.fn((key: string) => data.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        data.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        data.delete(key);
      }),
      clear: vi.fn(() => data.clear()),
      key: vi.fn((index: number) => [...data.keys()][index] ?? null),
      get length() {
        return data.size;
      },
    };

    vi.stubGlobal('localStorage', storage);
  });

  it('returns empty array if no records exist', () => {
    expect(getTopRecords()).toEqual([]);
  });

  it('saves a new record', () => {
    addRecord({
      name: 'Player 1',
      score: 100,
      date: '2026-11-21',
    });

    expect(getTopRecords()).toHaveLength(1);
  });

  it('sorts records by score descending', () => {
    addRecord({
      name: 'A',
      score: 50,
      date: '2026-11-21',
    });

    addRecord({
      name: 'B',
      score: 150,
      date: '2026-11-21',
    });

    const records = getTopRecords();

    expect(records[0]?.score).toBe(150);
    expect(records[1]?.score).toBe(50);
  });

  it('returns only requested number of records', () => {
    for (let i = 0; i < 15; i++) {
      addRecord({
        name: `Player ${i}`,
        score: i * 10,
        date: '2026-11-21',
      });
    }

    expect(getTopRecords(10)).toHaveLength(10);
  });

  it('handles corrupted localStorage data', () => {
    data.set('trivia-records', '{invalid json');

    expect(getTopRecords()).toEqual([]);
  });

  it('preserves previous records', () => {
    addRecord({
      name: 'First',
      score: 100,
      date: '2026-11-21',
    });

    addRecord({
      name: 'Second',
      score: 200,
      date: '2026-11-21',
    });

    expect(getTopRecords()).toHaveLength(2);
  });
});
