import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api';
import { AnimatePresence, motion } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.register({
        username: formData.username,
        fullName: formData.fullName,
        password: formData.password
      }) as any;

      if (res && res.success) {
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Lỗi đăng ký. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng ký. Tên đăng nhập có thể đã tồn tại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Học Phí" subtitle="Tạo tài khoản mới">
      <form onSubmit={handleRegister}>
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[11px] text-red-500 font-bold text-center mb-6 uppercase tracking-wider bg-red-50 py-2 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <Input
            placeholder="Họ và tên"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />

          <Input
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />

          <Input
            type="password"
            placeholder="Mật khẩu"
            showPasswordToggle
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Input
            type="password"
            placeholder="Xác nhận mật khẩu"
            showPasswordToggle
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-8">
          Đăng ký
        </Button>
      </form>

      <div className="mt-12 text-center">
        <Link to="/login" className="text-[12px] text-app-muted hover:text-app-fg font-bold uppercase tracking-widest transition-all hover:tracking-[0.2em]">
          Đã có tài khoản? Đăng nhập ngay
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
