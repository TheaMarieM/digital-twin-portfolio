"use client";
import { useState } from "react";
import DocsLayout from "../components/DocsLayout";

export default function ProfessionalPage() {
  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Professional Overview
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-3xl mx-auto">
              Comprehensive overview of my professional background, achievements, and career objectives.
            </p>
          </div>

          {/* Professional Summary */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">👨‍💼</span>
              Professional Summary
            </h2>
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-8 hover:border-purple-500/50 transition-all">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-400">Current Status</h3>
                  <ul className="space-y-2 text-[rgb(var(--muted))]">
                    <li>• <strong>IT Student</strong> - Third year at St. Paul University Philippines</li>
                    <li>• <strong>Remote OJT</strong> - Employability Advantage Australia</li>
                    <li>• <strong>Specialization</strong> - Web Development & UI/UX Design</li>
                    <li>• <strong>Side Work</strong> - Freelance design commissions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-400">Key Strengths</h3>
                  <ul className="space-y-2 text-[rgb(var(--muted))]">
                    <li>• Full-stack web development (Next.js, Laravel)</li>
                    <li>• AI/RAG system implementation</li>
                    <li>• UI/UX design and prototyping</li>
                    <li>• Project planning and team collaboration</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Skills Matrix */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">🛠️</span>
              Technical Skills Matrix
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-400">Frontend Development</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Next.js / React</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-500" />)}
                      <div className="w-2 h-2 rounded-full bg-gray-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>TypeScript</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-500" />)}
                      <div className="w-2 h-2 rounded-full bg-gray-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tailwind CSS</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-500" />)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-400">Backend Development</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Python / FastAPI</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-2 h-2 rounded-full bg-green-500" />)}
                      <div className="w-2 h-2 rounded-full bg-gray-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Laravel / PHP</span>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-green-500" />)}
                      {[1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-gray-600" />)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>MySQL</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-2 h-2 rounded-full bg-green-500" />)}
                      <div className="w-2 h-2 rounded-full bg-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-pink-400">Design & AI</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Figma / UI Design</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-2 h-2 rounded-full bg-pink-500" />)}
                      <div className="w-2 h-2 rounded-full bg-gray-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>RAG Systems</span>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-pink-500" />)}
                      {[1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-gray-600" />)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Adobe Suite</span>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-pink-500" />)}
                      {[1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-gray-600" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Project Portfolio Stats */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">📊</span>
              Portfolio Statistics
            </h2>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">6+</div>
                <div className="text-sm text-[rgb(var(--muted))]">Major Projects</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">5+</div>
                <div className="text-sm text-[rgb(var(--muted))]">UI/UX Designs</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-2 border-emerald-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">7</div>
                <div className="text-sm text-[rgb(var(--muted))]">MCP Tools Built</div>
              </div>
              <div className="bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border-2 border-amber-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">3+</div>
                <div className="text-sm text-[rgb(var(--muted))]">Years Learning</div>
              </div>
            </div>
          </section>

          {/* Career Goals */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">🎯</span>
              Career Objectives
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">Short-term Goals (6-12 months)</h3>
                <ul className="space-y-2 text-[rgb(var(--muted))]">
                  <li>• Complete IT degree with strong portfolio</li>
                  <li>• Gain more experience with AI/ML integration</li>
                  <li>• Expand knowledge in cybersecurity fundamentals</li>
                  <li>• Build more complex full-stack applications</li>
                </ul>
              </div>
              <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-emerald-400">Long-term Vision (2-5 years)</h3>
                <ul className="space-y-2 text-[rgb(var(--muted))]">
                  <li>• Secure full-time role as Full-Stack Developer</li>
                  <li>• Specialize in AI-powered web applications</li>
                  <li>• Lead development team on complex projects</li>
                  <li>• Contribute to open-source AI/web projects</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
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
