// fetch.js

// Access the original window.fetch function before overriding it.
// This is useful if you need to fallback to the original fetch for other requests.
const originalFetch = window.fetch;

// Hardcoded wordList of 100 words
const wordList = [
    { text: 'apple', syllables: 2 },
    { text: 'banana', syllables: 3 },
    { text: 'orange', syllables: 2 },
    { text: 'strawberry', syllables: 3 },
    { text: 'grape', syllables: 1 },
    { text: 'pineapple', syllables: 3 },
    { text: 'watermelon', syllables: 4 },
    { text: 'lemon', syllables: 2 },
    { text: 'lime', syllables: 1 },
    { text: 'cherry', syllables: 2 },
    { text: 'blueberry', syllables: 3 },
    { text: 'raspberry', syllables: 3 },
    { text: 'blackberry', syllables: 3 },
    { text: 'kiwi', syllables: 2 },
    { text: 'mango', syllables: 2 },
    { text: 'papaya', syllables: 3 },
    { text: 'pear', syllables: 1 },
    { text: 'plum', syllables: 1 },
    { text: 'peach', syllables: 1 },
    { text: 'apricot', syllables: 3 },
    { text: 'grapefruit', syllables: 2 },
    { text: 'melon', syllables: 2 },
    { text: 'nectarine', syllables: 3 },
    { text: 'coconut', syllables: 3 },
    { text: 'pomegranate', syllables: 4 },
    { text: 'fig', syllables: 1 },
    { text: 'date', syllables: 1 },
    { text: 'kumquat', syllables: 2 },
    { text: 'tangerine', syllables: 3 },
    { text: 'quince', syllables: 1 },
    { text: 'lychee', syllables: 2 },
    { text: 'passionfruit', syllables: 3 },
    { text: 'starfruit', syllables: 2 },
    { text: 'dragonfruit', syllables: 3 },
    { text: 'jackfruit', syllables: 2 },
    { text: 'durian', syllables: 3 },
    { text: 'guava', syllables: 2 },
    { text: 'persimmon', syllables: 3 },
    { text: 'mangosteen', syllables: 3 },
    { text: 'cantaloupe', syllables: 3 },
    { text: 'honeydew', syllables: 3 },
    { text: 'cranberry', syllables: 3 },
    { text: 'elderberry', syllables: 4 },
    { text: 'gooseberry', syllables: 3 },
    { text: 'boysenberry', syllables: 4 },
    { text: 'currant', syllables: 2 },
    { text: 'olive', syllables: 2 },
    { text: 'avocado', syllables: 4 },
    { text: 'tomato', syllables: 3 },
    { text: 'zucchini', syllables: 3 },
    { text: 'pumpkin', syllables: 2 },
    { text: 'squash', syllables: 1 },
    { text: 'carrot', syllables: 2 },
    { text: 'broccoli', syllables: 3 },
    { text: 'cauliflower', syllables: 4 },
    { text: 'spinach', syllables: 2 },
    { text: 'lettuce', syllables: 2 },
    { text: 'kale', syllables: 1 },
    { text: 'cabbage', syllables: 2 },
    { text: 'celery', syllables: 3 },
    { text: 'asparagus', syllables: 4 },
    { text: 'radish', syllables: 2 },
    { text: 'beet', syllables: 1 },
    { text: 'turnip', syllables: 2 },
    { text: 'potato', syllables: 3 },
    { text: 'onion', syllables: 2 },
    { text: 'garlic', syllables: 2 },
    { text: 'ginger', syllables: 2 },
    { text: 'pepper', syllables: 2 },
    { text: 'chili', syllables: 2 },
    { text: 'cucumber', syllables: 3 },
    { text: 'eggplant', syllables: 2 },
    { text: 'mushroom', syllables: 2 },
    { text: 'corn', syllables: 1 },
    { text: 'peas', syllables: 1 },
    { text: 'beans', syllables: 1 },
    { text: 'rice', syllables: 1 },
    { text: 'wheat', syllables: 1 },
    { text: 'oats', syllables: 1 },
    { text: 'barley', syllables: 2 },
    { text: 'rye', syllables: 1 },
    { text: 'quinoa', syllables: 2 },
    { text: 'buckwheat', syllables: 2 },
    { text: 'millet', syllables: 2 },
    { text: 'sorghum', syllables: 2 },
    { text: 'bread', syllables: 1 },
    { text: 'butter', syllables: 2 },
    { text: 'cheese', syllables: 1 },
    { text: 'milk', syllables: 1 },
    { text: 'yogurt', syllables: 2 },
    { text: 'cream', syllables: 1 },
    { text: 'egg', syllables: 1 },
    { text: 'chicken', syllables: 2 },
    { text: 'beef', syllables: 1 },
    { text: 'pork', syllables: 1 },
    { text: 'lamb', syllables: 1 },
    { text: 'fish', syllables: 1 },
    { text: 'shrimp', syllables: 1 },
    { text: 'crab', syllables: 1 },
    { text: 'lobster', syllables: 2 },
    { text: 'oyster', syllables: 2 },
    { text: 'clam', syllables: 1 },
    { text: 'mussel', syllables: 2 },
    { text: 'scallop', syllables: 2 },
    { text: 'tuna', syllables: 2 },
    { text: 'salmon', syllables: 2 },
    { text: 'trout', syllables: 1 },
    { text: 'cod', syllables: 1 },
    { text: 'sardine', syllables: 2 },
    { text: 'anchovy', syllables: 3 },
];

// Override the native fetch function
window.fetch = function(url, options = {}) {
    console.log(`Custom fetch called with URL: ${url}, options:`, options);

    function createResponse(status, body) {
        return Promise.resolve({
            ok: status >= 200 && status < 300,
            status: status,
            json: function() {
                return Promise.resolve(body);
            }
        });
    }

    // Handle requests to '/words'
    if (url.includes('/words')) {
        // Ensure method is GET
        const method = options.method ? options.method.toUpperCase() : 'GET';
        if (method !== 'GET') {
            console.log(`Method not allowed: ${method}`);
            return createResponse(405, { error: 'Method Not Allowed' });
        }

        // Parse URL and query parameters without relying on window.location.origin
        let queryString = '';
        if (url.includes('?')) {
            queryString = url.substring(url.indexOf('?') + 1);
        }
        const params = new URLSearchParams(queryString);

        const offset = parseInt(params.get('offset'), 10) || 0;
        const count = parseInt(params.get('count'), 10) || 10; // Default to 10 if not provided

        console.log(`Parsed offset: ${offset}, count: ${count}`);

        // Validate parameters
        if (count > 100) {
            console.log(`Count exceeds limit: ${count}`);
            return createResponse(400, { error: 'Count must not be greater than 100' });
        }

        if (offset < 0 || offset >= wordList.length) {
            console.log(`Invalid offset: ${offset}`);
            return createResponse(400, { error: 'Invalid offset' });
        }

        // Slice the wordList based on offset and count
        const slicedWords = wordList.slice(offset, offset + count);
        console.log(`Returning words:`, slicedWords);
        return createResponse(200, slicedWords);
    }

    // For all other URLs, use the original fetch
    return originalFetch(url, options);
};

// Log that fetch.js has been loaded
console.log('Custom fetch function loaded.');
