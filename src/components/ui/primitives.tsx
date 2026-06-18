import Link from 'next/link';
import clsx from 'clsx';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

/** Inject a philosopher/tribe accent as CSS vars for any subtree. */
export function accentVars(accent: string, accentSoft: string): CSSProperties {
  return { ['--accent' as string]: accent, ['--accent-soft' as string]: accentSoft };
}

export function GlassCard({
  children,
  className,
  strong,
  style,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={clsx(strong ? 'glass-strong' : 'glass', 'rounded-3xl', className)} style={style}>
      {children}
    </div>
  );
}

type ButtonVariant = 'primary' | 'ghost' | 'accent';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-chalk text-ink hover:bg-white',
  accent: 'text-ink hover:brightness-110',
  ghost: 'glass text-chalk hover:bg-white/[0.08]',
};

export function Button({
  children,
  variant = 'primary',
  className,
  ...rest
}: ComponentProps<'button'> & { variant?: ButtonVariant }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 active:scale-[0.98] disabled:opacity-40',
        variants[variant],
        className,
      )}
      style={variant === 'accent' ? { background: 'var(--accent)' } : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  href,
  variant = 'primary',
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 active:scale-[0.98]',
        variants[variant],
        className,
      )}
      style={variant === 'accent' ? { background: 'var(--accent)' } : undefined}
    >
      {children}
    </Link>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={clsx('text-xs font-medium uppercase tracking-[0.3em] text-muted', className)}>{children}</p>
  );
}
