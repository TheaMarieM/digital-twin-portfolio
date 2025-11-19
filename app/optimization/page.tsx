"use client";
import DocsLayout from "@/app/components/DocsLayout";
import Link from "next/link";

export default function OptimizationPage() {
  const optimizations = [
    {
      title: "Query Processing",
      description: "Optimized database queries with proper indexing and caching strategies",
      improvements: [
        { metric: "Query Time", before: "1200ms", after: "45ms", improvement: "97.5%" },
        { metric: "Memory Usage", before: "512MB", after: "128MB", improvement: "75%" },
        { metric: "Throughput", before: "100 req/s", after: "1000 req/s", improvement: "900%" }
      ]
    },
    {
      title: "API Response Optimization",
      description: "Implemented response compression and payload optimization",
      improvements: [
        { metric: "Payload Size", before: "2.5MB", after: "180KB", improvement: "92.8%" },
        { metric: "Response Time", before: "800ms", after: "120ms", improvement: "85%" },
        { metric: "Bandwidth", before: "500 GB/month", after: "45 GB/month", improvement: "91%" }
      ]
    },
    {
      title: "Vector Search Performance",
      description: "RAG system optimization with semantic search improvements",
      improvements: [
        { metric: "Search Latency", before: "350ms", after: "45ms", improvement: "87%" },
        { metric: "Vector Operations", before: "200ms", after: "22ms", improvement: "89%" },
        { metric: "Relevance Score", before: "0.78", after: "0.94", improvement: "20.5%" }
      ]
    }
  ];

  const techniques = [
    "Database Query Optimization",
    "Connection Pooling",
    "Response Caching",
    "GZIP Compression",
    "Vector Index Optimization",
    "Lazy Loading Strategy",
    "CDN Integration",
    "Code Splitting"
  ];

  return (
    <DocsLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Query Processing Optimization
          </h1>
          <p className="text-lg text-[rgb(var(--muted))] mb-6">
            Performance improvements through strategic optimization and advanced caching techniques
          </p>
          <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
        </div>

        {/* Optimization Results Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-[rgb(var(--text))]">Performance Improvements</h2>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {optimizations.map((opt, idx) => (
              <div key={idx} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6 backdrop-blur-sm hover:shadow-lg hover:border-[rgb(var(--accent))] transition-all duration-300">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">{opt.title}</h3>
                <p className="text-sm text-[rgb(var(--muted))] mb-4">{opt.description}</p>
                
                <div className="space-y-3">
                  {opt.improvements.map((imp, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-[rgb(var(--text))]">{imp.metric}</span>
                        <span className="font-semibold text-green-400">{imp.improvement}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="text-[rgb(var(--muted))]">{imp.before}</span>
                        <span className="text-[rgb(var(--muted))]">→</span>
                        <span className="text-green-400">{imp.after}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[rgb(var(--bg))] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{width: `${Math.min(parseInt(imp.improvement), 100)}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Techniques */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--text))]">Optimization Techniques</h2>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {techniques.map((tech, idx) => (
              <div key={idx} className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-3 text-center hover:bg-purple-500/10 hover:border-purple-500/40 transition-all duration-200">
                <p className="text-sm font-medium text-purple-400">{tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Details */}
        <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/30 p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--text))]">Implementation Strategy</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">1. Database Level</h3>
              <ul className="space-y-2 text-[rgb(var(--muted))]">
                <li>✓ Strategic index creation on frequently queried columns</li>
                <li>✓ Query plan analysis and optimization</li>
                <li>✓ Connection pooling for reduced overhead</li>
                <li>✓ Partition tables for large datasets</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">2. Application Level</h3>
              <ul className="space-y-2 text-[rgb(var(--muted))]">
                <li>✓ Response caching with intelligent invalidation</li>
                <li>✓ Lazy loading and pagination</li>
                <li>✓ Code splitting for faster initial loads</li>
                <li>✓ Debouncing and request throttling</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">3. Network Level</h3>
              <ul className="space-y-2 text-[rgb(var(--muted))]">
                <li>✓ GZIP compression for all responses</li>
                <li>✓ CDN integration for static assets</li>
                <li>✓ HTTP/2 push for critical resources</li>
                <li>✓ Service worker caching strategy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Pages */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/monitoring" className="group rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6 hover:bg-[rgb(var(--card))]/80 hover:border-[rgb(var(--accent))] transition-all duration-300">
            <h3 className="font-semibold text-purple-400 group-hover:text-pink-400 mb-2">Performance Monitoring</h3>
            <p className="text-sm text-[rgb(var(--muted))]">Real-time metrics and dashboards</p>
          </Link>
          <Link href="/scalability" className="group rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6 hover:bg-[rgb(var(--card))]/80 hover:border-[rgb(var(--accent))] transition-all duration-300">
            <h3 className="font-semibold text-purple-400 group-hover:text-pink-400 mb-2">Scalability</h3>
            <p className="text-sm text-[rgb(var(--muted))]">Load testing and scaling strategies</p>
          </Link>
          <Link href="/operations" className="group rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6 hover:bg-[rgb(var(--card))]/80 hover:border-[rgb(var(--accent))] transition-all duration-300">
            <h3 className="font-semibold text-purple-400 group-hover:text-pink-400 mb-2">Operations</h3>
            <p className="text-sm text-[rgb(var(--muted))]">Production maintenance procedures</p>
          </Link>
        </div>
      </div>
    </DocsLayout>
  );
}
