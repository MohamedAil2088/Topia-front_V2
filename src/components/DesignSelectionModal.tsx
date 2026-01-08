import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Design {
    _id: string;
    name: string;
    description: string;
    image: string;
    category: string;
    price: number;
    tags: string[];
    isActive: boolean;
}

interface DesignSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (design: Design) => void;
}

const DesignSelectionModal = ({ isOpen, onClose, onSelect }: DesignSelectionModalProps) => {
    const [designs, setDesigns] = useState<Design[]>([]);
    const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('الكل');
    const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

    const categories = ['الكل', 'تيشيرت', 'قميص', 'بنطلون', 'جاكيت', 'اكسسوارات', 'أخرى'];

    useEffect(() => {
        if (isOpen) {
            fetchDesigns();
        }
    }, [isOpen]);

    useEffect(() => {
        filterDesigns();
    }, [designs, searchQuery, selectedCategory]);

    const fetchDesigns = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/designs', {
                params: { isActive: true }
            });

            if (data.success) {
                setDesigns(data.data);
            }
        } catch (error: any) {
            console.error('Error fetching designs:', error);
            toast.error('فشل في تحميل التصاميم');
        } finally {
            setLoading(false);
        }
    };

    const filterDesigns = () => {
        let filtered = [...designs];

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(design =>
                design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Filter by category
        if (selectedCategory !== 'الكل') {
            filtered = filtered.filter(design => design.category === selectedCategory);
        }

        setFilteredDesigns(filtered);
    };

    const handleSelectDesign = (design: Design) => {
        setSelectedDesign(design);
    };

    const handleConfirmSelection = () => {
        if (selectedDesign) {
            onSelect(selectedDesign);
            handleClose();
        }
    };

    const handleClose = () => {
        setSelectedDesign(null);
        setSearchQuery('');
        setSelectedCategory('الكل');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                        <h2 className="text-2xl font-bold text-gray-900">اختر تصميمك المفضل</h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="sticky top-[73px] bg-gray-50 border-b border-gray-200 px-6 py-4 space-y-4 z-10">
                        {/* Search */}
                        <div className="relative">
                            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="ابحث عن تصميم..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedCategory === category
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Designs Grid */}
                    <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredDesigns.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg">لا توجد تصاميم متاحة</p>
                                <p className="text-gray-400 text-sm mt-2">جرب البحث بكلمات أخرى أو اختر فئة مختلفة</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredDesigns.map((design) => (
                                    <div
                                        key={design._id}
                                        onClick={() => handleSelectDesign(design)}
                                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:shadow-lg ${selectedDesign?._id === design._id
                                            ? 'border-blue-600 shadow-lg scale-105'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        {/* Image */}
                                        <div className="aspect-square bg-gray-100">
                                            <img
                                                src={design.image}
                                                alt={design.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Selection Indicator */}
                                        {selectedDesign?._id === design._id && (
                                            <div className="absolute top-2 left-2 bg-blue-600 text-white rounded-full p-2 shadow-lg">
                                                <FiCheck size={20} />
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="p-3 bg-white">
                                            <h3 className="font-semibold text-gray-900 truncate">{design.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{design.category}</p>
                                            <p className="text-lg font-bold text-blue-600 mt-2">
                                                {design.price} جنيه
                                            </p>
                                        </div>

                                        {/* Tags */}
                                        {design.tags.length > 0 && (
                                            <div className="px-3 pb-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {design.tags.slice(0, 2).map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div className="text-gray-600">
                            {selectedDesign ? (
                                <div>
                                    <p className="font-semibold">التصميم المختار: {selectedDesign.name}</p>
                                    <p className="text-sm">سيتم إضافة {selectedDesign.price} جنيه لسعر المنتج</p>
                                </div>
                            ) : (
                                <p>اختر تصميم من القائمة أعلاه</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleConfirmSelection}
                                disabled={!selectedDesign}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <FiCheck size={20} />
                                تأكيد الاختيار
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignSelectionModal;
