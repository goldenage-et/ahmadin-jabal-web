import { server_host } from '@/config/host.config.mjs';

export function getFileStream(filename: string) {
  return `${server_host}/files/${filename}`;
}
