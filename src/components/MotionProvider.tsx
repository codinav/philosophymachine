'use client';

import { MotionConfig } from 'framer-motion';

// Global Framer Motion config. reducedMotion="user" makes every animation in
// the app respect the OS "reduce motion" setting (skips transforms) WITHOUT
// changing the rendered DOM structure — so it's hydration-safe, unlike
// branching on useReducedMotion() in render.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
