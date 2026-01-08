import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { login, googleLoginAction } from '../redux/slices/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../utils/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

declare global {
    interface Window {
        google: any;
    }
}

const LoginPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error, userInfo } = useAppSelector((state: any) => state.auth);
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(userInfo.isAdmin ? '/admin/dashboard' : redirect);
        }
    }, [navigate, userInfo, redirect]);

    const handleGoogleResponse = async (response: any) => {
        try {
            const { data } = await api.post('/auth/google', { tokenId: response.credential });
            if (data.success) {
                dispatch(googleLoginAction(data));
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome!',
                    text: 'Logged in successfully with Google',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (err: any) {
            console.error("Google Login Error", err);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.response?.data?.message || 'Could not log in with Google'
            });
        }
    };

    useEffect(() => {
        const initGoogle = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: "1003836111670-33sgte6cjc5npj3hk140akl3otk4lubg.apps.googleusercontent.com",
                    callback: handleGoogleResponse,
                    auto_select: false,
                    itp_support: true
                });

                window.google.accounts.id.renderButton(
                    document.getElementById("googleBtn"),
                    {
                        theme: "outline",
                        size: "large",
                        text: "signin_with",
                        shape: "pill",
                        logo_alignment: "left"
                    }
                );
            } else {
                setTimeout(initGoogle, 500);
            }
        };

        initGoogle();
    }, []);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string().min(6, 'Too short').required('Required'),
        }),
        onSubmit: (values) => {
            dispatch(login(values));
        },
    });

    return (

        <div className="min-h-screen w-full flex bg-white">
            {/* Left Side - Image Showcase (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1950&auto=format&fit=crop"
                    alt="Men's Fashion"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="relative z-10 p-16 flex flex-col justify-end h-full">
                    <h2 className="text-4xl font-black font-display text-white mb-6 leading-tight">
                        Redefining <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">Luxury</span><br />
                        For The Modern Man.
                    </h2>
                    <p className="text-gray-300 text-lg max-w-md">
                        Join our exclusive community and experience the pinnacle of men's storage and fashion.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-10 lg:text-left">
                        <Link to="/" className="inline-block text-4xl font-black font-display tracking-tighter text-gray-900 group mb-8">
                            TOPIA<span className="text-primary-600 group-hover:animate-pulse">.</span>
                        </Link>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{t('auth.login')}</h1>
                        <p className="text-gray-500">{t('auth.dontHaveAccount')}</p>
                    </div>

                    <div className="bg-white p-0 rounded-none shadow-none border-0">
                        {error && <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm mb-8 flex items-center gap-2">⚠️ {error}</div>}

                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            <Input
                                label={t('auth.email')}
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                className="bg-gray-50 border-gray-100 focus:bg-white"
                            />

                            <div className="space-y-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-semibold text-gray-700">{t('auth.password')}</label>
                                    <Link to="/forgot-password" className="text-xs font-bold text-primary-600 hover:underline">{t('auth.forgotPassword')}</Link>
                                </div>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    className="bg-gray-50 border-gray-100 focus:bg-white"
                                />
                            </div>

                            <Button type="submit" fullWidth isLoading={loading} size="lg" className="h-14 rounded-xl shadow-xl shadow-primary-900/10 hover:shadow-primary-900/20 text-base font-bold tracking-wide">
                                {t('auth.signIn')}
                            </Button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest text-[10px]">Or continue with</span>
                                </div>
                            </div>

                            <div id="googleBtn" className="min-h-[50px] w-full flex justify-center"></div>
                        </form>

                        <div className="mt-10 text-center lg:text-left">
                            <p className="text-gray-500 text-sm font-medium">
                                {t('auth.dontHaveAccount')}{' '}
                                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-primary-900 font-bold hover:text-primary-700 transition-colors">
                                    {t('auth.createAccount')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
