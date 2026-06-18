// Entitlements / feature gating (docs/00 §monetization).
//
// LAUNCH FESTIVAL: every Academy (premium) feature is unlocked for everyone
// until PROMO_ENDS_AT. This is the "free for a limited time" growth lever —
// it removes every paywall during launch to maximize activation & sharing,
// then naturally reverts to the freemium model when the window closes.
//
// Isomorphic: safe to call on the server and the client. Once auth + Stripe
// land (Phase 3/4), isPremium() also checks the user's real subscription.

export const PROMO = {
  label: 'Launch Festival',
  // 30-day launch window from go-live (2026-06-18).
  endsAt: '2026-07-18T23:59:59Z',
};

export function promoActive(now: number = Date.now()): boolean {
  return now <= new Date(PROMO.endsAt).getTime();
}

/**
 * True when the visitor currently has full Academy access.
 * During the launch festival this is everyone; afterward it's paid subscribers
 * (and referral/share unlocks). `hasSubscription` is wired in once auth exists.
 */
export function isPremium(opts?: { hasSubscription?: boolean; now?: number }): boolean {
  if (promoActive(opts?.now)) return true;
  return !!opts?.hasSubscription;
}

/** Whole days remaining in the promo (for countdown copy). 0 once expired. */
export function promoDaysLeft(now: number = Date.now()): number {
  const ms = new Date(PROMO.endsAt).getTime() - now;
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
