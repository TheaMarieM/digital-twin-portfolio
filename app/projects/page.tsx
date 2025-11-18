"use client";
import { useState, useEffect } from "react";
import DocsLayout from "../components/DocsLayout";

interface Project {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  skills: string[];
  week: number;
  category: string;
  metrics: Record<string, string>;
  links: {
    github?: string;
    demo?: string;
    docs?: string;
  };
}

const categoryColors: Record<string, string> = {
  "AI Systems": "bg-purple-600",
  "AI/ML": "bg-purple-600",
  "Full-Stack": "bg-blue-600",
  "E-Commerce": "bg-emerald-600",
  "Productivity": "bg-amber-600",
  "Data Analytics": "bg-indigo-600",
  "CMS": "bg-rose-600",
  "Portfolio": "bg-violet-600",
  "Foundation": "bg-slate-600"
};

const categories = ["All", "AI Systems", "AI/ML", "Full-Stack", "Portfolio", "Foundation", "E-Commerce", "Data Analytics"];
const weeks = ["All", "Week 1", "Week 2", "Week 3-4", "Week 5", "Week 6-9", "School Projects"];

const weekRanges: Record<string, number[]> = {
  "Week 1": [1],
  "Week 2": [2],
  "Week 3-4": [3, 4],
  "Week 5": [5],
  "Week 6-9": [6, 7, 8, 9],
  "School Projects": [0]
};

