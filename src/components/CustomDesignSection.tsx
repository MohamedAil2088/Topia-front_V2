import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPenTool } from 'react-icons/fi';
import api from '../utils/api';
import Loader from './Loader';
import ProductCard from './ProductCard';

const CustomDesignSection = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomProducts();
    }, []);

    const fetchCustomProducts = async () => {
        try {
            const { data } = await api.get('/products');
            // Filter products that allow customization
            console.log('API Response for Custom Products:', data);
            const customProducts = (data.data || data.products || [])
                .filter((p: any) => p.isCustomizable)
                .slice(0, 4); // Show 4 products
            console.log('Filtered Custom Products:', customProducts);
            setProducts(customProducts);
        } catch (error) {
            console.error('Error fetching custom products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Don't show section if no custom products
    if (!loading && products.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-6">
                {/* Header - Same style as Best Sellers */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FiPenTool className="text-purple-600" size={24} />
                            <span className="text-sm font-bold text-purple-600 uppercase tracking-wider">Custom Design</span>
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">
                            Design Your Own Style
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Upload your designs and create custom-printed apparel
                        </p>
                    </div>
                    <Link
                        to="/shop"
                        className="hidden md:flex items-center gap-2 text-gray-900 dark:text-white font-bold hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
                    >
                        View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Products Grid - Same as Best Sellers */}
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <div key={product._id} className="relative">
                                {/* Custom Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                        <FiPenTool size={12} />
                                        <span>CUSTOMIZABLE</span>
                                    </div>
                                </div>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Mobile View All Button */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-bold hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                        View All <FiArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CustomDesignSection;
