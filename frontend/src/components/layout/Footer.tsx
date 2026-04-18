import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="h-16 border-t border-zinc-200 flex items-center justify-between px-8 bg-zinc-50/50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
          Hệ thống trực tuyến
        </span>
      </div>
      
      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
        © 2026 HocPhi Studio. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
