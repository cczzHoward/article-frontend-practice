// src/components/Pagination.tsx
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // 生成頁碼陣列
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showPages = 7; // 最多顯示 7 個頁碼

        if (totalPages <= showPages) {
            // 總頁數少於 7 頁，全部顯示
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // 總頁數大於 7 頁，使用省略號
            if (currentPage <= 4) {
                // 當前頁在前面
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                // 當前頁在後面
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                // 當前頁在中間
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    if (totalPages <= 1) return null; // 只有一頁或沒有資料時不顯示分頁器

    return (
        <div className="flex justify-center items-center gap-2 mt-8 mb-6">
            {/* 上一頁按鈕 */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-surface border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-slate-300 transition-colors"
            >
                &lt;
            </button>

            {/* 頁碼按鈕 */}
            {pageNumbers.map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                            ...
                        </span>
                    );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                return (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                            isActive
                                ? 'bg-primary border-primary text-white font-semibold'
                                : 'bg-surface border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-primary'
                        }`}
                    >
                        {pageNum}
                    </button>
                );
            })}

            {/* 下一頁按鈕 */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-surface border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-slate-300 transition-colors"
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
