import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/ResultCard";
import { scansQuery } from "@/lib/scans";

export const Route = createFileRoute("/result")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search["id"] === "string" ? search["id"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Diagnosis result — LeafLens" },
      {
        name: "description",
        content:
          "Full leaf diagnosis: plant, disease, confidence score, symptoms, treatment and prevention.",
      },
      { property: "og:title", content: "Diagnosis result — LeafLens" },
      {
        property: "og:description",
        content: "Review the AI diagnosis for your leaf scan with treatment and prevention steps.",
      },
    ],
  }),
  component: Result,
});

function Result() {
  const { id } = Route.useSearch();
  const { data, isLoading } = useQuery(scansQuery);
  const scan = id ? data?.find((item) => item.id === id) : data?.[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <p className="overline">Diagnostic report</p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Leaf diagnosis
      </h2>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex h-72 items-center justify-center rounded-2xl border border-border bg-card">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : scan ? (
          <ResultCard scan={scan} />
        ) : (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="font-display text-xl font-semibold">No diagnosis yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Run your first leaf scan and the full report will appear here.
            </p>
            <Button asChild className="mt-6" data-testid="empty-result-cta">
              <Link to="/analyze">
                <ScanLine className="size-4" />
                Analyze a leaf
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
