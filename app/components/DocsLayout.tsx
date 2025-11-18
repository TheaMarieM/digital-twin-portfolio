import DocsNav from "./DocsNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <div className="flex flex-col lg:flex-row">
        <DocsNav />
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
          
          {/* Footer */}
          <footer className="mt-20 border-t border-[rgb(var(--border))] pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-sm text-[rgb(var(--muted))] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} Marithea Magno. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <a href="/#contact" className="hover:text-purple-400 transition-colors">Contact</a>
                  <a href="/about" className="hover:text-purple-400 transition-colors">About</a>
                  <a href="https://github.com/TheaMarieM" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">GitHub</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
