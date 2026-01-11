import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiImage, FiType, FiPackage, FiDollarSign, FiSend, FiCheck } from 'react-icons/fi';
import { useAppSelector } from '../hooks/useRedux';
import api from '../utils/api';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';
import getLocalizedName from '../utils/getLocalizedName';
import { getImageUrl } from '../utils/imageUtils';

interface Design {
    _id: string;
    name: string;
    image: string;
    price: number;
}

const CustomOrderPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { userInfo } = useAppSelector(state => state.auth);

    const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        customText: '',
        size: 'M',
        quantity: 1,
        color: 'Black',
        additionalNotes: ''
    });

    useEffect(() => {
        fetchDesigns();
    }, []);

    useEffect(() => {
        const designId = searchParams.get('design');
        if (designId && designs.length > 0) {
            const design = designs.find(d => d._id === designId);
            if (design) {
                setSelectedDesign(design);
            }
        }
    }, [searchParams, designs]);

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/designs');
            if (data.success) {
                setDesigns(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch designs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDesign) {
            Swal.fire('Error', 'Please select a design', 'error');
            return;
        }

        if (!userInfo) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login to place a custom order',
                icon: 'warning',
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        setSubmitting(true);
        try {
            const orderData = {
                design: selectedDesign._id,
                customText: formData.customText,
                size: formData.size,
                quantity: formData.quantity,
                color: formData.color,
                additionalNotes: formData.additionalNotes,
                estimatedPrice: selectedDesign.price * formData.quantity
            };

            await api.post('/custom-orders', orderData);

            Swal.fire({
                title: 'Success!',
                html: `
                    <div class="text-center">
                        <div class="text-6xl mb-4">🎉</div>
                        <p class="text-lg">Your custom order has been submitted!</p>
                        <p class="text-sm text-gray-600 mt-2">We'll review it and get back to you soon.</p>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'View My Orders'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/custom-orders/my-orders');
                }
            });
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to submit order', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const totalPrice = selectedDesign ? selectedDesign.price * formData.quantity : 0;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Custom Order - Topia Men's Store</title>
                <meta name="description" content="Create your personalized custom order with your favorite design" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-black text-gray-900 mb-4">
                            ✨ Create Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Custom Order</span>
                        </h1>
                        <p className="text-xl text-gray-600">
                            Design your perfect piece with our premium customization service
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Form - Left Side */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Design Selection */}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-xl">
                                            <FiImage size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900">Select Design</h2>
                                            <p className="text-sm text-gray-500">Choose from our premium collection</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {designs.map(design => (
                                            <div
                                                key={design._id}
                                                onClick={() => setSelectedDesign(design)}
                                                className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all transform hover:scale-105 ${selectedDesign?._id === design._id
                                                    ? 'border-blue-600 ring-4 ring-blue-200'
                                                    : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                <img
                                                    src={design.image ? getImageUrl(design.image) : ''}
                                                    alt={getLocalizedName(design.name)}
                                                    className="w-full h-40 object-cover"
                                                />
                                                {selectedDesign?._id === design._id && (
                                                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-2">
                                                        <FiCheck size={16} />
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                                    <p className="text-white font-bold text-sm">{getLocalizedName(design.name)}</p>
                                                    <p className="text-white/90 text-xs">{design.price} EGP</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Customization Options */}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl">
                                            <FiType size={24} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900">Customization</h2>
                                            <p className="text-sm text-gray-500">Personalize your order</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Custom Text */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                                Custom Text (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.customText}
                                                onChange={(e) => setFormData({ ...formData, customText: e.target.value })}
                                                placeholder="Enter your custom text..."
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                                            />
                                        </div>

                                        {/* Size & Color */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                                    <FiPackage className="inline mr-2" size={16} />
                                                    Size
                                                </label>
                                                <select
                                                    value={formData.size}
                                                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium"
                                                >
                                                    <option value="XS">XS</option>
                                                    <option value="S">S</option>
                                                    <option value="M">M</option>
                                                    <option value="L">L</option>
                                                    <option value="XL">XL</option>
                                                    <option value="XXL">XXL</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                                    Color
                                                </label>
                                                <select
                                                    value={formData.color}
                                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium"
                                                >
                                                    <option value="Black">⚫ Black</option>
                                                    <option value="White">⚪ White</option>
                                                    <option value="Navy">🔵 Navy</option>
                                                    <option value="Gray">⚪ Gray</option>
                                                    <option value="Red">🔴 Red</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium"
                                            />
                                        </div>

                                        {/* Additional Notes */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                                Additional Notes (Optional)
                                            </label>
                                            <textarea
                                                value={formData.additionalNotes}
                                                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                                                placeholder="Any special requests or requirements..."
                                                rows={4}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary - Right Side */}
                            <div className="lg:col-span-1">
                                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-6 text-white sticky top-24">
                                    <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                                        <FiDollarSign size={28} />
                                        Order Summary
                                    </h3>

                                    {selectedDesign ? (
                                        <div className="space-y-4 mb-6">
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                                <img
                                                    src={selectedDesign.image ? getImageUrl(selectedDesign.image) : ''}
                                                    alt={getLocalizedName(selectedDesign.name)}
                                                    className="w-full h-32 object-cover rounded-lg mb-3"
                                                />
                                                <p className="font-bold text-lg">{getLocalizedName(selectedDesign.name)}</p>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-white/80">Base Price:</span>
                                                    <span className="font-bold">{selectedDesign.price} EGP</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-white/80">Quantity:</span>
                                                    <span className="font-bold">× {formData.quantity}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-white/80">Size:</span>
                                                    <span className="font-bold">{formData.size}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-white/80">Color:</span>
                                                    <span className="font-bold">{formData.color}</span>
                                                </div>
                                            </div>

                                            <div className="border-t border-white/20 pt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xl font-bold">Estimated Total:</span>
                                                    <span className="text-3xl font-black">{totalPrice} <span className="text-lg">EGP</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-white/60">
                                            <p>Please select a design</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!selectedDesign || submitting}
                                        className="w-full bg-white hover:bg-gray-100 text-blue-600 font-black py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        <FiSend className="inline mr-2" size={20} />
                                        {submitting ? 'Submitting...' : 'Place Custom Order'}
                                    </button>

                                    <p className="text-xs text-white/60 mt-4 text-center">
                                        * Final price will be confirmed after review
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CustomOrderPage;
