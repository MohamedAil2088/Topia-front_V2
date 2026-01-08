import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from './components/MainLayout';
import Loader from './components/Loader';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HelmetProvider } from 'react-helmet-async';

// Lazy Load Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const VerifyCodePage = lazy(() => import('./pages/VerifyCodePage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const UserOrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const PurchaseHistoryPage = lazy(() => import('./pages/PurchaseHistoryPage'));
const SavedAddressesPage = lazy(() => import('./pages/SavedAddressesPage'));
const EliteClubPage = lazy(() => import('./pages/EliteClubPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const MyCustomOrdersPage = lazy(() => import('./pages/MyCustomOrdersPage'));
const CustomOrderDetailsPage = lazy(() => import('./pages/CustomOrderDetailsPage'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const DesignGalleryPage = lazy(() => import('./pages/DesignGalleryPage'));
const CustomOrderPage = lazy(() => import('./pages/CustomOrderPage'));

// Admin Pages Lazy Load
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ProductListPage = lazy(() => import('./pages/admin/products/ProductListPage'));
const ProductEditPage = lazy(() => import('./pages/admin/products/ProductEditPage'));
const OrderListPage = lazy(() => import('./pages/admin/OrderListPage'));
const AdminOrderDetailsPage = lazy(() => import('./pages/admin/OrderDetailsPage'));
const UserListPage = lazy(() => import('./pages/admin/UserListPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const CouponListPage = lazy(() => import('./pages/admin/CouponListPage'));
const CategoryListPage = lazy(() => import('./pages/admin/CategoryListPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const AdminCustomOrdersPage = lazy(() => import('./pages/admin/AdminCustomOrdersPage'));
const DesignListPage = lazy(() => import('./pages/admin/designs/DesignListPage'));
const DesignFormPage = lazy(() => import('./pages/admin/designs/DesignFormPage'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader size="lg" />
  </div>
);

function App() {
  const { i18n } = useTranslation();

  // Initialize direction based on saved language
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || 'en';
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, [i18n.language]);

  return (
    <HelmetProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={5000} theme="colored" />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ... existing routes ... */}
            <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
            <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
            <Route path="/forgot-password" element={<MainLayout><ForgotPasswordPage /></MainLayout>} />
            <Route path="/verify-code" element={<MainLayout><VerifyCodePage /></MainLayout>} />
            <Route path="/reset-password" element={<MainLayout><ResetPasswordPage /></MainLayout>} />

            {/* Public Routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/shop" element={<MainLayout><ShopPage /></MainLayout>} />
            <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
            <Route path="/product/:id" element={<MainLayout><ProductDetailsPage /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
            <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
            <Route path="/designs" element={<MainLayout><DesignGalleryPage /></MainLayout>} />
            <Route path="/custom-order" element={<MainLayout><CustomOrderPage /></MainLayout>} />
            <Route path="/order-success" element={<MainLayout><OrderSuccessPage /></MainLayout>} />

            {/* Protected Customer Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
              <Route path="/order/:id" element={<MainLayout><UserOrderDetailsPage /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
              <Route path="/profile/settings" element={<MainLayout><ProfileSettings /></MainLayout>} />
              <Route path="/profile/orders" element={<MainLayout><MyOrdersPage /></MainLayout>} />
              <Route path="/profile/history" element={<MainLayout><PurchaseHistoryPage /></MainLayout>} />
              <Route path="/profile/addresses" element={<MainLayout><SavedAddressesPage /></MainLayout>} />
              <Route path="/elite-club" element={<MainLayout><EliteClubPage /></MainLayout>} />
              <Route path="/custom-orders/my-orders" element={<MainLayout><MyCustomOrdersPage /></MainLayout>} />
              <Route path="/custom-orders/:id" element={<MainLayout><CustomOrderDetailsPage /></MainLayout>} />
            </Route>

            {/* Admin Routes - Protected & Admin Only */}
            <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/create" element={<ProductEditPage />} />
              <Route path="products/:id/edit" element={<ProductEditPage />} />
              <Route path="orders" element={<OrderListPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
              <Route path="users" element={<UserListPage />} />
              <Route path="coupons" element={<CouponListPage />} />
              <Route path="categories" element={<CategoryListPage />} />
              <Route path="custom-orders" element={<AdminCustomOrdersPage />} />
              <Route path="designs" element={<DesignListPage />} />
              <Route path="designs/create" element={<DesignFormPage />} />
              <Route path="designs/:id/edit" element={<DesignFormPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
