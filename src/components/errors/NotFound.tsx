import { Link } from "@tanstack/react-router";
import { UserX, MicOff, VideoOff, PhoneOff, Compass, ArrowLeft } from "lucide-react";

export function NotFoundComponent() {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 select-none overflow-hidden font-sans">

      {/* En-tête : Simulation de la barre de statut de la visio */}
      <header className="w-full flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-rose-500 animate-ping" />
          <span className="font-mono text-xs text-rose-400 uppercase tracking-widest">
            SALON_INCONNU // 404
          </span>
        </div>
        <div className="text-xs font-mono text-slate-500">
          ROOM_ID: <span className="text-slate-400 line-through">XXX-XXXX-XXX</span>
        </div>
      </header>

      {/* Grille de visioconférence vide (Artificielle) */}
      <main className="relative my-auto w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 py-8">

        {/* Tuile Participant 1 - Inexistant */}
        <div className="relative aspect-video rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="h-16 w-16 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-600 mb-3 border border-slate-700/50">
            <UserX className="h-8 w-8" />
          </div>
          <p className="text-xs font-mono text-slate-500">Participant introuvable</p>
        </div>

        {/* Tuile Participant 2 - Signal Perdu */}
        <div className="hidden md:flex relative aspect-video rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex-col items-center justify-center p-6 text-center">
          <div className="h-16 w-16 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-600 mb-3 border border-slate-700/50">
            <VideoOff className="h-8 w-8 text-slate-600" />
          </div>
          <p className="text-xs font-mono text-slate-500">Flux vidéo désactivé</p>
        </div>

        {/* Overlay d'Anomalie Central (Effet HUD / Carte d'Alerte) */}
        <div className="absolute inset-0 m-auto max-w-md h-fit rounded-3xl border border-rose-500/30 bg-slate-950/90 p-6 md:p-8 shadow-2xl backdrop-blur-xl text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            CODE DE RÉUNION INVALIDE
          </span>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Personne au bout de la ligne.
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            La réunion que vous tentez de rejoindre n'existe pas ou a déjà pris fin. Vérifiez l'URL de votre invitation.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-200 transition active:scale-95"
            >
              <Compass className="h-4 w-4" />
              Rejoindre le Lobby
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
          </div>
        </div>
      </main>

      {/* Barre de contrôle fictive en bas (Inspirée de Meet/Zoom) */}
      <footer className="w-full max-w-md mx-auto flex items-center justify-center gap-4 p-3 rounded-full border border-slate-800/80 bg-slate-900/60 backdrop-blur-md opacity-60 pointer-events-none">
        <div className="p-3 rounded-full bg-slate-800 text-slate-500">
          <MicOff className="h-5 w-5" />
        </div>
        <div className="p-3 rounded-full bg-slate-800 text-slate-500">
          <VideoOff className="h-5 w-5" />
        </div>
        <div className="p-3 rounded-full bg-rose-600 text-white">
          <PhoneOff className="h-5 w-5" />
        </div>
      </footer>
    </div>
  );
}