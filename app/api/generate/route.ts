import Groq from "groq-sdk";

function extractJson(text: string) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("AI did not return JSON.");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

export async function POST(request: Request) {
  try {
    const brief = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "Missing GROQ_API_KEY. Check your .env.local file." },
        { status: 500 },
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
You are an expert media buying launch strategist for an affiliate marketing team.

Create a launch-ready campaign packet from this campaign brief.

Campaign brief:
${JSON.stringify(brief, null, 2)}

Return ONLY valid JSON. Do not include markdown. Do not include explanations.

The JSON must match this exact shape:
{
  "campaignName": "string",
  "adGroupStructure": [
    {
      "name": "string",
      "strategy": "string"
    }
  ],
  "audienceAngles": ["string"],
  "headlines": ["string"],
  "primaryText": ["string"],
  "landingPageHook": "string",
  "utmLinks": ["string"],
  "exportPayload": {
    "platform": "string",
    "campaign_name": "string",
    "offer_name": "string",
    "objective": "string",
    "daily_budget": "string",
    "landing_page_url": "string",
    "status": "draft"
  }
}

Rules:
- Generate exactly 3 ad groups.
- Generate exactly 5 audience angles.
- Generate exactly 10 headlines.
- Generate exactly 5 primary text options.
- Generate exactly 3 UTM links.
- Campaign name must include platform, offer slug, date, and objective.
- UTM links must include utm_source, utm_medium, utm_campaign, and utm_content.
- Avoid risky claims like guaranteed, cure, instant, or free money.
- Keep the copy practical and compliant.
- Use today's date in the campaign name: ${new Date().toISOString().slice(0, 10)}.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are a careful marketing operations assistant. You only return valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    const text = completion.choices[0]?.message?.content || "";
    console.log("Raw Groq response:", text);

    const jsonText = extractJson(text);
    const generatedPacket = JSON.parse(jsonText);

    return Response.json({
      brief,
      ...generatedPacket,
      createdAt: new Date().toISOString(),
      generationMode: "groq",
    });
  } catch (error) {
    console.error("Groq generation failed:", error);

    const message =
      error instanceof Error ? error.message : "Unknown Groq error.";

    return Response.json(
      {
        error: `Groq generation failed: ${message}`,
      },
      { status: 500 },
    );
  }
}