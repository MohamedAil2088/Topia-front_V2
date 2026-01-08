import { useEffect, useState, useRef } from 'react';
import { FiCheckCircle, FiUsers, FiAward, FiGlobe, FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Counter = ({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (countRef.current) observer.observe(countRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isVisible, end, duration]);

    return <span ref={countRef}>{count}{suffix}</span>;
};

const AboutPage = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-[#1a1a1a] transition-colors duration-300 pt-24">
            {/* Hero Section with Parallax Effect */}
            <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-fade-in-up">
                    <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                        {t('about.hero.since')}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black font-display text-white mb-8 leading-tight">
                        <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">{t('about.hero.title')}</span><br />
                        {t('about.hero.subtitle')}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto mb-10 leading-relaxed">
                        {t('about.hero.description')}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/shop" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg">
                            {t('about.hero.exploreButton')}
                        </Link>
                        <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all backdrop-blur-sm">
                            {t('about.hero.journeyButton')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Our Story Section - Asymmetrical Layout */}
            <div className="py-24 px-6 max-w-[1400px] mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 order-2 lg:order-1 animate-slide-in-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-400 font-bold rounded-full text-sm uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></span>
                            {t('about.story.badge')}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black font-display text-gray-900 dark:text-white leading-tight">
                            {t('about.story.title1')} <br />
                            <span className="italic font-serif text-primary-900 dark:text-gray-400">{t('about.story.title2')}</span>
                        </h2>
                        <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>
                                {t('about.story.paragraph1')}
                            </p>
                            <p>
                                {t('about.story.paragraph2')}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-8">
                            <div>
                                <h5 className="font-bold text-gray-900 dark:text-white text-xl mb-1">{t('about.story.authenticity')}</h5>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('about.story.authenticityDesc')}</p>
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-900 dark:text-white text-xl mb-1">{t('about.story.craftsmanship')}</h5>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('about.story.craftsmanshipDesc')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative order-1 lg:order-2 group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary-200 to-gray-200 dark:from-primary-900/40 dark:to-gray-800 rounded-[2.5rem] transform rotate-3 transition-transform duration-500 group-hover:rotate-1"></div>
                        <img
                            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80"
                            alt="Topia Workshop"
                            className="relative rounded-[2rem] shadow-2xl w-full h-[600px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="absolute bottom-8 left-8 right-8 bg-white/90 dark:bg-black/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
                            <p className="font-serif italic text-gray-800 dark:text-gray-200 text-lg">{t('about.story.quote')}</p>
                            <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">{t('about.story.quoteAuthor')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated Stats Section */}
            <div className="bg-gray-900 dark:bg-black text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
                    <div className="p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <div className="text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3 group-hover:scale-110 transition-transform">
                            <Counter end={15} suffix="k+" />
                        </div>
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">{t('about.stats.customers')}</p>
                    </div>
                    <div className="p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <div className="text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3 group-hover:scale-110 transition-transform">
                            <Counter end={450} suffix="+" />
                        </div>
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">{t('about.stats.designs')}</p>
                    </div>
                    <div className="p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <div className="text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3 group-hover:scale-110 transition-transform">
                            <Counter end={24} suffix="/7" />
                        </div>
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">{t('about.stats.support')}</p>
                    </div>
                    <div className="p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <div className="text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3 group-hover:scale-110 transition-transform">
                            <Counter end={98} suffix="%" />
                        </div>
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">{t('about.stats.satisfaction')}</p>
                    </div>
                </div>
            </div>

            {/* Core Values Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-primary-600 font-bold tracking-widest uppercase text-xs mb-3 block">{t('about.values.badge')}</span>
                    <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 dark:text-white">{t('about.values.title')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <FiAward size={32} />,
                            title: t('about.values.quality.title'),
                            desc: t('about.values.quality.desc')
                        },
                        {
                            icon: <FiUsers size={32} />,
                            title: t('about.values.customerFirst.title'),
                            desc: t('about.values.customerFirst.desc')
                        },
                        {
                            icon: <FiGlobe size={32} />,
                            title: t('about.values.greener.title'),
                            desc: t('about.values.greener.desc')
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="group p-10 bg-white dark:bg-[#252525] border border-gray-100 dark:border-gray-800 rounded-[2rem] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>

                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 -skew-y-3 transform origin-left scale-110 z-0"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 dark:text-white mb-6">{t('about.cta.title')}</h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                        {t('about.cta.description')}
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-black text-lg hover:shadow-2xl hover:gap-5 transition-all"
                    >
                        {t('about.cta.button')} <FiArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
