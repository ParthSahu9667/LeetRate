/**
 * Formats a URL slug to a Human Readable string.
 * e.g., "roman-to-integer" -> "Roman To Integer"
 */
export function formatSlugToName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
