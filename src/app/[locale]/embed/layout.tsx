/**
 * Embed layout — no navbar, no footer, transparent background.
 * Used for iframe-embeddable widgets.
 */
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'transparent', padding: 0, margin: 0 }}>
      {children}
    </div>
  );
}
