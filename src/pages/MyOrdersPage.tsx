import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import Loader from '../components/Loader';
import { FiPackage, FiUser, FiMapPin, FiArrowRight, FiClock, FiCheckCircle, FiTruck, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import { getMyOrders } from '../redux/slices/orderSlice';
import { getImageUrl } from '../utils/imageUtils';

const MyOrdersPage = () => {
    const { t } = useTranslation();
    const { userInfo } = useAppSelector((state) => state.auth);
    const { orders, loading, error, pages, total } = useAppSelector((state) => state.orders);
    const dispatch = useAppDispatch();
    const [filter, setFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    // SVG Placeholder
    const PLACEHOLDER_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="%23f3f4f6" width="300" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

    useEffect(() => {
        if (userInfo) {
            dispatch(getMyOrders(currentPage));
        }
    }, [userInfo, dispatch, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Filter out corrupted orders without _id
    const filteredOrders = orders?.filter((order: any) => {
        // Remove orders without _id
        if (!order?._id) {
            console.warn('⚠️ Skipping order without _id:', order);
            return false;
        }

        // Apply user's filter
        if (filter === 'All') return true;
        if (filter === 'Delivered') return order.isDelivered;
        if (filter === 'Processing') return !order.isDelivered;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 py-12 pt-40">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black font-display text-primary-900 tracking-tight">
                            📦 {t('orders.title')} <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">{t('orders.management')}</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">{t('orders.showing')} {total} {t('orders.in_collection')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                            {['All', 'Processing', 'Delivered'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === tab
                                        ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/20'
                                        : 'text-gray-400 hover:text-gray-900'
                                        }`}
                                >
                                    {t(`orders.${tab.toLowerCase()}`)}
                                </button>
                            ))}
                        </div>
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
                                <Link to="/profile/orders" className="flex items-center justify-between px-6 py-4 text-primary-700 bg-primary-50/50 border-r-4 border-primary-900 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiPackage /> {t('navbar.myOrders')}</span>
                                    <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link to="/custom-orders/my-orders" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><span className="text-purple-600">🎨</span> {t('orders.myCustomOrders')}</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
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
                        {loading ? (
                            <div className="p-32 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <Loader />
                                <p className="mt-8 text-gray-400 font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">{t('orders.retrievingRecords')}</p>
                            </div>
                        ) : error ? (
                            <div className="p-8 bg-red-50 text-red-700 rounded-[2rem] border border-red-100 flex items-center gap-6">
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <FiAlertCircle className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-xl font-black">{t('orders.archiveAccessError')}</p>
                                    <p className="text-sm font-medium opacity-80">{error}</p>
                                </div>
                            </div>
                        ) : !filteredOrders || filteredOrders.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm px-10">
                                <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-gray-200 transform -rotate-12">
                                    <FiPackage size={64} />
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{t('orders.noArchiveFound')}</h2>
                                <p className="text-gray-500 mb-12 max-w-sm mx-auto font-medium leading-relaxed">{t('orders.fashionJourney')}</p>
                                <Link to="/shop" className="inline-flex items-center gap-3 bg-primary-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-black hover:scale-105 transition-all shadow-xl shadow-primary-900/20 active:scale-95">
                                    {t('orders.startExploring')} <FiArrowRight />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                {filteredOrders.map((order: any) => (
                                    <div key={order._id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-500 overflow-hidden">
                                        <div className="p-8 md:p-10">
                                            {/* Header: ID & Mobile Status */}
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-primary-900 border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                                                        <FiPackage size={28} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-black text-primary-600 uppercase tracking-tighter">{t('orders.orderId')}</span>
                                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                                                        </div>
                                                        <p className="text-gray-400 text-xs font-bold mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                </div>

                                                <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 border ${order.isDelivered
                                                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                    : 'bg-primary-900 text-white border-transparent shadow-lg shadow-primary-900/20'
                                                    }`}>
                                                    {order.isDelivered ? <FiCheckCircle /> : <FiTruck className="animate-bounce" />}
                                                    {order.isDelivered ? t('orders.delivered') : (order.status || t('orders.processingDelivery'))}
                                                </div>
                                            </div>

                                            {/* Main Content: Gallery & Pricing */}
                                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-center">
                                                {/* Preview Gallery */}
                                                <div className="xl:col-span-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex -space-x-4">
                                                            {order.orderItems?.slice(0, 4).map((item: any, idx: number) => (
                                                                <div key={idx} className="w-16 h-16 rounded-2xl border-4 border-white overflow-hidden bg-gray-100 shadow-xl relative group/img">
                                                                    <img
                                                                        src={getImageUrl(item.image) || PLACEHOLDER_IMG}
                                                                        alt=""
                                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
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
                                                        {order.orderItems?.length > 4 && (
                                                            <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white text-[10px] font-black flex items-center justify-center shadow-xl border-4 border-white">
                                                                +{order.orderItems.length - 4}
                                                            </div>
                                                        )}
                                                        <div className="ml-4">
                                                            <p className="text-xs font-black text-gray-900">{order.orderItems?.length} {order.orderItems?.length === 1 ? t('orders.items') : t('orders.pieces')}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{t('orders.archiveRecord')}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order Value */}
                                                <div className="xl:col-span-5 grid grid-cols-2 gap-8 border-l border-gray-50 pl-10 md:pl-0 xl:pl-10">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('orders.investment')}</p>
                                                        <p className="text-3xl font-black text-primary-900 tabular-nums tracking-tighter">{order.totalPrice.toLocaleString()} <span className="text-xs font-bold text-gray-400">EGP</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('orders.gatePriority')}</p>
                                                        {order.isPaid ? (
                                                            <div className="flex items-center gap-2 text-green-600">
                                                                <FiCheckCircle size={18} />
                                                                <span className="text-xs font-black uppercase tracking-widest">{t('orders.paidInFull')}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-accent-600">
                                                                <FiClock size={18} className="animate-pulse" />
                                                                <span className="text-xs font-black uppercase tracking-widest">{t('orders.pendingPayment')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Details Action */}
                                                <div className="xl:col-span-3 flex justify-end">
                                                    <Link
                                                        to={`/order/${order._id}`}
                                                        className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-gray-50 hover:bg-primary-900 hover:text-white px-8 py-5 rounded-3xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 group/btn shadow-sm"
                                                    >
                                                        {t('orders.examineDetails')}
                                                        <FiArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-2" />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Tracking Progress - Elite Timeline */}
                                            <div className="mt-12 pt-8 border-t border-gray-50">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex gap-4">
                                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${!order.isDelivered ? 'bg-primary-900 text-white border-primary-900' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                                            {t('orders.orderStatus.processing')}
                                                        </div>
                                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.isDelivered ? 'bg-green-500 text-white border-green-500' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                                            {t('orders.delivered')}
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{t('orders.logisticPipeline')}</p>
                                                </div>
                                                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden flex p-0.5 border border-gray-100/50">
                                                    <div className={`h-full rounded-full transition-all duration-[2000ms] shadow-lg ${order.isDelivered
                                                        ? 'w-full bg-gradient-to-r from-green-400 to-emerald-600'
                                                        : 'w-1/3 bg-gradient-to-r from-primary-700 to-primary-900 animate-pulse'
                                                        }`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination Controls */}
                                {pages > 1 && (
                                    <div className="flex justify-center mt-12 pb-8">
                                        <nav className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-900 disabled:opacity-30 disabled:hover:text-gray-400 transition-all"
                                            >
                                                <FiChevronRight className="rotate-180" />
                                            </button>

                                            {[...Array(pages).keys()].map((p) => (
                                                <button
                                                    key={p + 1}
                                                    onClick={() => handlePageChange(p + 1)}
                                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === p + 1
                                                        ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/20'
                                                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                >
                                                    {p + 1}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === pages}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-900 disabled:opacity-30 disabled:hover:text-gray-400 transition-all"
                                            >
                                                <FiChevronRight />
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;
