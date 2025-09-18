"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

type FadeInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  style?: React.CSSProperties
}

export function FadeIn({ children, className, delay = 0, style }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  )
}
