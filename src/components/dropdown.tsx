"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useClickOutside } from "@/lib/hooks";

type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

type DropdownProps = {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
};

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  disabled = false,
  error,
  fullWidth = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", fullWidth && "w-full", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full rounded-2xl border px-4 py-2 text-sm text-cocoa-800 shadow-sm transition",
          "focus:outline-none focus:ring-2 focus:ring-cocoa-200 focus:border-cocoa-400",
          "bg-white flex items-center justify-between",
          disabled && "opacity-50 cursor-not-allowed",
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
            : "border-cream-300"
        )}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          <span>{selectedOption?.label || placeholder}</span>
        </span>
        <span className={cn("transition-transform", isOpen && "rotate-180")}>
          ▼
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-1 w-full rounded-xl border border-cream-200 bg-white shadow-lg max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm text-cocoa-800 transition",
                  "hover:bg-cocoa-50 first:rounded-t-xl last:rounded-b-xl",
                  option.disabled && "opacity-50 cursor-not-allowed",
                  value === option.value && "bg-cocoa-100 font-medium"
                )}
              >
                <span className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}

