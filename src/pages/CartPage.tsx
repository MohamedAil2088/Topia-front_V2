import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import Button from '../components/Button';
import { FiTrash2, FiArrowLeft, FiTag, FiCheckCircle, FiXCircle, FiTruck, FiLock } from 'react-icons/fi';
import { useCurrency } from '../context/CurrencyContext';
import api from '../utils/api';
import Swal from 'sweetalert2';
import { getLocalizedName } from '../utils/getLocalizedName';
import { getImageUrl } from '../utils/imageUtils';

const CartPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    const { items, totalItems, totalPrice } = useAppSelector((state: any) => state.cart);
    const { userInfo } = useAppSelector((state: any) => state.auth);

    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponData, setCouponData] = useState<any>(null);
    const [freeShippingThreshold, setFreeShippingThreshold] = useState(5000); // Default fallback

    useEffect(() => {
        // Fetch dynamic free shipping threshold
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings/freeShippingThreshold');
                if (data.value) {
                    setFreeShippingThreshold(Number(data.value));
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    // Free Shipping Progress Logic
    const progress = Math.min((totalPrice / freeShippingThreshold) * 100, 100);
    const remainingForFreeShipping = freeShippingThreshold - totalPrice;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        try {
            const { data } = await api.post('/coupons/validate', { code: couponCode });
            setCouponData({
                code: couponCode.toUpperCase(),
                discount: data.data.discount
            });
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
            })
            Toast.fire({
                icon: 'success',
                title: t('cart.couponSuccess')
            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: t('cart.invalidCoupon'),
                text: error.response?.data?.message || t('cart.invalidCouponText'),
                confirmButtonColor: '#000'
            });
            setCouponData(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponData(null);
        setCouponCode('');
    };

    const handleCheckout = () => {
        if (!userInfo) {
            Swal.fire({
                icon: 'info',
                title: t('cart.signInRequired'),
                text: t('cart.signInText'),
                confirmButtonText: t('cart.signInButton'),
                confirmButtonColor: '#000',
                showCancelButton: true,
                cancelButtonText: t('cart.cancel')
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login?redirect=/checkout', { state: { coupon: couponData } });
                }
            });
        } else {
            navigate('/checkout', { state: { coupon: couponData } });
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 pt-32 animate-fade-in bg-white dark:bg-[#1a1a1a] transition-colors duration-300">
                <div className="w-40 h-40 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-8 relative">
                    <FiTag className="text-gray-300 dark:text-gray-600 text-7xl" />
                    <div className="absolute top-0 right-0 p-3 bg-red-100 rounded-full animate-bounce">
                        <span className="text-2xl">🛍️</span>
                    </div>
                </div>
                <h2 className="text-4xl font-black font-display text-gray-900 dark:text-white mb-4 tracking-tight">{t('cart.empty')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm text-center font-medium leading-relaxed">
                    {t('cart.continueShopping')}
                </p>
                <Button to="/shop" size="lg" className="rounded-full px-12 h-14 shadow-xl shadow-gray-900/20 dark:shadow-none hover:transform hover:scale-105 transition-all text-sm uppercase tracking-widest font-bold">
                    {t('cart.continueShopping')}
                </Button>
            </div>
        );
    }

    const discountAmount = couponData ? (totalPrice * couponData.discount) / 100 : 0;
    const shippingPrice = totalPrice > freeShippingThreshold ? 0 : 100;
    const taxPrice = Number((totalPrice * 0.14).toFixed(2));
    const finalTotal = totalPrice + shippingPrice + taxPrice - discountAmount;

    return (
        <div className="bg-gray-50 dark:bg-[#1a1a1a] min-h-screen pt-32 pb-24 transition-colors duration-300">
            <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
                <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black font-display text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                            🛒 {t('cart.title')}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">{totalItems} {t('cart.item')}</p>
                    </div>
                    <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <FiArrowLeft /> {t('cart.continueShopping')}
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Cart Items Area */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Free Shipping Progress */}
                        <div className="bg-white dark:bg-[#252525] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm mb-8 animate-fade-in-up">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${remainingForFreeShipping <= 0 ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                    <FiTruck size={20} />
                                </div>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                    {remainingForFreeShipping > 0
                                        ? <span>{t('cart.freeShipping.add')} <span className="text-gray-900 dark:text-white text-lg">{formatPrice(remainingForFreeShipping)}</span> {t('cart.freeShipping.more')} <span className="text-green-600 uppercase tracking-wider">{t('cart.freeShipping.freeShipping')}</span></span>
                                        : <span className="text-green-600">{t('cart.freeShipping.unlocked')} <span className="uppercase tracking-wider">{t('cart.freeShipping.freeShipping')}</span>! {t('cart.freeShipping.celebrate')}</span>
                                    }
                                </p>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out rounded-full ${remainingForFreeShipping <= 0 ? 'bg-green-500' : 'bg-gray-900 dark:bg-white'}`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-4">
                            {items.map((item: any) => (
                                <div key={`${item._id}-${item.size}-${item.color}`} className="group relative bg-white dark:bg-[#252525] p-4 sm:p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Image */}
                                        <Link to={`/product/${item._id}`} className="block w-full sm:w-40 h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={getLocalizedName(item.name)}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </Link>

                                        {/* Content */}
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {item.isCustomOrder && (
                                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded-md">{t('cart.custom')}</span>
                                                        )}
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                            {(() => {
                                                                const catName = typeof item.category === 'object' ? item.category?.name : item.category;
                                                                return getLocalizedName(catName, 'Collection');
                                                            })()}
                                                        </span>
                                                    </div>
                                                    <Link to={`/product/${item._id}`} className="block text-xl font-black text-gray-900 dark:text-white mb-3 hover:underline decoration-2 underline-offset-4">
                                                        {getLocalizedName(item.name)}
                                                    </Link>

                                                    {/* Attributes */}
                                                    <div className="flex flex-wrap gap-3">
                                                        <div className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 flex items-center gap-2 uppercase tracking-wide">
                                                            <span>{t('product.size')}:</span> {item.size || 'N/A'}
                                                        </div>
                                                        {item.color && (
                                                            <div className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 flex items-center gap-2 uppercase tracking-wide">
                                                                <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: typeof item.color === 'string' ? item.color.toLowerCase() : 'gray' }}></span>
                                                                {item.color}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => dispatch(removeFromCart({ _id: item._id, size: item.size, color: item.color }))}
                                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                                                    title={t('cart.remove')}
                                                >
                                                    <FiTrash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-6">
                                                {/* Quantity Control */}
                                                <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-1 border border-gray-100 dark:border-gray-700">
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ _id: item._id, size: item.size, color: item.color, qty: Math.max(1, item.qty - 1) }))}
                                                        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-[#252525] rounded-lg shadow-sm text-gray-600 dark:text-gray-300 hover:scale-105 active:scale-95 transition-all text-lg font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-10 text-center font-bold text-gray-900 dark:text-white">{item.qty}</span>
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ _id: item._id, size: item.size, color: item.color, qty: item.qty + 1 }))}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all text-lg font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <p className="text-xl font-black text-gray-900 dark:text-white">
                                                    {formatPrice(item.price * item.qty)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar / Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-6">
                        {/* Order Summary Card */}
                        <div className="bg-white dark:bg-[#252525] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase italic tracking-tighter">{t('checkout.orderSummary')}</h3>

                            {/* Coupon Input */}
                            <div className="mb-8">
                                {!couponData ? (
                                    <div className="flex gap-2">
                                        <div className="relative flex-grow">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder={t('cart.couponCode')}
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-gray-900 dark:focus:border-white rounded-xl py-3 pl-4 pr-4 text-sm font-bold uppercase tracking-widest placeholder:text-gray-400 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleApplyCoupon}
                                            isLoading={couponLoading}
                                            className="rounded-xl px-4 bg-black dark:bg-white text-white dark:text-black hover:opacity-80"
                                        >
                                            {t('cart.apply')}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl animate-fade-in">
                                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                            <FiCheckCircle size={16} />
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider">{couponData.code}</p>
                                                <p className="text-[10px] font-bold">-{couponData.discount}% Off</p>
                                            </div>
                                        </div>
                                        <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 p-1">
                                            <FiXCircle size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
                                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <span>{t('cart.subtotal')}</span>
                                    <span className="text-gray-900 dark:text-white font-bold">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <span>{t('cart.shipping')}</span>
                                    <span className={`${shippingPrice === 0 ? 'text-green-600 font-bold' : 'text-gray-900 dark:text-white font-bold'}`}>
                                        {shippingPrice === 0 ? t('checkout.free') : formatPrice(shippingPrice)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <span>{t('cart.tax')} (14%)</span>
                                    <span className="text-gray-900 dark:text-white font-bold">{formatPrice(taxPrice)}</span>
                                </div>
                                {couponData && (
                                    <div className="flex justify-between text-sm font-bold text-green-600">
                                        <span>{t('cart.discount')}</span>
                                        <span>-{formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Final Total */}
                            <div className="flex justify-between items-end mb-8">
                                <span className="text-sm font-black uppercase tracking-widest text-gray-400">{t('cart.total')}</span>
                                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                                    {formatPrice(finalTotal)}
                                </span>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                fullWidth
                                size="lg"
                                className="group h-14 rounded-xl shadow-lg shadow-gray-900/10 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all text-sm font-black uppercase tracking-widest bg-gray-900 dark:bg-white text-white dark:text-black"
                            >
                                <span className="flex items-center gap-2">
                                    <FiLock size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-white dark:group-hover:text-black transition-colors" /> {t('cart.proceedToCheckout')}
                                </span>
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-[#252525] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                <span className="text-2xl mb-1 block">🔒</span>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('cart.securePayment')}</p>
                            </div>
                            <div className="bg-white dark:bg-[#252525] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                <span className="text-2xl mb-1 block">↩️</span>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('cart.easyReturns')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
