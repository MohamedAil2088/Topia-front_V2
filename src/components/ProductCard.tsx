
import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiEye, FiStar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { useCurrency } from '../context/CurrencyContext';
import QuickViewModal from './QuickViewModal';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import Swal from 'sweetalert2';

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const { formatPrice } = useCurrency();
    const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
    const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const isInWishlist = wishlistItems.some(item => item && item._id === product._id);

    // Get front and back images
    const frontImage = product.images && product.images.length > 0 ? product.images[0] : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3Ctext fill="%23aaa" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    const backImage = product.images && product.images.length > 1 ? product.images[1] : frontImage;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(addToCart({
            _id: product._id,
            name: product.name,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            price: product.price,
            stock: product.stock,
            qty: 1
        }));

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        Toast.fire({ icon: 'success', title: t('productDetails.addedToCart', 'Added to cart') });
    };

    const handleAddToWishlist = (e: React.MouseEvent) => {
        e.preventDefault();

        // إضافة المنتج الكامل للـ Wishlist (local storage)
        dispatch(addToWishlist({
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            images: product.images,
            category: product.category,
            stock: product.stock
        }));

        if (!isInWishlist) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            Toast.fire({ icon: 'success', title: t('wishlist.addedToWishlist', 'Added to wishlist ❤️') });
        } else {
            // إذا كان موجود، احذفه
            dispatch(removeFromWishlist(product._id));
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            Toast.fire({ icon: 'info', title: t('wishlist.removedFromWishlist', 'Removed from wishlist') });
        }
    };

    return (
        <div className="group relative bg-white dark:bg-[#252525] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
            {/* Image Container */}
            <Link
                to={`/product/${product._id}`}
                className="block relative aspect-[3/4] overflow-hidden bg-gray-100"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Badges */}
                {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1.5 rounded-lg uppercase tracking-tighter z-10 shadow-lg animate-pulse">
                        {t('product.onlyLeft', { count: product.stock })} ⚠️
                    </span>
                )}
                {product.stock === 0 && (
                    <span className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-black px-2 py-1.5 rounded-lg uppercase tracking-tighter z-10 shadow-lg">
                        {t('product.outOfStock')}
                    </span>
                )}

                {/* Front Image */}
                <img
                    src={frontImage}
                    alt={product.name}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
                        }`}
                />

                {/* Back Image (shows on hover) */}
                <img
                    src={backImage}
                    alt={`${product.name} - Back`}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
                        }`}
                />

                {/* Overlay with Actions */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm flex justify-center gap-3">
                    <button
                        onClick={handleAddToCart}
                        className="w-10 h-10 rounded-full bg-primary-900 text-white flex items-center justify-center hover:bg-black transition-colors shadow-lg"
                        title="Add to Cart"
                    >
                        <FiShoppingBag size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }}
                        className="w-10 h-10 rounded-full bg-white text-primary-900 border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg"
                        title="Quick View"
                    >
                        <FiEye size={18} />
                    </button>
                    <button
                        onClick={handleAddToWishlist}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-lg ${isInWishlist
                            ? 'bg-red-500 text-white border-red-500 animate-bounce-short'
                            : 'bg-white text-primary-900 border-gray-200 hover:bg-gray-50'
                            }`}
                        title={isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                    >
                        <FiHeart size={18} className={isInWishlist ? 'fill-current' : ''} />
                    </button>
                </div>
            </Link>

            {isQuickViewOpen && (
                <QuickViewModal
                    product={product}
                    onClose={() => setIsQuickViewOpen(false)}
                />
            )}

            {/* Product Info */}
            <div className="p-4">
                <Link to={`/product/${product._id}`} className="block">
                    <p className="text-xs text-gray-500 mb-1">
                        {typeof product.category?.name === 'object'
                            ? (product.category.name[i18n.language] || product.category.name.en || 'Topia Collection')
                            : (product.category?.name || 'Topia Collection')}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-accent-600 transition-colors">{product.name}</h3>
                </Link>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-primary-900 text-lg">{formatPrice(product.price)}</span>
                    <div className="flex gap-1 text-[8px] text-accent-500">
                        {/* Rating Dots */}
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar key={star} className="fill-current" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
