import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, KeyRound, Lock, ShieldCheck, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE } from "@/data/site";
import { DEMO_ROOMS, findRoom } from "@/lib/meet-data";
import { toast } from "sonner";
import { MeetPreviewIllustration } from "./MeetPreviewIllustration";

export function HeroSection() {
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
    <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-10">
      {/* Colonne gauche — Formulaire de saisie & Navigation */}
      <div className="flex flex-col items-start text-left">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <Video className="h-3.5 w-3.5 text-primary" />
          Plateforme de visioconférence
        </span>

        <h1 className="mt-7 text-balance font-display text-4xl font-extralight leading-[1.08] tracking-tight sm:text-6xl">
          Rejoignez votre <br />
          réunion <span className="font-black text-primary">SPC Meet.</span>
        </h1>

        <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          Accès strictement contrôlé. Entrez le code de réunion communiqué par {SITE.name}, ou ouvrez directement votre lien d'invitation.
        </p>

        {/* Formulaire de saisie de code */}
        <form onSubmit={submit} className="mt-8 w-full rounded-2xl border border-border bg-card p-5 shadow-panel sm:p-6">
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
            <Button type="submit" size="lg" className="h-12 rounded-xl px-6 w-full sm:w-auto">
              Rejoindre
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            6 à 9 caractères. Une salle d'attente peut s'appliquer selon les règles de l'hôte.
          </p>
        </form>

        {/* Bouton Espace Staff & sécurité */}
        <div className="mt-6 flex flex-col items-start gap-3 w-full sm:flex-row sm:items-center">
          <Link to="/admin/meet" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="h-11 rounded-xl w-full sm:w-auto bg-card">
              <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
              Espace Staff & Formateurs
            </Button>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-success" />
            Création de salons réservée aux autorisés
          </div>
        </div>
      </div>

      {/* Colonne droite — Aperçu interactif du salon */}
      <div className="w-full flex flex-col gap-6">
        <MeetPreviewIllustration />

        {/* Salons de démonstration déplacés sous l'illustration pour garder la colonne épurée */}
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Video className="h-3.5 w-3.5 text-primary" />
            Salons de démonstration (Accès libre)
          </p>
          <ul className="mt-3 space-y-2">
            {DEMO_ROOMS.map((room) => (
              <li key={room.id}>
                <Link
                  to="/room/$roomId/lobby"
                  params={{ roomId: room.id }}
                  className="group flex items-center justify-between gap-3 rounded-xl bg-card border border-border/50 px-3 py-2 text-xs transition-colors hover:bg-accent"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground">{room.title}</span>
                    <span className="block text-[11px] text-muted-foreground">
                      Code {room.code} · max {room.maxParticipants} pers.
                    </span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}