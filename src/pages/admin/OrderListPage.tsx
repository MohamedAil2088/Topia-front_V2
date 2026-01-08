import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import {
    FiEye, FiAlertCircle, FiPackage, FiDollarSign, FiClock,
    FiCheckCircle, FiXCircle, FiTruck, FiSearch, FiFilter,
    FiDownload, FiRefreshCw
} from 'react-icons/fi';
import api from '../../utils/api';
import Swal from 'sweetalert2';

interface Order {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    totalPrice: number;
    paymentStatus: string;
    orderStatus: string;
    status: string;
    isPaid: boolean;
    isDelivered: boolean;
    paymentMethod: string;
}

const OrderListPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // NEW: Filter & Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/orders');
            console.log('Admin Orders Fetch Result:', data);
            setOrders(data.data || data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // NEW: Quick Status Update - Using existing endpoints
    const updateOrderStatus = async (orderId: string, newStatus: string, _order?: Order) => {
        setUpdatingStatus(orderId);
        try {
            let endpoint = '';
            let body = {};

            // Use existing endpoints based on status
            if (newStatus === 'delivered') {
                endpoint = `/orders/${orderId}/deliver`;
            } else if (newStatus === 'shipped') {
                endpoint = `/orders/${orderId}/ship`;
            } else {
                // For other statuses (confirmed, processing, cancelled), use the status endpoint
                endpoint = `/orders/${orderId}/status`;
                body = { status: newStatus };
            }

            await api.put(endpoint, body);

            // Update local state
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));

            Swal.fire({
                icon: 'success',
                title: 'Status Updated!',
                text: `Order status changed to ${newStatus}`,
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err: any) {
            console.error('Update error:', err);
            Swal.fire('Error', err.response?.data?.message || 'Failed to update status. Try viewing the order details to update status.', 'error');
        } finally {
            setUpdatingStatus(null);
        }
    };

    // Filter orders based on search and filters
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' ||
                (order.status || (order.isDelivered ? 'delivered' : 'processing')).toLowerCase() === statusFilter.toLowerCase();

            const matchesPayment = paymentFilter === 'all' ||
                (paymentFilter === 'paid' && order.isPaid) ||
                (paymentFilter === 'unpaid' && !order.isPaid);

            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [orders, searchTerm, statusFilter, paymentFilter]);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = orders.length;
        const pending = orders.filter(o => (o.status || 'pending').toLowerCase() === 'pending').length;
        const processing = orders.filter(o => (o.status || '').toLowerCase() === 'processing').length;
        const delivered = orders.filter(o => (o.status || '').toLowerCase() === 'delivered' || o.isDelivered).length;
        const cancelled = orders.filter(o => (o.status || '').toLowerCase() === 'cancelled').length;
        const totalRevenue = orders.filter(o => o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0);
        const pendingRevenue = orders.filter(o => !o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0);

        return { total, pending, processing, delivered, cancelled, totalRevenue, pendingRevenue };
    }, [orders]);

    const getStatusBadge = (status: string) => {
        const statusLower = status ? status.toLowerCase() : 'pending';
        const statusMap: Record<string, { bg: string; text: string; label: string; icon: any }> = {
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: FiClock },
            'processing': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing', icon: FiRefreshCw },
            'confirmed': { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Confirmed', icon: FiCheckCircle },
            'shipped': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Shipped', icon: FiTruck },
            'delivered': { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered', icon: FiCheckCircle },
            'cancelled': { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled', icon: FiXCircle },
        };

        const style = statusMap[statusLower] || statusMap['pending'];
        const Icon = style.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${style.bg} ${style.text} text-xs font-black border-2 border-${style.text.replace('text-', '')}/20`}>
                <Icon size={14} />
                {style.label}
            </span>
        );
    };

    const getPaymentBadge = (isPaid: boolean) => {
        if (isPaid) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-xs font-black border-2 border-green-200">
                    <FiCheckCircle size={14} /> Paid
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-xl text-xs font-black border-2 border-orange-200">
                <FiClock size={14} /> Unpaid
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Statistics Dashboard */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-black font-display text-gray-900 mb-1">Orders Management</h1>
                    <p className="text-gray-500 text-sm">Monitor and manage all customer orders</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500 text-white p-3 rounded-lg">
                                <FiPackage size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-bold uppercase">Total Orders</p>
                                <p className="text-3xl font-black text-blue-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-500 text-white p-3 rounded-lg">
                                <FiClock size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-yellow-600 font-bold uppercase">Pending</p>
                                <p className="text-3xl font-black text-yellow-900">{stats.pending}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500 text-white p-3 rounded-lg">
                                <FiCheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-green-600 font-bold uppercase">Delivered</p>
                                <p className="text-3xl font-black text-green-900">{stats.delivered}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500 text-white p-3 rounded-lg">
                                <FiDollarSign size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-purple-600 font-bold uppercase">Total Revenue</p>
                                <p className="text-2xl font-black text-purple-900">{stats.totalRevenue.toFixed(0)} EGP</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-200">
                        <p className="text-xs text-indigo-600 font-bold">Processing</p>
                        <p className="text-xl font-black text-indigo-900">{stats.processing}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                        <p className="text-xs text-red-600 font-bold">Cancelled</p>
                        <p className="text-xl font-black text-red-900">{stats.cancelled}</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
                        <p className="text-xs text-orange-600 font-bold">Pending Payment</p>
                        <p className="text-xl font-black text-orange-900">{stats.pendingRevenue.toFixed(0)} EGP</p>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <FiFilter className="text-gray-600" size={20} />
                    <h2 className="text-lg font-black text-gray-900">Filters & Search</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2 relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Customer name, or Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-900 focus:ring-4 focus:ring-primary-100 transition-all outline-none font-medium"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-900 focus:ring-4 focus:ring-primary-100 outline-none font-bold text-gray-700"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Payment Filter */}
                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-900 focus:ring-4 focus:ring-primary-100 outline-none font-bold text-gray-700"
                    >
                        <option value="all">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-black text-gray-900">{filteredOrders.length}</span> of <span className="font-black">{orders.length}</span> orders
                    </p>
                    <button
                        onClick={fetchOrders}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-sm transition-all"
                    >
                        <FiRefreshCw size={16} /> Refresh
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            {loading ? (
                <div className="bg-white rounded-2xl p-12 flex justify-center border border-gray-100">
                    <Loader size="lg" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-3">
                    <FiAlertCircle className="text-red-500 mt-0.5" size={20} />
                    <div>
                        <h3 className="font-semibold text-red-900 mb-1">Error Loading Orders</h3>
                        <p className="text-red-700 text-sm">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition-all"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <FiPackage className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500 font-medium">
                        {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                            ? 'No orders match your filters'
                            : 'No orders found'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Payment</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <code className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border border-blue-200">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-black text-gray-900 text-sm">{order.user?.name || 'Guest'}</div>
                                                <div className="text-xs text-gray-500">{order.user?.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-black text-lg text-gray-900">{order.totalPrice?.toFixed(0)} EGP</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getPaymentBadge(order.isPaid)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {updatingStatus === order._id ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader size="sm" />
                                                    <span className="text-xs text-gray-500">Updating...</span>
                                                </div>
                                            ) : (
                                                <select
                                                    value={order.status || (order.isDelivered ? 'delivered' : 'processing')}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value, order)}
                                                    className="px-4 py-2.5 font-bold border-3 rounded-xl outline-none transition-all cursor-pointer shadow-sm hover:shadow-md"
                                                    style={{
                                                        backgroundColor:
                                                            (order.status || '').toLowerCase() === 'pending' ? '#fef3c7' :
                                                                (order.status || '').toLowerCase() === 'processing' ? '#dbeafe' :
                                                                    (order.status || '').toLowerCase() === 'confirmed' ? '#e0e7ff' :
                                                                        (order.status || '').toLowerCase() === 'shipped' ? '#f3e8ff' :
                                                                            (order.status || '').toLowerCase() === 'delivered' ? '#d1fae5' :
                                                                                (order.status || '').toLowerCase() === 'cancelled' ? '#fee2e2' :
                                                                                    '#f3f4f6',
                                                        color:
                                                            (order.status || '').toLowerCase() === 'pending' ? '#92400e' :
                                                                (order.status || '').toLowerCase() === 'processing' ? '#1e40af' :
                                                                    (order.status || '').toLowerCase() === 'confirmed' ? '#4338ca' :
                                                                        (order.status || '').toLowerCase() === 'shipped' ? '#7c3aed' :
                                                                            (order.status || '').toLowerCase() === 'delivered' ? '#065f46' :
                                                                                (order.status || '').toLowerCase() === 'cancelled' ? '#991b1b' :
                                                                                    '#374151',
                                                        borderColor:
                                                            (order.status || '').toLowerCase() === 'pending' ? '#fbbf24' :
                                                                (order.status || '').toLowerCase() === 'processing' ? '#3b82f6' :
                                                                    (order.status || '').toLowerCase() === 'confirmed' ? '#6366f1' :
                                                                        (order.status || '').toLowerCase() === 'shipped' ? '#a855f7' :
                                                                            (order.status || '').toLowerCase() === 'delivered' ? '#10b981' :
                                                                                (order.status || '').toLowerCase() === 'cancelled' ? '#ef4444' :
                                                                                    '#d1d5db'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="pending" style={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 'bold', padding: '8px' }}>
                                                        ⏳ Pending
                                                    </option>
                                                    <option value="processing" style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 'bold', padding: '8px' }}>
                                                        🔄 Processing
                                                    </option>
                                                    <option value="confirmed" style={{ backgroundColor: '#e0e7ff', color: '#4338ca', fontWeight: 'bold', padding: '8px' }}>
                                                        ✅ Confirmed
                                                    </option>
                                                    <option value="shipped" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed', fontWeight: 'bold', padding: '8px' }}>
                                                        🚚 Shipped
                                                    </option>
                                                    <option value="delivered" style={{ backgroundColor: '#d1fae5', color: '#065f46', fontWeight: 'bold', padding: '8px' }}>
                                                        ✓ Delivered
                                                    </option>
                                                    <option value="cancelled" style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 'bold', padding: '8px' }}>
                                                        ✕ Cancelled
                                                    </option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-xl font-bold text-sm transition-all border-2 border-primary-200 hover:border-primary-300 hover:shadow-md transform hover:scale-105"
                                            >
                                                <FiEye size={16} /> View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderListPage;
