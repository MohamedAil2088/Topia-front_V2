import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useRedux';
import api from '../utils/api';
import Loader from '../components/Loader';
import { FiUser, FiPackage, FiMapPin, FiClock, FiChevronRight, FiPlus, FiTrash2, FiEdit3, FiCheck, FiHome } from 'react-icons/fi';
import Swal from 'sweetalert2';

interface Address {
    _id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
}

const SavedAddressesPage = () => {
    const { t } = useTranslation();
    const { userInfo } = useAppSelector((state) => state.auth);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('Egypt');
    const [isDefault, setIsDefault] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users/address');
            setAddresses(data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const addressData = { street, city, state, zipCode, country, isDefault };

            if (editingId) {
                await api.put(`/users/address/${editingId}`, addressData);
                Swal.fire({ icon: 'success', title: t('addresses.form.successUpdate'), toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
            } else {
                await api.post('/users/address', addressData);
                Swal.fire({ icon: 'success', title: t('addresses.form.successAdd'), toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
            }

            resetForm();
            fetchAddresses();
        } catch (err: any) {
            Swal.fire({ icon: 'error', title: t('addresses.form.error'), text: err.response?.data?.message || t('addresses.form.error') });
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: t('addresses.delete.title'),
            text: t('addresses.delete.text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            cancelButtonColor: '#d33',
            confirmButtonText: t('addresses.delete.confirm'),
            cancelButtonText: t('addresses.form.cancel')
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/users/address/${id}`);
                fetchAddresses();
                Swal.fire({ icon: 'success', title: t('addresses.delete.success'), toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
            } catch (err) {
                Swal.fire({ icon: 'error', title: t('addresses.delete.error'), text: t('addresses.delete.error') });
            }
        }
    };

    const handleEdit = (address: Address) => {
        setStreet(address.street);
        setCity(address.city);
        setState(address.state);
        setZipCode(address.zipCode);
        setCountry(address.country);
        setIsDefault(address.isDefault);
        setEditingId(address._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setStreet('');
        setCity('');
        setState('');
        setZipCode('');
        setCountry('Egypt');
        setIsDefault(false);
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 py-12 pt-40">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black font-display text-primary-900 tracking-tight">{t('addresses.title')}</h1>
                        <p className="text-gray-500 font-medium mt-1">{t('addresses.subtitle')}</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-primary-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-primary-900/20 active:scale-95"
                        >
                            <FiPlus /> {t('addresses.addBtn')}
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Menu - Synced with Profile */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden sticky top-32">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-900 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-primary-900/20">
                                        {userInfo?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-black text-gray-900 truncate">{userInfo?.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t('orders.verifiedMember')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4">
                                <Link to="/profile" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiUser /> {t('orders.profileOverview')}</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/orders" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiPackage /> {t('navbar.myOrders')}</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/history" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiClock /> {t('orders.purchaseHistory')}</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/addresses" className="flex items-center justify-between px-6 py-4 text-primary-700 bg-primary-50/50 border-r-4 border-primary-900 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiMapPin /> {t('orders.savedAddresses')}</span>
                                    <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-3/4 space-y-8">
                        {showForm && (
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden animate-fade-in">
                                <div className="p-8 md:p-10 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="text-2xl font-black text-gray-900">{editingId ? t('addresses.form.titleEdit') : t('addresses.form.titleNew')}</h3>
                                    <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition-colors">
                                        {t('addresses.form.cancel')}
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Street Address</label>
                                            <input
                                                required
                                                value={street}
                                                onChange={(e) => setStreet(e.target.value)}
                                                className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-900 transition-all font-bold"
                                                placeholder="e.g. 123 Fashion Ave"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('addresses.form.city')}</label>
                                            <input
                                                required
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-900 transition-all font-bold"
                                                placeholder="e.g. Cairo"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('addresses.form.state')}</label>
                                            <input
                                                required
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-900 transition-all font-bold"
                                                placeholder="e.g. Giza"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('addresses.form.zip')}</label>
                                            <input
                                                required
                                                value={zipCode}
                                                onChange={(e) => setZipCode(e.target.value)}
                                                className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-900 transition-all font-bold"
                                                placeholder="e.g. 12345"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            id="isDefault"
                                            checked={isDefault}
                                            onChange={(e) => setIsDefault(e.target.checked)}
                                            className="w-6 h-6 rounded-lg text-primary-900 focus:ring-primary-900 border-gray-200"
                                        />
                                        <label htmlFor="isDefault" className="text-sm font-bold text-gray-700">{t('addresses.form.default')}</label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full h-16 bg-primary-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary-900/20 hover:bg-black transition-all active:scale-95"
                                    >
                                        {editingId ? t('addresses.form.save') : t('addresses.form.confirm')}
                                    </button>
                                </form>
                            </div>
                        )}

                        {loading ? (
                            <div className="p-32 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <Loader />
                                <p className="mt-8 text-gray-400 font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">{t('addresses.accessingVault')}</p>
                            </div>
                        ) : addresses.length === 0 ? (
                            !showForm && (
                                <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm px-10">
                                    <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-gray-200 transform -rotate-12">
                                        <FiMapPin size={64} />
                                    </div>
                                    <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{t('addresses.emptyTitle')}</h2>
                                    <p className="text-gray-500 mb-12 max-w-sm mx-auto font-medium leading-relaxed">{t('addresses.emptyDesc')}</p>
                                    <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-3 bg-primary-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-black hover:scale-105 transition-all shadow-xl shadow-primary-900/20 active:scale-95">
                                        {t('addresses.addFirstBtn')} <FiPlus />
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                                {addresses.map((address) => (
                                    <div key={address._id} className={`group relative bg-white rounded-[2.5rem] border p-8 transition-all duration-500 hover:shadow-2xl ${address.isDefault ? 'border-primary-900 shadow-lg' : 'border-gray-100 hover:border-primary-100'}`}>
                                        {address.isDefault && (
                                            <div className="absolute top-8 right-8 bg-primary-900 text-white p-2 rounded-xl shadow-lg">
                                                <FiCheck />
                                            </div>
                                        )}
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-primary-900 mb-6 group-hover:bg-primary-900 group-hover:text-white transition-colors duration-500">
                                            <FiHome size={24} />
                                        </div>
                                        <div className="space-y-2 mb-8">
                                            <h4 className="text-lg font-black text-gray-900 break-words">{address.street}</h4>
                                            <p className="text-gray-500 font-bold uppercase tracking-tighter text-xs">
                                                {address.city}, {address.state} {address.zipCode}
                                            </p>
                                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{address.country}</p>
                                        </div>
                                        <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                                            <button
                                                onClick={() => handleEdit(address)}
                                                className="flex-1 h-12 rounded-xl bg-gray-50 text-gray-600 font-black text-[10px] uppercase tracking-widest hover:bg-primary-900 hover:text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                <FiEdit3 /> {t('addresses.form.titleEdit')}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(address._id)}
                                                className="w-12 h-12 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Info Banner */}
                        <div className="bg-gradient-to-br from-primary-950 to-gray-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black mb-6 tracking-tight">{t('addresses.banner.title')}</h3>
                                <p className="text-gray-400 font-medium leading-relaxed max-w-lg">
                                    {t('addresses.banner.desc')}
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent-500/10 rounded-full blur-[120px]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedAddressesPage;
