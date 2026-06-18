import { ImageResponse } from 'next/og';

// iOS home-screen icon (auto-linked by Next). Pure shapes — no font — so it
// always renders. Matches the brand emblem in public/icon.svg.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070710',
          backgroundImage: 'radial-gradient(80% 70% at 50% 36%, #2b2a6b, #070710 70%)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', width: 96, height: 96, borderRadius: 999, border: '7px solid #818cf8' }} />
        <div style={{ display: 'flex', position: 'absolute', width: 126, height: 126, borderRadius: 999, border: '2px solid rgba(129,140,248,0.35)' }} />
        <div style={{ display: 'flex', position: 'absolute', top: 40, left: 108, width: 14, height: 14, borderRadius: 999, background: '#fff' }} />
      </div>
    ),
    { ...size },
  );
}
