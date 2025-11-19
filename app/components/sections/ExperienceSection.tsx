export default function ExperienceSection() {
  return (
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
            <article className="group h-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:ring-2 hover:ring-[rgb(var(--accent))]/30 dark:glow-border flex flex-col overflow-hidden">
              <picture>
                <source srcSet="/screenshots/Screenshot%202025-11-01%20134246.png" type="image/png" />
                <img src="/screenshots/Screenshot%202025-11-01%20134246.png" alt="Student Portal (PHP + MySQL)" className="aspect-video w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
              </picture>
              <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-lg">Student Portal — Native PHP + MySQL</h3>
              <p className="mt-3 text-sm text-[rgb(var(--muted))] leading-relaxed">Web app allowing students to view assigned teachers and grades with role-based access.</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[rgb(var(--muted))] leading-relaxed">
                <li><span className="font-medium">Roles:</span> Admin, Teacher, Student</li>
                <li>Admin manages users, teacher-student assignments, and grade entries</li>
                <li>Teachers submit/update grades for their assigned students</li>
                <li>Students sign in to view assigned teacher(s) and current grades</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30 transition-colors">PHP</span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30 transition-colors">MySQL</span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30 transition-colors">Auth</span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30 transition-colors">RBAC</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <a href="https://github.com/TheaMarieM/3rdyear/tree/main/SIM" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-[rgb(var(--border))] px-3 py-1.5 hover:bg-[rgb(var(--card))]">GitHub</a>
              </div>
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
            
            <article className="group h-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:ring-2 hover:ring-[rgb(var(--accent))]/30 flex flex-col overflow-hidden">
              <picture>
                <source srcSet="/screenshots/Screenshot%202025-11-01%20135052.png" type="image/png" />
                <img src="/screenshots/Screenshot%202025-11-01%20135052.png" alt="Community Health Monitoring System" className="aspect-video w-full object-cover" />
              </picture>
              <div className="p-6">
                <h3 className="font-bold text-lg">Community Health Monitoring System</h3>
                <p className="mt-3 text-sm text-[rgb(var(--muted))] leading-relaxed">System used by nursing students to digitize community health records and make outputs paperless. Built as a requirement for a major subject.</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[rgb(var(--muted))] leading-relaxed">
                  <li>Digital forms for assessments and visits</li>
                  <li>Student accounts to submit and manage outputs</li>
                  <li>Instructor view for review/verification</li>
                  <li>Exports and summaries to replace paper workflows</li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/30 transition-colors">Paperless</span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 transition-colors">Student Use</span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30 transition-colors">Major Subject</span>
                </div>
              </div>
            </article>

            <article className="group h-full rounded-xl border-2 border-dashed border-[rgb(var(--border))] bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:ring-2 hover:ring-purple-500/30 flex flex-col items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">View More Projects</h3>
                <p className="text-sm text-[rgb(var(--muted))] mb-6">Explore my complete project portfolio</p>
                <a 
                  href="/projects" 
                  className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-white font-medium shadow-md hover:shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  See All Projects
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>
        </div>
      </div>
    </section>
  );
}