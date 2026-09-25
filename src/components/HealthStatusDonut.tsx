import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ScanRecord } from "@/lib/scans";

export function HealthStatusDonut({ scans }: { scans: ScanRecord[] }) {
  const healthy = scans.filter((scan) => scan.status.toLowerCase() === "healthy").length;
  const diseased = scans.length - healthy;
  const data = [
    { name: "Healthy", value: healthy, color: "var(--color-chart-1)" },
    { name: "Diseased", value: diseased, color: "var(--color-chart-5)" },
  ].filter((entry) => entry.value > 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-leaf" data-testid="health-status-donut">
      <h3 className="font-display text-lg font-semibold">Health status</h3>
      <p className="text-sm text-muted-foreground">Healthy vs diseased leaves</p>
      <div className="mt-4 h-72">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={3}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="var(--color-card)" />
                ))}
              </Pie>
              <Legend />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                  color: "var(--color-card-foreground)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="pt-16 text-center text-sm text-muted-foreground">No scans yet.</p>
        )}
      </div>
    </div>
  );
}
