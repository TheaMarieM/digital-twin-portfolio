"use client";
import DocsLayout from "../components/DocsLayout";

export default function AdvancedFeaturesPage() {
  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-purple-400">
              Advanced Features
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-2xl mx-auto">
              Cutting-edge capabilities powering the digital twin portfolio system.
              Production-ready RAG pipeline, MCP protocol integration, and high-performance architecture.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* RAG Enhancement */}
            <div className="bg-[rgb(var(--card))] border-2 border-purple-500/30 rounded-xl p-6 hover:border-purple-500 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">RAG Chat System</h2>
              <p className="text-sm text-[rgb(var(--muted))] mb-4">
                Production-ready retrieval-augmented generation with high accuracy and fast response times.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-[rgb(var(--bg))] border border-purple-500/20 rounded-lg">
                  <div className="font-semibold text-purple-400 mb-1">LLM Engine</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Groq LLaMA 3.3-70b for high-speed, accurate responses</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-purple-500/20 rounded-lg">
                  <div className="font-semibold text-purple-400 mb-1">Vector Database</div>
                  <div className="text-sm text-[rgb(var(--muted))]">20 embedded chunks in Upstash Vector with 95%+ retrieval accuracy</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-purple-500/20 rounded-lg">
                  <div className="font-semibold text-purple-400 mb-1">Embeddings</div>
                  <div className="text-sm text-[rgb(var(--muted))]">384-dimensional sentence-transformers for semantic similarity</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-purple-500/20 rounded-lg">
                  <div className="font-semibold text-purple-400 mb-1">Response Quality</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Context-aware answers with source citations and conversation memory</div>
                </div>
              </div>
            </div>

            {/* MCP Tools */}
            <div className="bg-[rgb(var(--card))] border-2 border-pink-500/30 rounded-xl p-6 hover:border-pink-500 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-pink-400">MCP Protocol</h2>
              <p className="text-sm text-[rgb(var(--muted))] mb-4">
                Model Context Protocol integration enabling AI assistants to interact with portfolio data.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-[rgb(var(--bg))] border border-pink-500/20 rounded-lg">
                  <div className="font-semibold text-pink-400 mb-1">7 Production Tools</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Portfolio queries, interview Q&A, and semantic search capabilities</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-pink-500/20 rounded-lg">
                  <div className="font-semibold text-pink-400 mb-1">Dual Protocol Support</div>
                  <div className="text-sm text-[rgb(var(--muted))]">FastAPI server with HTTP (port 3000) and stdio for Claude Desktop</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-pink-500/20 rounded-lg">
                  <div className="font-semibold text-pink-400 mb-1">Interview Training</div>
                  <div className="text-sm text-[rgb(var(--muted))]">10+ generated Q&A pairs with STAR-format answers</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-pink-500/20 rounded-lg">
                  <div className="font-semibold text-pink-400 mb-1">Real-Time Integration</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Live portfolio updates accessible through natural language</div>
                </div>
              </div>
            </div>

            {/* Performance Optimization */}
            <div className="bg-[rgb(var(--card))] border-2 border-emerald-500/30 rounded-xl p-6 hover:border-emerald-500 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">Performance Metrics</h2>
              <p className="text-sm text-[rgb(var(--muted))] mb-4">
                Optimized architecture delivering fast, reliable responses with enterprise-grade scalability.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-[rgb(var(--bg))] border border-emerald-500/20 rounded-lg">
                  <div className="font-semibold text-emerald-400 mb-1">&lt;2s Response Time</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Average RAG query processing from input to generated response</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-emerald-500/20 rounded-lg">
                  <div className="font-semibold text-emerald-400 mb-1">95%+ Accuracy</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Semantic search retrieval accuracy with relevant context matching</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-emerald-500/20 rounded-lg">
                  <div className="font-semibold text-emerald-400 mb-1">Redis Session Cache</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Persistent conversation history and context management</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-emerald-500/20 rounded-lg">
                  <div className="font-semibold text-emerald-400 mb-1">Load Tested</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Validated performance under concurrent user requests</div>
                </div>
              </div>
            </div>

            {/* Integration Features */}
            <div className="bg-[rgb(var(--card))] border-2 border-blue-500/30 rounded-xl p-6 hover:border-blue-500 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">System Integration</h2>
              <p className="text-sm text-[rgb(var(--muted))] mb-4">
                Full-stack architecture with seamless frontend-backend communication and external API access.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-[rgb(var(--bg))] border border-blue-500/20 rounded-lg">
                  <div className="font-semibold text-blue-400 mb-1">FastAPI Backend</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Python 3.11 MCP server on port 3000 with async request handling</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-blue-500/20 rounded-lg">
                  <div className="font-semibold text-blue-400 mb-1">Next.js Frontend</div>
                  <div className="text-sm text-[rgb(var(--muted))]">React 19 chat interface on port 3001 with streaming responses</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-blue-500/20 rounded-lg">
                  <div className="font-semibold text-blue-400 mb-1">RESTful API</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Documented HTTP endpoints for all 7 MCP tools with JSON responses</div>
                </div>
                <div className="p-3 bg-[rgb(var(--bg))] border border-blue-500/20 rounded-lg">
                  <div className="font-semibold text-blue-400 mb-1">CORS & Security</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Cross-origin enabled with secure environment variable management</div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Implementation */}
          <div className="mt-12 bg-[rgb(var(--card))] border-2 border-purple-500/30 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Technical Metrics</h2>
            
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center p-4 bg-[rgb(var(--bg))] border-2 border-purple-500/30 rounded-lg">
                <div className="text-3xl font-bold text-purple-400 mb-2">20</div>
                <div className="text-sm text-[rgb(var(--muted))]">Vector Embeddings</div>
              </div>
              <div className="text-center p-4 bg-[rgb(var(--bg))] border-2 border-pink-500/30 rounded-lg">
                <div className="text-3xl font-bold text-pink-400 mb-2">&lt;2s</div>
                <div className="text-sm text-[rgb(var(--muted))]">Response Time</div>
              </div>
              <div className="text-center p-4 bg-[rgb(var(--bg))] border-2 border-emerald-500/30 rounded-lg">
                <div className="text-3xl font-bold text-emerald-400 mb-2">7</div>
                <div className="text-sm text-[rgb(var(--muted))]">MCP Tools</div>
              </div>
              <div className="text-center p-4 bg-[rgb(var(--bg))] border-2 border-blue-500/30 rounded-lg">
                <div className="text-3xl font-bold text-blue-400 mb-2">10</div>
                <div className="text-sm text-[rgb(var(--muted))]">Total Projects</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-[rgb(var(--bg))] border-2 border-[rgb(var(--border))] rounded-lg">
              <h3 className="font-semibold mb-4 text-lg text-purple-400">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {["Next.js 16", "FastAPI", "Python 3.11", "TypeScript", "Upstash Vector", "Groq LLaMA 3.3", "Redis", "Tailwind CSS", "ShadCN UI", "Vercel"].map(tech => (
                  <span key={tech} className="px-3 py-1.5 bg-[rgb(var(--card))] border border-purple-500/30 rounded-lg text-sm hover:border-purple-500 transition-colors">
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
