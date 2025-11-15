"use client";
import { useState } from "react";
import DocsLayout from "../components/DocsLayout";

const projects = [
  {
    id: "digital-twin",
    title: "Digital Twin MCP Server",
    category: "AI/ML",
    status: "In Progress",
    thumbnail: "🤖",
    description: "AI-powered digital assistant using Model Context Protocol (MCP) server with RAG capabilities for professional portfolio queries.",
    challenge: "Build a production-ready MCP server that can intelligently answer questions about professional background using retrieval-augmented generation.",
    approach: [
      "Designed FastAPI HTTP server implementing MCP protocol specification",
      "Created 7 production tools: portfolio queries, interview Q&A, and RAG search",
      "Integrated Upstash Vector database with 20 embedded profile chunks (384-dim)",
      "Implemented Groq API with LLaMA 3.3-70b for intelligent response generation",
      "Built responsive Next.js chat interface with real-time capabilities"
    ],
    results: [
      "Deployed working MCP server with 7 functional tools",
      "Achieved <2s response time for RAG-powered portfolio queries", 
      "Built comprehensive interview training system with Q&A generation",
      "Created professional portfolio website with chat integration"
    ],
    techStack: ["Next.js 16", "FastAPI", "Python", "TypeScript", "Upstash Vector", "Groq API", "Tailwind CSS", "ShadCN"],
    metrics: {
      "Vector Chunks": 20,
      "Embedding Dims": 384,
      "MCP Tools": 7,
      "Response Time": "<2s"
    },
    links: {
      github: "https://github.com/TheaMarieM/my-ai-app",
      demo: "/",
      docs: "/about"
    }
  },
  {
    id: "portfolio-modernization",
    title: "Personal Portfolio Modernization",
    category: "Web Development",
    status: "Complete",
    thumbnail: "🎨",
    description: "Redesigned and rebuilt personal portfolio with modern web technologies, focusing on performance, accessibility, and user experience.",
    challenge: "Static portfolio lacked responsiveness, had poor performance metrics, and wasn't showcasing technical skills effectively.",
    approach: [
      "Semantic HTML5 structure with proper heading hierarchy",
      "Tailwind CSS for utility-first styling and dark mode",
      "Componentized architecture with reusable sections",
      "Mobile-first responsive design with breakpoints",
      "Performance optimization (lazy loading, code splitting)"
    ],
    results: [
      "Load time improved by ~35%",
      "Mobile Lighthouse score: 95+",
      "WCAG AA accessibility compliance",
      "Smooth animations with 60fps performance"
    ],
    techStack: ["HTML5", "CSS3", "Tailwind CSS", "JavaScript", "Vite"],
    metrics: {
      "Lighthouse": "95+",
      "Load Time": "-35%",
      "Accessibility": "WCAG AA",
      "Mobile Score": "95+"
    },
    links: {
      github: "https://github.com/TheaMarieM/portfolio",
      demo: "https://portfolio-demo.vercel.app"
    }
  },
  {
    id: "chatbot-rag",
    title: "RAG Chatbot Proof of Concept",
    category: "AI/ML",
    status: "Complete",
    thumbnail: "💬",
    description: "Developed a retrieval-augmented generation chatbot that answers questions using embedded knowledge base with citation support.",
    challenge: "Class project required demonstrating AI integration with practical application of RAG principles and prompt engineering.",
    approach: [
      "Structured content into embeddable chunks",
      "Computed embeddings using sentence-transformers",
      "Implemented semantic search with cosine similarity",
      "Generated answers with context and citations",
      "Built simple Q&A interface for testing"
    ],
    results: [
      "Working demo with >0.7 avg similarity on benchmark",
      "Accurate context retrieval with citations",
      "Real-time response generation",
      "Extensible architecture for new content"
    ],
    techStack: ["JavaScript", "OpenAI API", "Embeddings", "Vector Search", "React"],
    metrics: {
      "Similarity Score": ">0.7",
      "Response Time": "2-3s",
      "Context Chunks": "3-5",
      "Accuracy": "85%+"
    },
    links: {
      github: "https://github.com/TheaMarieM/rag-chatbot",
      docs: "/rag"
    }
  },
  {
    id: "team-planner",
    title: "Team Task Planner",
    category: "Productivity",
    status: "Complete",
    thumbnail: "📋",
    description: "Built a Kanban-style task management system to help teams track assignments, deadlines, and priorities collaboratively.",
    challenge: "Team struggled to track multiple assignments and deadlines, leading to missed deliverables and poor transparency.",
    approach: [
      "Created drag-and-drop Kanban board (To Do, In Progress, Done)",
      "Added priority levels and deadline tracking",
      "Implemented export to CSV for reporting",
      "Built simple user assignment system",
      "Used local storage for data persistence"
    ],
    results: [
      "Reduced missed deadlines by 60%",
      "Improved team transparency and communication",
      "Better workload distribution visibility",
      "Easy export for project reports"
    ],
    techStack: ["JavaScript", "React", "HTML5 Drag & Drop", "Local Storage", "CSS Grid"],
    metrics: {
      "Missed Deadlines": "-60%",
      "Team Adoption": "100%",
      "Tasks Tracked": "150+",
      "Active Users": "8"
    },
    links: {
      github: "https://github.com/TheaMarieM/team-planner"
    }
  },
  {
    id: "responsive-ui",
    title: "Responsive UI Component Library",
    category: "UI/UX",
    status: "Complete",
    thumbnail: "📱",
    description: "Developed a collection of responsive UI components with fluid layouts that adapt seamlessly across devices and screen sizes.",
    challenge: "Practice building fluid layouts that work consistently across phones, tablets, and desktops without media query overload.",
    approach: [
      "Applied CSS Grid and Flexbox for flexible layouts",
      "Implemented fluid typography with clamp()",
      "Used container queries for component-level responsiveness",
      "Tested across multiple breakpoints and devices",
      "Created comprehensive component documentation"
    ],
    results: [
      "Consistent experience across all devices",
      "Reduced CSS by using modern layout techniques",
      "Reusable component patterns",
      "Comprehensive documentation with examples"
    ],
    techStack: ["CSS Grid", "Flexbox", "Container Queries", "Tailwind CSS", "Storybook"],
    metrics: {
      "Components": "25+",
      "Breakpoints": "5",
      "CSS Reduction": "-40%",
      "Device Coverage": "100%"
    },
    links: {
      github: "https://github.com/TheaMarieM/responsive-ui",
      demo: "https://responsive-ui.vercel.app"
    }
  }
];

