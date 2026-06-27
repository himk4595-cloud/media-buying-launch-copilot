import Nav from "@/components/Nav";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Agentic Media Buying
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
              Launch Copilot
            </h1>
          </div>

          <div className="rounded-full border border-emerald-400/30 px-4 py-2 text-sm text-emerald-300">
            AI Launch Workflow
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Estimated time saved</p>
            <p className="mt-3 text-4xl font-bold">37 min</p>
            <p className="mt-2 text-sm text-slate-400">
              Per campaign launch packet
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">QA checks</p>
            <p className="mt-3 text-4xl font-bold">12</p>
            <p className="mt-2 text-sm text-slate-400">
              Naming, tracking, budget, compliance
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Output</p>
            <p className="mt-3 text-4xl font-bold">JSON</p>
            <p className="mt-2 text-sm text-slate-400">
              Ready for upload workflows
            </p>
          </div>
        </div>

        <div className="mt-8 grid flex-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">
              Build launch-ready campaign packets in minutes.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              This tool helps a media buyer turn a campaign idea into a
              structured launch packet with campaign naming, audience angles,
              ad copy, landing page hooks, UTM links, QA checks, and an
              exportable payload.
            </p>

            <div className="mt-8 rounded-2xl bg-slate-900 p-5">
              <p className="text-sm font-semibold text-emerald-300">
                Why this matters
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Media buying teams move fast. Small launch mistakes like broken
                tracking, inconsistent naming, weak creative angles, or missing
                compliance notes can waste spend and slow down testing. This
                copilot compresses the launch workflow and adds deterministic
                QA before campaigns go live.
              </p>
            </div>

            <a
              href="/new"
              className="mt-8 inline-block rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Create launch packet
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">Launch Workflow</h2>

            <div className="mt-6 space-y-4">
              {[
                "Campaign brief intake",
                "AI-generated launch packet",
                "Pre-flight QA review",
                "Tracking and UTM validation",
                "Export-ready campaign payload",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
              <p className="text-sm font-semibold text-amber-200">
                Built for launch speed
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-100/80">
                Turn a rough campaign idea into a structured, QA-reviewed launch
packet that media buyers can review, export, and hand off for execution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}