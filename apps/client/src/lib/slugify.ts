/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        // Replace spaces and underscores with hyphens
        .replace(/\s+/g, '-')
        .replace(/_/g, '-')
        // Remove special characters except hyphens
        .replace(/[^\w\-]+/g, '')
        // Replace multiple consecutive hyphens with a single hyphen
        .replace(/\-\-+/g, '-')
        // Remove leading and trailing hyphens
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

