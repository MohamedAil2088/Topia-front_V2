import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center mb-8">إنشاء حساب جديد</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              name="name"
              label="الاسم الكامل"
              placeholder="أدخل اسمك الكامل"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              type="email"
              name="email"
              label="البريد الإلكتروني"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="password"
              label="كلمة المرور"
              placeholder="أدخل كلمة المرور"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="confirmPassword"
              label="تأكيد كلمة المرور"
              placeholder="أعد إدخال كلمة المرور"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="flex items-start gap-2">
              <input type="checkbox" className="rounded mt-1" required />
              <span className="text-sm text-gray-600">
                أوافق على{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  الشروط والأحكام
                </Link>{' '}
                و{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  سياسة الخصوصية
                </Link>
              </span>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              إنشاء حساب
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
