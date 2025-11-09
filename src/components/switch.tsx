"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
  helperText?: string;
};

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, error, helperText, className, checked, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative inline-flex items-center">
            <input
              ref={ref}
              type="checkbox"
              checked={checked}
              className="sr-only"
              {...props}
            />
            <motion.div
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                checked ? "bg-cocoa-600" : "bg-cream-300",
                props.disabled && "opacity-50 cursor-not-allowed"
              )}
              animate={{
                backgroundColor: checked ? "#8B4513" : "#E8DCC6",
              }}
            >
              <motion.span
                className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
                animate={{
                  x: checked ? 20 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            </motion.div>
          </div>
          {label && (
            <span className="text-sm font-medium text-cocoa-700">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          )}
        </label>
        {error && (
          <p className="text-xs text-red-600 ml-13">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-cocoa-500 ml-13">{helperText}</p>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;

