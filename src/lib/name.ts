// The quiz-taker's display name. Used only for personalization (never scored).
// Sanitized everywhere it's rendered (result page, share card, PDF) since it
// rides in the URL.

export function cleanName(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw
    .replace(/[<>&"'`]/g, '') // strip anything that could break HTML/markup
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);
}

/** Possessive form: "Maya" → "Maya's", "James" → "James'". */
export function possessive(name: string): string {
  if (!name) return '';
  return /s$/i.test(name) ? `${name}'` : `${name}'s`;
}
