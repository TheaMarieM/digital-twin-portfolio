"use client";
import { useState } from "react";
import DocsLayout from "../components/DocsLayout";

const mcpTools = [
  {
    name: "get_portfolio_summary",
    description: "Get a concise summary of the portfolio owner's role, summary, and skills",
    category: "Portfolio",
    params: [],
    example: { response: "Marithea Magno - IT Student focused on web development, UI/UX, and building practical projects with modern JS." }
  },
  {
    name: "list_star_items",
    description: "List all STAR methodology items (professional experiences/projects)",
    category: "Portfolio",
    params: [],
    example: { 
      response: "5 STAR items: Personal Portfolio Modernization, Chatbot Proof of Concept, Team Task Planner, Responsive UI Exercises, Accessibility Improvements" 
    }
  },
  {
    name: "get_star_item",
    description: "Get details of a specific STAR item by ID",
    category: "Portfolio",
    params: [{ name: "item_id", type: "string", required: true }],
    example: { 
      request: { item_id: "proj-portfolio" },
      response: "Personal Portfolio Modernization: Static portfolio lacked responsiveness... Load time improved ~35%, mobile Lighthouse 95+" 
    }
  },
  {
    name: "search_skills",
    description: "Search for STAR items by skill/technology",
    category: "Portfolio",
    params: [{ name: "skill", type: "string", required: true }],
    example: {
      request: { skill: "JavaScript" },
      response: "Found 2 items with JavaScript: Chatbot Proof of Concept, Team Task Planner"
    }
  },
  {
    name: "get_interview_questions",
    description: "Get common interview questions and prepared answers",
    category: "Interview",
    params: [{ name: "limit", type: "number", required: false }],
    example: {
      request: { limit: 3 },
      response: "3 interview Q&As covering background, technical skills, and project challenges"
    }
  },
  {
    name: "practice_interview",
    description: "Get a random interview question for practice",
    category: "Interview",
    params: [],
    example: {
      response: "Q: Tell me about a challenging project you worked on. A: [Prepared STAR-format answer]"
    }
  },
  {
    name: "semantic_search",
    description: "Perform RAG search across all portfolio content",
    category: "RAG",
    params: [
      { name: "query", type: "string", required: true },
      { name: "top_k", type: "number", required: false }
    ],
    example: {
      request: { query: "What experience do you have with AI?", top_k: 3 },
      response: "Top 3 relevant chunks: Chatbot RAG project, Digital Twin MCP server, Semantic search implementation..."
    }
  }
];

const integrationExamples = [
  {
    title: "Portfolio Chat Integration",
    description: "Main chat interface uses semantic_search tool to find relevant portfolio content",
    flow: [
      "User asks: 'What projects have you built?'",
      "MCP server calls semantic_search with query",
      "Upstash Vector returns top 3 relevant chunks",
      "Groq LLaMA generates response with context",
      "Chat displays answer with citations"
    ],
    code: `// app/api/chat/route.ts
const response = await fetch('http://localhost:3000/tools/semantic_search', {
  method: 'POST',
  body: JSON.stringify({ query: userMessage, top_k: 3 })
});
const { results } = await response.json();
// Feed results to Groq for generation`
  },
  {
    title: "Profile Data Page Integration",
    description: "Profile page displays STAR items fetched from MCP tools",
    flow: [
      "Page loads and calls list_star_items",
      "MCP server reads profile.json",
      "Returns all 5 STAR items with metadata",
      "Page renders expandable cards",
      "User clicks item → calls get_star_item for full details"
    ],
    code: `// app/profile-data/page.tsx
const items = await fetch('http://localhost:3000/tools/list_star_items');
const data = await items.json();
// Render each item with expand/collapse`
  },
  {
    title: "Interview Training Integration",
    description: "Practice interview questions with prepared answers",
    flow: [
      "User clicks 'Practice Interview'",
      "Calls practice_interview tool",
      "MCP server loads interview_qa.jsonl",
      "Returns random Q&A pair",
      "User reviews answer, clicks 'Next Question'"
    ],
    code: `// Interview practice component
const qa = await fetch('http://localhost:3000/tools/practice_interview');
const { question, answer } = await qa.json();
setState({ question, answer, revealed: false });`
  }
];

