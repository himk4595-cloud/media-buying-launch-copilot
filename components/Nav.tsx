export default function Nav() {
  return (
    <nav className="border-b border-white/10 bg-slate-950/80 px-6 py-4 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <a href="/" className="font-semibold text-emerald-300">
          Launch Copilot
        </a>

        <div className="flex flex-wrap gap-3 text-sm">
          <a href="/" className="text-slate-300 hover:text-white">
            Dashboard
          </a>
          <a href="/new" className="text-slate-300 hover:text-white">
            New Brief
          </a>
          <a href="/packet" className="text-slate-300 hover:text-white">
            Launch Packet
          </a>
          <a href="/qa" className="text-slate-300 hover:text-white">
            QA Review
          </a>
        </div>
      </div>
    </nav>
  );
}