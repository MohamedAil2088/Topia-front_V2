import React from 'react';

interface PageHeaderProps {
    title: string;
    highlightedWord?: string; // The word to apply gradient to
    subtitle?: string;
    icon?: string; // Emoji icon
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, highlightedWord, subtitle, icon }) => {
    // Split title to apply gradient to highlighted word
    const renderTitle = () => {
        if (!highlightedWord) {
            return <span>{title}</span>;
        }

        const parts = title.split(highlightedWord);
        return (
            <>
                {parts[0]}
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    {highlightedWord}
                </span>
                {parts[1]}
            </>
        );
    };

    return (
        <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-gray-900 mb-4">
                {icon && <span className="mr-3">{icon}</span>}
                {renderTitle()}
            </h1>
            {subtitle && (
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default PageHeader;
