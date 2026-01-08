import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
}

const LazyImage = ({
    src,
    alt,
    className = '',
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E'
}: LazyImageProps) => {
    const [imageSrc, setImageSrc] = useState(placeholder);
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        let observer: IntersectionObserver;

        if (imageRef && imageSrc === placeholder) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setImageSrc(src);
                            observer.unobserve(imageRef);
                        }
                    });
                },
                {
                    rootMargin: '50px',
                }
            );

            observer.observe(imageRef);
        }

        return () => {
            if (observer && imageRef) {
                observer.unobserve(imageRef);
            }
        };
    }, [imageRef, imageSrc, placeholder, src]);

    return (
        <img
            ref={setImageRef}
            src={imageSrc}
            alt={alt}
            className={`${className} ${imageSrc === placeholder ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
            loading="lazy"
        />
    );
};

export default LazyImage;
