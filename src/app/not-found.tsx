import { LinkButton } from '@/components/ui/primitives';

export default function NotFound() {
  return (
    <main className="grid min-h-[80vh] place-items-center px-5 text-center">
      <div>
        <p className="font-display text-7xl font-semibold">404</p>
        <p className="mt-4 font-display text-2xl">This path leads nowhere.</p>
        <p className="mt-2 text-muted">Even Socrates admitted he knew nothing. Begin again.</p>
        <div className="mt-8">
          <LinkButton href="/">Return home →</LinkButton>
        </div>
      </div>
    </main>
  );
}
