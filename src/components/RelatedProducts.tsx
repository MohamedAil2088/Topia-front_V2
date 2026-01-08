import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Loader from './Loader';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    images?: string[]; // Add optional images array
    category: {
        _id: string;
        name: string;
    };
}

interface RelatedProductsProps {
    productId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId }) => {
    const { t } = useTranslation();
    const { formatPrice } = useCurrency();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/products/${productId}/related`);
                setProducts(data.data);
            } catch (error) {
                console.error("Failed to fetch related products", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchRelated();
        }
    }, [productId]);

    const PLACEHOLDER_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="%23f3f4f6" width="300" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

    if (loading) return <Loader />;

    if (products.length === 0) return null;

    return (
        <div className="mt-16 border-t pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('productDetails.youMayAlsoLike', 'You may also like')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link key={product._id} to={`/product/${product._id}`} className="group relative block overflow-hidden rounded-xl bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="relative h-[250px] sm:h-[300px] w-full bg-gray-100 overflow-hidden">
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0] : (product.image || PLACEHOLDER_IMG)}
                                alt={product.name}
                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== PLACEHOLDER_IMG) {
                                        target.src = PLACEHOLDER_IMG;
                                    }
                                }}
                            />
                        </div>

                        <div className="relative p-4">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                {product.name}
                            </h3>

                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-lg font-bold text-gray-900">
                                    {formatPrice(product.price)}
                                </p>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {(() => {
                                        const catName = typeof product.category === 'object' ? product.category?.name : product.category;
                                        const safeCatName = String(catName || 'Men');
                                        return t(`categories.${safeCatName.toLowerCase()}`, safeCatName);
                                    })()}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
