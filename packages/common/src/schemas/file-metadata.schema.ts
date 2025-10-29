import { z } from 'zod';
export enum EStorageType {
  DISK = 'disk',
  MINIO = 'minio',
}

export enum EFileType {
  image = 'image',
  video = 'video',
  audio = 'audio',
  pdf = 'pdf',
  row = 'row',
}

export const ZFileMetadata = z.object({
  type: z.enum(EFileType),
  originalname: z.string(),
  filename: z.string(),
  storeId: z.string().optional(),
});

export type TFileMetadata = z.infer<typeof ZFileMetadata>;
