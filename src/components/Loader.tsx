import React from 'react';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'white';
    className?: string;
    fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
    size = 'md',
    color = 'primary',
    className = '',
    fullScreen = false
}) => {
    const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    const colors = {
        primary: 'border-primary-600 border-t-transparent',
        white: 'border-white border-t-transparent',
    };

    const spinner = (
        <div
            className={`
        rounded-full animate-spin
        ${sizes[size]}
        ${colors[color]}
        ${className}
      `}
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default Loader;
