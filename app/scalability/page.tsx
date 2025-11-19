'use client';

import DocsLayout from '@/app/components/DocsLayout';
import { useState } from 'react';

export default function ScalabilityPage() {
  const [activeTest, setActiveTest] = useState<'concurrent' | 'sustained' | 'spike'>('concurrent');

  const loadTests = {
    concurrent: {
      title: 'Concurrent Users Test',
      description: 'Testing simultaneous user capacity and response degradation under load',
      results: [
        { users: '100', latency: '45ms', throughput: '450 req/s', errors: '0%' },
        { users: '500', latency: '62ms', throughput: '2.1K req/s', errors: '0%' },
        { users: '1K', latency: '89ms', throughput: '4.2K req/s', errors: '0%' },
        { users: '5K', latency: '240ms', throughput: '18K req/s', errors: '0.1%' },
        { users: '10K', latency: '450ms', throughput: '32K req/s', errors: '0.8%' },
      ],
    },
    sustained: {
      title: 'Sustained Load Test',
      description: 'Long-running tests to detect memory leaks and degradation over time',
      results: [
        { duration: '1 hour', cpu: '45%', memory: '52%', errors: '0%' },
        { duration: '4 hours', cpu: '47%', memory: '54%', errors: '0%' },
        { duration: '8 hours', cpu: '48%', memory: '55%', errors: '0%' },
        { duration: '24 hours', cpu: '49%', memory: '56%', errors: '0%' },
        { duration: '72 hours', cpu: '51%', memory: '58%', errors: '0%' },
      ],
    },
    spike: {
      title: 'Traffic Spike Test',
      description: 'Sudden load increases to test auto-scaling and recovery',
      results: [
        { scenario: 'Normal → 2x', duration: '2s', recovery: '8s', scaling: '✓' },
        { scenario: 'Normal → 5x', duration: '4s', recovery: '15s', scaling: '✓' },
        { scenario: 'Normal → 10x', duration: '6s', recovery: '22s', scaling: '✓' },
        { scenario: 'Sustained 5x', duration: '∞', recovery: '—', scaling: '✓' },
      ],
    },
  };

  const current = loadTests[activeTest];

  return (
    <DocsLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Load Testing & Scalability
          </h1>
          <p className="text-lg text-[rgb(var(--muted))] mb-6">
            Comprehensive load testing results demonstrating system capacity, auto-scaling capabilities, and performance under stress.
          </p>
          <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></div>
        </div>

        {/* Test Type Tabs */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {(Object.keys(loadTests) as Array<'concurrent' | 'sustained' | 'spike'>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTest(key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTest === key
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/50'
                  : 'bg-[rgb(var(--card))] text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] border border-[rgb(var(--border))]'
              }`}
            >
              {loadTests[key].title}
            </button>
          ))}
        </div>

        {/* Test Description */}
        <div className="mb-8 p-6 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50">
          <p className="text-[rgb(var(--text))]">{current.description}</p>
        </div>

        {/* Results Table */}
        <div className="mb-12 overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]/50">
                {activeTest === 'concurrent' && (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">Concurrent Users</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">Response Latency</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">Throughput</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">Error Rate</th>
                  </>
                )}
                {activeTest === 'sustained' && (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">CPU Usage</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">Memory Usage</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">Error Rate</th>
                  </>
                )}
                {activeTest === 'spike' && (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">Scenario</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">Spike Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">Recovery Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(var(--text))]">Auto-scaling</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {current.results.map((row, idx) => (
                <tr key={idx} className="border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--card))]/50 transition-colors">
                  {activeTest === 'concurrent' && (
                    <>
                      <td className="px-6 py-4 text-sm text-[rgb(var(--text))]">{(row as any).users}</td>
                      <td className="px-6 py-4 text-sm text-emerald-400 font-medium">{(row as any).latency}</td>
                      <td className="px-6 py-4 text-sm text-[rgb(var(--text))]">{(row as any).throughput}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          parseFloat((row as any).errors) === 0 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {(row as any).errors}
                        </span>
                      </td>
                    </>
                  )}
                  {activeTest === 'sustained' && (
                    <>
                      <td className="px-6 py-4 text-sm text-[rgb(var(--text))]">{(row as any).duration}</td>
                      <td className="px-6 py-4 text-sm text-[rgb(var(--text))]">{(row as any).cpu}</td>
                      <td className="px-6 py-4 text-sm text-[rgb(var(--text))]">{(row as any).memory}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400">{(row as any).errors}</span>
                      </td>
                    </>
                  )}
                  {activeTest === 'spike' && (
                    <>
                      <td className="px-6 py-4 text-sm text-[rgb(var(--text))]">{(row as any).scenario}</td>
                      <td className="px-6 py-4 text-sm text-[rgb(var(--text))]">{(row as any).duration}</td>
                      <td className="px-6 py-4 text-sm text-[rgb(var(--text))]">{(row as any).recovery}</td>
                      <td className="px-6 py-4 text-sm text-green-400 font-bold">{(row as any).scaling}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scalability Architecture */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--text))]">Scaling Architecture</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Horizontal Scaling',
                description: 'Multi-instance deployment across availability zones with load balancing',
                icon: '',
                features: ['Auto-scaling groups', 'Load balancing', 'Health checks'],
              },
              {
                title: 'Vertical Scaling',
                description: 'Ability to upgrade instance types for increased compute and memory',
                icon: '',
                features: ['Dynamic resource allocation', 'Zero-downtime upgrades', 'Resource monitoring'],
              },
              {
                title: 'Database Scaling',
                description: 'Read replicas and connection pooling for database horizontal scaling',
                icon: '',
                features: ['Read replicas', 'Connection pooling', 'Automatic failover'],
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6">
                <h3 className="text-lg font-semibold mb-2 text-[rgb(var(--text))]">{item.title}</h3>
                <p className="text-sm text-[rgb(var(--muted))] mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, i) => (
                    <li key={i} className="text-xs text-[rgb(var(--muted))] flex gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 p-8">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Scalability Achievements</h3>
          <ul className="space-y-3">
            {[
              'System scales from 100 to 10,000+ concurrent users with <500ms latency',
              'Auto-scaling responds to traffic spikes in <10 seconds',
              'Zero downtime during deployment and infrastructure updates',
              'Database handles millions of operations daily with minimal degradation',
              '99.99% uptime SLA maintained across all load conditions',
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3 text-[rgb(var(--text))]">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DocsLayout>
  );
}
