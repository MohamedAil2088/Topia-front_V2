export const getImageUrl = (url: any): string => {
    // Handle null, undefined, empty values
    if (!url) return '';

    // Handle arrays - get first element
    if (Array.isArray(url)) {
        if (url.length === 0) return '';
        url = url[0];
    }

    // Handle if url is an object with url property
    if (typeof url === 'object' && url !== null) {
        if (url.url) {
            url = url.url;
        } else if (url.image) {
            url = url.image;
        } else {
            // Can't extract URL from this object
            return '';
        }
    }

    // Final check - must be a string at this point
    if (typeof url !== 'string') return '';

    // If empty string, return empty
    if (url.trim() === '') return '';

    // External URLs - return as is
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }

    // Build the full URL for local images
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // Remove /api from the end to get the base URL for images
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');

    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};
