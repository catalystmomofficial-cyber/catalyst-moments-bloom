/**
 * Return a Supabase public storage URL as-is.
 * (Image transformation/render endpoint is not enabled on this project, so
 * we serve the original public object URL which is always available.)
 */
export function supabaseImgSrc(url: string, _width?: number, _quality = 80): string {
  return url;
}

/**
 * srcSet is not used for Supabase storage since the render/resize endpoint
 * is unavailable. Returning an empty string lets the browser fall back to `src`.
 */
export function supabaseImgSrcSet(_url: string, _widths: number[], _quality = 80): string {
  return '';
}

/**
 * Build a srcSet string for an Unsplash image at multiple widths.
 * Preserves all existing params and overrides `w` and `q`.
 */
export function unsplashSrcSet(url: string, widths: number[]): string {
  if (!url || !url.includes('unsplash.com')) return '';
  const [base, search] = url.split('?');
  const params = new URLSearchParams(search || '');
  params.set('auto', 'format');
  params.set('fit', 'crop');
  params.set('q', '80');
  return widths
    .map(w => { params.set('w', String(w)); return `${base}?${params.toString()} ${w}w`; })
    .join(', ');
}
