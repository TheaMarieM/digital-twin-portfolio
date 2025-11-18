"use client";
import { useState } from "react";
import DocsLayout from "../components/DocsLayout";

interface DesignItem {
  id: string;
  title: string;
  category: "Adobe Edits" | "Figma UI";
  filename: string;
  description: string;
  type: "Poster" | "UI Design" | "Graphic" | "Web" | "Mobile" | "Photo Edit";
  tools: string[];
}

const designItems: DesignItem[] = [
  {
    id: "shawarma-tarp",
    title: "Shawarma Tarpaulin Design",
    category: "Adobe Edits",
    filename: "2Shawarma_tarpulin.png",
    description: "Commercial tarpaulin design for shawarma restaurant with bold typography and appetizing visuals.",
    type: "Poster",
    tools: ["Photoshop", "Illustrator"]
  },
  {
    id: "artboard-design",
    title: "Artboard Graphic Design",
    category: "Adobe Edits",
    filename: "Artboard 1.png",
    description: "Creative artboard layout showcasing graphic design composition and visual hierarchy.",
    type: "Graphic",
    tools: ["Illustrator", "Photoshop"]
  },
  {
    id: "chess-poster",
    title: "Chess Tournament Poster",
    category: "Adobe Edits",
    filename: "chess_poster (2).png",
    description: "Event poster design for chess tournament with strategic visual elements.",
    type: "Poster",
    tools: ["Photoshop", "Illustrator"]
  },
  {
    id: "juice-poster",
    title: "JUICE Poster (50x30)",
    category: "Adobe Edits",
    filename: "JUICE (50 x 30 in).png",
    description: "Large format juice advertisement poster with vibrant colors and product focus.",
    type: "Poster",
    tools: ["Photoshop", "Illustrator"]
  },
  {
    id: "lebron-edit",
    title: "LeBron James Photo Edit",
    category: "Adobe Edits",
    filename: "lebron-james.png",
    description: "Professional sports photo manipulation with dramatic lighting and effects.",
    type: "Photo Edit",
    tools: ["Photoshop"]
  },
  {
    id: "spiderman-poster",
    title: "Spiderman Fan Poster",
    category: "Adobe Edits",
    filename: "spiderman-1.png",
    description: "Movie-inspired poster design with cinematic composition and effects.",
    type: "Poster",
    tools: ["Photoshop", "After Effects"]
  },
  {
    id: "social-commerce",
    title: "Social Commerce App UI",
    category: "Figma UI",
    filename: "Screenshot 2025-11-01 152235.png",
    description: "Modern e-commerce mobile app interface with social features integration.",
    type: "Mobile",
    tools: ["Figma", "UI Kit"]
  },
  {
    id: "accessible-web",
    title: "Accessible Website UI",
    category: "Figma UI",
    filename: "Screenshot 2025-11-01 152251.png",
    description: "Inclusive web design for persons with disabilities, focusing on accessibility standards.",
    type: "Web",
    tools: ["Figma", "Accessibility Tools"]
  },
  {
    id: "health-tracking",
    title: "Health Tracking App UI",
    category: "Figma UI",
    filename: "Screenshot 2025-11-01 152330.png",
    description: "Healthcare mobile application with clean dashboard and data visualization.",
    type: "Mobile",
    tools: ["Figma", "Chart Components"]
  },
  {
    id: "system-layout",
    title: "System Layout UI (CRUD)",
    category: "Figma UI",
    filename: "Screenshot 2025-11-01 153154.png",
    description: "Administrative dashboard for JPCS system with comprehensive CRUD operations.",
    type: "Web",
    tools: ["Figma", "Component Library"]
  },
  {
    id: "community-website",
    title: "Community Website UI",
    category: "Figma UI",
    filename: "Screenshot 2025-11-01 154023.png",
    description: "Community platform interface with modern design and user engagement features.",
    type: "Web",
    tools: ["Figma", "Design System"]
  }
];

const categories = ["All", "Adobe Edits", "Figma UI"];
const types = ["All", "Poster", "UI Design", "Graphic", "Web", "Mobile", "Photo Edit"];

