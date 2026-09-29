import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DemoBadge, StatusBadge } from "@/components/DemoBadge";
import { ResultCard } from "@/components/ResultCard";
import { clearScans, confidencePct, deleteScan, scansQuery, type ScanRecord } from "@/lib/scans";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan history — LeafLens" },
      {
        name: "description",
        content: "Search, review, export and delete your past leaf disease scans.",
      },
      { property: "og:title", content: "Scan history — LeafLens" },
      {
        property: "og:description",
        content: "A searchable archive of every leaf you have inspected with LeafLens.",
      },
    ],
  }),
  component: History,
});

function History() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(scansQuery);
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [active, setActive] = useState<ScanRecord | null>(null);

  const remove = useMutation({
    mutationFn: deleteScan,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["scans"] });
      toast.success("Scan deleted");
    },
    onError: (error: Error) => toast.error("Could not delete", { description: error.message }),
  });

  const clearAll = useMutation({
    mutationFn: clearScans,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["scans"] });
      toast.success("History cleared");
    },
    onError: (error: Error) => toast.error("Could not clear history", { description: error.message }),
  });

  const scans = (data ?? []).filter((scan) => {
    const matchesTerm = `${scan.plant} ${scan.disease}`.toLowerCase().includes(term.toLowerCase());
    const matchesStatus = status === "all" || scan.status.toLowerCase() === status;
    return matchesTerm && matchesStatus;
  });

  function exportJson() {
    const payload = (data ?? []).map(({ image_url: _image, ...rest }) => rest);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "leaflens-scans.json";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Scan data exported");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="overline">Archive</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Scan history
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportJson} data-testid="export-history-button">
            <Download className="size-4" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => clearAll.mutate()}
            disabled={clearAll.isPending || !(data ?? []).length}
            data-testid="clear-history-button"
          >
            <Trash2 className="size-4" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search plant or disease"
            className="pl-9"
            aria-label="Search scans"
            data-testid="history-search-input"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44" aria-label="Filter by status" data-testid="history-status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="healthy">Healthy only</SelectItem>
            <SelectItem value="diseased">Diseased only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="mt-10 flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : scans.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="history-grid">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-leaf"
            >
              <img src={scan.image_url} alt={`${scan.plant} leaf`} className="h-40 w-full object-cover" />
              <div className="space-y-2 p-4">
                <div className="flex items-center gap-2">
                  <StatusBadge status={scan.status} />
                  {scan.is_demo ? <DemoBadge /> : null}
                </div>
                <h3 className="font-display text-lg font-semibold leading-tight">{scan.plant}</h3>
                <p className="text-sm text-muted-foreground">{scan.disease}</p>
                <p className="font-mono text-sm">{confidencePct(scan.confidence)}% confidence</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(scan.created_at).toLocaleString()}
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActive(scan)}
                    data-testid={`inspect-${scan.id}`}
                  >
                    Inspect
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove.mutate(scan.id)}
                    aria-label={`Delete scan of ${scan.plant}`}
                    data-testid={`delete-${scan.id}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center">
          <p className="font-display text-xl font-semibold">Nothing here yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Scans you run will be archived here with their diagnosis and confidence.
          </p>
          <Button asChild className="mt-6">
            <Link to="/analyze">Analyze a leaf</Link>
          </Button>
        </div>
      )}

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-4xl overflow-y-auto sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Scan details</DialogTitle>
          </DialogHeader>
          {active ? <ResultCard scan={active} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
