"use client";
import DocsLayout from "../components/DocsLayout";

export default function AdvancedFeaturesPage() {
  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Advanced Features
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-2xl mx-auto">
              Enhanced capabilities and advanced implementations across the digital twin system.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* RAG Enhancement */}
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🧠</span>
                <h2 className="text-2xl font-bold">RAG Enhancement</h2>
              </div>
              <ul className="space-y-3 text-[rgb(var(--muted))]">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">▸</span>
                  <span>Groq + LLaMA 3.3-70b integration for fast inference</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">▸</span>
                  <span>384-dimensional embeddings with semantic search</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">▸</span>
                  <span>Query optimization and response refinement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">▸</span>
                  <span>Context-aware answer generation</span>
                </li>
              </ul>
            </div>

            {/* MCP Tools */}
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔧</span>
                <h2 className="text-2xl font-bold">MCP Tools Suite</h2>
              </div>
              <ul className="space-y-3 text-[rgb(var(--muted))]">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">▸</span>
                  <span>7 production tools for portfolio queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">▸</span>
                  <span>Interview Q&A generation and training</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">▸</span>
                  <span>Real-time semantic search capabilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">▸</span>
                  <span>Claude Desktop and VS Code integration</span>
                </li>
              </ul>
            </div>

            {/* Performance Optimization */}
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚡</span>
                <h2 className="text-2xl font-bold">Performance Features</h2>
              </div>
              <ul className="space-y-3 text-[rgb(var(--muted))]">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">▸</span>
                  <span>Sub-2 second response times for queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">▸</span>
                  <span>Upstash Vector database optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">▸</span>
                  <span>Redis caching for conversation history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">▸</span>
                  <span>Load testing and scalability monitoring</span>
                </li>
              </ul>
            </div>

            {/* Integration Features */}
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔗</span>
                <h2 className="text-2xl font-bold">Integration Capabilities</h2>
              </div>
              <ul className="space-y-3 text-[rgb(var(--muted))]">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">▸</span>
                  <span>FastAPI HTTP server implementation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">▸</span>
                  <span>Next.js frontend with real-time chat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">▸</span>
                  <span>Cross-platform compatibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">▸</span>
                  <span>RESTful API endpoints for external access</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Technical Implementation */}
          <div className="mt-12 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6">Technical Implementation</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">20+</div>
                <div className="text-sm text-[rgb(var(--muted))]">Vector Embeddings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-2">&lt;2s</div>
                <div className="text-sm text-[rgb(var(--muted))]">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400 mb-2">7</div>
                <div className="text-sm text-[rgb(var(--muted))]">MCP Tools</div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
              <h3 className="font-semibold mb-3">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {["Next.js 16", "FastAPI", "Python", "TypeScript", "Upstash Vector", "Groq API", "Redis", "Tailwind CSS"].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </DocsLayout>
  );
}
