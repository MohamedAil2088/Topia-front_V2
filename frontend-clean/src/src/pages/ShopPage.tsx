import { useState } from 'react';
import ProductCard from '../components/product/ProductCard';

const ShopPage = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: '1',
      name: 'قميص كاجوال رجالي',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
      rating: 4,
      category: 'قمصان',
      isNew: true,
    },
    {
      id: '2',
      name: 'بنطلون جينز أزرق',
      price: 499.99,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
      rating: 5,
      category: 'بناطيل',
      discount: 20,
    },
    {
      id: '3',
      name: 'جاكيت جلد كلاسيكي',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
      rating: 4,
      category: 'جاكيتات',
    },
    {
      id: '4',
      name: 'حذاء رياضي عصري',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
      rating: 5,
      category: 'أحذية',
      isNew: true,
      discount: 15,
    },
    {
      id: '5',
      name: 'تيشيرت قطن',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
      rating: 4,
      category: 'قمصان',
    },
    {
      id: '6',
      name: 'بدلة رسمية',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500',
      rating: 5,
      category: 'بدل',
      isNew: true,
    },
  ];

  const categories = ['الكل', 'قمصان', 'بناطيل', 'جاكيتات', 'أحذية', 'بدل'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">المتجر</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">الفئات</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-right px-3 py-2 rounded transition ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">السعر</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>{priceRange[0]} ج.م</span>
                  <span>{priceRange[1]} ج.م</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">التقييم</h3>
              <div className="space-y-2">
                {[5, 4, 3].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{rating} نجوم فأكثر</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">عرض {products.length} منتج</p>
            <select className="border border-gray-300 rounded-lg px-4 py-2">
              <option>الأحدث</option>
              <option>الأعلى سعراً</option>
              <option>الأقل سعراً</option>
              <option>الأعلى تقييماً</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              السابق
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
