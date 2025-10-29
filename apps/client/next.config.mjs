import createNextIntlPlugin from "next-intl/plugin";

const server_host =
  process.env.NEXT_PUBLIC_SERVER_HOST || 'http://localhost:8000';
const client_host =
  process.env.NEXT_PUBLIC_CLIENT_HOST || 'http://localhost:3000';
const mimio_host =
  process.env.NEXT_PUBLIC_MIMIO_HOST || 'http://localhost:9000';

const hosts = [
  "https://ahmadin-api.harunjeylan.et",
  server_host,
  client_host,
  mimio_host
];

const parseUrl = (url) => {
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      port: parsed.port || '',
      pathname: '/**',
    };
  } catch (error) {
    console.error(`Invalid URL: ${url}`, error);
    return null;
  }
};

const hostPatterns = hosts.map((host) => parseUrl(host));
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  crossOrigin: 'use-credentials',
  reactStrictMode: true,
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      ...hostPatterns.filter((pattern) => pattern !== null),
      {
        protocol: 'https', // Or 'http' if needed, but 'https' is recommended
        hostname: '**', // This wildcard allows all hostnames
      },
      {
        protocol: 'http', // Or 'http' if needed, but 'https' is recommended
        hostname: '**', // This wildcard allows all hostnames
      },
    ],
  },
};

export default withNextIntl(nextConfig);
