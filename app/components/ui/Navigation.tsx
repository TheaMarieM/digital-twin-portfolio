'use client';

interface NavigationProps {
  activeId: string;
  onActiveIdChange: (id: string) => void;
}

export default function Navigation({ activeId, onActiveIdChange }: NavigationProps) {
  const navigationItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'ai', label: 'AI Assistant' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="hidden md:flex items-center space-x-1 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 backdrop-blur-xl p-2 shadow-soft">
      {navigationItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all hover:text-[rgb(var(--accent))] ${
            activeId === item.id 
              ? 'bg-[rgb(var(--accent))] text-white shadow-md' 
              : 'text-[rgb(var(--muted))] hover:bg-[rgb(var(--accent))]/10'
          }`}
          onClick={() => onActiveIdChange(item.id)}
        >
          <span className="relative z-10">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}