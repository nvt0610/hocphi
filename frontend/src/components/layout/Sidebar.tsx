import React from 'react';
import { NavLink } from 'react-router-dom';
import { authService } from '../../api';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⬩' },
  { path: '/classes', label: 'Lớp học', icon: '⬩' },
  { path: '/students', label: 'Học sinh', icon: '⬩' },
  { path: '/tuition', label: 'Học phí', icon: '⬩' },
];

const Sidebar: React.FC = () => {
  const handleLogout = async () => {
    await authService.logout();
  };

  return (
    <aside className="w-56 h-screen bg-zinc-900 text-white flex flex-col fixed left-0 top-0 z-40">
      <div className="p-8 mb-4">
        <h1 className="text-[16px] font-black uppercase tracking-[0.3em] text-white">
          Học Phí
        </h1>
        <div className="w-6 h-[2px] bg-white mt-2" />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-white text-zinc-900 shadow-[0_10px_20px_rgba(255,255,255,0.1)]' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="text-[12px] opacity-50 group-hover:opacity-100 transition-opacity">
              {item.icon}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-nowrap">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-900/30 rounded-xl transition-all"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
