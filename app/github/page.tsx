"use client";
import { useState, useEffect } from "react";
import DocsLayout from "../components/DocsLayout";

interface Repository {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  week: number;
  stars: number;
  forks: number;
  language: string;
  technologies: string[];
  status: "active" | "archived" | "demo";
  links: {
    github: string;
    demo?: string;
    docs?: string;
  };
  metrics: {
    commits: number;
    contributors: number;
    size: string;
    lastUpdated: string;
  };
  highlights: string[];
}

const repositories: Repository[] = [
  {
    id: "digital-twin-portfolio",
    name: "digital-twin-portfolio",
    title: "Digital Twin Portfolio with MCP Server",
    description: "AI-powered portfolio with Model Context Protocol server for intelligent assistant integration. Features RAG search, Claude Desktop integration, and comprehensive project showcase.",
    category: "AI/ML",
    week: 8,
    stars: 0,
    forks: 0,
    language: "TypeScript",
    technologies: ["Next.js 16", "Python", "FastAPI", "MCP Protocol", "Upstash Vector", "Groq API", "Tailwind CSS"],
    status: "active",
    links: {
      github: "https://github.com/TheaMarieM/digital-twin-portfolio",
      demo: "https://digital-twin-portfolio.vercel.app",
      docs: "/mcp-integration"
    },
    metrics: {
      commits: 50,
      contributors: 1,
      size: "2.8 MB",
      lastUpdated: "2024-11-15"
    },
    highlights: [
      "7 production MCP tools for portfolio queries",
      "Claude Desktop integration via stdio protocol",
      "RAG search with 20 embedded chunks",
      "Real-time chat with Groq LLaMA 3.3-70b",
      "Comprehensive 8-week project showcase"
    ]
  },
  {
    id: "person-search-app",
    name: "person-search-app",
    title: "Person Search Application",
    description: "Full-stack search application with advanced filtering, real-time updates, and responsive design. Built with React and Node.js.",
    category: "Full-Stack",
    week: 7,
    stars: 0,
    forks: 0,
    language: "JavaScript",
    technologies: ["React", "Node.js", "PostgreSQL", "Express", "JWT", "Tailwind CSS"],
    status: "active",
    links: {
      github: "https://github.com/TheaMarieM/person-search",
      demo: "https://person-search.vercel.app"
    },
    metrics: {
      commits: 35,
      contributors: 1,
      size: "1.2 MB",
      lastUpdated: "2024-11-08"
    },
    highlights: [
      "Fuzzy search with <500ms response time",
      "JWT authentication and authorization",
      "PostgreSQL with 1000+ records",
      "Mobile-first responsive design",
      "Advanced filtering and sorting"
    ]
  },
  {
    id: "ecommerce-platform",
    name: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "Complete e-commerce solution with product management, shopping cart, payment processing, and admin dashboard.",
    category: "E-Commerce",
    week: 6,
    stars: 0,
    forks: 0,
    language: "TypeScript",
    technologies: ["Next.js", "Stripe API", "PostgreSQL", "Redux", "Tailwind CSS"],
    status: "active",
    links: {
      github: "https://github.com/TheaMarieM/ecommerce-platform",
      demo: "https://ecommerce-demo.vercel.app"
    },
    metrics: {
      commits: 42,
      contributors: 3,
      size: "3.1 MB",
      lastUpdated: "2024-11-01"
    },
    highlights: [
      "Stripe payment integration",
      "Product inventory management",
      "Order tracking and fulfillment",
      "Admin dashboard with analytics",
      "SEO optimized product pages"
    ]
  },
  {
    id: "advanced-task-manager",
    name: "advanced-task-manager",
    title: "Advanced Task Management System",
    description: "Enhanced task planner with real-time collaboration, file attachments, and team analytics dashboard.",
    category: "Productivity",
    week: 5,
    stars: 0,
    forks: 0,
    language: "JavaScript",
    technologies: ["React", "Socket.io", "AWS S3", "Node.js", "Chart.js"],
    status: "active",
    links: {
      github: "https://github.com/TheaMarieM/advanced-task-manager",
      demo: "https://task-manager-pro.vercel.app"
    },
    metrics: {
      commits: 28,
      contributors: 2,
      size: "1.8 MB",
      lastUpdated: "2024-10-25"
    },
    highlights: [
      "Real-time collaboration with Socket.io",
      "File attachments via AWS S3",
      "Team analytics dashboard",
      "Role-based permissions",
      "Productivity metrics tracking"
    ]
  },
  {
    id: "weather-dashboard",
    name: "weather-dashboard",
    title: "Weather Analytics Dashboard",
    description: "Comprehensive weather application with data visualization, forecasting, and location-based services.",
    category: "Data Analytics",
    week: 4,
    stars: 0,
    forks: 0,
    language: "JavaScript",
    technologies: ["React", "Chart.js", "OpenWeather API", "PWA", "Service Workers"],
    status: "active",
    links: {
      github: "https://github.com/TheaMarieM/weather-dashboard",
      demo: "https://weather-analytics.vercel.app"
    },
    metrics: {
      commits: 22,
      contributors: 1,
      size: "950 KB",
      lastUpdated: "2024-10-18"
    },
    highlights: [
      "Interactive weather charts",
      "5-day forecast with hourly data",
      "PWA with offline capabilities",
      "Geolocation integration",
      "Data caching for performance"
    ]
  },
  {
    id: "headless-blog-cms",
    name: "headless-blog-cms",
    title: "Headless Blog CMS",
    description: "Modern headless content management system with rich text editor, media management, and multi-frontend support.",
    category: "CMS",
    week: 3,
    stars: 0,
    forks: 0,
    language: "JavaScript",
    technologies: ["Strapi", "React", "MDX", "GraphQL", "Cloudinary"],
    status: "active",
    links: {
      github: "https://github.com/TheaMarieM/headless-blog-cms",
      demo: "https://blog-cms.vercel.app"
    },
    metrics: {
      commits: 18,
      contributors: 1,
      size: "1.5 MB",
      lastUpdated: "2024-10-11"
    },
    highlights: [
      "Rich text editor with MDX support",
      "Media management with Cloudinary",
      "GraphQL API for flexible queries",
      "Multi-frontend compatibility",
      "SEO optimized content delivery"
    ]
  },
  {
    id: "portfolio-v1",
    name: "portfolio-v1",
    title: "Personal Portfolio (Version 1)",
    description: "First iteration of personal portfolio with responsive design, dark mode, and accessibility features.",
    category: "Portfolio",
    week: 2,
    stars: 0,
    forks: 0,
    language: "HTML",
    technologies: ["HTML5", "CSS3", "Tailwind CSS", "JavaScript", "Vite"],
    status: "archived",
    links: {
      github: "https://github.com/TheaMarieM/portfolio-v1",
      demo: "https://portfolio-v1.vercel.app"
    },
    metrics: {
      commits: 15,
      contributors: 1,
      size: "420 KB",
      lastUpdated: "2024-10-04"
    },
    highlights: [
      "WCAG AA accessibility compliance",
      "35% load time improvement",
      "Dark mode implementation",
      "Mobile-first responsive design",
      "Performance optimizations"
    ]
  },
  {
    id: "interactive-todo",
    name: "interactive-todo",
    title: "Interactive Todo Application",
    description: "Feature-rich todo application with drag-and-drop, local storage, and modern UI built with vanilla JavaScript.",
    category: "Foundation",
    week: 1,
    stars: 0,
    forks: 0,
    language: "JavaScript",
    technologies: ["Vanilla JS", "CSS Grid", "Local Storage", "HTML5 Drag & Drop"],
    status: "demo",
    links: {
      github: "https://github.com/TheaMarieM/interactive-todo",
      demo: "https://interactive-todo.vercel.app"
    },
    metrics: {
      commits: 12,
      contributors: 1,
      size: "180 KB",
      lastUpdated: "2024-09-27"
    },
    highlights: [
      "Drag-and-drop functionality",
      "Local storage persistence",
      "Vanilla JavaScript architecture",
      "CSS Grid responsive layout",
      "100% feature completion"
    ]
  }
];

