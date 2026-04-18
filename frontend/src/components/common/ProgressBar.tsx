import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className = '' }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden max-w-[100px]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-zinc-900"
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <span className="text-[13px] font-black text-zinc-800 tabular-nums">
        {current}<span className="text-zinc-300 mx-1">/</span>{total}
      </span>
    </div>
  );
};

export default ProgressBar;
