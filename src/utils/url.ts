/**
 * Get the problem slug from the current LeetCode URL
 */
export function getSlug(): string | null {
    const match = window.location.pathname.match(/\/problems\/([^/]+)/);
    return match ? match[1] : null;
}
