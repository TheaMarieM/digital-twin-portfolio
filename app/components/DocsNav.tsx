"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    title: "Core Documentation",
    icon: "📚",
    pages: [
      { href: "/projects", label: "Project Portfolio" },
      { href: "/github", label: "GitHub Repositories" },
      { href: "/demo", label: "Live Demonstrations" },
    ],
  },
  {
    title: "Technical Details",
    icon: "⚡",
    pages: [
      { href: "/mcp-integration", label: "MCP Integration" },
      { href: "/advanced-features", label: "Advanced Features" },
      { href: "/testing", label: "Testing & Validation" },
    ],
  },
];

export default function DocsNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 backdrop-blur-sm px-4 py-6">
      <nav className="space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--accent))] hover:text-[rgb(var(--accent))]/80 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
              <span>{section.icon}</span>
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.pages.map((page) => {
                const isActive = pathname === page.href;
                return (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className={`flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-[rgb(var(--text))] font-medium border border-[rgb(var(--accent))]/30"
                          : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--card))] hover:text-[rgb(var(--text))]"
                      }`}
                    >
                      {page.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="rounded-lg border border-[rgb(var(--border))] bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>💡</span>
            <span>Documentation</span>
          </div>
          <p className="mt-2 text-xs text-[rgb(var(--muted))]">
            Browse projects, technical details, and live demonstrations.
          </p>
        </div>
      </nav>
    </aside>
  );
}
