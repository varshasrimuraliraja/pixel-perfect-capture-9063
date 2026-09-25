import { Link } from "@tanstack/react-router";
import { Leaf, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/analyze", label: "Analyze" },
  { to: "/result", label: "Result" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-border glass-panel"
      data-testid="site-header"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" data-testid="brand-link">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">LeafLens</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-testid={`nav-${link.label.toLowerCase()}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-mint hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[status=active]:bg-mint data-[status=active]:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm" className="ml-auto md:ml-2" data-testid="header-cta">
          <Link to="/analyze">
            <ScanLine className="size-4" />
            Analyze Leaf
          </Link>
        </Button>
      </div>
    </header>
  );
}
