'use client';

export default function HeroSection() {
  return (
    <section id="hero" className="relative py-16 sm:py-20 md:py-24 lg:py-32">
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
  );
}