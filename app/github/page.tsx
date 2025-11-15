"use client";
import DocsLayout from "../components/DocsLayout";
import { useState } from "react";

const repositories = [
  {
    name: "my-ai-app",
    fullName: "Digital Twin MCP Server",
    description: "RAG-powered portfolio assistant with FastAPI + Next.js integration",
    url: "https://github.com/TheaMarieM/my-ai-app",
    status: "Active",
    stars: 0,
    language: "TypeScript",
    topics: ["mcp", "rag", "nextjs", "fastapi", "groq", "upstash"],
    features: ["7 MCP Tools", "Upstash Vector", "Groq LLaMA 3.3", "Interview Training"]
  },
  {
    name: "portfolio",
    fullName: "Personal Portfolio Website",
    description: "Modern portfolio with Tailwind CSS, dark mode, and accessibility features",
    url: "https://github.com/TheaMarieM/portfolio",
    status: "Complete",
    stars: 0,
    language: "HTML",
    topics: ["portfolio", "tailwind", "responsive", "accessibility"],
    features: ["95+ Lighthouse", "WCAG AA", "Dark Mode", "Mobile First"]
  },
  {
    name: "rag-chatbot",
    fullName: "RAG Chatbot POC",
    description: "Retrieval-augmented generation chatbot with embeddings and semantic search",
    url: "https://github.com/TheaMarieM/rag-chatbot",
    status: "Complete",
    stars: 0,
    language: "JavaScript",
    topics: ["rag", "openai", "embeddings", "chatbot"],
    features: ["Semantic Search", "Citation Support", ">0.7 Similarity", "Q&A Interface"]
  },
  {
    name: "team-planner",
    fullName: "Team Task Planner",
    description: "Kanban-style task management system for team collaboration and deadlines",
    url: "https://github.com/TheaMarieM/team-planner",
    status: "Complete",
    stars: 0,
    language: "JavaScript",
    topics: ["kanban", "react", "task-management", "productivity"],
    features: ["Drag & Drop", "Priority Levels", "CSV Export", "Local Storage"]
  },
  {
    name: "responsive-ui",
    fullName: "Responsive UI Components",
    description: "Collection of responsive UI components with modern CSS Grid and Flexbox",
    url: "https://github.com/TheaMarieM/responsive-ui",
    status: "Complete",
    stars: 0,
    language: "CSS",
    topics: ["css-grid", "flexbox", "responsive", "components"],
    features: ["25+ Components", "Container Queries", "Fluid Typography", "Storybook"]
  }
];

export default function GitHubPage() {
  const [copied, setCopied] = useState<string | null>(null);
  
  const copyURL = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <DocsLayout>
      <main className="mx-auto w-full max-w-[1400px] px-6 lg:px-8 py-12">
        <section className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-1.5 text-sm mb-6">
            <span className="text-2xl">🔗</span>
            <span className="font-medium">GitHub Repositories</span>
          </div>
          <h1 className="text-4xl font-bold md:text-5xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Complete Implementation</h1>
          <p className="mt-4 text-lg text-[rgb(var(--muted))] max-w-3xl">
            Production-ready code with advanced features, comprehensive testing, and deployment guides.
          </p>
          <div className="mt-6 h-1.5 w-32 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
        </section>

        {/* Repository Cards */}
        <div className="grid gap-6 mb-12">
          {repositories.map((repo) => (
            <article key={repo.name} className="group rounded-xl border-2 border-[rgb(var(--border))] bg-gradient-to-br from-[rgb(var(--card))] to-transparent p-6 shadow-lg hover:shadow-2xl hover:border-[rgb(var(--accent))] transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{repo.fullName}</h2>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      repo.status === "Active" 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {repo.status}
                    </span>
                  </div>
                  <code className="text-sm text-purple-400 font-mono">{repo.name}</code>
                  <p className="text-[rgb(var(--muted))] mt-3">{repo.description}</p>
                </div>
              </div>

              {/* Language & Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-full ${
                    repo.language === "TypeScript" ? "bg-blue-500" :
                    repo.language === "JavaScript" ? "bg-yellow-500" :
                    repo.language === "HTML" ? "bg-orange-500" :
                    "bg-purple-500"
                  }`}></span>
                  {repo.language}
                </span>
                <span className="flex items-center gap-1 text-[rgb(var(--muted))]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {repo.stars}
                </span>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2 mb-4">
                {repo.topics.map(topic => (
                  <span key={topic} className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-xs font-medium text-purple-300">
                    {topic}
                  </span>
                ))}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {repo.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-sm text-[rgb(var(--muted))]">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-200"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  View on GitHub
                </a>
                <button
                  onClick={() => copyURL(repo.url)}
                  className="px-4 py-2.5 rounded-lg border-2 border-[rgb(var(--border))] bg-[rgb(var(--card))] hover:border-purple-500/50 transition-all text-sm font-medium"
                  title="Copy URL"
                >
                  {copied === repo.url ? "✓" : "📋"}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-2xl border-2 border-[rgb(var(--border))] bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Implementation Checklist</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: "✅ Core RAG System", items: ["Groq + LLaMA 3.3 integration", "Upstash Vector with 16 chunks", "STAR-format profile data", "Conversation history (Redis)"] },
              { title: "✅ Advanced Features", items: ["Query enhancement & optimization", "Semantic caching", "Response refinement", "Multi-platform testing"] },
              { title: "✅ Production Ready", items: ["Live monitoring dashboard", "Load testing framework", "Operations runbook", "Deployment guides"] },
              { title: "✅ Documentation", items: ["Interactive UI pages", "Code examples", "Performance benchmarks", "Architecture diagrams"] },
            ].map((section) => (
              <div key={section.title} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
                <h3 className="font-semibold text-lg mb-3">{section.title}</h3>
                <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h2 className="text-xl font-bold mb-4">Quick Start</h2>
          <p className="text-sm text-[rgb(var(--muted))] mb-4">Clone the main repository to get started with the Digital Twin MCP Server:</p>
          <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-4 font-mono text-sm">
            <code className="flex-1">git clone https://github.com/TheaMarieM/my-ai-app.git</code>
            <button
              onClick={() => copyURL("https://github.com/TheaMarieM/my-ai-app.git")}
              className="rounded-md bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:scale-105 transition-transform"
            >
              {copied === "https://github.com/TheaMarieM/my-ai-app.git" ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div className="mt-4 flex gap-3">
            <a href="/about" className="text-sm text-purple-400 hover:underline">📚 View Documentation</a>
            <a href="/testing" className="text-sm text-purple-400 hover:underline">🧪 Test the API</a>
            <a href="/projects" className="text-sm text-purple-400 hover:underline">💡 See All Projects</a>
          </div>
        </div>
      </main>
    </DocsLayout>
  );
}
