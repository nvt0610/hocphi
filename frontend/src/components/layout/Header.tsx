import React from 'react';
import { authService } from '../../api';

const Header: React.FC = () => {
  const user = authService.getCurrentUser();

  const [currentDate, setCurrentDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    const dayName = days[date.getDay()];
    return `${dayName}, ${d}/${m}/${y}`;
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-zinc-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <h2 className="text-[14px] font-bold uppercase tracking-[0.2em] text-zinc-800">
          Tổng quan
        </h2>
        <div className="h-4 w-[1px] bg-zinc-200" />
        <span className="text-[12px] font-black text-zinc-400 uppercase tracking-wider">
          {formatDate(currentDate)}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[13px] font-bold text-zinc-900 leading-none">
            {user?.fullName || 'Người dùng'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
