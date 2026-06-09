/**
 * Convert a Supabase public storage URL to a resized render URL.
 * Falls back to the original URL for non-Supabase sources.
 */
export function supabaseImgSrc(url: string, width: number, quality = 80): string {
  if (!url || !url.includes('/storage/v1/object/public/')) return url;
  return (
    url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') +
    `?width=${width}&quality=${quality}`
  );
}

/**
 * Build a srcSet string for a Supabase storage image at multiple widths.
 */
export function supabaseImgSrcSet(url: string, widths: number[], quality = 80): string {
  if (!url || !url.includes('/storage/v1/object/public/')) return '';
  return widths.map(w => `${supabaseImgSrc(url, w, quality)} ${w}w`).join(', ');
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
