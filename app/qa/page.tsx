"use client";

import Nav from "@/components/Nav";
import { useEffect, useState } from "react";

type QAStatus = "Passed" | "Warning" | "Failed";

type QACheck = {
  name: string;
  status: QAStatus;
  message: string;
};

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
  headlines: string[];
  primaryText: string[];
  utmLinks: string[];
  exportPayload: Record<string, string>;
};

export default function QAReviewPage() {
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
            Create a campaign brief first, then run QA.
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

  const qaChecks = runQAChecks(packet);
  const passedCount = qaChecks.filter((check) => check.status === "Passed").length;
  const warningCount = qaChecks.filter((check) => check.status === "Warning").length;
  const failedCount = qaChecks.filter((check) => check.status === "Failed").length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
  <Nav />
  <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <a
              href="/packet"
              className="text-sm text-emerald-300 hover:text-emerald-200"
            >
              ← Back to launch packet
            </a>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Pre-flight Review
            </p>
            <h1 className="mt-3 text-4xl font-bold">Launch QA</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Deterministic checks for tracking, naming, budget, required fields,
              risky copy language, and compliance notes before a campaign goes
              live.
            </p>
          </div>

          <a
            href="/packet"
            className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            View packet
          </a>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <ScoreCard label="Passed" value={passedCount} />
          <ScoreCard label="Warnings" value={warningCount} />
          <ScoreCard label="Failed" value={failedCount} />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">Campaign name</p>
          <p className="mt-2 break-words text-2xl font-semibold">
            {packet.campaignName}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {qaChecks.map((check) => (
            <div
              key={check.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold">{check.name}</h2>
                  <p className="mt-2 text-sm text-slate-300">{check.message}</p>
                </div>

                <StatusBadge status={check.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </main>
  );
}

function runQAChecks(packet: LaunchPacket): QACheck[] {
  const checks: QACheck[] = [];
  const brief = packet.brief;
  const budget = Number(brief.dailyBudget);
  const riskyWords = ["guaranteed", "cure", "instant", "free money"];
  const allCopy = [...packet.headlines, ...packet.primaryText].join(" ").toLowerCase();

  const requiredFields = [
    { label: "Offer name", value: brief.offerName },
    { label: "Target audience", value: brief.targetAudience },
    { label: "Pain point", value: brief.painPoint },
    { label: "Desired action", value: brief.desiredAction },
    { label: "Landing page URL", value: brief.landingPageUrl },
    { label: "Campaign objective", value: brief.campaignObjective },
  ];

  const missingFields = requiredFields
    .filter((field) => !field.value.trim())
    .map((field) => field.label);

  checks.push({
    name: "Required campaign fields",
    status: missingFields.length === 0 ? "Passed" : "Failed",
    message:
      missingFields.length === 0
        ? "All required campaign brief fields are present."
        : `Missing required fields: ${missingFields.join(", ")}.`,
  });

  checks.push({
    name: "Campaign naming convention",
    status:
      packet.campaignName.toLowerCase().includes(brief.platform.toLowerCase()) &&
      /\d{4}-\d{2}-\d{2}/.test(packet.campaignName)
        ? "Passed"
        : "Warning",
    message:
      "Campaign name should include platform, offer slug, date, and objective.",
  });

  checks.push({
    name: "Daily budget range",
    status:
      !budget || Number.isNaN(budget)
        ? "Failed"
        : budget < 50 || budget > 10000
          ? "Warning"
          : "Passed",
    message:
      !budget || Number.isNaN(budget)
        ? "Daily budget is missing or invalid."
        : budget < 50
          ? "Daily budget is under $50. This may be too low for meaningful testing."
          : budget > 10000
            ? "Daily budget is over $10,000. Confirm this is intentional before launch."
            : "Daily budget is within the expected launch range.",
  });

  checks.push({
    name: "Landing page URL",
    status: brief.landingPageUrl.startsWith("http") ? "Passed" : "Failed",
    message: brief.landingPageUrl.startsWith("http")
      ? "Landing page URL uses a valid web URL format."
      : "Landing page URL should start with http or https.",
  });

  const utmLinksValid = packet.utmLinks.every(
    (link) =>
      link.includes("utm_source=") &&
      link.includes("utm_medium=") &&
      link.includes("utm_campaign=") &&
      link.includes("utm_content="),
  );

  checks.push({
    name: "UTM tracking structure",
    status: utmLinksValid ? "Passed" : "Failed",
    message: utmLinksValid
      ? "All generated links include source, medium, campaign, and content UTM parameters."
      : "One or more links are missing required UTM parameters.",
  });

  const foundRiskyWords = riskyWords.filter((word) => allCopy.includes(word));

  checks.push({
    name: "Risky marketing language",
    status: foundRiskyWords.length === 0 ? "Passed" : "Warning",
    message:
      foundRiskyWords.length === 0
        ? "No obvious risky marketing words were found in generated copy."
        : `Review potentially risky words before launch: ${foundRiskyWords.join(", ")}.`,
  });

  checks.push({
    name: "Compliance notes",
    status: brief.complianceNotes.trim().length > 0 ? "Passed" : "Warning",
    message:
      brief.complianceNotes.trim().length > 0
        ? "Compliance notes are present for the launch packet."
        : "No compliance notes provided. Add platform or vertical-specific restrictions before launch.",
  });

  const longHeadlines = packet.headlines.filter((headline) => headline.length > 80);

  checks.push({
    name: "Headline length",
    status: longHeadlines.length === 0 ? "Passed" : "Warning",
    message:
      longHeadlines.length === 0
        ? "All generated headlines are within a practical review length."
        : `${longHeadlines.length} headline(s) may be too long for ad platform usage.`,
  });

  return checks;
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-4xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: QAStatus }) {
  const className =
    status === "Passed"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      : status === "Warning"
        ? "border-amber-300/30 bg-amber-300/10 text-amber-200"
        : "border-red-400/30 bg-red-400/10 text-red-300";

  return (
    <span
      className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${className}`}
    >
      {status}
    </span>
  );
}