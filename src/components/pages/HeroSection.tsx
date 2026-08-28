import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, KeyRound, Lock, ShieldCheck, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE, SITE_LINK } from "@/data/site";
import { findRoom } from "@/lib/meet-data";
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
          <a
            href={SITE_LINK.landingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Video className="h-3.5 w-3.5 text-primary" />
            Salons Virtuels de {SITE.name}
          </a>

          <h1 className="mt-7 text-balance text-4xl font-extralight leading-[1.08] tracking-tight sm:text-6xl">
            Collaborez avec <span className="font-black">{SITE.name}</span><br />
            en <span className="text-primary">direct.</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Une plateforme simple pour vos réunions, formations et rendez-vous professionnels en visioconférence.
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

          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-success" />
            Salons protégés & chiffrés
          </div>
        </div>

        {/* COLONNE DROITE : Preview Illustration */}
        <div className="w-full flex justify-center lg:justify-end">
          <MeetPreviewIllustration />
        </div>
      </div>
    </section>
  );
}