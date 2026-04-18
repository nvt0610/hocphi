import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange, onClose }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const startDay = calendarMonth.getDay();
  const prevMonthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();

  const calendarDays = [];
  const padding = startDay === 0 ? 6 : startDay - 1;
  for (let i = padding; i > 0; i--) {
    calendarDays.push({ day: prevMonthEnd - i + 1, currentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, currentMonth: true });
  }

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="absolute top-full right-0 mt-4 bg-white rounded-[32px] shadow-[0_32px_80px_rgba(0,0,0,0.15)] border border-zinc-100 p-6 z-[100] min-w-[320px]"
    >
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={(e) => { e.stopPropagation(); changeMonth(-1); }}
          className="p-2 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-[12px] font-black uppercase tracking-widest text-zinc-800">
          {viewDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); changeMonth(1); }}
          className="p-2 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
          <div key={d} className="text-center text-[9px] font-black text-zinc-300 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((item, i) => {
          const isSelected = item.currentMonth && 
                           item.day === selectedDate.getDate() && 
                           viewDate.getMonth() === selectedDate.getMonth() &&
                           viewDate.getFullYear() === selectedDate.getFullYear();
          
          const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), item.day);
          const isTodayItem = item.currentMonth && 
            dateObj.getDate() === today.getDate() && 
            dateObj.getMonth() === today.getMonth() && 
            dateObj.getFullYear() === today.getFullYear();

          return (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (item.currentMonth) {
                  onChange(new Date(viewDate.getFullYear(), viewDate.getMonth(), item.day));
                  onClose();
                }
              }}
              className={`
                h-9 w-9 flex items-center justify-center rounded-xl text-[11px] font-black transition-all
                ${!item.currentMonth ? 'text-zinc-100 pointer-events-none' : 'text-zinc-800 hover:bg-zinc-100'}
                ${isSelected ? 'bg-zinc-900 text-white shadow-lg' : ''}
                ${isTodayItem && !isSelected ? 'ring-2 ring-zinc-900 ring-offset-2' : ''}
              `}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DatePicker;
