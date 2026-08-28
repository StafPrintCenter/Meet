import { Link } from "@tanstack/react-router";



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
