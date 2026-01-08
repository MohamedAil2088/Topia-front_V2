import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
}

const SEO = ({
    title,
    description,
    keywords = "men's fashion, clothing, Egyptian fashion, online shopping, TOPIA",
    image = "/logo.png"
}: SEOProps) => {
    const siteName = "TOPIA - Premium Men's Fashion";
    const fullTitle = `${title} | ${siteName}`;

    useEffect(() => {
        // Set title
        document.title = fullTitle;

        // Set meta tags
        const setMetaTag = (name: string, content: string, property = false) => {
            const attr = property ? 'property' : 'name';
            let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;

            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, name);
                document.head.appendChild(element);
            }

            element.setAttribute('content', content);
        };

        // Basic SEO
        setMetaTag('description', description);
        setMetaTag('keywords', keywords);

        // Open Graph
        setMetaTag('og:title', fullTitle, true);
        setMetaTag('og:description', description, true);
        setMetaTag('og:image', image, true);
        setMetaTag('og:type', 'website', true);

        // Twitter
        setMetaTag('twitter:title', fullTitle);
        setMetaTag('twitter:description', description);
        setMetaTag('twitter:image', image);
        setMetaTag('twitter:card', 'summary_large_image');

    }, [title, description, keywords, image, fullTitle]);

    return null;
};

export default SEO;
