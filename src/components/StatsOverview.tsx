import { Activity, Bug, Gauge, ScanLine } from "lucide-react";
import { confidencePct, type ScanRecord } from "@/lib/scans";

export function StatsOverview({ scans }: { scans: ScanRecord[] }) {
  const total = scans.length;
  const healthy = scans.filter((scan) => scan.status.toLowerCase() === "healthy").length;
  const diseased = total - healthy;
  const avgConfidence = total
    ? confidencePct(scans.reduce((sum, scan) => sum + Number(scan.confidence), 0) / total)
    : 0;

  const cards = [
    { label: "Total scans", value: String(total), icon: ScanLine, testId: "stat-total-scans" },
    {
      label: "Healthy rate",
      value: `${total ? Math.round((healthy / total) * 100) : 0}%`,
      icon: Activity,
      testId: "stat-healthy-rate",
    },
    { label: "Diseased count", value: String(diseased), icon: Bug, testId: "stat-diseased-count" },
    { label: "Avg confidence", value: `${avgConfidence}%`, icon: Gauge, testId: "stat-avg-confidence" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="stats-overview">
      {cards.map((card) => (
        <div
          key={card.label}
          data-testid={card.testId}
          className="rounded-2xl border border-border bg-card p-5 shadow-leaf"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <card.icon className="size-4 text-primary" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
