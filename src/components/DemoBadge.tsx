import { FlaskConical } from "lucide-react";

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      data-testid="demo-mode-badge"
      className={`inline-flex items-center gap-1.5 rounded-full bg-demo px-3 py-1 text-xs font-semibold text-demo-foreground ${className}`}
    >
      <FlaskConical className="size-3.5" />
      Demo Mode Active
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const healthy = status.toLowerCase() === "healthy";
  return (
    <span
      data-testid="status-badge"
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        healthy ? "bg-healthy text-healthy-foreground" : "bg-diseased text-diseased-foreground"
      }`}
    >
      {healthy ? "Healthy" : "Diseased"}
    </span>
  );
}
