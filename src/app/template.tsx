'use client';

import { motion } from 'framer-motion';

// App Router re-mounts this on every navigation, so each page glides in.
// Deterministic on server & client (no window reads here) to avoid hydration
// mismatches — reduced-motion is handled globally by <MotionProvider> in the
// layout (MotionConfig reducedMotion="user"), which skips the transform.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
