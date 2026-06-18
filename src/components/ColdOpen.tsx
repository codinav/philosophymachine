'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/primitives';
import { setColdOpen } from '@/lib/session';

// The Akinator hook: a live dilemma on the landing page, BEFORE any signup.
// The first answer is the real conversion event (docs/02 Stage 0).
export function ColdOpen() {
  const router = useRouter();
  const [choice, setChoice] = useState<null | 'pull' | 'no'>(null);

  const answer = (c: 'pull' | 'no') => {
    setChoice(c);
    // q-trolley is a core question; carry this answer into the quiz.
    setColdOpen({ questionId: 'q-trolley', value: c === 'pull' ? 1 : -1 });
  };

  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-8">
      <p className="font-display text-xl leading-relaxed text-chalk sm:text-2xl">
        A runaway trolley speeds toward five people. You can pull a lever to divert it onto a track where it
        will kill one instead.
      </p>
      <AnimatePresence mode="wait">
        {!choice ? (
          <motion.div
            key="choices"
            exit={{ opacity: 0, y: -8 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <Button variant="ghost" className="flex-1 py-4" onClick={() => answer('no')}>
              No — I won&apos;t pull it
            </Button>
            <Button variant="accent" className="flex-1 py-4" onClick={() => answer('pull')} style={{ background: '#6366f1' }}>
              Yes — I pull the lever
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="reaction"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-7"
          >
            <p className="text-sm leading-relaxed text-muted">
              {choice === 'pull'
                ? 'You acted on the math — five over one. The utilitarians are nodding. But Kant is frowning: did you just use a person as a means?'
                : 'You refused to kill with your own hand, even to save more. A deontologist’s instinct. But the consequentialists ask: are five deaths really better?'}
            </p>
            <p className="mt-3 text-sm accent-text">The machine has begun to read you.</p>
            <Button className="mt-6 w-full py-4 sm:w-auto" onClick={() => router.push('/quiz')}>
              Continue — map my whole worldview →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-6 text-center text-xs text-muted">
        <span className="mr-1 animate-pulse">●</span> the machine is listening
      </p>
    </div>
  );
}
