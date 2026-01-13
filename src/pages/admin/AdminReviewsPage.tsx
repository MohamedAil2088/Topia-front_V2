import { useEffect, useState } from 'react';
import { FiStar, FiCheck, FiX, FiEye, FiEyeOff, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { getLocalizedName } from '../../utils/getLocalizedName';
import { getImageUrl } from '../../utils/imageUtils';

interface Review {
    _id: string;
    rating: number;
    comment: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    product: {
        _id: string;
        name: string;
        images: string[];
    };
    approved: boolean;
    featured: boolean;
    hidden: boolean;
    createdAt: string;
}

const AdminReviewsPage = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/admin/reviews?filter=${filter}&page=${page}`);
            setReviews(data.data);
            setPages(data.pages);
            setTotal(data.total);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [filter, page]);

    const handleApprove = async (reviewId: string, currentStatus: boolean) => {
        try {
            await api.put(`/admin/reviews/${reviewId}/approve`, { approved: !currentStatus });
            toast.success(currentStatus ? 'Approval cancelled' : 'Review approved');
            fetchReviews();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleFeature = async (reviewId: string, currentStatus: boolean) => {
        try {
            await api.put(`/admin/reviews/${reviewId}/feature`, { featured: !currentStatus });
            toast.success(currentStatus ? 'Feature removed' : 'Review featured');
            fetchReviews();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleHide = async (reviewId: string, currentStatus: boolean) => {
        try {
            await api.put(`/admin/reviews/${reviewId}/hide`, { hidden: !currentStatus });
            toast.success(currentStatus ? 'Review shown' : 'Review hidden');
            fetchReviews();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleDelete = async (reviewId: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This review will be permanently deleted',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/reviews/${reviewId}`);
                toast.success('Review deleted');
                fetchReviews();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to delete review');
            }
        }
    };

    const filteredReviews = reviews.filter(review => {
        // Skip reviews with deleted user or product
        if (!review.user || !review.product) return false;

        const userName = review.user.name?.toLowerCase() || '';
        const productName = getLocalizedName(review.product.name)?.toLowerCase() || '';
        const comment = review.comment?.toLowerCase() || '';
        const term = searchTerm.toLowerCase();

        return userName.includes(term) || productName.includes(term) || comment.includes(term);
    });

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Reviews Management ⭐</h1>
                    <p className="text-gray-600">Manage and moderate customer reviews</p>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Filter Tabs */}
                        <div className="flex gap-2 flex-wrap">
                            {['all', 'approved', 'unapproved', 'featured', 'hidden'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${filter === f
                                        ? 'bg-primary-900 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {f === 'all' && '🔵 All'}
                                    {f === 'approved' && '✅ Approved'}
                                    {f === 'unapproved' && '⏳ Pending Approval'}
                                    {f === 'featured' && '⭐ Featured'}
                                    {f === 'hidden' && '🚫 Hidden'}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-auto">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none"
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="text-gray-600">
                            <strong className="text-gray-900">{total}</strong> total reviews
                        </span>
                    </div>
                </div>

                {/* Reviews List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-900 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-400 text-lg">No reviews found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReviews.map((review) => (
                            <div
                                key={review._id}
                                className={`bg-white rounded-2xl shadow-sm border-2 p-6 transition-all hover:shadow-md ${review.featured ? 'border-yellow-400 bg-yellow-50/50' :
                                    review.hidden ? 'border-red-200 bg-red-50/50' :
                                        review.approved ? 'border-green-200' : 'border-gray-200'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                                        <img
                                            src={review.product?.images && review.product.images[0] ? getImageUrl(review.product.images[0]) : ''}
                                            alt={getLocalizedName(review.product.name)}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        {/* Product & User Info */}
                                        <div className="mb-3">
                                            <h3 className="font-bold text-gray-900 mb-1">{getLocalizedName(review.product.name)}</h3>
                                            <p className="text-sm text-gray-500">
                                                By: <strong>{review.user.name}</strong> ({review.user.email})
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                                            </p>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar
                                                    key={i}
                                                    className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                        }`}
                                                    size={18}
                                                />
                                            ))}
                                            <span className="ml-2 font-bold text-gray-900">{review.rating}/5</span>
                                        </div>

                                        {/* Comment */}
                                        <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                                        {/* Status Badges */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {review.approved && (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                    ✅ Approved
                                                </span>
                                            )}
                                            {!review.approved && (
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                                                    ⏳ Pending Approval
                                                </span>
                                            )}
                                            {review.featured && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                                    ⭐ Featured
                                                </span>
                                            )}
                                            {review.hidden && (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                    🚫 Hidden
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleApprove(review._id, review.approved)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${review.approved
                                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                                                    }`}
                                            >
                                                <FiCheck size={16} />
                                                {review.approved ? 'Unapprove' : 'Approve'}
                                            </button>

                                            <button
                                                onClick={() => handleFeature(review._id, review.featured)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${review.featured
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <FiStar size={16} />
                                                {review.featured ? 'Unfeature' : 'Feature'}
                                            </button>

                                            <button
                                                onClick={() => handleHide(review._id, review.hidden)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${review.hidden
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {review.hidden ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                                                {review.hidden ? 'Show' : 'Hide'}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg"
                                            >
                                                <FiTrash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {[...Array(pages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i + 1
                                    ? 'bg-primary-900 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviewsPage;
