import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="h-full w-full flex items-center justify-center p-6 bg-app-bg relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/40 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stone-300/30 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] bg-app-surface rounded-[40px] p-12 shadow-premium relative z-10 border border-white/50"
      >
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-black text-app-fg tracking-tighter uppercase"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[12px] text-app-muted font-bold uppercase tracking-[0.15em] mt-2 opacity-80"
          >
            {subtitle}
          </motion.p>
        </div>

        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
