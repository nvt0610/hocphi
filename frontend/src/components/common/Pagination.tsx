import React from 'react';


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Logic to show limited page numbers
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage <= 4) return [...pages.slice(0, 5), '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', ...pages.slice(totalPages - 5)];
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="flex items-center justify-between px-8 py-6 bg-white border-t border-zinc-100">
      <div className="flex-1 flex items-center gap-6">
        <p className="text-[13px] font-bold text-zinc-400">
          Hiển thị <span className="text-zinc-900 font-black">{startItem}</span> - <span className="text-zinc-900 font-black">{endItem}</span> trong <span className="text-zinc-900 font-black">{totalItems}</span> bản ghi
        </p>
        <div className="h-4 w-[1px] bg-zinc-100" />
        <p className="text-[13px] font-bold text-zinc-400">
          Trang <span className="text-zinc-900 font-black">{currentPage}</span> / <span className="text-zinc-900 font-black">{totalPages}</span>
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-100 text-zinc-400 hover:bg-zinc-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Trang trước"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="w-8 text-center text-zinc-300 font-black">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-black transition-all ${
                      currentPage === page
                        ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20'
                        : 'text-zinc-400 hover:bg-zinc-50 border border-transparent'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-100 text-zinc-400 hover:bg-zinc-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Trang sau"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
