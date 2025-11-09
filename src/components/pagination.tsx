"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisible?: number;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  maxVisible = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisible / 2);

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= half + 1) {
        for (let i = 1; i <= maxVisible - 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - half) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - maxVisible + 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - half + 1; i <= currentPage + half - 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="Pagination">
      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            "px-3 py-2 rounded-lg text-sm font-medium transition",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:bg-cocoa-100 text-cocoa-700"
          )}
        >
          ««
        </button>
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "px-3 py-2 rounded-lg text-sm font-medium transition",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "hover:bg-cocoa-100 text-cocoa-700"
        )}
      >
        ‹
      </button>

      {pages.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-cocoa-500">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <motion.button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition",
              isActive
                ? "bg-cocoa-600 text-white"
                : "hover:bg-cocoa-100 text-cocoa-700"
            )}
          >
            {pageNum}
          </motion.button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "px-3 py-2 rounded-lg text-sm font-medium transition",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "hover:bg-cocoa-100 text-cocoa-700"
        )}
      >
        ›
      </button>

      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            "px-3 py-2 rounded-lg text-sm font-medium transition",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:bg-cocoa-100 text-cocoa-700"
          )}
        >
          »»
        </button>
      )}
    </nav>
  );
}

