'use client';

import { useEffect, useRef } from 'react';

// A "planetarium for the mind" — a quiet, drifting starfield behind everything.
// Canvas-based, capped star count, pauses for prefers-reduced-motion.
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Star = { x: number; y: number; r: number; a: number; tw: number; vy: number };
    let stars: Star[] = [];

    const seed = () => {
      const count = Math.min(180, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * 0.6 + 0.1,
        tw: Math.random() * 0.02 + 0.003,
        vy: Math.random() * 0.04 + 0.01,
      }));
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.016;
      for (const s of stars) {
        const tw = reduce ? s.a : s.a + Math.sin(t * s.tw * 60 + s.x) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,224,255,${Math.max(0.04, Math.min(0.9, tw))})`;
        ctx.fill();
        if (!reduce) {
          s.y += s.vy;
          if (s.y > h + 2) {
            s.y = -2;
            s.x = Math.random() * w;
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    if (reduce) {
      draw();
      cancelAnimationFrame(raf);
      // single static frame
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,224,255,${s.a})`;
        ctx.fill();
      }
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
