const PHOTO_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/avif',
];

export const EVIDENCE_PHOTO_ACCEPT = '.jpg,.jpeg,.png,.webp,.heic,.heif,.avif';

export function selectEvidencePhotos(files) {
  return Array.from(files).filter((file) => {
    if (file.type) return PHOTO_TYPES.includes(file.type.toLowerCase());
    return /\.(jpe?g|png|webp|hei[cf]|avif)$/i.test(file.name);
  });
}
