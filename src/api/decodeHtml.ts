const NAMED_ENTITIES = new Map<string, string>([
  ['quot', '"'],
  ['amp', '&'],
  ['lt', '<'],
  ['gt', '>'],
  ['apos', "'"],
  ['nbsp', '\u00A0'],
  ['shy', '\u00AD'],

  ['deg', '°'],
  ['lsquo', '‘'],
  ['rsquo', '’'],
  ['ldquo', '“'],
  ['rdquo', '”'],
  ['laquo', '«'],
  ['raquo', '»'],
  ['hellip', '…'],
  ['ndash', '–'],
  ['mdash', '—'],
  ['trade', '™'],
  ['copy', '©'],
  ['reg', '®'],

  ['aacute', 'á'],
  ['Aacute', 'Á'],
  ['agrave', 'à'],
  ['Agrave', 'À'],
  ['acirc', 'â'],
  ['Acirc', 'Â'],
  ['atilde', 'ã'],
  ['Atilde', 'Ã'],
  ['auml', 'ä'],
  ['Auml', 'Ä'],
  ['aring', 'å'],
  ['Aring', 'Å'],
  ['aelig', 'æ'],
  ['AElig', 'Æ'],
  ['ccedil', 'ç'],
  ['Ccedil', 'Ç'],
  ['eacute', 'é'],
  ['Eacute', 'É'],
  ['egrave', 'è'],
  ['Egrave', 'È'],
  ['ecirc', 'ê'],
  ['Ecirc', 'Ê'],
  ['euml', 'ë'],
  ['Euml', 'Ë'],
  ['iacute', 'í'],
  ['Iacute', 'Í'],
  ['igrave', 'ì'],
  ['Igrave', 'Ì'],
  ['icirc', 'î'],
  ['Icirc', 'Î'],
  ['iuml', 'ï'],
  ['Iuml', 'Ï'],
  ['ntilde', 'ñ'],
  ['Ntilde', 'Ñ'],
  ['oacute', 'ó'],
  ['Oacute', 'Ó'],
  ['ograve', 'ò'],
  ['Ograve', 'Ò'],
  ['ocirc', 'ô'],
  ['Ocirc', 'Ô'],
  ['otilde', 'õ'],
  ['Otilde', 'Õ'],
  ['ouml', 'ö'],
  ['Ouml', 'Ö'],
  ['oslash', 'ø'],
  ['Oslash', 'Ø'],
  ['uacute', 'ú'],
  ['Uacute', 'Ú'],
  ['ugrave', 'ù'],
  ['Ugrave', 'Ù'],
  ['ucirc', 'û'],
  ['Ucirc', 'Û'],
  ['uuml', 'ü'],
  ['Uuml', 'Ü'],
  ['yacute', 'ý'],
  ['Yacute', 'Ý'],
  ['yuml', 'ÿ'],
  ['szlig', 'ß'],
  ['eth', 'ð'],
  ['ETH', 'Ð'],
  ['thorn', 'þ'],
  ['THORN', 'Þ'],
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
