import { Mic, MicOff, Video, ShieldCheck, Users, MonitorUp, PhoneOff } from "lucide-react";
import { SITE } from "@/data/site";

export function MeetPreviewIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md min-w-0 lg:mx-0 lg:max-w-none">
      {/* Halo lumineux de fond */}
      <div className="absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl" />

      {/* Cadre de l'interface Visioconférence */}
      <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* Barre supérieure du salon */}
        <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span className="font-mono text-xs font-semibold text-foreground">
              Salon #408-912
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
            <ShieldCheck className="h-3 w-3" />
            Chiffré
          </span>
        </div>

        {/* Grille des flux vidéo (Mockup) */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-background/50">
          {/* Participant 1 - Hôte */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs shadow-md">
                ST
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">Hôte (Vous)</span>
            </div>
            <div className="absolute bottom-2 left-2 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm">
              Formateur STAF
            </div>
          </div>

          {/* Participant 2 */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted/80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xs">
                JD
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">Participant</span>
            </div>
            <div className="absolute bottom-2 right-2 rounded-full bg-destructive/80 p-1 text-white">
              <MicOff className="h-2.5 w-2.5" />
            </div>
          </div>
        </div>

        {/* Barre de contrôle multimédia */}
        <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-foreground transition-colors hover:bg-accent/80">
              <Mic className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-foreground transition-colors hover:bg-accent/80">
              <Video className="h-4 w-4" />
            </button>
            <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-foreground transition-colors hover:bg-accent/80">
              <MonitorUp className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-[11px]">8 connectés</span>
          </div>

          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
            <PhoneOff className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Badge d'information sous le mockup */}
      <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 shadow-sm text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Serveurs situés chez {SITE.name}
        </span>
        <span className="font-mono text-[11px]">HD 1080p</span>
      </div>
    </div>
  );
}