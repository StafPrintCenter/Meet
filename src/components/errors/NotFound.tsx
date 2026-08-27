import { Link } from "@tanstack/react-router";
import { VideoOff, Home, ArrowLeft, Radio } from "lucide-react";

export function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 md:p-12 select-none">
      <div className="grid w-full max-w-4xl gap-8 items-center md:grid-cols-12 md:gap-16">

        {/* Colonne Gauche : Caméra coupée & Mire vidéo */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-60 md:min-h-75">
          <div className="relative w-full max-w-xs aspect-video rounded-2xl border border-border/80 bg-black/90 p-4 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
            {/* Effet visuel d'onde et de signal perdu */}
            <div className="absolute inset-0 bg-radial from-destructive/10 via-transparent to-transparent animate-pulse" />

            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive border border-destructive/30">
                <VideoOff className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <span className="font-mono text-xs text-muted-foreground tracking-wider">
                FLUX_VIDEO_ABSENT
              </span>
            </div>

            {/* Lignes de scan style moniteur vidéo */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.8)_51%)] bg-[length:100%_4px]" />
          </div>

          {/* Badge technique sous le flux */}
          <span className="absolute -bottom-3 px-3 py-1 text-[11px] font-mono font-bold tracking-widest text-destructive bg-destructive/10 border border-destructive/20 rounded-full">
            SALON_NON_TROUVE_404
          </span>
        </div>

        {/* Colonne Droite : Explications & Navigation */}
        <div className="md:col-span-7 text-center md:text-left flex flex-col justify-center">
          <div className="inline-flex mx-auto md:mx-0 items-center gap-1.5 px-3 py-1 text-xs font-medium text-muted-foreground bg-muted border border-border/60 rounded-full w-fit">
            <Radio size={12} className="text-destructive animate-pulse" />
            Réunion introuvable
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ce salon n'existe pas.
          </h1>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-lg">
            Le code de réunion est incorrect, le salon a été fermé par l'hôte ou le lien d'invitation a expiré.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
            <Link
              to="/"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90 active:scale-95 cursor-pointer"
            >
              <Home size={16} />
              Retour au lobby
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Page précédente
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}