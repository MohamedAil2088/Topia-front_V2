import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBox, FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp, FiClock, FiActivity } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Loader from '../../components/Loader';
import api from '../../utils/api';

interface DashboardStats {
    totalSales: string;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    recentOrders: any[];
    ordersByStatus: any[];
    monthlySales: any[];
    tierDistribution: any[];
    elitePackagingStats: {
        total: number;
        count: number;
    };
}

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{value}</h3>
                {trend && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                        <FiTrendingUp size={14} />
                        <span className="font-semibold">{trend}</span>
                    </p>
                )}
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
                <Icon size={28} />
            </div>
        </div>
    </div>
);

const DashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data.data);
                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load stats');
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const chartData = stats?.monthlySales.map(item => ({
        name: `${item._id.month}/${item._id.year}`,
        sales: item.total
    })) || [];

    // Skeleton Loading - Shows page structure immediately for better LCP
    if (loading) {
        return (
            <div className="space-y-8 pb-12 animate-pulse">
                {/* Title - Shows immediately for LCP */}
                <div>
                    <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white uppercase italic tracking-tighter">Command Center</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Real-time brand performance and elite metrics.</p>
                </div>

                {/* Skeleton Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3"></div>
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                </div>
                                <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skeleton Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>
                        <div className="h-[350px] bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Skeleton Table */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                    </div>
                    <div className="p-8 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <FiActivity size={48} className="text-red-400 mb-4" />
                <p className="text-red-700 font-bold text-lg mb-2">Something went wrong</p>
                <p className="text-red-600">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Try Again</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white uppercase italic tracking-tighter">Command Center</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Real-time brand performance and elite metrics.</p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Revenue"
                    value={`${Number(stats?.totalSales).toLocaleString()} EGP`}
                    icon={FiDollarSign}
                    color="bg-green-500"
                    trend="+12% from last month"
                />
                <StatCard
                    title="Orders"
                    value={stats?.totalOrders || 0}
                    icon={FiShoppingBag}
                    color="bg-blue-500"
                    trend="+5% from last month"
                />
                <StatCard
                    title="Products"
                    value={stats?.totalProducts || 0}
                    icon={FiBox}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Customers"
                    value={stats?.totalUsers || 0}
                    icon={FiUsers}
                    color="bg-purple-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-8 text-gray-900 dark:text-white">
                        <h3 className="font-bold text-xl uppercase tracking-tighter">Sales Performance</h3>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-2 text-xs font-bold"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> This Year</span>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Loyalty Tiers</h3>
                        <div className="space-y-4">
                            {stats?.tierDistribution.map((tier: any) => (
                                <div key={tier._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                                    <span className="text-xs font-black uppercase text-gray-500 tracking-widest">{tier._id || 'Standard'}</span>
                                    <span className="text-lg font-black text-primary-900 dark:text-white">{tier.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600">
                                <FiActivity size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Elite Packaging</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{((stats?.elitePackagingStats.count || 0) / (stats?.totalOrders || 1) * 100).toFixed(1)}% Adoption</p>
                            </div>
                        </div>
                        <p className="text-xl font-black text-primary-900 dark:text-white">{stats?.elitePackagingStats.total.toFixed(2)} EGP <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest ml-1">Revenue</span></p>
                    </div>
                </div>
            </div>

            {/* Recent Orders Bottom Table */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-tighter">
                        <FiClock className="text-blue-500" /> Latest Orders Feed
                    </h3>
                    <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Full Report →</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white dark:bg-gray-800 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-8 py-4">ID</th>
                                <th className="px-8 py-4">Client</th>
                                <th className="px-8 py-4">Revenue</th>
                                <th className="px-8 py-4">Payment</th>
                                <th className="px-8 py-4">Delivery</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {stats?.recentOrders.map((order: any) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-8 py-5 text-xs font-mono text-gray-400">#{order._id.slice(-6).toUpperCase()}</td>
                                    <td className="px-8 py-5 font-bold text-gray-900 dark:text-white">{order.user?.name || 'Guest'}</td>
                                    <td className="px-8 py-5 font-bold text-gray-900 dark:text-white">{order.totalPrice.toFixed(2)} EGP</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-gray-600 dark:text-gray-400">{order.isDelivered ? 'Delivered' : 'Processing'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
