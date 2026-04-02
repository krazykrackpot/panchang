'use client';

export default function LearnLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {children}
    </div>
  );
}
