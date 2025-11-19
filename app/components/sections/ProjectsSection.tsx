import Badge from '../ui/Badge';

interface FeaturedProject {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  image: string;
}

interface ProjectsSectionProps {
  projects: FeaturedProject[];
}

function FeaturedProjectCard({ project }: { project: FeaturedProject }) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-pink-500/30 to-sky-500/30 p-[1px]">
      <article className="group rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft transition hover:-translate-y-0.5 hover:ring-1 hover:ring-[rgb(var(--accent))]/30">
        <picture>
          <source srcSet={project.image} type="image/png" />
          <img 
            src={project.image} 
            alt={project.title} 
            className="aspect-video w-full rounded-lg object-cover transition-transform duration-300 ease-out group-hover:scale-105" 
          />
        </picture>
        <h3 className="mt-4 text-lg font-semibold">{project.title}</h3>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">{project.description}</p>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {project.technologies.map((tech, index) => (
            <Badge key={index} variant="secondary" size="sm">
              {tech}
            </Badge>
          ))}
        </div>
        
        <div className="mt-3 flex gap-3 text-sm">
          <a 
            className="text-[rgb(var(--accent))] hover:underline" 
            href={project.githubLink} 
            target="_blank" 
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </article>
    </div>
  );
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-24">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
        </div>
        <a 
          href="#contact" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--accent))] hover:gap-3 transition-all duration-300 group"
        >
          <span>Work with me</span>
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <FeaturedProjectCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
}