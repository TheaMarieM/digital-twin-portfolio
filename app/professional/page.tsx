"use client";
import { useState } from "react";
import DocsLayout from "../components/DocsLayout";

const brandColors = [
  { name: "Primary Purple", value: "#8B5CF6", usage: "Headers, CTAs, gradients" },
  { name: "Accent Pink", value: "#EC4899", usage: "Highlights, hover states" },
  { name: "Success Green", value: "#10B981", usage: "Completed states, metrics" },
  { name: "Warning Amber", value: "#F59E0B", usage: "In-progress items" },
  { name: "Info Blue", value: "#3B82F6", usage: "Links, secondary actions" },
  { name: "Muted Gray", value: "#6B7280", usage: "Secondary text, borders" }
];

const designPrinciples = [
  {
    title: "Consistent Visual Identity",
    icon: "🎨",
    description: "Purple-pink gradient theme across all components with consistent typography and spacing"
  },
  {
    title: "Professional Typography", 
    icon: "🔤",
    description: "Clear hierarchy using font weights and sizes with optimal readability"
  },
  {
    title: "Accessible Design",
    icon: "♿",
    description: "WCAG AA compliance with proper contrast ratios and keyboard navigation"
  },
  {
    title: "Responsive Layout",
    icon: "📱", 
    description: "Mobile-first approach with graceful degradation across all screen sizes"
  }
];

