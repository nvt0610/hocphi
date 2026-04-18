import React from 'react';

interface ActionButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  variant?: 'default' | 'danger' | 'ghost';
  title?: string;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick, 
  icon, 
  variant = 'default',
  title,
  className = ''
}) => {
  const variants = {
    default: 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900',
    danger: 'hover:bg-red-50 text-zinc-400 hover:text-red-500',
    ghost: 'text-zinc-300 hover:text-zinc-500',
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2.5 rounded-xl transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {icon}
    </button>
  );
};

export default ActionButton;
