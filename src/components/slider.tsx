"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type SliderProps = {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
  showValue?: boolean;
};

export default function Slider({
  value: controlledValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
  label,
  showValue = true,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? min);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledValue !== undefined;

  const value = isControlled ? controlledValue : internalValue;
  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    updateValue(e);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round((min + percentage * (max - min)) / step) * step;
    updateToValue(newValue);
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const updateValue = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round((min + percentage * (max - min)) / step) * step;
    updateToValue(newValue);
  };

  const updateToValue = (newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    if (isControlled) {
      onChange?.(clampedValue);
    } else {
      setInternalValue(clampedValue);
      onChange?.(clampedValue);
    }
  };

  useEffect(() => {
    if (isControlled && controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [isControlled, controlledValue]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-sm font-medium text-cocoa-700">{label}</label>
          )}
          {showValue && (
            <span className="text-sm text-cocoa-600">{value}</span>
          )}
        </div>
      )}
      <div
        ref={sliderRef}
        className={cn(
          "relative h-2 bg-cream-200 rounded-full cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onMouseDown={handleMouseDown}
      >
        <motion.div
          className="absolute h-2 bg-cocoa-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1 }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-cocoa-600 rounded-full shadow-sm cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${percentage}% - 8px)` }}
          whileHover={{ scale: 1.2 }}
          whileDrag={{ scale: 1.1 }}
        />
      </div>
    </div>
  );
}

