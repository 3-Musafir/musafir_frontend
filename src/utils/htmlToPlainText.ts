/**
 * Converts HTML string to plain text by stripping all tags.
 */
export function convertHtmlToPlainText(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Checks whether the HTML body is effectively empty (only tags, no visible text).
 */
export function isHtmlBodyEmpty(html: string | undefined | null): boolean {
  if (!html) return true;
  return !html.replace(/<[^>]*>/g, '').trim();
}
