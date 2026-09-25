import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { supportedCrops } from "@/lib/leaf-images";

export function Footer() {
  return (
    <footer className="mt-24 bg-forest py-16 text-forest-foreground" data-testid="site-footer">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <Leaf className="size-5" />
            <span className="font-display text-lg font-bold">LeafLens</span>
          </div>
          <p className="mt-3 max-w-sm text-sm opacity-80">
            AI-assisted leaf inspection for growers and agronomists. Upload a leaf photo and get a
            diagnosis, treatment plan and prevention guidance in seconds.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Supported crops</h4>
          <ul className="mt-3 space-y-1 text-sm opacity-80">
            {supportedCrops.map((item) => (
              <li key={item.crop}>{item.crop}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Quick links</h4>
          <ul className="mt-3 space-y-1 text-sm opacity-80">
            <li>
              <Link to="/analyze">Analyze a leaf</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/history">Scan history</Link>
            </li>
            <li>
              <Link to="/about">How it works</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-7xl px-4 text-xs opacity-70 sm:px-6">
        <p>
          Agronomic disclaimer: LeafLens provides AI-generated guidance for informational purposes
          only. Confirm any diagnosis with a qualified agronomist or plant clinic before applying
          chemical treatments.
        </p>
        <p className="mt-3">© {new Date().getFullYear()} LeafLens. All rights reserved.</p>
      </div>
    </footer>
  );
}
