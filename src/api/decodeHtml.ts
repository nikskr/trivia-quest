const NAMED_ENTITIES = new Map<string, string>([
  ['quot', '"'],
  ['amp', '&'],
  ['lt', '<'],
  ['gt', '>'],
  ['deg', '°'],
  ['lsquo', '‘'],
  ['rsquo', '’'],
  ['ldquo', '“'],
  ['rdquo', '”'],
  ['hellip', '…'],
  ['ndash', '–'],
  ['mdash', '—'],
]);

const MAX_CODE_POINT = 0x10ffff;

const ENTITY = /&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|([a-zA-Z][a-zA-Z0-9]*));/g;

function fromCodePoint(code: number, original: string): string {
  return code < MAX_CODE_POINT ? String.fromCodePoint(code) : original;
}

export function decodeHtml(text: string): string {
  return text.replace(ENTITY, (match, dec?: string, hex?: string, name?: string) => {
    if (dec !== undefined) return fromCodePoint(Number.parseInt(dec, 10), match);
    if (hex !== undefined) return fromCodePoint(Number.parseInt(hex, 16), match);
    return NAMED_ENTITIES.get(name!) ?? match;
  });
}
