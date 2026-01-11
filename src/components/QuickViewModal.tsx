import { useState } from 'react';
import { FiX, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useRedux';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getLocalizedName } from '../utils/getLocalizedName';

interface QuickViewModalProps {
    product: any;
    onClose: () => void;
}

const QuickViewModal = ({ product, onClose }: QuickViewModalProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [added, setAdded] = useState(false);

    if (!product) return null;

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.warning(t('quickView.selectSizeColor'), {
                position: 'top-center',
                autoClose: 3000,
            });
            return;
        }
        dispatch(addToCart({
            ...product,
            qty: 1,
            size: selectedSize,
            color: selectedColor
        }));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-4xl bg-white dark:bg-[#252525] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px] animate-scale-up">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-black/50 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <FiX size={24} className="text-gray-900 dark:text-white" />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative group">
                    <img
                        src={product.images[0]}
                        alt={getLocalizedName(product.name)}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                    <div className="mb-6">
                        <Link to={`/product/${product._id}`} className="hover:underline">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 font-display uppercase tracking-tight">{getLocalizedName(product.name)}</h2>
                        </Link>
                        <p className="text-xl font-bold text-gray-500 dark:text-gray-400">{product.price} {t('common.currency')}</p>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-8 leading-relaxed line-clamp-3">
                        {product.description}
                    </p>

                    <div className="space-y-6 mb-8">
                        <div>
                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest block mb-3">{t('quickView.selectSize')}</span>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes?.map((size: string) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 flex items-center justify-center rounded-xl text-sm font-bold border-2 transition-all
                                            ${selectedSize === size
                                                ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest block mb-3">{t('quickView.selectColor')}</span>
                            <div className="flex flex-wrap gap-2">
                                {product.colors?.map((color: string) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all capitalize
                                            ${selectedColor === color
                                                ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={added}
                            className={`flex-1 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2
                                ${added
                                    ? 'bg-green-500 text-white'
                                    : 'bg-primary-900 text-white hover:bg-black shadow-lg shadow-primary-900/20'
                                }`}
                        >
                            {added ? (
                                <>
                                    <FiCheck size={20} /> {t('quickView.added')}
                                </>
                            ) : (
                                <>
                                    <FiShoppingCart size={18} /> {t('quickView.addToCart')}
                                </>
                            )}
                        </button>
                        <Link
                            to={`/product/${product._id}`}
                            className="px-6 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm uppercase tracking-widest hover:border-gray-900 dark:hover:border-white transition-all text-gray-900 dark:text-white"
                        >
                            {t('quickView.fullDetails')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
