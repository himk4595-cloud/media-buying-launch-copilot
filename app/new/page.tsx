"use client";

import Nav from "@/components/Nav";
import { useRouter } from "next/navigation";
import { useState } from "react";

const emptyBrief = {
  platform: "Meta",
  offerName: "",
  targetAudience: "",
  painPoint: "",
  desiredAction: "",
  dailyBudget: "",
  landingPageUrl: "",
  complianceNotes: "",
  campaignObjective: "",
};

export default function NewCampaignBriefPage() {
  const router = useRouter();
  const [brief, setBrief] = useState(emptyBrief);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  function updateBrief(field: string, value: string) {
    setBrief((currentBrief) => ({
      ...currentBrief,
      [field]: value,
    }));
  }

  function loadSampleBrief() {
    setBrief({
      platform: "Taboola",
      offerName: "Retirement Planning Guide",
      targetAudience: "Adults 55+ researching retirement income options",
      painPoint: "They are worried about outliving their savings.",
      desiredAction: "Submit email and phone number to receive the guide",
      dailyBudget: "500",
      landingPageUrl: "https://example.com/retirement-guide",
      complianceNotes:
        "Avoid guaranteed income claims. Do not imply financial advice.",
      campaignObjective: "Generate qualified retirement planning leads",
    });
  }

async function generateLaunchPacket() {
  setIsGenerating(true);
  setError("");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(brief),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gemini failed.");
    }

    localStorage.setItem("launchPacket", JSON.stringify(data));
    router.push("/packet");
  } catch (error) {
    console.warn("Gemini failed. Using deterministic fallback.", error);

    const fallbackPacket = createFallbackLaunchPacket(brief);

    localStorage.setItem("launchPacket", JSON.stringify(fallbackPacket));
    router.push("/packet");
  } finally {
    setIsGenerating(false);
  }
}

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    generateLaunchPacket();
  }

  function createFallbackLaunchPacket(campaignBrief: typeof emptyBrief) {
  const today = new Date().toISOString().slice(0, 10);
  const cleanOfferName = campaignBrief.offerName || "Untitled Offer";
  const offerSlug = cleanOfferName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const campaignName = `${campaignBrief.platform}_${offerSlug}_${today}_leadgen`;

  return {
    brief: campaignBrief,
    campaignName,
    adGroupStructure: [
      {
        name: `${campaignName}_angle_problem-aware`,
        strategy:
          "Audience is aware of the problem and needs a clear reason to take the next step.",
      },
      {
        name: `${campaignName}_angle_solution-aware`,
        strategy:
          "Audience is comparing possible solutions and needs a practical, low-friction offer.",
      },
      {
        name: `${campaignName}_angle_education`,
        strategy:
          "Audience responds to simple educational framing before making a decision.",
      },
    ],
    audienceAngles: [
      `People experiencing this pain point: ${campaignBrief.painPoint || "unknown pain point"}`,
      `People who want this outcome: ${campaignBrief.campaignObjective || "the campaign objective"}`,
      `People likely to respond to this action: ${campaignBrief.desiredAction || "the desired action"}`,
      `People researching options related to ${cleanOfferName}`,
      `People who need a simple, low-friction next step`,
    ],
    headlines: [
      `A Simple Guide for ${campaignBrief.targetAudience || "Your Audience"}`,
      `What to Know Before You Take the Next Step`,
      `New Resource: ${cleanOfferName}`,
      `Avoid Common Mistakes Around ${cleanOfferName}`,
      `See If This Guide Is Right for You`,
      `Understand Your Options More Clearly`,
      `A Practical Resource You Can Review Today`,
      `Learn What Matters Before You Decide`,
      `Get the Free Guide`,
      `Start With This Simple Resource`,
    ],
    primaryText: [
      `If you're ${campaignBrief.targetAudience || "in this audience"}, this resource can help you better understand your options.`,
      `Many people struggle with this: ${campaignBrief.painPoint || "the core problem"}. This guide gives you a simple next step.`,
      `Get access to ${cleanOfferName} and learn what to consider before making a decision.`,
      `This resource is designed to make the next step easier to understand.`,
      `Review the guide and see whether it fits your situation.`,
    ],
    landingPageHook: `Get the ${cleanOfferName} and learn what matters before you take the next step.`,
    utmLinks: [
      `${campaignBrief.landingPageUrl || "https://example.com"}?utm_source=${campaignBrief.platform.toLowerCase()}&utm_medium=paid&utm_campaign=${campaignName}&utm_content=problem-aware`,
      `${campaignBrief.landingPageUrl || "https://example.com"}?utm_source=${campaignBrief.platform.toLowerCase()}&utm_medium=paid&utm_campaign=${campaignName}&utm_content=solution-aware`,
      `${campaignBrief.landingPageUrl || "https://example.com"}?utm_source=${campaignBrief.platform.toLowerCase()}&utm_medium=paid&utm_campaign=${campaignName}&utm_content=education`,
    ],
    exportPayload: {
      platform: campaignBrief.platform,
      campaign_name: campaignName,
      offer_name: cleanOfferName,
      objective: campaignBrief.campaignObjective,
      daily_budget: campaignBrief.dailyBudget,
      landing_page_url: campaignBrief.landingPageUrl,
      status: "draft",
    },
    createdAt: new Date().toISOString(),
    generationMode: "fallback",
  };
}

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />
      <div className="px-6 py-10">
        <div className="mx-auto max-w-5xl">
            <a href="/" className="text-sm text-emerald-300 hover:text-emerald-200">
            ← Back to dashboard
            </a>

            <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
                New Campaign
                </p>
                <h1 className="mt-3 text-4xl font-bold">Campaign Brief</h1>
                <p className="mt-3 max-w-2xl text-slate-300">
                Enter the core campaign details. The copilot will use this to
                generate a structured launch packet and run pre-flight QA checks.
                </p>
            </div>

            <button
                type="button"
                onClick={loadSampleBrief}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
                Load sample brief
            </button>
            </div>

            <form
            onSubmit={handleSubmit}
            className="mt-8 grid gap-5 rounded-3xl border border-white/10 bg-white/5 p-6"
            >
            <div>
                <label className="text-sm font-medium text-slate-200">
                Platform
                </label>
                <select
                value={brief.platform}
                onChange={(event) => updateBrief("platform", event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                >
                <option>Meta</option>
                <option>Google</option>
                <option>TikTok</option>
                <option>Taboola</option>
                </select>
            </div>

            <FormInput
                label="Offer name"
                value={brief.offerName}
                onChange={(value) => updateBrief("offerName", value)}
                placeholder="Example: Retirement Planning Guide"
            />

            <FormInput
                label="Target audience"
                value={brief.targetAudience}
                onChange={(value) => updateBrief("targetAudience", value)}
                placeholder="Example: Adults 55+ researching retirement income options"
            />

            <FormInput
                label="Pain point"
                value={brief.painPoint}
                onChange={(value) => updateBrief("painPoint", value)}
                placeholder="Example: Worried about outliving retirement savings"
            />

            <FormInput
                label="Desired action"
                value={brief.desiredAction}
                onChange={(value) => updateBrief("desiredAction", value)}
                placeholder="Example: Submit email and phone number"
            />

            <FormInput
                label="Daily budget"
                value={brief.dailyBudget}
                onChange={(value) => updateBrief("dailyBudget", value)}
                placeholder="Example: 500"
            />

            <FormInput
                label="Landing page URL"
                value={brief.landingPageUrl}
                onChange={(value) => updateBrief("landingPageUrl", value)}
                placeholder="https://example.com/offer"
            />

            <FormTextarea
                label="Compliance notes"
                value={brief.complianceNotes}
                onChange={(value) => updateBrief("complianceNotes", value)}
                placeholder="Claims to avoid, regulatory constraints, platform restrictions..."
            />

            <FormTextarea
                label="Campaign objective"
                value={brief.campaignObjective}
                onChange={(value) => updateBrief("campaignObjective", value)}
                placeholder="What should this campaign accomplish?"
            />

            {error ? (
                <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isGenerating}
                className="mt-3 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? "Generating launch packet..." : "Generate launch packet"}
              </button>
            </form>
        </div>
      </div>
    </main>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-200">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-200">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
      />
    </div>
  );
}