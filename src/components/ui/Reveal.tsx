"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger/entry delay in seconds. */
  delay?: number;
  /** Direction the element animates in from. */
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  /** Render as a different element if needed. */
  as?: "div" | "section" | "li" | "article" | "span";
};

const offset = 24;

/**
 * Scroll-triggered entrance animation wrapper. Respects reduced-motion
 * preferences by rendering content statically when motion is disabled.
 */
export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();

  const initial =
    direction === "none"
      ? { opacity: 0 }
      : {
          opacity: 0,
          x: direction === "left" ? offset : direction === "right" ? -offset : 0,
          y: direction === "up" ? offset : direction === "down" ? -offset : 0,
        };

  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
