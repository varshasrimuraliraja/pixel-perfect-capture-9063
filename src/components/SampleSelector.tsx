import { sampleLeaves } from "@/lib/leaf-images";

export function SampleSelector({ onPick }: { onPick: (url: string, label: string) => void }) {
  return (
    <div>
      <p className="overline">Sample leaves</p>
      <p className="mt-1 text-sm text-muted-foreground">
        No photo handy? Run a diagnosis on one of these in a single click.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {sampleLeaves.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onPick(sample.url, sample.label)}
            data-testid={`sample-${sample.id}`}
            className="group overflow-hidden rounded-xl border border-border bg-card text-left transition-transform hover:-translate-y-1 hover:shadow-leaf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
          >
            <img
              src={sample.url}
              alt={sample.label}
              loading="lazy"
              className="h-24 w-full object-cover"
            />
            <span className="block px-3 py-2">
              <span className="block text-sm font-semibold leading-tight">{sample.label}</span>
              <span className="block text-xs text-muted-foreground">{sample.hint}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
