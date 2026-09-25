import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, Leaf, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { leafImages } from "@/lib/leaf-images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeafLens — Spot plant disease from a single leaf photo" },
      {
        name: "description",
        content:
          "LeafLens inspects a leaf photo with AI and returns the plant, likely disease, confidence, treatment and prevention steps.",
      },
      { property: "og:title", content: "LeafLens — Spot plant disease from a single leaf photo" },
      {
        property: "og:description",
        content:
          "AI leaf inspection for growers: diagnosis, confidence score, treatment plan and prevention guidance in seconds.",
      },
      { property: "og:image", content: leafImages.heroBotanical },
      { name: "twitter:image", content: leafImages.heroBotanical },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: ScanLine,
    title: "AI detection",
    body: "A vision model reads lesion shape, colour and distribution to name the plant and the likely pathogen.",
  },
  {
    icon: Activity,
    title: "Disease insights",
    body: "Every scan lists the symptoms the model actually saw, with a confidence score you can challenge.",
  },
  {
    icon: ShieldCheck,
    title: "Treatment guidance",
    body: "Practical treatment and prevention steps, written for the field rather than the lab.",
  },
];

const steps = [
  { step: "01", title: "Capture", body: "Photograph one leaf in daylight against a plain background." },
  { step: "02", title: "Upload", body: "Drop the image in, or start from a built-in sample leaf." },
  { step: "03", title: "Diagnose", body: "The model returns plant, disease, status and confidence." },
  { step: "04", title: "Act", body: "Follow the treatment plan and log the scan to your history." },
];

function Index() {
  return (
    <div>
      <section className="leaf-pattern">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-mint-foreground">
              <Sparkles className="size-3.5" />
              AI crop diagnostics
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Know what's wrong with your crop before it spreads.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              LeafLens inspects a single leaf photo and returns the plant, the likely disease, a
              confidence score, and the treatment and prevention steps that follow from it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" data-testid="hero-analyze-button">
                <Link to="/analyze">
                  <ScanLine className="size-5" />
                  Analyze a leaf
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="hero-about-button">
                <Link to="/about">
                  How it works
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full glass-panel px-4 py-2 text-sm">
              <span className="size-2 animate-pulse rounded-full bg-primary motion-reduce:animate-none" />
              6 crop families · 20+ diseases · confidence-scored output
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border shadow-leaf-lg">
              <img
                src={leafImages.heroBotanical}
                alt="Macro photograph of a healthy leaf with water droplets"
                className="h-[26rem] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 rounded-2xl glass-panel px-5 py-4">
              <p className="overline">Live inspection</p>
              <p className="mt-1 font-mono text-2xl font-bold">98.2%</p>
              <p className="text-xs text-muted-foreground">healthy-tissue coverage</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-1 hover:shadow-leaf motion-reduce:hover:translate-y-0"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-mint text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl bg-mint p-8 sm:p-12">
          <p className="overline">Workflow</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Four steps from photo to treatment plan
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div key={item.step} className="rounded-2xl bg-card p-5">
                <p className="font-mono text-sm text-primary">{item.step}</p>
                <h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild data-testid="workflow-cta">
              <Link to="/analyze">
                <Leaf className="size-4" />
                Start a scan
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
