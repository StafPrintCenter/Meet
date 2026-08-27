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
