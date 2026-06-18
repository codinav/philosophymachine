import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, GlassCard, LinkButton } from '@/components/ui/primitives';
import { promoActive, promoDaysLeft } from '@/lib/entitlements';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: 'The Academy',
  description: 'Go deeper. Unlimited philosopher chat, your deep psychological report, a growth roadmap, and more.',
};

const FREE = ['The full 18-dilemma test', 'Your blend, tribe & rarity', 'Beautiful share cards', 'Daily dilemma & streaks', '3 philosopher messages / day'];
const PREMIUM = [
  'Deep psychological report (long-form)',
  'Unlimited AI philosopher mentor',
  'Philosophical growth roadmap',
  'Downloadable PDF report',
  'Relationship compatibility analysis',
  'All hidden philosophers & result history',
];

export default function AcademyPage() {
  const promo = promoActive();
  const daysLeft = promoDaysLeft();
  return (
    <main className="mx-auto max-w-4xl px-5 pb-28 pt-10">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-chalk">← Home</Link>

      {promo && (
        <div className="mt-8 rounded-2xl border border-violet-400/40 bg-violet-500/10 p-4 text-center">
          <p className="font-display text-lg font-semibold text-violet-100">
            🎉 Launch Festival — every Academy feature is free for everyone.
          </p>
          <p className="mt-1 text-sm text-violet-200/80">
            No card, no signup. {daysLeft} day{daysLeft === 1 ? '' : 's'} left — take the test and your full deep report unlocks instantly.
          </p>
        </div>
      )}

      <div className="mt-10 text-center">
        <Eyebrow>The Academy</Eyebrow>
        <h1 className="mt-2 font-display text-hero font-semibold">Examine your life, fully.</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted">
          The test is free, forever. The Academy is for those who want to go all the way down.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <GlassCard className="p-7">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Free</p>
          <p className="mt-3 font-display text-4xl font-semibold">$0</p>
          <ul className="mt-6 flex flex-col gap-3 text-sm text-chalk/85">
            {FREE.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-muted">›</span>{f}</li>
            ))}
          </ul>
          <LinkButton href="/quiz" variant="ghost" className="mt-7 w-full">Take the test</LinkButton>
        </GlassCard>

        <GlassCard strong className="relative overflow-hidden p-7" style={{ borderColor: 'rgba(168,85,247,0.4)' }}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/15 to-transparent" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.25em] text-violet-300">The Academy · {promo ? 'free right now' : 'most popular'}</p>
            <p className="mt-3 font-display text-4xl font-semibold">
              {promo ? (
                <><span className="text-2xl text-muted line-through">$6</span> <span className="text-emerald-300">Free</span></>
              ) : (
                <>$6<span className="text-lg text-muted">/mo</span></>
              )}
            </p>
            <p className="text-xs text-muted">{promo ? `Launch Festival · ${daysLeft} days left` : 'or $39/year · save 45%'}</p>
            <ul className="mt-6 flex flex-col gap-3 text-sm text-chalk/90">
              {PREMIUM.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-violet-300">✦</span>{f}{promo && <span className="ml-auto text-xs text-emerald-300">unlocked</span>}</li>
              ))}
            </ul>
            {promo ? (
              <Link href="/quiz" className="mt-7 block w-full rounded-full bg-chalk py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-white">
                Take the test — unlock everything free →
              </Link>
            ) : (
              <button className="mt-7 w-full rounded-full bg-chalk py-3 text-sm font-medium text-ink transition-colors hover:bg-white">
                Unlock The Academy
              </button>
            )}
            <p className="mt-3 text-center text-xs text-muted">{promo ? 'Pricing returns after the festival. Stripe wires up in Phase 4.' : 'Stripe checkout wires up in Phase 4 (see docs/07).'}</p>
          </div>
        </GlassCard>
      </div>

      <section className="mt-16">
        <Eyebrow className="mb-5 text-center">Unlock without paying</Eyebrow>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { t: 'Share your card', d: 'Unlock your shadow philosopher section.' },
            { t: 'Invite 3 friends', d: 'Unlock the deep dossier + one hidden philosopher.' },
            { t: 'Keep a 7-day streak', d: 'Unlock a free week of the mentor.' },
          ].map((x) => (
            <GlassCard key={x.t} className="p-5">
              <p className="font-medium">{x.t}</p>
              <p className="mt-1 text-sm text-muted">{x.d}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
