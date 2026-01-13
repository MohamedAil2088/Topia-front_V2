/**
 * Cloudinary transformation options for image optimization
 */
interface ImageOptions {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best' | number;
}

/**
 * Add Cloudinary transformations to optimize images
 * - Converts to WebP/AVIF automatically (f_auto)
 * - Compresses with best quality (q_auto)
 * - Resizes to specified dimensions
 */
const addCloudinaryTransforms = (url: string, options?: ImageOptions): string => {
    if (!url.includes('res.cloudinary.com')) return url;

    // Build transformation string
    const transforms: string[] = ['f_auto', 'q_auto'];

    if (options?.width) {
        transforms.push(`w_${options.width}`);
    }
    if (options?.height) {
        transforms.push(`h_${options.height}`);
    }

    // Insert transformations into Cloudinary URL
    // Format: .../upload/TRANSFORMS/...
    const transformString = transforms.join(',');
    return url.replace('/upload/', `/upload/${transformString}/`);
};

export const getImageUrl = (url: any, options?: ImageOptions): string => {
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

    // External URLs - apply Cloudinary transforms if applicable
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
        return addCloudinaryTransforms(url, options);
    }

    // Build the full URL for local images
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // Remove /api from the end to get the base URL for images
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');

    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Get optimized thumbnail image (small size for lists/cards)
 */
export const getThumbnailUrl = (url: any): string => {
    return getImageUrl(url, { width: 200, quality: 'auto' });
};

/**
 * Get optimized card image (medium size for product cards)
 */
export const getCardImageUrl = (url: any): string => {
    return getImageUrl(url, { width: 400, quality: 'auto' });
};

/**
 * Get optimized product detail image (large size)
 */
export const getProductImageUrl = (url: any): string => {
    return getImageUrl(url, { width: 800, quality: 'auto:good' });
};

