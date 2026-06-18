'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print rounded-full bg-ink px-6 py-3 text-sm font-medium text-chalk transition-opacity hover:opacity-90"
    >
      Save as PDF ↓
    </button>
  );
}
