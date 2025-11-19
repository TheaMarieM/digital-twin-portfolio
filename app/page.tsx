'use client';

import { useEffect, useState, FormEvent } from 'react';
import ThemeToggle from './components/ui/ThemeToggle';
import MobileNavigation from './components/ui/MobileNavigation';
import Navigation from './components/ui/Navigation';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import StrengthsSection from './components/sections/StrengthsSection';
import CoreTechnologies from './components/sections/CoreTechnologies';
import ExperienceSection from './components/sections/ExperienceSection';
import ProjectsSection from './components/sections/ProjectsSection';
import AIChatSection from './components/sections/AIChatSection';
import ContactSection from './components/sections/ContactSection';
import FloatingCatButton from './components/ui/FloatingCatButton';
import Footer from './components/Footer';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  // State management
  const [activeId, setActiveId] = useState<string>('hero');
  const [lightbox, setLightbox] = useState<null | { src: string; alt: string }>(null);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! Ask me about my projects or experience.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Scroll to section effect
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.5,
      rootMargin: '-10% 0px -10% 0px',
    });

    const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'ai', 'contact'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Lightbox escape key handler
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  // Core technologies data
  const technologies = [
    {
      name: 'Next.js',
      desc: 'React framework • SSR',
      logo: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 10h8M8 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Python',
      desc: 'RAG systems • AI integration',
      logo: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 11h-2v2h-2v-2H9v-2h2V9h2v2h2v2z" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: 'TypeScript',
      desc: 'Type-safe development',
      logo: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#3178c6" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="3" fill="#3178c6"/>
          <path d="M6 9h3v6H6zm4 0h3v6h-3zm4 0h3v6h-3z" fill="white"/>
        </svg>
      )
    },
    {
      name: 'Tailwind CSS',
      desc: 'Modern UI design',
      logo: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#06b6d4" opacity="0.8"/>
          <circle cx="12" cy="12" r="5" fill="#06b6d4"/>
        </svg>
      )
    },
    {
      name: 'Laravel',
      desc: 'PHP framework • APIs',
      logo: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#FF2D20" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7v10c0 6 9 12 9 12s9-6 9-12V7l-9-5z" fill="#FF2D20" opacity="0.8"/>
          <path d="M12 8l-4 2v4l4 2 4-2v-4l-4-2z" fill="#FF2D20"/>
        </svg>
      )
    },
    {
      name: 'MySQL',
      desc: 'Database design',
      logo: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#4479A1" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#4479A1" opacity="0.8"/>
          <g fill="white">
            <rect x="8" y="6" width="2" height="12" rx="1"/>
            <rect x="12" y="6" width="2" height="12" rx="1"/>
            <rect x="16" y="6" width="2" height="12" rx="1"/>
          </g>
        </svg>
      )
    }
  ];

  // Experience projects data
  const experienceProjects = [
    {
      title: 'Student Portal — Native PHP + MySQL',
      description: 'Web app allowing students to view assigned teachers and grades with role-based access.',
      details: [
        'Roles: Admin, Teacher, Student',
        'Admin manages users, teacher-student assignments, and grade entries',
        'Teachers submit/update grades for their assigned students',
        'Students sign in to view assigned teacher(s) and current grades'
      ],
      technologies: ['PHP', 'MySQL', 'Auth', 'RBAC'],
      links: [
        { label: 'GitHub', href: 'https://github.com/TheaMarieM/3rdyear/tree/main/SIM' }
      ],
      image: '/screenshots/Screenshot 2025-11-01 134246.png'
    },
    {
      title: 'Digital Twin RAG Portfolio — Next.js',
      description: 'Retrieval-Augmented Generation system answering recruiter-style questions using STAR-structured profile data.',
      details: [
        'STAR-structured profile, embeddings, cosine retrieval',
        'Real-time responses with groundedness and coverage scoring',
        'Docs and testing pages with 20+ sample queries'
      ],
      technologies: ['RAG', 'Embeddings', 'OpenAI', 'Next.js API', 'Quality scoring'],
      links: [
        { label: 'Try RAG', href: '/rag', primary: true },
        { label: 'About', href: '/about' },
        { label: 'Testing', href: '/testing' },
        { label: 'Profile Data', href: '/profile-data' }
      ]
    },
    {
      title: 'Community Health Monitoring System',
      description: 'System used by nursing students to digitize community health records and make outputs paperless.',
      details: [
        'Digital forms for assessments and visits',
        'Student accounts to submit and manage outputs',
        'Instructor view for review/verification',
        'Exports and summaries to replace paper workflows'
      ],
      technologies: ['Paperless', 'Student Use', 'Major Subject'],
      links: [],
      image: '/screenshots/Screenshot 2025-11-01 135052.png'
    }
  ];

  // Featured projects data
  const featuredProjects = [
    {
      title: 'Person Search App (Auth)',
      description: 'Auth-protected CRUD with instant search, dark/light mode, Prisma, Next.js, and Tailwind.',
      technologies: ['Next.js', 'Tailwind', 'Prisma', 'Auth'],
      githubLink: 'https://github.com/TheaMarieM/person-search-app',
      image: '/screenshots/Screenshot 2025-11-01 133305.png'
    },
    {
      title: 'Movie Reviews (Laravel)',
      description: 'CRUD reviews, poster via URL, star ratings, and filters.',
      technologies: ['Laravel', 'Blade', 'CRUD', 'Ratings'],
      githubLink: 'https://github.com/TheaMarieM/Quiz_laravel1',
      image: '/screenshots/Screenshot 2025-11-01 133942.png'
    }
  ];

  // Chat functions
  const scrollToBottom = () => {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);
    setChatError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Chat service temporarily unavailable');

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatClick = () => {
    const aiSection = document.getElementById('ai');
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearChat = () => {
    setChatMessages([{ role: "assistant", content: "Hello! Ask me about my projects or experience." }]);
    setChatError(null);
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = saved ? saved === 'dark' : prefersDark;
    
    if (shouldDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setIsDarkMode(shouldDark);
  }, []);

  function toggleTheme() {
    const el = document.documentElement;
    const newIsDark = !isDarkMode;
    
    if (newIsDark) {
      el.classList.add('dark');
    } else {
      el.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    setIsDarkMode(newIsDark);
  }

  const navItemClass = (id: string) =>
    `hover:text-[rgb(var(--accent))] ${activeId === id ? 'text-[rgb(var(--accent))]' : ''}`;

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))] transition-colors">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-[rgb(var(--bg)/0.7)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgb(var(--bg)/0.5)] border-b border-[rgb(var(--border))] shadow-sm">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="#hero" className="font-bold text-lg tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500 transition-all duration-300">Marithea Magno</a>
            <nav className="hidden gap-6 text-sm md:flex">
              <a className={navItemClass('about')} aria-current={activeId === 'about' ? 'page' : undefined} href="#about">About</a>
              <a className={navItemClass('experience')} aria-current={activeId === 'experience' ? 'page' : undefined} href="#experience">Experience</a>
              <a className={navItemClass('projects')} aria-current={activeId === 'projects' ? 'page' : undefined} href="#projects">Projects</a>
              <a className={navItemClass('skills')} aria-current={activeId === 'skills' ? 'page' : undefined} href="#skills">Skills</a>
              <a className={navItemClass('ai')} aria-current={activeId === 'ai' ? 'page' : undefined} href="#ai">AI</a>
              <a className={navItemClass('contact')} aria-current={activeId === 'contact' ? 'page' : undefined} href="#contact">Contact</a>
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
                  
                  <div className="my-3 h-px bg-gradient-to-r from-transparent via-[rgb(var(--border))] to-transparent" />
                  <div className="mb-2 mt-1 px-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">Performance & Operations</div>
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
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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
          <div id="mobileNav" className={`md:hidden ${mobileOpen ? '' : 'hidden'} pb-4`}>
            <div className="grid gap-1 text-sm">
              <a onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="#about">About</a>
              <a onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="#experience">Experience</a>
              <a onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="#projects">Projects</a>
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
              
              <div className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-cyan-400">Performance & Operations</div>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/optimization">Query Optimization</a>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/monitoring">Performance Monitoring</a>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/scalability">Load Testing & Scalability</a>
              <a onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2 rounded hover:bg-[rgb(var(--card))]" href="/operations">Production Operations</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-20">
        <HeroSection />
        <AboutSection />
        <StrengthsSection />
        
        {/* Skills Section */}
        <section id="skills" className="py-24">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Toolkit & Expertise
              </h2>
              <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
              <p className="mt-4 text-base text-[rgb(var(--muted))]">
                Technologies, tools, and specialized systems I've built to solve real problems
              </p>
            </div>
            <div className="md:col-span-2 space-y-12">
              <CoreTechnologies technologies={technologies} />
            </div>
          </div>
        </section>

        <ExperienceSection />
        <ProjectsSection projects={featuredProjects} />
        
        <AIChatSection 
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          chatLoading={chatLoading}
          chatError={chatError}
          onSubmit={handleChatSubmit}
          onClearChat={handleClearChat}
        />
        
        <ContactSection />
      </main>

      {/* Floating Cat Button */}
      <FloatingCatButton />

      {/* Footer */}
      <Footer />

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-h-full max-w-4xl overflow-hidden rounded-xl">
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-full max-w-full object-contain"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}