const categories = ["All", "AI/ML", "Full-Stack", "E-Commerce", "Productivity", "Data Analytics", "CMS", "Portfolio", "Foundation"];
const statuses = ["All", "active", "archived", "demo"];
const languages = ["All", "TypeScript", "JavaScript", "Python", "HTML"];

export default function GitHubPage() {
  const [filteredRepos, setFilteredRepos] = useState(repositories);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [sortBy, setSortBy] = useState<"week" | "commits" | "updated">("week");

  useEffect(() => {
    let filtered = repositories.filter(repo => {
      const categoryMatch = selectedCategory === "All" || repo.category === selectedCategory;
      const statusMatch = selectedStatus === "All" || repo.status === selectedStatus;
      const languageMatch = selectedLanguage === "All" || repo.language === selectedLanguage;
      return categoryMatch && statusMatch && languageMatch;
    });

    // Sort repositories
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "week":
          return b.week - a.week;
        case "commits":
          return b.metrics.commits - a.metrics.commits;
        case "updated":
          return new Date(b.metrics.lastUpdated).getTime() - new Date(a.metrics.lastUpdated).getTime();
        default:
          return 0;
      }
    });

    setFilteredRepos(filtered);
  }, [selectedCategory, selectedStatus, selectedLanguage, sortBy]);

  const totalStats = {
    repositories: repositories.length,
    commits: repositories.reduce((sum, repo) => sum + repo.metrics.commits, 0),
    technologies: new Set(repositories.flatMap(repo => repo.technologies)).size,
    weeks: 8
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400";
      case "archived": return "bg-amber-500/20 text-amber-400";
      case "demo": return "bg-blue-500/20 text-blue-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case "TypeScript": return "text-blue-400";
      case "JavaScript": return "text-yellow-400";
      case "Python": return "text-green-400";
      case "HTML": return "text-orange-400";
      default: return "text-gray-400";
    }
  };

  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              GitHub Portfolio
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-3xl mx-auto">
              Complete collection of repositories showcasing 8 weeks of progressive development, 
              from foundation concepts to advanced AI integration.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-center">📊 Portfolio Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg">
                <div className="text-3xl font-bold text-purple-400">{totalStats.repositories}</div>
                <div className="text-sm text-[rgb(var(--muted))]">Repositories</div>
              </div>
              <div className="text-center p-4 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg">
                <div className="text-3xl font-bold text-pink-400">{totalStats.commits}</div>
                <div className="text-sm text-[rgb(var(--muted))]">Total Commits</div>
              </div>
              <div className="text-center p-4 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg">
                <div className="text-3xl font-bold text-blue-400">{totalStats.technologies}</div>
                <div className="text-sm text-[rgb(var(--muted))]">Technologies</div>
              </div>
              <div className="text-center p-4 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg">
                <div className="text-3xl font-bold text-emerald-400">{totalStats.weeks}</div>
                <div className="text-sm text-[rgb(var(--muted))]">Weeks</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-[rgb(var(--muted))] self-center">Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-[rgb(var(--card))] hover:bg-[rgb(var(--card-hover))]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status and Language Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                <span className="text-sm text-[rgb(var(--muted))] self-center">Status:</span>
                {statuses.map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedStatus === status
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-[rgb(var(--card))] hover:bg-[rgb(var(--card-hover))]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <span className="text-sm text-[rgb(var(--muted))] self-center">Language:</span>
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedLanguage === lang
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-[rgb(var(--card))] hover:bg-[rgb(var(--card-hover))]"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <span className="text-sm text-[rgb(var(--muted))] self-center">Sort by:</span>
                {[
                  { value: "week", label: "Week" },
                  { value: "commits", label: "Commits" },
                  { value: "updated", label: "Updated" }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      sortBy === option.value
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-[rgb(var(--card))] hover:bg-[rgb(var(--card-hover))]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-center text-sm text-[rgb(var(--muted))] mb-8">
            Showing {filteredRepos.length} of {repositories.length} repositories
          </p>

          {/* Repository Cards */}
          <div className="space-y-6">
            {filteredRepos.map(repo => (
              <div
                key={repo.id}
                className="p-6 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl hover:border-purple-500/50 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold font-mono">{repo.name}</h2>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                        Week {repo.week}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(repo.status)}`}>
                        {repo.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[rgb(var(--muted))] mb-2">{repo.title}</h3>
                    <p className="text-[rgb(var(--muted))]">{repo.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getLanguageColor(repo.language)}`}>
                      {repo.language}
                    </div>
                    <div className="text-xs text-[rgb(var(--muted))]">{repo.category}</div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-purple-400">{repo.metrics.commits}</div>
                    <div className="text-xs text-[rgb(var(--muted))]">Commits</div>
                  </div>
                  <div className="bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-pink-400">{repo.metrics.contributors}</div>
                    <div className="text-xs text-[rgb(var(--muted))]">Contributors</div>
                  </div>
                  <div className="bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-400">{repo.metrics.size}</div>
                    <div className="text-xs text-[rgb(var(--muted))]">Size</div>
                  </div>
                  <div className="bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-emerald-400">{repo.metrics.lastUpdated}</div>
                    <div className="text-xs text-[rgb(var(--muted))]">Updated</div>
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {repo.technologies.map(tech => (
                    <span key={tech} className="px-2 py-1 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">✨ Key Highlights:</h4>
                  <ul className="grid md:grid-cols-2 gap-1">
                    {repo.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm text-[rgb(var(--muted))] flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">▸</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={repo.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                  {repo.links.demo && (
                    <a
                      href={repo.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all"
                    >
                      🚀 Live Demo
                    </a>
                  )}
                  {repo.links.docs && (
                    <a
                      href={repo.links.docs}
                      className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-lg hover:border-purple-500/50 transition-all"
                    >
                      📚 Documentation
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredRepos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No repositories found</h3>
              <p className="text-[rgb(var(--muted))]">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}

          {/* GitHub Profile Link */}
          <div className="mt-12 p-6 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">🔗 Connect with Me</h2>
            <div className="space-y-4">
              <div>
                <a
                  href="https://github.com/TheaMarieM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition-opacity text-lg font-semibold"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Visit GitHub Profile
                </a>
              </div>
              <p className="text-[rgb(var(--muted))] text-sm">
                Follow for updates on new projects and contributions to open source
              </p>
            </div>
          </div>
        </div>
      </main>
    </DocsLayout>
  );
}
