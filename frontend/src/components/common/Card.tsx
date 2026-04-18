import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  autoHeight?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', autoHeight = false }) => {
  return (
    <div className={`
      ${autoHeight ? 'h-auto' : 'flex-1'} 
      bg-white rounded-[40px] shadow-[0_48px_100px_rgba(0,0,0,0.12)] border border-zinc-100/50 
      overflow-hidden flex flex-col ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
