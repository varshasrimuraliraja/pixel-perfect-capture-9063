import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  image: z.string().min(16),
  demo: z.boolean().optional(),
});

export type ScanRecord = {
  id: string;
  image_url: string;
  plant: string;
  disease: string;
  status: string;
  confidence: number;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  is_demo: boolean;
  created_at: string;
};

const SYSTEM_PROMPT = `You are an expert plant pathologist and agronomist. You inspect a photo of a plant leaf and return a structured diagnosis.
Reply with ONLY a JSON object, no markdown fences, using exactly these keys:
{"plant": string, "disease": string, "status": "Healthy" | "Diseased", "confidence": number between 0 and 1, "symptoms": string[], "treatment": string[], "prevention": string[]}
If the leaf looks healthy, set disease to "Healthy" and status to "Healthy".
If the image is not a plant leaf or is too unclear to diagnose, set plant to "Unknown", disease to "Undetermined", status to "Diseased" only when damage is visible, and confidence below 0.5.
Keep each list to 3-5 short, practical bullet strings.`;

function demoResult() {
  return {
    plant: "Tomato",
    disease: "Early Blight (Alternaria solani)",
    status: "Diseased" as const,
    confidence: 0.82,
    symptoms: [
      "Dark concentric brown lesions on lower leaves",
      "Yellow halo (chlorosis) around each spot",
      "Progressive defoliation from the base upward",
    ],
    treatment: [
      "Remove and destroy affected lower leaves",
      "Apply a copper or chlorothalonil-based fungicide every 7-10 days",
      "Improve airflow by staking and pruning dense growth",
    ],
    prevention: [
      "Rotate solanaceous crops on a 2-3 year cycle",
      "Mulch to stop soil splash onto foliage",
      "Water at the base early in the day, never overhead at dusk",
    ],
  };
}

export const analyzeLeaf = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<ScanRecord> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    let result = demoResult();
    let isDemo = true;

    if (!data.demo && apiKey) {
      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3.8-flash",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              {
                role: "user",
                content: [
                  { type: "text", text: "Diagnose this leaf." },
                  { type: "image_url", image_url: { url: data.image } },
                ],
              },
            ],
          }),
        });

        if (!response.ok) {
          const detail = await response.text();
          console.error("AI gateway error", response.status, detail);
          if (response.status === 429) throw new Error("rate_limited");
          if (response.status === 402) throw new Error("credits_exhausted");
        } else {
          const payload = (await response.json()) as {
            choices?: { message?: { content?: string } }[];
          };
          const raw = payload.choices?.[0]?.message?.content ?? "";
          const jsonText = raw.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(jsonText) as Record<string, unknown>;
          const toList = (value: unknown) =>
            Array.isArray(value) ? value.map((item) => String(item)).slice(0, 6) : [];
          result = {
            plant: String(parsed["plant"] ?? "Unknown"),
            disease: String(parsed["disease"] ?? "Undetermined"),
            status: String(parsed["status"]).toLowerCase() === "healthy" ? "Healthy" : "Diseased",
            confidence: Math.max(0, Math.min(1, Number(parsed["confidence"]) || 0)),
            symptoms: toList(parsed["symptoms"]),
            treatment: toList(parsed["treatment"]),
            prevention: toList(parsed["prevention"]),
          } as ReturnType<typeof demoResult>;
          isDemo = false;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown";
        if (message === "rate_limited" || message === "credits_exhausted") throw error;
        console.error("Leaf analysis failed, falling back to demo result", error);
      }
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inserted, error } = await supabaseAdmin
      .from("scans")
      .insert({
        image_url: data.image,
        plant: result.plant,
        disease: result.disease,
        status: result.status,
        confidence: result.confidence,
        symptoms: result.symptoms,
        treatment: result.treatment,
        prevention: result.prevention,
        is_demo: isDemo,
      })
      .select()
      .single();

    if (error || !inserted) {
      throw new Error(error?.message ?? "Could not save the scan");
    }

    return inserted as ScanRecord;
  });
