import { ImageResponse } from 'next/og';
import { decodeResult } from '@/lib/codec';
import { buildResultFromVector } from '@/lib/scoring';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { TRIBES } from '@/lib/data/tribes';
import { TIER_LABEL } from '@/lib/rarity';
import { cleanName } from '@/lib/name';

export const runtime = 'nodejs';

const SIZES = {
  og: { w: 1200, h: 630 },
  story: { w: 1080, h: 1920 },
  square: { w: 1080, h: 1080 },
};

type Params = { params: Promise<{ code: string }> };

export async function GET(req: Request, { params }: Params) {
  const { code } = await params;
  const url = new URL(req.url);
  const fmt = (url.searchParams.get('fmt') as keyof typeof SIZES) || 'og';
  const { w, h } = SIZES[fmt] ?? SIZES.og;
  const name = cleanName(url.searchParams.get('n'));
  const lede = name ? `${name} thinks like` : 'I think like';

  const decoded = decodeResult(code);
  if (!decoded) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070710', color: '#fff', fontSize: 48 }}>
          The Philosophy Machine
        </div>
      ),
      { width: w, height: h },
    );
  }

  const r = buildResultFromVector(decoded.dimensions, decoded.aporiaCount, decoded.isDeep, 18);
  const p = PHILOSOPHER_BY_SLUG[r.primary];
  const tribe = TRIBES[r.tribe];
  const accent = p.accent;
  const isStory = fmt === 'story';
  const top3 = r.blend.slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#070710',
          backgroundImage: `radial-gradient(60% 50% at 50% ${isStory ? '24%' : '10%'}, ${p.accentSoft}, transparent 60%)`,
          color: '#ECECF1',
          padding: isStory ? 90 : 64,
          fontFamily: 'serif',
        }}
      >
        {/* top: identity */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: isStory ? 30 : 24, letterSpacing: 6, color: '#8A8AA0', textTransform: 'uppercase' }}>
            The Philosophy Machine
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: isStory ? 60 : 28 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isStory ? 200 : 150,
                height: isStory ? 200 : 150,
                borderRadius: 999,
                border: `3px solid ${accent}`,
                background: p.accentSoft,
                color: accent,
                fontSize: isStory ? 110 : 84,
                marginRight: isStory ? 0 : 40,
                fontWeight: 700,
              }}
            >
              {p.name.charAt(0)}
            </div>
            {!isStory && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', fontSize: 30, color: '#8A8AA0' }}>{lede}</div>
                <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, color: accent, lineHeight: 1 }}>{p.name}</div>
              </div>
            )}
          </div>
          {isStory && (
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 50 }}>
              <div style={{ display: 'flex', fontSize: 38, color: '#8A8AA0' }}>{lede}</div>
              <div style={{ display: 'flex', fontSize: 120, fontWeight: 700, color: accent, lineHeight: 1 }}>{p.name}</div>
            </div>
          )}
        </div>

        {/* middle: blend bars */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: isStory ? 60 : 24 }}>
          {top3.map((b) => {
            const ph = PHILOSOPHER_BY_SLUG[b.slug];
            return (
              <div key={b.slug} style={{ display: 'flex', alignItems: 'center', marginBottom: isStory ? 26 : 16 }}>
                <div style={{ display: 'flex', width: isStory ? 320 : 260, fontSize: isStory ? 36 : 30, color: '#ECECF1' }}>{ph.name}</div>
                <div style={{ display: 'flex', flex: 1, height: isStory ? 18 : 14, background: 'rgba(255,255,255,0.08)', borderRadius: 999, marginRight: 24 }}>
                  <div style={{ display: 'flex', width: `${b.pct}%`, background: ph.accent, borderRadius: 999 }} />
                </div>
                <div style={{ display: 'flex', width: 90, fontSize: isStory ? 36 : 30, fontWeight: 700, justifyContent: 'flex-end' }}>{b.pct}%</div>
              </div>
            );
          })}
        </div>

        {/* quote */}
        <div style={{ display: 'flex', fontSize: isStory ? 40 : 30, fontStyle: 'italic', color: '#ECECF1', marginTop: isStory ? 50 : 20, lineHeight: 1.3 }}>
          “{p.quote.length > 90 ? p.quote.slice(0, 88) + '…' : p.quote}”
        </div>

        {/* footer: tribe + rarity + url */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: isStory ? 60 : 28 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: `2px solid ${tribe.accent}`, color: tribe.accent, borderRadius: 999, padding: isStory ? '12px 24px' : '8px 18px', fontSize: isStory ? 30 : 24, marginRight: 18 }}>
              {tribe.name} tribe
            </div>
            <div style={{ display: 'flex', color: '#fbbf24', fontSize: isStory ? 30 : 24 }}>
              {TIER_LABEL[r.rarityTier]} · rarer than {r.rarityPct}%
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8A8AA0', fontSize: isStory ? 28 : 22, marginTop: 16 }}>
          <div style={{ display: 'flex' }}>philosophymachine.app</div>
          <div style={{ display: 'flex' }}>/r/{code.slice(0, 8)}</div>
        </div>
      </div>
    ),
    {
      width: w,
      height: h,
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
  );
}
