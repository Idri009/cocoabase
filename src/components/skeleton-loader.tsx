"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type SkeletonLoaderProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
  count?: number;
};

export default function SkeletonLoader({
  width = "100%",
  height = "1rem",
  className,
  rounded = false,
  count = 1,
}: SkeletonLoaderProps) {
  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "bg-cream-200",
            rounded ? "rounded-full" : "rounded",
            className
          )}
          style={{
            width: widthStyle,
            height: heightStyle,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1,
          }}
        />
      ))}
    </>
  );
}

