import { BADGE_ID, injectBadge } from './components/badge';
import { getSlug } from './utils/url';

function processRating() {
    const slug = getSlug();
    if (!slug) return;

    if (document.getElementById(BADGE_ID)) {
        return;
    }

    chrome.runtime.sendMessage({ action: 'fetchRating', slug: slug }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("LeetRank Background script error:", chrome.runtime.lastError);
            return;
        }
        
        if (response && response.success) {
            injectBadge(response.rating, slug);
        } else {
            console.log(`LeetRank: Rating not found for ${slug}.`);
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
