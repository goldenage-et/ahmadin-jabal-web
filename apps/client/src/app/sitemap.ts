import { MetadataRoute } from 'next';

const locales = ['en', 'am', 'om'];
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/about',
        '/publications',
        '/media',
        '/advocacy',
        '/contact',
        '/books',
    ];

    const sitemap: MetadataRoute.Sitemap = [];

    // Generate sitemap for each locale
    locales.forEach((locale) => {
        routes.forEach((route) => {
            const url = locale === 'en'
                ? `${baseUrl}${route}`
                : `${baseUrl}/${locale}${route}`;

            sitemap.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: route === '' ? 1 : 0.8,
                alternates: {
                    languages: {
                        'en': locale === 'en' ? url : `${baseUrl}${route}`,
                        'am': locale === 'am' ? url : `${baseUrl}/am${route}`,
                        'om': locale === 'om' ? url : `${baseUrl}/om${route}`,
                    },
                },
            });
        });
    });

    return sitemap;
}
