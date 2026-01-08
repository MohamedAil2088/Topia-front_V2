import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiUsers, FiShoppingBag, FiSettings, FiLogOut, FiMenu, FiX, FiTag, FiList, FiPenTool, FiImage, FiUser, FiHome, FiStar } from 'react-icons/fi';
import { useAppDispatch } from '../hooks/useRedux';
import { logout } from '../redux/slices/authSlice';
// Socket.IO removed to improve performance
import Swal from 'sweetalert2';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Socket.IO real-time notifications disabled for better performance
    // Can be re-enabled in production if needed

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', icon: FiGrid, path: '/admin/dashboard' },
        { name: 'Products', icon: FiBox, path: '/admin/products' },
        { name: 'Categories', icon: FiList, path: '/admin/categories' },
        { name: 'Orders', icon: FiShoppingBag, path: '/admin/orders' },
        { name: 'Custom Orders', icon: FiPenTool, path: '/admin/custom-orders' },
        { name: 'Designs', icon: FiImage, path: '/admin/designs' },
        { name: 'Reviews', icon: FiStar, path: '/admin/reviews' },
        { name: 'Users', icon: FiUsers, path: '/admin/users' },
        { name: 'Coupons', icon: FiTag, path: '/admin/coupons' },
        { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white flex-shrink-0">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold font-display cursor-pointer" onClick={() => navigate('/')}>
                        TOPIA<span className="text-primary-500">.</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="mr-3" size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors"
                    >
                        <FiLogOut className="mr-3" size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Sidebar - Mobile */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-display">TOPIA.</h2>
                    <button onClick={() => setSidebarOpen(false)}><FiX size={24} /></button>
                </div>
                {/* Same Nav as Desktop */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-lg ${location.pathname.startsWith(item.path) ? 'bg-primary-600' : 'text-gray-400'}`}
                        >
                            <item.icon className="mr-3" size={20} />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
                    <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600">
                        <FiMenu size={24} />
                    </button>
                    <div className="text-gray-500 text-sm hidden md:block">
                        Welcome back, Admin
                    </div>

                    {/* User Menu */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 hover:bg-gray-50 rounded-xl p-2 transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                A
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden md:block">Admin</span>
                        </button>

                        {/* Dropdown Menu */}
                        {userMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in zoom-in">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-bold text-gray-900">Admin</p>
                                    <p className="text-xs text-gray-500">admin@topia.com</p>
                                </div>

                                <Link
                                    to="/"
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    <FiHome size={18} />
                                    <span className="font-medium">View Store</span>
                                </Link>

                                <Link
                                    to="/admin/settings"
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    <FiUser size={18} />
                                    <span className="font-medium">Profile Settings</span>
                                </Link>

                                <div className="border-t border-gray-100 mt-2 pt-2">
                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                                    >
                                        <FiLogOut size={18} />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
