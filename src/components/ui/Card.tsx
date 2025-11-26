"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <motion.div
      className={`
        rounded-3xl
        bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.10),_rgba(15,23,42,1))]
        border border-[color:var(--border-subtle)]
        shadow-xl shadow-black/30
        p-5 md:p-6
        ${className ?? ""}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.01, y: -4 }}
    >
      {children}
    </motion.div>
  );
}
