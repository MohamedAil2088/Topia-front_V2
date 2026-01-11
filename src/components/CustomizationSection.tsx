import { useState } from 'react';
import { FiUpload, FiX, FiCheck, FiLayout } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Button from './Button';
import DesignSelectionModal from './DesignSelectionModal';
import getLocalizedName from '../utils/getLocalizedName';
import { getImageUrl } from '../utils/imageUtils';

interface CustomizationSectionProps {
    product: any;
    onAddToCart: (customization: any) => void;
}

const CustomizationSection = ({ product, onAddToCart }: CustomizationSectionProps) => {
    const [orderType, setOrderType] = useState<'plain' | 'custom'>('plain');
    const [designSource, setDesignSource] = useState<'upload' | 'template'>('upload');
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    const [selectedDesign, setSelectedDesign] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [printLocation, setPrintLocation] = useState('front');
    const [printSize, setPrintSize] = useState('medium');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [designNotes, setDesignNotes] = useState('');
    const [uploading, setUploading] = useState(false);

    // حساب السعر
    const calculatePrice = () => {
        let total = product.price;

        if (orderType === 'custom') {
            // إضافة سعر التصميم الجاهز إذا تم اختياره
            if (designSource === 'template' && selectedDesign) {
                total += selectedDesign.price;
            }

            // سعر الطباعة حسب الموقع
            if (printLocation === 'front') {
                total += product.customizationPricing?.frontPrint || 80;
            } else if (printLocation === 'back') {
                total += product.customizationPricing?.backPrint || 80;
            } else if (printLocation === 'both') {
                total += product.customizationPricing?.bothSides || 150;
            }

            // سعر الحجم
            if (printSize === 'small') {
                total += product.customizationPricing?.smallSize || 0;
            } else if (printSize === 'medium') {
                total += product.customizationPricing?.mediumSize || 20;
            } else if (printSize === 'large') {
                total += product.customizationPricing?.largeSize || 40;
            }
        }

        return total;
    };

    // رفع الصور
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // التحقق من تسجيل الدخول
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) {
            toast.warning('يرجى تسجيل الدخول أولاً لرفع الصور');
            return;
        }

        const userInfo = JSON.parse(userInfoStr);
        const token = userInfo?.token;

        if (!token) {
            toast.error('جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى');
            return;
        }

        // التحقق من الحد الأقصى (5 صور)
        if (uploadedImages.length + files.length > 5) {
            toast.warning('يمكنك رفع 5 صور كحد أقصى');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('designImages', file);
            });

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/custom-orders/upload-images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'فشل رفع الصور');
            }

            const data = await response.json();

            if (data.success) {
                setUploadedImages([...uploadedImages, ...data.data]);
                toast.success('تم رفع الصور بنجاح! ✨');
            } else {
                toast.error('فشل رفع الصور');
            }
        } catch (error: any) {
            console.error('Error uploading images:', error);
            toast.error(error.message || 'حدث خطأ أثناء رفع الصور');
        } finally {
            setUploading(false);
        }
    };

    // حذف صورة
    const removeImage = (index: number) => {
        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    };

    // Handle design selection from modal
    const handleDesignSelect = (design: any) => {
        setSelectedDesign(design);
    };

    // إضافة للعربة
    const handleSubmit = () => {
        if (orderType === 'custom') {
            // التحقق من وجود تصميم (مرفوع أو مختار)
            if (designSource === 'upload' && uploadedImages.length === 0) {
                toast.warning('الرجاء رفع صورة واحدة على الأقل للتصميم');
                return;
            }
            if (designSource === 'template' && !selectedDesign) {
                toast.warning('الرجاء اختيار تصميم من القوالب المتاحة');
                return;
            }
        }

        const customization = orderType === 'custom' ? {
            designImages: designSource === 'upload' ? uploadedImages : [],
            selectedDesign: designSource === 'template' ? selectedDesign : null,
            printLocation,
            printSize,
            specialInstructions,
            designNotes
        } : null;

        onAddToCart({
            type: orderType,
            customization,
            totalPrice: calculatePrice()
        });
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Product Options</h3>

            {/* اختيار نوع الطلب */}
            <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Order Type:</p>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setOrderType('plain')}
                        className={`p-4 rounded-xl border-2 transition-all ${orderType === 'plain'
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="font-bold text-gray-900 dark:text-white">Plain</p>
                                <p className="text-xs text-gray-500">Buy as is</p>
                            </div>
                            {orderType === 'plain' && <FiCheck className="text-primary-600" size={20} />}
                        </div>
                    </button>

                    <button
                        onClick={() => setOrderType('custom')}
                        className={`p-4 rounded-xl border-2 transition-all ${orderType === 'custom'
                            ? 'border-accent-600 bg-accent-50 dark:bg-accent-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="font-bold text-gray-900 dark:text-white">Custom Design 🎨</p>
                                <p className="text-xs text-gray-500">Upload your design</p>
                            </div>
                            {orderType === 'custom' && <FiCheck className="text-accent-600" size={20} />}
                        </div>
                    </button>
                </div>
            </div>

            {/* خيارات التخصيص */}
            {orderType === 'custom' && (
                <div className="space-y-6 animate-fade-in">
                    {/* اختيار مصدر التصميم */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            Design Source
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setDesignSource('upload');
                                    setSelectedDesign(null);
                                }}
                                className={`p-4 rounded-xl border-2 transition-all ${designSource === 'upload'
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <FiUpload /> Upload Design
                                        </p>
                                        <p className="text-xs text-gray-500">Upload your own images</p>
                                    </div>
                                    {designSource === 'upload' && <FiCheck className="text-blue-600" size={20} />}
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setDesignSource('template');
                                    setUploadedImages([]);
                                }}
                                className={`p-4 rounded-xl border-2 transition-all ${designSource === 'template'
                                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <FiLayout /> Choose Template
                                        </p>
                                        <p className="text-xs text-gray-500">Select from our designs</p>
                                    </div>
                                    {designSource === 'template' && <FiCheck className="text-purple-600" size={20} />}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* رفع الصور */}
                    {designSource === 'upload' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                Upload Design Images (Max 5)
                            </label>

                            {/* Grid الصور المرفوعة */}
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                {uploadedImages.map((img, index) => (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        <img src={getImageUrl(img.url)} alt={`Design ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* زر الرفع */}
                            {uploadedImages.length < 5 && (
                                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-600 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                    <FiUpload className="text-gray-400" />
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        {uploading ? 'Uploading...' : 'Click to upload or drag & drop'}
                                    </span>
                                </label>
                            )}
                            <p className="text-xs text-gray-500 mt-2">Accepted: JPG, PNG, GIF, PDF (Max 10MB each)</p>
                        </div>
                    )}

                    {/* اختيار التصميم من القوالب */}
                    {designSource === 'template' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                Choose Design Template
                            </label>

                            {selectedDesign ? (
                                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border-2 border-purple-600">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={selectedDesign.image ? getImageUrl(selectedDesign.image) : ''}
                                            alt={getLocalizedName(selectedDesign.name)}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{getLocalizedName(selectedDesign.name)}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{selectedDesign.description}</p>
                                            <p className="text-lg font-bold text-purple-600 mt-2">+{selectedDesign.price} EGP</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            Change Design
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-600 transition-colors flex items-center justify-center gap-3"
                                >
                                    <FiLayout className="text-gray-400" size={24} />
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Click to browse design templates
                                    </span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* موقع الطباعة */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Print Location</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'front', label: 'Front Only', price: product.customizationPricing?.frontPrint || 80 },
                                { value: 'back', label: 'Back Only', price: product.customizationPricing?.backPrint || 80 },
                                { value: 'both', label: 'Both Sides', price: product.customizationPricing?.bothSides || 150 }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setPrintLocation(option.value)}
                                    className={`p-3 rounded-lg border-2 transition-all ${printLocation === option.value
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{option.label}</p>
                                    <p className="text-xs text-gray-500">+{option.price} EGP</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* حجم الطباعة */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Print Size</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'small', label: 'Small', size: '15x15 cm', price: product.customizationPricing?.smallSize || 0 },
                                { value: 'medium', label: 'Medium', size: '20x20 cm', price: product.customizationPricing?.mediumSize || 20 },
                                { value: 'large', label: 'Large', size: '30x30 cm', price: product.customizationPricing?.largeSize || 40 }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setPrintSize(option.value)}
                                    className={`p-3 rounded-lg border-2 transition-all ${printSize === option.value
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{option.label}</p>
                                    <p className="text-xs text-gray-500">{option.size}</p>
                                    <p className="text-xs text-gray-500">+{option.price} EGP</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ملاحظات */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Special Instructions for Printing
                        </label>
                        <textarea
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            placeholder="e.g., Please center the logo, make colors bright..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            rows={3}
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">{specialInstructions.length}/500</p>
                    </div>

                    {/* تفاصيل إضافية */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Additional Design Notes (Optional)
                        </label>
                        <textarea
                            value={designNotes}
                            onChange={(e) => setDesignNotes(e.target.value)}
                            placeholder="Any other details about your design..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            rows={2}
                            maxLength={1000}
                        />
                        <p className="text-xs text-gray-500 mt-1">{designNotes.length}/1000</p>
                    </div>
                </div>
            )}

            {/* ملخص السعر */}
            <div className="mt-6 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Base Price:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{product.price} EGP</span>
                </div>
                {orderType === 'custom' && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Print Cost:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                            +{calculatePrice() - product.price} EGP
                        </span>
                    </div>
                )}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                    <span className="font-black text-gray-900 dark:text-white">Total:</span>
                    <span className="text-2xl font-black text-primary-600">{calculatePrice()} EGP</span>
                </div>
            </div>

            {/* زر الإضافة */}
            <Button
                onClick={handleSubmit}
                fullWidth
                className="mt-6"
                disabled={
                    orderType === 'custom' &&
                    ((designSource === 'upload' && uploadedImages.length === 0) ||
                        (designSource === 'template' && !selectedDesign))
                }
            >
                {orderType === 'custom' ? 'Order Custom Design 🎨' : 'Add to Cart'}
            </Button>

            {/* Design Selection Modal */}
            <DesignSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleDesignSelect}
            />
        </div>
    );
};

export default CustomizationSection;
