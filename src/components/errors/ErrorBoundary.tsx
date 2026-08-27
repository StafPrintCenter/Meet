import { useRouter, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home, MicOff, WifiOff } from "lucide-react";
import { reportError } from "@/lib/error/reporting";
import { SITE } from "@/data/site";

export function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Critical Meet Exception:", error);

  useEffect(() => {
    reportError?.(error, { boundary: "meet_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 md:p-12 select-none">
      <div className="grid w-full max-w-4xl gap-8 items-center md:grid-cols-12 md:gap-16">

        {/* Colonne Gauche : Visuel de coupure média */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-60 md:min-h-75">
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="absolute h-44 w-44 rounded-full bg-destructive/10 blur-3xl" />

            {/* Boîte de statut WebRTC / Serveur en échec */}
            <div className="relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl bg-destructive/5 border border-destructive/20 text-destructive shadow-lg">
              <div className="flex items-center gap-3">
                <WifiOff className="h-8 w-8 animate-pulse" />
                <MicOff className="h-8 w-8" />
              </div>
              <AlertCircle className="h-10 w-10 text-destructive/80" strokeWidth={1.5} />
            </div>
          </div>

          <span className="absolute bottom-0 px-3 py-1 text-xs font-mono font-bold tracking-widest text-destructive bg-destructive/10 border border-destructive/20 rounded-full">
            WEBRTC_STREAM_FAILURE
          </span>
        </div>

        {/* Colonne Droite : Explications & Boutons de relance */}
        <div className="md:col-span-7 text-center md:text-left flex flex-col justify-center">
          <div className="inline-flex mx-auto md:mx-0 items-center gap-1.5 px-3 py-1 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-full w-fit">
            <span className="flex h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
            Connexion au serveur interrompue
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Signal média perdu.
          </h1>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-lg">
            Une erreur critique est survenue lors de l'initialisation du canal audio/vidéo sur {SITE.name}. La session WebRTC n'a pas pu être établie.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start w-full">
            <button
              onClick={() => {
                useRouter().invalidate();
                reset();
              }}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/10 transition hover:opacity-90 active:scale-95 cursor-pointer"
            >
              <RefreshCw size={16} />
              Reconnecter le flux
            </button>
            <Link
              to="/"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-95 cursor-pointer"
            >
              <Home size={16} />
              Quitter la réunion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}