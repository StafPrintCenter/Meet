import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Mic,
  MicOff,
  ShieldCheck,
  Users,
  Volume2,
  Video as VideoIcon,
  VideoOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SpcLogo } from "@/components/spc/Brand";
import { VideoTile } from "@/components/meet/VideoTile";
import { useLocalMedia } from "@/hooks/useLocalMedia";
import { findRoom } from "@/lib/meet-data";
import { isStafEmail, readIdentity, writeIdentity } from "@/lib/meet-session";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/room/$roomId/lobby")({
  head: () => ({
    meta: [
      { title: "Salle d'attente — SPC Meet" },
      {
        name: "description",
        content: "Vérifiez votre caméra et votre micro avant de rejoindre votre réunion SPC Meet.",
      },
      { property: "og:title", content: "Salle d'attente — SPC Meet" },
      {
        property: "og:description",
        content: "Test caméra et micro avant d'entrer dans le salon SPC Meet.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Lobby,
});

function Lobby() {
  const { roomId } = Route.useParams();
  const navigate = useNavigate();
  const room = useMemo(() => findRoom(roomId), [roomId]);

  const media = useLocalMedia();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const saved = readIdentity();
    if (saved) {
      setName(saved.displayName);
      if (saved.email) setEmail(saved.email);
    }
  }, []);

  useEffect(() => {
    if (!waiting) return;
    const t = setTimeout(() => {
      setWaiting(false);
      toast.success("L'hôte vous a admis dans le salon.");
      enter();
    }, 2600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waiting]);

  if (!room) {
    return (
      <div className="paper-grid flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h1 className="font-display text-2xl">Salon introuvable</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Ce lien est peut-être expiré ou révoqué. Demandez un nouveau lien d'invitation à votre
          hôte.
        </p>
        <Link to="/">
          <Button variant="outline" className="rounded-xl">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    );
  }

  const full = room.participants.length >= room.maxParticipants;
  const needsEmail = room.accessMode !== "open";

  const enter = () => {
    writeIdentity({
      displayName: name.trim() || "Invité SPC",
      ...(email.trim() ? { email: email.trim() } : {}),
      micOn: media.micOn,
      camOn: media.camOn,
    });
    navigate({ to: "/room/$roomId", params: { roomId: room.id } });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Indiquez votre nom d'affichage pour continuer.");
      return;
    }
    if (room.locked) {
      toast.error("Salon verrouillé par l'hôte.", {
        description: "Aucune nouvelle arrivée n'est acceptée.",
      });
      return;
    }
    if (full) {
      toast.error("Jauge atteinte", {
        description: `Ce salon est limité à ${room.maxParticipants} participants.`,
      });
      return;
    }
    if (needsEmail) {
      const value = email.trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
        toast.error("Adresse email requise pour ce salon.");
        return;
      }
      if (room.accessMode === "staff" && !isStafEmail(value)) {
        toast.error("Accès réservé au personnel STAF PRINT CENTER (@stafprint.com).");
        return;
      }
      if (
        room.accessMode === "whitelist" &&
        !room.whitelist.map((w) => w.toLowerCase()).includes(value)
      ) {
        toast.error("Email non autorisé", {
          description: "Votre adresse n'est pas sur la liste blanche.",
        });
        return;
      }
    }
    if (room.lobbyEnabled) {
      setWaiting(true);
      return;
    }
    enter();
  };

  const accessLabel =
    room.accessMode === "open"
      ? "Accès libre par lien / code"
      : room.accessMode === "whitelist"
        ? "Liste blanche email"
        : "Personnel STAF PRINT uniquement";

  return (
    <div className="paper-grid min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <SpcLogo />
        <Badge variant="secondary" className="rounded-full">
          {room.kind}
        </Badge>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-12 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <VideoTile
            name={name.trim() || "Vous"}
            role="guest"
            micOn={media.micOn}
            camOn={media.camOn}
            stream={media.stream}
            mirrored
            isSelf
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant={media.micOn ? "secondary" : "destructive"}
              onClick={media.toggleMic}
              className="rounded-xl"
            >
              {media.micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              <span className="ml-2">{media.micOn ? "Micro actif" : "Micro coupé"}</span>
            </Button>
            <Button
              variant={media.camOn ? "secondary" : "destructive"}
              onClick={media.toggleCam}
              className="rounded-xl"
            >
              {media.camOn ? <VideoIcon className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              <span className="ml-2">{media.camOn ? "Caméra active" : "Caméra coupée"}</span>
            </Button>

            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
              <Mic className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex h-3 flex-1 items-center gap-1">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-2.5 flex-1 rounded-full transition-colors",
                      media.micOn && media.level * 16 > i ? "bg-primary" : "bg-muted",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {media.error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p>{media.error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 rounded-lg"
                  onClick={media.retry}
                >
                  Réessayer
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="audio-src" className="text-xs text-muted-foreground">
                Microphone
              </Label>
              <select
                id="audio-src"
                value={media.audioDeviceId ?? media.devices.audio[0]?.deviceId ?? ""}
                onChange={(e) => media.setAudioDeviceId(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-input bg-card px-3 text-sm"
              >
                {media.devices.audio.length === 0 && (
                  <option value="">Périphérique par défaut</option>
                )}
                {media.devices.audio.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Micro ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="video-src" className="text-xs text-muted-foreground">
                Caméra
              </Label>
              <select
                id="video-src"
                value={media.videoDeviceId ?? media.devices.video[0]?.deviceId ?? ""}
                onChange={(e) => media.setVideoDeviceId(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-input bg-card px-3 text-sm"
              >
                {media.devices.video.length === 0 && (
                  <option value="">Périphérique par défaut</option>
                )}
                {media.devices.video.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Caméra ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="output-src" className="text-xs text-muted-foreground">
                Sortie audio (haut-parleur)
              </Label>
              <select
                id="output-src"
                value={media.outputDeviceId ?? media.devices.output[0]?.deviceId ?? ""}
                onChange={(e) => media.setOutputDeviceId(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-input bg-card px-3 text-sm"
              >
                {media.devices.output.length === 0 && (
                  <option value="">Sortie système par défaut</option>
                )}
                {media.devices.output.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Sortie ${i + 1}`}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-full rounded-lg"
                onClick={async () => {
                  const ok = await media.testOutput();
                  if (ok) toast.success("Bip de test envoyé sur la sortie sélectionnée.");
                  else toast.error("Test audio impossible sur ce navigateur.");
                }}
              >
                <Volume2 className="mr-2 h-4 w-4" />
                Tester le son
              </Button>
              {!media.supportsOutputSelection && (
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Ce navigateur utilise la sortie audio définie par le système.
                </p>
              )}
            </div>
          </div>

        </section>

        <section className="surface-card h-fit rounded-2xl p-5 sm:p-6">
          <h1 className="font-display text-2xl leading-tight tracking-tight">{room.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hôte : {room.hostName} · Code {room.code}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="rounded-full">
              <ShieldCheck className="mr-1 h-3 w-3" />
              {accessLabel}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              <Users className="mr-1 h-3 w-3" />
              {room.participants.length}/{room.maxParticipants} places
            </Badge>
            {room.lobbyEnabled && (
              <Badge className="rounded-full bg-warning text-slate-deep">
                Salle d'attente active
              </Badge>
            )}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Nom d'affichage</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. Karim Toure"
                className="mt-1.5 h-11 rounded-xl"
                maxLength={60}
              />
            </div>
            {needsEmail && (
              <div>
                <Label htmlFor="email">
                  Email{" "}
                  {room.accessMode === "staff" ? "professionnel (@stafprint.com)" : "autorisé"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom.nom@stafprint.com"
                  className="mt-1.5 h-11 rounded-xl"
                  maxLength={120}
                />
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={waiting || full}
              className="h-12 w-full rounded-xl"
            >
              {waiting
                ? "En attente de validation de l'hôte…"
                : full
                  ? "Salon complet"
                  : "Rejoindre maintenant"}
              {!waiting && !full && <ArrowRight className="ml-1 h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            En rejoignant, vous acceptez les{" "}
            <Link to="/terms" className="underline underline-offset-2 hover:text-foreground">
              conditions d'utilisation
            </Link>{" "}
            et la{" "}
            <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
              politique de confidentialité
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