// Project screenshot mapping
const projectScreenshots: Record<string, string> = {
  "proj-digital-twin-portfolio": "/screenshots/Screenshot 2025-11-01 135052.png",
  "proj-person-app-enhanced": "/screenshots/person-search.svg",
  "proj-person-crud-app": "/screenshots/person-search.svg",
  "proj-professional-cv-website": "/screenshots/Screenshot 2025-11-01 133305.png",
  "proj-dev-environment-setup": "/screenshots/Screenshot 2025-11-01 133305.png",
  "proj-community-health-monitoring": "/screenshots/Screenshot 2025-11-01 133942.png",
  "proj-movie-reviews-laravel": "/screenshots/movie-reviews.svg",
  "proj-api-ecommerce-laravel": "/screenshots/Screenshot 2025-11-01 134246.png",
  "proj-student-management-system": "/screenshots/student-portal.svg"
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWeek, setSelectedWeek] = useState("All");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [selectedTimelineWeek, setSelectedTimelineWeek] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects')
    .then(res => res.json())
    .then(data => {
      if (data.projects) {
        setProjects(data.projects);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to load projects:', err);
      setLoading(false);
    });
  }, []);

  const filteredProjects = projects.filter(p => {
    const categoryMatch = selectedCategory === "All" || p.category === selectedCategory;
    
    let weekMatch = true;
    if (selectedWeek !== "All") {
      const weeksInRange = weekRanges[selectedWeek];
      if (weeksInRange) {
        weekMatch = weeksInRange.includes(p.week);
      }
    }
    
    return categoryMatch && weekMatch;
  });

  // Sort by week descending (most recent first)
  const sortedProjects = [...filteredProjects].sort((a, b) => b.week - a.week);

  if (loading) {
    return (
      <DocsLayout>
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="inline-block w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
              <h2 className="text-2xl font-semibold">Loading Projects...</h2>
            </div>
          </div>
        </main>
      </DocsLayout>
    );
  }

  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-purple-400">
              Project Portfolio Journey
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-3xl mx-auto mb-3">
              Comprehensive showcase of all projects from foundation web development to advanced AI integration, 
              demonstrating progressive skill development and technical mastery.
            </p>
            <p className="text-sm text-[rgb(var(--muted))] max-w-2xl mx-auto">
              This section provides detailed case studies with STAR methodology, GitHub repositories for source code exploration, 
              and live demonstrations of deployed applications.
            </p>
          </div>

          {/* Weekly Progress Timeline */}
          <div className="mb-8 p-6 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-purple-400">Development Journey Timeline</span>
            </h2>
            <div className="space-y-2">
              {[
                { key: "week-1", label: "Week 1", weeks: [1] },
                { key: "week-2", label: "Week 2", weeks: [2] },
                { key: "week-3-4", label: "Week 3-4", weeks: [3, 4] },
                { key: "week-5", label: "Week 5", weeks: [5] },
                { key: "week-6-9", label: "Week 6-9", weeks: [6, 7, 8, 9] },
                { key: "school-projects", label: "School Projects", weeks: [0] }
              ].map(period => {
                const periodProjects = projects.filter(p => period.weeks.includes(p.week));
                const isSelected = selectedTimelineWeek === period.key;
                
                return (
                  <button
                    key={period.key}
                    onClick={() => {
                      setSelectedTimelineWeek(isSelected ? null : period.key);
                      if (!isSelected) {
                        setSelectedWeek(period.label);
                      } else {
                        setSelectedWeek("All");
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 bg-[rgb(var(--bg))] border rounded-lg transition-all text-left ${
                      isSelected 
                        ? "border-purple-500 bg-purple-500/10" 
                        : "border-[rgb(var(--border))] hover:border-purple-500/50"
                    }`}
                  >
                    <div className="w-24 flex-shrink-0 text-sm font-semibold text-purple-400">
                      {period.label}
                    </div>
                    <div className="flex-1">
                      {periodProjects.length > 0 ? (
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {periodProjects.slice(0, 3).map((proj, idx) => (
                              <div key={idx} className={`w-3 h-3 rounded-full ${categoryColors[proj.category] || "bg-gray-600"} flex-shrink-0`}></div>
                            ))}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {periodProjects.length === 1 
                                ? periodProjects[0].title 
                                : `${periodProjects.length} Projects`}
                            </div>
                            <div className="text-xs text-[rgb(var(--muted))]">
                              {periodProjects.map(p => p.category).filter((v, i, a) => a.indexOf(v) === i).join(", ")}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform ${isSelected ? "rotate-90" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-[rgb(var(--muted))] self-center">Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] border-[rgb(var(--border))] hover:border-purple-500/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-[rgb(var(--muted))] self-center">Week:</span>
              {weeks.map(week => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                    selectedWeek === week
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] border-[rgb(var(--border))] hover:border-purple-500/50"
                  }`}
                >
                  {week}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-center text-sm text-[rgb(var(--muted))] mb-8">
            Showing {sortedProjects.length} of {projects.length} projects
          </p>

          {/* Project Cards */}
          <div className="space-y-6">
            {sortedProjects.map(project => (
              <div
                key={project.id}
                className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-purple-500/50 transition-all"
              >
                {/* Project Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold">{project.title}</h2>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                          {project.week === 0 ? "School Project" : 
                           project.week >= 3 && project.week <= 4 ? "Weeks 3-4" :
                           project.week >= 6 && project.week <= 9 ? "Weeks 6-9" :
                           `Week ${project.week}`}
                        </span>
                        <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs font-medium">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STAR Case Study Preview */}
                <div className="mb-6 p-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    Case Study Overview
                  </h3>
                  <div className="space-y-3">
                    <p className="text-[rgb(var(--muted))] text-sm">
                      <span className="text-blue-400 font-semibold">Situation:</span> {project.situation}
                    </p>
                    <p className="text-[rgb(var(--muted))] text-sm">
                      <span className="text-emerald-400 font-semibold">Result:</span> {project.result}
                    </p>
                  </div>
                </div>

                {/* Metrics Grid */}
                {project.metrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-purple-400">
                          {value}
                        </div>
                        <div className="text-xs text-[rgb(var(--muted))] mt-1">{key}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.slice(0, 6).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {project.skills.length > 6 && (
                    <span className="px-2 py-1 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded text-xs text-[rgb(var(--muted))]">
                      +{project.skills.length - 6} more
                    </span>
                  )}
                </div>

                {/* Expand/Collapse for Full STAR */}
                <button
                  onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                  className="w-full py-3 px-4 bg-purple-500/5 border border-purple-500/30 rounded-lg hover:border-purple-500 hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2 text-sm font-medium mb-6"
                >
                  {expandedProject === project.id ? "Hide Full Case Study" : "View Complete STAR Analysis"}
                  <svg className={`w-4 h-4 transition-transform ${expandedProject === project.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded STAR Case Study */}
                {expandedProject === project.id && (
                  <div className="space-y-6 animate-in slide-in-from-top mb-6">
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-center">Complete STAR Case Study</h3>
                      
                      {/* Situation */}
                      <div className="p-4 bg-[rgb(var(--bg))] border border-blue-500/30 rounded-lg mb-4">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">
                          S • Situation
                        </h4>
                        <p className="text-[rgb(var(--foreground))] leading-relaxed">{project.situation}</p>
                      </div>

                      {/* Task */}
                      <div className="p-4 bg-[rgb(var(--bg))] border border-amber-500/30 rounded-lg mb-4">
                        <h4 className="text-lg font-semibold text-amber-400 mb-3">
                          T • Task
                        </h4>
                        <p className="text-[rgb(var(--foreground))] leading-relaxed">{project.task}</p>
                      </div>

                      {/* Action */}
                      <div className="p-4 bg-[rgb(var(--bg))] border border-purple-500/30 rounded-lg mb-4">
                        <h4 className="text-lg font-semibold text-purple-400 mb-3">
                          A • Action
                        </h4>
                        <p className="text-[rgb(var(--foreground))] leading-relaxed">{project.action}</p>
                      </div>

                      {/* Result */}
                      <div className="p-4 bg-[rgb(var(--bg))] border border-emerald-500/30 rounded-lg mb-4">
                        <h4 className="text-lg font-semibold text-emerald-400 mb-3">
                          R • Result
                        </h4>
                        <p className="text-[rgb(var(--foreground))] leading-relaxed">{project.result}</p>
                      </div>

                      {/* Technologies Used */}
                      <div className="p-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                        <h4 className="text-lg font-semibold mb-3">
                          Technologies & Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Project Resources - Integrated */}
                <div className="grid md:grid-cols-2 gap-3">
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-lg hover:border-purple-500 hover:bg-purple-500/5 transition-all group"
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Repository</div>
                        <div className="text-sm opacity-90">Source Code</div>
                      </div>
                      <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {project.links?.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all group"
                    >
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Live Demo</div>
                        <div className="text-sm text-[rgb(var(--muted))]">View Application</div>
                      </div>
                      <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {project.links?.docs && (
                    <a
                      href={project.links.docs}
                      className="flex items-center gap-3 px-4 py-3 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all group md:col-span-2"
                    >
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Documentation</div>
                        <div className="text-sm text-[rgb(var(--muted))]">Technical Details</div>
                      </div>
                      <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedProjects.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-20 h-20 mx-auto mb-4 text-[rgb(var(--muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-[rgb(var(--muted))]">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-12 p-6 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Journey Summary</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[rgb(var(--bg))] border border-purple-500/30 rounded-lg">
                <div className="text-3xl font-bold text-purple-400">{projects.length}</div>
                <div className="text-sm text-[rgb(var(--muted))]">Total Projects</div>
              </div>
              <div className="text-center p-4 bg-[rgb(var(--bg))] border border-pink-500/30 rounded-lg">
                <div className="text-3xl font-bold text-pink-400">{new Set(projects.map(p => p.category)).size}</div>
                <div className="text-sm text-[rgb(var(--muted))]">Categories</div>
              </div>
              <div className="text-center p-4 bg-[rgb(var(--bg))] border border-blue-500/30 rounded-lg">
                <div className="text-3xl font-bold text-blue-400">{new Set(projects.flatMap(p => p.skills)).size}</div>
                <div className="text-sm text-[rgb(var(--muted))]">Technologies</div>
              </div>
              <div className="text-center p-4 bg-[rgb(var(--bg))] border border-emerald-500/30 rounded-lg">
                <div className="text-3xl font-bold text-emerald-400">8</div>
                <div className="text-sm text-[rgb(var(--muted))]">Weeks</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DocsLayout>
  );
}
