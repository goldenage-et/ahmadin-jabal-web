import { z } from 'zod';

export const ZAllowedFileExtension = z.enum([
  'png',
  'jpeg',
  'jpg',
  'webp',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'plain',
  'csv',
  'mp4',
  'mov',
  'avi',
  'mkv',
  'webm',
  'zip',
  'rar',
  '7z',
  'tar',
]);

export type TAllowedFileExtension = z.infer<typeof ZAllowedFileExtension>;

export type TSelectFile = Partial<File>;
