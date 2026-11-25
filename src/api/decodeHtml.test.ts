import { describe, expect, it } from 'vitest';
import { decodeHtml } from './decodeHtml';
describe('decodeHtml', () => {
  it.each([
    ['text', 'text'],
    ['&quot;Hi&quot;', '"Hi"'],
    ['It&#039;s', "It's"],
    ['A &amp; B', 'A & B'],
    ['&lt;b&gt;', '<b>'],
    ['&amp;quot;', '&quot;'],
    ['&unknown;', '&unknown;'],
    ['', ''],
  ])('decodes %s to %s', (input, output) => {
    expect(decodeHtml(input)).toBe(output);
  });
});
