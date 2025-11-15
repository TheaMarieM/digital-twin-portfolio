"use client";
import { useEffect } from "react";

export default function RAGRedirect() {
  useEffect(() => {
    // Redirect to main AI chat page  
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-6xl mb-4">💬</div>
        <h1 className="text-2xl font-bold mb-4">Redirecting to AI Chat</h1>
        <p className="text-[rgb(var(--muted))] mb-6">
          The RAG AI chat is available on the main page with full digital twin capabilities.
        </p>
        <div className="space-y-2 text-sm text-[rgb(var(--muted))]">
          <p>Redirecting to <a href="/" className="text-[rgb(var(--accent))] hover:underline">AI Chat</a> in 2 seconds...</p>
          <p>or <a href="/" className="text-[rgb(var(--accent))] hover:underline">click here</a> to go now</p>
        </div>
      </div>
    </div>
  );
}
