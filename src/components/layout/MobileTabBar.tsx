'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

// Mobile-only bottom navigation (docs/03 IA). Lives in the layout (not inside
// the page template), so it never remounts on navigation — letting the active
// indicator glide smoothly between tabs via a shared layoutId.
const TABS = [
  { href: '/', label: 'Home', icon: '◇' },
  { href: '/quiz', label: 'Test', icon: '✶' },
  { href: '/battles', label: 'Battles', icon: '⚔' },
  { href: '/daily', label: 'Daily', icon: '◷' },
  { href: '/me', label: 'You', icon: '◍' },
];

const HIDE_ON = [/^\/quiz/, /^\/chat\//, /\/report$/, /^\/admin/];

export function MobileTabBar() {
  const pathname = usePathname() || '/';
  if (HIDE_ON.some((re) => re.test(pathname))) return null;

  return (
    <nav
      className="glass-strong fixed inset-x-0 bottom-0 z-50 flex justify-around border-t border-white/10 px-2 pt-2 sm:hidden"
      style={{ paddingBottom: 'calc(0.4rem + env(safe-area-inset-bottom))' }}
      aria-label="Primary"
    >
      {TABS.map((t) => {
        const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className="relative flex flex-1 justify-center">
            <motion.span
              whileTap={{ scale: 0.82 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              className="relative flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[10px] font-medium"
              style={{ color: active ? '#a5b4fc' : '#8A8AA0' }}
            >
              {active && (
                <motion.span
                  layoutId="tab-active"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(129,140,248,0.14)', boxShadow: 'inset 0 0 0 1px rgba(129,140,248,0.25)' }}
                  transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                />
              )}
              <span className="relative text-lg leading-none">{t.icon}</span>
              <span className="relative">{t.label}</span>
            </motion.span>
          </Link>
        );
      })}
    </nav>
  );
}
