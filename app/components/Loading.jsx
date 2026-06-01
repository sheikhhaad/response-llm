"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A highly customizable loading spinner
 */
export function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-8 h-8 border-3",
  };
  return (
    <div
      className={`animate-spin rounded-full border-zinc-700/30 border-t-current ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
      style={{ borderTopColor: "currentColor" }}
      role="status"
      aria-label="loading"
    />
  );
}

/**
 * A premium button that seamlessly handles loading states with smooth layout transitions and micro-animations
 */
export function LoadingButton({
  children,
  isLoading = false,
  loadingText = "Loading...",
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={disabled || isLoading ? {} : { scale: 1.015 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.985 }}
      className={`
        relative overflow-hidden flex items-center justify-center gap-2.5 font-bold transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100
        ${className}
      `}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="flex items-center justify-center gap-2"
          >
            <LoadingSpinner size="sm" />
            <span>{loadingText}</span>
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="flex items-center justify-center gap-2"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/**
 * A premium full-page loader with glowing dark glassmorphic layout and smooth rings
 */
export function LoadingScreen({ message = "Loading details..." }) {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Radial brand glow in the background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="text-center z-10 flex flex-col items-center max-w-sm">
        {/* Animated Double Rings */}
        <div className="relative mb-6">
          {/* Inner Primary Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
            className="w-16 h-16 rounded-full border-[3px] border-brand-500/15 border-t-brand-500"
          />
          {/* Outer Brand Dashed Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
            className="absolute inset-0 -m-2 rounded-full border border-dashed border-brand-500/30 opacity-70"
          />
        </div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-lg font-bold text-foreground mb-1 tracking-tight"
        >
          Please Wait
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
          className="text-sm text-muted-foreground"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}

/**
 * An overlay loader perfect for loading list segments or card sections
 */
export function LoadingOverlay({ message = "Refreshing..." }) {
  return (
    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-30 flex items-center justify-center rounded-2xl transition-all">
      <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-3 border border-white/10 shadow-2xl">
        <LoadingSpinner size="md" className="text-brand-500" />
        <span className="text-sm font-semibold text-foreground">{message}</span>
      </div>
    </div>
  );
}
