import { Link } from "@tanstack/react-router";
import { UserX, MicOff, VideoOff, PhoneOff, ArrowLeft, Home, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-4 md:p-8 select-none paper-grid bg-background text-foreground">

      {/* Barre de statut supérieure de la réunion */}
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between rounded-xl border border-border/80 bg-card/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-destructive">
            SALON_INCONNU // 404
          </span>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          ROOM_ID: <span className="line-through opacity-70">XXX-XXXX-XXX</span>
        </div>
      </header>

      {/* Grille d'appel vidéo vacante */}
      <main className="relative z-10 my-auto mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 py-8 md:grid-cols-2">

        {/* Slot Participant 1 */}
        <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-border bg-card/40 p-6 text-center backdrop-blur-sm">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
            <UserX className="h-6 w-6" />
          </div>
          <p className="font-mono text-xs text-muted-foreground">Participant introuvable</p>
        </div>

        {/* Slot Participant 2 */}
        <div className="hidden relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-border bg-card/40 p-6 text-center backdrop-blur-sm md:flex">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
            <VideoOff className="h-6 w-6" />
          </div>
          <p className="font-mono text-xs text-muted-foreground">Flux vidéo absent</p>
        </div>

        {/* Carte Overlay centrale */}
        <div className="absolute inset-0 m-auto flex h-fit max-w-md flex-col items-center rounded-3xl surface-card p-6 text-center backdrop-blur-xl md:p-8">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 font-mono text-xs font-semibold text-destructive">
            <Radio className="h-3.5 w-3.5" />
            CODE DE RÉUNION INVALIDE
          </div>

          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Personne au bout du fil.
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            La réunion que vous tentez de rejoindre n'existe pas ou le salon a déjà été fermé par l'hôte.
          </p>

          <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-1/2">
              <Link to="/">
                <Home className="mr-1.5 h-4 w-4" />
                Accueil
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-1/2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Retour
            </Button>
          </div>
        </div>
      </main>

      {/* Barre de contrôle désactivée (Dock STAF) */}
      <footer className="relative z-10 mx-auto flex items-center justify-center gap-3 rounded-full dark-dock px-4 py-2.5 opacity-60 pointer-events-none">
        <div className="rounded-full bg-slate-soft p-2.5 text-muted-foreground">
          <MicOff className="h-4 w-4" />
        </div>
        <div className="rounded-full bg-slate-soft p-2.5 text-muted-foreground">
          <VideoOff className="h-4 w-4" />
        </div>
        <div className="rounded-full bg-destructive p-2.5 text-destructive-foreground">
          <PhoneOff className="h-4 w-4" />
        </div>
      </footer>
    </div>
  );
}