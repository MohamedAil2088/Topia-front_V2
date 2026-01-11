import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const isProduction = import.meta.env.PROD;

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: false, // Disabled to prevent console spam
        interpolation: {
            escapeValue: false, // React already escapes by default
        },
        backend: {
            loadPath: '/locales/{{lng}}.json', // Path to translation files
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        saveMissing: false, // Don't log missing keys
        missingKeyHandler: false, // Disable missing key handler
    });

export default i18n;
