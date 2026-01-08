import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import i18n
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import {
    FiUser, FiMapPin, FiCreditCard, FiCheckCircle, FiTruck, FiBox,
    FiArrowLeft, FiAlertCircle, FiDownload, FiPhone, FiMail, FiHome,
    FiClock, FiCheck, FiX
} from 'react-icons/fi';
import api from '../../utils/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const MySwal = withReactContent(Swal);

const OrderDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { i18n } = useTranslation(); // Use hook
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Helper to get translated name safely
    const getName = (name: any) => {
        if (!name) return 'Product';
        if (typeof name === 'string') return name;
        return name[i18n.language] || name.en || Object.values(name)[0] || 'Product';
    };

    const fetchOrder = async () => {
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

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const markAsPaid = async () => {
        const result = await MySwal.fire({
            title: 'Mark as Paid?',
            text: "Are you sure you want to mark this order as paid?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Mark Paid',
            confirmButtonColor: '#10B981',
        });

        if (result.isConfirmed) {
            setUpdating(true);
            try {
                await api.put(`/orders/${id}/pay`);
                await fetchOrder();
                Swal.fire('Success', 'Order marked as paid', 'success');
            } catch (error: any) {
                Swal.fire('Error', error.response?.data?.message || 'Update failed', 'error');
            } finally {
                setUpdating(false);
            }
        }
    };

    const markAsShipped = async () => {
        const result = await MySwal.fire({
            title: 'Mark as Shipped?',
            text: "Are you sure you want to mark this order as shipped?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Mark Shipped',
            confirmButtonColor: '#F59E0B',
        });

        if (result.isConfirmed) {
            setUpdating(true);
            try {
                await api.put(`/orders/${id}/ship`);
                await fetchOrder();
                Swal.fire('Success', 'Order marked as shipped 🚚', 'success');
            } catch (error: any) {
                Swal.fire('Error', error.response?.data?.message || 'Update failed', 'error');
            } finally {
                setUpdating(false);
            }
        }
    };

    const markAsDelivered = async () => {
        const result = await MySwal.fire({
            title: 'Mark as Delivered?',
            text: "Are you sure you want to mark this order as delivered?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Mark Delivered',
            confirmButtonColor: '#3B82F6',
        });

        if (result.isConfirmed) {
            setUpdating(true);
            try {
                await api.put(`/orders/${id}/deliver`);
                await fetchOrder();
                Swal.fire('Success', 'Order marked as delivered ✅', 'success');
            } catch (error: any) {
                Swal.fire('Error', error.response?.data?.message || 'Update failed', 'error');
            } finally {
                setUpdating(false);
            }
        }
    };

    const downloadInvoice = () => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text('TOPIA E-COMMERCE', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Cairo, Egypt | support@topia.com | +20 123 456 789', 105, 28, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`INVOICE: #${(order._id || id)?.slice(-8).toUpperCase()}`, 20, 45);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 190, 45, { align: 'right' });

        doc.setFontSize(10);
        doc.text('Bill To:', 20, 55);
        doc.setFont('helvetica', 'bold');
        doc.text(order.user?.name || order.guestInfo?.name || 'Customer', 20, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(order.shippingAddress?.address || '', 20, 65);
        doc.text(`${order.shippingAddress?.city}, ${order.shippingAddress?.country}`, 20, 70);

        const tableRows = order.orderItems.map((item: any) => [
            getName(item.name),
            item.qty,
            `${item.price.toFixed(2)} EGP`,
            `${(item.qty * item.price).toFixed(2)} EGP`
        ]);

        autoTable(doc, {
            startY: 80,
            head: [['Product', 'Qty', 'Unit Price', 'Total']],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [79, 70, 229] }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Subtotal: ${order.itemsPrice.toFixed(2)} EGP`, 190, finalY, { align: 'right' });
        doc.text(`Shipping: ${order.shippingPrice.toFixed(2)} EGP`, 190, finalY + 5, { align: 'right' });
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`TOTAL: ${order.totalPrice.toFixed(2)} EGP`, 190, finalY + 15, { align: 'right' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for shopping with TOPIA!', 105, finalY + 30, { align: 'center' });

        doc.save(`Invoice_${(order._id || id)?.slice(-8).toUpperCase()}.pdf`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-12 text-center bg-white rounded-2xl border border-gray-100">
                <FiAlertCircle className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-500 mb-4">Order not found</p>
                <Link to="/admin/orders" className="text-primary-600 font-bold hover:underline">
                    Back to Orders
                </Link>
            </div>
        );
    }

    const getOrderStatus = () => {
        if (order.isDelivered) return { label: 'Delivered', color: 'green', icon: FiCheckCircle };
        if (order.isShipped) return { label: 'Shipped', color: 'purple', icon: FiTruck };
        if (order.isPaid) return { label: 'Processing', color: 'blue', icon: FiClock };
        return { label: 'Pending', color: 'yellow', icon: FiClock };
    };

    const status = getOrderStatus();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/admin/orders"
                            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all transform hover:scale-105"
                        >
                            <FiArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                Order #{(order._id || id)?.slice(-8).toUpperCase()}
                                <span className={`px-4 py-2 rounded-xl text-sm font-black bg-${status.color}-100 text-${status.color}-700 border-2 border-${status.color}-200 flex items-center gap-2`}>
                                    <status.icon size={16} />
                                    {status.label}
                                </span>
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Placed on {new Date(order.createdAt).toLocaleString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={downloadInvoice}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <FiDownload size={20} /> Download Invoice
                    </button>
                </div>

                {/* Order Timeline */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                            <div
                                className={`h-full transition-all ${order.isDelivered ? 'w-full bg-green-500' :
                                    order.isShipped ? 'w-2/3 bg-blue-500' :
                                        order.isPaid ? 'w-1/3 bg-yellow-500' :
                                            'w-0'
                                    }`}
                            />
                        </div>

                        {/* Pending/Paid */}
                        <div className="relative flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${order.isPaid ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                }`}>
                                {order.isPaid ? <FiCheck size={20} /> : <FiClock size={20} />}
                            </div>
                            <span className="text-xs font-bold text-gray-700 mt-2 text-center">
                                {order.isPaid ? 'Paid' : 'Pending'}
                            </span>
                        </div>

                        {/* Shipped */}
                        <div className="relative flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${order.isShipped ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                <FiTruck size={20} />
                            </div>
                            <span className="text-xs font-bold text-gray-700 mt-2 text-center">Shipped</span>
                        </div>

                        {/* Delivered */}
                        <div className="relative flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${order.isDelivered ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                <FiCheckCircle size={20} />
                            </div>
                            <span className="text-xs font-bold text-gray-700 mt-2 text-center">Delivered</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left: Details */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Customer & Shipping Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                                <FiUser size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Customer Information</h2>
                                <p className="text-sm text-gray-500">Contact and shipping details</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg">
                                        <FiUser size={18} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold">Full Name</p>
                                        <p className="font-black text-gray-900">{order.user?.name || order.guestInfo?.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg">
                                        <FiMail size={18} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold">Email Address</p>
                                        <a href={`mailto:${order.user?.email || order.guestInfo?.email}`} className="font-bold text-blue-600 hover:underline">
                                            {order.user?.email || order.guestInfo?.email}
                                        </a>
                                    </div>
                                </div>

                                {order.shippingAddress?.phone && (
                                    <div className="flex items-start gap-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <FiPhone size={18} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold">Phone Number</p>
                                            <p className="font-black text-gray-900">{order.shippingAddress.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <FiHome size={18} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold mb-2">Shipping Address</p>
                                    <div className="text-sm text-gray-700 leading-relaxed">
                                        <p className="font-bold">{order.shippingAddress?.address}</p>
                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                                        <p>{order.shippingAddress?.country}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                                <FiCreditCard size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Payment Information</h2>
                                <p className="text-sm text-gray-500">Transaction details</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <span className="font-bold text-gray-700">Payment Method</span>
                                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-black">{order.paymentMethod}</span>
                            </div>

                            <div className={`flex items-center gap-3 p-4 rounded-xl ${order.isPaid
                                ? 'bg-green-50 border-2 border-green-200 text-green-700'
                                : 'bg-red-50 border-2 border-red-200 text-red-700'
                                }`}>
                                {order.isPaid ? <FiCheckCircle size={24} /> : <FiAlertCircle size={24} />}
                                <div>
                                    <p className="font-black text-sm">
                                        {order.isPaid ? 'Payment Received' : 'Payment Pending'}
                                    </p>
                                    {order.isPaid && (
                                        <p className="text-xs mt-1">
                                            Paid on {new Date(order.paidAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Manual Payment Details */}
                            {order.paymentDetails && (
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <p className="font-black text-blue-900 mb-3 text-sm">Transaction Details:</p>
                                    <div className="space-y-2 text-sm">
                                        {order.paymentDetails.walletNumber && (
                                            <p className="flex justify-between">
                                                <span className="text-blue-600">Wallet:</span>
                                                <span className="font-bold text-blue-900">{order.paymentDetails.walletNumber}</span>
                                            </p>
                                        )}
                                        {(order.paymentDetails.transactionId || order.paymentResult?.id) && (
                                            <p className="flex justify-between">
                                                <span className="text-blue-600">Trans ID:</span>
                                                <code className="font-mono font-bold text-blue-900 text-xs">
                                                    {order.paymentDetails.transactionId || order.paymentResult?.id}
                                                </code>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Receipt Image */}
                            {order.paymentResult?.receiptImage && (
                                <div className="border-t border-gray-200 pt-4">
                                    <p className="font-black text-gray-900 mb-3">Payment Receipt:</p>
                                    <a
                                        href={order.paymentResult.receiptImage}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 transition-all"
                                    >
                                        <img
                                            src={order.paymentResult.receiptImage}
                                            alt="Receipt"
                                            className="w-full h-auto object-cover"
                                        />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                                <FiBox size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Order Items</h2>
                                <p className="text-sm text-gray-500">{order.orderItems?.length} item(s)</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {order.orderItems?.map((item: any, index: number) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all">
                                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                        <img src={item.image} alt={getName(item.name)} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-gray-900">{getName(item.name)}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm">
                                            <span className="text-gray-600">Qty: <span className="font-bold text-gray-900">{item.qty}</span></span>
                                            <span className="text-gray-600">×</span>
                                            <span className="text-gray-600">{item.price} EGP</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Subtotal</p>
                                        <p className="text-xl font-black text-purple-600">{(item.qty * item.price).toFixed(2)} EGP</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Summary & Actions */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h3 className="text-xl font-black text-gray-900 mb-6">Order Summary</h3>

                        <div className="space-y-3 border-b-2 border-gray-200 pb-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Items Price</span>
                                <span className="font-bold text-gray-900">{order.itemsPrice?.toFixed(2)} EGP</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-bold text-gray-900">{order.shippingPrice?.toFixed(2)} EGP</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-bold text-gray-900">{order.taxPrice?.toFixed(2) || '0.00'} EGP</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-xl font-black text-gray-900 mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                            <span>Total</span>
                            <span className="text-purple-600">{order.totalPrice?.toFixed(2)} EGP</span>
                        </div>

                        {/* Admin Actions */}
                        <div className="space-y-3">
                            {!order.isPaid && (
                                <Button
                                    fullWidth
                                    onClick={markAsPaid}
                                    isLoading={updating}
                                    className="bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                >
                                    <FiCheckCircle className="inline mr-2" size={20} /> Mark as Paid
                                </Button>
                            )}

                            {!order.isShipped && !order.isDelivered && (
                                <Button
                                    fullWidth
                                    onClick={markAsShipped}
                                    isLoading={updating}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                >
                                    <FiTruck className="inline mr-2" size={20} /> Mark as Shipped
                                </Button>
                            )}

                            {order.isShipped && !order.isDelivered && (
                                <Button
                                    fullWidth
                                    onClick={markAsDelivered}
                                    isLoading={updating}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                >
                                    <FiCheckCircle className="inline mr-2" size={20} /> Mark as Delivered
                                </Button>
                            )}

                            {order.isDelivered && (
                                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                                    <FiCheckCircle className="mx-auto text-green-600 mb-2" size={48} />
                                    <p className="text-green-700 font-black text-lg">Order Completed! 🎉</p>
                                    <p className="text-green-600 text-sm mt-1">
                                        Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                                    </p>
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
