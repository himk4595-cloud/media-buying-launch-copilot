"use client";

import Nav from "@/components/Nav";
import { useEffect, useState } from "react";

type LaunchPacket = {
  brief: {
    platform: string;
    offerName: string;
    targetAudience: string;
    painPoint: string;
    desiredAction: string;
    dailyBudget: string;
    landingPageUrl: string;
    complianceNotes: string;
    campaignObjective: string;
  };
  campaignName: string;
  adGroupStructure: { name: string; strategy: string }[];
  audienceAngles: string[];
  headlines: string[];
  primaryText: string[];
  landingPageHook: string;
  utmLinks: string[];
  exportPayload: Record<string, string>;
  createdAt: string;
  generationMode?: string;
};

export default function LaunchPacketPage() {
  const [packet, setPacket] = useState<LaunchPacket | null>(null);

  useEffect(() => {
    const savedPacket = localStorage.getItem("launchPacket");

    if (savedPacket) {
      setPacket(JSON.parse(savedPacket));
    }
  }, []);

  if (!packet) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
          <Nav />
  <div className="px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">No launch packet found</h1>
          <p className="mt-3 text-slate-300">
            Create a campaign brief first, then generate a launch packet.
          </p>
          <a
            href="/new"
            className="mt-6 inline-block rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Create campaign brief
          </a>
        </div>
        </div>
      </main>
    );
  }

  const exportJson = JSON.stringify(packet.exportPayload, null, 2);

  function copyExportPayload() {
    navigator.clipboard.writeText(exportJson);
    alert("Export payload copied.");
  }

function downloadJson() {
  if (!packet) return;

  const blob = new Blob([JSON.stringify(packet, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${packet.campaignName}-launch-packet.json`;
  link.click();

  URL.revokeObjectURL(url);
}

  function downloadCsv() {
    if (!packet) return;
    const rows = [
      ["Field", "Value"],
      ["Campaign Name", packet.campaignName],
      ["Platform", packet.brief.platform],
      ["Offer Name", packet.brief.offerName],
      ["Target Audience", packet.brief.targetAudience],
      ["Pain Point", packet.brief.painPoint],
      ["Desired Action", packet.brief.desiredAction],
      ["Daily Budget", packet.brief.dailyBudget],
      ["Landing Page URL", packet.brief.landingPageUrl],
      ["Campaign Objective", packet.brief.campaignObjective],
      ["Landing Page Hook", packet.landingPageHook],
      ["Headlines", packet.headlines.join(" | ")],
      ["Primary Text", packet.primaryText.join(" | ")],
      ["UTM Links", packet.utmLinks.join(" | ")],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${packet.campaignName}-launch-packet.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
    <Nav />
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <a
              href="/new"
              className="text-sm text-emerald-300 hover:text-emerald-200"
            >
              ← Back to brief
            </a>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Generated Packet
            </p>
            <h1 className="mt-3 text-4xl font-bold">Launch Packet</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              A structured media buying launch packet generated from the campaign
              brief. Run QA before exporting the packet for launch prep.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/qa"
              className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Run QA review
            </a>
            <button
              onClick={copyExportPayload}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Copy JSON
            </button>

            <button
              onClick={downloadJson}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Download JSON
            </button>

            <button
              onClick={downloadCsv}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Download CSV
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
    <div>
      <p className="text-sm text-slate-400">Campaign name</p>
      <p className="mt-2 break-words text-2xl font-semibold text-white">
        {packet.campaignName}
      </p>
    </div>

    <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
      Generated by: {packet.generationMode === "groq" ? "Groq AI" : "Fallback Engine"}
    </div>
  </div>
</div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Section title="Campaign brief">
            <Detail label="Platform" value={packet.brief.platform} />
            <Detail label="Offer" value={packet.brief.offerName} />
            <Detail label="Audience" value={packet.brief.targetAudience} />
            <Detail label="Pain point" value={packet.brief.painPoint} />
            <Detail label="Desired action" value={packet.brief.desiredAction} />
            <Detail
              label="Daily budget"
              value={`$${packet.brief.dailyBudget}`}
            />
          </Section>

          <Section title="Landing page hook">
            <p className="text-slate-200">{packet.landingPageHook}</p>
          </Section>

          <Section title="Ad group structure">
            <div className="space-y-4">
              {packet.adGroupStructure.map((group) => (
                <div
                  key={group.name}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-4"
                >
                  <p className="font-semibold text-emerald-300">{group.name}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    {group.strategy}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Audience angles">
            <BulletList items={packet.audienceAngles} />
          </Section>

          <Section title="Headlines">
            <BulletList items={packet.headlines} />
          </Section>

          <Section title="Primary text">
            <BulletList items={packet.primaryText} />
          </Section>

          <Section title="UTM links">
            <div className="space-y-3">
              {packet.utmLinks.map((link) => (
                <p
                  key={link}
                  className="break-words rounded-xl bg-slate-900 p-3 text-sm text-slate-300"
                >
                  {link}
                </p>
              ))}
            </div>
          </Section>

          <Section title="Export payload">
            <pre className="overflow-x-auto rounded-2xl bg-slate-900 p-4 text-sm text-slate-200">
              {exportJson}
            </pre>
          </Section>
        </div>
      </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-slate-200">{value || "Not provided"}</p>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="rounded-xl bg-slate-900 p-3 text-slate-300">
          {item}
        </li>
      ))}
    </ul>
  );
}