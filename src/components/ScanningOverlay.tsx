export function ScanningOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl bg-forest/20"
      role="status"
      aria-label="Analyzing leaf image"
      data-testid="scanning-overlay"
    >
      <div className="scan-beam motion-reduce:animate-none" />
    </div>
  );
}
