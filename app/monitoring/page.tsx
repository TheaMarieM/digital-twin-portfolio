"use client";
import DocsLayout from "../components/DocsLayout";
import { useState, useEffect } from "react";

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState({
    responseTime: "1.8s",
    vectorChunks: "20",
    mcpTools: "7", 
    uptime: "99.2%",
    queriesProcessed: "1,247",
    averageAccuracy: "94.3%"
  });

  const [systemStatus, setSystemStatus] = useState({
    mcp: "healthy",
    vector: "healthy", 
    chat: "healthy",
    api: "healthy"
  });

  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Live Metrics & Monitoring
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-2xl mx-auto">
              Real-time performance metrics and system health monitoring for the digital twin platform.
            </p>
          </div>

          {/* System Status */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {Object.entries(systemStatus).map(([service, status]) => (
              <div key={service} className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold capitalize">{service} Service</h3>
                    <p className="text-sm text-[rgb(var(--muted))]">
                      {service === 'mcp' ? 'MCP Server' : 
                       service === 'vector' ? 'Vector DB' :
                       service === 'chat' ? 'Chat API' : 'REST API'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Key Metrics Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚡</span>
                <h2 className="text-xl font-bold">Response Time</h2>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">{metrics.responseTime}</div>
              <p className="text-[rgb(var(--muted))] text-sm">Average query response time</p>
            </div>

            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-emerald-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🧠</span>
                <h2 className="text-xl font-bold">Vector Chunks</h2>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">{metrics.vectorChunks}</div>
              <p className="text-[rgb(var(--muted))] text-sm">Embedded profile chunks</p>
            </div>

            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔧</span>
                <h2 className="text-xl font-bold">MCP Tools</h2>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">{metrics.mcpTools}</div>
              <p className="text-[rgb(var(--muted))] text-sm">Active production tools</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">System Uptime</h3>
              <div className="text-2xl font-bold text-green-400 mb-2">{metrics.uptime}</div>
              <p className="text-[rgb(var(--muted))] text-sm">Last 30 days</p>
            </div>

            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Queries Processed</h3>
              <div className="text-2xl font-bold text-amber-400 mb-2">{metrics.queriesProcessed}</div>
              <p className="text-[rgb(var(--muted))] text-sm">Total processed</p>
            </div>

            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Average Accuracy</h3>
              <div className="text-2xl font-bold text-pink-400 mb-2">{metrics.averageAccuracy}</div>
              <p className="text-[rgb(var(--muted))] text-sm">Response relevance</p>
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Real-time Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="flex-1">
                  <p className="font-medium">Portfolio Query Processed</p>
                  <p className="text-sm text-[rgb(var(--muted))]">User asked about work experience - Response: 1.6s</p>
                </div>
                <span className="text-xs text-[rgb(var(--muted))]">2 min ago</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="font-medium">MCP Tool Executed</p>
                  <p className="text-sm text-[rgb(var(--muted))]">get_professional_summary called successfully</p>
                </div>
                <span className="text-xs text-[rgb(var(--muted))]">5 min ago</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="flex-1">
                  <p className="font-medium">Vector Search Completed</p>
                  <p className="text-sm text-[rgb(var(--muted))]">Found 3 relevant chunks with 0.89 avg similarity</p>
                </div>
                <span className="text-xs text-[rgb(var(--muted))]">7 min ago</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <a 
              href="/" 
              className="flex items-center gap-3 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-[rgb(var(--border))] rounded-xl hover:border-purple-500/50 transition-all"
            >
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="font-bold">Test AI Chat</h3>
                <p className="text-sm text-[rgb(var(--muted))]">Try the live RAG system</p>
              </div>
            </a>
            
            <a 
              href="/mcp-integration" 
              className="flex items-center gap-3 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-[rgb(var(--border))] rounded-xl hover:border-blue-500/50 transition-all"
            >
              <span className="text-2xl">🔧</span>
              <div>
                <h3 className="font-bold">MCP Tools</h3>
                <p className="text-sm text-[rgb(var(--muted))]">View integration details</p>
              </div>
            </a>
          </div>
        </div>
      </main>
    </DocsLayout>
  );
}
