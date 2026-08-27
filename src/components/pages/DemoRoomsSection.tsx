import { Link } from "@tanstack/react-router";
import { ArrowRight, Video } from "lucide-react";
import { DEMO_ROOMS } from "@/lib/meet-data";

export function DemoRoomsSection() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-12 w-full">
      <div className="w-full rounded-2xl border border-dashed border-border bg-card/40 p-5 backdrop-blur-sm">
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Video className="h-3.5 w-3.5 text-primary" />
            Salons de démonstration publics
          </p>
          <span className="text-[11px] text-muted-foreground">
            Accès direct sans code requis
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_ROOMS.map((room) => (
            <Link
              key={room.id}
              to="/room/$roomId/lobby"
              params={{ roomId: room.id }}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-3 text-xs transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <div className="min-w-0">
                <span className="block truncate font-semibold text-foreground">
                  {room.title}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  Code: <code className="font-mono text-primary">{room.code}</code> · {room.maxParticipants} pers.
                </span>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}