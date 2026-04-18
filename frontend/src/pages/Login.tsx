import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api';
import { AnimatePresence, motion } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await authService.login({ username, password }) as any;
      if (res && res.success) {
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác');
      }
    } catch (err: any) {
      const msg = err.message || 'Lỗi đăng nhập';
      if (msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('credential')) {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Học Phí" subtitle="Đăng nhập hệ thống">
      <form onSubmit={handleLogin}>
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
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Mật khẩu"
            showPasswordToggle
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-8">
          Đăng nhập
        </Button>
      </form>

      <div className="mt-12 text-center">
        <Link to="/register" className="text-[12px] text-app-muted hover:text-app-fg font-bold uppercase tracking-widest transition-all hover:tracking-[0.2em]">
          Chưa có tài khoản? Đăng ký ngay
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
