import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiShoppingBag, FiStar, FiInstagram, FiTrendingUp, FiAward, FiPackage, FiHeart } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import Button from '../components/Button';
import api from '../utils/api';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import SizeGuide from '../components/SizeGuide';
import CustomDesignSection from '../components/CustomDesignSection';
import { getLocalizedName } from '../utils/getLocalizedName';
import { getImageUrl } from '../utils/imageUtils';

const HomePage = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<any[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [bestSellers, setBestSellers] = useState<any[]>([]);
    const [customProducts, setCustomProducts] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [textIndex, setTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentReview, setCurrentReview] = useState(0);

    // Typewriter Effect Variables
    const words = [
        t('home.hero.typingWords.word1'),
        t('home.hero.typingWords.word2'),
        t('home.hero.typingWords.word3')
    ];
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    // Instagram Posts (mock data - يمكن ربطه بـ Instagram API)
    const instagramPosts = [
        { id: 1, image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400", likes: 234 },
        { id: 2, image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400", likes: 189 },
        { id: 3, image: "https://images.unsplash.com/photo-1516257984-b1b4d8c9230c?w=400", likes: 312 },
        { id: 4, image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400", likes: 267 },
        { id: 5, image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400", likes: 198 },
        { id: 6, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400", likes: 245 }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, prodsRes, customRes, reviewsRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/products?limit=8&sort=-createdAt&isCustomizable=false'),
                    api.get('/products?isCustomizable=true&limit=4'),
                    // Use public endpoint instead of protected admin endpoint
                    api.get('/reviews/featured')
                ]);
                setCategories(catsRes.data.data || []);
                setFeaturedProducts(prodsRes.data.data || []);
                setCustomProducts(customRes.data.data || []);

                // Format reviews for display
                const formattedReviews = (reviewsRes.data.data || []).map((review: any) => ({
                    id: review._id,
                    name: review.user?.name || 'Anonymous',
                    rating: review.rating,
                    text: review.comment,
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'User')}&background=random`
                }));

                setReviews(formattedReviews.length > 0 ? formattedReviews : [
                    {
                        id: 1,
                        name: "Valued Customer",
                        rating: 5,
                        text: "Amazing quality! The fabric is premium and the fit is perfect. Highly recommended!",
                        image: "https://ui-avatars.com/api/?name=Customer&background=random"
                    }
                ]);

                // محاكاة Best Sellers - في الواقع يمكن جلبها من API
                setBestSellers(prodsRes.data.data?.slice(0, 4) || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching home data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Typewriter Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentWord = words[textIndex % words.length];

            if (isDeleting) {
                setDisplayText(currentWord.substring(0, displayText.length - 1));
            } else {
                setDisplayText(currentWord.substring(0, displayText.length + 1));
            }

            if (!isDeleting && displayText === currentWord) {
                setTimeout(() => setIsDeleting(true), pauseTime);
            } else if (isDeleting && displayText === '') {
                setIsDeleting(false);
                setTextIndex(prev => prev + 1);
            }
        }, isDeleting ? deleteSpeed : typeSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, textIndex]);

    // Auto-rotate reviews
    // Auto-rotate reviews
    useEffect(() => {
        if (reviews.length === 0) return;
        const interval = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [reviews.length]);

    return (
        <div className="bg-white">
            {/* 1. Enhanced Hero Section with Video Background Effect */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600 rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-600 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                    </div>
                </div>

                {/* Background Image with Parallax Effect */}
                <div className="absolute inset-0 z-0 parallax-bg">
                    <img
                        src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Hero Fashion"
                        className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                    />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center text-white">
                    {/* Animated Stats */}
                    <div className="flex justify-center gap-12 mb-8 animate-fade-in">
                        <div className="text-center">
                            <div className="text-3xl font-black text-accent-400">500+</div>
                            <div className="text-xs uppercase tracking-wider text-gray-400">{t('home.stats.products')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-accent-400">10K+</div>
                            <div className="text-xs uppercase tracking-wider text-gray-400">{t('home.stats.customers')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-accent-400">4.9★</div>
                            <div className="text-xs uppercase tracking-wider text-gray-400">{t('home.stats.rating')}</div>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
                        {t('home.hero.discover')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-primary-400 inline-block">
                            {displayText}
                            <span className="animate-blink">|</span>
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        {t('home.hero.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Button
                            to="/shop"
                            size="lg"
                            className="!bg-white !text-black hover:!bg-accent-400 hover:!text-white px-12 py-5 font-black rounded-full shadow-2xl transition-all duration-300 hover:scale-105 uppercase tracking-wider text-sm"
                        >
                            {t('home.hero.shopNow')}
                        </Button>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center border-2 border-white/30 text-white hover:bg-white/10 hover:border-white px-12 py-5 font-black rounded-full transition-all duration-300 uppercase tracking-wider text-sm backdrop-blur-sm"
                        >
                            {t('navbar.contact')}
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Features Banner */}
            <section className="bg-white py-16 border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                <FiTruck size={28} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{t('home.benefits.freeShipping')}</h3>
                            <p className="text-sm text-gray-500">{t('home.benefits.freeShippingDesc')}</p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                <FiAward size={28} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{t('home.benefits.qualityGuarantee')}</h3>
                            <p className="text-sm text-gray-500">{t('home.benefits.qualityGuaranteeDesc')}</p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                <FiShield size={28} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{t('checkout.step2')}</h3>
                            <p className="text-sm text-gray-500">{t('home.benefits.securePaymentDesc')}</p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                <FiRefreshCw size={28} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{t('home.benefits.easyReturns')}</h3>
                            <p className="text-sm text-gray-500">{t('home.benefits.easyReturnsDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Best Sellers Section */}
            <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <FiTrendingUp className="text-red-500" size={32} />
                                <h2 className="text-4xl font-black text-gray-900">{t('home.bestSellers.title')}</h2>
                            </div>
                            <p className="text-gray-600">{t('home.bestSellers.description')}</p>
                        </div>
                        <Link to="/shop" className="hidden md:flex items-center gap-2 text-gray-900 font-bold hover:text-primary-600 transition-colors group">
                            {t('common.viewMore')}
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-12"><Loader /></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {bestSellers.map((product, index) => (
                                <div key={product._id} className="relative">
                                    {index === 0 && (
                                        <div className="absolute -top-3 -right-3 z-10">
                                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs font-black uppercase shadow-lg animate-pulse">
                                                🔥 {t('home.bestSellers.badge')}
                                            </div>
                                        </div>
                                    )}
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Custom Design Section */}
            <CustomDesignSection />

            {/* New Arrivals Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 mb-3">{t('navbar.newArrivals')}</h2>
                            <p className="text-gray-600">{t('home.newArrivals.description')}</p>
                        </div>
                        <Link to="/shop?sort=-createdAt" className="hidden md:flex items-center gap-2 text-gray-900 font-bold hover:text-primary-600 transition-colors group">
                            {t('common.viewMore')} <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-12"><Loader /></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* 3. Testimonials Section */}
            <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="flex justify-center items-center gap-3 mb-4">
                            <FiStar className="text-yellow-400" size={32} />
                            <h2 className="text-4xl font-black">{t('home.testimonials.title')}</h2>
                            <FiStar className="text-yellow-400" size={32} />
                        </div>
                        <p className="text-gray-400 text-lg">{t('home.testimonials.subtitle')}</p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {reviews.map((review, index) => (
                                <div
                                    key={review.id}
                                    className={`transition-all duration-500 ${index === currentReview ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0'
                                        }`}
                                >
                                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
                                        <div className="flex justify-center mb-6">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <FiStar key={i} className="text-yellow-400 fill-yellow-400" size={24} />
                                            ))}
                                        </div>
                                        <p className="text-2xl text-center mb-8 leading-relaxed italic">"{review.text}"</p>
                                        <div className="flex items-center justify-center gap-4">
                                            <img src={review.image} alt={review.name} className="w-16 h-16 rounded-full border-4 border-white/20" />
                                            <div>
                                                <p className="font-bold text-lg">{review.name}</p>
                                                <p className="text-gray-400 text-sm">{t('home.testimonials.verifiedCustomer')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Review Navigation Dots */}
                        <div className="flex justify-center gap-3 mt-8">
                            {reviews.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentReview(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentReview ? 'bg-white w-8' : 'bg-white/30'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Shop by Category */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">{t('home.categories.title')}</h2>
                        <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full"></div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center"><Loader size="lg" /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {categories.map((cat) => (
                                <Link
                                    to={`/shop?category=${cat._id}`}
                                    key={cat._id}
                                    className="group relative h-96 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/60 transition-all z-10" />
                                    <img
                                        src={getImageUrl(cat.image) || "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800"}
                                        alt={getLocalizedName(cat.name)}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 z-20">
                                        <h3 className="text-4xl font-black text-white mb-4 tracking-tight group-hover:-translate-y-2 transition-transform duration-300">
                                            {getLocalizedName(cat.name)}
                                        </h3>
                                        <span className="px-8 py-3 bg-white text-gray-900 rounded-full text-sm font-black opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                                            {t('home.categories.exploreCollection')} →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Instagram Feed */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FiInstagram className="text-pink-500" size={36} />
                            <h2 className="text-4xl font-black text-gray-900">{t('home.instagram.title')}</h2>
                        </div>
                        <p className="text-gray-600 text-lg">{t('home.instagram.handle')}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {instagramPosts.map(post => (
                            <div key={post.id} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
                                <img
                                    src={post.image}
                                    alt="Instagram post"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <div className="flex items-center gap-2 text-white">
                                        <FiHeart className="fill-white" />
                                        <span className="font-bold">{post.likes}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <a
                            href="https://instagram.com/topia.menswear"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black rounded-full hover:shadow-xl transition-all hover:scale-105"
                        >
                            <FiInstagram size={24} />
                            {t('home.instagram.followButton')}
                        </a>
                    </div>
                </div>
            </section>

            {/* 6. Parallax Banner - Our Story */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-fixed" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920)', backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
                <div className="container mx-auto px-6 relative z-10 text-white max-w-4xl">
                    <div className="text-center">
                        <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">{t('home.ourStory.title')}</h2>
                        <div className="w-24 h-1 bg-accent-500 mx-auto mb-8"></div>
                        <p className="text-xl leading-relaxed mb-8 text-gray-200">
                            {t('home.ourStory.description')}
                        </p>
                        <p className="text-lg text-gray-300 mb-10">
                            {t('home.ourStory.mission')}
                        </p>
                        <Button to="/about" className="bg-white !text-black hover:!bg-accent-500 hover:!text-white px-10 py-4 font-black rounded-full">
                            {t('home.ourStory.discoverMore')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* 7. Featured Benefits - Enhanced */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">{t('home.benefits.title')}</h2>
                        <p className="text-gray-600 text-lg">{t('home.whyChoose.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: '✓', title: t('home.whyChoose.quality.title'), desc: t('home.whyChoose.quality.desc'), color: 'from-blue-500 to-blue-600' },
                            { icon: '⚡', title: t('home.whyChoose.shipping.title'), desc: t('home.whyChoose.shipping.desc'), color: 'from-yellow-500 to-orange-600' },
                            { icon: '↻', title: t('home.whyChoose.returns.title'), desc: t('home.whyChoose.returns.desc'), color: 'from-green-500 to-green-600' },
                            { icon: '24/7', title: t('home.whyChoose.support.title'), desc: t('home.whyChoose.support.desc'), color: 'from-purple-500 to-purple-600' }
                        ].map((benefit, index) => (
                            <div key={index} className="group text-center p-8 rounded-3xl border-2 border-gray-100 hover:border-primary-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${benefit.color} text-white flex items-center justify-center text-3xl font-black mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-3">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. Trending Now */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                                    <FiTrendingUp className="text-white" size={24} />
                                </div>
                                <h2 className="text-4xl font-black text-gray-900">{t('home.trending.title')}</h2>
                            </div>
                            <p className="text-gray-600">{t('home.trending.subtitle')}</p>
                        </div>
                    </div>

                    {/* Masonry Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {loading ? (
                            <div className="col-span-4 flex justify-center p-12"><Loader /></div>
                        ) : (
                            <>
                                {featuredProducts.slice(0, 2).map((product, index) => (
                                    <div key={product._id} className={index === 0 ? 'md:row-span-2 md:col-span-2' : ''}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                                {featuredProducts.slice(2, 6).map((product) => (
                                    <div key={product._id}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* 9. Brand Logos - Marquee Effect */}
            <section className="py-16 bg-gray-900 overflow-hidden">
                <div className="container mx-auto px-6 mb-8">
                    <h3 className="text-center text-white text-sm font-black uppercase tracking-[0.3em] mb-2">{t('home.trustedBy.title')}</h3>
                    <p className="text-center text-gray-400 text-xs">{t('home.trustedBy.subtitle')}</p>
                </div>

                {/* Marquee Container */}
                <div className="relative">
                    <div className="flex animate-marquee space-x-16">
                        {[
                            'NIKE', 'ADIDAS', 'PUMA', 'ZARA', 'H&M', 'GUCCI', 'ARMANI', 'VERSACE',
                            'NIKE', 'ADIDAS', 'PUMA', 'ZARA', 'H&M', 'GUCCI', 'ARMANI', 'VERSACE'
                        ].map((brand, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 text-white/30 hover:text-white transition-colors text-4xl font-black tracking-tighter"
                            >
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 10. Interactive Size Guide */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-black text-gray-900 mb-4">{t('home.sizeGuide.title')}</h2>
                            <p className="text-gray-600 text-lg">{t('home.sizeGuide.subtitle')}</p>
                        </div>

                        <SizeGuide />
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 bg-gradient-to-r from-gray-900 to-black text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-primary-600 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-600 rounded-full filter blur-3xl animate-pulse"></div>
                </div>

                <div className="container mx-auto px-6 max-w-3xl relative z-10">
                    <FiShoppingBag className="mx-auto text-accent-400 mb-6" size={56} />
                    <h2 className="text-4xl md:text-5xl font-black mb-6">{t('home.newsletter.title')}</h2>
                    <p className="text-gray-400 mb-10 text-xl leading-relaxed">
                        {t('home.newsletter.subtitle')}
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                        <input
                            type="email"
                            placeholder={t('home.newsletter.emailPlaceholder')}
                            className="flex-grow px-6 py-4 rounded-full bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 backdrop-blur-sm"
                        />
                        <button className="px-10 py-4 bg-gradient-to-r from-accent-500 to-primary-600 hover:from-accent-600 hover:to-primary-700 text-white font-black rounded-full transition-all hover:shadow-xl hover:scale-105">
                            {t('home.newsletter.subscribe')}
                        </button>
                    </form>
                    <p className="text-gray-500 text-sm mt-6">{t('home.newsletter.privacy')}</p>
                </div>
            </section>
        </div >
    );
};

export default HomePage;
