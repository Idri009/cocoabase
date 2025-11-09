"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, className, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1", fullWidth && "w-full")}>
        {label && (
          <label className="text-sm font-medium text-cocoa-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "rounded-2xl border px-4 py-2 text-sm text-cocoa-800 shadow-sm transition",
            "focus:outline-none focus:ring-2 focus:ring-cocoa-200 focus:border-cocoa-400",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-200"
              : "border-cream-300",
            fullWidth && "w-full",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-cocoa-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

