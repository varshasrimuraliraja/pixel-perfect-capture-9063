import { AlertTriangle, Copy, Leaf, ShieldCheck, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DemoBadge, StatusBadge } from "@/components/DemoBadge";
import { confidencePct, type ScanRecord } from "@/lib/scans";

function List({ items, testId }: { items: string[]; testId: string }) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">Nothing reported for this scan.</p>;
  }
  return (
    <ul className="space-y-2" data-testid={testId}>
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ResultCard({ scan }: { scan: ScanRecord }) {
  const pct = confidencePct(scan.confidence);
  const lowConfidence = scan.confidence < 0.6;

  async function copySummary() {
    const text = [
      `Plant: ${scan.plant}`,
      `Diagnosis: ${scan.disease} (${scan.status})`,
      `Confidence: ${pct}%`,
      `Symptoms: ${scan.symptoms.join("; ")}`,
      `Treatment: ${scan.treatment.join("; ")}`,
      `Prevention: ${scan.prevention.join("; ")}`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    toast.success("Diagnosis copied to clipboard");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2" data-testid="result-card">
      <div className="overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-leaf">
        <img
          src={scan.image_url}
          alt={`${scan.plant} leaf analyzed`}
          className="w-full rounded-xl object-contain"
          data-testid="result-image"
        />
        <p className="px-1 pt-3 text-xs text-muted-foreground">
          Scanned {new Date(scan.created_at).toLocaleString()}
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={scan.status} />
          {scan.is_demo ? <DemoBadge /> : null}
          <Button variant="outline" size="sm" className="ml-auto" onClick={copySummary} data-testid="copy-diagnosis-button">
            <Copy className="size-4" />
            Copy
          </Button>
        </div>

        <div>
          <p className="overline">Detected plant</p>
          <h1
            className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl"
            data-testid="result-plant-name"
          >
            {scan.plant}
          </h1>
          <p className="mt-2 text-lg font-semibold text-primary" data-testid="result-disease-name">
            {scan.disease}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Diagnosis confidence</p>
            <p className="font-mono text-2xl font-bold" data-testid="confidence-score">
              {pct}%
            </p>
          </div>
          <Progress
            value={pct}
            className="mt-3"
            aria-label={`Diagnosis confidence ${pct} percent`}
            data-testid="confidence-meter"
          />
        </div>

        {lowConfidence ? (
          <div
            className="flex gap-3 rounded-2xl bg-demo p-4 text-sm text-demo-foreground"
            data-testid="low-confidence-warning"
          >
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <p>Low confidence – please upload a clearer leaf image with good lighting.</p>
          </div>
        ) : null}

        <Tabs defaultValue="symptoms">
          <TabsList data-testid="result-tabs">
            <TabsTrigger value="symptoms" data-testid="tab-symptoms">
              <Stethoscope className="size-4" />
              Symptoms
            </TabsTrigger>
            <TabsTrigger value="treatment" data-testid="tab-treatment">
              <Leaf className="size-4" />
              Treatment
            </TabsTrigger>
            <TabsTrigger value="prevention" data-testid="tab-prevention">
              <ShieldCheck className="size-4" />
              Prevention
            </TabsTrigger>
          </TabsList>
          <TabsContent value="symptoms" className="pt-4">
            <List items={scan.symptoms} testId="symptoms-list" />
          </TabsContent>
          <TabsContent value="treatment" className="pt-4">
            <List items={scan.treatment} testId="treatment-list" />
          </TabsContent>
          <TabsContent value="prevention" className="pt-4">
            <List items={scan.prevention} testId="prevention-list" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
