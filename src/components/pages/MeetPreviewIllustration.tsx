import { Mic, MicOff, Video, ShieldCheck, Users, MonitorUp, PhoneOff, Hd } from "lucide-react";

export function MeetPreviewIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md min-w-0 lg:mx-0 lg:max-w-none">
      {/* Halo lumineux de fond */}
      <div className="absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl" />

      <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* En-tête du mock */}
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-medium text-foreground">Salon #408-912</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
            <ShieldCheck className="h-3 w-3" /> Chiffré
          </span>
        </div>

        {/* Grille vidéo */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-background/40">
          {/* Participant 1 - Hôte */}
          <div className="relative aspect-video rounded-xl border border-border bg-muted flex flex-col items-center justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs shadow-sm">
              S
            </div>
            <span className="mt-1 text-[10px] text-muted-foreground">STAF PRINT</span>
          </div>

          {/* Participant 2 */}
          <div className="relative aspect-video rounded-xl border border-border bg-muted/60 flex flex-col items-center justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xs">
              P
            </div>
            <span className="mt-1 text-[10px] text-muted-foreground">Participant (Vous)</span>
            <div className="absolute bottom-1.5 right-1.5 rounded-full bg-destructive p-1 text-white">
              <MicOff className="h-2.5 w-2.5" />
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex items-center justify-between border-t border-border bg-card px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-foreground">
              <Mic className="h-3.5 w-3.5" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-foreground">
              <Video className="h-3.5 w-3.5" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-foreground">
              <MonitorUp className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono">8</span> |
            <Hd className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-[10px]">1080p</span>
          </div>

          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive text-destructive-foreground">
            <PhoneOff className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}