const categories = ["All", "AI/ML", "Web Development", "Productivity", "UI/UX"];
const statuses = ["All", "Complete", "In Progress"];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filteredProjects = projects.filter(p => {
    const categoryMatch = selectedCategory === "All" || p.category === selectedCategory;
    const statusMatch = selectedStatus === "All" || p.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Project Portfolio
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-2xl mx-auto">
              5 projects showcasing full-stack development, AI/ML integration, and modern web technologies.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <div className="flex gap-2">
              <span className="text-sm text-[rgb(var(--muted))] self-center">Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--card-hover))]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-[rgb(var(--muted))] self-center">Status:</span>
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatus === status
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--card-hover))]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-center text-sm text-[rgb(var(--muted))] mb-8">
            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>

          {/* Project Cards */}
          <div className="space-y-6">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6 hover:border-purple-500/50 transition-all"
              >
                {/* Project Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{project.thumbnail}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-2xl font-bold">{project.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "Complete" 
                          ? "bg-emerald-500/20 text-emerald-400" 
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-[rgb(var(--muted))] mb-4">{project.description}</p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key} className="bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {value}
                      </div>
                      <div className="text-xs text-[rgb(var(--muted))] mt-1">{key}</div>
                    </div>
                  ))}
                </div>

                {/* Expand/Collapse */}
                <button
                  onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                  className="w-full py-2 px-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  {expandedProject === project.id ? "Hide Details" : "Show Details"}
                  <svg className={`w-4 h-4 transition-transform ${expandedProject === project.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded Details */}
                {expandedProject === project.id && (
                  <div className="mt-4 space-y-4 animate-in slide-in-from-top">
                    {/* Challenge */}
                    <div className="p-4 bg-[rgb(var(--bg))] border border-blue-500/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">🎯 Challenge</h3>
                      <p className="text-[rgb(var(--muted))]">{project.challenge}</p>
                    </div>

                    {/* Approach */}
                    <div className="p-4 bg-[rgb(var(--bg))] border border-purple-500/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-400 mb-3">🔧 Approach</h3>
                      <ul className="space-y-2">
                        {project.approach.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-[rgb(var(--muted))]">
                            <span className="text-purple-400 mt-1">▸</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Results */}
                    <div className="p-4 bg-[rgb(var(--bg))] border border-emerald-500/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-emerald-400 mb-3">✨ Results</h3>
                      <ul className="space-y-2">
                        {project.results.map((result, i) => (
                          <li key={i} className="flex items-start gap-2 text-[rgb(var(--muted))]">
                            <span className="text-emerald-400">✓</span>
                            <span>{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack */}
                    <div className="p-4 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">🛠️ Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map(tech => (
                          <span key={tech} className="px-3 py-1 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-full text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-3">
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          View on GitHub
                        </a>
                      )}
                      {project.links.demo && (
                        <a
                          href={project.links.demo}
                          className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all"
                        >
                          <span>🚀</span>
                          Live Demo
                        </a>
                      )}
                      {project.links.docs && (
                        <a
                          href={project.links.docs}
                          className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all"
                        >
                          <span>📚</span>
                          Documentation
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-[rgb(var(--muted))]">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>
      </main>
    </DocsLayout>
  );
}
