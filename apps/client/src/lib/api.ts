import { cache } from 'react';
import { Fetcher } from './fetcher';
import { server_host } from '@/config/host.config.mjs';
import { getCookieHeader } from './cookie';

let apiInstance: Fetcher | null = null;

const getApi = cache(() => {
  if (!apiInstance) {
    apiInstance = new Fetcher(server_host, {
      getCookieHeader,
    });
  }
  return apiInstance;
});

const api = getApi();

export { api };
