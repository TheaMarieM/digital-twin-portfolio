"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    title: "Core Documentation",
    pages: [
      { href: "/projects", label: "Project Portfolio" },
      { href: "/designs", label: "Design Showcase" },
    ],
  },
  {
    title: "Technical Details",
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
    <aside className="lg:sticky lg:top-0 lg:h-screen overflow-y-auto border-b lg:border-b-0 lg:border-r border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 backdrop-blur-sm px-6 py-8 w-full lg:w-[320px] lg:min-w-[320px]">
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
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-purple-400">
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
                          ? "bg-purple-500/20 text-[rgb(var(--text))] font-medium border-2 border-purple-500/50"
                          : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--card))] hover:text-[rgb(var(--text))] border-2 border-transparent"
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

        <div className="rounded-lg border-2 border-purple-500/30 bg-purple-500/5 p-4">
          <div className="text-sm font-semibold text-purple-400">
            Documentation
          </div>
          <p className="mt-2 text-xs text-[rgb(var(--muted))]">
            Browse projects, technical details, and live demonstrations.
          </p>
        </div>
      </nav>
    </aside>
  );
}
