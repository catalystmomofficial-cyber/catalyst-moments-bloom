import DOMPurify from 'dompurify';

const normalizeText = (value: string) =>
  value
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase();

const slugifyHeading = (value: string) =>
  normalizeText(value)
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';

/**
 * Prepares stored blog HTML for the public article page without changing the
 * source content in Supabase.
 */
export const prepareBlogContent = (content: string, articleTitle: string) => {
  let html = DOMPurify.sanitize(content, {
    ADD_ATTR: ['loading', 'decoding', 'id'],
  });

  // Older editor content sometimes begins with the same title the page shell
  // already renders. Keep one semantic H1 while preserving non-matching H1s.
  html = html.replace(/^\s*<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i, (match, heading) =>
    normalizeText(heading) === normalizeText(articleTitle) ? '' : match,
  );

  const usedIds = new Set<string>();
  html = html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attributes, body) => {
    const existingId = attributes.match(/\sid=["']([^"']+)["']/i)?.[1];
    let id = existingId || slugifyHeading(body);
    let suffix = 2;

    while (usedIds.has(id)) {
      id = `${existingId || slugifyHeading(body)}-${suffix++}`;
    }
    usedIds.add(id);

    const nextAttributes = existingId ? attributes : `${attributes} id="${id}"`;
    return `<${tag}${nextAttributes}>${body}</${tag}>`;
  });

  // Add performance hints only when the editor has not already supplied them.
  return html.replace(/<img\b([^>]*)>/gi, (_match, attributes: string) => {
    const loading = /\sloading=/i.test(attributes) ? '' : ' loading="lazy"';
    const decoding = /\sdecoding=/i.test(attributes) ? '' : ' decoding="async"';
    return `<img${loading}${decoding}${attributes}>`;
  });
};

export const blogPlainText = (content: string) =>
  DOMPurify.sanitize(content, { ALLOWED_TAGS: [] })
    .replace(/\s+/g, ' ')
    .trim();
