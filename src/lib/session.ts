'use client';

import type { Answer, ResultPayload } from '@/types';
import type { Unlock } from './unlocks';

// Lightweight client persistence. The whole core loop is anonymous-first and
// runs without a backend (docs/03 §state & data flow). Persisting to a DB is a
// best-effort enhancement layered on top.

const COLD_OPEN = 'pm:coldopen';
const REVEAL = 'pm:reveal';
const STREAK = 'pm:streak';
const LAST_RESULT = 'pm:lastresult';
const NAME = 'pm:name';

export function getName(): string {
  try {
    return localStorage.getItem(NAME) ?? '';
  } catch {
    return '';
  }
}

export function setName(name: string) {
  try {
    localStorage.setItem(NAME, name);
  } catch {}
}

export function setColdOpen(answer: Answer) {
  try {
    sessionStorage.setItem(COLD_OPEN, JSON.stringify(answer));
  } catch {}
}

export function takeColdOpen(): Answer | null {
  try {
    const raw = sessionStorage.getItem(COLD_OPEN);
    if (!raw) return null;
    sessionStorage.removeItem(COLD_OPEN);
    return JSON.parse(raw) as Answer;
  } catch {
    return null;
  }
}

/** Stash the freshly computed result so /result can play the full reveal. */
export function stashReveal(payload: ResultPayload & { unlocks: Unlock[] }) {
  try {
    sessionStorage.setItem(REVEAL, JSON.stringify({ code: payload.code, unlocks: payload.unlocks }));
    localStorage.setItem(
      LAST_RESULT,
      JSON.stringify({ code: payload.code, primary: payload.primary, unlocked: payload.unlocked }),
    );
  } catch {}
}

export interface LastResult {
  code: string;
  primary: string;
  unlocked: string[];
}

export function getLastResult(): LastResult | null {
  try {
    const raw = localStorage.getItem(LAST_RESULT);
    return raw ? (JSON.parse(raw) as LastResult) : null;
  } catch {
    return null;
  }
}

export function takeRevealUnlocks(code: string): Unlock[] | null {
  try {
    const raw = sessionStorage.getItem(REVEAL);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { code: string; unlocks: Unlock[] };
    if (parsed.code !== code) return null;
    sessionStorage.removeItem(REVEAL);
    return parsed.unlocks;
  } catch {
    return null;
  }
}

export interface StreakState {
  count: number;
  lastDay: string | null;
}

export function getStreak(): StreakState {
  try {
    const raw = localStorage.getItem(STREAK);
    return raw ? (JSON.parse(raw) as StreakState) : { count: 0, lastDay: null };
  } catch {
    return { count: 0, lastDay: null };
  }
}

export function bumpStreak(today: string): StreakState {
  const s = getStreak();
  if (s.lastDay === today) return s;
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const next: StreakState = {
    count: s.lastDay === yesterday ? s.count + 1 : 1,
    lastDay: today,
  };
  try {
    localStorage.setItem(STREAK, JSON.stringify(next));
  } catch {}
  return next;
}
