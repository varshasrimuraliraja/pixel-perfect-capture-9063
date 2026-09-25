import { Link } from "@tanstack/react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/DemoBadge";
import { confidencePct, type ScanRecord } from "@/lib/scans";

export function ScanHistoryTable({ scans }: { scans: ScanRecord[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-leaf" data-testid="scan-history-table">
      <h3 className="font-display text-lg font-semibold">Recent scans</h3>
      <p className="text-sm text-muted-foreground">Your ten most recent leaf inspections</p>
      <div className="mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Leaf</TableHead>
              <TableHead>Plant</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Confidence</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scans.slice(0, 10).map((scan) => (
              <TableRow key={scan.id} data-testid={`scan-row-${scan.id}`}>
                <TableCell>
                  <Link to="/result" search={{ id: scan.id }} aria-label={`Open scan of ${scan.plant}`}>
                    <img src={scan.image_url} alt="" className="size-10 rounded-lg object-cover" />
                  </Link>
                </TableCell>
                <TableCell className="font-medium">{scan.plant}</TableCell>
                <TableCell className="max-w-56 truncate">{scan.disease}</TableCell>
                <TableCell>
                  <StatusBadge status={scan.status} />
                </TableCell>
                <TableCell className="text-right font-mono">{confidencePct(scan.confidence)}%</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {new Date(scan.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {!scans.length ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No scans yet — analyze your first leaf to populate this table.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
