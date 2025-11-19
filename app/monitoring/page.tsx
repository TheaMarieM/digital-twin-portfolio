"use client";
import DocsLayout from "@/app/components/DocsLayout";
import Link from "next/link";

export default function MonitoringPage() {
  const metrics = [
    { label: "API Response Time", value: "45ms", status: "excellent", change: "-12%" },
    { label: "Database Query Time", value: "22ms", status: "excellent", change: "-8%" },
    { label: "Vector Search Latency", value: "35ms", status: "excellent", change: "-15%" },
    { label: "Server CPU Usage", value: "32%", status: "good", change: "+2%" },
    { label: "Memory Utilization", value: "48%", status: "good", change: "-5%" },
    { label: "Request Throughput", value: "1,250 req/s", status: "excellent", change: "+450%" }
  ];

  const dashboards = [
    {
      title: "Real-Time Metrics",
      metrics: ["API Latency", "Throughput", "Error Rate", "Cache Hit Ratio"],
      color: "purple"
    },
    {
      title: "Database Health",
      metrics: ["Query Time", "Connection Pool", "Slow Queries", "Index Usage"],
      color: "blue"
    },
    {
      title: "Infrastructure",
      metrics: ["CPU Usage", "Memory", "Network I/O", "Disk Usage"],
      color: "cyan"
    },
    {
      title: "Application",
      metrics: ["Error Tracking", "User Sessions", "Feature Usage", "Deployment Status"],
      color: "emerald"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "excellent": return "text-green-400 bg-green-500/10";
      case "good": return "text-blue-400 bg-blue-500/10";
      case "warning": return "text-yellow-400 bg-yellow-500/10";
      default: return "text-red-400 bg-red-500/10";
    }
  };

  return (
    <DocsLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Performance Monitoring
          </h1>
          <p className="text-lg text-[rgb(var(--muted))] mb-6">
            Real-time dashboards and metrics for monitoring system performance
          </p>
          <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
        </div>

        {/* Key Metrics */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-[rgb(var(--text))]">Current Performance Metrics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric, idx) => (
              <div key={idx} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-[rgb(var(--text))]">{metric.label}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                    {metric.value}
                  </div>
                  <span className="text-sm text-green-400 font-medium">{metric.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monitoring Dashboards */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-[rgb(var(--text))]">Monitoring Dashboards</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {dashboards.map((dashboard, idx) => {
              const colorMap: Record<string, string> = {
                purple: "border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10",
                blue: "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10",
                cyan: "border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10",
                emerald: "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
              };
              
              return (
                <div key={idx} className={`rounded-xl border ${colorMap[dashboard.color]} p-6 hover:border-opacity-100 transition-all duration-300`}>
                  <h3 className="text-lg font-semibold mb-4 text-[rgb(var(--text))]">{dashboard.title}</h3>
                  <div className="space-y-2">
                    {dashboard.metrics.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
                        <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerting System */}
        <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/30 p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--text))]">Alert Management</h2>
          <div className="space-y-4">
            <div className="rounded-lg border-l-4 border-l-green-500 bg-green-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="font-semibold text-green-400">Optimal Performance</p>
                  <p className="text-sm text-[rgb(var(--muted))] mt-1">All systems operating within normal parameters</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-l-yellow-500 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-500"></div>
                <div>
                  <p className="font-semibold text-yellow-400">Custom Thresholds</p>
                  <p className="text-sm text-[rgb(var(--muted))] mt-1">Configurable alerts for specific metrics and conditions</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-l-blue-500 bg-blue-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-semibold text-blue-400">Multi-Channel Notifications</p>
                  <p className="text-sm text-[rgb(var(--muted))] mt-1">Email, Slack, SMS, and webhook integrations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="grid gap-6 md:grid-cols-2 mb-16">
          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Metrics Retention</h3>
            <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
              <li>✓ High-resolution: 1 minute (7 days)</li>
              <li>✓ Standard resolution: 5 minutes (30 days)</li>
              <li>✓ Low resolution: 1 hour (1 year)</li>
              <li>✓ Custom retention policies available</li>
            </ul>
          </div>
          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Data Export</h3>
            <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
              <li>✓ CSV, JSON, and Parquet formats</li>
              <li>✓ Custom time range queries</li>
              <li>✓ Automated report generation</li>
              <li>✓ API access for integrations</li>
            </ul>
          </div>
        </div>

        {/* Related Pages */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/optimization" className="group rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6 hover:bg-[rgb(var(--card))]/80 hover:border-[rgb(var(--accent))] transition-all duration-300">
            <h3 className="font-semibold text-purple-400 group-hover:text-pink-400 mb-2">Optimization</h3>
            <p className="text-sm text-[rgb(var(--muted))]">Query processing improvements</p>
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
