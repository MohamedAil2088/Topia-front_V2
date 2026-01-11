import i18n from '../i18n';

/**
 * Get localized name from a string or multilingual object
 * Handles both simple strings and objects like {en: "...", ar: "..."}
 */
export const getLocalizedName = (name: any, fallback: string = 'Unknown'): string => {
    if (!name) return fallback;
    
    // If it's already a string, return it
    if (typeof name === 'string') {
        return name;
    }
    
    // If it's an object with language keys
    if (typeof name === 'object' && name !== null) {
        const currentLang = i18n.language || 'en';
        // Try current language first, then English, then Arabic, then first available value
        return name[currentLang] || name.en || name.ar || Object.values(name)[0] || fallback;
    }
    
    // Fallback: convert to string
    return String(name) || fallback;
};

export default getLocalizedName;
