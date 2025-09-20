'use client';
import Link from "next/link";
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginateProps = {
  currentPage: number;
  totalPage: number;
  kind: string;
};

const Paginate = ({ currentPage, totalPage, kind }: PaginateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center mt-12 mb-8"
    >
      <nav className="inline-flex items-center gap-2 p-2 bg-card rounded-full shadow-lg border border-border">
        {currentPage > 1 && (
          <Link href={`${kind}/page/${currentPage - 1}`}>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">前へ</span>
            </motion.span>
          </Link>
        )}
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => {
            // 表示するページ番号を制限（現在のページの前後2ページ + 最初と最後）
            if (
              page === 1 || 
              page === totalPage || 
              (page >= currentPage - 2 && page <= currentPage + 2)
            ) {
              return (
                <Link href={`${kind}/page/${page}`} key={page}>
                  <motion.span
                    whileHover={{ scale: currentPage === page ? 1 : 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                      min-w-[40px] h-10 flex items-center justify-center rounded-full cursor-pointer transition-all font-medium
                      ${
                        currentPage === page
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                          : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    {page}
                  </motion.span>
                </Link>
              );
            } else if (
              (page === currentPage - 3 && currentPage > 4) ||
              (page === currentPage + 3 && currentPage < totalPage - 3)
            ) {
              return (
                <span key={page} className="px-2 text-muted-foreground">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>
        
        {currentPage < totalPage && (
          <Link href={`${kind}/page/${currentPage + 1}`}>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all cursor-pointer shadow-md"
            >
              <span className="hidden sm:inline">次へ</span>
              <ChevronRight className="w-4 h-4" />
            </motion.span>
          </Link>
        )}
      </nav>
    </motion.div>
  );
};

export default Paginate;