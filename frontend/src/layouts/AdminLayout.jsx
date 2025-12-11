// Minimal AdminLayout
export default function AdminLayout({ children }) {
  return (
    <div>
      <header>Admin Layout Header</header>
      <aside>Sidebar Placeholder</aside>
      <main>{children}</main>
    </div>
  );
}
