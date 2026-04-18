import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps & { loading?: boolean }> = ({ 
  isLoading,
  loading,
  children, 
  className = '', 
  ...props 
}) => {
  const activeLoading = isLoading || loading;
  return (
    <motion.button 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      disabled={activeLoading || props.disabled}
      className={`w-full py-5 bg-app-fg text-app-surface font-black text-[14px] rounded-2xl transition-all flex items-center justify-center uppercase tracking-[0.2em] shadow-lg shadow-stone-300 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {activeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </motion.button>
  );
};

export default Button;
