interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

const passthroughTypes = new Set(['image/gif', 'image/svg+xml']);

/**
 * Shrink a raster image before it is uploaded. Animated GIFs and SVGs are
 * returned untouched because drawing them to canvas would change their
 * behaviour. If the browser cannot encode WebP, the original file is used.
 */
export async function optimizeBlogImage(
  file: File,
  { maxWidth = 1600, maxHeight = 1600, quality = 0.82 }: OptimizeImageOptions = {},
): Promise<File> {
  if (!file.type.startsWith('image/') || passthroughTypes.has(file.type)) return file;

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('Could not read this image'));
      element.src = objectUrl;
    });

    const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return file;

    context.drawImage(image, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));

    // Do not replace an already-efficient original with a larger file.
    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'blog-image';
    return new File([blob], `${baseName}.webp`, { type: 'image/webp', lastModified: Date.now() });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

