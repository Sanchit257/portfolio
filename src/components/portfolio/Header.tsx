export function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 p-4 md:p-6 z-50 pointer-events-none">
      <header className="cyber-clip bg-black/60 backdrop-blur-md border border-[var(--color-neon-cyan)]/30 max-w-[90rem] mx-auto px-6 md:px-8 py-4 md:py-5 flex justify-between items-center pointer-events-auto transition-all duration-500 hover:border-[var(--color-neon-cyan)] hover:bg-black/80 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 cyber-clip-reverse bg-[var(--color-neon-pink)] flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(255,0,60,0.6)]">
            <div className="w-3.5 h-3.5 bg-black cyber-clip" />
          </div>
          <span className="font-[family-name:var(--font-display)] font-black text-xl md:text-2xl tracking-widest text-white uppercase">
            SANCHIT
            <span className="text-[var(--color-neon-pink)]">_KAUSHIK</span>
          </span>
        </div>

        <nav className="gap-8 lg:gap-10 hidden md:flex font-mono text-sm tracking-widest uppercase font-bold">
          <a
            href="#about"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-neon-yellow)] hover:text-glow-yellow transition-all"
          >
            About
          </a>
          <a
            href="#skills"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-neon-cyan)] hover:text-glow-cyan transition-all"
          >
            Skills
          </a>
          <a
            href="#projects"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-neon-pink)] hover:text-glow-pink transition-all"
          >
            PROJECTS
          </a>
          <a
            href="#experience"
            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-neon-purple)] transition-all"
          >
            Training
          </a>
          <a
            href="#activities"
            className="text-[var(--color-on-surface-variant)] hover:text-white transition-all"
          >
            Ops
          </a>
          <a
            href="#contact"
            className="text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all px-4 py-1.5 cyber-clip border border-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.4)]"
          >
            Contact
          </a>
        </nav>

        <div className="hidden sm:block bg-[#00ff41]/10 border border-[#00ff41] px-3.5 py-1.5 rounded-sm text-xs animate-pulse font-mono tracking-widest text-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.2)]">
          SYSTEM_STATUS: ONLINE
        </div>
      </header>
    </div>
  );
}
