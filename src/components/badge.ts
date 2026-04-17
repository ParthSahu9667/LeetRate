import { formatSlugToName } from '../utils/formatters';
import { getRatingColor } from '../utils/theme';

export const BADGE_ID = 'leetclist-rating-badge';

export function injectBadge(rating: number | string, slug: string) {
    if (document.getElementById(BADGE_ID)) {
        return;
    }

    const badge = document.createElement('div');
    badge.id = BADGE_ID;
    

    badge.style.cssText = `
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 16px;
        cursor: pointer;
        margin-right: auto;
        user-select: none;
        transition: background-color 0.2s;
    `;

    badge.className = "bg-fill-3 dark:bg-dark-fill-3 text-label-2 dark:text-dark-label-2 hover:bg-fill-2 dark:hover:bg-dark-fill-2";

    const ratingColor = getRatingColor(rating);
    let isRevealed = false;


    badge.innerHTML = `
        <div id="clist-inner-container" style="display: flex; align-items: center; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: left center;">
            <span id="clist-label" style="transition: color 0.3s;">Rating:</span>
            <span id="clist-val" style="filter: blur(4px); transition: all 0.4s ease; margin-left: 4px; font-weight: normal; color: inherit;">
                ${rating !== 'N/A' ? rating : 'Hidden'}
            </span>
        </div>
    `;

    const container = badge.querySelector('#clist-inner-container') as HTMLElement;
    const label = badge.querySelector('#clist-label') as HTMLElement;
    const val = badge.querySelector('#clist-val') as HTMLElement;

    badge.addEventListener('click', () => {
        isRevealed = !isRevealed;
        
        if (isRevealed) {
            label.textContent = "Rating:";
            val.style.filter = 'blur(0px)';
            val.style.fontWeight = '600';
            val.style.color = ratingColor;
        } else {
            label.textContent = "Rating:";
            val.style.filter = 'blur(4px)';
            val.style.fontWeight = 'normal';
            val.style.color = 'inherit';
        }
    });


    const layoutContainer = document.querySelector('.relative.flex.h-full.w-full.flex-col > .w-full.px-5.pt-5') 
        || document.querySelector('[data-track-load="description_content"]')?.parentElement
        || document.querySelector('h1')?.parentElement;
        
    if (layoutContainer) {
        layoutContainer.insertAdjacentElement('afterbegin', badge);
    } else {
        badge.style.position = 'fixed';
        badge.style.bottom = '20px';
        badge.style.right = '20px';
        document.body.appendChild(badge);
    }
}
