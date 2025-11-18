"use client";
import { useState } from "react";
import DocsLayout from "../components/DocsLayout";

const demos = [
  {
    id: "digital-twin",
    title: "Digital Twin Portfolio Assistant",
    description: "AI-powered assistant that answers questions about my professional background using RAG and MCP protocol",
    category: "AI/ML",
    demoUrl: "/",
    icon: "🤖",
    features: [
      "Real-time semantic search with Upstash Vector (20 chunks)",
      "Context-aware responses from Groq LLaMA 3.3-70b",
      "STAR methodology integration for structured answers",
      "Conversation history with Redis caching"
    ],
    usage: "Ask questions about my background, projects, or technical skills. The digital twin will search my portfolio data and provide accurate answers with citations.",
    metrics: {
      "Response Time": "< 2s",
      "Accuracy": "95%+",
      "Data Sources": "8 projects",
      "Vector Chunks": "20"
    }
  },
  {
    id: "person-app",
    title: "Person Search Application",
    description: "Full-stack search application with advanced filtering, JWT authentication, and real-time updates",
    category: "Full-Stack",
    demoUrl: "https://person-search.vercel.app",
    icon: "👥",
    features: [
      "Fuzzy search with <500ms response time",
      "JWT authentication and role-based authorization", 
      "PostgreSQL database with 1000+ records",
      "Mobile-first responsive design with Tailwind CSS"
    ],
    usage: "Search through a database of people using advanced filters. Test the authentication system and explore the responsive interface designed for optimal user experience.",
    metrics: {
      "Search Speed": "< 500ms",
      "Database Size": "1000+ records",
      "Mobile Score": "98/100",
      "Uptime": "99.9%"
    }
  },
  {
    id: "mcp-server",
    title: "MCP Server Playground",
    description: "Model Context Protocol server with 7 production tools for Claude Desktop integration",
    category: "API",
    demoUrl: "/testing",
    icon: "🔧",
    features: [
      "7 production MCP tools (portfolio, interview, RAG)",
      "Claude Desktop integration via stdio protocol",
      "Live API testing interface with JSON responses",
      "FastAPI backend with comprehensive tool routing"
    ],
    usage: "Test all 7 MCP tools interactively. See how the Model Context Protocol enables Claude Desktop to query portfolio data, conduct interview training, and perform RAG searches.",
    metrics: {
      "Active Tools": "7",
      "Integration": "Claude Desktop",
      "Protocol": "MCP v1.0",
      "Response Time": "< 1s"
    }
  },
  {
    id: "rag-search",
    title: "RAG Search Engine",
    description: "Retrieval-Augmented Generation system with semantic search across professional portfolio content",
    category: "AI/ML", 
    demoUrl: "/rag",
    icon: "🔍",
    features: [
      "Semantic search with sentence-transformers (384-dim)",
      "Upstash Vector database with 20 embedded chunks",
      "STAR-formatted professional data integration",
      "Citation support for all retrieved content"
    ],
    usage: "Experience the core RAG system that powers the digital twin. Search through my professional experiences using natural language queries and see how semantic matching works.",
    metrics: {
      "Vector Dimensions": "384",
      "Embedded Chunks": "20", 
      "Similarity Threshold": ">0.7",
      "Coverage": "8 weeks"
    }
  },
  {
    id: "live-monitoring",
    title: "System Monitoring Dashboard",
    description: "Real-time performance monitoring with metrics, alerts, and system health indicators",
    category: "DevOps",
    demoUrl: "/monitoring",
    icon: "📊",
    features: [
      "Live metrics polling every 5 seconds",
      "Response time and cache hit rate tracking",
      "System health indicators and alerts",
      "Performance trend visualization"
    ],
    usage: "Monitor the portfolio system in real-time. Watch metrics update automatically and see how the infrastructure performs under different loads.",
    metrics: {
      "Update Interval": "5s",
      "Metrics Tracked": "12+",
      "Uptime Monitoring": "24/7",
      "Alert Threshold": "< 3s"
    }
  },
  {
    id: "load-testing",
    title: "Performance Load Testing",
    description: "Configurable load testing to simulate concurrent users and measure system performance under stress",
    category: "Testing",
    demoUrl: "/testing",
    icon: "📈",
    features: [
      "Configurable concurrent users (1-50 simultaneous)",
      "Custom query selection for realistic testing",
      "Real-time progress tracking and metrics",
      "Performance bottleneck identification"
    ],
    usage: "Stress-test the system by simulating multiple concurrent users. Configure the load parameters and watch how the system responds under different stress levels.",
    metrics: {
      "Max Concurrent": "50 users",
      "Test Duration": "Configurable",
      "Success Rate": "99.5%+",
      "Avg Response": "< 2s"
    }
  }
];

