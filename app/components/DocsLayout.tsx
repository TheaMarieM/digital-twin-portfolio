"use client";
import { useState, useEffect } from "react";
import DocsNav from "./DocsNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center">
            <div className="text-lg font-semibold text-[rgb(var(--text))]">
              Documentation
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-col lg:flex-row">
        <DocsNav />
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
          
          {/* Footer */}
          <footer className="mt-20 border-t border-[rgb(var(--border))] pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-sm text-[rgb(var(--muted))] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} Marithea Magno. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <a href="/#contact" className="hover:text-purple-400 transition-colors">Contact</a>
                  <a href="/about" className="hover:text-purple-400 transition-colors">About</a>
                  <a href="https://github.com/TheaMarieM" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">GitHub</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
