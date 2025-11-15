"use client";
import { useState } from "react";
import DocsLayout from "../components/DocsLayout";

const demos = [
  {
    id: "rag-chat",
    title: "RAG Chat Demo",
    description: "Interactive chat powered by Groq LLaMA 3.3 with semantic search across portfolio content",
    category: "AI/ML",
    demoUrl: "/",
    icon: "💬",
    features: [
      "Real-time semantic search with Upstash Vector",
      "Context-aware responses from Groq LLaMA 3.3-70b",
      "Citation support for all answers",
      "Conversation history with Redis"
    ],
    usage: "Ask questions about my background, projects, or technical skills. The system will search my portfolio and provide accurate answers with citations."
  },
  {
    id: "mcp-tools",
    title: "MCP Tools Playground",
    description: "Test all 7 MCP tools with live responses from the FastAPI server",
    category: "API",
    demoUrl: "/testing",
    icon: "🔧",
    features: [
      "7 production MCP tools",
      "Live API testing interface",
      "JSON response viewer",
      "Sample queries included"
    ],
    usage: "Select a sample query or enter your own to test the MCP tools. See real-time responses from the portfolio query, interview, and RAG systems."
  },
  {
    id: "profile-search",
    title: "Profile Data Search",
    description: "Search through STAR-formatted professional experiences with real-time filtering",
    category: "Data",
    demoUrl: "/profile-data",
    icon: "⭐",
    features: [
      "Real-time search across all STAR items",
      "Expandable sections for each experience",
      "Color-coded STAR methodology",
      "Stats dashboard with metrics"
    ],
    usage: "Search by title, skills, or keywords to find relevant experiences. Click any item to expand and see the full STAR breakdown."
  },
  {
    id: "live-monitoring",
    title: "Live Monitoring Dashboard",
    description: "Real-time system metrics and performance monitoring",
    category: "DevOps",
    demoUrl: "/monitoring",
    icon: "📊",
    features: [
      "Live metrics polling (5s intervals)",
      "Response time tracking",
      "Cache hit rate monitoring",
      "System health indicators"
    ],
    usage: "Watch live metrics update automatically. Monitor response times, cache performance, and overall system health."
  },
  {
    id: "load-testing",
    title: "Load Testing Interface",
    description: "Configure and run load tests to simulate concurrent users",
    category: "Testing",
    demoUrl: "/scalability",
    icon: "📈",
    features: [
      "Configurable concurrent users (1-50)",
      "Custom query selection",
      "Real-time progress tracking",
      "Performance metrics visualization"
    ],
    usage: "Configure the number of concurrent users and select a test query. Run the load test and watch performance metrics in real-time."
  }
];

const categories = ["All", "AI/ML", "API", "Data", "DevOps", "Testing"];

export default function DemoPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedDemo, setExpandedDemo] = useState<string | null>(null);

  const filteredDemos = selectedCategory === "All" 
    ? demos 
    : demos.filter(d => d.category === selectedCategory);

  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Interactive Demos
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-3xl mx-auto">
              Try out key features and capabilities with live, interactive demonstrations.
            </p>
          </div>

          {/* Quick Access Banner */}
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl">
            <h2 className="text-xl font-bold mb-3">🚀 Quick Access</h2>
            <div className="grid md:grid-cols-3 gap-3">
              <a href="/" className="p-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all">
                <div className="text-2xl mb-1">💬</div>
                <div className="font-semibold">Chat Demo</div>
                <div className="text-xs text-[rgb(var(--muted))]">Ask me anything</div>
              </a>
              <a href="/testing" className="p-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all">
                <div className="text-2xl mb-1">🔧</div>
                <div className="font-semibold">MCP Tools</div>
                <div className="text-xs text-[rgb(var(--muted))]">Test API tools</div>
              </a>
              <a href="/monitoring" className="p-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all">
                <div className="text-2xl mb-1">📊</div>
                <div className="font-semibold">Live Metrics</div>
                <div className="text-xs text-[rgb(var(--muted))]">Watch real-time data</div>
              </a>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-[rgb(var(--card))] hover:bg-[rgb(var(--card-hover))]"
                }`}
              >
                {cat} {cat !== "All" && `(${demos.filter(d => d.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* Demo Cards */}
          <div className="grid gap-6">
            {filteredDemos.map(demo => (
              <div
                key={demo.id}
                className="p-6 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{demo.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-2xl font-bold">{demo.title}</h2>
                        <p className="text-[rgb(var(--muted))] mt-1">{demo.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                        {demo.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-2 gap-2 mb-4">
                  {demo.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-[rgb(var(--muted))]">
                      <svg className="w-4 h-4 text-emerald-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Expand Details */}
                <button
                  onClick={() => setExpandedDemo(expandedDemo === demo.id ? null : demo.id)}
                  className="w-full mb-4 py-2 px-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  {expandedDemo === demo.id ? "Hide Usage Guide" : "Show Usage Guide"}
                  <svg className={`w-4 h-4 transition-transform ${expandedDemo === demo.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Usage Guide */}
                {expandedDemo === demo.id && (
                  <div className="mb-4 p-4 bg-[rgb(var(--bg))] border border-blue-500/30 rounded-lg animate-in slide-in-from-top">
                    <h3 className="text-sm font-semibold text-blue-400 mb-2">📖 How to Use</h3>
                    <p className="text-sm text-[rgb(var(--muted))]">{demo.usage}</p>
                  </div>
                )}

                {/* Launch Button */}
                <a
                  href={demo.demoUrl}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition-opacity text-white font-semibold"
                >
                  <span>🚀</span>
                  Launch Demo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredDemos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No demos found</h3>
              <p className="text-[rgb(var(--muted))]">Try a different category filter.</p>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-12 p-6 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl">
            <h2 className="text-2xl font-bold mb-4">💡 Tips for Best Experience</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[rgb(var(--bg))] border border-purple-500/30 rounded-lg">
                <h3 className="font-semibold mb-2">🎯 For RAG Chat</h3>
                <ul className="text-sm text-[rgb(var(--muted))] space-y-1">
                  <li>• Ask specific questions about my experience</li>
                  <li>• Try queries like "What projects have you built?"</li>
                  <li>• Check citations for source verification</li>
                </ul>
              </div>
              <div className="p-4 bg-[rgb(var(--bg))] border border-pink-500/30 rounded-lg">
                <h3 className="font-semibold mb-2">🔧 For MCP Tools</h3>
                <ul className="text-sm text-[rgb(var(--muted))] space-y-1">
                  <li>• Start with sample queries provided</li>
                  <li>• View JSON responses for API structure</li>
                  <li>• Test different tool categories</li>
                </ul>
              </div>
              <div className="p-4 bg-[rgb(var(--bg))] border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold mb-2">📊 For Monitoring</h3>
                <ul className="text-sm text-[rgb(var(--muted))] space-y-1">
                  <li>• Watch metrics update every 5 seconds</li>
                  <li>• Compare before/after optimization data</li>
                  <li>• Check cache hit rates for performance</li>
                </ul>
              </div>
              <div className="p-4 bg-[rgb(var(--bg))] border border-emerald-500/30 rounded-lg">
                <h3 className="font-semibold mb-2">📈 For Load Testing</h3>
                <ul className="text-sm text-[rgb(var(--muted))] space-y-1">
                  <li>• Start with low concurrent users (1-5)</li>
                  <li>• Gradually increase load to test limits</li>
                  <li>• Monitor response times and errors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DocsLayout>
  );
}
