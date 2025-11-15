import DocsNav from "./DocsNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <DocsNav />
        <div className="pt-20">
          {children}
        </div>
      </div>
    </div>
  );
}