export default function DesignsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDesign, setSelectedDesign] = useState<DesignItem | null>(null);

  const filteredDesigns = designItems.filter(design => {
    const categoryMatch = selectedCategory === "All" || design.category === selectedCategory;
    const typeMatch = selectedType === "All" || design.type === selectedType;
    return categoryMatch && typeMatch;
  });

  return (
    <DocsLayout>
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-purple-400">
              Design & UI Showcase
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-3xl mx-auto">
              Creative collection of graphic design work, UI/UX projects, and digital art spanning Adobe Creative Suite and Figma design systems.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-[rgb(var(--muted))] self-center">Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] border-[rgb(var(--border))] hover:border-purple-500/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-[rgb(var(--muted))] self-center">Type:</span>
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                    selectedType === type
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] border-[rgb(var(--border))] hover:border-purple-500/50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-center text-sm text-[rgb(var(--muted))] mb-8">
            Showing {filteredDesigns.length} of {designItems.length} designs
          </p>

          {/* Design Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredDesigns.map(design => (
              <div
                key={design.id}
                className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group cursor-pointer"
                onClick={() => setSelectedDesign(design)}
              >
                {/* Image */}
                <div className="relative aspect-video bg-[rgb(var(--bg))] overflow-hidden">
                  <img
                    src={`/designs/${design.filename}`}
                    alt={design.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 bg-purple-500/90 text-white rounded text-xs font-medium">
                          {design.category}
                        </span>
                        <span className="px-2 py-1 bg-pink-500/90 text-white rounded text-xs font-medium">
                          {design.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{design.title}</h3>
                  <p className="text-sm text-[rgb(var(--muted))] mb-3 line-clamp-2">
                    {design.description}
                  </p>
                  
                  {/* Tools */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {design.tools.map(tool => (
                      <span key={tool} className="px-2 py-1 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-2 px-4 bg-purple-500/5 border border-purple-500/30 rounded-lg hover:border-purple-500 hover:bg-purple-500/10 transition-all text-sm font-medium">
                    View Full Size
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Design Categories Summary */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-purple-400">Adobe Creative Suite</h2>
              </div>
              <p className="text-[rgb(var(--muted))] mb-4">
                Professional graphic design work including posters, advertisements, and photo manipulations using Photoshop, Illustrator, and After Effects.
              </p>
              <div className="text-sm">
                <strong className="text-purple-400">{designItems.filter(d => d.category === "Adobe Edits").length}</strong> designs
              </div>
            </div>

            <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-pink-400">Figma UI/UX Design</h2>
              </div>
              <p className="text-[rgb(var(--muted))] mb-4">
                Modern user interface and experience design for web and mobile applications, focusing on accessibility and user-centered design principles.
              </p>
              <div className="text-sm">
                <strong className="text-pink-400">{designItems.filter(d => d.category === "Figma UI").length}</strong> designs
              </div>
            </div>
          </div>

          {/* Skills & Tools */}
          <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Design Tools & Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-400">Adobe Creative Suite</h3>
                <div className="flex flex-wrap gap-2">
                  {["Photoshop", "Illustrator", "After Effects", "InDesign"].map(tool => (
                    <span key={tool} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-pink-400">UI/UX Design</h3>
                <div className="flex flex-wrap gap-2">
                  {["Figma", "Design Systems", "Accessibility", "Prototyping"].map(tool => (
                    <span key={tool} className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for full-size view */}
        {selectedDesign && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDesign(null)}>
            <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-6 max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedDesign.title}</h3>
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                      {selectedDesign.category}
                    </span>
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-sm">
                      {selectedDesign.type}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDesign(null)}
                  className="p-2 hover:bg-[rgb(var(--card-hover))] rounded-lg"
                >
                  ✕
                </button>
              </div>
              
              <img
                src={`/designs/${selectedDesign.filename}`}
                alt={selectedDesign.title}
                className="w-full h-auto rounded-lg mb-4 border border-[rgb(var(--border))]"
              />
              
              <p className="text-[rgb(var(--muted))] mb-4">{selectedDesign.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {selectedDesign.tools.map(tool => (
                  <span key={tool} className="px-3 py-1 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </DocsLayout>
  );
}