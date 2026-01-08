import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../utils/api';
import Swal from 'sweetalert2';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            Swal.fire('Code Sent', 'Please check your email for the reset code', 'success');
            navigate('/verify-code', { state: { email } });
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Something went wrong', 'error');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
                <p className="text-center text-gray-600">Enter your email to receive a reset code.</p>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Code'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
