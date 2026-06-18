'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ResultPayload } from '@/types';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';

type Fmt = 'og' | 'story' | 'square';
const FMT_RATIO: Record<Fmt, string> = { og: 'aspect-[1200/630]', story: 'aspect-[1080/1920]', square: 'aspect-square' };
const FMT_LABEL: Record<Fmt, string> = { og: 'Link / X', story: 'Story', square: 'Post' };

export function ShareSheet({ result, code, name }: { result: ResultPayload; code: string; name?: string }) {
  const [fmt, setFmt] = useState<Fmt>('og');
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const p = PHILOSOPHER_BY_SLUG[result.primary];

  const nParam = name ? `&n=${encodeURIComponent(name)}` : '';
  const nQuery = name ? `?n=${encodeURIComponent(name)}` : '';
  const url = typeof window !== 'undefined' ? `${window.location.origin}/result/${code}${nQuery}` : `/result/${code}${nQuery}`;
  const text = `${name ? `${name} thinks` : 'I think'} like ${p.name}. ${result.blend
    .slice(0, 3)
    .map((b) => `${b.pct}% ${PHILOSOPHER_BY_SLUG[b.slug].name}`)
    .join(', ')} — rarer than ${result.rarityPct}% of minds. What do you believe?`;
  const img = `/api/og/${code}?fmt=${fmt}${nParam}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  // One-click share: try to share the actual card IMAGE as a file (mobile),
  // falling back to text+link share, then to copy.
  const nativeShare = async () => {
    setSharing(true);
    try {
      const res = await fetch(img);
      const blob = await res.blob();
      const file = new File([blob], `philosophy-${code}.png`, { type: 'image/png' });
      const navAny = navigator as Navigator & { canShare?: (d: unknown) => boolean };
      if (navAny.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'The Philosophy Machine', text });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: 'The Philosophy Machine', text, url });
        return;
      }
      copy();
    } catch {
      copy();
    } finally {
      setSharing(false);
    }
  };

  const targets = [
    { name: 'X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}` },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Share your worldview</h3>
        <div className="flex gap-1 rounded-full bg-white/[0.05] p-1 text-xs">
          {(['og', 'story', 'square'] as Fmt[]).map((f) => (
            <button
              key={f}
              onClick={() => setFmt(f)}
              className={`rounded-full px-3 py-1 transition-colors ${fmt === f ? 'bg-chalk text-ink' : 'text-muted hover:text-chalk'}`}
            >
              {FMT_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      <div className={`mx-auto overflow-hidden rounded-2xl border border-white/10 ${FMT_RATIO[fmt]} ${fmt === 'story' ? 'max-h-[420px] w-auto' : 'w-full'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={`${p.name} share card`} className="h-full w-full object-cover" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button onClick={nativeShare} disabled={sharing} className="rounded-full bg-chalk py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white disabled:opacity-60">
          {sharing ? 'Preparing…' : 'Share card ↗'}
        </button>
        <button onClick={copy} className="rounded-full glass py-2.5 text-sm transition-colors hover:bg-white/[0.08]">
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>
        <a href={img} download={`philosophy-${code}.png`} className="rounded-full glass py-2.5 text-center text-sm transition-colors hover:bg-white/[0.08]">
          Download
        </a>
        {targets.map((t) => (
          <a
            key={t.name}
            href={t.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full glass py-2.5 text-center text-sm transition-colors hover:bg-white/[0.08]"
          >
            {t.name}
          </a>
        ))}
      </div>
    </motion.div>
  );
}
