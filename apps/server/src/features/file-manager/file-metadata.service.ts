import { STORAGE_PROVIDER } from '@/constants/constants';
import { IStorageProvider } from '@/providers/storage/storage-provider.interface';
import { Inject, Injectable } from '@nestjs/common';
import { EFileType } from '@repo/common';
import { Request, Response } from 'express';

@Injectable()
export class FileMetadataService {
  private CHUNK_SIZE = 400 * 1000;
  constructor(
    @Inject(STORAGE_PROVIDER) private storageProvider: IStorageProvider,
  ) { }

  async streamFile(req: Request, res: Response, filename: string) {
    const mimetype = this.getMimeTypeFromFilename(filename);
    const fileType = this.determineFileType(mimetype);

    if (fileType !== EFileType.video && fileType !== EFileType.audio) {
      const headers = {
        'Content-Type': mimetype,
      };

      res.writeHead(200, headers);
      const stream = await this.storageProvider.getFileStatic(filename);
      return stream.pipe(res);
    }

    const range = req.headers.range;

    if (!range) {
      return res.status(400).send('Requires Range header');
    }

    const { size } = await this.storageProvider.getFileStat(filename);

    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + this.CHUNK_SIZE, size - 1);

    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': mimetype,
    };

    res.writeHead(206, headers);

    const stream = await this.storageProvider.getFileStream(
      filename,
      start,
      end,
    );
    return stream.pipe(res);
  }

  getMimeTypeFromFilename(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();

    const mimeTypes: Record<string, string> = {
      // Images
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      bmp: 'image/bmp',
      ico: 'image/x-icon',

      // Videos
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
      wmv: 'video/x-ms-wmv',
      flv: 'video/x-flv',
      mkv: 'video/x-matroska',
      webm: 'video/webm',

      // Audio
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      aac: 'audio/aac',
      m4a: 'audio/mp4',
      wma: 'audio/x-ms-wma',
      flac: 'audio/flac',

      // Documents
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
      csv: 'text/csv',
      json: 'application/json',
      xml: 'application/xml',
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
    };

    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  determineFileType(mimetype: string): EFileType {
    if (mimetype.startsWith('image/')) return EFileType.image;
    if (mimetype.startsWith('video/')) return EFileType.video;
    if (mimetype.startsWith('audio/')) return EFileType.audio;
    if (mimetype === 'application/pdf') return EFileType.pdf;
    if (['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'].includes(mimetype))
      return EFileType.video;
    if (['mp3', 'wav', 'ogg', 'aac', 'm4a', 'wma', 'flac'].includes(mimetype))
      return EFileType.audio;
    return EFileType.row;
  }
}
