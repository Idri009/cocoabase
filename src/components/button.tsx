"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = "left",
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary: "bg-cocoa-600 text-white hover:bg-cocoa-700 active:bg-cocoa-800",
      secondary: "bg-cream-200 text-cocoa-800 hover:bg-cream-300",
      outline: "border-2 border-cocoa-400 text-cocoa-700 hover:bg-cocoa-50",
      ghost: "text-cocoa-700 hover:bg-cocoa-100",
      danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={cn(
          "rounded-2xl font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-cocoa-200 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        <span className="flex items-center justify-center gap-2">
          {loading && (
            <span className="animate-spin">⟳</span>
          )}
          {icon && iconPosition === "left" && !loading && icon}
          {children}
          {icon && iconPosition === "right" && !loading && icon}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;

