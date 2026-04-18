import React from 'react';
import { motion } from 'framer-motion';

interface ScheduleItemProps {
  id: string;
  startTime: string;
  endTime: string;
  className: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ id, startTime, endTime, className }) => {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-zinc-100 p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all"
    >
      <h3 className="text-[13px] font-black text-zinc-900 leading-tight mb-3">
        {className}
      </h3>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-lg border border-emerald-100/50 uppercase tracking-tight">
          {startTime.substring(0, 5)} - {endTime.substring(0, 5)}
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      </div>
    </motion.div>
  );
};

export default ScheduleItem;
