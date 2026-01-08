import React, { type ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface MainLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    title = "Topia Men's Fashion | Premium Quality & Style",
    description = "Shop the latest in premium men's fashion at Topia. Best quality shirts, pants, and accessories in Egypt."
}) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password';

    return (
        <div className="flex flex-col min-h-screen">
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>

            {!isAuthPage && <Navbar />}
            <main className="flex-grow bg-gray-50 dark:bg-[#1a1a1a] transition-colors duration-300">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
            {!isAuthPage && <Footer />}
        </div>
    );
};

export default MainLayout;
