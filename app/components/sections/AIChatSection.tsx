'use client';

import { FormEvent } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatSectionProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (input: string) => void;
  chatLoading: boolean;
  chatError: string | null;
  onSubmit: (e: FormEvent) => void;
  onClearChat: () => void;
}

export default function AIChatSection({
  chatMessages,
  chatInput,
  setChatInput,
  chatLoading,
  chatError,
  onSubmit,
  onClearChat
}: AIChatSectionProps) {
  const quickPrompts = [
    "What are your key skills?",
    "Tell me about your projects",
    "What challenges have you faced?",
    "Describe your experience"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setChatInput(prompt);
    setTimeout(() => {
      const form = document.querySelector('#chat-form') as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <section id="ai" className="py-20 relative">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[40vh] w-[60vw] -translate-x-1/2 rounded-full blur-3xl opacity-20" style={{background: 'radial-gradient(closest-side, rgba(217,70,239,0.6), transparent 70%)'}} />
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs shadow-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-[rgb(var(--muted))]">AI Online</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Chat with my Digital Twin</h2>
            <div className="mt-2 h-1 w-16 rounded bg-gradient-to-r from-pink-500 to-sky-500"></div>
            <p className="mt-4 text-sm text-[rgb(var(--muted))]">
              Powered by <span className="font-semibold text-[rgb(var(--accent))]">Groq + LLaMA 3.3</span>
            </p>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Ask me about my skills, experience, projects, challenges, or anything else!
            </p>
            
            {/* Quick prompts */}
            <div className="mt-6 space-y-2">
              <p className="text-xs font-medium text-purple-400">Quick Questions:</p>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPrompt(prompt)}
                  disabled={chatLoading}
                  className="block w-full text-left rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-xs text-[rgb(var(--muted))] transition-all hover:border-[rgb(var(--accent))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--accent))]/10 hover:shadow-soft active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  → {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden dark:glow-border">
            {/* Chat header */}
            <div className="border-b border-[rgb(var(--border))] bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-semibold shadow-soft">
                  AI
                </div>
                <div>
                  <h3 className="font-semibold">Marithea's Digital Twin</h3>
                  <p className="text-xs text-[rgb(var(--muted))]">Powered by RAG + LLaMA 3.3</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={onClearChat}
                    className="rounded-md border border-[rgb(var(--border))] px-3 py-1 text-xs hover:bg-[rgb(var(--bg)/0.6)] transition-colors"
                    title="Clear conversation"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="chat-messages h-[500px] overflow-y-scroll px-6 py-4 space-y-4 overscroll-contain" style={{scrollbarWidth: 'thin', scrollbarColor: 'rgb(168 85 247) rgb(var(--card))'}}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`} style={{animation: 'slideUp 0.3s ease-out'}}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${msg.role === 'user' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md' : 'bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-md'}`}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>
                  {/* Message bubble */}
                  <div className={`flex-1 max-w-[85%]`}>
                    <div className={`rounded-2xl px-4 py-3 shadow-md ${msg.role === 'user' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-[rgb(var(--border))] text-[rgb(var(--text))]'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    <p className="mt-1 text-[10px] text-[rgb(var(--muted))] px-2">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {chatLoading && (
                <div className="flex gap-3" style={{animation: 'slideUp 0.3s ease-out'}}>
                  <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-md">
                    AI
                  </div>
                  <div className="flex-1">
                    <div className="rounded-2xl px-4 py-3 bg-[rgb(var(--border))] shadow-md max-w-fit">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[rgb(var(--accent))] animate-bounce" style={{animationDelay: '0ms'}}></span>
                        <span className="h-2 w-2 rounded-full bg-[rgb(var(--accent))] animate-bounce" style={{animationDelay: '150ms'}}></span>
                        <span className="h-2 w-2 rounded-full bg-[rgb(var(--accent))] animate-bounce" style={{animationDelay: '300ms'}}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat input */}
            <div className="border-t border-[rgb(var(--border))] bg-gradient-to-b from-[rgb(var(--card))] to-[rgb(var(--bg))] px-6 py-4">
              {chatError && (
                <div className="mb-3 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                  <span>{chatError}</span>
                </div>
              )}
              <form id="chat-form" onSubmit={onSubmit} className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask me anything about my experience..."
                    className="w-full rounded-full border-2 border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-6 py-3.5 pr-12 text-sm placeholder:text-[rgb(var(--muted))] focus:outline-none focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgb(var(--accent))]/20 transition-all shadow-sm"
                    disabled={chatLoading}
                    autoComplete="off"
                  />
                  {chatInput && (
                    <button
                      type="button"
                      onClick={() => setChatInput('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="relative inline-flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white shadow-lg transition-all hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed active:scale-95 overflow-hidden group"
                  title="Send message"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {chatLoading ? (
                    <svg className="h-5 w-5 animate-spin relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 relative z-10 group-hover:translate-x-0.5 transition-transform">
                      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                  )}
                </button>
              </form>
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[rgb(var(--muted))]">
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
                <span>Powered by RAG + Groq LLaMA 3.3 • Based on real portfolio data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}