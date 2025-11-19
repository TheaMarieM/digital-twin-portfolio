"use client";
import { useEffect, useState, FormEvent } from "react";

export default function Home() {
  const [activeId, setActiveId] = useState<string>("home");

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [lightbox, setLightbox] = useState<null | { src: string; alt: string }>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = saved ? saved === "dark" : prefersDark;
    
    if (shouldDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setIsDarkMode(shouldDark);
  }, []);

  function toggleTheme() {
    const el = document.documentElement;
    const newIsDark = !isDarkMode;
    
    if (newIsDark) {
      el.classList.add("dark");
    } else {
      el.classList.remove("dark");
    }
    
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    setIsDarkMode(newIsDark);
  }

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  useEffect(() => {
    const ids = ["home","about","experience","designs","skills","ai","contact"] as const;
    const els = ids
      .map((id) => document.getElementById(id) as HTMLElement | null)
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const calcActive = () => {
      const viewportMid = window.innerHeight * 0.35; // bias to upper third
      let best: { id: string; dist: number } | null = null;
      for (const el of els) {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - viewportMid);
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;
        if (!best || dist < best.dist) best = { id: el.id, dist };
      }
      if (best) setActiveId(best.id);
    };

    const onScroll = () => requestAnimationFrame(calcActive);
    calcActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const navItemClass = (id: string) =>
    `hover:text-[rgb(var(--accent))] ${activeId === id ? "text-[rgb(var(--accent))]" : ""}`;

  // --- Chat state and handlers (prevent runtime ReferenceError when rendering) ---
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hey there! I'm Marithea's digital twin. Feel free to ask me anything about my projects, experience, or what I've been working on lately!" },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  async function handleChatSubmit(e: FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput.trim() };
    setChatMessages((s) => [...s, userMsg]);
    setChatInput("");
    setChatLoading(true);
    setChatError(null);
    try {
      // Call the chat API with portfolio context (RAG built-in)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          sessionId: 'web-chat'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // server may return { error: "..." } or a plain message
        const errorMessage =
          typeof errorData.error === "string"
            ? errorData.error
            : errorData.error?.message || `API error: ${response.status}`;
        console.error("API Error:", errorMessage);

        // Show a friendly, actionable message to the user instead of throwing
        const isQuota = /quota|insufficient_quota|429|billing/i.test(errorMessage);
        const userFriendly = isQuota
          ? "The AI service is currently unavailable due to quota/billing limits. Please check billing or rotate the API key."
          : "Sorry, the AI service returned an error. Please try again later.";

        setChatError(userFriendly);
        setChatMessages((s) => [
          ...s,
          {
            role: "assistant",
            content: isQuota
              ? "I’m temporarily unavailable due to quota/billing limits. Please try again later or contact the site administrator."
              : "Sorry, I encountered an error while generating a response. Please try again later.",
          },
        ]);

        setChatLoading(false);
        return;
      }

      const data = await response.json();
      const aiAnswer = data.message || "I'm sorry, I couldn't generate a response. Please try rephrasing your question.";
      
      const assistantMsg = { 
        role: "assistant", 
        content: aiAnswer 
      };
      setChatMessages((s) => [...s, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage = err.message || "Failed to get AI response.";
      
      // Show a more specific error message to the user
      setChatError(errorMessage.includes('quota') 
        ? "The AI service is currently unavailable due to quota limits. Please try again later."
        : "Sorry, I encountered an error. Please try asking again!");
      
      setChatMessages((s) => [...s, { 
        role: "assistant", 
        content: errorMessage.includes('quota')
          ? "I apologize, but I'm currently unavailable due to service limits. Please try again later or contact the site administrator."
          : "Sorry, I encountered an error. Please try asking again!" 
      }]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))] antialiased relative transition-colors duration-300 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Light mode subtle blobs */}
        <div className="block dark:hidden">
          <div className="absolute left-1/2 top-[-10%] h-[55vh] w-[75vw] -translate-x-1/2 rounded-full blur-3xl opacity-[0.22]" style={{background: 'radial-gradient(closest-side, rgba(168,85,247,0.35), transparent 70%)'}} />
          <div className="absolute right-[-10%] bottom-[-2%] h-[45vh] w-[55vw] rounded-full blur-3xl opacity-[0.2]" style={{background: 'radial-gradient(closest-side, rgba(236,72,153,0.25), transparent 70%)'}} />
        </div>
        {/* Dark mode stronger blobs + starfield */}
        <div className="hidden dark:block">
          <div className="absolute left-1/2 top-[-10%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full blur-3xl opacity-[0.35]" style={{background: 'radial-gradient(closest-side, rgba(168,85,247,0.55), transparent 70%)'}} />
          <div className="absolute right-[-10%] bottom-[-2%] h-[50vh] w-[60vw] rounded-full blur-3xl opacity-[0.35]" style={{background: 'radial-gradient(closest-side, rgba(217,70,239,0.55), transparent 70%)'}} />
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1.5px)', backgroundSize: '3px 3px'}} />
        </div>
      </div>
      <style jsx global>{`
        :root {
          --bg: 255 255 255;            /* white */
          --card: 252 250 255;          /* soft violet card */
          --text: 17 24 39;             /* slate-900 */
          --muted: 100 116 139;         /* slate-500/600 */
          --accent: 168 85 247;         /* violet-500 */
          --ring: 168 85 247;
          --border: 221 214 244;        /* violet-200 */
          --shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        html {
          transition: background-color 0.3s ease-in-out;
        }
        html.dark {
          --bg: 10 7 25;                 /* deep purple */
          --card: 26 20 55;              /* purple card */
          --text: 236 233 252;           /* lavender */
          --muted: 183 170 220;          /* muted purple */
          --accent: 217 70 239;          /* fuchsia */
          --ring: 217 70 239;
          --border: 64 38 97;            /* purple border */
          --shadow: 0 20px 60px rgba(0,0,0,0.6);
        }
        .shadow-soft { box-shadow: var(--shadow); }
        ::selection { background: rgba(168,85,247,0.25); color: rgb(17 24 39); }
        html.dark ::selection { background: rgba(217,70,239,0.35); color: rgb(243 244 246); }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        @keyframes spin-slow { to { transform: rotate(360deg) } }
        @keyframes shimmer { 0% { opacity: .1; transform: translateX(-100%) } 50% { opacity: .35 } 100% { opacity: .1; transform: translateX(100%) } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        .float { animation: float 6s ease-in-out infinite }
        .spin-slow { animation: spin-slow 18s linear infinite }
        .shimmer { animation: shimmer 2.5s ease-in-out infinite }
        
        /* Custom scrollbar for chat */
        .chat-messages::-webkit-scrollbar { width: 8px; }
        .chat-messages::-webkit-scrollbar-track { background: rgb(var(--card)); border-radius: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: linear-gradient(180deg, rgb(168 85 247), rgb(236 72 153)); border-radius: 4px; }
        .chat-messages::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, rgb(147 51 234), rgb(219 39 119)); }
      `}</style>

      <header className="fixed top-0 z-50 w-full bg-[rgb(var(--bg)/0.7)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgb(var(--bg)/0.5)] border-b border-[rgb(var(--border))] shadow-sm">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="#home" className="font-bold text-lg tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500 transition-all duration-300">Marithea Magno</a>
            <nav className="hidden gap-6 text-sm md:flex">
              <a className={navItemClass("about")} aria-current={activeId === "about" ? "page" : undefined} href="#about">About</a>
              <a className={navItemClass("experience")} aria-current={activeId === "experience" ? "page" : undefined} href="#experience">Experience</a>
              <a className={navItemClass("projects")} aria-current={activeId === "projects" ? "page" : undefined} href="#projects">Projects</a>
              <a className={navItemClass("designs")} aria-current={activeId === "designs" ? "page" : undefined} href="#designs">Designs</a>
              <a className={navItemClass("skills")} aria-current={activeId === "skills" ? "page" : undefined} href="#skills">Skills</a>
              <a className={navItemClass("ai")} aria-current={activeId === "ai" ? "page" : undefined} href="#ai">AI</a>
              <a className={navItemClass("contact")} aria-current={activeId === "contact" ? "page" : undefined} href="#contact">Contact</a>
              <div className="relative group">
                <button type="button" className="flex items-center gap-1 hover:text-[rgb(var(--accent))] transition-colors focus:outline-none">
                  Documentation
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 hidden w-72 rounded-xl border-2 border-[rgb(var(--border))] bg-[rgb(var(--card))] backdrop-blur-xl p-3 shadow-2xl z-50 group-hover:block group-focus-within:block">
                  <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-purple-400">Core Documentation</div>
                  <a href="/projects" className="flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
                    Project Portfolio
                  </a>
                  <a href="/designs" className="flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
                    Design Showcase
                  </a>
                  
                  <div className="my-2 h-px bg-gradient-to-r from-transparent via-[rgb(var(--border))] to-transparent" />
                  <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-pink-400">Technical Details</div>
                  <a href="/mcp-integration" className="flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
                    MCP Integration
                  </a>
                  <a href="/advanced-features" className="flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
                    Advanced Features
                  </a>
                  <a href="/testing" className="flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
                    Testing & Validation
                  </a>
                  
                  <div className="my-2 h-px bg-gradient-to-r from-transparent via-[rgb(var(--border))] to-transparent" />
                  <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">Performance & Operations</div>
                  <a href="/optimization" className="flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
                    Query Optimization
                  </a>
                  <a href="/monitoring" className="flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
                    Performance Monitoring
                  </a>
                  <a href="/scalability" className="flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
                    Load Testing & Scalability
                  </a>
                  <a href="/operations" className="flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
                    Production Operations
                  </a>
                </div>
              </div>
            </nav>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-[rgb(var(--border))] hover:bg-[rgb(var(--card))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] text-[rgb(var(--text))] transition-all duration-300 hover:scale-110 group"
              >
                {/* Moon icon - shown in light mode (when dark mode is OFF) */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className={`h-5 w-5 absolute inset-0 m-auto transition-all duration-500 ease-in-out ${
                    isDarkMode 
                      ? 'opacity-0 rotate-180 scale-0' 
                      : 'opacity-100 rotate-0 scale-100'
                  }`}
                >
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd"/>
                </svg>
                {/* Sun icon - shown in dark mode (when dark mode is ON) */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className={`h-5 w-5 absolute inset-0 m-auto transition-all duration-500 ease-in-out ${
                    isDarkMode 
                      ? 'opacity-100 rotate-0 scale-100' 
                      : 'opacity-0 -rotate-180 scale-0'
                  }`}
                >
                  <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
                </svg>
              </button>
              <button
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-[rgb(var(--border))] hover:bg-[rgb(var(--card))]"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Open navigation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd"/></svg>
              </button>
            </div>
          </div>
          <div id="mobileNav" className={`md:hidden ${mobileOpen ? "" : "hidden"} pb-4`}>
            <div className="grid gap-1 text-sm">
              <a onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="#about">About</a>
              <a onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="#experience">Experience</a>
              <a onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="#projects">Projects</a>
              <a onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="#designs">Designs</a>
              <a onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="#skills">Skills</a>
              <a onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="#ai">AI</a>
              <a onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="#contact">Contact</a>
              
              <div className="mt-3 px-3 text-xs font-semibold uppercase tracking-wider text-purple-400">Core Documentation</div>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/projects">Project Portfolio</a>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/designs">Design Showcase</a>
              
              <div className="mt-3 px-3 text-xs font-semibold uppercase tracking-wider text-pink-400">Technical Details</div>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/mcp-integration">MCP Integration</a>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/advanced-features">Advanced Features</a>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/testing">Testing & Validation</a>
              
              <div className="mt-3 px-3 text-xs font-semibold uppercase tracking-wider text-cyan-400">Performance & Operations</div>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/optimization">Query Optimization</a>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/monitoring">Performance Monitoring</a>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/scalability">Load Testing & Scalability</a>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/operations">Production Operations</a>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-20">
        {/* Hero */}
        <section id="home" className="relative py-16 sm:py-20 md:py-24 lg:py-32">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[35%] h-[42vh] w-[55vw] -translate-x-1/2 rounded-full blur-3xl opacity-30 hidden dark:block" style={{background: 'radial-gradient(closest-side, rgba(217,70,239,0.55), transparent 70%)'}} />
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-gradient-to-r from-[rgb(var(--card))] to-transparent px-4 py-1.5 text-xs font-medium text-[rgb(var(--muted))] shadow-lg backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span>Available for opportunities</span>
              </div>
              <h1 className="mt-8 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
                <span className="block">Hi, I'm</span>
                <span className="block mt-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">Marithea Magno</span>
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-[rgb(var(--muted))] max-w-2xl">IT Student passionate about modern web development. I craft simple, usable interfaces and keep learning by building real projects.</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#projects" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50 active:scale-95">
                  <span className="relative z-10">View Projects</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </a>
                <a href="#contact" className="inline-flex items-center justify-center rounded-full border-2 border-[rgb(var(--border))] px-8 py-3.5 text-base font-semibold transition-all duration-300 hover:bg-[rgb(var(--card))] hover:border-[rgb(var(--accent))] hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[rgb(var(--accent))]/30 active:scale-95">
                  Get in Touch
                </a>
              </div>
            </div>
            <div className="relative mx-auto md:ml-auto">
              <div className="float neon-edges glow-border h-48 w-48 md:h-56 md:w-56 rounded-full border-2 border-[rgb(var(--border))] bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-2xl flex items-center justify-center overflow-hidden relative hover:scale-105 transition-transform duration-500">
                <img src="/profile.png" alt="Marithea Magno" className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                <div className="pointer-events-none absolute inset-0 shimmer" style={{background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)'}} />
                <div className="pointer-events-none absolute -right-2 top-8 h-3 w-3 rounded-full animate-pulse shadow-lg" style={{background: 'linear-gradient(135deg, rgb(168 85 247), rgb(236 72 153))'}} />
                <div className="pointer-events-none absolute left-2 bottom-10 h-2 w-2 rounded-full animate-pulse shadow-md" style={{background: 'rgb(147 51 234)', animationDelay: '0.5s'}} />
              </div>
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-60 blur-3xl" style={{background: 'radial-gradient(closest-side, rgba(217,70,239,0.55), transparent 70%)'}} />
              <div className="pointer-events-none absolute -inset-4 rounded-full opacity-40 spin-slow">
                <div className="absolute top-1/2 -translate-y-1/2 right-0 h-2 w-2 rounded-full" style={{background: 'rgb(var(--accent))'}} />
              </div>
            </div>
          </div>
        </section>


        {/* About */}
        <section id="about" className="py-24">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">About Me</h2>
              <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
            </div>
            <div className="md:col-span-2 space-y-5 text-base leading-relaxed text-[rgb(var(--muted))]">
              <p>Hello! I am a third-year Information Technology student at St. Paul University Philippines, specializing in Web Development.</p>
              <p>My passion lies in building and understanding modern web technologies. I am currently enhancing my practical skills through a remote On-the-Job Training (OJT) program with Employability Advantage Australia. I am proficient in using Figma to create detailed wireframes and map out the structure for my web designs, ensuring a thoughtful and organized development process from concept to deployment.</p>
              <p>While web development is my core focus, I am also actively expanding my knowledge into the critical field of cybersecurity.</p>
              <p>In addition to my academic and training commitments, I take on freelance design commissions. I enjoy helping small businesses, particularly in the food industry, by creating visual materials such as posters and tarpaulins.</p>
            </div>
          </div>
        </section>

        {/* Strengths / Pillars */}
        <section className="py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="group relative rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-br from-[rgb(var(--card))] to-transparent p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[rgb(var(--accent))] dark:hover:shadow-purple-500/20">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="font-bold text-lg">Enterprise Experience</h3>
              <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">Learning to build secure, scalable systems and follow engineering best practices.</p>
            </div>
            <div className="group relative rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-br from-[rgb(var(--card))] to-transparent p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[rgb(var(--accent))] dark:hover:shadow-purple-500/20">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-lg">Global Perspective</h3>
              <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">Open to diverse teams and ideas; eager to collaborate and grow.</p>
            </div>
            <div className="group relative rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-br from-[rgb(var(--card))] to-transparent p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[rgb(var(--accent))] dark:hover:shadow-purple-500/20">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="font-bold text-lg">Team Leadership</h3>
              <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">Enjoys mentoring peers, organizing work, and sharing knowledge.</p>
            </div>
            <div className="group relative rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-br from-[rgb(var(--card))] to-transparent p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[rgb(var(--accent))] dark:hover:shadow-purple-500/20">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-bold text-lg">Performance Focus</h3>
              <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">Cares about clean code, performance, and measurable impact.</p>
            </div>
          </div>
        </section>

        {/* My Toolkit */}
        <section id="skills" className="py-24">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">My Toolkit & Expertise</h2>
              <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
              <p className="mt-4 text-base text-[rgb(var(--muted))]">Technologies, tools, and specialized systems I've built to solve real problems</p>
            </div>
            <div className="md:col-span-2 space-y-12">
              {/* Core Technologies */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold mb-6 text-purple-400">Core Technologies</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Next.js", desc: "React framework • SSR", logo: "svg-nextjs" as const },
                    { name: "Python", desc: "RAG systems • AI integration", logo: "svg-python" as const },
                    { name: "TypeScript", desc: "Type-safe development", logo: "svg-typescript" as const },
                    { name: "Tailwind CSS", desc: "Modern UI design", logo: "svg-tailwind" as const },
                    { name: "Laravel", desc: "PHP framework • APIs", logo: "svg-laravel" as const },
                    { name: "MySQL", desc: "Database design", logo: "svg-mysql" as const }
                  ].map((tech, i) => {
                    const logos: Record<string, React.ReactElement> = {
                      "svg-nextjs": <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5172 0C5.15053 0 0 5.15053 0 11.5172C0 17.8839 5.15053 23.0344 11.5172 23.0344C17.8839 23.0344 23.0344 17.8839 23.0344 11.5172C23.0344 5.15053 17.8839 0 11.5172 0ZM18.7133 19.4516C18.5977 19.6586 18.4244 19.8078 18.2245 19.8767C18.0246 19.9456 17.8079 19.9307 17.6175 19.8344L9.42384 15.2344V8.86895H10.6896V14.2517L17.7414 18.2069C17.9318 18.3032 18.0811 18.4765 18.15 18.6764C18.2189 18.8763 18.204 19.0931 18.1077 19.2835C18.0114 19.4738 17.8381 19.6231 17.6382 19.692C17.4383 19.7609 17.2216 19.746 17.0312 19.6497L9.42384 15.0497V8.0862H8.15808V16.3189L17.0312 21.5862C17.4119 21.8103 17.8839 21.7241 18.1655 21.3793C18.4472 20.9862 18.3793 20.4655 18.0517 20.1655L9.42384 14.931V7.3103H10.6896V13.7586L17.7414 17.7138C18.1221 17.9379 18.5941 17.8517 18.8758 17.5069C19.1574 17.1138 19.0896 16.593 18.7621 16.293Z"/></svg>,
                      "svg-python": <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.26-.02.2-.01h4.39l.41-.04.31-.08.29-.12.27-.16.24-.18.21-.19.17-.19.14-.19.1-.17.07-.15.04-.12.02-.1.01-.06V6.07l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.20.35-.14.33-.10.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V.77l.02-.13.04-.16.05-.15.08-.16.08-.17.09-.15.09-.14.1-.13.09-.11.1-.10.09-.08.08-.07.07-.06.06-.04.04-.04.03-.02.01-.01c0-.01 0-.01 0 0l.01.01.02.02.04.04.06.05.08.08.11.13.13.17.14.22.15.27.15.33.15.39.14.45.13.51.1.58.08.64.05.71.03.77-.01.84-.05.9-.08.95-.12.99-.15 1.01-.19 1.03-.22 1.03-.26 1.02-.29.99-.32.97-.35.93-.38.88-.4.84-.43.78-.45.72-.48.66-.5.6-.52.53-.54.47-.55.4-.56.34-.57.27-.57.2-.58.14-.57.08-.57.03-.56-.02-.55-.06-.54-.1-.52-.14-.5-.17-.48-.2-.45-.23-.43-.25-.4-.27-.37-.28-.34-.29-.3-.3-.27-.3-.23-.29-.2-.28-.15-.26-.12-.24-.08-.22-.05-.19-.02-.17.01-.14.03-.12.06-.09.08-.08.1-.06.12-.04.14-.02.16.01.18.03.2.06.21.1.23.13.24.17.25.2.26.24.27.28.27.31.28.35.28.38.28.42.28.45.27.49.26.52.25.56.24.59.22.62.21.65.19.68.17.7.15.73.13.75.11.77.09.78.06.8.04.81.02.82-.01.83-.03.83-.05.84-.08.83-.1.83-.13.82-.15.8-.18.79-.2.77-.23.75-.26.72-.28.7-.31.67-.34.63-.37.6-.4.56-.43.52-.46.48-.5.43-.53.39-.56.34-.6.29-.63.24-.66.2-.7.14-.73.09-.76.04-.8-.01-.83-.06-.86-.12-.88-.17-.91-.23-.93-.28-.96-.34-.97-.4-.99-.45-1.01-.5-1.02-.56-1.03-.61-1.04-.67-1.04-.72-1.04-.78-1.04-.83-1.03-.88-1.02-.94-1-.99-.98-1.05-.95-1.1-.92-1.15-.88-1.2-.85-1.25-.8-1.3-.76-1.34-.71-1.38-.67-1.42-.62-1.45-.58-1.49-.53-1.52-.48-1.54-.44-1.57-.39-1.59-.34-1.61-.29-1.63-.24-1.64-.19-1.66-.14-1.67-.09-1.67-.04-1.68.01-1.68.06-1.68.11-1.67.16-1.67.21-1.66.26-1.65.31-1.63.36-1.62.41-1.6.46-1.58.51-1.56.56-1.53.61-1.51.66-1.48.71-1.45.76-1.41.8-1.38.85-1.34.9-1.3.94-1.26.99-1.21 1.03-1.17 1.08-1.12 1.12-1.07 1.16-1.02 1.2-.97 1.24-.92 1.28-.87 1.31-.82 1.35-.76 1.38-.71 1.41-.66 1.44-.6 1.47-.55 1.49-.49 1.52-.44 1.54-.38 1.55-.33 1.57-.27 1.58-.22 1.6-.16 1.61-.11 1.61-.05 1.62.01 1.62.07 1.62.12 1.61.18 1.61.24 1.6.29 1.58.35 1.57.4 1.55.46 1.53.51 1.51.57 1.48.62 1.45.67 1.42.73 1.38.78 1.34.83 1.3.88 1.25.93 1.2.98 1.15 1.02 1.1 1.07 1.04 1.11.98 1.15.92 1.19.86 1.23.8 1.26.73 1.29.67 1.32.6 1.35.54 1.37.47 1.4.4 1.42.34 1.44.27 1.45.2 1.47.13 1.48.07 1.49-.01 1.49-.08 1.5-.15 1.5-.22 1.5-.29 1.5-.36 1.49-.43 1.48-.5 1.47-.57 1.46-.64 1.44-.71 1.42-.78 1.4-.85 1.37-.91 1.35-.98 1.32-1.05 1.28-1.11 1.25-1.18 1.21-1.24 1.17-1.3 1.12-1.37 1.07-1.43 1.02-1.49.97-1.54.91-1.6.86-1.65.8-1.7.74-1.75.68-1.8.62-1.84.56-1.88.5-1.92.43-1.96.37-2 .31-2.03.24-2.06.18-2.09.11-2.11.05-2.13-.02-2.15-.08-2.17-.15-2.18-.21-2.19-.28-2.2-.34-2.2-.4-2.21-.47-2.21-.53-2.21-.59-2.2-.65-2.19-.71-2.18-.77-2.16-.83-2.15-.88-2.13-.94-2.1-1-2.07-1.05-2.04-1.1-2.01-1.15-1.97-1.2-1.93-1.25-1.89-1.29-1.84-1.34-1.8-1.38-1.75-1.42-1.7-1.46-1.64-1.5-1.59-1.53-1.53-1.56-1.47-1.6-1.41-1.62-1.35-1.65-1.28-1.67-1.22-1.7-1.15-1.71-1.08-1.73-1.01-1.74-.94-1.75-.87-1.76-.79-1.77-.72-1.78-.64-1.78-.57-1.79-.49-1.79-.41-1.79-.34-1.79-.26-1.78-.18-1.78-.1-1.77-.03-1.76.05-1.75.13-1.74.2-1.72.28-1.71.36-1.69.43-1.67.51-1.65.58-1.62.65-1.6.73-1.57.8-1.54.87-1.51.94-1.47 1.01-1.44 1.08-1.4 1.14-1.36 1.21-1.31 1.27-1.27 1.33-1.22 1.39-1.18 1.45-1.13 1.5-1.08 1.55-1.02 1.6-.97 1.65-.91 1.69-.86 1.73-.8 1.77-.74 1.81-.68 1.84-.62 1.87-.55 1.9-.49 1.92-.42 1.95-.35 1.97-.28 1.99-.21 2.01-.14 2.02-.07 2.04.01 2.05.08 2.06.15 2.06.22 2.07.29 2.07.36 2.06.43 2.06.5 2.05.57 2.04.63 2.02.7 2.01.76 1.99.83 1.96.89 1.94.95 1.91 1.01 1.88 1.07 1.84 1.12 1.81 1.18 1.77 1.23 1.73 1.28 1.68 1.33 1.64 1.38 1.59 1.42 1.54 1.47 1.49 1.51 1.43 1.55 1.38 1.59 1.32 1.63 1.26 1.66 1.2 1.69 1.13 1.72 1.07 1.75 1 1.77.93 1.79.86 1.81.79 1.82.72 1.84.64 1.85.57 1.86.49 1.86.42 1.87.34 1.87.26 1.86.18 1.86.1 1.85.02 1.85-.06 1.84-.14 1.82-.22 1.81-.3 1.79-.38 1.77-.45 1.75-.53 1.72-.6 1.7-.68 1.67-.75 1.64-.82 1.6-.89 1.57-.96 1.53-1.03 1.49-1.09 1.45-1.16 1.4-1.22 1.35-1.28 1.3-1.34 1.25-1.4 1.19-1.45 1.13-1.51 1.07-1.56 1.01-1.61.94-1.66.88-1.7.81-1.75.74-1.79.67-1.83.6-1.86.52-1.9.45-1.93.37-1.96.29-1.99.21-2.01.13-2.04.05-2.06-.03-2.08-.11-2.1-.19-2.11-.27-2.13-.35-2.14-.43-2.15-.51-2.16-.58-2.16-.66-2.16-.74-2.16-.81-2.16-.89-2.15-.96-2.14-1.04-2.13-1.11-2.11-1.18-2.09-1.25-2.07-1.32-2.05-1.39-2.02-1.45-1.99-1.52-1.96-1.58-1.93-1.64-1.89-1.7-1.85-1.75-1.81-1.81-1.77-1.86-1.72-1.91-1.68-1.96-1.63-2.01-1.58-2.05-1.52-2.1-1.47-2.14-1.41-2.18-1.36-2.21-1.3-2.25-1.24-2.28-1.17-2.31-1.11-2.34-1.04-2.36-.98-2.39-.91-2.41-.84-2.43-.77-2.44-.7-2.46-.62-2.47-.55-2.48-.47-2.48-.4-2.49-.32-2.49-.24-2.49-.16-2.48-.08-2.48 0-2.47.08-2.46.16-2.45.24-2.44.32-2.42.4-2.4.47-2.38.55-2.36.62-2.33.7-2.31.77-2.28.84-2.25.91-2.21.98-2.18 1.04-2.14 1.11-2.1 1.17-2.05 1.24-2.01 1.3-1.96 1.36-1.91 1.41-1.86 1.47-1.81 1.52-1.75 1.58-1.7 1.63-1.64 1.68-1.58 1.72-1.52 1.77-1.45 1.81-1.39 1.85-1.32 1.89-1.25 1.93-1.18 1.96-1.11 1.99-1.04 2.02-.96 2.05-.89 2.07-.81 2.09-.74 2.11-.66 2.13-.58 2.14-.51 2.15-.43 2.16-.35 2.16-.27 2.16-.19 2.16-.11 2.16-.03 2.15.05 2.14.13 2.13.21 2.11.29 2.1.37 2.08.45 2.06.52 2.04.6 2.01.67 1.99.74 1.96.81 1.93.88 1.9.94 1.86 1.01 1.83 1.07 1.79 1.13 1.75 1.19 1.7 1.25 1.66 1.3 1.61 1.36 1.56 1.41 1.51 1.45 1.45 1.5 1.4 1.54 1.34 1.58 1.28 1.62 1.22 1.66 1.16 1.69 1.09 1.72 1.03 1.75.96 1.77.89 1.79.82 1.81.75 1.82.68 1.84.6 1.85.53 1.86.45 1.86.38 1.87.3 1.87.22 1.86.14 1.86.06 1.85-.02 1.85-.1 1.84-.18 1.82-.26 1.81-.34 1.79-.42 1.77-.49 1.75-.57 1.72-.64 1.7-.72 1.67-.79 1.64-.86 1.6-.93 1.57-1 1.53-1.07 1.49-1.13 1.45-1.2 1.4-1.26 1.35-1.32 1.3-1.38 1.25-1.44 1.19-1.49 1.13-1.55 1.07-1.6 1.01-1.65.94-1.7.88-1.74.81-1.79.74-1.83.67-1.86.6-1.9.52-1.93.45-1.96.37-1.99.29-2.01.21-2.04.13-2.06.05-2.08-.03-2.1-.11-2.11-.19-2.13-.27-2.14-.35-2.15-.43-2.16-.51-2.16-.58-2.16-.66-2.16-.74-2.16-.81-2.15-.89-2.14-.96-2.13-1.04-2.11-1.11-2.09-1.18-2.07-1.25-2.05-1.32-2.02-1.39-1.99-1.45-1.96-1.52-1.93-1.58-1.89-1.64-1.85-1.7-1.81-1.75-1.77-1.81-1.72-1.86-1.68-1.91-1.63-1.96-1.58-2.01-1.52-2.05-1.47-2.1-1.41-2.14-1.36-2.18-1.3-2.21-1.24-2.25-1.17-2.28-1.11-2.31-1.04-2.34-.98-2.36-.91-2.39-.84-2.41-.77-2.43-.7-2.44-.62-2.46-.55-2.47-.47-2.48-.4-2.48-.32-2.49-.24-2.49-.16-2.48-.08-2.48 0-2.47.08-2.46.16-2.45.24-2.44.32-2.42.4-2.4.47-2.38.55-2.36.62-2.33.7-2.31.77-2.28.84-2.25.91-2.21.98-2.18 1.04-2.14 1.11-2.1 1.17-2.05 1.24-2.01 1.3-1.96 1.36-1.91 1.41-1.86 1.47-1.81 1.52-1.75 1.58-1.7 1.63-1.64 1.68-1.58 1.72-1.52 1.77-1.45 1.81-1.39 1.85-1.32 1.89-1.25 1.93-1.18 1.96-1.11 1.99-1.04 2.02-.96 2.05-.89 2.07-.81 2.09-.74 2.11-.66 2.13-.58 2.14-.51 2.15-.43 2.16-.35 2.16-.27 2.16-.19 2.16-.11 2.16-.03 2.15.05 2.14.13 2.13.21 2.11.29 2.1.37 2.08.45 2.06.52 2.04.6 2.01.67 1.99.74 1.96.81 1.93.88 1.9.94 1.86 1.01 1.83 1.07 1.79 1.13 1.75 1.19 1.7 1.25 1.66 1.3 1.61 1.36 1.56 1.41 1.51 1.45 1.45 1.5 1.4 1.54 1.34 1.58 1.28 1.62 1.22 1.66 1.16 1.69 1.09 1.72 1.03 1.75.96 1.77.89 1.79.82 1.81.75 1.82.68 1.84.6 1.85.53 1.86.45 1.86.38 1.87.3 1.87.22 1.86.14 1.86.06 1.85-.02 1.85-.1 1.84-.18 1.82-.26 1.81-.34 1.79-.42 1.77-.49 1.75-.57 1.72-.64 1.7-.72 1.67-.79 1.64-.86 1.6-.93 1.57-1 1.53-1.07 1.49-1.13 1.45-1.2 1.4-1.26 1.35-1.32 1.3-1.38 1.25-1.44 1.19-1.49 1.13-1.55 1.07-1.6 1.01-1.65.94-1.7.88-1.74.81-1.79.74-1.83.67-1.86.6-1.9.52-1.93.45-1.96.37-1.99.29-2.01.21-2.04.13-2.06.05-2.08-.03-2.1-.11-2.11-.19-2.13-.27-2.14-.35-2.15-.43-2.16-.51-2.16-.58-2.16-.66-2.16-.74-2.16-.81-2.15-.89-2.14-.96-2.13-1.04-2.11-1.11-2.09-1.18-2.07-1.25-2.05-1.32-2.02-1.39-1.99-1.45-1.96-1.52-1.93-1.58-1.89-1.64-1.85-1.7-1.81-1.75-1.77-1.81-1.72-1.86-1.68-1.91-1.63-1.96-1.58-2.01-1.52-2.05-1.47-2.1-1.41-2.14-1.36-2.18-1.3-2.21-1.24-2.25-1.17-2.28-1.11-2.31-1.04-2.34-.98-2.36-.91-2.39-.84-2.41-.77-2.43-.7-2.44-.62-2.46-.55-2.47-.47-2.48-.4-2.48-.32-2.49-.24-2.49-.16-2.48-.08-2.48"/></svg>,
                      "svg-typescript": <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#3178c6"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>,
                      "svg-tailwind": <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#06b6d4"><path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/></svg>,
                      "svg-laravel": <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#FF2D20"><path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.02c-.01.003-.02.005-.032.005-.01 0-.02-.002-.03-.005a.33.33 0 01-.067-.02L.707 18.755a.378.378 0 01-.188-.326V9.584a.372.372 0 01.014-.1.289.289 0 01.023-.078l.008-.01c.008-.01.018-.02.03-.028a.409.409 0 01.096-.065l4.674-2.676a.369.369 0 01.354-.007L9.930.49a.378.378 0 01.188-.326c.113-.065.249-.065.362 0L19.51.49a.378.378 0 01.188.326v9.584l-2.29 1.31V9.584a.372.372 0 01.014-.1.289.289 0 01.023-.078l.008-.01c.008-.01.018-.02.03-.028a.409.409 0 01.096-.065l4.674-2.676a.369.369 0 01.354-.007l4.674 2.676c.113.064.188.189.188.326z"/></svg>,
                      "svg-mysql": <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#4479A1"><path d="M5.615 13.944c-.634 0-1.17.085-1.608.255a2.685 2.685 0 00-1.156.765c-.297.34-.445.765-.445 1.276 0 .425.106.765.318 1.02.213.255.51.425.893.51.382.085.808.128 1.276.128.468 0 .893-.043 1.276-.128.382-.085.68-.255.893-.51.212-.255.318-.595.318-1.02 0-.511-.148-.936-.445-1.276a2.685 2.685 0 00-1.156-.765c-.437-.17-.973-.255-1.608-.255zm9.542 0c-.638 0-1.174.085-1.608.255a2.685 2.685 0 00-1.156.765c-.297.34-.445.765-.445 1.276 0 .425.106.765.318 1.02.213.255.51.425.893.51.382.085.808.128 1.276.128.467 0 .893-.043 1.276-.128.382-.085.68-.255.893-.51.212-.255.318-.595.318-1.02 0-.511-.148-.936-.445-1.276a2.685 2.685 0 00-1.156-.765c-.437-.17-.973-.255-1.608-.255zm-3.828 1.701c-.382 0-.68.128-.893.383-.212.255-.318.595-.318 1.02 0 .425.106.765.318 1.02.213.255.51.383.893.383.382 0 .68-.128.893-.383.212-.255.318-.595.318-1.02 0-.425-.106-.765-.318-1.02-.213-.255-.51-.383-.893-.383z"/></svg>
                    };
                    return (
                      <div key={i} className="group relative flex items-center gap-4 rounded-xl border border-[rgb(var(--border))] bg-gradient-to-br from-white/90 to-gray-50/70 dark:from-[rgb(var(--card))] dark:to-transparent p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-[rgb(var(--accent))]/30 hover:border-[rgb(var(--accent))]/60">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-purple-500/10 dark:to-purple-500/5 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400 shadow-md">
                          {logos[tech.logo]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white text-base">{tech.name}</div>
                          <div className="text-sm text-gray-600 dark:text-[rgb(var(--muted))] mt-1 leading-relaxed">{tech.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specialized Tools */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold mb-6 text-emerald-400">Specialized Tools I've Built</h3>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="group relative p-6 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 dark:from-emerald-500/8 dark:to-transparent shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md">
                        <div className="h-6 w-6 rounded-sm bg-white/90" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">MCP Server (7 Tools)</h4>
                    </div>
                    <p className="text-sm text-[rgb(var(--muted))] mb-2">FastAPI server with portfolio queries, interview Q&A, and RAG search</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">Python</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">FastAPI</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">RAG</span>
                    </div>
                  </div>
                  <div className="group relative p-6 rounded-xl border-2 border-purple-200/50 dark:border-purple-500/30 bg-gradient-to-br from-purple-50/80 to-purple-100/40 dark:from-purple-500/8 dark:to-transparent shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                        <div className="h-6 w-6 rounded-sm bg-white/90" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Digital Twin RAG System</h4>
                    </div>
                    <p className="text-sm text-[rgb(var(--muted))] mb-2">AI assistant with 20 embedded profile chunks and intelligent responses</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30">Groq API</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30">LLaMA 3.3</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30">Embeddings</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Design Tools */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-pink-400">Design & Creative Tools</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { name: "Figma", desc: "UI/UX prototyping • 5+ apps designed", icon: "F" },
                    { name: "Adobe Suite", desc: "Photoshop • Poster commissions", icon: "Aa" }
                  ].map((tool, i) => (
                    <div key={i} className="group relative flex items-center gap-4 rounded-xl border border-[rgb(var(--border))] bg-gradient-to-br from-white/90 to-pink-50/40 dark:from-[rgb(var(--card))] dark:to-transparent p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-pink-500/30 hover:border-pink-500/60">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-500/20 dark:to-pink-500/10 flex items-center justify-center flex-shrink-0 text-pink-600 dark:text-pink-400 font-bold text-lg shadow-md">
                        {tool.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white text-base">{tool.name}</div>
                        <div className="text-sm text-gray-600 dark:text-[rgb(var(--muted))] mt-1 leading-relaxed">{tool.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="py-24 relative">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-20 h-[36vh] w-[50vw] -translate-x-1/2 rounded-full blur-3xl opacity-25" style={{background: 'radial-gradient(closest-side, rgba(168,85,247,0.5), transparent 70%)'}} />
          <div className="mx-auto w-full max-w-[1400px]">
            <div className="mb-12 px-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Experience</h2>
              <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
              <p className="mt-4 text-base text-[rgb(var(--muted))]">Selected academic and personal projects showcasing my growth</p>
            </div>
            <div id="projects" className="sr-only" aria-hidden></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <article className="group h-full rounded-xl border border-[rgb(var(--border))] bg-gradient-to-br from-white/95 to-gray-50/70 dark:from-[rgb(var(--card))] dark:to-transparent p-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:ring-2 hover:ring-[rgb(var(--accent))]/30 dark:glow-border flex flex-col overflow-hidden">
                  <picture>
                    <source srcSet="/screenshots/Screenshot%202025-11-01%20134246.png" type="image/png" />
                    <img src="/screenshots/Screenshot%202025-11-01%20134246.png" alt="Student Portal (PHP + MySQL)" className="aspect-video w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
                  </picture>
                  <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Student Portal — Native PHP + MySQL</h3>
                  <p className="mt-3 text-sm text-gray-700 dark:text-[rgb(var(--muted))] leading-relaxed">Web app allowing students to view assigned teachers and grades with role-based access.</p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-[rgb(var(--muted))] leading-relaxed">
                    <li><span className="font-medium text-gray-800 dark:text-gray-300">Roles:</span> Admin, Teacher, Student</li>
                    <li>Admin manages users, teacher-student assignments, and grade entries</li>
                    <li>Teachers submit/update grades for their assigned students</li>
                    <li>Students sign in to view assigned teacher(s) and current grades</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30 transition-colors">PHP</span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30 transition-colors">MySQL</span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30 transition-colors">Auth</span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30 transition-colors">RBAC</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <a href="https://github.com/TheaMarieM/3rdyear/tree/main/SIM" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-[rgb(var(--border))] px-3 py-1.5 hover:bg-[rgb(var(--card))]">GitHub</a>
                  </div>
                  </div>
                </article>

                <article className="group h-full rounded-xl border border-[rgb(var(--border))] bg-gradient-to-br from-white/95 to-gray-50/70 dark:from-[rgb(var(--card))] dark:to-transparent p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:ring-2 hover:ring-[rgb(var(--accent))]/30 dark:glow-border flex flex-col">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Digital Twin RAG Portfolio — Next.js</h3>
                  <p className="mt-3 text-sm text-gray-700 dark:text-[rgb(var(--muted))] leading-relaxed">Retrieval-Augmented Generation system answering recruiter-style questions using STAR-structured profile data.</p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-[rgb(var(--muted))] leading-relaxed">
                    <li>STAR-structured profile, embeddings, cosine retrieval</li>
                    <li>Real-time responses with groundedness and coverage scoring</li>
                    <li>Docs and testing pages with 20+ sample queries</li>
                  </ul>
                  <div className="mt-auto pt-4 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30 transition-colors">RAG</span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 transition-colors">Embeddings</span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30 transition-colors">OpenAI</span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30 transition-colors">Next.js API</span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30 transition-colors">Quality scoring</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <a href="/rag" className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 text-white font-medium shadow-md hover:shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200">Try RAG</a>
                    <a href="/about" className="inline-flex items-center rounded-lg border-2 border-gray-300 dark:border-[rgb(var(--border))] px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-[rgb(var(--card))] transition-all duration-200">About</a>
                    <a href="/testing" className="inline-flex items-center rounded-lg border-2 border-gray-300 dark:border-[rgb(var(--border))] px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-[rgb(var(--card))] transition-all duration-200">Testing</a>
                    <a href="/profile-data" className="inline-flex items-center rounded-lg border-2 border-gray-300 dark:border-[rgb(var(--border))] px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-[rgb(var(--card))] transition-all duration-200">Profile Data</a>
                  </div>
                </article>

                <article className="group h-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-0 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-[rgb(var(--accent))]/30 flex flex-col overflow-hidden">
                  <picture>
                    <source srcSet="/screenshots/Screenshot%202025-11-01%20133305.png" type="image/png" />
                    <img src="/screenshots/Screenshot%202025-11-01%20133305.png" alt="Person Search App — Next.js" className="aspect-video w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
                  </picture>
                  <div className="p-5">
                    <h3 className="font-semibold">Person Search App — Next.js</h3>
                    <p className="mt-2 text-sm text-[rgb(var(--muted))]">Full-stack app to create, search, and manage person records with authentication and theme toggle.</p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--muted))]">
                      <li>Auth-protected CRUD (create, read, update, delete) for people</li>
                      <li>Instant search with filters; JSON API endpoints</li>
                      <li>Dark/Light mode system with persisted preference</li>
                      <li>Database integration via Prisma ORM</li>
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-purple-300"><span>▲</span> Next.js</span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-blue-300"><span>◈</span> Tailwind</span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-yellow-300"><span>P</span> Prisma</span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-green-300"><span>🔐</span> Auth</span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-indigo-300"><span>J</span> JSON API</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <a href="https://github.com/TheaMarieM/person-search-app" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-[rgb(var(--border))] px-3 py-1.5 hover:bg-[rgb(var(--card))]">GitHub</a>
                    </div>
                  </div>
                </article>

                <article className="group h-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-0 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-[rgb(var(--accent))]/30 flex flex-col overflow-hidden">
                  <picture>
                    <source srcSet="/screenshots/Screenshot%202025-11-01%20133942.png" type="image/png" />
                    <img src="/screenshots/Screenshot%202025-11-01%20133942.png" alt="Movie Reviews — Laravel" className="aspect-video w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
                  </picture>
                  <div className="p-5">
                    <h3 className="font-semibold">Movie Reviews — Laravel</h3>
                    <p className="mt-2 text-sm text-[rgb(var(--muted))]">CRUD movie reviews with poster URL upload and star-based rating UI.</p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--muted))]">
                      <li>Create, view, update, and delete reviews</li>
                      <li>Attach poster via URL with validation</li>
                      <li>Rate movies using a 1–5 star badge component</li>
                      <li>Search/filter by title and rating</li>
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-red-300"><span>L</span> Laravel</span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-300"><span>B</span> Blade</span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-cyan-300"><span>⚙</span> CRUD</span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-yellow-300"><span>⭐</span> Ratings</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <a href="https://github.com/TheaMarieM/Quiz_laravel1" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-[rgb(var(--border))] px-3 py-1.5 hover:bg-[rgb(var(--card))]">GitHub</a>
                    </div>
                  </div>
                </article>

                <article className="group h-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col">
                  <h3 className="font-semibold">Academic & Project Work</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--muted))]">
                    <li>Built small web projects to practice semantic HTML, CSS, and JavaScript.</li>
                    <li>Exploring responsive design, accessibility, and performance basics.</li>
                    <li>Collaborating on class/team exercises to solve real problems.</li>
                  </ul>
                </article>
                
                <article className="group h-full rounded-xl border border-[rgb(var(--border))] bg-gradient-to-br from-white/95 to-gray-50/70 dark:from-[rgb(var(--card))] dark:to-transparent p-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:ring-2 hover:ring-[rgb(var(--accent))]/30 flex flex-col overflow-hidden">
                  <picture>
                    <source srcSet="/screenshots/Screenshot%202025-11-01%20135052.png" type="image/png" />
                    <img src="/screenshots/Screenshot%202025-11-01%20135052.png" alt="Community Health Monitoring System" className="aspect-video w-full object-cover" />
                  </picture>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Community Health Monitoring System</h3>
                    <p className="mt-3 text-sm text-gray-700 dark:text-[rgb(var(--muted))] leading-relaxed">System used by nursing students to digitize community health records and make outputs paperless. Built as a requirement for a major subject.</p>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-[rgb(var(--muted))] leading-relaxed">
                      <li>Digital forms for assessments and visits</li>
                      <li>Student accounts to submit and manage outputs</li>
                      <li>Instructor view for review/verification</li>
                      <li>Exports and summaries to replace paper workflows</li>
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30 transition-colors">Paperless</span>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30 transition-colors">Student Use</span>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30 transition-colors">Major Subject</span>
                    </div>
                  </div>
                </article>
            </div>
          </div>
        </section>

        {/* Design & UI Showcase */}
        <section id="designs" className="py-24">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Design & UI Showcase</h2>
              <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
            </div>
            <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--accent))] hover:gap-3 transition-all duration-300 group">
              <span>Work with me</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <img src="/adobe.svg" alt="Adobe" className="h-5 w-5" />
                <h3 className="font-semibold">Adobe Edits</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {[
                  { src: "/designs/2Shawarma_tarpulin.png", alt: "Shawarma tarpulin design", caption: "Tarpulin design (commission)", tags: ["Poster", "Commission"] },
                  { src: "/designs/Artboard%201.png", alt: "Artboard design", caption: "Artboard graphic", tags: ["Graphic"] },
                  { src: "/designs/JUICE%20(50%20x%2030%20in).png", alt: "JUICE poster 50x30 in", caption: "Poster concept", tags: ["Poster"] },
                  { src: "/designs/chess_poster%20(2).png", alt: "Chess poster", caption: "Chess poster", tags: ["Poster"] },
                  { src: "/designs/lebron-james.png", alt: "LeBron James edit", caption: "Photo edit", tags: ["Photo"] },
                  { src: "/designs/spiderman-1.png", alt: "Spiderman poster", caption: "Fan poster", tags: ["Poster", "Fan"] },
                ].map((d, i) => (
                  <figure key={i} className="group overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-[rgb(var(--accent))]/40 dark:glow-border">
                    <img onClick={() => setLightbox({ src: d.src, alt: d.alt })} src={d.src} alt={d.alt} loading="lazy" className="aspect-[4/3] w-full cursor-zoom-in object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
                    <figcaption className="px-3 pt-2 text-xs text-[rgb(var(--muted))]">{d.caption}</figcaption>
                    <div className="px-3 pb-3 pt-1 flex flex-wrap gap-1">
                      {d.tags.map((t) => (
                        <span key={t} className="rounded-md border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">{t}</span>
                      ))}
                    </div>
                  </figure>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <img src="/figma.svg" alt="Figma" className="h-5 w-5" />
                <h3 className="font-semibold">Figma UI</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <figure className="group overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft hover:ring-1 hover:ring-[rgb(var(--accent))]/30">
                  <img onClick={() => setLightbox({ src: '/designs/Screenshot%202025-11-01%20152235.png', alt: 'Social commerce app UI' })} src="/designs/Screenshot%202025-11-01%20152235.png" alt="Social commerce app UI" className="aspect-[4/3] w-full cursor-zoom-in object-cover transition-transform duration-300 ease-out group-hover:scale-105" loading="lazy" />
                  <figcaption className="px-3 pt-2 text-xs text-[rgb(var(--muted))]">Social commerce app</figcaption>
                  <div className="px-3 pb-3 pt-1">
                    <a href="https://www.figma.com/proto/8pkJ2m7Nqol0oB7dZU2png/HCI?page-id=0%3A1&node-id=79-848&starting-point-node-id=79%3A266&scaling=scale-down&content-scaling=fixed&show-proto-sidebar=1&t=hMjiYB5PJn5h6Rov-1" target="_blank" rel="noreferrer" className="text-xs text-[rgb(var(--accent))] hover:underline glow-focus">View Prototype</a>
                  </div>
                  <div className="px-3 pb-3 -mt-2 flex flex-wrap gap-1">
                    <span className="rounded-md border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">Prototype</span>
                    <span className="rounded-md border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">Mobile</span>
                  </div>
                </figure>
                <figure className="group overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-[rgb(var(--accent))]/40 dark:glow-border">
                  <img onClick={() => setLightbox({ src: '/designs/Screenshot%202025-11-01%20152251.png', alt: 'Accessible website (PWD) UI' })} src="/designs/Screenshot%202025-11-01%20152251.png" alt="Accessible website for persons with disabilities UI" className="aspect-[4/3] w-full cursor-zoom-in object-cover transition-transform duration-300 ease-out group-hover:scale-105" loading="lazy" />
                  <figcaption className="px-3 pt-2 text-xs text-[rgb(var(--muted))]">Accessible website (PWD)</figcaption>
                  <div className="px-3 pb-3 pt-1">
                    <a href="https://www.figma.com/proto/lggl4UiEvK9GX3cwBKJKGL/Website_Disabled_mmm?node-id=0-1&t=buCsVGb2wJ1aeVLx-1" target="_blank" rel="noreferrer" className="text-xs text-[rgb(var(--accent))] hover:underline glow-focus">View Prototype</a>
                  </div>
                  <div className="px-3 pb-3 -mt-2 flex flex-wrap gap-1">
                    <span className="rounded-md border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">Prototype</span>
                    <span className="rounded-md border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">Web</span>
                  </div>
                </figure>
                <figure className="group overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-[rgb(var(--accent))]/40 dark:glow-border">
                  <img onClick={() => setLightbox({ src: '/designs/Screenshot%202025-11-01%20152330.png', alt: 'Health tracking app UI' })} src="/designs/Screenshot%202025-11-01%20152330.png" alt="Health tracking app UI" className="aspect-[4/3] w-full cursor-zoom-in object-cover transition-transform duration-300 ease-out group-hover:scale-105" loading="lazy" />
                  <figcaption className="px-3 pt-2 text-xs text-[rgb(var(--muted))]">Health tracking app</figcaption>
                  <div className="px-3 pb-3 pt-1">
                    <a href="https://www.figma.com/proto/OwDlJTnaY4hYx2NAGP7NBR/HCI_Calorie_App?node-id=43-118&t=Tb3XmBcKW8eyzWEW-1&starting-point-node-id=42%3A12" target="_blank" rel="noreferrer" className="text-xs text-[rgb(var(--accent))] hover:underline glow-focus">View Prototype</a>
                  </div>
                  <div className="px-3 pb-3 -mt-2 flex flex-wrap gap-1">
                    <span className="rounded-md border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">Prototype</span>
                    <span className="rounded-md border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">Mobile</span>
                  </div>
                </figure>
                <figure className="group overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-[rgb(var(--accent))]/40 dark:glow-border">
                  <img onClick={() => setLightbox({ src: '/designs/Screenshot%202025-11-01%20153154.png', alt: 'System layout UI (CRUD JPCS)' })} src="/designs/Screenshot%202025-11-01%20153154.png" alt="System layout UI (CRUD JPCS)" className="aspect-[4/3] w-full cursor-zoom-in object-cover transition-transform duration-300 ease-out group-hover:scale-105" loading="lazy" />
                  <figcaption className="px-3 pt-2 text-xs text-[rgb(var(--muted))]">System layout (CRUD JPCS)</figcaption>
                  <div className="px-3 pb-3 pt-1">
                    <a href="https://www.figma.com/proto/2xpERC0OTnaWD6WiFYhMki/CRUD-JPCS?page-id=0%3A1&node-id=2013-127&p=f&viewport=1048%2C-788%2C0.29&t=uePPYz6XSRPcbECg-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=2013%3A127" target="_blank" rel="noreferrer" className="text-xs text-[rgb(var(--accent))] hover:underline glow-focus">View Prototype</a>
                  </div>
                  <div className="px-3 pb-3 -mt-2 flex flex-wrap gap-1">
                    <span className="rounded-md border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">Prototype</span>
                    <span className="rounded-md border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">Web</span>
                  </div>
                </figure>
                <figure className="group overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft hover:ring-1 hover:ring-[rgb(var(--accent))]/30">
                  <img onClick={() => setLightbox({ src: '/designs/Screenshot%202025-11-01%20154023.png', alt: 'Community website UI' })} src="/designs/Screenshot%202025-11-01%20154023.png" alt="Community website UI" className="aspect-[4/3] w-full cursor-zoom-in object-cover transition-transform duration-300 ease-out group-hover:scale-105" loading="lazy" />
                  <figcaption className="px-3 pt-2 text-xs text-[rgb(var(--muted))]">Community website</figcaption>
                  <div className="px-3 pb-3 pt-1">
                    <a href="https://www.figma.com/proto/lggl4UiEvK9GX3cwBKJKGL/Community_mmm?page-id=3%3A2&node-id=75-1547&starting-point-node-id=63%3A60&scaling=min-zoom&content-scaling=fixed&t=gJ49UbgK6rzA6Crd-1" target="_blank" rel="noreferrer" className="text-xs text-[rgb(var(--accent))] hover:underline">View Prototype</a>
                  </div>
                  <div className="px-3 pb-3 -mt-2 flex flex-wrap gap-1">
                    <span className="rounded-md border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">Prototype</span>
                    <span className="rounded-md border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]">Web</span>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="py-24">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Featured Projects</h2>
              <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
            </div>
            <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--accent))] hover:gap-3 transition-all duration-300 group">
              <span>Work with me</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Person Search App */}
            <div className="rounded-xl bg-gradient-to-r from-pink-500/30 to-sky-500/30 p-[1px]">
            <article className="group rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft transition hover:-translate-y-0.5 hover:ring-1 hover:ring-[rgb(var(--accent))]/30">
              <picture>
                <source srcSet="/screenshots/Screenshot%202025-11-01%20133305.png" type="image/png" />
                <img src="/screenshots/Screenshot%202025-11-01%20133305.png" alt="Person Search App" className="aspect-video w-full rounded-lg object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
              </picture>
              <h3 className="mt-4 text-lg font-semibold">Person Search App (Auth)</h3>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">Auth-protected CRUD with instant search, dark/light mode, Prisma, Next.js, and Tailwind.</p>
              <div className="mt-3 flex gap-3 text-sm">
                <a className="text-[rgb(var(--accent))] hover:underline" href="https://github.com/TheaMarieM/person-search-app" target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </article>
            </div>
            {/* Movie Reviews (Laravel) */}
            <div className="rounded-xl bg-gradient-to-r from-pink-500/30 to-sky-500/30 p-[1px]">
            <article className="group rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft transition hover:-translate-y-0.5 hover:ring-1 hover:ring-[rgb(var(--accent))]/30">
              <picture>
                <source srcSet="/screenshots/Screenshot%202025-11-01%20133942.png" type="image/png" />
                <img src="/screenshots/Screenshot%202025-11-01%20133942.png" alt="Movie Reviews (Laravel)" className="aspect-video w-full rounded-lg object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
              </picture>
              <h3 className="mt-4 text-lg font-semibold">Movie Reviews (Laravel)</h3>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">CRUD reviews, poster via URL, star ratings, and filters.</p>
              <div className="mt-3 flex gap-3 text-sm">
                <a className="text-[rgb(var(--accent))] hover:underline" href="https://github.com/TheaMarieM/Quiz_laravel1" target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </article>
            </div>
          </div>
        </section>

        {/* Chat with my AI - Enhanced */}
        <section id="ai" className="py-20 relative">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[40vh] w-[60vw] -translate-x-1/2 rounded-full blur-3xl opacity-20" style={{background: 'radial-gradient(closest-side, rgba(217,70,239,0.6), transparent 70%)'}} />
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs shadow-soft">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  <span className="text-[rgb(var(--muted))]">AI Online</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold">Chat with my Digital Twin</h2>
                <div className="mt-2 h-1 w-16 rounded bg-gradient-to-r from-pink-500 to-sky-500"></div>
                <p className="mt-4 text-sm text-[rgb(var(--muted))]">
                  Powered by <span className="font-semibold text-[rgb(var(--accent))]">Groq + LLaMA 3.3</span>
                </p>
                <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                  Ask me about my skills, experience, projects, challenges, or anything else!
                </p>
                
                {/* Quick prompts */}
                <div className="mt-6 space-y-2">
                  <p className="text-xs font-medium text-purple-400">Quick Questions:</p>
                  {[
                    "What are your key skills?",
                    "Tell me about your projects",
                    "What challenges have you faced?",
                    "Describe your experience"
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setChatInput(prompt);
                        setTimeout(() => {
                          const form = document.querySelector('#chat-form') as HTMLFormElement;
                          if (form) form.requestSubmit();
                        }, 100);
                      }}
                      disabled={chatLoading}
                      className="block w-full text-left rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-xs text-[rgb(var(--muted))] transition-all hover:border-[rgb(var(--accent))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--accent))]/10 hover:shadow-soft active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      → {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden dark:glow-border">
                {/* Chat header */}
                <div className="border-b border-[rgb(var(--border))] bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-semibold shadow-soft">
                      AI
                    </div>
                    <div>
                      <h3 className="font-semibold">Marithea's Digital Twin</h3>
                      <p className="text-xs text-[rgb(var(--muted))]">Powered by RAG + LLaMA 3.3</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <button
                        onClick={() => {
                          setChatMessages([{ role: "assistant", content: "Hello! Ask me about my projects or experience." }]);
                          setChatError(null);
                        }}
                        className="rounded-md border border-[rgb(var(--border))] px-3 py-1 text-xs hover:bg-[rgb(var(--bg)/0.6)] transition-colors"
                        title="Clear conversation"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Chat messages with custom scrollbar */}
                <div className="chat-messages h-[500px] overflow-y-scroll px-6 py-4 space-y-4 overscroll-contain" style={{scrollbarWidth: 'thin', scrollbarColor: 'rgb(168 85 247) rgb(var(--card))'}}>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`} style={{animation: 'slideUp 0.3s ease-out'}}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${msg.role === 'user' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md' : 'bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-md'}`}>
                        {msg.role === 'user' ? 'U' : 'AI'}
                      </div>
                      {/* Message bubble */}
                      <div className={`flex-1 max-w-[85%]`}>
                        <div className={`rounded-2xl px-4 py-3 shadow-md ${msg.role === 'user' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-[rgb(var(--border))] text-[rgb(var(--text))]'}`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <p className="mt-1 text-[10px] text-[rgb(var(--muted))] px-2">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {chatLoading && (
                    <div className="flex gap-3" style={{animation: 'slideUp 0.3s ease-out'}}>
                      <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-md">
                        AI
                      </div>
                      <div className="flex-1">
                        <div className="rounded-2xl px-4 py-3 bg-[rgb(var(--border))] shadow-md max-w-fit">
                          <div className="flex gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[rgb(var(--accent))] animate-bounce" style={{animationDelay: '0ms'}}></span>
                            <span className="h-2 w-2 rounded-full bg-[rgb(var(--accent))] animate-bounce" style={{animationDelay: '150ms'}}></span>
                            <span className="h-2 w-2 rounded-full bg-[rgb(var(--accent))] animate-bounce" style={{animationDelay: '300ms'}}></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Chat input */}
                <div className="border-t border-[rgb(var(--border))] bg-gradient-to-b from-[rgb(var(--card))] to-[rgb(var(--bg))] px-6 py-4">
                  {chatError && (
                    <div className="mb-3 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                      <svg className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                      <span>{chatError}</span>
                    </div>
                  )}
                  <form id="chat-form" onSubmit={handleChatSubmit} className="flex gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask me anything about my experience..."
                        className="w-full rounded-full border-2 border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-6 py-3.5 pr-12 text-sm placeholder:text-[rgb(var(--muted))] focus:outline-none focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgb(var(--accent))]/20 transition-all shadow-sm"
                        disabled={chatLoading}
                        autoComplete="off"
                      />
                      {chatInput && (
                        <button
                          type="button"
                          onClick={() => setChatInput('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      className="relative inline-flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white shadow-lg transition-all hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed active:scale-95 overflow-hidden group"
                      title="Send message"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {chatLoading ? (
                        <svg className="h-5 w-5 animate-spin relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 relative z-10 group-hover:translate-x-0.5 transition-transform">
                          <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                        </svg>
                      )}
                    </button>
                  </form>
                  <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[rgb(var(--muted))]">
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                    </svg>
                    <span>Powered by RAG + Groq LLaMA 3.3 • Based on real portfolio data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get In Touch */}
        <section id="contact" className="py-24">
          <div className="mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Get In Touch</h2>
            <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
            <p className="mt-4 text-base text-[rgb(var(--muted))]">Let's connect and build something amazing together</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
                <p className="text-[rgb(var(--muted))]">Ready to collaborate? I’m open to opportunities and interesting projects.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a className="inline-flex items-center justify-center rounded-md bg-[rgb(var(--accent))] px-4 py-2 text-white shadow-soft hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]" href="mailto:magnomarithea157@gmail.com">magnomarithea157@gmail.com</a>
                  <a className="inline-flex items-center justify-center rounded-md border border-[rgb(var(--border))] px-4 py-2 hover:bg-[rgb(var(--card))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]" href="https://www.linkedin.com/in/marithea-magno-33038728a/" target="_blank" rel="noreferrer">LinkedIn</a>
                  <a className="inline-flex items-center gap-2 justify-center rounded-full border-2 border-[rgb(var(--border))] px-6 py-3 font-semibold hover:bg-[rgb(var(--card))] hover:border-[rgb(var(--accent))] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[rgb(var(--accent))]/30 transition-all duration-300 active:scale-95" href="https://github.com/TheaMarieM" target="_blank" rel="noreferrer">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
      </main>

      <footer className="border-t border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 backdrop-blur-sm mt-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-3 mb-12">
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6">
                <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Marithea Magno</h3>
                <p className="mt-3 text-sm text-[rgb(var(--muted))]">IT Student & Web Developer passionate about creating beautiful, functional web experiences.</p>
              </div>
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6">
                <h4 className="font-semibold mb-3">Quick Links</h4>
                <nav className="flex flex-col gap-2 text-sm">
                  <a href="#about" className="text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))] transition-colors">About</a>
                  <a href="#experience" className="text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))] transition-colors">Experience</a>
                  <a href="#skills" className="text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))] transition-colors">Skills</a>
                  <a href="#ai" className="text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))] transition-colors">AI Assistant</a>
                </nav>
              </div>
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/50 p-6">
                <h4 className="font-semibold mb-3">Connect</h4>
                <div className="flex gap-3">
                  <a href="https://github.com/TheaMarieM" target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] hover:bg-[rgb(var(--card))] hover:border-[rgb(var(--accent))] transition-all duration-300 hover:scale-110" aria-label="GitHub">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/marithea-magno-33038728a/" target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] hover:bg-[rgb(var(--card))] hover:border-[rgb(var(--accent))] transition-all duration-300 hover:scale-110" aria-label="LinkedIn">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="mailto:magnomarithea157@gmail.com" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] hover:bg-[rgb(var(--card))] hover:border-[rgb(var(--accent))] transition-all duration-300 hover:scale-110" aria-label="Email">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-[rgb(var(--border))] pt-8 mt-8">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 text-sm">
                <p className="text-[rgb(var(--muted))]">© {new Date().getFullYear()} Marithea Magno. All rights reserved.</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[rgb(var(--muted))]">Built with</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium text-xs">
                      Next.js
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium text-xs">
                      TypeScript
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-xs">
                      Tailwind CSS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

    {lightbox && (
          <div role="dialog" aria-modal className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/70" onClick={() => setLightbox(null)} />
            <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
              <figure className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-2 shadow-soft">
                <img src={lightbox.src} alt={lightbox.alt} className="h-auto w-full rounded-lg" />
                <figcaption className="px-2 pt-2 text-center text-sm text-[rgb(var(--muted))]">{lightbox.alt}</figcaption>
              </figure>
              <button
                aria-label="Close lightbox"
                onClick={() => setLightbox(null)}
                className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--text))] hover:bg-[rgb(var(--card))]/80 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/></svg>
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
