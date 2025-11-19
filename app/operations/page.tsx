"use client";
import DocsLayout from "@/app/components/DocsLayout";
import Link from "next/link";
import { useState } from "react";

export default function OperationsPage() {
  const [activeSection, setActiveSection] = useState<'deployment' | 'monitoring' | 'backup' | 'security'>('deployment');

  const procedures = {
    deployment: {
      title: 'Deployment Procedures',
      icon: '',
      color: 'blue',
      items: [
        {
          name: 'Production Deployment',
          steps: [
            'Run full test suite and ensure 100% pass rate',
            'Review and approve all code changes via pull request',
            'Create deployment branch from main with version tag',
            'Deploy to staging environment for final validation',
            'Run smoke tests on staging environment',
            'Deploy to production using blue-green deployment strategy',
            'Monitor error rates and performance metrics for 1 hour',
            'Tag release in version control with deployment notes'
          ],
          frequency: 'Weekly or on-demand',
        },
        {
          name: 'Rollback Procedure',
          steps: [
            'Identify critical issue requiring rollback',
            'Notify team and stakeholders of rollback decision',
            'Switch traffic to previous stable version',
            'Verify system stability and error rates',
            'Document root cause and prevention measures',
            'Schedule hotfix deployment if needed'
          ],
          frequency: 'Emergency only',
        },
        {
          name: 'Database Migration',
          steps: [
            'Create migration scripts with rollback capability',
            'Test migrations on staging database copy',
            'Schedule maintenance window and notify users',
            'Backup production database before migration',
            'Run migration with transaction support',
            'Verify data integrity and application functionality',
            'Update documentation with schema changes'
          ],
          frequency: 'As needed',
        }
      ]
    },
    monitoring: {
      title: 'System Monitoring',
      icon: '',
      color: 'purple',
      items: [
        {
          name: 'Daily Health Checks',
          steps: [
            'Review overnight error logs and alerts',
            'Check system resource utilization (CPU, memory, disk)',
            'Verify backup completion and integrity',
            'Review API response times and throughput',
            'Check third-party service status and connectivity',
            'Validate SSL certificate expiration dates'
          ],
          frequency: 'Daily at 9 AM',
        },
        {
          name: 'Performance Monitoring',
          steps: [
            'Analyze database query performance and slow queries',
            'Review API endpoint latencies and bottlenecks',
            'Monitor vector search performance metrics',
            'Check cache hit rates and effectiveness',
            'Analyze user traffic patterns and peak loads',
            'Review CDN performance and cache distribution'
          ],
          frequency: 'Weekly',
        },
        {
          name: 'Security Monitoring',
          steps: [
            'Review access logs for suspicious activity',
            'Check failed authentication attempts',
            'Verify rate limiting effectiveness',
            'Scan for vulnerable dependencies',
            'Review firewall rules and access controls',
            'Audit user permissions and access levels'
          ],
          frequency: 'Daily',
        }
      ]
    },
    backup: {
      title: 'Backup & Recovery',
      icon: '',
      color: 'emerald',
      items: [
        {
          name: 'Automated Backups',
          steps: [
            'Full database backup at 2 AM daily',
            'Incremental backups every 6 hours',
            'Code repository snapshots weekly',
            'Configuration backup with each deployment',
            'Verify backup completion via monitoring',
            'Test restore procedure monthly'
          ],
          frequency: 'Automated schedule',
        },
        {
          name: 'Disaster Recovery',
          steps: [
            'Identify disaster scenario and impact assessment',
            'Activate incident response team',
            'Restore from most recent backup',
            'Validate data integrity and completeness',
            'Restore application services and configurations',
            'Verify system functionality end-to-end',
            'Document incident and update recovery procedures'
          ],
          frequency: 'Emergency only',
        },
        {
          name: 'Backup Verification',
          steps: [
            'Select random backup from the past week',
            'Restore to isolated test environment',
            'Run data integrity checks',
            'Verify application functionality',
            'Document test results and any issues',
            'Update backup procedures if needed'
          ],
          frequency: 'Monthly',
        }
      ]
    },
    security: {
      title: 'Security Maintenance',
      icon: '',
      color: 'orange',
      items: [
        {
          name: 'Dependency Updates',
          steps: [
            'Review security advisories and CVE reports',
            'Identify outdated or vulnerable packages',
            'Test updates in development environment',
            'Review breaking changes and migration guides',
            'Deploy updates to staging for validation',
            'Schedule production deployment during maintenance window'
          ],
          frequency: 'Weekly',
        },
        {
          name: 'Access Control Audit',
          steps: [
            'Review all user accounts and active sessions',
            'Verify principle of least privilege',
            'Remove inactive or unnecessary accounts',
            'Audit API key usage and rotation',
            'Review service account permissions',
            'Update access control documentation'
          ],
          frequency: 'Quarterly',
        },
        {
          name: 'SSL Certificate Management',
          steps: [
            'Monitor certificate expiration dates (90+ days)',
            'Generate new certificate signing request',
            'Obtain renewed certificate from CA',
            'Test certificate in staging environment',
            'Deploy certificate to production',
            'Verify HTTPS functionality across all endpoints'
          ],
          frequency: 'Annually (auto-renew)',
        }
      ]
    }
  };

  const current = procedures[activeSection];
  const colorMap = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' }
  };

  return (
    <DocsLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Production Operations
          </h1>
          <p className="text-lg text-[rgb(var(--muted))] mb-6">
            Standard operating procedures for maintaining system reliability and security in production
          </p>
          <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(procedures) as Array<keyof typeof procedures>).map((key) => {
            const proc = procedures[key];
            const colors = colorMap[proc.color as keyof typeof colorMap];
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`p-4 rounded-xl font-medium transition-all duration-200 border-2 ${
                  activeSection === key
                    ? `${colors.bg} ${colors.border} ${colors.text}`
                    : 'bg-[rgb(var(--card))]/50 text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] border-[rgb(var(--border))]'
                }`}
              >
                <div className="text-sm font-semibold">{proc.title}</div>
              </button>
            );
          })}
        </div>

        {/* Procedures List */}
        <div className="space-y-6 mb-12">
          {current.items.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6 hover:shadow-lg hover:border-[rgb(var(--accent))] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-[rgb(var(--text))]">{item.name}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {item.frequency}
                </span>
              </div>
              
              <div className="space-y-2">
                {item.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="flex gap-3 items-start group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold border border-cyan-500/30">
                      {stepIdx + 1}
                    </div>
                    <p className="text-sm text-[rgb(var(--muted))] group-hover:text-[rgb(var(--text))] transition-colors pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Incident Response */}
        <div className="rounded-xl border-2 border-red-500/30 bg-red-500/5 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-red-400">Incident Response Protocol</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-[rgb(var(--text))] mb-3">Severity Levels</h3>
              <div className="space-y-2">
                <div className="flex gap-3 items-center">
                  <span className="px-2 py-1 rounded bg-red-600/20 text-red-400 text-xs font-bold border border-red-500/30">P0</span>
                  <span className="text-sm text-[rgb(var(--muted))]">Critical - Complete service outage</span>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="px-2 py-1 rounded bg-orange-600/20 text-orange-400 text-xs font-bold border border-orange-500/30">P1</span>
                  <span className="text-sm text-[rgb(var(--muted))]">High - Major feature unavailable</span>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="px-2 py-1 rounded bg-yellow-600/20 text-yellow-400 text-xs font-bold border border-yellow-500/30">P2</span>
                  <span className="text-sm text-[rgb(var(--muted))]">Medium - Degraded performance</span>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="px-2 py-1 rounded bg-blue-600/20 text-blue-400 text-xs font-bold border border-blue-500/30">P3</span>
                  <span className="text-sm text-[rgb(var(--muted))]">Low - Minor issues or bugs</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[rgb(var(--text))] mb-3">Response Times</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(var(--muted))]">P0 - Acknowledge:</span>
                  <span className="text-red-400 font-semibold">5 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(var(--muted))]">P1 - Acknowledge:</span>
                  <span className="text-orange-400 font-semibold">15 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(var(--muted))]">P2 - Acknowledge:</span>
                  <span className="text-yellow-400 font-semibold">1 hour</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(var(--muted))]">P3 - Acknowledge:</span>
                  <span className="text-blue-400 font-semibold">1 business day</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Windows */}
        <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/30 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--text))]">Maintenance Windows</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Scheduled Maintenance</h3>
              <ul className="space-y-2 text-[rgb(var(--muted))]">
                <li>✓ <strong>Weekly:</strong> Tuesday 2:00-3:00 AM UTC</li>
                <li>✓ <strong>Monthly:</strong> First Sunday 1:00-4:00 AM UTC</li>
                <li>✓ Advance notice: 7 days minimum</li>
                <li>✓ Status page updates during maintenance</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Emergency Maintenance</h3>
              <ul className="space-y-2 text-[rgb(var(--muted))]">
                <li>✓ Immediate notification to all users</li>
                <li>✓ Status page with real-time updates</li>
                <li>✓ Post-mortem report within 24 hours</li>
                <li>✓ Preventive measures documented</li>
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
          <Link href="/optimization" className="group rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6 hover:bg-[rgb(var(--card))]/80 hover:border-[rgb(var(--accent))] transition-all duration-300">
            <h3 className="font-semibold text-purple-400 group-hover:text-pink-400 mb-2">Query Optimization</h3>
            <p className="text-sm text-[rgb(var(--muted))]">Performance improvements</p>
          </Link>
          <Link href="/scalability" className="group rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6 hover:bg-[rgb(var(--card))]/80 hover:border-[rgb(var(--accent))] transition-all duration-300">
            <h3 className="font-semibold text-purple-400 group-hover:text-pink-400 mb-2">Scalability</h3>
            <p className="text-sm text-[rgb(var(--muted))]">Load testing results</p>
          </Link>
        </div>
      </div>
    </DocsLayout>
  );
}