const categories = ["All", "AI/ML", "Full-Stack", "API", "DevOps", "Testing"];

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
            <h2 className="text-xl font-bold mb-3">🚀 Featured Demos</h2>
            <p className="text-sm text-[rgb(var(--muted))] mb-4">
              Interactive demonstrations of the Person App, Digital Twin, and MCP servers
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/" className="p-4 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all group">
                <div className="text-3xl mb-2">🤖</div>
                <div className="font-semibold mb-1">Digital Twin Assistant</div>
                <div className="text-xs text-[rgb(var(--muted))] mb-2">AI-powered portfolio queries with RAG</div>
                <div className="text-xs text-purple-400 font-medium">Ask me anything →</div>
              </a>
              <a href="https://person-search.vercel.app" target="_blank" rel="noopener noreferrer" className="p-4 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-lg hover:border-pink-500/50 transition-all group">
                <div className="text-3xl mb-2">👥</div>
                <div className="font-semibold mb-1">Person Search App</div>
                <div className="text-xs text-[rgb(var(--muted))] mb-2">Full-stack search with authentication</div>
                <div className="text-xs text-pink-400 font-medium">Launch demo →</div>
              </a>
              <a href="/testing" className="p-4 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-lg hover:border-blue-500/50 transition-all group">
                <div className="text-3xl mb-2">🔧</div>
                <div className="font-semibold mb-1">MCP Server Tools</div>
                <div className="text-xs text-[rgb(var(--muted))] mb-2">7 tools for Claude Desktop integration</div>
                <div className="text-xs text-blue-400 font-medium">Test tools →</div>
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

                {/* Metrics */}
                {demo.metrics && (
                  <div className="mb-4 p-3 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">📊 Performance Metrics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(demo.metrics).map(([key, value]) => (
                        <div key={key} className="text-center p-2 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded">
                          <div className="text-lg font-bold text-pink-400">{value}</div>
                          <div className="text-xs text-[rgb(var(--muted))]">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
            <h2 className="text-2xl font-bold mb-4">💡 Demo Usage Guidelines</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-[rgb(var(--bg))] border border-purple-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-purple-400">🤖 Digital Twin Assistant</h3>
                <ul className="text-sm text-[rgb(var(--muted))] space-y-1">
                  <li>• Ask specific questions about my experience</li>
                  <li>• Try "What projects have you built with AI?"</li>
                  <li>• Check citations for source verification</li>
                  <li>• Test conversation memory with follow-ups</li>
                </ul>
              </div>
              <div className="p-4 bg-[rgb(var(--bg))] border border-pink-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-pink-400">👥 Person Search App</h3>
                <ul className="text-sm text-[rgb(var(--muted))] space-y-1">
                  <li>• Test search functionality with filters</li>
                  <li>• Try user authentication features</li>
                  <li>• Experience responsive mobile design</li>
                  <li>• Notice sub-500ms response times</li>
                </ul>
              </div>
              <div className="p-4 bg-[rgb(var(--bg))] border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-400">🔧 MCP Server Tools</h3>
                <ul className="text-sm text-[rgb(var(--muted))] space-y-1">
                  <li>• Start with provided sample queries</li>
                  <li>• Test all 7 available MCP tools</li>
                  <li>• View structured JSON responses</li>
                  <li>• Understand Claude Desktop integration</li>
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[rgb(var(--bg))] border border-emerald-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-emerald-400">🔍 RAG Search Engine</h3>
                <ul className="text-sm text-[rgb(var(--muted))] space-y-1">
                  <li>• Test semantic search capabilities</li>
                  <li>• Try natural language queries</li>
                  <li>• See how STAR methodology is integrated</li>
                  <li>• Observe relevance scoring in action</li>
                </ul>
              </div>
              <div className="p-4 bg-[rgb(var(--bg))] border border-amber-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-amber-400">📊 System Monitoring</h3>
                <ul className="text-sm text-[rgb(var(--muted))] space-y-1">
                  <li>• Watch live metrics update every 5 seconds</li>
                  <li>• Monitor system performance in real-time</li>
                  <li>• Check cache hit rates and response times</li>
                  <li>• Understand system health indicators</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DocsLayout>
  );
}
