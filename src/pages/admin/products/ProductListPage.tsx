import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import i18n
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { fetchProducts } from '../../../redux/slices/productSlice';
import Button from '../../../components/Button';
import Loader from '../../../components/Loader';
import { FiEdit, FiPlus, FiTrash2, FiSearch, FiPackage, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import api from '../../../utils/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getImageUrl } from '../../../utils/imageUtils';

const MySwal = withReactContent(Swal);

const ProductListPage = () => {
    const { t, i18n } = useTranslation(); // Use hook
    const dispatch = useAppDispatch();
    const { products, loading: reduxLoading, error } = useAppSelector((state) => state.products);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');

    useEffect(() => {
        dispatch(fetchProducts({}));
    }, [dispatch]);

    // Helper to get translated name safely
    const getName = (name: any) => {
        if (!name) return 'Product';
        if (typeof name === 'string') return name;
        return name[i18n.language] || name.en || Object.values(name)[0] || 'Product';
    };



    // Filter products based on search and stock filter
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Updated search logic to handle multilingual names
            const nameToSearch = typeof product.name === 'string'
                ? product.name
                : Object.values(product.name).join(' ');

            const matchesSearch = nameToSearch.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStock = stockFilter === 'all'
                || (stockFilter === 'in-stock' && product.stock > 0)
                || (stockFilter === 'out-of-stock' && product.stock === 0);
            return matchesSearch && matchesStock;
        });
    }, [products, searchTerm, stockFilter]);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = products.length;
        const inStock = products.filter(p => p.stock > 0).length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
        return { total, inStock, outOfStock, totalValue };
    }, [products]);

    const handleDelete = async (id: string, name: any) => {
        const displayName = getName(name);
        const result = await MySwal.fire({
            title: `Delete "${displayName}"?`,
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setDeletingId(id);
            try {
                await api.delete(`/products/${id}`);
                Swal.fire('Deleted!', 'Product has been deleted.', 'success');
                dispatch(fetchProducts({}));
            } catch (err: any) {
                Swal.fire('Error', err.response?.data?.message || 'Failed to delete product', 'error');
            } finally {
                setDeletingId(null);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* ... (Header and Filters omitted for brevity as they don't use name directly except search input which is fine) ... */}

            {/* Header with Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {/* ... existing header logic ... */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-black font-display text-gray-900 mb-1">Products Management</h1>
                        <p className="text-gray-500 text-sm">Manage your product catalog</p>
                    </div>
                    <Button to="/admin/products/create" className="flex items-center gap-2 bg-primary-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        <FiPlus size={20} /> Add Product
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500 text-white p-3 rounded-lg">
                                <FiPackage size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Total Products</p>
                                <p className="text-2xl font-black text-blue-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500 text-white p-3 rounded-lg">
                                <FiPackage size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-green-600 font-bold uppercase tracking-wide">In Stock</p>
                                <p className="text-2xl font-black text-green-900">{stats.inStock}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-500 text-white p-3 rounded-lg">
                                <FiAlertCircle size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-red-600 font-bold uppercase tracking-wide">Out of Stock</p>
                                <p className="text-2xl font-black text-red-900">{stats.outOfStock}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500 text-white p-3 rounded-lg">
                                <FiDollarSign size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-purple-600 font-bold uppercase tracking-wide">Inventory Value</p>
                                <p className="text-2xl font-black text-purple-900">{stats.totalValue.toLocaleString()} EGP</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-900 focus:ring-2 focus:ring-primary-100 transition-all outline-none font-medium"
                        />
                    </div>

                    {/* Stock Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStockFilter('all')}
                            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${stockFilter === 'all'
                                ? 'bg-primary-900 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setStockFilter('in-stock')}
                            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${stockFilter === 'in-stock'
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            In Stock
                        </button>
                        <button
                            onClick={() => setStockFilter('out-of-stock')}
                            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${stockFilter === 'out-of-stock'
                                ? 'bg-red-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Out of Stock
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            {reduxLoading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-20"></div>
                                <div className="h-8 bg-gray-200 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : error ? (
                <div className="text-red-600 bg-red-50 p-6 rounded-2xl border-2 border-red-100 font-semibold">{error}</div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {filteredProducts.length === 0 ? (
                        <div className="p-12 text-center">
                            <FiPackage className="mx-auto text-gray-300 mb-4" size={64} />
                            <p className="text-gray-500 font-medium">
                                {searchTerm || stockFilter !== 'all'
                                    ? 'No products match your filters.'
                                    : 'No products found. Add one to get started!'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-primary-300 transition-all shadow-sm group-hover:shadow-lg">
                                                        <img
                                                            src={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : 'https://via.placeholder.com/64'}
                                                            alt={getName(product.name)}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-primary-900 transition-colors">{getName(product.name)}</p>
                                                        <p className="text-xs text-gray-500 mt-1">ID: {product._id.slice(-8).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-black text-lg text-gray-900">{product.price} EGP</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-200">
                                                    {getName(product.category?.name) || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 ${product.stock > 0
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        to={`/admin/products/${product._id}/edit`}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all font-bold text-sm border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transform hover:scale-105"
                                                        title="Edit"
                                                    >
                                                        <FiEdit size={16} /> Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product._id, product.name)}
                                                        disabled={deletingId === product._id}
                                                        className={`inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all font-bold text-sm border-2 border-red-200 hover:border-red-300 hover:shadow-md transform hover:scale-105 ${deletingId === product._id ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        title="Delete"
                                                    >
                                                        {deletingId === product._id ? <Loader size="sm" /> : <><FiTrash2 size={16} /> Delete</>}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductListPage;
