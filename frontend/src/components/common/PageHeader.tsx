import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex justify-between items-end px-4">
      <div className="space-y-1">
        <h1 className="text-[32px] font-black text-zinc-900 uppercase tracking-tighter leading-none">
          {title}
        </h1>
        {subtitle && (
          <div className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">
            {subtitle}
          </div>
        )}
      </div>
      
      {children && (
        <div className="flex items-center gap-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
