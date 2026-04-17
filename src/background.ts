import { fetchClistRating } from './api/clist';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchRating') {
    

    fetchClistRating(request.slug).then(result => {
        sendResponse(result);
    });

    // Return true to indicate an async response
    return true; 
  }
});
