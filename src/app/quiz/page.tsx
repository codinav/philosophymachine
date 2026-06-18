import { Suspense } from 'react';
import type { Metadata } from 'next';
import { QuizFlow } from '@/components/quiz/QuizFlow';

export const metadata: Metadata = {
  title: 'The Gauntlet',
  description: '18 dilemmas. Let the machine read your worldview.',
};

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="grid min-h-[70vh] place-items-center text-muted">Loading…</div>}>
      <QuizFlow />
    </Suspense>
  );
}