export default function ProfessionalPage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Professional Branding
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-3xl mx-auto">
              Comprehensive design system and brand guidelines ensuring consistent professional presentation across all portfolio components.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[
              { id: "overview", label: "Professional Overview" },
              { id: "branding", label: "Brand Guidelines" },
              { id: "colors", label: "Color System" },
              { id: "components", label: "Design System" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTab === tab.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-[rgb(var(--card))] hover:bg-[rgb(var(--card-hover))]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Professional Overview Tab */}
          {selectedTab === "overview" && (
            <div className="space-y-8">
              {/* Professional Summary */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-3xl">👨‍💼</span>
                  Professional Summary
                </h2>
                <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-8 hover:border-purple-500/50 transition-all">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-purple-400">Current Status</h3>
                      <ul className="space-y-2 text-[rgb(var(--muted))]">
                        <li>• <strong>Full-Stack Developer & AI Engineer</strong></li>
                        <li>• <strong>IT Student</strong> - Third year at St. Paul University Philippines</li>
                        <li>• <strong>Remote OJT</strong> - Employability Advantage Australia</li>
                        <li>• <strong>Specialization</strong> - AI Integration & MCP Protocol</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-emerald-400">Key Strengths</h3>
                      <ul className="space-y-2 text-[rgb(var(--muted))]">
                        <li>• Digital Twin Portfolio with RAG integration</li>
                        <li>• Model Context Protocol (MCP) implementation</li>
                        <li>• Full-stack development with Next.js & Python</li>
                        <li>• AI-powered search and recommendation systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* 8-Week Portfolio Evolution */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-3xl">🚀</span>
                  Portfolio Evolution Journey
                </h2>
                <div className="space-y-4">
                  {[
                    { week: "1-2", title: "Foundation", icon: "📚", description: "Interactive Todo App → Personal Portfolio v1" },
                    { week: "3-4", title: "CMS & Analytics", icon: "📊", description: "Headless Blog CMS → Weather Analytics Dashboard" },
                    { week: "5-6", title: "Advanced Apps", icon: "⚡", description: "Task Management System → E-Commerce Platform" },
                    { week: "7-8", title: "AI Integration", icon: "🤖", description: "Person Search App → Digital Twin MCP Server" }
                  ].map((phase, i) => (
                    <div key={i} className="p-4 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{phase.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                              Week {phase.week}
                            </span>
                            <span className="font-semibold">{phase.title}</span>
                          </div>
                          <div className="text-sm text-[rgb(var(--muted))]">{phase.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Portfolio Statistics */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-3xl">📊</span>
                  Portfolio Statistics
                </h2>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">8</div>
                    <div className="text-sm text-[rgb(var(--muted))]">Major Projects</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">7</div>
                    <div className="text-sm text-[rgb(var(--muted))]">MCP Tools Built</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-2 border-emerald-500/30 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">20</div>
                    <div className="text-sm text-[rgb(var(--muted))]">Vector Chunks</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border-2 border-amber-500/30 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2">95%+</div>
                    <div className="text-sm text-[rgb(var(--muted))]">AI Accuracy</div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Brand Guidelines Tab */}
          {selectedTab === "branding" && (
            <div className="space-y-8">
              <div className="p-6 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl">
                <h2 className="text-2xl font-bold mb-4">🎯 Brand Mission</h2>
                <p className="text-lg text-[rgb(var(--muted))] mb-6">
                  To present a cohesive, professional digital presence that showcases technical expertise, 
                  AI integration capabilities, and full-stack development skills through consistent design language.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-[rgb(var(--bg))] border border-purple-500/30 rounded-lg">
                    <div className="text-3xl mb-3">🤖</div>
                    <h3 className="font-semibold mb-2">AI-First Identity</h3>
                    <p className="text-sm text-[rgb(var(--muted))]">
                      Emphasis on artificial intelligence, machine learning, and modern development practices
                    </p>
                  </div>
                  <div className="p-4 bg-[rgb(var(--bg))] border border-pink-500/30 rounded-lg">
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="font-semibold mb-2">Performance Focus</h3>
                    <p className="text-sm text-[rgb(var(--muted))]">
                      Fast, responsive interfaces with real-time capabilities and optimized user experience
                    </p>
                  </div>
                  <div className="p-4 bg-[rgb(var(--bg))] border border-blue-500/30 rounded-lg">
                    <div className="text-3xl mb-3">🔧</div>
                    <h3 className="font-semibold mb-2">Technical Excellence</h3>
                    <p className="text-sm text-[rgb(var(--muted))]">
                      Production-ready code, comprehensive testing, and enterprise-grade architecture
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                {designPrinciples.map((principle, index) => (
                  <div key={index} className="p-6 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl hover:border-purple-500/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{principle.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{principle.title}</h3>
                        <p className="text-[rgb(var(--muted))]">{principle.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color System Tab */}
          {selectedTab === "colors" && (
            <div className="space-y-6">
              <div className="p-6 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl">
                <h2 className="text-2xl font-bold mb-4">🎨 Color Palette</h2>
                <p className="text-[rgb(var(--muted))] mb-6">
                  Consistent color system used throughout the portfolio for brand recognition and visual hierarchy.
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brandColors.map(color => (
                    <div
                      key={color.name}
                      className="p-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg cursor-pointer hover:border-purple-500/50 transition-all"
                      onClick={() => copyToClipboard(color.value)}
                    >
                      <div 
                        className="w-full h-16 rounded-lg mb-3 border-2 border-white/20"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <div className="font-semibold">{color.name}</div>
                      <div className="text-sm font-mono text-[rgb(var(--muted))] mb-1">
                        {color.value} {copiedColor === color.value && "✓ Copied!"}
                      </div>
                      <div className="text-xs text-[rgb(var(--muted))]">{color.usage}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">🌈 Gradient System</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg">
                    <div className="h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-3"></div>
                    <div className="font-semibold">Primary Gradient</div>
                    <div className="text-sm font-mono text-[rgb(var(--muted))]">from-purple-500 to-pink-500</div>
                    <div className="text-xs text-[rgb(var(--muted))]">Headers, CTAs, primary branding elements</div>
                  </div>
                  <div className="p-4 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg">
                    <div className="h-16 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-lg mb-3"></div>
                    <div className="font-semibold">Text Gradient</div>
                    <div className="text-sm font-mono text-[rgb(var(--muted))]">from-purple-400 via-pink-400 to-purple-400</div>
                    <div className="text-xs text-[rgb(var(--muted))]">Large text headers, brand text effects</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Design System Tab */}
          {selectedTab === "components" && (
            <div className="space-y-6">
              <div className="p-6 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl">
                <h2 className="text-2xl font-bold mb-4">📚 Component Library</h2>
                <div className="grid gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-purple-400">Navigation Components</h3>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                        <strong>DocsLayout:</strong> Main layout with sidebar navigation and consistent structure across all pages
                      </div>
                      <div className="p-3 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                        <strong>DocsNav:</strong> Responsive navigation with active states and smooth transitions
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 text-pink-400">Interactive Elements</h3>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                        <strong>Gradient Buttons:</strong> Primary CTAs with purple-pink gradients and hover effects
                      </div>
                      <div className="p-3 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                        <strong>Filter Pills:</strong> Category filtering with active states and smooth animations
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 text-blue-400">Content Cards</h3>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                        <strong>Project Cards:</strong> STAR methodology display with expandable sections and metrics
                      </div>
                      <div className="p-3 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                        <strong>Repository Cards:</strong> GitHub project showcases with live links and technology tags
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">📏 Design Specifications</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-purple-400">Typography Scale</h3>
                    <div className="space-y-2 text-sm">
                      <div>text-4xl sm:text-5xl - Main page headers</div>
                      <div>text-2xl - Section headers</div>
                      <div>text-lg - Large body text</div>
                      <div>text-sm - Secondary text, labels</div>
                      <div>text-xs - Metadata, tags</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-pink-400">Spacing System</h3>
                    <div className="space-y-2 text-sm">
                      <div>p-6 - Card padding</div>
                      <div>gap-6 - Grid spacing</div>
                      <div>mb-4, mb-8 - Vertical spacing</div>
                      <div>px-4 py-2 - Button padding</div>
                      <div>rounded-xl - Card border radius</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Section - Always visible */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">📧</span>
              Professional Contact
            </h2>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl mb-2">📧</div>
                  <div className="font-medium mb-1">Email</div>
                  <a href="mailto:magnomarithea157@gmail.com" className="text-purple-400 hover:underline">
                    magnomarithea157@gmail.com
                  </a>
                </div>
                <div>
                  <div className="text-2xl mb-2">💼</div>
                  <div className="font-medium mb-1">LinkedIn</div>
                  <a href="https://www.linkedin.com/in/marithea-magno-33038728a/" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">
                    Marithea Magno
                  </a>
                </div>
                <div>
                  <div className="text-2xl mb-2">🐱</div>
                  <div className="font-medium mb-1">GitHub</div>
                  <a href="https://github.com/TheaMarieM" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">
                    @TheaMarieM
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </DocsLayout>
  );
}
