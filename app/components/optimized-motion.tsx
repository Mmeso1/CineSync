"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export function OptimizedMotion({ children, ...props }: any) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div {...props}>{children}</div>;
  }

  return <motion.div {...props}>{children}</motion.div>;
}
