import { EFileType } from '@/schemas/file-metadata.schema';

export function getFileName(fileName: string, suffix?: string) {
  const extension = fileName.split('.').pop();
  const originalName = fileName
    .replace(`.${extension}`, '')
    .replace(' ', '-')
    .trim();
  let modifiedName = `${originalName}.${extension}`;
  if (suffix) {
    modifiedName = `${originalName}-${suffix}.${extension}`;
  }
  return { originalName, modifiedName };
}

export function determineFileType(mimetype: string): EFileType {
  if (mimetype.startsWith('image/')) return EFileType.image;
  if (mimetype.startsWith('video/')) return EFileType.video;
  if (mimetype.startsWith('audio/')) return EFileType.audio;
  if (mimetype === 'application/pdf') return EFileType.pdf;
  return EFileType.row;
}
