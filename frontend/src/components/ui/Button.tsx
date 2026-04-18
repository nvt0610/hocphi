import React from 'react';

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
    <button 
      disabled={activeLoading || props.disabled}
      className={`w-full py-5 bg-app-fg text-app-surface font-black text-[14px] rounded-2xl transition-all flex items-center justify-center uppercase tracking-[0.2em] shadow-lg shadow-stone-300 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.98] ${className}`}
      {...props}
    >
      {activeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
};

export default Button;
