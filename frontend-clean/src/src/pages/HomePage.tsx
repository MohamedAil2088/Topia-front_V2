import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const featuredProducts = [
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
  ];

  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">مرحباً بك في متجر الرجال</h1>
          <p className="text-xl mb-8">اكتشف أحدث صيحات الموضة الرجالية بأفضل الأسعار</p>
          <div className="flex gap-4 justify-center">
            <Link to="/shop">
              <Button variant="outline" size="lg">
                تسوق الآن
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="secondary" size="lg">
                تصفح الفئات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">شحن سريع</h3>
              <p className="text-gray-600">توصيل مجاني للطلبات فوق 500 جنيه</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">دفع آمن</h3>
              <p className="text-gray-600">طرق دفع متعددة وآمنة 100%</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">إرجاع سهل</h3>
              <p className="text-gray-600">استرجاع مجاني خلال 14 يوم</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">المنتجات المميزة</h2>
            <p className="text-gray-600">تصفح أحدث المنتجات المضافة لمتجرنا</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button variant="primary" size="lg">
                عرض جميع المنتجات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">اشترك في النشرة البريدية</h2>
          <p className="mb-8">احصل على أحدث العروض والخصومات مباشرة على بريدك</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800"
            />
            <Button variant="secondary">اشترك</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
