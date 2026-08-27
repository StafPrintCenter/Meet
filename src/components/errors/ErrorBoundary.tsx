import { useRouter, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { WifiOff, RefreshCw, Home, Terminal, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/error/reporting";

export function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    reportError?.(error, { boundary: "spc_meet_root_error" });
  }, [error]);

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-4 md:p-8 select-none paper-grid bg-background text-foreground">

      {/* Top Bar d'anomalie */}
      <header className="relative z-10 mx-auto flex w-full max-w-xl items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-strong" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-strong">
            SIGNAL_INTERROMPU // 500
          </span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">ERR_WEBRTC_CRITICAL</span>
      </header>

      {/* Main Container */}
      <main className="relative z-10 my-auto mx-auto w-full max-w-xl">
        <div className="surface-card rounded-3xl p-6 md:p-8 backdrop-blur-xl">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                Signal média perdu.
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Une rupture critique a interrompu la liaison audio/vidéo avec nos serveurs.
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-accent/30 bg-accent text-amber-strong">
              <WifiOff className="h-6 w-6 animate-pulse" />
            </div>
          </div>

          {/* Console d'erreur style STAF */}
          <div className="my-6 rounded-2xl border border-border bg-slate-deep p-4 font-mono text-xs text-sidebar-foreground">
            <div className="mb-2 flex items-center gap-2 border-b border-sidebar-border pb-2 text-muted-foreground">
              <Terminal className="h-3.5 w-3.5 text-amber-accent" />
              <span>Diagnostique du flux</span>
            </div>
            <p className="font-semibold text-amber-accent">{error?.name || "NetworkError"}</p>
            <p className="mt-1 leading-relaxed text-sidebar-foreground/80 whitespace-pre-wrap">
              {error?.message || "Échec d'établissement du canal de transport des paquets RTP/RTCP."}
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-1/2 cursor-pointer"
              onClick={() => {
                router.invalidate();
                reset();
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Rétablir le flux
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-1/2 cursor-pointer">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Quitter le salon
              </Link>
            </Button>
          </div>

        </div>
      </main>

      {/* Pied de page */}
      <footer className="relative z-10 text-center font-mono text-[11px] text-muted-foreground">
        SPC Meet — Système de visio STAF PRINT CENTER
      </footer>
    </div>
  );
}