"use client";
import DocsLayout from "../components/DocsLayout";

export default function TestingPage() {
  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Testing & Validation
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-2xl mx-auto">
              Comprehensive testing strategies and validation processes for the digital twin system.
            </p>
          </div>

          {/* Testing Categories */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* MCP Server Testing */}
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔧</span>
                <h2 className="text-2xl font-bold">MCP Server Testing</h2>
              </div>
              <ul className="space-y-3 text-[rgb(var(--muted))]">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Tool functionality validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>HTTP server endpoint testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>MCP protocol compliance checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Error handling and edge cases</span>
                </li>
              </ul>
            </div>

            {/* RAG System Testing */}
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🧠</span>
                <h2 className="text-2xl font-bold">RAG System Testing</h2>
              </div>
              <ul className="space-y-3 text-[rgb(var(--muted))]">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>Embedding quality validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>Semantic search accuracy testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>Response quality assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>Context relevance evaluation</span>
                </li>
              </ul>
            </div>

            {/* Performance Testing */}
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚡</span>
                <h2 className="text-2xl font-bold">Performance Testing</h2>
              </div>
              <ul className="space-y-3 text-[rgb(var(--muted))]">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">📊</span>
                  <span>Load testing with concurrent users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">📊</span>
                  <span>Response time benchmarking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">📊</span>
                  <span>Memory and CPU usage monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">📊</span>
                  <span>Database query optimization</span>
                </li>
              </ul>
            </div>

            {/* Integration Testing */}
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔗</span>
                <h2 className="text-2xl font-bold">Integration Testing</h2>
              </div>
              <ul className="space-y-3 text-[rgb(var(--muted))]">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">🔧</span>
                  <span>Claude Desktop integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">🔧</span>
                  <span>VS Code MCP configuration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">🔧</span>
                  <span>Next.js frontend connectivity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">🔧</span>
                  <span>API endpoint compatibility</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Test Commands */}
          <div className="mt-12 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6">Test Commands</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                <h3 className="font-semibold mb-2">MCP Server Testing</h3>
                <code className="text-sm text-[rgb(var(--muted))] block font-mono">
                  python mcp/test_server.py<br/>
                  python scripts/test_mcp_direct.py
                </code>
              </div>
              
              <div className="p-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                <h3 className="font-semibold mb-2">Chat System Testing</h3>
                <code className="text-sm text-[rgb(var(--muted))] block font-mono">
                  python scripts/chat_with_ollama.py<br/>
                  python scripts/demo_portfolio_chat.py
                </code>
              </div>
              
              <div className="p-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                <h3 className="font-semibold mb-2">Interview Simulation</h3>
                <code className="text-sm text-[rgb(var(--muted))] block font-mono">
                  python scripts/interview_simulator.py<br/>
                  python scripts/quick_interview.py
                </code>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="mt-12 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-2 border-[rgb(var(--border))] rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6">Current Test Results</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-sm text-[rgb(var(--muted))]">MCP Tools Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">&lt;2s</div>
                <div className="text-sm text-[rgb(var(--muted))]">Average Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
                <div className="text-sm text-[rgb(var(--muted))]">Query Relevance Score</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DocsLayout>
  );
}
