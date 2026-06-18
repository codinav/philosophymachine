import clsx from 'clsx';
import { accentVars } from './primitives';

const SIZES = {
  sm: 'h-12 w-12 text-2xl',
  md: 'h-20 w-20 text-4xl',
  lg: 'h-36 w-36 text-7xl',
  xl: 'h-44 w-44 text-8xl',
};

/**
 * A lightweight "portrait": the philosopher's sigil glyph inside a glowing,
 * accent-tinted disc. Cheap, on-brand, and renders identically in share cards.
 */
export function Portrait({
  sigil,
  accent,
  accentSoft,
  size = 'lg',
  className,
}: {
  sigil: string;
  accent: string;
  accentSoft: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <div
      className={clsx('relative grid place-items-center rounded-full', SIZES[size], className)}
      style={accentVars(accent, accentSoft)}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 40%, var(--accent-soft), transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      <div
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: accent, opacity: 0.55, boxShadow: `0 0 50px -6px ${accentSoft}, inset 0 0 30px -10px ${accentSoft}` }}
      />
      <span className="relative font-display font-semibold" style={{ color: accent }}>
        {sigil}
      </span>
    </div>
  );
}
