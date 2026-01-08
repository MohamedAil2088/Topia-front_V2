import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import {
    FiSave, FiSettings, FiGlobe, FiTruck, FiDollarSign, FiMail,
    FiRefreshCw, FiCheck, FiPackage, FiShoppingBag
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import api from '../../utils/api';

const SettingsPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        storeName: 'Topia Men\'s Store',
        supportEmail: 'support@topia.com',
        shippingFee: '50',
        freeShippingThreshold: '5000',
        currency: 'EGP'
    });

    const [originalSettings, setOriginalSettings] = useState(settings);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/settings');
            if (data.data) {
                const loadedSettings = {
                    ...settings,
                    ...data.data
                };
                setSettings(loadedSettings);
                setOriginalSettings(loadedSettings);
            }
        } catch (error) {
            console.error('Failed to load settings', error);
            Swal.fire('Error', 'Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const promises = Object.entries(settings).map(([key, value]) =>
                api.post('/settings', { key, value })
            );

            await Promise.all(promises);
            setOriginalSettings(settings);

            Swal.fire({
                icon: 'success',
                title: 'Settings Saved!',
                text: 'Store configuration has been updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: 'Could not save settings. Please try again.',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setSettings(originalSettings);
        Swal.fire({
            icon: 'info',
            title: 'Changes Discarded',
            text: 'Settings have been reset to last saved values.',
            timer: 1500,
            showConfirmButton: false
        });
    };

    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader size="lg" />
                    <p className="text-gray-500 mt-4">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-xl">
                            <FiSettings size={32} className="text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Store Settings</h1>
                            <p className="text-gray-500 text-sm">Manage global store configuration and thresholds</p>
                        </div>
                    </div>

                    <button
                        onClick={fetchSettings}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-sm transition-all"
                    >
                        <FiRefreshCw size={16} /> Refresh
                    </button>
                </div>

                {hasChanges && (
                    <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl flex items-center gap-3">
                        <FiSettings className="text-yellow-600" size={20} />
                        <p className="text-yellow-800 font-bold text-sm">You have unsaved changes!</p>
                    </div>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                            <FiGlobe size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">General Information</h2>
                            <p className="text-sm text-gray-500">Basic store details and contact</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                <FiShoppingBag className="inline mr-2" size={16} />
                                Store Name
                            </label>
                            <input
                                type="text"
                                value={settings.storeName}
                                onChange={(e) => handleChange('storeName', e.target.value)}
                                placeholder="Your Store Name"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-medium transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                <FiMail className="inline mr-2" size={16} />
                                Support Email
                            </label>
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => handleChange('supportEmail', e.target.value)}
                                placeholder="support@example.com"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-medium transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                <FiDollarSign className="inline mr-2" size={16} />
                                Currency
                            </label>
                            <select
                                value={settings.currency}
                                onChange={(e) => handleChange('currency', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-bold text-gray-700"
                            >
                                <option value="EGP">🇪🇬 EGP (Egyptian Pound)</option>
                                <option value="USD">🇺🇸 USD (US Dollar)</option>
                                <option value="EUR">🇪🇺 EUR (Euro)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Shipping Configuration */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                            <FiTruck size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Shipping & Delivery</h2>
                            <p className="text-sm text-gray-500">Configure shipping fees and thresholds</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                <FiPackage className="inline mr-2" size={16} />
                                Standard Shipping Fee ({settings.currency})
                            </label>
                            <input
                                type="number"
                                value={settings.shippingFee}
                                onChange={(e) => handleChange('shippingFee', e.target.value)}
                                placeholder="50"
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-medium transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                💡 Cost applied to orders below free shipping threshold
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                <FiCheck className="inline mr-2" size={16} />
                                Free Shipping Threshold ({settings.currency})
                            </label>
                            <input
                                type="number"
                                value={settings.freeShippingThreshold}
                                onChange={(e) => handleChange('freeShippingThreshold', e.target.value)}
                                placeholder="5000"
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-medium transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                🎉 Orders above this amount qualify for free shipping
                            </p>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                        <p className="font-black text-blue-900 mb-2 text-sm">📦 Shipping Preview:</p>
                        <div className="space-y-1 text-sm">
                            <p className="text-blue-700">
                                • Orders under <span className="font-black">{settings.freeShippingThreshold} {settings.currency}</span>:
                                <span className="font-black ml-2">{settings.shippingFee} {settings.currency}</span> shipping fee
                            </p>
                            <p className="text-green-700">
                                • Orders <span className="font-black">{settings.freeShippingThreshold} {settings.currency}</span> or more:
                                <span className="font-black ml-2">FREE shipping</span> 🎉
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={!hasChanges || saving}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiRefreshCw className="inline mr-2" size={18} /> Discard Changes
                        </button>

                        <Button
                            type="submit"
                            isLoading={saving}
                            disabled={!hasChanges}
                            className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {saving ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <FiSave className="inline mr-2" size={20} /> Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;
