import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MEN'S SHOP</h3>
            <p className="text-gray-400 mb-4">
              متجرك الأول لأحدث صيحات الموضة الرجالية. نوفر لك أفضل المنتجات بأسعار تنافسية.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiTwitter className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-white transition">
                  المتجر
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white transition">
                  الفئات
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">حسابي</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition">
                  الملف الشخصي
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white transition">
                  طلباتي
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white transition">
                  سلة التسوق
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-white transition">
                  المفضلة
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <FiMapPin className="text-primary" />
                <span>القاهرة، مصر</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <FiPhone className="text-primary" />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <FiMail className="text-primary" />
                <span>info@mensshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>&copy; 2024 MEN'S SHOP. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
