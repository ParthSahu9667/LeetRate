import { BADGE_ID, injectBadge } from './components/badge';
import { getSlug } from './utils/url';

let attemptedSlugs = new Set<string>();

function processRating() {
    const slug = getSlug();
    if (!slug) return;

    if (document.getElementById(BADGE_ID)) {
        return;
    }

    if (attemptedSlugs.has(slug)) {
        return;
    }
    
    // Add to set to prevent multiple concurrent API calls for the same problem slug
    attemptedSlugs.add(slug);

    chrome.runtime.sendMessage({ action: 'fetchRating', slug: slug }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("LeetRate Background script error:", chrome.runtime.lastError);
            attemptedSlugs.delete(slug); // Allow retry if it was a fleeting communication error
            return;
        }
        
        if (response && response.success) {
            if (!document.getElementById(BADGE_ID)) {
                injectBadge(response.rating, slug);
            }
        } else {
            console.log(`LeetRate: Rating not found for ${slug}.`);
        }
    });
}

let currentSlug = getSlug();

const observer = new MutationObserver(() => {
    const newSlug = getSlug();
    if (newSlug) {
        if (newSlug !== currentSlug) {
            currentSlug = newSlug;
            const oldBadge = document.getElementById(BADGE_ID);
            if (oldBadge) {
                oldBadge.remove();
            }
        }
        processRating();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

window.addEventListener('load', processRating);
