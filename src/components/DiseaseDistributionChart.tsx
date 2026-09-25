import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ScanRecord } from "@/lib/scans";

export function DiseaseDistributionChart({ scans }: { scans: ScanRecord[] }) {
  const counts = new Map<string, number>();
  scans.forEach((scan) => {
    const key = scan.disease || "Unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  const data = [...counts.entries()]
    .map(([disease, count]) => ({ disease: disease.length > 18 ? `${disease.slice(0, 17)}…` : disease, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-leaf" data-testid="disease-distribution-chart">
      <h3 className="font-display text-lg font-semibold">Disease frequency</h3>
      <p className="text-sm text-muted-foreground">Most common diagnoses across your scans</p>
      <div className="mt-4 h-72">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="disease" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                  color: "var(--color-card-foreground)",
                }}
              />
              <Bar dataKey="count" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="pt-16 text-center text-sm text-muted-foreground">No scans yet.</p>
        )}
      </div>
    </div>
  );
}
