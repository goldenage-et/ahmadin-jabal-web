/**
 * Utility functions for handling locale-based field selection
 */

type Locale = 'en' | 'am' | 'om';

// ========================================
// Generic Utility Functions
// ========================================

/**
 * Get localized string field (title, name, subject, etc.)
 */
export function getLocalizedString(
    item: { [key: string]: any },
    baseField: string,
    locale: Locale
): string {
    switch (locale) {
        case 'am':
            return item[`${baseField}Am`] || item[baseField] || '';
        case 'om':
            return item[`${baseField}Or`] || item[baseField] || '';
        case 'en':
        default:
            return item[baseField] || '';
    }
}

/**
 * Get localized content (JSON format with html property)
 */
export function getLocalizedContent(
    item: { content?: any; contentAm?: any; contentOr?: any },
    locale: Locale
): string | null {
    let content: any;

    switch (locale) {
        case 'am':
            content = item.contentAm || item.content || null;
            break;
        case 'om':
            content = item.contentOr || item.content || null;
            break;
        case 'en':
        default:
            content = item.content || null;
            break;
    }

    if (!content) return null;

    // Handle different content formats:
    // 1. String (HTML) - direct return
    if (typeof content === 'string') {
        return content;
    }

    // 2. JSON object with html property
    if (content && typeof content === 'object' && 'html' in content) {
        return (content as any).html || null;
    }

    // 3. Other JSON format - return null (fallback)
    return null;
}

// ========================================
// Blog Utilities
// ========================================

/**
 * Get the localized title for blogs
 */
export function getLocalizedTitle(
    blog: { title: string; titleAm?: string | null; titleOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(blog, 'title', locale);
}

/**
 * Get the localized excerpt for blogs
 */
export function getLocalizedExcerpt(
    blog: { excerpt?: string | null; excerptAm?: string | null; excerptOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(blog, 'excerpt', locale);
}

// ========================================
// Publication Utilities
// ========================================

/**
 * Get the localized title for publications
 */
export function getLocalizedPublicationTitle(
    publication: { title: string; titleAm?: string | null; titleOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(publication, 'title', locale);
}

/**
 * Get the localized excerpt for publications
 */
export function getLocalizedPublicationExcerpt(
    publication: { excerpt?: string | null; excerptAm?: string | null; excerptOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(publication, 'excerpt', locale);
}

/**
 * Get the localized content for publications
 */
export function getLocalizedPublicationContent(
    publication: { content?: any; contentAm?: any; contentOr?: any },
    locale: Locale
): string | null {
    return getLocalizedContent(publication, locale);
}

// ========================================
// Category Utilities
// ========================================

/**
 * Get the localized name for categories
 */
export function getLocalizedCategoryName(
    category: { name: string; nameAm?: string | null; nameOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(category, 'name', locale);
}

/**
 * Get the localized description for categories
 */
export function getLocalizedCategoryDescription(
    category: { description?: string | null; descriptionAm?: string | null; descriptionOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(category, 'description', locale);
}

// ========================================
// Book Utilities
// ========================================

/**
 * Get the localized title for books
 */
export function getLocalizedBookTitle(
    book: { title: string; titleAm?: string | null; titleOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(book, 'title', locale);
}

/**
 * Get the localized description for books
 */
export function getLocalizedBookDescription(
    book: { description?: string | null; descriptionAm?: string | null; descriptionOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(book, 'description', locale);
}

/**
 * Get the localized publisher for books
 */
export function getLocalizedBookPublisher(
    book: { publisher?: string | null; publisherAm?: string | null; publisherOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(book, 'publisher', locale);
}

/**
 * Get the localized author for books
 */
export function getLocalizedBookAuthor(
    book: { author?: string | null; authorAm?: string | null; authorOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(book, 'author', locale);
}

// ========================================
// Media Utilities (Media, Video, Audio, Photo)
// ========================================

/**
 * Get the localized title for media items
 */
export function getLocalizedMediaTitle(
    media: { title: string; titleAm?: string | null; titleOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(media, 'title', locale);
}

/**
 * Get the localized description for media items
 */
export function getLocalizedMediaDescription(
    media: { description?: string | null; descriptionAm?: string | null; descriptionOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(media, 'description', locale);
}

// ========================================
// Photo Utilities (includes caption)
// ========================================

/**
 * Get the localized caption for photos
 */
export function getLocalizedPhotoCaption(
    photo: { caption?: string | null; captionAm?: string | null; captionOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(photo, 'caption', locale);
}

// ========================================
// Gallery Utilities
// ========================================

/**
 * Get the localized title for galleries
 */
export function getLocalizedGalleryTitle(
    gallery: { title: string; titleAm?: string | null; titleOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(gallery, 'title', locale);
}

/**
 * Get the localized description for galleries
 */
export function getLocalizedGalleryDescription(
    gallery: { description?: string | null; descriptionAm?: string | null; descriptionOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(gallery, 'description', locale);
}

// ========================================
// Newsletter Utilities
// ========================================

/**
 * Get the localized subject for newsletters
 */
export function getLocalizedNewsletterSubject(
    newsletter: { subject: string; subjectAm?: string | null; subjectOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(newsletter, 'subject', locale);
}

/**
 * Get the localized title for newsletters
 */
export function getLocalizedNewsletterTitle(
    newsletter: { title: string; titleAm?: string | null; titleOr?: string | null },
    locale: Locale
): string {
    return getLocalizedString(newsletter, 'title', locale);
}

/**
 * Get the localized content for newsletters
 */
export function getLocalizedNewsletterContent(
    newsletter: { content?: any; contentAm?: any; contentOr?: any },
    locale: Locale
): string | null {
    return getLocalizedContent(newsletter, locale);
}

