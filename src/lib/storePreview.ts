/**
 * Enables deterministic, non-customer demo data for App Store captures.
 *
 * This flag is replaced at build time by Vite. Normal local and production
 * builds leave it disabled; screenshot builds opt in explicitly with
 * `VITE_STORE_PREVIEW=true`.
 */
export const isStorePreview = import.meta.env.VITE_STORE_PREVIEW === 'true';
