import { useRouter, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { WifiOff, RefreshCw, LogOut, Terminal, AlertTriangle } from "lucide-react";
import { reportError } from "@/lib/error/reporting";

export function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    reportError?.(error, { boundary: "meet_glitch_error_component" });
  }, [error]);

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-between p-4 md:p-8 select-none font-sans overflow-hidden">

      {/* Background avec grain et grilles dynamiques */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top bar */}
      <header className="w-full flex items-center justify-between border-b border-neutral-900 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="font-mono text-xs text-amber-500 font-semibold tracking-wider uppercase">
            SIGNAL_INTERROMPU // 500
          </span>
        </div>
        <span className="text-xs font-mono text-neutral-600">ERR_WEBRTC_SOCKET_CLOSED</span>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 my-auto w-full max-w-xl mx-auto">
        <div className="rounded-3xl border border-neutral-800/80 bg-neutral-900/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-6">

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white tracking-tight">
                Flux vidéo interrompu
              </h1>
              <p className="text-sm text-neutral-400">
                Impossible de maintenir le canal de communication bidirectionnel.
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <WifiOff className="h-6 w-6 animate-pulse" />
            </div>
          </div>

          {/* Console d'erreur interactive */}
          <div className="rounded-2xl bg-black/60 p-4 border border-neutral-800/80 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-neutral-500 border-b border-neutral-800 pb-2">
              <Terminal className="h-3.5 w-3.5 text-rose-400" />
              <span>Diagnostic réseau</span>
            </div>
            <p className="text-rose-400 font-semibold">{error?.name || "NetworkError"}</p>
            <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap">
              {error?.message || "La connexion aux serveurs de visioconférence a été perdue inopinément."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition active:scale-95 shadow-lg shadow-rose-600/20 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Rétablir le flux
            </button>
            <Link
              to="/"
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-neutral-800 bg-neutral-800/50 hover:bg-neutral-800 text-neutral-300 font-semibold text-sm transition active:scale-95 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Quitter la salle
            </Link>
          </div>

        </div>
      </main>

      {/* Bottom Status */}
      <footer className="w-full text-center relative z-10">
        <p className="text-[11px] font-mono text-neutral-600">
          Tentative de reconnexion automatique suspendue • Code d'état : 500
        </p>
      </footer>
    </div>
  );
}