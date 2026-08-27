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
    <section className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 lg:py-16">
      {/* Grille Principale 2 Colonnes */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-10">

        {/* COLONNE GAUCHE : Badge, Titre, Description, Formulaire & CTA */}
        <div className="flex flex-col items-start text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Video className="h-3.5 w-3.5 text-primary" />
            Visioconférence & Salons Virtuels
          </span>

          <h1 className="mt-6 text-balance font-display text-4xl font-extralight leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Rejoignez <span className="font-bold text-foreground">STAF PRINT CENTER</span> en une <span className="font-black text-primary">visioconférence fluide.</span>
          </h1>

          <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Accédez instantanément à vos réunions, formations et sessions de travail en ligne. Une connexion sécurisée par code d'accès, une haute qualité audio/vidéo et zéro installation requise.
          </p>

          {/* Formulaire de Saisie de Code */}
          <form onSubmit={submit} className="mt-8 w-full rounded-2xl border border-border bg-card p-4 shadow-panel sm:p-5">
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
                className="h-12 flex-1 rounded-xl text-center font-display text-xl tracking-[0.2em] sm:text-left"
              />
              <Button type="submit" size="lg" className="h-12 rounded-xl px-6 w-full sm:w-auto">
                Rejoindre
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions secondaires */}
          <div className="mt-5 flex flex-col items-start gap-3 w-full sm:flex-row sm:items-center">
            <Link to="/admin/meet" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="h-11 rounded-xl w-full sm:w-auto bg-card">
                <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                Espace Staff & Formateurs
              </Button>
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-emerald-500" />
              Salons protégés & chiffrés
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : Uniquement la Preview Illustration */}
        <div className="w-full flex justify-center lg:justify-end">
          <MeetPreviewIllustration />
        </div>
      </div>

      {/* SECTION DU BAS : Salons de démonstration (Excentrés de la grille) */}
      <div className="w-full rounded-2xl border border-dashed border-border bg-card/40 p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Video className="h-3.5 w-3.5 text-primary" />
            Salons de démonstration publics
          </p>
          <span className="text-[11px] text-muted-foreground">Accès direct sans code requis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEMO_ROOMS.map((room) => (
            <Link
              key={room.id}
              to="/room/$roomId/lobby"
              params={{ roomId: room.id }}
              className="group flex items-center justify-between gap-3 rounded-xl bg-card border border-border/60 p-3 text-xs transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <div className="min-w-0">
                <span className="block truncate font-semibold text-foreground">{room.title}</span>
                <span className="block text-[11px] text-muted-foreground mt-0.5">
                  Code: <code className="font-mono text-primary">{room.code}</code> · {room.maxParticipants} pers.
                </span>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}