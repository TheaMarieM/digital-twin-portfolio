interface Tool {
  name: string;
  desc: string;
  logo: React.ReactElement;
}

interface CoreTechnologiesProps {
  technologies: Tool[];
}

export default function CoreTechnologies({ technologies }: CoreTechnologiesProps) {
  return (
    <>
      {/* Core Technologies */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-6 text-purple-400">Core Technologies</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((tech, i) => (
            <div key={i} className="group relative rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                  {tech.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[rgb(var(--text))] text-base mb-2">{tech.name}</div>
                  <div className="text-sm text-[rgb(var(--muted))] leading-relaxed">{tech.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialized Tools */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-6 text-emerald-400">Specialized Tools I've Built</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="group relative rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[rgb(var(--text))] text-base mb-2">MCP Server (7 Tools)</div>
                <div className="text-sm text-[rgb(var(--muted))] leading-relaxed">FastAPI server with portfolio queries, interview Q&A, and RAG search</div>
              </div>
            </div>
          </div>
          <div className="group relative rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[rgb(var(--text))] text-base mb-2">Digital Twin RAG System</div>
                <div className="text-sm text-[rgb(var(--muted))] leading-relaxed">AI assistant with 20 embedded profile chunks and intelligent responses</div>
              </div>
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
            <div key={i} className="group relative rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/50">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center flex-shrink-0 text-pink-400 font-bold text-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[rgb(var(--text))] text-base mb-2">{tool.name}</div>
                  <div className="text-sm text-[rgb(var(--muted))] leading-relaxed">{tool.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}