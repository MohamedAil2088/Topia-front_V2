import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../utils/api';
import Swal from 'sweetalert2';

const VerifyCodePage = () => {
    const location = useLocation();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const email = location.state?.email;

    // Redirect if direct access without email
    React.useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    if (!email) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/verify-code', { email, code });
            Swal.fire('Code Verified', 'You can now reset your password', 'success');
            navigate('/reset-password', { state: { email, code } });
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Invalid code', 'error');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Verify Code</h2>
                <p className="text-center text-gray-600">Enter the 6-digit code sent to {email}</p>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <Input label="Verification Code" value={code} onChange={(e) => setCode(e.target.value)} required />
                    <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default VerifyCodePage;
