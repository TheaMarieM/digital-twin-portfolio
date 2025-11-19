'use client';

import { useState, useEffect } from 'react';

interface MobileNavigationProps {
  className?: string;
}

export default function MobileNavigation({ className = '' }: MobileNavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    const handleScroll = () => {
      if (mobileOpen) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mobileOpen]);

  const navigationLinks = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#ai", label: "AI Assistant" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <div className={`md:hidden ${className}`}>
      <button
        type="button"
        className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft transition-all hover:scale-110 hover:bg-[rgb(var(--accent))] hover:text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
        aria-label="Open menu"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="sr-only">Open menu</span>
        <div className="flex h-6 w-6 flex-col items-center justify-center space-y-1">
          <div className={`h-0.5 w-4 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`h-0.5 w-4 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <div className={`h-0.5 w-4 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </div>
      </button>

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-4 top-20 z-50 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          mobileOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col p-6 space-y-4">
          {navigationLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="block rounded-lg px-4 py-3 text-base font-medium transition-all hover:bg-[rgb(var(--accent))]/10 hover:text-[rgb(var(--accent))] hover:translate-x-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}