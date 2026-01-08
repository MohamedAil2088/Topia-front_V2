import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const NotFoundPage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <Helmet>
                <title>404 - Page Not Found | Topia</title>
                <meta name="description" content="The page you are looking for does not exist." />
            </Helmet>

            <h1 className="text-9xl font-black font-display bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent opacity-20 select-none">
                404
            </h1>

            <div className="-mt-12 mb-8 relative z-10">
                <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 mb-4">
                    Page Not <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Found</span>
                </h2>
                <p className="text-gray-500 text-lg max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    <FiHome /> Go Home
                </Link>
                <Link
                    to="/shop"
                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-xl font-bold hover:border-gray-900 hover:bg-gray-50 transition-all"
                >
                    <FiSearch /> Browse Shop
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
