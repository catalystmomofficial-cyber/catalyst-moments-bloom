const extensions: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'], 'image/png': ['png'], 'image/webp': ['webp'],
  'image/gif': ['gif'], 'image/heic': ['heic'], 'image/heif': ['heif'],
};
export function validateImageUpload(file: Pick<File, 'name' | 'type' | 'size'>, maxBytes = 10 * 1024 * 1024) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!extensions[file.type.toLowerCase()]?.includes(extension)) throw new Error('Use a JPG, PNG, WebP, GIF or HEIC image.');
  if (file.size <= 0 || file.size > maxBytes) throw new Error(`Image must be smaller than ${maxBytes / 1024 / 1024}MB.`);
}
