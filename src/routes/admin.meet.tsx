import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity, Ban, Clock, Link2Off, Radio, Users, Video, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MeetShell } from "@/components/site";
import { ALL_ROOMS, formatDuration, type Room } from "@/lib/meet-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/meet")({
  head: () => ({
    meta: [
      { title: "Supervision SPC Meet — Admin STAF PRINT CENTER" },
      {
        name: "description",
        content:
          "Tableau de supervision des salons SPC Meet : réunions en cours, statistiques d'usage et actions d'urgence.",
      },
      { property: "og:title", content: "Supervision SPC Meet — Admin" },
      {
        property: "og:description",
        content: "Salons en cours, statistiques et actions d'urgence SPC Meet.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminMeet,
});

type Row = Room & { closed?: boolean; revoked?: boolean };

function AdminMeet() {
  const [rooms, setRooms] = useState<Row[]>(() => ALL_ROOMS.map((r) => ({ ...r })));

  const stats = useMemo(() => {
    const live = rooms.filter((r) => r.status === "live" && !r.closed);
    const participants = live.reduce((acc, r) => acc + r.participants.length, 0);
    return {
      live: live.length,
      scheduled: rooms.filter((r) => r.status === "scheduled").length,
      participants,
      bandwidth: (participants * 1.4).toFixed(1),
    };
  }, [rooms]);

  const stop = (id: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, closed: true, status: "ended" } : r)),
    );
    toast.success("Réunion arrêtée à distance.");
  };

  const revoke = (id: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
            ...r,
            revoked: true,
            code: `${Math.floor(100 + Math.random() * 899)}-${Math.floor(100 + Math.random() * 899)}`,
          }
          : r,
      ),
    );
    toast.success("Lien révoqué, nouveau code d'accès généré.");
  };

  return (
    <div className="paper-grid flex min-h-screen flex-col">
      <PageHeader>
        <Badge className="rounded-full bg-slate-deep text-primary-foreground">
          <ShieldAlert className="mr-1 h-3 w-3 text-primary" />
          Super-Admin
        </Badge>
      </PageHeader>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Supervision SPC Meet</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Vue temps réel des salons de visioconférence STAF PRINT CENTER, avec actions d'urgence de
          fermeture et de révocation de liens.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<Radio className="h-4 w-4" />}
            label="Salons en cours"
            value={String(stats.live)}
          />
          <StatCard
            icon={<Users className="h-4 w-4" />}
            label="Participants actifs"
            value={String(stats.participants)}
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Réunions planifiées"
            value={String(stats.scheduled)}
          />
          <StatCard
            icon={<Activity className="h-4 w-4" />}
            label="Bande passante"
            value={`${stats.bandwidth} Mb/s`}
          />
        </div>

        <div className="surface-card mt-8 overflow-hidden rounded-2xl">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-display text-lg tracking-tight">Salons</h2>
          </div>
          <ul className="divide-y divide-border">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="flex flex-col gap-3 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{room.title}</p>
                    {room.closed ? (
                      <Badge variant="destructive" className="rounded-full">
                        Fermé
                      </Badge>
                    ) : room.status === "live" ? (
                      <Badge className="rounded-full bg-success text-primary-foreground">
                        En cours
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-full">
                        Planifié
                      </Badge>
                    )}
                    {room.demo && (
                      <Badge variant="outline" className="rounded-full">
                        Démo
                      </Badge>
                    )}
                    {room.revoked && (
                      <Badge variant="outline" className="rounded-full">
                        Lien révoqué
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {room.kind} · Hôte {room.hostName} · Code {room.code} ·{" "}
                    {room.participants.length}/{room.maxParticipants} participants
                    {room.status === "live" && !room.closed
                      ? ` · durée ${formatDuration(Date.now() - room.startedAt)}`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {room.demo && !room.closed && (
                    <Link to="/room/$roomId/lobby" params={{ roomId: room.id }}>
                      <Button variant="secondary" size="sm" className="rounded-xl">
                        <Video className="mr-1 h-3.5 w-3.5" />
                        Ouvrir
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => revoke(room.id)}
                  >
                    <Link2Off className="mr-1 h-3.5 w-3.5" />
                    Révoquer le lien
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-xl"
                    disabled={room.closed}
                    onClick={() => stop(room.id)}
                  >
                    <Ban className="mr-1 h-3.5 w-3.5" />
                    Arrêter
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <PageFooter />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="surface-card rounded-2xl p-4">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </p>
      <p className="mt-2 font-display text-2xl tracking-tight">{value}</p>
    </div>
  );
}
