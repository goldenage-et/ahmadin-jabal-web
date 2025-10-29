import Script from 'next/script';

export function StructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Ustaz Ahmedin Jebel',
        alternateName: ['አሕመዲን ጀበል', 'Ahmedin Jebel'],
        description: 'Islamic educator, historian, and community advocate promoting faith, heritage and justice for Ethiopian Muslims',
        nationality: 'Ethiopian',
        jobTitle: ['Islamic Educator', 'Historian', 'Community Advocate'],
        worksFor: {
            '@type': 'Organization',
            name: 'Ethiopian Islamic Affairs Supreme Council',
            jobTitle: 'Social Affairs Advisor'
        },
        knowsAbout: [
            'Islamic Education',
            'Ethiopian Muslim History',
            'Community Advocacy',
            'Religious Freedom',
            'Youth Development'
        ],
        hasOccupation: {
            '@type': 'Occupation',
            name: 'Islamic Scholar',
            description: 'Preacher, historian, and community advocate'
        },
        sameAs: [
            'https://www.youtube.com/@ustazahmedin',
            'https://www.facebook.com/ustazahmedin',
            'https://twitter.com/ustazahmedin'
        ],
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        image: 'https://pbs.twimg.com/media/DOry78lW4AAVjeo.jpg',
        birthPlace: {
            '@type': 'Place',
            name: 'Ethiopia'
        },
        alumniOf: {
            '@type': 'EducationalOrganization',
            name: 'Islamic Studies'
        }
    };

    return (
        <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData),
            }}
        />
    );
}
