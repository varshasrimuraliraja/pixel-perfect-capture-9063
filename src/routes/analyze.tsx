import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LeafDropzone } from "@/components/LeafDropzone";
import { SampleSelector } from "@/components/SampleSelector";
import { DemoBadge } from "@/components/DemoBadge";
import { analyzeLeaf } from "@/lib/analysis.functions";
import { fileToCompressedDataUrl } from "@/lib/scans";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze a leaf — LeafLens" },
      {
        name: "description",
        content:
          "Upload or pick a leaf image and run an AI disease diagnosis with confidence scoring.",
      },
      { property: "og:title", content: "Analyze a leaf — LeafLens" },
      {
        property: "og:description",
        content: "Drop in a leaf photo and get a diagnosis, treatment plan and prevention steps.",
      },
    ],
  }),
  component: Analyze,
});

function Analyze() {
  const runAnalysis = useServerFn(analyzeLeaf);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [scanning, setScanning] = useState(false);

  async function handleFile(file: File) {
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setPreview(dataUrl);
      toast.success("Image ready", { description: "Press Detect disease to run the scan." });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that image");
    }
  }

  async function handleSample(url: string, label: string) {
    setPreview(url);
    toast.success(`${label} loaded`, { description: "Press Detect disease to run the scan." });
  }

  async function detect() {
    if (!preview) {
      toast.error("Add a leaf image first");
      return;
    }
    setScanning(true);
    try {
      const scan = await runAnalysis({ data: { image: preview, demo: demoMode } });
      await queryClient.invalidateQueries({ queryKey: ["scans"] });
      toast.success("Analysis complete", { description: `${scan.plant} — ${scan.disease}` });
      navigate({ to: "/result", search: { id: scan.id } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Analysis failed";
      if (message === "rate_limited") {
        toast.error("Too many scans right now", { description: "Wait a moment and try again." });
      } else if (message === "credits_exhausted") {
        toast.error("AI credits exhausted", { description: "Top up credits to keep scanning." });
      } else {
        toast.error("Analysis failed", { description: message });
      }
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="overline">Leaf inspection</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Analyze a leaf
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            One leaf per photo, in daylight, filling most of the frame. JPG, PNG or WEBP up to 10 MB.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <Switch
            id="demo-mode"
            checked={demoMode}
            onCheckedChange={setDemoMode}
            data-testid="demo-mode-toggle"
          />
          <Label htmlFor="demo-mode" className="text-sm">
            Demo mode
          </Label>
        </div>
      </div>

      {demoMode ? (
        <div className="mt-6 rounded-2xl bg-demo p-4 text-sm text-demo-foreground">
          <DemoBadge />
          <p className="mt-2">
            Demo mode returns a fixed sample diagnosis instead of a real AI reading, so you can try
            the flow without spending credits.
          </p>
        </div>
      ) : null}

      <div className="mt-8 space-y-8">
        <LeafDropzone
          preview={preview}
          scanning={scanning}
          onFile={handleFile}
          onClear={() => setPreview(null)}
        />

        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={detect}
          disabled={scanning || !preview}
          data-testid="detect-disease-btn"
        >
          {scanning ? <Loader2 className="size-5 animate-spin" /> : <ScanLine className="size-5" />}
          {scanning ? "Analyzing leaf…" : "Detect disease"}
        </Button>

        <SampleSelector onPick={handleSample} />
      </div>
    </div>
  );
}
