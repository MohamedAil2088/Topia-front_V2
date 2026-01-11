import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loader from '../components/Loader';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiTruck, FiBox, FiArrowLeft, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getLocalizedName } from '../utils/getLocalizedName';
import { getImageUrl } from '../utils/imageUtils';

const OrderDetailsPage = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // SVG Placeholder
    const PLACEHOLDER_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="%23f3f4f6" width="300" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

    const fetchOrder = async () => {
        // Guard against undefined ID
        if (!id || id === 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Order',
                text: 'Order ID is missing or invalid',
            });
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data.data || data);
            setLoading(false);
        } catch (error: any) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to load order',
            });
            setLoading(false);
        }
    };

    const downloadInvoice = () => {
        const doc = new jsPDF();

        // Brand Header
        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text('TOPIA E-COMMERCE', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Cairo, Egypt | support@topia.com | +20 123 456 789', 105, 28, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Invoice Info
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`INVOICE: #${(order._id)?.slice(-8).toUpperCase()}`, 20, 45);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 190, 45, { align: 'right' });

        // Customer Details
        doc.setFontSize(10);
        doc.text('Bill To:', 20, 55);
        doc.setFont('helvetica', 'bold');
        doc.text(order.user?.name || 'Customer', 20, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(order.shippingAddress?.address || '', 20, 65);
        doc.text(`${order.shippingAddress?.city}, ${order.shippingAddress?.country}`, 20, 70);

        // Table
        const tableRows = order.orderItems.map((item: any) => [
            getLocalizedName(item.name),
            item.qty,
            `${item.price.toFixed(2)} EGP`,
            `${(item.qty * item.price).toFixed(2)} EGP`
        ]);

        autoTable(doc, {
            startY: 80,
            head: [['Product', 'Qty', 'Unit Price', 'Total']],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [17, 24, 39] } // Dark Primary
        });

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Subtotal: ${order.itemsPrice.toFixed(2)} EGP`, 190, finalY, { align: 'right' });
        doc.text(`Shipping: ${order.shippingPrice.toFixed(2)} EGP`, 190, finalY + 5, { align: 'right' });
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`TOTAL: ${order.totalPrice.toFixed(2)} EGP`, 190, finalY + 15, { align: 'right' });

        doc.save(`Topia_Invoice_${(order._id)?.slice(-8).toUpperCase()}.pdf`);
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader size="lg" /></div>;
    if (!order) return <div className="text-center p-10">Order not found</div>;

    const steps = [
        { status: 'Processing', icon: FiBox, active: true },
        { status: 'Confirmed', icon: FiCheckCircle, active: order.isPaid }, // Confirmed usually means Paid or Admin approved
        { status: 'Shipped', icon: FiTruck, active: order.isShipped || order.isDelivered },
        { status: 'Delivered', icon: FiMapPin, active: order.isDelivered }
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl pt-24">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/profile/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-display flex items-center gap-3">
                            Order #{order._id.substring(0, 8)}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                            </span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Customer Download Button */}
                <button
                    onClick={downloadInvoice}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-bold text-sm shadow-lg shadow-gray-200"
                >
                    <FiDownload /> Invoice
                </button>
            </div>

            {/* Status Tracker - Elite Pipeline */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10 md:p-14 mb-12 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-50">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(steps.filter(s => s.active).length / steps.length) * 100}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-primary-900 shadow-[0_0_20px_rgba(15,23,42,0.5)]"
                    ></motion.div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-12 relative">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-row md:flex-col items-center gap-6 md:gap-4 flex-1">
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 relative ${step.active ? 'bg-primary-900 text-white shadow-2xl shadow-primary-900/40 rotate-12 scale-110' : 'bg-gray-50 text-gray-300 border border-gray-100'
                                }`}>
                                <step.icon size={28} />
                                {step.active && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-500"></span>
                                    </span>
                                )}
                            </div>
                            <div className="text-left md:text-center">
                                <span className={`block text-xs font-black uppercase tracking-[0.2em] mb-1 ${step.active ? 'text-primary-950' : 'text-gray-400'}`}>
                                    {step.status}
                                </span>
                                {step.active ? (
                                    <p className="text-[10px] text-accent-600 font-bold italic">Status Locked</p>
                                ) : (
                                    <p className="text-[10px] text-gray-300 font-medium">Pending Logic</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="font-bold text-gray-900">Order Items</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.orderItems.map((item: any) => (
                                <div key={item._id} className="p-6 flex gap-4 items-center">
                                    <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img
                                            src={getImageUrl(item.image) || PLACEHOLDER_IMG}
                                            alt={getLocalizedName(item.name)}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (target.src !== PLACEHOLDER_IMG) {
                                                    target.src = PLACEHOLDER_IMG;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <Link to={`/product/${item.product}`} className="font-bold text-gray-900 hover:text-primary-600 transition-colors block mb-1">
                                            {getLocalizedName(item.name)}
                                        </Link>
                                        <div className="text-sm text-gray-500 mb-2">
                                            {item.size} / {item.color}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <span>{item.price} EGP</span>
                                            <span className="text-gray-400">×</span>
                                            <span>{item.qty}</span>
                                        </div>
                                    </div>
                                    <div className="text-right font-bold text-lg">
                                        {(item.price * item.qty).toFixed(2)} EGP
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Info */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-bold text-gray-900 mb-4">Summary</h2>
                        <div className="space-y-3 pb-4 border-b border-gray-100">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{order.itemsPrice?.toFixed(2) || '0.00'} EGP</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{order.shippingPrice?.toFixed(2) || '0.00'} EGP</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>{order.taxPrice?.toFixed(2) || '0.00'} EGP</span>
                            </div>
                            {order.discountPrice > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-{order.discountPrice?.toFixed(2) || '0.00'} EGP</span>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-4">
                            <span>Total</span>
                            <span>{order.totalPrice?.toFixed(2)} EGP</span>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiMapPin className="text-gray-400" /> Shipping Address
                        </h2>
                        <div className="text-gray-600 text-sm leading-relaxed">
                            <p className="font-medium text-gray-900 mb-1">{order.user?.name}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiCreditCard className="text-gray-400" /> Payment Info
                        </h2>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">{order.paymentMethod}</span>
                                {order.isPaid ? (
                                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">PAID</span>
                                ) : (
                                    <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">UNPAID</span>
                                )}
                            </div>
                            {order.paymentMethod === 'Vodafone Cash' && order.paymentResult?.id && (
                                <div className="text-xs text-gray-500 break-all p-2 bg-gray-50 rounded">
                                    <span className="font-bold">Transaction ID:</span> {order.paymentResult.id}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
