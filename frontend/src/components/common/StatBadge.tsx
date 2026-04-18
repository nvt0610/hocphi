import React from 'react';

interface StatBadgeProps {
  value: string | number;
  label: string;
}

const StatBadge: React.FC<StatBadgeProps> = ({ value, label }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-600 uppercase">
        {value}
      </div>
      <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

export default StatBadge;
