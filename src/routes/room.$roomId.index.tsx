import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Download,
  NotebookPen,
  Hand,
  Lock,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  MonitorX,
  MoreVertical,
  PhoneOff,
  Send,
  Settings2,
  Smile,
  Unlock,
  UserMinus,
  Users,
  Video as VideoIcon,
  VideoOff,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VideoTile } from "@/components/meet/VideoTile";
import { useLocalMedia } from "@/hooks/useLocalMedia";
import {
  findRoom,
  formatDuration,
  initials,
  roleLabel,
  uid,
  type ChatMessage,
  type Participant,
} from "@/lib/meet-data";
import { isStafEmail, readIdentity } from "@/lib/meet-session";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/room/$roomId/")({
  head: () => ({
    meta: [
      { title: "Salon SPC Meet — STAF PRINT CENTER" },
      { name: "description", content: "Salle de visioconférence SPC Meet de STAF PRINT CENTER." },
      { property: "og:title", content: "Salon SPC Meet" },
      { property: "og:description", content: "Visioconférence SPC Meet de STAF PRINT CENTER." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RoomPage,
});

const REACTIONS = ["👍", "👏", "🎉", "😄", "🤝", "🔥"];

function RoomPage() {
  const { roomId } = Route.useParams();
  const navigate = useNavigate();
  const base = useMemo(() => findRoom(roomId), [roomId]);

  const media = useLocalMedia();
  const [identityChecked, setIdentityChecked] = useState(false);
  const [displayName, setDisplayName] = useState("Invité SPC");
  const [isHost, setIsHost] = useState(false);

  const [participants, setParticipants] = useState<Participant[]>(base ? base.participants : []);
  const [chat, setChat] = useState<ChatMessage[]>(base ? base.chat : []);
  const [panel, setPanel] = useState<"chat" | "people" | "notes" | "settings" | null>(null);
  const [handRaised, setHandRaised] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareStream, setShareStream] = useState<MediaStream | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [locked, setLocked] = useState(base?.locked ?? false);
  const [allowInvites, setAllowInvites] = useState(base?.allowGuestInvites ?? false);
  const [maxParticipants, setMaxParticipants] = useState(base?.maxParticipants ?? 20);
  const [draft, setDraft] = useState("");
  const [reaction, setReaction] = useState<{ emoji: string; key: string } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const knownHandsRef = useRef<Set<string>>(new Set());

  // Bloc-notes local persistant (aucune IA, stockage navigateur uniquement)
  const notesKey = `spc-meet-notes-${roomId}`;
  useEffect(() => {
    try {
      setNotes(window.localStorage.getItem(notesKey) ?? "");
    } catch {
      /* stockage indisponible */
    }
  }, [notesKey]);
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(notesKey, notes);
        setNotesSaved(true);
      } catch {
        /* ignore */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [notes, notesKey]);

  // Notification visible dès qu'un participant lève la main
  useEffect(() => {
    const raised = participants.filter((p) => p.handRaised);
    const ids = new Set(raised.map((p) => p.id));
    for (const p of raised) {
      if (!knownHandsRef.current.has(p.id)) {
        toast.warning(`${p.name} lève la main`, {
          description: "Donnez-lui la parole ou baissez sa main depuis les participants.",
          duration: 6000,
        });
      }
    }
    knownHandsRef.current = ids;
  }, [participants]);

  useEffect(() => {
    const saved = readIdentity();
    if (!saved && base) {
      navigate({ to: "/room/$roomId/lobby", params: { roomId: base.id }, replace: true });
      return;
    }
    if (saved) {
      setDisplayName(saved.displayName);
      setIsHost(Boolean(saved.email && isStafEmail(saved.email)) || Boolean(base?.demo));
      media.setMic(saved.micOn);
      media.setCam(saved.camOn);
    }
    setIdentityChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base?.id]);

  // Chronomètre de session
  useEffect(() => {
    const started = Date.now();
    const t = setInterval(() => setElapsed(Date.now() - started), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulation d'activité des membres (parole, main levée, messages)
  useEffect(() => {
    if (participants.length === 0) return;
    const speak = setInterval(() => {
      setParticipants((prev) => {
        if (prev.length === 0) return prev;
        const idx = Math.floor(Math.random() * prev.length);
        return prev.map((p, i) => ({ ...p, speaking: i === idx && p.micOn }));
      });
    }, 3200);
    const hands = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p, i) =>
          i === Math.floor(Math.random() * prev.length) ? { ...p, handRaised: !p.handRaised } : p,
        ),
      );
    }, 14000);
    const chatter = setInterval(() => {
      const lines = [
        "Je vois bien l'écran partagé ✅",
        "On peut revenir sur la slide précédente ?",
        "Le fichier d'impression est en 300 dpi.",
        "Parfait, merci !",
        "Petit souci de réseau chez moi, je reviens.",
      ];
      setParticipants((prev) => {
        if (prev.length === 0) return prev;
        const author = prev[Math.floor(Math.random() * prev.length)]!;
        const body = lines[Math.floor(Math.random() * lines.length)]!;
        setChat((c) => [...c, { id: uid("msg"), author: author.name, body, at: Date.now() }]);
        return prev;
      });
    }, 17000);
    return () => {
      clearInterval(speak);
      clearInterval(hands);
      clearInterval(chatter);
    };
  }, [participants.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ block: "end" });
  }, [chat.length, panel]);

  useEffect(() => {
    if (!reaction) return;
    const t = setTimeout(() => setReaction(null), 2200);
    return () => clearTimeout(t);
  }, [reaction]);

  const stopSharing = useCallback(() => {
    shareStream?.getTracks().forEach((t) => t.stop());
    setShareStream(null);
    setSharing(false);
  }, [shareStream]);

  const startSharing = useCallback(async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      toast.error("Partage d'écran non pris en charge par ce navigateur.");
      return;
    }
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      setShareStream(s);
      setSharing(true);
      s.getVideoTracks()[0]?.addEventListener("ended", () => {
        setShareStream(null);
        setSharing(false);
      });
    } catch {
      /* annulé par l'utilisateur */
    }
  }, []);

  useEffect(() => () => shareStream?.getTracks().forEach((t) => t.stop()), [shareStream]);

  if (!base) {
    return (
      <div className="paper-grid flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-2xl">Salon introuvable ou terminé</h1>
        <Link to="/">
          <Button className="rounded-xl">Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  const self: Participant = {
    id: "self",
    name: displayName,
    role: isHost ? "host" : "guest",
    micOn: media.micOn,
    camOn: media.camOn,
    handRaised,
    speaking: media.micOn && media.level > 0.12,
    simulated: false,
  };

  const all = [self, ...participants];
  const raisedHands = all.filter((p) => p.handRaised);
  const shortLink = `go.stafprint.com/r/${base.id}`;
  const remaining = Math.max(0, maxParticipants - all.length);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim().slice(0, 500);
    if (!body) return;
    setChat((c) => [...c, { id: uid("msg"), author: displayName, body, at: Date.now() }]);
    setDraft("");
  };

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(`https://${shortLink} — code ${base.code}`);
      toast.success("Invitation copiée.");
    } catch {
      toast.error("Copie impossible, sélectionnez le lien manuellement.");
    }
  };

  const toggleOneMic = (id: string) =>
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = !p.micOn;
        toast.success(next ? `Micro de ${p.name} réactivé.` : `Micro de ${p.name} coupé.`);
        return { ...p, micOn: next, speaking: next ? p.speaking : false };
      }),
    );
  const toggleOneCam = (id: string) =>
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = !p.camOn;
        toast.success(next ? `Caméra de ${p.name} réactivée.` : `Caméra de ${p.name} coupée.`);
        return { ...p, camOn: next };
      }),
    );
  const lowerOneHand = (id: string) =>
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, handRaised: false } : p)));
  const kick = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    toast.success("Participant exclu du salon.");
  };

  const gridCols =
    all.length <= 1
      ? "grid-cols-1"
      : all.length <= 2
        ? "grid-cols-1 sm:grid-cols-2"
        : all.length <= 4
          ? "grid-cols-2"
          : all.length <= 9
            ? "grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="flex h-[100dvh] flex-col bg-slate-deep text-primary-foreground">
      {/* En-tête salon */}
      <header className="flex shrink-0 items-center justify-between gap-3 px-3 py-3 sm:px-5">
        <div className="min-w-0">
          <h1 className="truncate font-display text-base tracking-tight sm:text-lg">
            {base.title}
          </h1>
          <p className="truncate text-xs text-primary-foreground/60">
            Code {base.code} · {formatDuration(elapsed)} · {all.length}/{maxParticipants}{" "}
            participants
          </p>
        </div>
        <div className="flex items-center gap-2">
          {locked && (
            <Badge className="rounded-full bg-warning text-slate-deep">
              <Lock className="mr-1 h-3 w-3" /> Verrouillé
            </Badge>
          )}
          {sharing && (
            <Badge className="rounded-full bg-primary text-primary-foreground">Partage actif</Badge>
          )}
        </div>
      </header>

      {/* Scène */}
      <div className="flex min-h-0 flex-1 gap-3 px-3 pb-2 sm:px-5">
        <main className="relative min-h-0 flex-1 overflow-y-auto">
          {sharing && shareStream ? (
            <div className="flex h-full flex-col gap-3">
              <ShareSurface stream={shareStream} />
              <div className="grid shrink-0 grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {all.slice(0, 6).map((p) => (
                  <VideoTile
                    key={p.id}
                    {...p}
                    {...(p.id === "self"
                      ? { stream: media.stream, mirrored: true, isSelf: true }
                      : {})}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className={cn("grid h-full auto-rows-min gap-2 sm:gap-3", gridCols)}>
              {all.map((p) => (
                <VideoTile
                  key={p.id}
                  {...p}
                  {...(p.id === "self"
                    ? { stream: media.stream, mirrored: true, isSelf: true }
                    : {})}
                />
              ))}
            </div>
          )}

          {reaction && (
            <div
              key={reaction.key}
              className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-5xl"
            >
              {reaction.emoji}
            </div>
          )}

          {raisedHands.length > 0 && (
            <div className="pointer-events-none absolute left-1/2 top-2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-warning px-4 py-2 text-xs font-medium text-slate-deep shadow-lg">
              <Hand className="h-4 w-4 animate-bounce" />
              <span className="max-w-[70vw] truncate">
                {raisedHands.length === 1
                  ? `${raisedHands[0]!.name} lève la main`
                  : `${raisedHands.length} mains levées : ${raisedHands.map((p) => p.name).join(", ")}`}
              </span>
            </div>
          )}

          {media.error && (
            <p className="mt-3 rounded-xl bg-destructive/15 px-3 py-2 text-xs text-primary-foreground">
              {media.error}
            </p>
          )}
        </main>

        {panel && (
          <aside className="dark-dock absolute inset-x-3 bottom-24 top-16 z-20 flex flex-col rounded-2xl p-3 sm:static sm:inset-auto sm:z-auto sm:w-80 sm:shrink-0">
            <Tabs
              value={panel}
              onValueChange={(v) => setPanel(v as typeof panel)}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex items-center gap-2">
                <TabsList className="flex-1 bg-slate-soft">
                  <TabsTrigger value="chat" className="flex-1 text-xs">
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="people" className="flex-1 text-xs">
                    Participants
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex-1 text-xs">
                    Notes
                  </TabsTrigger>
                  {isHost && (
                    <TabsTrigger value="settings" className="flex-1 text-xs">
                      Salon
                    </TabsTrigger>
                  )}
                </TabsList>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPanel(null)}
                  className="h-8 w-8 shrink-0 text-primary-foreground hover:bg-slate-soft"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <TabsContent value="chat" className="mt-3 flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                  {chat.map((m) => (
                    <div key={m.id} className="text-sm">
                      <p className="text-[11px] uppercase tracking-wide text-primary-foreground/50">
                        {m.author} ·{" "}
                        {new Date(m.at).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="mt-0.5 rounded-xl bg-slate-soft px-3 py-2 leading-snug">
                        {m.body}
                      </p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={sendMessage} className="mt-3 flex shrink-0 gap-2">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Votre message…"
                    maxLength={500}
                    className="h-10 rounded-xl border-white/15 bg-slate-soft text-primary-foreground placeholder:text-primary-foreground/40"
                  />
                  <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-xl">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="people" className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                <ul className="space-y-1.5">
                  {all.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 rounded-xl bg-slate-soft px-2.5 py-2"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-deep text-xs">
                        {initials(p.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">
                          {p.id === "self" ? `${p.name} (vous)` : p.name}
                        </span>
                        <span className="block text-[11px] text-primary-foreground/50">
                          {roleLabel[p.role]}
                        </span>
                      </span>
                      {p.handRaised && <Hand className="h-3.5 w-3.5 shrink-0 text-warning" />}
                      {!p.micOn && <MicOff className="h-3.5 w-3.5 shrink-0 text-destructive" />}
                      {isHost && p.id !== "self" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-primary-foreground hover:bg-slate-deep"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toggleOneMic(p.id)}>
                              {p.micOn ? "Couper le micro" : "Réactiver le micro"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleOneCam(p.id)}>
                              {p.camOn ? "Couper la caméra" : "Réactiver la caméra"}
                            </DropdownMenuItem>
                            {p.handRaised && (
                              <DropdownMenuItem onClick={() => lowerOneHand(p.id)}>
                                Baisser la main
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => kick(p.id)}
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Exclure du salon
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="notes" className="mt-3 flex min-h-0 flex-1 flex-col">
                <p className="text-[11px] text-primary-foreground/60">
                  Prise de notes privée, enregistrée sur cet appareil uniquement.
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setNotesSaved(false);
                  }}
                  placeholder={"Points clés, décisions, actions à suivre…"}
                  className="mt-2 min-h-0 flex-1 resize-none rounded-xl border border-white/15 bg-slate-soft p-3 text-sm leading-relaxed text-primary-foreground outline-none placeholder:text-primary-foreground/40 focus:border-primary"
                />
                <div className="mt-2 flex shrink-0 items-center gap-2">
                  <span className="flex-1 text-[11px] text-primary-foreground/50">
                    {notesSaved ? "Enregistré" : "Modification en cours…"} · {notes.length} car.
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => {
                      const stamp = new Date().toLocaleString("fr-FR");
                      setNotes((n) => `${n}${n && !n.endsWith("\n") ? "\n" : ""}[${stamp}] `);
                    }}
                  >
                    Horodater
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => {
                      const blob = new Blob([`${base.title}\n\n${notes}`], {
                        type: "text/plain;charset=utf-8",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `notes-${base.id}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success("Notes exportées.");
                    }}
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Exporter
                  </Button>
                </div>
              </TabsContent>


              {isHost && (
                <TabsContent
                  value="settings"
                  className="mt-3 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1"
                >
                  <div>
                    <Label className="text-xs text-primary-foreground/70">
                      Participants maximum : {maxParticipants}
                    </Label>
                    <Slider
                      value={[maxParticipants]}
                      min={2}
                      max={50}
                      step={1}
                      onValueChange={([v]) => setMaxParticipants(v ?? 2)}
                      className="mt-3"
                    />
                    <p className="mt-2 text-[11px] text-primary-foreground/50">
                      {remaining} place(s) restante(s).
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xs text-primary-foreground/70">
                      Verrouiller le salon
                    </Label>
                    <Switch checked={locked} onCheckedChange={setLocked} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xs text-primary-foreground/70">
                      Autoriser les participants à inviter
                    </Label>
                    <Switch checked={allowInvites} onCheckedChange={setAllowInvites} />
                  </div>
                  <div className="rounded-xl bg-slate-soft p-3 text-[11px] text-primary-foreground/60">
                    Accès :{" "}
                    {base.accessMode === "open"
                      ? "libre par lien / code"
                      : base.accessMode === "whitelist"
                        ? "liste blanche email"
                        : "personnel STAF PRINT uniquement"}
                    {base.lobbyEnabled ? " · salle d'attente active" : ""}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </aside>
        )}
      </div>

      {/* Dock de contrôle */}
      <footer className="shrink-0 px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="dark-dock mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-1.5 rounded-2xl p-2 sm:gap-2">
          <DockButton
            active={media.micOn}
            danger={!media.micOn}
            onClick={media.toggleMic}
            label="Micro"
          >
            {media.micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </DockButton>
          <DockButton
            active={media.camOn}
            danger={!media.camOn}
            onClick={media.toggleCam}
            label="Caméra"
          >
            {media.camOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </DockButton>
          <DockButton
            active={sharing}
            onClick={sharing ? stopSharing : startSharing}
            label="Partager"
          >
            {sharing ? <MonitorX className="h-5 w-5" /> : <MonitorUp className="h-5 w-5" />}
          </DockButton>
          <DockButton
            active={handRaised}
            onClick={() => {
              setHandRaised((v) => {
                const next = !v;
                if (next) toast.info("Vous avez levé la main — l'hôte est notifié.");
                return next;
              });
            }}
            label="Main"
          >
            <Hand className="h-5 w-5" />
          </DockButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Réactions"
                className="grid h-11 w-11 place-items-center rounded-xl bg-slate-soft text-primary-foreground transition-colors hover:bg-slate-soft/70"
              >
                <Smile className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="flex gap-1 p-1.5">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="rounded-lg px-2 py-1 text-xl transition-colors hover:bg-accent"
                  onClick={() => setReaction({ emoji, key: uid("r") })}
                >
                  {emoji}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(isHost || allowInvites) && (
            <DockButton onClick={() => setInviteOpen(true)} label="Inviter">
              <UserPlus className="h-5 w-5" />
            </DockButton>
          )}

          <span className="mx-1 hidden h-8 w-px bg-white/10 sm:block" />

          <DockButton
            active={panel === "chat"}
            onClick={() => setPanel(panel === "chat" ? null : "chat")}
            label="Chat"
          >
            <MessageSquare className="h-5 w-5" />
          </DockButton>
          <DockButton
            active={panel === "people"}
            onClick={() => setPanel(panel === "people" ? null : "people")}
            label="Participants"
          >
            <Users className="h-5 w-5" />
          </DockButton>
          <DockButton
            active={panel === "notes"}
            onClick={() => setPanel(panel === "notes" ? null : "notes")}
            label="Notes"
          >
            <NotebookPen className="h-5 w-5" />
          </DockButton>
          {isHost && (
            <DockButton
              active={panel === "settings"}
              onClick={() => setPanel(panel === "settings" ? null : "settings")}
              label="Paramètres"
            >
              <Settings2 className="h-5 w-5" />
            </DockButton>
          )}

          <Button
            variant="destructive"
            onClick={() => navigate({ to: "/" })}
            className="h-11 rounded-xl px-4"
            disabled={!identityChecked}
          >
            <PhoneOff className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline">Quitter</span>
          </Button>
        </div>
      </footer>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Inviter dans « {base.title} »</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Lien court</Label>
              <div className="mt-1.5 flex gap-2">
                <Input readOnly value={`https://${shortLink}`} className="h-10 rounded-xl" />
                <Button size="icon" className="h-10 w-10 shrink-0 rounded-xl" onClick={copyInvite}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-border p-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`https://${shortLink}`)}`}
                alt={`QR code du salon ${base.title}`}
                width={110}
                height={110}
                loading="lazy"
                className="rounded-lg bg-card"
              />
              <div className="text-sm">
                <p className="font-display text-2xl tracking-tight">{base.code}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {remaining} place(s) restante(s) sur {maxParticipants}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  {locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                  {locked ? "Salon verrouillé" : "Salon ouvert"}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DockButton({
  children,
  onClick,
  active,
  danger,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "grid h-11 w-11 place-items-center rounded-xl transition-colors",
        danger
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          : active
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-slate-soft text-primary-foreground hover:bg-slate-soft/70",
      )}
    >
      {children}
    </button>
  );
}

function ShareSurface({ stream }: { stream: MediaStream }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.srcObject !== stream) {
      el.srcObject = stream;
      el.play().catch(() => {});
    }
  }, [stream]);
  return (
    <div className="min-h-0 flex-1 overflow-hidden rounded-2xl bg-black">
      <video ref={ref} autoPlay playsInline muted className="h-full w-full object-contain" />
    </div>
  );
}
