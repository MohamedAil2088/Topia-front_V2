import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import { FiFilter, FiSearch, FiX, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import api from '../utils/api';
import { useSearchParams } from 'react-router-dom';

const ShopPage = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const { products, loading, error, pages } = useAppSelector((state) => state.products);
    const [searchParams] = useSearchParams();

    const [keyword, setKeyword] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Accordion State
    const [expanded, setExpanded] = useState({
        categories: true,
        price: true,
        sort: true
    });

    const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || '');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                console.log('📋 Categories from API:', data.data);
                console.log('📋 First category structure:', data.data[0]);
                setCategories(data.data || []);
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const sortFromURL = searchParams.get('sort');
        const searchFromURL = searchParams.get('search');
        if (sortFromURL !== sortBy) setSortBy(sortFromURL || '');
        if (searchFromURL && searchFromURL !== keyword) {
            setKeyword(searchFromURL);
            setSearchTerm(searchFromURL);
        }
    }, [searchParams]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setKeyword(searchTerm);
            setCurrentPage(1); // Reset page on search
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, priceRange, sortBy]);

    useEffect(() => {
        const params: any = {
            keyword,
            page: currentPage,
            sort: sortBy,
            minPrice: priceRange.min,
            maxPrice: priceRange.max
        };

        if (selectedCategory && selectedCategory.trim() !== '') {
            params.category = selectedCategory;
        }

        dispatch(fetchProducts(params));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [dispatch, keyword, currentPage, sortBy, selectedCategory, priceRange]);

    const toggleSection = (section: keyof typeof expanded) => {
        setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const clearFilter = (type: string) => {
        if (type === 'category') setSelectedCategory('');
        if (type === 'price') setPriceRange({ min: 0, max: 10000 });
        if (type === 'sort') setSortBy('');
        if (type === 'search') {
            setKeyword('');
            setSearchTerm('');
        }
    };

    const resetAll = () => {
        setKeyword('');
        setSearchTerm('');
        setSelectedCategory('');
        setPriceRange({ min: 0, max: 10000 });
        setSortBy('');
        setCurrentPage(1);
    };

    const hasActiveFilters = selectedCategory || priceRange.max < 10000 || sortBy || keyword;

    return (
        <div className="bg-gray-50 dark:bg-[#1a1a1a] min-h-screen transition-colors duration-300">
            <div className="bg-white dark:bg-[#252525] border-b border-gray-200 dark:border-gray-800 py-12 pt-32 transition-colors duration-300">
                <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 text-center">
                    <h1 className="text-5xl font-black font-display text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">
                        🛍️ <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">{t('shop.title')}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">{t('shop.subtitle')}</p>
                </div>
            </div>

            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Mobile Filter Overlay */}
                    {showFilters && (
                        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setShowFilters(false)}></div>
                    )}

                    {/* Filter Sidebar (Drawer style on mobile) */}
                    <aside className={`
                        fixed top-0 left-0 bottom-0 z-50 w-80 bg-white dark:bg-[#252525] p-6 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none lg:p-0 lg:w-80 lg:bg-transparent lg:z-0
                        ${showFilters ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <div className="h-full overflow-y-auto lg:h-auto lg:overflow-visible">
                            <div className="bg-white dark:bg-[#252525] border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm lg:sticky lg:top-32">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-black text-gray-900 dark:text-white text-xl uppercase tracking-widest flex items-center gap-2">
                                        <FiFilter /> {t('shop.filters')}
                                    </h3>
                                    <button onClick={() => setShowFilters(false)} className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <FiX size={24} className="text-gray-500" />
                                    </button>
                                </div>

                                {/* Quick Stats */}
                                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('shop.showing')}</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">{products.length} {t('shop.products')}</p>
                                </div>

                                {/* Categories Accordion */}
                                <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
                                    <button
                                        onClick={() => toggleSection('categories')}
                                        className="w-full flex justify-between items-center group"
                                    >
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-widest flex items-center gap-3 transition-colors">
                                            {t('shop.category')}
                                        </h4>
                                        {expanded.categories ? <FiChevronUp /> : <FiChevronDown />}
                                    </button>

                                    {expanded.categories && (
                                        <div className="mt-6 space-y-3 animate-fade-in">
                                            {['', ...categories.map(c => c._id)].map((catId, idx) => {
                                                const category = categories.find(c => c._id === catId);
                                                let catName;

                                                if (catId === '') {
                                                    catName = t('shop.allCollection', 'All Collection');
                                                } else if (category) {
                                                    const currentLang = i18n.language;
                                                    console.log('🌐 Lang:', currentLang, 'Category name obj:', category.name);

                                                    if (typeof category.name === 'object' && category.name !== null) {
                                                        catName = category.name[currentLang] || category.name.en || category.name.ar || 'Unknown';
                                                    } else {
                                                        catName = String(category.name);
                                                    }
                                                }
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedCategory(catId)}
                                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border ${selectedCategory === catId
                                                            ? 'bg-gray-900 text-white border-gray-900 shadow-lg translate-x-2'
                                                            : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'}`}
                                                    >
                                                        {catName}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Price Range Accordion */}
                                <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
                                    <button
                                        onClick={() => toggleSection('price')}
                                        className="w-full flex justify-between items-center group"
                                    >
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-widest flex items-center gap-3 transition-colors">
                                            {t('shop.priceRange')}
                                        </h4>
                                        {expanded.price ? <FiChevronUp /> : <FiChevronDown />}
                                    </button>

                                    {expanded.price && (
                                        <div className="mt-6 space-y-6 animate-fade-in">
                                            <input
                                                type="range"
                                                min="0"
                                                max="10000"
                                                step="100"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-900"
                                            />
                                            <div className="flex justify-between items-center text-sm font-bold">
                                                <span className="text-gray-400">0</span>
                                                <span className="bg-gray-900 text-white px-3 py-1 rounded-lg">{priceRange.max} EGP</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sorting Accordion */}
                                <div className="mb-8">
                                    <button
                                        onClick={() => toggleSection('sort')}
                                        className="w-full flex justify-between items-center group"
                                    >
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-widest flex items-center gap-3 transition-colors">
                                            {t('shop.sortBy')}
                                        </h4>
                                        {expanded.sort ? <FiChevronUp /> : <FiChevronDown />}
                                    </button>

                                    {expanded.sort && (
                                        <div className="mt-6 animate-fade-in relative">
                                            <button
                                                onClick={() => setIsSortOpen(!isSortOpen)}
                                                className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-4 rounded-xl text-sm font-bold flex justify-between items-center transition-all hover:border-gray-400"
                                            >
                                                <span className="flex items-center gap-2">
                                                    {sortBy === '' && t('shop.sortOptions.relevance')}
                                                    {sortBy === '-createdAt' && t('shop.sortOptions.newest')}
                                                    {sortBy === 'priceAsc' && t('shop.sortOptions.priceLowHigh')}
                                                    {sortBy === 'priceDesc' && t('shop.sortOptions.priceHighLow')}
                                                </span>
                                                <FiChevronDown className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isSortOpen && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden animate-scale-up">
                                                    {[
                                                        { label: t('shop.sortOptions.relevance'), value: '', icon: '✨' },
                                                        { label: t('shop.sortOptions.newest'), value: '-createdAt', icon: '🔥' },
                                                        { label: t('shop.sortOptions.priceLowHigh'), value: 'priceAsc', icon: '💰' },
                                                        { label: t('shop.sortOptions.priceHighLow'), value: 'priceDesc', icon: '💎' },
                                                    ].map((option) => (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => {
                                                                setSortBy(option.value);
                                                                setIsSortOpen(false);
                                                            }}
                                                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all text-left
                                                            ${sortBy === option.value
                                                                    ? 'bg-gray-50 text-primary-900 dark:bg-gray-800 dark:text-white'
                                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                                                                }`}
                                                        >
                                                            <span>{option.icon}</span>
                                                            {option.label}
                                                            {sortBy === option.value && <FiCheck className="ml-auto text-primary-600" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={resetAll}
                                    className="w-full py-4 text-xs font-black uppercase tracking-widest text-gray-400 bg-gray-50 border border-transparent rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                                >
                                    {t('shop.clearFilters')}
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-grow">
                        {/* Mobile Filter Toggle & Search */}
                        <div className="flex flex-col md:flex-row gap-6 mb-10 items-center">
                            <button
                                onClick={() => setShowFilters(true)}
                                className="flex lg:hidden items-center justify-center gap-2 h-14 w-full md:w-auto bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl px-8 font-bold dark:text-white shadow-sm hover:shadow-md transition-all"
                            >
                                <FiFilter /> {t('shop.filters')}
                            </button>
                            <div className="relative h-14 w-full">
                                <input
                                    type="text"
                                    placeholder={t('shop.searchPlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-full bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-2xl pl-14 pr-6 font-medium dark:text-white outline-none focus:ring-2 focus:ring-gray-900 shadow-sm transition-all hover:shadow-md"
                                />
                                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                            </div>
                        </div>

                        {/* Active Filter Chips */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-3 mb-10 animate-fade-in p-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">{t('shop.activeFilters')}:</span>
                                {selectedCategory && (() => {
                                    const category = categories.find(c => c._id === selectedCategory);
                                    const catName = category
                                        ? (typeof category.name === 'object' && category.name !== null
                                            ? (category.name[i18n.language] || category.name.en || category.name.ar)
                                            : String(category.name))
                                        : t('shop.category');

                                    return (
                                        <div className="flex items-center gap-2 pl-4 pr-3 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20">
                                            <span>{catName}</span>
                                            <button onClick={() => clearFilter('category')} className="hover:text-gray-300 p-1"><FiX size={16} /></button>
                                        </div>
                                    );
                                })()}
                                {priceRange.max < 10000 && (
                                    <div className="flex items-center gap-2 pl-4 pr-3 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-bold shadow-sm">
                                        <span>max: {priceRange.max} EGP</span>
                                        <button onClick={() => clearFilter('price')} className="hover:text-red-500 p-1"><FiX size={16} /></button>
                                    </div>
                                )}
                                {sortBy && (
                                    <div className="flex items-center gap-2 pl-4 pr-3 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-bold shadow-sm">
                                        <span>{t('shop.sorted')}</span>
                                        <button onClick={() => clearFilter('sort')} className="hover:text-red-500 p-1"><FiX size={16} /></button>
                                    </div>
                                )}
                                {keyword && (
                                    <div className="flex items-center gap-2 pl-4 pr-3 py-2 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl text-sm font-bold shadow-sm">
                                        <span>"{keyword}"</span>
                                        <button onClick={() => clearFilter('search')} className="hover:text-purple-900 p-1"><FiX size={16} /></button>
                                    </div>
                                )}
                                <button
                                    onClick={resetAll}
                                    className="ml-auto text-xs font-black text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-all uppercase tracking-widest"
                                >
                                    {t('shop.clearFilters')}
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                                {[...Array(6)].map((_, index) => <ProductSkeleton key={index} />)}
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 p-16 rounded-[2.5rem] text-center border border-red-100 max-w-2xl mx-auto">
                                <p className="text-red-600 font-bold text-lg">{error}</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mb-16 animate-fade-in">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {products.length === 0 && (
                                    <div className="text-center py-32 bg-white dark:bg-[#252525] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <FiSearch size={32} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t('shop.noMatches')}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                                            {t('shop.noMatchesText')}
                                        </p>
                                        <button
                                            onClick={resetAll}
                                            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-900/20 transform hover:-translate-y-1"
                                        >
                                            {t('shop.resetFilters')}
                                        </button>
                                    </div>
                                )}

                                {/* Pagination */}
                                {pages > 1 && (
                                    <div className="flex justify-center items-center gap-4 py-8">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <FiChevronLeft className="text-gray-600" size={24} />
                                        </button>

                                        <span className="text-sm font-bold text-gray-500">
                                            {t('shop.page')} <span className="text-gray-900 text-lg">{currentPage}</span> {t('shop.of')} {pages}
                                        </span>

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pages))}
                                            disabled={currentPage === pages}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <FiChevronRight className="text-gray-600" size={24} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
