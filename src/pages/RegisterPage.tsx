import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { register } from '../redux/slices/authSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const MySwal = withReactContent(Swal);

const RegisterPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { userInfo } = useAppSelector((state) => state.auth);
    const redirect = location.search ? location.search.split('=')[1] : '/';
    const [isLoadingLocal, setIsLoadingLocal] = useState(false);

    // Password visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password validation states
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [validationStatus, setValidationStatus] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    // Check password requirements real-time
    const checkPasswordRequirements = (password: string) => {
        setValidationStatus({
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[#?!@$%^&*-]/.test(password)
        });
    };

    // If user is already logged in, redirect
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, 'Name is too short')
                .required('Full Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required')
                .test('checkEmailUnique', 'This email is already registered', async (value) => {
                    if (!value || !value.includes('@')) return true;
                    try {
                        const { data } = await api.post('/auth/check-email', { email: value });
                        return !data.exists;
                    } catch (error) {
                        return true;
                    }
                }),
            phone: Yup.string()
                .matches(/^01[0125][0-9]{8}$/, 'Must be a valid Egyptian phone number (01xxxxxxxxx)')
                .required('Phone Number is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(/[a-z]/, 'Must contain at least one lowercase letter')
                .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
                .matches(/[0-9]/, 'Must contain at least one number')
                .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: async (values) => {
            const { confirmPassword, ...data } = values;
            setIsLoadingLocal(true);
            try {
                // Call API directly instead of Redux auth/register to prevent auto-login
                await api.post('/auth/register', data);

                setIsLoadingLocal(false);

                MySwal.fire({
                    icon: 'success',
                    title: 'Registration Successful! 🎉',
                    text: 'Your account has been created. Please log in.',
                    confirmButtonColor: '#0f172a',
                    timer: 3000
                }).then(() => {
                    navigate('/login');
                });

            } catch (err: any) {
                setIsLoadingLocal(false);
                MySwal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: err.response?.data?.message || 'Something went wrong',
                });
            }
        },
    });

    return (
        <div className="min-h-screen w-full flex bg-white">
            {/* Left Side - Image Showcase (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1950&auto=format&fit=crop"
                    alt="Fashion Store"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="relative z-10 p-16 flex flex-col justify-end h-full">
                    <h2 className="text-4xl font-black font-display text-white mb-6 leading-tight">
                        Join The <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">Elite</span><br />
                        Circle Today.
                    </h2>
                    <ul className="text-gray-300 space-y-3 text-lg">
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm">✓</span>
                            Exclusive early access to drops
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm">✓</span>
                            Member-only rewards & discounts
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm">✓</span>
                            Track your custom orders
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden overflow-y-auto">
                <div className="w-full max-w-lg relative z-10 py-12">
                    <div className="text-center mb-10 lg:text-left">
                        <Link to="/" className="inline-block text-4xl font-black font-display tracking-tighter text-gray-900 group mb-8">
                            TOPIA<span className="text-primary-600 group-hover:animate-pulse">.</span>
                        </Link>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{t('auth.createAccount')}</h1>
                        <p className="text-gray-500">Join us for a better shopping experience.</p>
                    </div>

                    <div className="bg-white p-0 rounded-none shadow-none border-0">
                        <form onSubmit={formik.handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <Input
                                        label="Full Name"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-gray-50 border-gray-100 focus:bg-white"
                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className="text-red-500 text-xs mt-1 ml-1">{formik.errors.name}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        placeholder="01xxxxxxxxx"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-gray-50 border-gray-100 focus:bg-white"
                                    />
                                    {formik.touched.phone && formik.errors.phone ? (
                                        <div className="text-red-500 text-xs mt-1 ml-1">{formik.errors.phone}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div>
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoComplete="email"
                                    className="bg-gray-50 border-gray-100 focus:bg-white"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500 text-xs mt-1 ml-1">{formik.errors.email}</div>
                                ) : null}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="••••••••"
                                            value={formik.values.password}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                checkPasswordRequirements(e.target.value);
                                            }}
                                            onFocus={() => setPasswordFocused(true)}
                                            onBlur={formik.handleBlur}
                                            autoComplete="new-password"
                                            className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-medium transition-all bg-gray-50 focus:bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                        </button>
                                    </div>
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="text-red-500 text-xs mt-1 ml-1">{formik.errors.password}</div>
                                    ) : null}

                                    {/* Password Requirements Indicator */}
                                    {passwordFocused && formik.values.password && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                            <p className="text-xs font-bold text-gray-700 mb-2">Password Requirements:</p>
                                            <ul className="space-y-1.5">
                                                <li className={`flex items-center gap-2 text-xs ${validationStatus.minLength ? 'text-green-600' : 'text-red-500'}`}>
                                                    {validationStatus.minLength ? (
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    <span className="font-medium">8+ characters</span>
                                                </li>
                                                <li className={`flex items-center gap-2 text-xs ${validationStatus.hasUpperCase ? 'text-green-600' : 'text-red-500'}`}>
                                                    {validationStatus.hasUpperCase ? (
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    <span className="font-medium">Uppercase (A-Z)</span>
                                                </li>
                                                <li className={`flex items-center gap-2 text-xs ${validationStatus.hasLowerCase ? 'text-green-600' : 'text-red-500'}`}>
                                                    {validationStatus.hasLowerCase ? (
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    <span className="font-medium">Lowercase (a-z)</span>
                                                </li>
                                                <li className={`flex items-center gap-2 text-xs ${validationStatus.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                                                    {validationStatus.hasNumber ? (
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    <span className="font-medium">Number (0-9)</span>
                                                </li>
                                                <li className={`flex items-center gap-2 text-xs ${validationStatus.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
                                                    {validationStatus.hasSpecialChar ? (
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    <span className="font-medium">Special (#?!@$%^&*-)</span>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            autoComplete="new-password"
                                            className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-medium transition-all bg-gray-50 focus:bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                        </button>
                                    </div>
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                        <div className="text-red-500 text-xs mt-1 ml-1">{formik.errors.confirmPassword}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" fullWidth isLoading={isLoadingLocal} size="lg" className="h-14 rounded-xl shadow-xl shadow-primary-900/10 hover:shadow-primary-900/20 text-base font-bold tracking-wide">
                                    {t('auth.createAccount')}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 text-center lg:text-left">
                            <p className="text-gray-500 text-sm font-medium">
                                Already have an account?{' '}
                                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-primary-900 font-bold hover:text-primary-700 transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
