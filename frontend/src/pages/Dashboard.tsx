import React, { useState, useMemo, useEffect, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { scheduleService } from '../api/schedule.service';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import DatePicker from '../components/common/DatePicker';
import ScheduleItem from '../components/dashboard/ScheduleItem';

interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  class?: {
    className: string;
  };
}

const Dashboard: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekDays = useMemo(() => {
    const days = [];
    const tempDate = new Date(selectedDate);
    const day = tempDate.getDay();
    const diff = tempDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(tempDate.getFullYear(), tempDate.getMonth(), diff);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [selectedDate]);

  const timeGroups = [
    { id: 'morning', label: 'Sáng', range: ['07:00', '12:00'], icon: '☀️' },
    { id: 'afternoon', label: 'Chiều', range: ['12:00', '18:00'], icon: '🌤️' },
    { id: 'evening', label: 'Tối', range: ['18:00', '22:00'], icon: '🌙' },
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await scheduleService.getAll();
      setSchedules(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch schedules', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const getDaySchedule = (dayIndex: number, groupId: string) => {
    const dbDay = dayIndex === 0 ? 8 : dayIndex + 1;
    const group = timeGroups.find(g => g.id === groupId);
    if (!group) return [];

    return schedules.filter(s => {
      if (s.dayOfWeek !== dbDay) return false;
      const start = s.startTime;
      return start >= group.range[0] && start < group.range[1];
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 flex flex-col h-[calc(100vh-140px)]">
        <PageHeader title="Lịch Học">
          <AnimatePresence>
            {!isToday(selectedDate) && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => setSelectedDate(new Date())}
                className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-zinc-900 hover:border-zinc-900 transition-all shadow-xl shadow-black/5 group"
                title="Quay lại hôm nay"
              >
                <svg className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`
                px-6 py-3 rounded-2xl flex items-center gap-4 transition-all border
                ${showDatePicker 
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xl shadow-zinc-900/20' 
                  : 'bg-white text-zinc-800 border-zinc-100 hover:border-zinc-300 shadow-xl shadow-black/5'
                }
              `}
            >
              <div className="flex flex-col items-start gap-0.5">
                <span className={`text-[9px] font-black uppercase tracking-widest ${showDatePicker ? 'text-zinc-300' : 'text-zinc-800'}`}>
                  {selectedDate.getFullYear()}
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {selectedDate.toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
                </span>
              </div>
              <svg className={`w-4 h-4 transition-transform duration-300 ${showDatePicker ? 'rotate-180 text-zinc-400' : 'text-zinc-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {showDatePicker && (
                <DatePicker 
                  selectedDate={selectedDate} 
                  onChange={setSelectedDate}
                  onClose={() => setShowDatePicker(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </PageHeader>

        <Card>
          <div className="grid grid-cols-[100px_1fr] border-b border-zinc-100 bg-zinc-50/30">
            <div className="flex items-center justify-center border-r border-zinc-100">
              <span className="text-[10px] font-black text-zinc-300 uppercase [writing-mode:vertical-lr] rotate-180">Khung giờ</span>
            </div>
            <div className="grid grid-cols-7 relative">
              {weekDays.map((day, i) => {
                const active = isToday(day);
                const isSelectedDay = day.getDate() === selectedDate.getDate() && 
                                   day.getMonth() === selectedDate.getMonth() &&
                                   day.getFullYear() === selectedDate.getFullYear();
                
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDate(new Date(day))}
                    className={`py-6 flex flex-col items-center gap-1.5 transition-all relative cursor-pointer group ${
                      active ? 'bg-zinc-900 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]' : 'hover:bg-zinc-100/50'
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                      active ? 'text-zinc-500' : 'text-zinc-300'
                    }`}>
                      {day.toLocaleDateString('vi-VN', { weekday: 'short' })}
                    </span>
                    <span className={`text-[22px] font-black tracking-tight ${
                      active ? 'text-white' : 'text-zinc-800'
                    }`}>
                      {day.getDate()}
                    </span>
                    {isSelectedDay && !active && (
                      <div className="absolute bottom-2 w-1.5 h-1.5 bg-zinc-900 rounded-full" />
                    )}
                    {active && (
                      <motion.div 
                        layoutId="activeDay"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-400/20"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide bg-white">
            <div className="grid grid-cols-[100px_1fr] min-h-full">
              <div className="border-r border-zinc-50 flex flex-col">
                {timeGroups.map(group => (
                  <div key={group.id} className="flex-1 min-h-[180px] border-b border-zinc-50 last:border-b-0 flex flex-col items-center justify-center gap-2 bg-zinc-50/20">
                    <span className="text-2xl">{group.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                      {group.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 relative">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="absolute h-full w-[1px] bg-zinc-50" style={{ left: `${(i + 1) * (100 / 7)}%` }} />
                ))}

                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="absolute w-full h-[1px] bg-zinc-50" style={{ top: `${(i + 1) * (100 / 3)}%` }} />
                ))}

                {timeGroups.map((group) => (
                  <React.Fragment key={group.id}>
                    {weekDays.map((day, dayIdx) => {
                      const items = getDaySchedule(day.getDay(), group.id);
                      return (
                        <div 
                          key={`${group.id}-${dayIdx}`} 
                          className={`min-h-[180px] p-2 relative group flex flex-col gap-2 ${
                            isToday(day) ? 'bg-zinc-50/40' : ''
                          }`}
                        >
                          {items.map((item) => (
                            <ScheduleItem 
                              key={item.id}
                              id={item.id}
                              startTime={item.startTime}
                              endTime={item.endTime}
                              className={item.class?.className || 'Lớp học'}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
