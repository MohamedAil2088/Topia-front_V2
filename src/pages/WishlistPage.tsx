import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

const WishlistPage: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { items } = useAppSelector((state) => state.wishlist);

    const handleRemove = (id: string) => {
        dispatch(removeFromWishlist(id));

        Swal.fire({
            icon: 'info',
            title: t('wishlist.removedFromWishlist', 'Removed from Wishlist'),
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
    };

    const handleMoveToCart = (product: any) => {
        dispatch(addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            stock: product.stock,
            qty: 1
        }));
        dispatch(removeFromWishlist(product._id));

        Swal.fire({
            icon: 'success',
            title: 'Moved to Cart!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl pt-32">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                    <FiHeart size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-display text-gray-900">
                        💝 {t('wishlist.title')}
                    </h1>
                    <p className="text-gray-500">{t('wishlist.empty')}</p>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <FiHeart size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('wishlist.emptyTitle', 'Your wishlist is empty')}</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">{t('wishlist.emptySubset', 'Explore our premium collection and save the items you love for later.')}</p>
                    <Link to="/shop" className="inline-flex items-center gap-2 bg-primary-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200">
                        {t('cart.continueShopping')} <FiShoppingBag />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <div key={item._id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                            <div className="relative aspect-[4/5] overflow-hidden shrink-0">
                                <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <button
                                    onClick={() => handleRemove(item._id)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all transform scale-0 group-hover:scale-100"
                                    title="Remove"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <Link to={`/product/${item._id}`}>
                                    <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight line-clamp-2 h-14" title={item.name}>
                                        {item.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-2xl font-black text-primary-900">{item.price} EGP</span>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.stock > 0 ? t('product.inStock') : t('product.outOfStock')}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleMoveToCart(item)}
                                    disabled={item.stock === 0}
                                    className="w-full mt-auto flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-200"
                                >
                                    <FiShoppingBag size={20} /> {t('wishlist.moveToCart')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
