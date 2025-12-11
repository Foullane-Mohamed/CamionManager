// Minimal ChauffeurLayout
export default function ChauffeurLayout({ children }) {
  return (
    <div>
      <header>Chauffeur Layout Header</header>
      <aside>Sidebar Placeholder</aside>
      <main>{children}</main>
    </div>
  );
}