export default function MCPIntegrationPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

  const categories = ["All", "Portfolio", "Interview", "RAG"];
  const filteredTools = selectedCategory === "All" 
    ? mcpTools 
    : mcpTools.filter(t => t.category === selectedCategory);

  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-purple-400">
              MCP Integration
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-3xl mx-auto">
              Model Context Protocol server with 7 production tools for intelligent portfolio interactions.
              Enables semantic search, interview practice, and dynamic profile queries through a FastAPI backend.
            </p>
          </div>

          {/* Architecture Overview */}
          <div className="mb-12 p-6 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">System Architecture</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 bg-[rgb(var(--bg))] border-2 border-purple-500/30 rounded-lg hover:border-purple-500 transition-colors">
                <h3 className="font-semibold mb-2 text-lg text-purple-400">FastAPI Server</h3>
                <p className="text-sm text-[rgb(var(--muted))] mb-2">Python MCP server on port 3000</p>
                <ul className="text-xs text-[rgb(var(--muted))] space-y-1 list-disc list-inside">
                  <li>7 production tools</li>
                  <li>HTTP + stdio protocols</li>
                  <li>CORS enabled</li>
                </ul>
              </div>
              <div className="p-5 bg-[rgb(var(--bg))] border-2 border-pink-500/30 rounded-lg hover:border-pink-500 transition-colors">
                <h3 className="font-semibold mb-2 text-lg text-pink-400">Next.js Frontend</h3>
                <p className="text-sm text-[rgb(var(--muted))] mb-2">Portfolio app on port 3001</p>
                <ul className="text-xs text-[rgb(var(--muted))] space-y-1 list-disc list-inside">
                  <li>Consumes MCP tools</li>
                  <li>Real-time chat interface</li>
                  <li>Interactive demos</li>
                </ul>
              </div>
              <div className="p-5 bg-[rgb(var(--bg))] border-2 border-blue-500/30 rounded-lg hover:border-blue-500 transition-colors">
                <h3 className="font-semibold mb-2 text-lg text-blue-400">RAG Pipeline</h3>
                <p className="text-sm text-[rgb(var(--muted))] mb-2">Semantic search system</p>
                <ul className="text-xs text-[rgb(var(--muted))] space-y-1 list-disc list-inside">
                  <li>Upstash Vector DB</li>
                  <li>Groq LLaMA 3.3</li>
                  <li>384-dim embeddings</li>
                </ul>
              </div>
            </div>
          </div>

          {/* MCP Tools */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Available MCP Tools</h2>
            
            {/* Category Filter */}
            <div className="flex gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-purple-500 text-white border-2 border-purple-500"
                      : "bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] hover:border-purple-500/50"
                  }`}
                >
                  {cat} {cat !== "All" && `(${mcpTools.filter(t => t.category === cat).length})`}
                </button>
              ))}
            </div>

            {/* Tools Grid */}
            <div className="grid gap-4">
              {filteredTools.map((tool, i) => (
                <div
                  key={i}
                  className="p-5 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold font-mono text-purple-400">{tool.name}</h3>
                      <p className="text-sm text-[rgb(var(--muted))] mt-1">{tool.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs font-medium">
                      {tool.category}
                    </span>
                  </div>

                  {/* Parameters */}
                  {tool.params.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-[rgb(var(--muted))] mb-2">Parameters:</div>
                      <div className="flex flex-wrap gap-2">
                        {tool.params.map((param, j) => (
                          <code key={j} className="px-2 py-1 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded text-xs">
                            {param.name}: <span className="text-blue-400">{param.type}</span>
                            {param.required && <span className="text-red-400">*</span>}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Example */}
                  <button
                    onClick={() => setSelectedTool(selectedTool === tool.name ? null : tool.name)}
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    {selectedTool === tool.name ? "Hide" : "Show"} Example
                    <svg className={`w-4 h-4 transition-transform ${selectedTool === tool.name ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {selectedTool === tool.name && (
                    <div className="mt-3 p-3 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg space-y-2">
                      {tool.example.request && (
                        <div>
                          <div className="text-xs font-semibold text-emerald-400 mb-1">Request:</div>
                          <pre className="text-xs overflow-x-auto">
                            <code>{JSON.stringify(tool.example.request, null, 2)}</code>
                          </pre>
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-semibold text-blue-400 mb-1">Response:</div>
                        <div className="text-xs text-[rgb(var(--muted))]">{tool.example.response}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Integration Examples */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Integration Examples</h2>
            <div className="space-y-4">
              {integrationExamples.map((example, i) => (
                <div
                  key={i}
                  className="p-5 bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl hover:border-purple-500/50 transition-colors"
                >
                  <h3 className="text-xl font-bold mb-2">{example.title}</h3>
                  <p className="text-[rgb(var(--muted))] mb-4">{example.description}</p>

                  <button
                    onClick={() => setSelectedExample(selectedExample === i ? null : i)}
                    className="mb-4 px-4 py-2 bg-purple-500 text-white border-2 border-purple-500 rounded-lg hover:bg-purple-600 hover:border-purple-600 transition-all text-sm font-medium"
                  >
                    {selectedExample === i ? "Hide" : "Show"} Details
                  </button>

                  {selectedExample === i && (
                    <div className="space-y-4 animate-in slide-in-from-top">
                      {/* Flow */}
                      <div className="p-4 bg-[rgb(var(--bg))] border-2 border-purple-500/30 rounded-lg">
                        <h4 className="font-semibold mb-3 text-purple-400">Execution Flow</h4>
                        <ol className="space-y-2">
                          {example.flow.map((step, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-[rgb(var(--muted))]">
                              <span className="text-purple-400 font-bold">{j + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Code */}
                      <div className="p-4 bg-[rgb(var(--bg))] border-2 border-pink-500/30 rounded-lg">
                        <h4 className="font-semibold mb-3 text-pink-400">Code Example</h4>
                        <pre className="text-sm overflow-x-auto">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Testing Section */}
          <div className="mt-12 p-6 bg-[rgb(var(--card))] border-2 border-purple-500/30 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Testing & Development</h2>
            <div className="space-y-4">
              <p className="text-[rgb(var(--muted))]">Multiple ways to test and interact with MCP tools:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[rgb(var(--bg))] border-2 border-[rgb(var(--border))] rounded-lg">
                  <h3 className="font-semibold mb-2 text-purple-400">Command Line</h3>
                  <code className="text-xs bg-[rgb(var(--card))] px-2 py-1 rounded block mb-2">python scripts/test_mcp_direct.py</code>
                  <p className="text-xs text-[rgb(var(--muted))]">Direct Python testing of all tools</p>
                </div>
                <div className="p-4 bg-[rgb(var(--bg))] border-2 border-[rgb(var(--border))] rounded-lg">
                  <h3 className="font-semibold mb-2 text-pink-400">HTTP API</h3>
                  <code className="text-xs bg-[rgb(var(--card))] px-2 py-1 rounded block mb-2">curl localhost:3000/tools/*</code>
                  <p className="text-xs text-[rgb(var(--muted))]">REST API endpoints for each tool</p>
                </div>
                <div className="p-4 bg-[rgb(var(--bg))] border-2 border-[rgb(var(--border))] rounded-lg">
                  <h3 className="font-semibold mb-2 text-blue-400">Chat Interface</h3>
                  <a href="/" className="text-xs text-blue-400 hover:underline block mb-2">localhost:3001 →</a>
                  <p className="text-xs text-[rgb(var(--muted))]">Natural language queries with RAG</p>
                </div>
                <div className="p-4 bg-[rgb(var(--bg))] border-2 border-[rgb(var(--border))] rounded-lg">
                  <h3 className="font-semibold mb-2 text-emerald-400">Interactive Testing</h3>
                  <a href="/testing" className="text-xs text-emerald-400 hover:underline block mb-2">/testing →</a>
                  <p className="text-xs text-[rgb(var(--muted))]">Web UI for manual tool execution</p>
                </div>
                <div className="p-4 bg-[rgb(var(--bg))] border-2 border-[rgb(var(--border))] rounded-lg">
                  <h3 className="font-semibold mb-2 text-violet-400">Claude Desktop</h3>
                  <code className="text-xs bg-[rgb(var(--card))] px-2 py-1 rounded block mb-2">MCP stdio protocol</code>
                  <p className="text-xs text-[rgb(var(--muted))]">Native integration with Claude Desktop app</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DocsLayout>
  );
}
