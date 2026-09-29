import { createFileRoute } from "@tanstack/react-router";
import { leafImages, supportedCrops } from "@/lib/leaf-images";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "How LeafLens works — AI crop diagnostics guide" },
      {
        name: "description",
        content:
          "The LeafLens classification pipeline, supported crops and diseases, confidence guidelines and agronomic disclaimer.",
      },
      { property: "og:title", content: "How LeafLens works — AI crop diagnostics guide" },
      {
        property: "og:description",
        content:
          "Understand the classification pipeline, supported crop taxonomy and how to read confidence scores.",
      },
      { property: "og:image", content: leafImages.field },
      { name: "twitter:image", content: leafImages.field },
    ],
  }),
  component: About,
});

const pipeline = [
  { title: "Pre-processing", body: "The photo is resized and normalised so leaf tissue fills the frame consistently." },
  { title: "Vision reading", body: "A multimodal model describes lesion colour, shape, margin and distribution." },
  { title: "Classification", body: "Those features are matched against known crop-disease patterns to name the pathogen." },
  { title: "Agronomic mapping", body: "The diagnosis is turned into treatment and prevention steps you can apply in the field." },
];

const confidenceBands = [
  { band: "85 – 100%", meaning: "Strong match. Treat as a working diagnosis and act." },
  { band: "60 – 84%", meaning: "Probable match. Cross-check against a second leaf or photo." },
  { band: "Below 60%", meaning: "Unreliable. Re-shoot in daylight with the leaf filling the frame." },
];

function About() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <p className="overline">Guide</p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        How LeafLens reads a leaf
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        LeafLens is an assistive diagnostic tool. It does not replace a lab test — it gives you a
        fast, structured first opinion so you can act before a problem spreads through the block.
      </p>

      <div className="mt-10 overflow-hidden rounded-3xl border border-border shadow-leaf">
        <img
          src={leafImages.field}
          alt="Farmer inspecting crops in a field"
          className="h-72 w-full object-cover"
        />
      </div>

      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold tracking-tight">Classification pipeline</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pipeline.map((stage, index) => (
            <div key={stage.title} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-mono text-sm text-primary">{String(index + 1).padStart(2, "0")}</p>
              <h4 className="mt-2 font-display text-lg font-semibold">{stage.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{stage.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold tracking-tight">Supported crops</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supportedCrops.map((item) => (
            <div key={item.crop} className="rounded-2xl bg-mint p-5">
              <h4 className="font-display text-lg font-semibold text-mint-foreground">{item.crop}</h4>
              <ul className="mt-2 space-y-1 text-sm text-mint-foreground/80">
                {item.diseases.map((disease) => (
                  <li key={disease}>{disease}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold tracking-tight">Reading confidence</h3>
        <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
          {confidenceBands.map((band) => (
            <div key={band.band} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:gap-6">
              <p className="font-mono text-sm font-semibold text-primary sm:w-32">{band.band}</p>
              <p className="text-sm text-muted-foreground">{band.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl bg-demo p-6 text-sm text-demo-foreground">
        <h3 className="font-display text-lg font-semibold">Agronomic disclaimer</h3>
        <p className="mt-2">
          Diagnoses are AI-generated and may be wrong. Always confirm with a qualified agronomist or
          plant clinic before applying pesticides or fungicides, and follow local regulations and
          label rates for any product you use.
        </p>
      </section>
    </div>
  );
}
