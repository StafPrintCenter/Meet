import { useEffect, useRef } from "react";
import { MicOff, Hand, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials, roleLabel, type Role } from "@/lib/meet-data";

type Props = {
  name: string;
  role: Role;
  micOn: boolean;
  camOn: boolean;
  handRaised?: boolean;
  speaking?: boolean;
  stream?: MediaStream | null;
  mirrored?: boolean;
  isSelf?: boolean;
  pinned?: boolean;
  className?: string;
};

/** Tuile vidéo : le <video> garde son srcObject stable pour éviter tout clignotement. */
export function VideoTile({
  name,
  role,
  micOn,
  camOn,
  handRaised,
  speaking,
  stream,
  mirrored,
  isSelf,
  pinned,
  className,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const showVideo = Boolean(stream) && camOn;

  // Réattache le flux à chaque (re)montage de l'élément vidéo :
  // indispensable quand la caméra est coupée puis réactivée.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (stream && el.srcObject !== stream) {
      el.srcObject = stream;
      el.play().catch(() => {});
    }
    if (!stream && el.srcObject) el.srcObject = null;
  }, [stream, showVideo]);

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-soft",
        speaking && "speaking-ring",
        className,
      )}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isSelf}
          className={cn("h-full w-full object-cover", mirrored && "scale-x-[-1]")}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3">
          <div
            className={cn(
              "relative grid h-16 w-16 place-items-center rounded-full bg-slate-soft font-display text-xl text-primary-foreground sm:h-20 sm:w-20 sm:text-2xl",
              speaking && "ring-2 ring-primary",
            )}
          >
            {initials(name)}
            {speaking && (
              <span className="absolute inset-0 animate-ping rounded-full border-2 border-primary/50" />
            )}
          </div>
          <div className="flex h-3 items-end gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={cn(
                  "w-1 rounded-full bg-primary/70 transition-all duration-300",
                  speaking ? "animate-pulse" : "opacity-30",
                )}
                style={{ height: speaking ? `${6 + ((i * 5) % 12)}px` : "4px" }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-slate-deep/90 to-transparent px-3 py-2">
        <span className="truncate text-xs font-medium text-primary-foreground sm:text-sm">
          {isSelf ? `${name} (vous)` : name}
          <span className="ml-2 hidden text-[10px] uppercase tracking-wide text-primary-foreground/60 sm:inline">
            {roleLabel[role]}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {handRaised && <Hand className="h-3.5 w-3.5 text-warning" />}
          {pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
          {!micOn && <MicOff className="h-3.5 w-3.5 text-destructive" />}
        </span>
      </div>
    </div>
  );
}
