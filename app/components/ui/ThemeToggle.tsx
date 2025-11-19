'use client';

import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize from multiple sources for reliability
    const initTheme = () => {
      const saved = localStorage.getItem('theme');
      const hasDataAttr = document.documentElement.getAttribute('data-theme');
      const hasDarkClass = document.documentElement.classList.contains('dark');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Determine current state with fallbacks
      let isDark = false;
      if (saved === 'dark' || saved === 'light') {
        isDark = saved === 'dark';
      } else if (hasDataAttr) {
        isDark = hasDataAttr === 'dark';
      } else if (hasDarkClass) {
        isDark = true;
      } else {
        isDark = prefersDark;
      }
      
      setIsDarkMode(isDark);
      
      // Ensure DOM is in sync
      const el = document.documentElement;
      el.classList.toggle('dark', isDark);
      el.setAttribute('data-theme', isDark ? 'dark' : 'light');
      el.style.colorScheme = isDark ? 'dark' : 'light';
    };
    
    initTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const saved = localStorage.getItem('theme');
      if (!saved) {
        initTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    
    const el = document.documentElement;
    el.classList.toggle('dark', newIsDark);
    el.setAttribute('data-theme', newIsDark ? 'dark' : 'light');
    el.style.colorScheme = newIsDark ? 'dark' : 'light';
    
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className={`h-10 w-10 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft transition-all hover:scale-110 hover:bg-[rgb(var(--accent))] hover:text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] ${className}`}
      aria-label="Toggle theme"
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <svg
          className="h-5 w-5 transition-transform group-hover:rotate-12"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 transition-transform group-hover:-rotate-12"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}