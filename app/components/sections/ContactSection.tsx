export default function ContactSection() {
  return (
    <section id="contact" className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Get In Touch
        </h2>
        <div className="mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mx-auto"></div>
        <p className="mt-6 text-lg text-[rgb(var(--muted))] max-w-2xl mx-auto">
          Let's connect and build something amazing together
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Main Contact Card */}
        <div className="relative group">
          {/* Gradient glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          
          <div className="relative rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 md:p-12">
            <div className="text-center mb-8">
              <p className="text-lg text-[rgb(var(--muted))]">
                Ready to collaborate? I'm open to opportunities and interesting projects.
              </p>
            </div>
            
            {/* Contact Methods Grid */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              {/* Email Card */}
              <a 
                href="mailto:magnomarithea157@gmail.com"
                className="group/card relative overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-gradient-to-br from-purple-500/10 to-transparent p-6 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-purple-500/20 group-hover/card:bg-purple-500/30 transition-colors">
                    <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[rgb(var(--text))]">Email</div>
                    <div className="text-xs text-[rgb(var(--muted))] mt-1 break-all">magnomarithea157@gmail.com</div>
                  </div>
                </div>
              </a>

              {/* LinkedIn Card */}
              <a 
                href="https://www.linkedin.com/in/marithea-magno-33038728a/" 
                target="_blank" 
                rel="noreferrer"
                className="group/card relative overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-gradient-to-br from-pink-500/10 to-transparent p-6 hover:border-pink-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-pink-500/20 group-hover/card:bg-pink-500/30 transition-colors">
                    <svg className="h-6 w-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[rgb(var(--text))]">LinkedIn</div>
                    <div className="text-xs text-[rgb(var(--muted))] mt-1">Connect with me</div>
                  </div>
                </div>
              </a>

              {/* GitHub Card */}
              <a 
                href="https://github.com/TheaMarieM" 
                target="_blank" 
                rel="noreferrer"
                className="group/card relative overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-gradient-to-br from-purple-500/10 to-transparent p-6 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-purple-500/20 group-hover/card:bg-purple-500/30 transition-colors">
                    <svg className="h-6 w-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[rgb(var(--text))]">GitHub</div>
                    <div className="text-xs text-[rgb(var(--muted))] mt-1">View my projects</div>
                  </div>
                </div>
              </a>
            </div>

            {/* CTA Section */}
            <div className="text-center pt-6 border-t border-[rgb(var(--border))]">
              <p className="text-sm text-[rgb(var(--muted))] mb-4">
                Prefer to send a direct message?
              </p>
              <a 
                href="mailto:magnomarithea157@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}