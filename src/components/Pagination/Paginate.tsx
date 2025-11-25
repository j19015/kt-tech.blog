'use client';
import Link from "next/link";

type PaginateProps = {
  currentPage: number;
  totalPage: number;
  kind: string;
};

const Paginate = ({ currentPage, totalPage, kind }: PaginateProps) => {
  return (
    <div className="flex justify-center mt-12 mb-8">
      <nav className="flex items-center gap-2">
        {currentPage > 1 && (
          <Link
            href={`${kind}/page/${currentPage - 1}`}
            className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            ← 前へ
          </Link>
        )}

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPage ||
              (page >= currentPage - 2 && page <= currentPage + 2)
            ) {
              return (
                <Link
                  href={`${kind}/page/${page}`}
                  key={page}
                  className={`min-w-[32px] h-8 flex items-center justify-center text-sm transition-colors ${
                    currentPage === page
                      ? "text-slate-900 dark:text-slate-100 font-medium"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {page}
                </Link>
              );
            } else if (
              (page === currentPage - 3 && currentPage > 4) ||
              (page === currentPage + 3 && currentPage < totalPage - 3)
            ) {
              return (
                <span key={page} className="px-2 text-slate-400 dark:text-slate-600">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        {currentPage < totalPage && (
          <Link
            href={`${kind}/page/${currentPage + 1}`}
            className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            次へ →
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Paginate;