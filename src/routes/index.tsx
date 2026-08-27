import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, KeyRound, Lock, ShieldCheck, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteFooter, SpcLogo, StatusPill } from "@/components/spc/Brand";
import { DEMO_ROOMS, findRoom } from "@/lib/meet-data";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPC Meet — Visioconférence STAF PRINT CENTER" },
      {
        name: "description",
        content:
          "SPC Meet, la visioconférence officielle de STAF PRINT CENTER. Rejoignez une réunion avec votre code d'accès ou votre lien d'invitation.",
      },
      { property: "og:title", content: "SPC Meet — Visioconférence STAF PRINT CENTER" },
      {
        property: "og:description",
        content:
          "Rejoignez votre réunion STAF PRINT CENTER avec un code d'accès ou un lien d'invitation.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const room = findRoom(code);
    if (!room) {
      toast.error("Code invalide", {
        description: "Vérifiez le code de réunion ou utilisez le lien reçu par invitation.",
      });
      return;
    }
    navigate({ to: "/room/$roomId/lobby", params: { roomId: room.id } });
  };

  return (
    <div className="paper-grid flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-5">
        <SpcLogo />
        <StatusPill />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-10">
        <div className="mx-auto w-full max-w-xl text-center">
          <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-5xl">
            Rejoignez votre réunion <span className="text-gradient-staf">SPC Meet</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
            Accès strictement contrôlé. Entrez le code de réunion communiqué par STAF PRINT CENTER,
            ou ouvrez directement votre lien d'invitation.
          </p>

          <form onSubmit={submit} className="surface-card mt-8 rounded-2xl p-5 text-left sm:p-6">
            <label htmlFor="code" className="flex items-center gap-2 text-sm font-medium">
              <KeyRound className="h-4 w-4 text-primary" />
              Code de réunion
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123-456"
                autoComplete="off"
                inputMode="text"
                className="h-12 flex-1 rounded-xl text-center font-display text-xl tracking-[0.25em] sm:text-left sm:tracking-[0.2em]"
              />
              <Button type="submit" size="lg" className="h-12 rounded-xl px-6">
                Rejoindre
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              6 à 9 caractères. Une salle d'attente peut s'appliquer selon les règles de l'hôte.
            </p>
          </form>

          <div className="mt-8 rounded-2xl border border-dashed border-border p-5 text-left">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Video className="h-4 w-4 text-primary" />
              Salons de démonstration (libre accès, pour tests)
            </p>
            <ul className="mt-3 space-y-2">
              {DEMO_ROOMS.map((room) => (
                <li key={room.id}>
                  <Link
                    to="/room/$roomId/lobby"
                    params={{ roomId: room.id }}
                    className="group flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{room.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        Code {room.code} · max {room.maxParticipants} participants
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/admin/meet">
              <Button variant="outline" size="lg" className="h-11 rounded-xl">
                <ShieldCheck className="mr-1 h-4 w-4" />
                Espace Staff & Formateurs
              </Button>
            </Link>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              La création de salons est réservée au personnel autorisé.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
