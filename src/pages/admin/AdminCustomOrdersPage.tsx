import { useEffect, useState } from 'react';
import { FiEye, FiCheck, FiX, FiFilter, FiDownload, FiSearch, FiClock, FiSettings, FiEdit, FiPackage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { getLocalizedName } from '../../utils/getLocalizedName';
import { getImageUrl } from '../../utils/imageUtils';

const AdminCustomOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const statuses = ['all', 'pending', 'reviewing', 'approved', 'in-design', 'printing', 'completed', 'shipped', 'delivered', 'cancelled'];

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, [selectedStatus]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get(`/custom-orders/admin/all?status=${selectedStatus === 'all' ? '' : selectedStatus}`);
            setOrders(data.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/custom-orders/admin/stats');
            setStats(data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string, note: string = '') => {
        try {
            await api.put(`/custom-orders/${orderId}/status`, {
                status: newStatus,
                note
            });
            fetchOrders();
            setShowModal(false);
            toast.success('تم تحديث حالة الطلب بنجاح!');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('فشل تحديث الحالة');
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8">
                <div>
                    <h1 className="text-3xl font-black font-display text-gray-900 flex items-center gap-3">
                        Custom Orders Management 🎨
                    </h1>
                    <p className="text-gray-500 mt-1">Manage all custom design orders</p>
                </div>
                <Button
                    onClick={() => window.location.href = '/admin/settings'}
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                >
                    <FiSettings /> Settings
                </Button>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <p className="text-blue-100 text-sm mb-2">Total Orders</p>
                        <p className="text-4xl font-black">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                        <p className="text-green-100 text-sm mb-2">Total Revenue</p>
                        <p className="text-4xl font-black">{stats.totalRevenue.toLocaleString()}</p>
                        <p className="text-green-100 text-xs">EGP</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
                        <p className="text-yellow-100 text-sm mb-2">Pending</p>
                        <p className="text-4xl font-black">
                            {stats.byStatus.find((s: any) => s._id === 'pending')?.count || 0}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                        <p className="text-purple-100 text-sm mb-2">In Progress</p>
                        <p className="text-4xl font-black">
                            {(stats.byStatus.find((s: any) => s._id === 'in-design')?.count || 0) +
                                (stats.byStatus.find((s: any) => s._id === 'printing')?.count || 0)}
                        </p>
                    </div>
                </div>
            )}

            {/* Status Filter */}
            <div className="mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {statuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedStatus === status
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status.replace('-', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Designs</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-mono text-sm font-bold">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-900">{order.user?.name}</p>
                                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={order.product?.images && order.product.images[0] ? getImageUrl(order.product.images[0]) : ''}
                                                alt={getLocalizedName(order.product?.name)}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                            <div>
                                                <p className="font-semibold text-sm">{getLocalizedName(order.product?.name)}</p>
                                                <p className="text-xs text-gray-500">
                                                    {order.size} | {order.color}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            {order.customization.designImages.slice(0, 2).map((img: any, index: number) => (
                                                <img
                                                    key={index}
                                                    src={getImageUrl(img.url)}
                                                    alt={`Design ${index + 1}`}
                                                    className="w-10 h-10 object-cover rounded border border-gray-200"
                                                />
                                            ))}
                                            {order.customization.designImages.length > 2 && (
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                                                    +{order.customization.designImages.length - 2}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-black text-gray-900">{order.pricing.totalPrice} EGP</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                            {order.status.replace('-', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowModal(true);
                                                }}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                title="View Details"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowModal(true);
                                                }}
                                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                title="Update Status"
                                            >
                                                <FiEdit />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <FiPackage className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500">No orders found</p>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-2xl font-black">Order Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer & Product Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-black text-gray-900 mb-3">Customer Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500">Name:</span> <span className="font-semibold">{selectedOrder.user?.name}</span></p>
                                        <p><span className="text-gray-500">Email:</span> <span className="font-semibold">{selectedOrder.user?.email}</span></p>
                                        <p><span className="text-gray-500">Phone:</span> <span className="font-semibold">{selectedOrder.shippingAddress?.phone}</span></p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 mb-3">Product Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500">Product:</span> <span className="font-semibold">{getLocalizedName(selectedOrder.product?.name)}</span></p>
                                        <p><span className="text-gray-500">Size:</span> <span className="font-semibold">{selectedOrder.size}</span></p>
                                        <p><span className="text-gray-500">Color:</span> <span className="font-semibold">{selectedOrder.color}</span></p>
                                        <p><span className="text-gray-500">Quantity:</span> <span className="font-semibold">{selectedOrder.quantity}</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Design Images */}
                            <div>
                                <h3 className="font-black text-gray-900 mb-3">Design Images ({selectedOrder.customization.designImages.length})</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {selectedOrder.customization.designImages.map((img: any, index: number) => (
                                        <a
                                            key={index}
                                            href={getImageUrl(img.url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-600 transition-colors"
                                        >
                                            <img
                                                src={getImageUrl(img.url)}
                                                alt={`Design ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Print Specifications */}
                            <div>
                                <h3 className="font-black text-gray-900 mb-3">Print Specifications</h3>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                                    <p><span className="text-gray-500">Location:</span> <span className="font-semibold uppercase">{selectedOrder.customization.printLocation}</span></p>
                                    <p><span className="text-gray-500">Size:</span> <span className="font-semibold uppercase">{selectedOrder.customization.printSize}</span></p>
                                </div>
                            </div>

                            {/* Customer Notes */}
                            {selectedOrder.customization.specialInstructions && (
                                <div>
                                    <h3 className="font-black text-gray-900 mb-3">Special Instructions</h3>
                                    <p className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm">
                                        {selectedOrder.customization.specialInstructions}
                                    </p>
                                </div>
                            )}

                            {/* Status Update */}
                            <div>
                                <h3 className="font-black text-gray-900 mb-3">Workflow Progression</h3>
                                <div className="flex gap-2 flex-wrap bg-gray-50 p-4 rounded-xl border border-gray-100 items-center">
                                    {['pending', 'reviewing', 'approved', 'in-design', 'printing', 'completed', 'shipped', 'delivered'].map((status, index) => {
                                        const currentStatusIndex = ['pending', 'reviewing', 'approved', 'in-design', 'printing', 'completed', 'shipped', 'delivered'].indexOf(selectedOrder.status);
                                        const isPast = index < currentStatusIndex;
                                        const isCurrent = index === currentStatusIndex;

                                        return (
                                            <div key={status} className="flex items-center">
                                                <button
                                                    onClick={() => updateStatus(selectedOrder._id, status, `Moveto to ${status}`)}
                                                    disabled={isCurrent}
                                                    className={`
                                                        relative px-4 py-2 rounded-lg font-bold text-xs transition-all uppercase tracking-wider
                                                        ${isCurrent
                                                            ? 'bg-gray-900 text-white shadow-lg scale-105 z-10 ring-2 ring-offset-2 ring-gray-900'
                                                            : isPast
                                                                ? 'bg-green-50 text-green-700 border border-green-200 opacity-80 hover:opacity-100 hover:bg-green-100'
                                                                : 'bg-white border border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                                                        }
                                                    `}
                                                >
                                                    {status.replace('-', ' ')}
                                                </button>
                                                {index < 7 && (
                                                    <div className={`w-4 h-0.5 mx-1 ${isPast ? 'bg-green-200' : 'bg-gray-200'}`}></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomOrdersPage;
