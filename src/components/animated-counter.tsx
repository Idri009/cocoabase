"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export default function AnimatedCounter({
  value,
  duration = 1,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });

  useEffect(() => {
    if (!hasAnimated) {
      motionValue.set(value);
      setHasAnimated(true);
    } else {
      motionValue.set(value);
    }
  }, [motionValue, value, hasAnimated]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const formatted = latest.toFixed(decimals);
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [springValue, decimals, prefix, suffix]);

  return <span ref={ref} className={className} />;
}

