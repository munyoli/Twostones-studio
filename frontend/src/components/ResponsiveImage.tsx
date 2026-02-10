import React from 'react';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    sizes?: string;
    className?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
    src,
    alt,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    className,
    ...props
}) => {
    // For srcset generation, we need to extract the path without the origin if it's our backend
    let imagePath = src;
    const backendUrl = 'http://localhost:5000';

    if (src.startsWith(backendUrl)) {
        imagePath = src.substring(backendUrl.length);
    } else if (src.startsWith('http')) {
        // External URL, return standard img
        return <img src={src} alt={alt} className={className} {...props} />;
    }

    if (!imagePath.includes('/uploads/')) {
        return <img src={src} alt={alt} className={className} {...props} />;
    }

    // Extract base path without extension
    const lastDotIndex = src.lastIndexOf('.');
    if (lastDotIndex === -1) return <img src={src} alt={alt} className={className} {...props} />;

    const basePath = src.substring(0, lastDotIndex);
    const extension = src.substring(lastDotIndex);

    // We only support generating srcset for WebP internal images
    if (extension !== '.webp') {
        return <img src={src} alt={alt} className={className} loading="lazy" {...props} />;
    }

    const srcSet = `
        ${basePath}-400.webp 400w,
        ${basePath}-800.webp 800w,
        ${basePath}-1200.webp 1200w,
        ${src} 2000w
    `;

    return (
        <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            className={className}
            loading="lazy"
            decoding="async"
            {...props}
        />
    );
};

export default ResponsiveImage;
