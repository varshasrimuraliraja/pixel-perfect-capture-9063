import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { StatsOverview } from "@/components/StatsOverview";
import { DiseaseDistributionChart } from "@/components/DiseaseDistributionChart";
import { HealthStatusDonut } from "@/components/HealthStatusDonut";
import { ScanHistoryTable } from "@/components/ScanHistoryTable";
import { scansQuery } from "@/lib/scans";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Scan dashboard — LeafLens" },
      {
        name: "description",
        content:
          "Crop health telemetry: total scans, healthy rate, disease frequency and average confidence.",
      },
      { property: "og:title", content: "Scan dashboard — LeafLens" },
      {
        property: "og:description",
        content: "Track healthy vs diseased leaves, disease frequency and diagnosis confidence.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading } = useQuery(scansQuery);
  const scans = data ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <p className="overline">Telemetry</p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Dashboard</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Aggregated results across every leaf you have inspected.
      </p>

      {isLoading ? (
        <div className="mt-10 flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <StatsOverview scans={scans} />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DiseaseDistributionChart scans={scans} />
            </div>
            <HealthStatusDonut scans={scans} />
          </div>
          <ScanHistoryTable scans={scans} />
        </div>
      )}
    </div>
  );
}
