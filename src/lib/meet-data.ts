export type Role = "host" | "staff" | "trainer" | "guest";

export type AccessMode = "open" | "whitelist" | "staff";

export type Participant = {
  id: string;
  name: string;
  role: Role;
  micOn: boolean;
  camOn: boolean;
  handRaised: boolean;
  speaking: boolean;
  simulated: boolean;
};

export type ChatMessage = {
  id: string;
  author: string;
  body: string;
  at: number;
  system?: boolean;
};

export type Room = {
  id: string;
  code: string;
  title: string;
  hostName: string;
  kind: "Réunion d'équipe" | "Cours LMS" | "RDV client" | "Atelier";
  accessMode: AccessMode;
  whitelist: string[];
  maxParticipants: number;
  lobbyEnabled: boolean;
  locked: boolean;
  allowGuestInvites: boolean;
  status: "live" | "scheduled" | "ended";
  startedAt: number;
  demo: boolean;
  participants: Participant[];
  chat: ChatMessage[];
};

const NAMES = [
  ["Adjovi Kponou", "staff"],
  ["Rachid Bello", "trainer"],
  ["Mireille Sossou", "staff"],
  ["Karim Toure", "guest"],
  ["Estelle Dagba", "guest"],
  ["Boris Amoussou", "staff"],
  ["Nadia Lawson", "guest"],
] as const;

let seq = 0;
export const uid = (p = "id") => `${p}-${Date.now().toString(36)}-${(seq++).toString(36)}`;

function simParticipants(count: number, offset = 0): Participant[] {
  return Array.from({ length: count }, (_, i) => {
    const entry = NAMES[(i + offset) % NAMES.length]!;
    const name: string = entry[0];
    const role: string = entry[1];
    return {
      id: `sim-${offset}-${i}`,
      name,
      role: role as Role,
      micOn: i % 3 !== 0,
      camOn: i % 4 !== 3,
      handRaised: false,
      speaking: false,
      simulated: true,
    };
  });
}

function room(
  partial: Partial<Room> & Pick<Room, "id" | "code" | "title" | "hostName" | "kind">,
): Room {
  return {
    accessMode: "open",
    whitelist: [],
    maxParticipants: 20,
    lobbyEnabled: false,
    locked: false,
    allowGuestInvites: false,
    status: "live",
    startedAt: Date.now() - 1000 * 60 * 12,
    demo: false,
    participants: [],
    chat: [],
    ...partial,
  };
}

/** Salons de démonstration en libre accès (tests). */
export const DEMO_ROOMS: Room[] = [
  room({
    id: "demo-atelier",
    code: "123-456",
    title: "Atelier Impression Grand Format",
    hostName: "Rachid Bello",
    kind: "Atelier",
    demo: true,
    maxParticipants: 20,
    participants: simParticipants(4, 0),
    chat: [
      {
        id: "c1",
        author: "Rachid Bello",
        body: "Bienvenue à l'atelier SPC Meet 👋",
        at: Date.now() - 400000,
      },
      {
        id: "c2",
        author: "Mireille Sossou",
        body: "Le partage d'écran est prêt de mon côté.",
        at: Date.now() - 200000,
      },
    ],
  }),
  room({
    id: "demo-cours",
    code: "789-012",
    title: "Cours LMS — PAO & Colorimétrie",
    hostName: "Estelle Dagba",
    kind: "Cours LMS",
    demo: true,
    lobbyEnabled: true,
    maxParticipants: 30,
    participants: simParticipants(6, 2),
    chat: [
      {
        id: "c3",
        author: "Estelle Dagba",
        body: "On démarre dans 2 minutes.",
        at: Date.now() - 90000,
      },
    ],
  }),
  room({
    id: "demo-rdv",
    code: "345-678",
    title: "RDV Client — Devis Signalétique",
    hostName: "Adjovi Kponou",
    kind: "RDV client",
    demo: true,
    maxParticipants: 2,
    allowGuestInvites: false,
    participants: simParticipants(1, 5),
  }),
];

/** Salons internes (visibles uniquement en supervision admin). */
export const INTERNAL_ROOMS: Room[] = [
  room({
    id: "spc-direction",
    code: "901-234",
    title: "Comité de direction — Arbitrage projets",
    hostName: "Super-Admin SPC",
    kind: "Réunion d'équipe",
    accessMode: "staff",
    maxParticipants: 12,
    participants: simParticipants(5, 1),
  }),
  room({
    id: "spc-prod",
    code: "567-890",
    title: "Revue production hebdo",
    hostName: "Boris Amoussou",
    kind: "Réunion d'équipe",
    accessMode: "whitelist",
    whitelist: ["prod@stafprint.com", "atelier@stafprint.com"],
    status: "scheduled",
    startedAt: Date.now() + 1000 * 60 * 45,
    maxParticipants: 8,
    participants: [],
  }),
];

export const ALL_ROOMS = [...DEMO_ROOMS, ...INTERNAL_ROOMS];

export const normalizeCode = (raw: string) => raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

export function findRoom(idOrCode: string): Room | undefined {
  const norm = normalizeCode(idOrCode);
  return ALL_ROOMS.find(
    (r) => r.id === idOrCode || normalizeCode(r.code) === norm || normalizeCode(r.id) === norm,
  );
}

export const formatDuration = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
};

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]!.toUpperCase())
    .join("");

export const roleLabel: Record<Role, string> = {
  host: "Hôte",
  staff: "Staff SPC",
  trainer: "Formateur",
  guest: "Invité",
};
