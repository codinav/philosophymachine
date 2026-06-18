import clsx from 'clsx';

// Site footer with creator attribution. Used across the main surfaces.
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={clsx('mt-20 border-t border-white/10 pt-8 text-center text-xs text-muted', className)}>
      <p>The Philosophy Machine · a mirror for the mind · {new Date().getFullYear()}</p>
      <p className="mt-2">
        Designed &amp; developed by{' '}
        <a
          href="mailto:abhinav.philosophy@gmail.com"
          className="font-medium text-chalk/85 underline-offset-4 transition-colors hover:text-chalk hover:underline"
        >
          Abhinav Saxena
        </a>
      </p>
    </footer>
  );
}
