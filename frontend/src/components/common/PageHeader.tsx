import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children, showBack, onBack }) => {
  return (
    <div className="flex justify-between items-end px-4">
      <div className="flex items-center gap-4">
        {showBack && onBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-zinc-100/50 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}
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
