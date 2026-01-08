import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const cartItemsCount = 0;
  const isLoggedIn = false;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-primary">
              MEN'S SHOP
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-primary transition">
                الرئيسية
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-primary transition">
                المتجر
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-primary transition">
                الفئات
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary transition">
                من نحن
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary transition">
                اتصل بنا
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ابحث عن المنتجات..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <FiShoppingCart className="text-2xl text-gray-700" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FiUser className="text-2xl text-gray-700" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        الملف الشخصي
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        طلباتي
                      </Link>
                      <button className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100">
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        تسجيل الدخول
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        إنشاء حساب
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
            >
              {isMobileMenuOpen ? (
                <FiX className="text-2xl text-gray-700" />
              ) : (
                <FiMenu className="text-2xl text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن المنتجات..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                to="/shop"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                المتجر
              </Link>
              <Link
                to="/categories"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الفئات
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                من نحن
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                اتصل بنا
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
