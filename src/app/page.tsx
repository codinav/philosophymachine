import Link from 'next/link';
import { ColdOpen } from '@/components/ColdOpen';
import { LinkButton, Eyebrow, GlassCard } from '@/components/ui/primitives';
import { Portrait } from '@/components/ui/Portrait';
import { accentVars } from '@/components/ui/primitives';
import { TRIBE_LIST } from '@/lib/data/tribes';
import { VISIBLE_PHILOSOPHERS } from '@/lib/data/philosophers';
import { promoActive, promoDaysLeft } from '@/lib/entitlements';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function Landing() {
  const promo = promoActive();
  return (
    <main className="mx-auto max-w-5xl px-5 pb-28 pt-10 sm:pt-16">
      {promo && (
        <Link
          href="/academy"
          className="mb-8 block rounded-full border border-violet-400/40 bg-violet-500/10 px-5 py-2.5 text-center text-sm text-violet-100 transition-colors hover:bg-violet-500/20"
        >
          🎉 <span className="font-medium">Launch Festival</span> — all Academy features free for everyone · {promoDaysLeft()} days left →
        </Link>
      )}
      {/* Nav */}
      <nav className="mb-14 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          The Philosophy Machine
        </Link>
        <div className="hidden gap-6 text-sm text-muted sm:flex">
          <Link href="/battles" className="transition-colors hover:text-chalk">Battles</Link>
          <Link href="/tribes" className="transition-colors hover:text-chalk">Tribes</Link>
          <Link href="/philosophers" className="transition-colors hover:text-chalk">Thinkers</Link>
          <Link href="/about" className="transition-colors hover:text-chalk">Method</Link>
        </div>
      </nav>

      {/* Hero + cold open */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-fade-up">
          <Eyebrow>2.4M minds mapped · know thyself</Eyebrow>
          <h1 className="mt-5 font-display text-hero font-semibold">
            What do you <span className="italic accent-text">actually</span> believe?
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Answer 18 dilemmas. The machine maps your worldview against 17 philosophers and traditions — your
            blend, your tribe, and exactly how rare you are.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LinkButton href="/quiz">Begin the mapping →</LinkButton>
            <span className="text-sm text-muted">~3 minutes · no signup</span>
          </div>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
          <ColdOpen />
        </div>
      </section>

      {/* Sample result strip */}
      <section className="mt-24">
        <Eyebrow className="mb-5">A result looks like</Eyebrow>
        <GlassCard className="flex flex-col items-center gap-6 p-8 sm:flex-row" style={accentVars('#ef4444', 'rgba(239,68,68,0.45)')}>
          <Portrait sigil="⚡" accent="#ef4444" accentSoft="rgba(239,68,68,0.45)" size="lg" />
          <div className="flex-1 text-center sm:text-left">
            <p className="font-display text-3xl font-semibold">You think like Nietzsche.</p>
            <p className="mt-1 text-muted">73% Nietzsche · 18% Buddha · 9% Camus</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span className="rounded-full border border-red-400/40 px-3 py-1 text-xs uppercase tracking-widest text-red-200">
                ✦ Existentialist tribe
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-chalk/80">
                rarer than 94% of minds
              </span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* How it works */}
      <section className="mt-24 grid gap-5 sm:grid-cols-3">
        {[
          { n: '01', t: 'Face the dilemmas', d: 'The trolley. The evil demon. The experience machine. Real philosophy, as vivid choices.' },
          { n: '02', t: 'The machine decides', d: 'A transparent 9-dimension model maps you to thinkers across East and West.' },
          { n: '03', t: 'Get your identity', d: 'Your blend, your tribe, your rarity — and a card worth sharing.' },
        ].map((s) => (
          <GlassCard key={s.n} className="p-6">
            <p className="font-display text-sm text-muted">{s.n}</p>
            <h3 className="mt-2 font-display text-xl font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
          </GlassCard>
        ))}
      </section>

      {/* Tribes preview */}
      <section className="mt-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <Eyebrow>Eight worldviews</Eyebrow>
            <h2 className="mt-2 font-display text-display font-semibold">Which tribe claims you?</h2>
          </div>
          <Link href="/tribes" className="text-sm text-muted transition-colors hover:text-chalk">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TRIBE_LIST.map((t) => (
            <Link
              key={t.slug}
              href={`/tribe/${t.slug}`}
              className="glass rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
              style={accentVars(t.accent, t.accentSoft)}
            >
              <span className="text-2xl" style={{ color: t.accent }}>{t.sigil}</span>
              <p className="mt-2 font-medium">{t.name}</p>
              <p className="mt-1 text-xs leading-snug text-muted">{t.essence}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Thinkers marquee */}
      <section className="mt-24">
        <Eyebrow className="mb-5">17 thinkers · East and West</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {VISIBLE_PHILOSOPHERS.map((p) => (
            <Link
              key={p.slug}
              href={`/philosopher/${p.slug}`}
              className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-chalk/80 transition-colors hover:border-white/30 hover:text-chalk"
            >
              <span className="mr-1.5" style={{ color: p.accent }}>{p.sigil}</span>
              {p.name}
            </Link>
          ))}
          <span className="rounded-full border border-dashed border-white/15 px-3 py-1.5 text-sm text-muted">
            + 2 hidden, unlocked only by the rarest answers…
          </span>
        </div>
      </section>

      <section className="mt-24 text-center">
        <h2 className="font-display text-display font-semibold">The unexamined life is not worth living.</h2>
        <p className="mt-3 text-muted">So examine it. It takes three minutes.</p>
        <div className="mt-8">
          <LinkButton href="/quiz">Begin the mapping →</LinkButton>
        </div>
      </section>

      <SiteFooter className="mt-24" />
    </main>
  );
}
