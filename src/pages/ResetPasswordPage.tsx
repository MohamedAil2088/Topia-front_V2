import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../utils/api';
import Swal from 'sweetalert2';

const ResetPasswordPage = () => {
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { email, code } = location.state || {};

    React.useEffect(() => {
        if (!email || !code) {
            navigate('/forgot-password');
        }
    }, [email, code, navigate]);

    if (!email || !code) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            Swal.fire('Error', 'Passwords do not match', 'error');
            return;
        }
        setLoading(true);
        try {
            await api.put('/auth/reset-password', { email, code, password });
            Swal.fire('Success', 'Password reset successfully. Please login with your new password.', 'success');
            navigate('/login');
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to reset password', 'error');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
