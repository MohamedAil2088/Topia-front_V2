import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiImage } from 'react-icons/fi';
import api from '../../../utils/api';
import Loader from '../../../components/Loader';
import Swal from 'sweetalert2';

const DesignListPage = () => {
    const [designs, setDesigns] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchDesigns();
        fetchStats();
    }, [filter]);

    const fetchDesigns = async () => {
        try {
            const active = filter === 'active' ? 'true' : filter === 'inactive' ? 'false' : '';
            const { data } = await api.get(`/designs${active ? `?active=${active}` : ''}`);
            setDesigns(data.data || []);
        } catch (error) {
            console.error('Error fetching designs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/designs/admin/stats');
            setStats(data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Delete design "${name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/designs/${id}`);
                Swal.fire('Deleted!', 'Design has been deleted.', 'success');
                fetchDesigns();
                fetchStats();
            } catch (error: any) {
                Swal.fire('Error!', error.response?.data?.message || 'Failed to delete design', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Design Templates 🎨</h1>
                        <p className="text-gray-600">Manage design templates for custom orders</p>
                    </div>
                    <Link
                        to="/admin/designs/create"
                        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
                    >
                        <FiPlus />
                        Add New Design
                    </Link>
                </div>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                        <p className="text-purple-100 text-sm mb-2">Total Designs</p>
                        <p className="text-4xl font-black">{stats.totalDesigns}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                        <p className="text-green-100 text-sm mb-2">Active</p>
                        <p className="text-4xl font-black">{stats.activeDesigns}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white">
                        <p className="text-gray-100 text-sm mb-2">Inactive</p>
                        <p className="text-4xl font-black">{stats.inactiveDesigns}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                        <p className="text-orange-100 text-sm mb-2">Categories</p>
                        <p className="text-4xl font-black">{stats.byCategory?.length || 0}</p>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="mb-6">
                <div className="flex gap-2">
                    {['all', 'active', 'inactive'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === tab
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Designs Grid */}
            {designs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <FiImage className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500 text-lg">No designs found</p>
                    <Link
                        to="/admin/designs/create"
                        className="inline-block mt-4 text-purple-600 font-bold hover:underline"
                    >
                        Add Your First Design
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {designs.map((design) => (
                        <div
                            key={design._id}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Image */}
                            <div className="aspect-square bg-gray-100 relative group">
                                <img
                                    src={`http://localhost:5000${design.image}`}
                                    alt={design.name}
                                    className="w-full h-full object-cover"
                                />
                                {!design.isActive && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                                            INACTIVE
                                        </span>
                                    </div>
                                )}
                                {/* Quick Actions Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Link
                                        to={`/admin/designs/${design._id}/edit`}
                                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                                        title="Edit"
                                    >
                                        <FiEdit className="text-gray-700" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(design._id, design.name)}
                                        className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <FiTrash2 className="text-red-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-1 truncate">{design.name}</h3>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                    {design.description || 'No description'}
                                </p>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">
                                        {design.category}
                                    </span>
                                    <span className="text-sm font-black text-purple-600">
                                        +{design.price} EGP
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Used: {design.usageCount || 0}x</span>
                                    <span>{design.tags?.length || 0} tags</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DesignListPage;
