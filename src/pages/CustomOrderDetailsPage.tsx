import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPackage, FiClock, FiCheck, FiX, FiPrinter, FiMapPin, FiTruck, FiChevronLeft } from 'react-icons/fi';
import api from '../utils/api';
import Loader from '../components/Loader';
import { useAppSelector } from '../hooks/useRedux';
import { getLocalizedName } from '../utils/getLocalizedName';
import { getImageUrl } from '../utils/imageUtils';

const CustomOrderDetailsPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const { data } = await api.get(`/custom-orders/${id}`);
                setOrder(data.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Error fetching order details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

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

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader size="lg" /></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;
    if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <Link to="/custom-orders/my-orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-900 font-bold mb-8 transition-colors">
                    <FiChevronLeft /> Back to My Orders
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Details</h1>
                        <p className="text-gray-500 font-medium">Order ID: <span className="font-mono text-gray-900">#{order._id.toUpperCase()}</span></p>
                    </div>
                    <span className={`px-5 py-2 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Product & Design */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Product Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <FiPackage className="text-primary-900" /> Product Information
                            </h2>
                            <div className="flex gap-6">
                                <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                                    <img src={order.product?.images && order.product.images[0] ? getImageUrl(order.product.images[0]) : ''} alt={getLocalizedName(order.product?.name)} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{getLocalizedName(order.product?.name)}</h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p><span className="font-semibold">Size:</span> {order.size}</p>
                                        <p><span className="font-semibold">Color:</span> {order.color}</p>
                                        <p><span className="font-semibold">Quantity:</span> {order.quantity}</p>
                                        <p><span className="font-semibold">Price per item:</span> {order.product?.price} EGP</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customization Details */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="text-purple-600">🎨</span> Design Specifications
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Print Location</p>
                                    <p className="font-bold text-gray-900">{order.customization.printLocation}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Print Size</p>
                                    <p className="font-bold text-gray-900">{order.customization.printSize}</p>
                                </div>
                            </div>

                            {order.customization.designImages && order.customization.designImages.length > 0 && (
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Uploaded Designs</p>
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {order.customization.designImages.map((img: any, idx: number) => (
                                            <a key={idx} href={getImageUrl(img.url)} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                                                <img src={getImageUrl(img.url)} alt="Design" className="w-full h-full object-cover" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {order.customization.designNotes && (
                                <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 text-yellow-800 text-sm">
                                    <span className="font-bold block mb-1">Note:</span>
                                    {order.customization.designNotes}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Summary & Timeline */}
                    <div className="space-y-8">
                        {/* Payment Summary */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-black text-gray-900 mb-6">Payment Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Base Price</span>
                                    <span>{order.pricing.basePrice} EGP</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Print Cost</span>
                                    <span>{order.pricing.printPrice} EGP</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Design Fee</span>
                                    <span>{order.pricing.designFee} EGP</span>
                                </div>
                                <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-black text-gray-900 text-lg">Total</span>
                                    <span className="font-black text-primary-900 text-xl">{order.pricing.totalPrice} EGP</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"><FiTruck /> Shipping Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Recipient</p>
                                    <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                                    <p className="text-sm text-gray-500">{order.shippingAddress.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Address</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {order.shippingAddress.street}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"><FiClock /> Order History</h2>
                            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                {order.timeline?.map((entry: any, index: number) => (
                                    <div key={index} className="relative pl-8">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary-900 border-4 border-white shadow-sm"></div>
                                        <p className="font-bold text-sm text-gray-900 capitalize">{entry.status.replace('-', ' ')}</p>
                                        <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                                        {entry.note && <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded-lg">{entry.note}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomOrderDetailsPage;
