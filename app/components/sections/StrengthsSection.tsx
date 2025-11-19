interface PillarCardProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  gradient: string;
}

function PillarCard({ icon, title, description, gradient }: PillarCardProps) {
  return (
    <div className="group relative rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-br from-[rgb(var(--card))] to-transparent p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[rgb(var(--accent))] dark:hover:shadow-purple-500/20">
      <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl ${gradient} text-white shadow-md`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">{description}</p>
    </div>
  );
}

export default function StrengthsSection() {
  const strengths = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Enterprise Experience",
      description: "Learning to build secure, scalable systems and follow engineering best practices.",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Global Perspective",
      description: "Open to diverse teams and ideas; eager to collaborate and grow.",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Team Leadership",
      description: "Enjoys mentoring peers, organizing work, and sharing knowledge.",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Performance Focus",
      description: "Cares about clean code, performance, and measurable impact.",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {strengths.map((strength, index) => (
          <PillarCard key={index} {...strength} />
        ))}
      </div>
    </section>
  );
}