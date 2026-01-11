import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiRefreshCw, FiCheck, FiMinus, FiPlus, FiMessageSquare, FiTrendingUp, FiShield, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrency } from '../context/CurrencyContext';
import { AppDispatch, RootState } from '../redux/store';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist } from '../redux/slices/wishlistSlice';
import api from '../utils/api';
import Swal from 'sweetalert2';
import RelatedProducts from '../components/RelatedProducts';
import CustomizationSection from '../components/CustomizationSection';
import { getLocalizedName } from '../utils/getLocalizedName';

// Loader Component (Inline fallback if missing)
const Loader = ({ size = 'md' }: { size?: string }) => (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-900 ${size === 'lg' ? 'h-12 w-12' : 'h-8 w-8'}`}></div>
);

const ProductDetailsPage = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Using standard Redux hooks with types as verified in previous steps
    const dispatch = useDispatch<AppDispatch>();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { formatPrice } = useCurrency();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [mainImage, setMainImage] = useState('');

    // Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [salesCount, setSalesCount] = useState(0);

    // Fetch Product Data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                const productData = data.data || data;
                setProduct(productData);
                // Safe image handling
                const img = productData.images && productData.images.length > 0 ? productData.images[0] : (productData.image || '/placeholder-image.jpg');
                setMainImage(img);
                if (productData.sizes && productData.sizes.length > 0) setSelectedSize(productData.sizes[0]);
                if (productData.colors && productData.colors.length > 0) setSelectedColor(productData.colors[0]);

                // Add to Recently Viewed
                addToRecentlyViewed(productData);

                // Mock sales count for urgency
                setSalesCount(Math.floor(Math.random() * 20) + 5);

                setLoading(false);
                setLoading(false);
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data?.message || t('common.error'));
                setLoading(false);
            }
        };
        if (id) fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const addToRecentlyViewed = (p: any) => {
        try {
            const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const filtered = recentlyViewed.filter((item: any) => item._id !== p._id);
            const updated = [p, ...filtered].slice(0, 10); // Keep last 10
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        } catch (e) {
            console.error("Error managing recently viewed", e);
        }
    };

    // Reliable placeholder explicitly defined
    const PLACEHOLDER_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="%23f3f4f6" width="300" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

    const getDeliveryEstimate = () => {
        const now = new Date();
        const hour = now.getHours();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const dayAfter = new Date(now);
        dayAfter.setDate(now.getDate() + 2);

        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };

        if (hour < 14) {
            return `${t('productDetails.tomorrow')}, ${tomorrow.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', options)}`;
        } else {
            return `${t('productDetails.dayAfter')}, ${dayAfter.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', options)}`;
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        dispatch(addToCart({
            _id: product._id,
            name: getLocalizedName(product.name),
            image: product.images && product.images.length > 0 ? product.images[0] : (product.image || '/placeholder-image.jpg'),
            price: product.price || 0,
            stock: product.stock || 0, // Using 'stock' as verified in type definition
            qty,
            size: selectedSize,
            color: selectedColor
        }));

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: 'success',
            title: `${getLocalizedName(product.name)} added to cart`
        });
    };

    const handleAddToWishlist = () => {
        if (product) {
            dispatch(addToWishlist(product._id));
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            });
            Toast.fire({
                icon: 'success',
                title: t('wishlist.addedToWishlist', 'Added to wishlist ❤️')
            });
        }
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            // Check if user is logged in before submitting
            if (!userInfo) {
                Swal.fire({
                    icon: 'warning',
                    title: t('productDetails.loginRequired'),
                    text: t('productDetails.loginToReview'),
                    confirmButtonText: t('productDetails.login')
                }).then((result) => {
                    if (result.isConfirmed) navigate('/login');
                });
                return;
            }

            await api.post(`/products/${id}/reviews`, { rating, comment });
            Swal.fire(t('productDetails.success'), t('productDetails.reviewSubmitted'), 'success');
            setComment('');
            setRating(5);
            // Refresh logic could be added here
        } catch (error: any) {
            Swal.fire({
                icon: 'warning',
                title: t('productDetails.reviewFailed'),
                text: error.response?.data?.message || t('productDetails.reviewFailed'),
                footer: error.response?.status === 403 ? `<a href="/shop">${t('productDetails.continueShopping')}</a>` : undefined
            });
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader size="lg" /></div>;

    if (error) return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4 text-center px-4">
            <h2 className="text-2xl font-bold text-gray-800">{t('productDetails.oops')}</h2>
            <p className="text-red-500">{error}</p>
            <Link to="/shop" className="px-6 py-2 bg-primary-900 text-white rounded-lg hover:bg-black transition">
                {t('productDetails.backToShop')}
            </Link>
        </div>
    );

    if (!product) return null;

    // Helper for image URLs
    const BASE_URL = 'http://localhost:5000';
    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/placeholder')) return url;
        return `${BASE_URL}${url}`;
    };

    return (
        <div className="bg-white dark:bg-[#1a1a1a] min-h-screen pb-20 transition-colors duration-300 pt-20">
            {/* Breadcrumb */}
            <div className="bg-gray-50 dark:bg-[#252525] py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-6 text-sm text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-primary-900 dark:hover:text-white">{t('navbar.home')}</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-primary-900 dark:hover:text-white">{t('navbar.shop')}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 dark:text-white font-medium truncate">{getLocalizedName(product.name)}</span>
                </div>
            </div>

            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image with Zoom Effect */}
                        <div className="relative aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden group">
                            <img
                                src={getImageUrl(mainImage) || PLACEHOLDER_IMG}
                                alt={getLocalizedName(product.name)}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== PLACEHOLDER_IMG) {
                                        target.src = PLACEHOLDER_IMG;
                                    }
                                }}
                            />
                            {product.stock === 0 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="bg-white text-gray-900 px-6 py-3 rounded-full font-black text-lg">
                                        {t('productDetails.outOfStock')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Grid */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {product.images.map((img: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setMainImage(img)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-3 transition-all transform hover:scale-105 ${mainImage === img
                                            ? 'border-primary-900 shadow-lg ring-2 ring-primary-200'
                                            : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={getImageUrl(img)}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            {product.stock > 0 ? (
                                <span className="inline-flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                    <FiCheck className="mr-1" /> {t('productDetails.inStock')}
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                                    {t('productDetails.outOfStock')}
                                </span>
                            )}
                            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                {(() => {
                                    const catName = typeof product.category === 'object' ? product.category?.name : product.category;
                                    return getLocalizedName(catName, 'Men');
                                })()}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold font-display text-primary-900 mb-4">{getLocalizedName(product.name)}</h1>

                        <div className="flex items-center gap-4 mb-3">
                            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price || 0)}</span>
                            <div className="flex items-center gap-1 text-accent-500">
                                <FiStar className="fill-current text-yellow-400" />
                                <span className="text-gray-400 text-sm ml-2 font-medium">({product.rating || 4.8} Reviews)</span>
                            </div>
                        </div>

                        {/* Scarcity/Social Proof Badge */}
                        <div className="flex items-center gap-2 mb-6 animate-pulse">
                            <div className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                                <FiTrendingUp size={14} />
                                {t('productDetails.sellingFast', { count: salesCount })}
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                            {product.description || t('productDetails.descriptionFallback')}
                        </p>

                        {/* Delivery Countdown */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-8 flex items-start gap-4">
                            <div className="bg-green-600 text-white p-2 rounded-lg">
                                <FiTruck size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-green-900">{t('productDetails.expressDelivery')}</p>
                                <p className="text-xs text-green-700">{t('productDetails.arrivesBy')} <span className="underline font-bold text-green-900">{getDeliveryEstimate()}</span></p>
                            </div>
                        </div>

                        {/* Customization Section */}
                        {(product.isCustomizable || product.allowCustomization) && (
                            <CustomizationSection
                                product={product}
                                onAddToCart={(data: any) => {
                                    const customCartItem = {
                                        _id: product._id,
                                        name: getLocalizedName(product.name),
                                        image: product.images[0],
                                        price: data.totalPrice,
                                        qty: 1,
                                        stock: product.stock,
                                        size: selectedSize,
                                        color: selectedColor,
                                        isCustomOrder: true,
                                        customization: data.customization
                                    };

                                    dispatch(addToCart(customCartItem));

                                    Swal.fire({
                                        icon: 'success',
                                        title: t('productDetails.addedToCart'),
                                        text: data.type === 'custom'
                                            ? t('productDetails.customDesignAdded')
                                            : t('productDetails.productAdded'),
                                        confirmButtonText: t('productDetails.goToCart'),
                                        showCancelButton: true,
                                        cancelButtonText: t('productDetails.continueShopping')
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            navigate('/cart');
                                        }
                                    });
                                }}
                            />
                        )}

                        <div className="space-y-8 border-t border-b border-gray-100 py-8 mb-8">
                            {/* Color Selector */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
                                        {t('productDetails.color')}: <span className="text-gray-600 font-bold capitalize">{selectedColor}</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {product.colors.map((color: string) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`group relative w-14 h-14 rounded-2xl border-3 flex items-center justify-center transition-all transform hover:scale-110 ${selectedColor === color
                                                    ? 'border-primary-900 shadow-xl ring-4 ring-primary-100 scale-110'
                                                    : 'border-gray-200 hover:border-gray-400 hover:shadow-lg'
                                                    }`}
                                                title={color}
                                            >
                                                <div
                                                    className="w-11 h-11 rounded-xl"
                                                    style={{ backgroundColor: color.toLowerCase() }}
                                                />
                                                {selectedColor === color && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <FiCheck
                                                            className={`text-2xl ${['white', 'yellow', 'cyan', 'silver'].includes(color.toLowerCase())
                                                                ? 'text-gray-900'
                                                                : 'text-white'
                                                                } drop-shadow-lg`}
                                                        />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selector */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                                            {t('productDetails.size')}: <span className="text-gray-600 font-bold">{selectedSize}</span>
                                        </h3>
                                        <button
                                            onClick={() => setShowSizeGuide(true)}
                                            className="text-xs text-primary-600 underline font-bold hover:text-primary-800 transition-colors"
                                        >
                                            {t('productDetails.sizeGuide')}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((size: string) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`h-14 min-w-[56px] px-5 flex items-center justify-center rounded-2xl border-2 text-sm font-black transition-all transform hover:scale-105
                                                    ${selectedSize === size
                                                        ? 'border-primary-900 bg-primary-900 text-white shadow-xl scale-105 ring-4 ring-primary-100'
                                                        : 'border-gray-200 text-gray-700 hover:border-primary-900 hover:bg-primary-50 hover:shadow-lg'
                                                    }
                                                `}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions - Only show for non-customizable products */}
                        {(!product.isCustomizable && !product.allowCustomization) && (
                            <div className="mb-8">
                                {/* Quantity Label */}
                                <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">
                                    {t('productDetails.quantity')}
                                </h3>

                                {/* Action Buttons Row */}
                                <div className="flex gap-4">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-2xl p-2">
                                        <button
                                            className="w-11 h-11 flex items-center justify-center text-gray-700 hover:text-white hover:bg-primary-900 rounded-xl transition-all active:scale-95 disabled:opacity-30"
                                            onClick={() => qty > 1 && setQty(qty - 1)}
                                            disabled={qty <= 1}
                                        >
                                            <FiMinus size={16} />
                                        </button>
                                        <span className="w-12 text-center font-black text-lg text-gray-900">{qty}</span>
                                        <button
                                            className="w-11 h-11 flex items-center justify-center text-gray-700 hover:text-white hover:bg-primary-900 rounded-xl transition-all active:scale-95"
                                            onClick={() => setQty(qty + 1)}
                                        >
                                            <FiPlus size={16} />
                                        </button>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        className={`flex-1 h-[60px] flex items-center justify-center gap-3 rounded-2xl font-black text-base transition-all transform
                                        ${product.stock > 0
                                                ? 'bg-primary-900 text-white hover:bg-black shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <FiShoppingCart size={22} />
                                        {product.stock > 0 ? t('productDetails.addToCart') : t('productDetails.outOfStock')}
                                    </button>

                                    {/* Wishlist */}
                                    <button
                                        onClick={handleAddToWishlist}
                                        className="h-[60px] w-[60px] flex items-center justify-center rounded-2xl border-3 border-gray-200 text-gray-600 hover:border-red-500 hover:bg-red-50 hover:text-red-500 transition-all transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
                                    >
                                        <FiHeart size={24} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Feature Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-gray-500">
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center text-center gap-2">
                                <FiTruck size={20} className="text-primary-900" />
                                <span>{t('productDetails.freeShipping')}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center text-center gap-2">
                                <FiRefreshCw size={20} className="text-primary-900" />
                                <span>{t('productDetails.freeReturns')}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center text-center gap-2">
                                <FiCheck size={20} className="text-primary-900" />
                                <span>{t('productDetails.secureCheckout')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-20 border-t border-gray-200 pt-16">
                    <h2 className="text-2xl font-bold font-display mb-8">{t('productDetails.customerReviews')}</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Write Review Form */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">{t('productDetails.writeReview')}</h3>
                            {userInfo ? (
                                <form onSubmit={submitReview} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('productDetails.rating')}</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                        >
                                            {[5, 4, 3, 2, 1].map(r => (
                                                <option key={r} value={r}>{r} - {r === 5 ? t('common.excellent') : r === 4 ? t('common.veryGood') : r === 3 ? t('common.good') : r === 2 ? t('common.fair') : t('common.poor')}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('productDetails.comment')}</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none h-32"
                                            placeholder={t('productDetails.shareExperience')}
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="w-full bg-primary-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-colors disabled:opacity-50"
                                    >
                                        {submittingReview ? t('productDetails.submitting') : t('productDetails.submitReview')}
                                    </button>
                                </form>
                            ) : (
                                <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-100">
                                    <FiMessageSquare className="mx-auto text-gray-400 mb-4" size={40} />
                                    <p className="text-gray-600 mb-4">{t('productDetails.loginToReview')}</p>
                                    <Link to="/login" className="text-primary-600 font-bold hover:underline">{t('productDetails.login')}</Link>
                                </div>
                            )}
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-6">
                            {product?.reviews?.length === 0 && (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <p className="text-gray-500">{t('productDetails.noReviews')}</p>
                                </div>
                            )}
                            {product?.reviews?.map((review: any) => (
                                <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                                {review.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900">{review.name}</span>
                                        </div>
                                        <div className="flex text-yellow-400 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar key={i} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                    <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {product && <RelatedProducts productId={product._id} />}

                {/* Recently Viewed */}
                <RecentlyViewed currentId={product._id} />

                {/* Size Guide Modal (Kept as is) */}
                {showSizeGuide && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase">{t('productDetails.sizeGuideTitle')}</h2>
                                    <p className="text-xs text-gray-500">{t('productDetails.sizeGuideSubtitle')}</p>
                                </div>
                                <button onClick={() => setShowSizeGuide(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all">
                                    <FiX size={20} />
                                </button>
                            </div>
                            <div className="p-8">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-primary-900 text-xs font-black uppercase tracking-widest text-primary-900">
                                            <th className="py-4">{t('productDetails.size')}</th>
                                            <th className="py-4">{t('productDetails.chest')}</th>
                                            <th className="py-4">{t('productDetails.waist')}</th>
                                            <th className="py-4">{t('productDetails.length')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-gray-600">
                                        {[
                                            { s: 'S', c: '96-101', w: '81-86', l: '70' },
                                            { s: 'M', c: '101-106', w: '86-91', l: '72' },
                                            { s: 'L', c: '106-111', w: '91-96', l: '74' },
                                            { s: 'XL', c: '111-116', w: '96-101', l: '76' },
                                            { s: 'XXL', c: '116-121', w: '101-106', l: '78' },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 font-bold text-primary-900">{row.s}</td>
                                                <td className="py-4">{row.c}</td>
                                                <td className="py-4">{row.w}</td>
                                                <td className="py-4">{row.l}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mt-8 p-4 bg-primary-50 rounded-xl flex gap-4 items-start">
                                    <FiShield className="text-primary-900 mt-1" size={24} />
                                    <div>
                                        <p className="text-sm font-bold text-primary-900">{t('productDetails.fittingGuarantee')}</p>
                                        <p className="text-xs text-primary-700">{t('productDetails.guaranteeText')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const RecentlyViewed = ({ currentId }: { currentId: string }) => {
    const { t } = useTranslation();
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            setItems(stored.filter((i: any) => i._id !== currentId).slice(0, 4));
        } catch (e) {
            console.error(e);
        }
    }, [currentId]);

    if (items.length === 0) return null;

    return (
        <div className="mt-20">
            <h2 className="text-2xl font-bold font-display mb-8">{t('productDetails.recentlyViewed')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {items.map((item) => (
                    <Link key={item._id} to={`/products/${item._id}`} className="group block">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3 shadow-sm group-hover:shadow-md transition-all">
                            <img src={item.images && item.images[0] ? item.images[0] : '/placeholder-image.jpg'} alt={getLocalizedName(item.name)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 className="text-sm font-bold text-primary-900 group-hover:text-primary-600 truncate">{getLocalizedName(item.name)}</h3>
                        <p className="text-sm text-gray-500">{item.price} EGP</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductDetailsPage;
