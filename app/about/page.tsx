"use client";
import { useEffect } from "react";

export default function AboutRedirect() {
  useEffect(() => {
    // Redirect to Digital Twin MCP project
    const timer = setTimeout(() => {
      window.location.href = "/projects";
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-2xl font-bold mb-4">Content Moved to Projects</h1>
        <p className="text-[rgb(var(--muted))] mb-6">
          RAG Architecture details are now part of the <strong>Digital Twin MCP Server</strong> project showcase.
        </p>
        <div className="space-y-2 text-sm text-[rgb(var(--muted))]">
          <p>Redirecting to <a href="/projects" className="text-[rgb(var(--accent))] hover:underline">/projects</a> in 2 seconds...</p>
          <p>or <a href="/projects" className="text-[rgb(var(--accent))] hover:underline">click here</a> to go now</p>
        </div>
      </div>
    </div>
  );
}