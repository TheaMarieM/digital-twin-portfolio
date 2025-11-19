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
              <div className="font-semibold text-[rgb(var(--text))] text-base mb-2">{tech.name}</div>
              <div className="text-sm text-[rgb(var(--muted))] leading-relaxed">{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialized Tools */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-6 text-emerald-400">Specialized Tools I've Built</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="group relative rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50">
            <div className="font-semibold text-[rgb(var(--text))] text-base mb-2">MCP Server (7 Tools)</div>
            <div className="text-sm text-[rgb(var(--muted))] leading-relaxed">FastAPI server with portfolio queries, interview Q&A, and RAG search</div>
          </div>
          <div className="group relative rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50">
            <div className="font-semibold text-[rgb(var(--text))] text-base mb-2">Digital Twin RAG System</div>
            <div className="text-sm text-[rgb(var(--muted))] leading-relaxed">AI assistant with 20 embedded profile chunks and intelligent responses</div>
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
              <div className="font-semibold text-[rgb(var(--text))] text-base mb-2">{tool.name}</div>
              <div className="text-sm text-[rgb(var(--muted))] leading-relaxed">{tool.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}