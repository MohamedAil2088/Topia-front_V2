import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiPackage, FiClock, FiCheck, FiX, FiEye, FiUser, FiMapPin, FiChevronRight } from 'react-icons/fi';
import api from '../utils/api';
import Loader from '../components/Loader';
import { useAppSelector } from '../hooks/useRedux';
import { getLocalizedName } from '../utils/getLocalizedName';

const MyCustomOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const { userInfo } = useAppSelector((state) => state.auth);

    // SVG Placeholder
    const PLACEHOLDER_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="%23f3f4f6" width="300" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

    // Base URL Helper
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const getDesignUrl = (url: string) => {
        if (!url) return PLACEHOLDER_IMG;
        if (url.startsWith('http')) return url;
        const host = BASE_URL.replace('/api', '');
        return `${host}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            const { data } = await api.get('/custom-orders/my-orders');
            setOrders(data.data || []);
        } catch (error) {
            console.error('Error fetching custom orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            pending: 'bg-yellow-100 text-yellow-800',
            reviewing: 'bg-blue-100 text-blue-800',
            approved: 'bg-green-100 text-green-800',
            'in-design': 'bg-purple-100 text-purple-800',
            printing: 'bg-indigo-100 text-indigo-800',
            completed: 'bg-green-100 text-green-800',
            shipped: 'bg-blue-100 text-blue-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status: string) => {
        if (status === 'delivered' || status === 'completed') return <FiCheck />;
        if (status === 'cancelled') return <FiX />;
        if (status === 'pending' || status === 'reviewing') return <FiClock />;
        return <FiPackage />;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 py-12 pt-40">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black font-display text-primary-900 tracking-tight">
                            ✨ {t('customOrders.title')} <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">{t('customOrders.creations')}</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">{t('customOrders.subtitle')}</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Menu - Synced with Profile */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden sticky top-32">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-900 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-primary-900/20">
                                        {userInfo?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-black text-gray-900 truncate">{userInfo?.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t('orders.verifiedMember')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4">
                                <Link to="/profile" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiUser /> {t('orders.profileOverview')}</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/orders" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiPackage /> {t('navbar.myOrders')}</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                                <Link to="/custom-orders/my-orders" className="flex items-center justify-between px-6 py-4 text-primary-700 bg-primary-50/50 border-r-4 border-primary-900 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><span className="text-purple-600">🎨</span> {t('orders.myCustomOrders')}</span>
                                    <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/history" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiClock /> {t('orders.purchaseHistory')}</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/addresses" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiMapPin /> {t('orders.savedAddresses')}</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-3/4 space-y-6">
                        {orders.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiPackage size={40} className="text-gray-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('customOrders.emptyTitle')}</h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    {t('customOrders.emptyDesc')}
                                </p>
                                <Link
                                    to="/shop"
                                    className="inline-block px-8 py-3 bg-primary-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-primary-900/20"
                                >
                                    {t('customOrders.browseBtn')}
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary-100 transition-all duration-300"
                                    >
                                        <div className="p-8">
                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-200">
                                                            {t('customOrders.customOrder')}
                                                        </span>
                                                        <h3 className="text-lg font-black text-gray-900">
                                                            {t('orders.orderId')} #{order._id.slice(-8).toUpperCase()}
                                                        </h3>
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                        {t('customOrders.placedOn')} {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {t(`customOrders.status.${order.status.toLowerCase().replace(/-([a-z])/g, (g: string) => g[1].toUpperCase()).replace(' ', '')}`).replace('customOrders.status.undefined', order.status)}
                                                </span>
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex gap-6 mb-6">
                                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                    <img
                                                        src={order.product?.images?.[0] || PLACEHOLDER_IMG}
                                                        alt={getLocalizedName(order.product?.name)}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            if (target.src !== PLACEHOLDER_IMG) {
                                                                target.src = PLACEHOLDER_IMG;
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 text-lg mb-1">
                                                        {getLocalizedName(order.product?.name)}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-xs font-bold text-gray-600">
                                                            {t('customOrders.size')}: {order.size}
                                                        </span>
                                                        <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-xs font-bold text-gray-600">
                                                            {t('customOrders.color')}: {order.color}
                                                        </span>
                                                        <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-xs font-bold text-gray-600">
                                                            {t('customOrders.qty')}: {order.quantity}
                                                        </span>
                                                    </div>

                                                    <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                        <span>{t('customOrders.print')}: {order.customization.printLocation}</span>
                                                        <span>•</span>
                                                        <span>{t('customOrders.size')}: {order.customization.printSize}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Design Images */}
                                            {order.customization.designImages.length > 0 && (
                                                <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                                        {t('customOrders.uploadedDesigns')}
                                                    </p>
                                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                                        {order.customization.designImages.map((img: any, index: number) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={getDesignUrl(img.url)}
                                                                    alt={`Design ${index + 1}`}
                                                                    className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm bg-white"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        if (target.src !== PLACEHOLDER_IMG) {
                                                                            target.src = PLACEHOLDER_IMG;
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Pricing & Actions */}
                                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-6 pt-6 border-t border-gray-50">
                                                <div className="text-left">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('customOrders.totalInvestment')}</p>
                                                    <p className="text-2xl font-black text-primary-900">
                                                        {order.pricing.totalPrice} <span className="text-sm font-bold text-gray-400">EGP</span>
                                                    </p>
                                                </div>

                                                <div className="flex gap-3 w-full md:w-auto">
                                                    {['pending', 'reviewing'].includes(order.status) && (
                                                        <button
                                                            className="flex-1 md:flex-none px-6 py-3 border border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 hover:border-red-300 transition-all text-sm"
                                                        >
                                                            {t('customOrders.cancelOrder')}
                                                        </button>
                                                    )}
                                                    <Link
                                                        to={`/custom-orders/${order._id}`}
                                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary-900 text-white rounded-xl font-bold hover:bg-black transition-all text-sm shadow-lg shadow-primary-900/20"
                                                    >
                                                        <FiEye />
                                                        {t('customOrders.orderDetails')}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCustomOrdersPage;
