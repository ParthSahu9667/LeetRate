const CLIST_USERNAME = 'YOUR_CLIST_USERNAME';
const CLIST_API_KEY = 'YOUR_CLIST_API_KEY';

export interface RatingResult {
    success: boolean;
    rating?: number | string;
    error?: string;
}

export async function fetchClistRating(slug: string): Promise<RatingResult> {
    const url = `https://clist.by/api/v4/problem/?resource=leetcode.com&slug=${slug}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `ApiKey ${CLIST_USERNAME}:${CLIST_API_KEY}`
            }
        });

        if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.objects && data.objects.length > 0) {
            const problem = data.objects[0];
            const rating = problem.rating !== null && problem.rating !== undefined ? problem.rating : 'N/A';
            return { success: true, rating: rating };
        } else {
            return { success: false, error: 'Not Found' };
        }
    } catch (error) {
        console.error("Error fetching rating from Clist API:", error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown Error' };
    }
}
