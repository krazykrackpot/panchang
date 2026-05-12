/** Redirect wrapper — no metadata needed since the page immediately redirects */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
