import api from './api';

// Load preferences with priority: Database > localStorage > System
export const loadUserPreferences = async (userInfo: any) => {
    try {
        // Priority 1: Database (for logged in users)
        if (userInfo) {
            try {
                const { data } = await api.get('/users/preferences');
                if (data.success && data.data) {
                    // Save to localStorage for offline access
                    localStorage.setItem('theme', data.data.theme);
                    localStorage.setItem('viewMode', data.data.viewMode);
                    localStorage.setItem('language', data.data.language);
                    return data.data;
                }
            } catch (error) {
                console.error('Failed to load preferences from database:', error);
            }
        }

        // Priority 2: localStorage
        const theme = localStorage.getItem('theme');
        const viewMode = localStorage.getItem('viewMode');
        const language = localStorage.getItem('language');

        if (theme || viewMode || language) {
            return {
                theme: theme || getSystemTheme(),
                viewMode: viewMode || 'grid',
                language: language || 'en',
                emailNotifications: true,
                smsNotifications: false
            };
        }

        // Priority 3: System preferences
        return {
            theme: getSystemTheme(),
            viewMode: 'grid',
            language: 'en',
            emailNotifications: true,
            smsNotifications: false
        };
    } catch (error) {
        console.error('Error loading preferences:', error);
        return getDefaultPreferences();
    }
};

// Save preference (both localStorage and Database if logged in)
export const savePreference = async (key: string, value: any, userInfo: any) => {
    try {
        // Always save to localStorage first (instant feedback)
        localStorage.setItem(key, value);

        // Sync to Database if user is logged in
        if (userInfo) {
            try {
                await api.put('/users/preferences', { [key]: value });
            } catch (error) {
                console.error('Failed to sync preference to database:', error);
                // Don't throw error - localStorage update succeeded
            }
        }
    } catch (error) {
        console.error('Error saving preference:', error);
    }
};

// Get system theme preference
const getSystemTheme = (): string => {
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
};

// Get default preferences
const getDefaultPreferences = () => ({
    theme: 'light',
    viewMode: 'grid',
    language: 'en',
    emailNotifications: true,
    smsNotifications: false
});

// Sync all preferences to database
export const syncAllPreferences = async (userInfo: any) => {
    if (!userInfo) return;

    try {
        const theme = localStorage.getItem('theme');
        const viewMode = localStorage.getItem('viewMode');
        const language = localStorage.getItem('language');

        const preferences: any = {};
        if (theme) preferences.theme = theme;
        if (viewMode) preferences.viewMode = viewMode;
        if (language) preferences.language = language;

        if (Object.keys(preferences).length > 0) {
            await api.put('/users/preferences', preferences);
        }
    } catch (error) {
        console.error('Failed to sync preferences:', error);
    }
};
