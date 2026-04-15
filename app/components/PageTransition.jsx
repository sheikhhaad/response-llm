"use client";

import { motion } from "framer-motion";

export function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: 0.35,
        ease: [0.33, 1, 0.68, 1], // Smooth cubic-bezier (ease-in-out-cubic)
      }}
      className={`w-full flex-1 flex flex-col ${className}`}
      layout // Preserve layout animations for child changes
      layoutId="page-transition" // Optional: shared layout ID for seamless page transitions
    >
      {children}
    </motion.div>
  );
}