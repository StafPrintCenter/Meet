import { Link } from "@tanstack/react-router";

export function SpcLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-deep font-display text-sm font-semibold text-primary-foreground">
        <span className="text-primary">S</span>
        <span className="sr-only">STAF PRINT CENTER</span>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-base font-semibold tracking-tight">
            SPC <span className="text-gradient-staf">Meet</span>
          </span>
          <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            STAF PRINT CENTER
          </span>
        </span>
      )}
    </Link>
  );
}

export function StatusPill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
      </span>
      Systèmes opérationnels
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <p>© {new Date().getFullYear()} STAF PRINT CENTER — SPC Meet. Usage interne et clients.</p>
        <nav className="flex items-center gap-4">
          <Link to="/terms" className="transition-colors hover:text-foreground">
            Conditions d'utilisation
          </Link>
        </nav>
      </div>
    </footer>
  );
}
