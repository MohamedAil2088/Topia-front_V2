import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import {
    FiTrash2, FiAlertCircle, FiPercent, FiCopy, FiGift, FiDollarSign,
    FiCalendar, FiCheck, FiX, FiTag, FiRefreshCw, FiPlusCircle
} from 'react-icons/fi';
import api from '../../utils/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Coupon {
    _id: string;
    code: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
    minOrderAmount?: number;
    maxDiscount?: number;
    expiryDate?: string;
    isActive: boolean;
}

const CouponListPage = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Form states
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
    const [minOrderAmount, setMinOrderAmount] = useState('');
    const [maxDiscount, setMaxDiscount] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const fetchCoupons = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get('/coupons');
            setCoupons(data.data || data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load coupons');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = coupons.length;
        const active = coupons.filter(c => {
            if (c.expiryDate && new Date(c.expiryDate) < new Date()) return false;
            return c.isActive;
        }).length;
        const expired = coupons.filter(c => c.expiryDate && new Date(c.expiryDate) < new Date()).length;
        const percentage = coupons.filter(c => c.discountType === 'percentage').length;

        return { total, active, expired, percentage };
    }, [coupons]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const couponData: any = {
                code: code.trim().toUpperCase(),
                discount: Number(discount),
                discountType
            };

            if (minOrderAmount) couponData.minOrderAmount = Number(minOrderAmount);
            if (maxDiscount && discountType === 'percentage') couponData.maxDiscount = Number(maxDiscount);
            if (expiryDate) couponData.expiryDate = expiryDate;

            const { data } = await api.post('/coupons', couponData);
            setCoupons([...coupons, data.data || data]);

            // Reset form
            setCode('');
            setDiscount('');
            setDiscountType('percentage');
            setMinOrderAmount('');
            setMaxDiscount('');
            setExpiryDate('');

            Swal.fire({
                icon: 'success',
                title: 'Coupon Created!',
                text: 'The coupon code has been generated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to create coupon', 'error');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, code: string) => {
        const result = await MySwal.fire({
            title: `Delete Coupon "${code}"?`,
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
                await api.delete(`/coupons/${id}`);
                setCoupons(coupons.filter(c => c._id !== id));
                Swal.fire('Deleted!', 'Coupon has been deleted.', 'success');
            } catch (err: any) {
                Swal.fire('Error', err.response?.data?.message || 'Failed to delete coupon', 'error');
                console.error(err);
            } finally {
                setDeletingId(null);
            }
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        Toast.fire({
            icon: 'success',
            title: 'Code copied to clipboard!'
        });
    };

    const isExpired = (date?: string) => {
        if (!date) return false;
        return new Date(date) < new Date();
    };

    return (
        <div className="space-y-6">
            {/* Statistics Dashboard */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-gray-900 mb-1">Coupons Management</h1>
                    <p className="text-gray-500 text-sm">Create and manage discount coupons</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500 text-white p-3 rounded-lg">
                                <FiGift size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-bold uppercase">Total Coupons</p>
                                <p className="text-3xl font-black text-blue-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500 text-white p-3 rounded-lg">
                                <FiCheck size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-green-600 font-bold uppercase">Active</p>
                                <p className="text-3xl font-black text-green-900">{stats.active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-500 text-white p-3 rounded-lg">
                                <FiX size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-red-600 font-bold uppercase">Expired</p>
                                <p className="text-3xl font-black text-red-900">{stats.expired}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500 text-white p-3 rounded-lg">
                                <FiPercent size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-purple-600 font-bold uppercase">Percentage</p>
                                <p className="text-3xl font-black text-purple-900">{stats.percentage}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Coupon Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                                <FiPlusCircle size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Create Coupon</h2>
                                <p className="text-xs text-gray-500">Add new discount code</p>
                            </div>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <Input
                                label="Coupon Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="e.g. SAVE20"
                                required
                                disabled={submitting}
                            />

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Discount Type</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-bold text-gray-700"
                                    value={discountType}
                                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                                    disabled={submitting}
                                >
                                    <option value="percentage">📊 Percentage (%)</option>
                                    <option value="fixed">💵 Fixed Amount (EGP)</option>
                                </select>
                            </div>

                            <Input
                                label="Discount Value"
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                placeholder={discountType === 'percentage' ? '10' : '50'}
                                required
                                disabled={submitting}
                                min="0"
                                step={discountType === 'percentage' ? '1' : '0.01'}
                            />

                            <Input
                                label="Min Order Amount (EGP) - Optional"
                                type="number"
                                value={minOrderAmount}
                                onChange={(e) => setMinOrderAmount(e.target.value)}
                                placeholder="100"
                                disabled={submitting}
                                min="0"
                            />

                            {discountType === 'percentage' && (
                                <Input
                                    label="Max Discount (EGP) - Optional"
                                    type="number"
                                    value={maxDiscount}
                                    onChange={(e) => setMaxDiscount(e.target.value)}
                                    placeholder="50"
                                    disabled={submitting}
                                    min="0"
                                />
                            )}

                            <Input
                                label="Expiry Date - Optional"
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                disabled={submitting}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                isLoading={submitting}
                                className="bg-green-600 hover:bg-green-700 font-black py-3"
                            >
                                <FiPlusCircle className="inline mr-2" /> Create Coupon
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Coupons List */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="bg-white rounded-2xl p-12 flex justify-center border border-gray-100">
                            <Loader size="lg" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-3">
                            <FiAlertCircle className="text-red-500 mt-0.5" size={20} />
                            <div>
                                <h3 className="font-semibold text-red-900 mb-1">Error Loading Coupons</h3>
                                <p className="text-red-700 text-sm">{error}</p>
                                <Button onClick={fetchCoupons} variant="outline" className="mt-3">
                                    <FiRefreshCw className="inline mr-2" /> Retry
                                </Button>
                            </div>
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                            <FiGift className="mx-auto text-gray-300 mb-4" size={64} />
                            <p className="text-gray-500 font-medium">No coupons created yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {coupons.map((coupon) => {
                                const expired = isExpired(coupon.expiryDate);
                                return (
                                    <div
                                        key={coupon._id}
                                        className={`bg-white rounded-2xl shadow-sm border-2 p-6 transition-all ${expired ? 'border-red-200 opacity-60' : 'border-gray-100 hover:border-primary-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <code className="text-2xl font-black bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 px-5 py-3 rounded-xl border-2 border-primary-200">
                                                        {coupon.code}
                                                    </code>
                                                    <button
                                                        onClick={() => copyCode(coupon.code)}
                                                        className="p-3 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all transform hover:scale-110"
                                                        title="Copy code"
                                                    >
                                                        <FiCopy size={20} />
                                                    </button>
                                                    {expired && (
                                                        <span className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-black rounded-xl border-2 border-red-200">
                                                            ❌ EXPIRED
                                                        </span>
                                                    )}
                                                    {!expired && (
                                                        <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-black rounded-xl border-2 border-green-200">
                                                            ✅ ACTIVE
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <FiPercent size={14} className="text-blue-600" />
                                                            <p className="text-blue-600 text-xs font-bold">Discount</p>
                                                        </div>
                                                        <p className="font-black text-blue-900 text-lg">
                                                            {coupon.discountType === 'percentage'
                                                                ? `${coupon.discount}%`
                                                                : `${coupon.discount} EGP`}
                                                        </p>
                                                    </div>

                                                    {coupon.minOrderAmount && (
                                                        <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <FiDollarSign size={14} className="text-green-600" />
                                                                <p className="text-green-600 text-xs font-bold">Min Order</p>
                                                            </div>
                                                            <p className="font-black text-green-900 text-lg">{coupon.minOrderAmount} EGP</p>
                                                        </div>
                                                    )}

                                                    {coupon.maxDiscount && (
                                                        <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <FiTag size={14} className="text-orange-600" />
                                                                <p className="text-orange-600 text-xs font-bold">Max Discount</p>
                                                            </div>
                                                            <p className="font-black text-orange-900 text-lg">{coupon.maxDiscount} EGP</p>
                                                        </div>
                                                    )}

                                                    {coupon.expiryDate && (
                                                        <div className={`p-3 rounded-xl border ${expired ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-200'}`}>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <FiCalendar size={14} className={expired ? 'text-red-600' : 'text-purple-600'} />
                                                                <p className={`text-xs font-bold ${expired ? 'text-red-600' : 'text-purple-600'}`}>Expires</p>
                                                            </div>
                                                            <p className={`font-black text-lg ${expired ? 'text-red-900' : 'text-purple-900'}`}>
                                                                {new Date(coupon.expiryDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(coupon._id, coupon.code)}
                                                className="ml-4 inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-sm transition-all border-2 border-red-200 hover:border-red-300 hover:shadow-md transform hover:scale-105"
                                                disabled={deletingId === coupon._id}
                                                title="Delete coupon"
                                            >
                                                {deletingId === coupon._id ? <Loader size="sm" /> : <><FiTrash2 size={16} /> Delete</>}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouponListPage;
