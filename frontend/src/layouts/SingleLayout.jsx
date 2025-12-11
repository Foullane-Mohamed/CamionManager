// Minimal SingleLayout
export default function SingleLayout({ children }) {
  return (
    <div>
      <header>Single Layout Header</header>
      <main>{children}</main>
    </div>
  );
}
